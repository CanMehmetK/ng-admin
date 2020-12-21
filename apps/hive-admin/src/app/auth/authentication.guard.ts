import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CredentialsService } from '@hive/auth/credentials.service';



@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements
  CanActivate, CanActivateChild, CanLoad {
  constructor(private router: Router, private credentialsService: CredentialsService) {}

  public CanAccess(url: any): boolean {
    return true;
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.CanAccess(state.url);
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.CanAccess(route.path)) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
