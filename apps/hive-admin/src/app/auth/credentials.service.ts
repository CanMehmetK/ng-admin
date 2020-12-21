/*
 *   @license Hive
 *   (c) 2010-2020 ApplicationHive. http://applicationhive.com
 *   License: GNU LESSER GENERAL PUBLIC LICENSE
 *                Version 3, 29 June 2007
 */

import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

import { ICredentialsModel, IdentityAppModel, LoginModel, ResultViewModelGeneric } from '@hivelib';
import { environment } from '@environments/environment';
import { ResultViewModel } from '@hivelib';
const credentialsKey = 'hivecredentials';

@Injectable({ providedIn: 'root' })
export class CredentialsService {
  currentCredentialsChanged: EventEmitter<any>;
  currentCredentials: ICredentialsModel | null = null;

  constructor(private http: HttpClient) {
    this.currentCredentialsChanged = new EventEmitter();
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this.currentCredentials = JSON.parse(savedCredentials);
      this.currentCredentialsChanged.emit();
    }
  }

  get credentials(): ICredentialsModel | null {
    return this.currentCredentials;
  }

  get Roles(): string[] {
    const tokenSplit = this.credentials?.Token.split('.');
    let tokenDataText: string;
    if (tokenSplit) {
      tokenDataText = tokenSplit[1].replace('-', '+').replace('_', '/');
      const tokenData = JSON.parse(window.atob(tokenDataText));
      return (
        tokenData['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        tokenData['role'] ||
        []
      );
    }
    return [];
  }

  /**
   * Authenticates the user.
   * @ param context The login parameters.
   * @return The user credentials.
   */
  login(loginmodel: LoginModel): Observable<any> {
    console.log('login');
    return this.http.post<ResultViewModelGeneric<ICredentialsModel>>(
      `${environment.SERVER_URL}${environment.LOGIN_URL}`,
      { email: loginmodel.username, password: loginmodel.password }
    ).pipe(
      map(tokenresult => {
        if (!tokenresult || !tokenresult.Data || !tokenresult.Data.Token) {
          return undefined;
        }
        this.setCredentials(tokenresult.Data, loginmodel.remember);
        return tokenresult.Data;
      })
    );
  }

  testLogin(loginmodel: LoginModel) {
    const loginPromise = new Promise<any>((resolve, error) => {
      this.http.get<any>(`${environment.SERVER_URL}/api`)
        .subscribe((response) => {
          let result;
          if (loginmodel.username.startsWith('admin')) {
            result = response.login.admin;
          } else if (loginmodel.username.startsWith('user')) {
            result = response.login.user;
          }
          if (result.Token)
            this.setCredentials(result, loginmodel.remember);
          resolve(result);
        });
    });
    return loginPromise;
  }

  getUserApps(): IdentityAppModel[] {
    return this.credentials.UserMenu.map((m) => {
      return { Start: m.start, Icon: m.icon, Name: m.app };
    });
  }

  /**
   * Logs out the user and clear credentials.
   * @return True if the user was logged out successfully.
   */
  logout(): Observable<boolean> {
    // Customize credentials invalidation here
    this.setCredentials(undefined, false);
    return of(true);
  }

  forgotPass(email: string): Observable<ResultViewModel> {
    return this.http.post<ResultViewModel>('/api/account/reset-password', { Email: email });
  }

  setPass(model: any): Observable<ResultViewModel> {
    return this.http.post<ResultViewModel>('/api/account/set-password', model);
  }

  isAuthenticated(): boolean {
    console.log('isAuthenticated');
    return !!this.credentials;
  }

  setCredentials(credentials?: ICredentialsModel, remember?: boolean) {
    this.currentCredentials = credentials || null;
    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
      storage.setItem('token', credentials.Token);
      this.currentCredentialsChanged.emit();
    } else {
      sessionStorage.removeItem(credentialsKey);
      localStorage.removeItem(credentialsKey);
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
    }
  }

  roleClaimMatch(allowed: string[]): boolean {
    return allowed.filter(n => this.Roles?.indexOf(n) !== -1).length > 0;
  }


}
