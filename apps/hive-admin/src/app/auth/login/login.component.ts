/**
 * @license Hive
 * (c) 2010-2020 ApplicationHive. http://applicationhive.com
 * License: GNU LESSER GENERAL PUBLIC LICENSE
 *              Version 3, 29 June 2007
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { finalize, takeUntil } from 'rxjs/operators';
import { customAnimations } from '../../helper-util/animations';
import { Logger } from '../../services/logger.service';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CredentialsService } from '../credentials.service';
import { HiveConfigService } from '../../services/config.service';
import { ICredentialsModel } from '../../../../../../libs/hivelib/src/lib/identity';
import { environment } from '../../../../../../environments/environment';


const log = new Logger('Login');

@Component({
  selector: 'hive-login',
  templateUrl: './login.component.html',
  animations: customAnimations
})
export class LoginComponent  {
  version: string | null = environment.version;
  error: string | undefined;
  loginForm!: FormGroup;
  forgotPasswordForm!: FormGroup ;
  resetPasswordForm!: FormGroup ;

  state = 'login';
  hide = true;
  hide1 = true;
  hide2 = true;

  production: boolean | false = environment.production;
  testUsers = [
    { email: 'admin@applicationhive.com', pass: 'Admin.123', title: 'Admin' },
    { email: 'user@applicationhive.com', pass: 'User.123', title: 'User' }
  ];
  private unsubscribeAll: Subject<any>;

  constructor(
    private toasterService: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private credentialsService: CredentialsService,
    private hiveConfigService: HiveConfigService
  ) {
    this.unsubscribeAll = new Subject();
    const routeSnap = this.route.snapshot;
    const code = routeSnap.params.code || routeSnap.queryParams['code'];
    const email = routeSnap.params.code || routeSnap.queryParams['email'];
    if (code) {
      this.state = 'reset';
      this.createForm(code, email);
    } else {
      this.createForm(undefined, undefined);
    }
  }



  testLogin(testMail: string, testPassword: string) {
    this.loginForm.controls['username'].setValue(testMail);
    this.loginForm.controls['password'].setValue(testPassword);
    this.credentialsService.testLogin(this.loginForm.value)
      .then((credentials: ICredentialsModel) => {
        console.log('LoggedIn:', credentials);
        if (credentials && credentials.Token) {
          this.credentialsService.setCredentials(credentials);
          this.router.navigate(
            [this.route.snapshot.queryParams.redirect || `/`],
            { replaceUrl: true }
          );
        }
      });

  }

  login() {
    this.credentialsService.login(this.loginForm.value)
      .pipe(finalize(() => {
        this.loginForm.markAsPristine();
      }))
      .subscribe((credentials) => {
          if (credentials && credentials.Token) {
            const app = credentials.Apps[0].Name.toLowerCase();
            this.router.navigate(
              [this.route.snapshot.queryParams.redirect || `/${app}/dashboard`],
              { replaceUrl: true }
            ).then();
          }
        }, (error) => {
          log.debug(`Login err: ${error}`);
          this.error = error;
        }
      );
  }

  forgotPass() {
    this.state = 'forgot';
  }

  resetPassword() {
    this.credentialsService
      .forgotPass(this.forgotPasswordForm.get('email').value)
      .subscribe(response => {
        if (!response.HasError) {
          //this.toasterService.info('Email adresinize şifre yenileme maili gönderildi');
        }
      });
  }

  setPassword() {
    this.credentialsService.setPass(this.resetPasswordForm.value).subscribe(response => {
      if (!response.HasError) {
        //this.toasterService.info('Yeni Şifreniz ile giriş yapabilirsiniz.');
        this.toasterService.success(response.Message);
        this.state = 'login';
      } else {
        this.toasterService.error(response.Message);
      }
    });
  }

  onStrengthChanged($event: number) {
  }

  PasswordReveal(hide: boolean, psw: any): boolean {
    hide = !hide;
    psw.type = hide ? 'password' : 'text';
    return hide;
  }


  private createForm(token: any, email: any) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true
    });
    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.resetPasswordForm = this.formBuilder.group({
      Token: [token, Validators.required],
      Email: [email, [Validators.required, Validators.email]],
      Password: ['', Validators.required],
      Password2: ['', [Validators.required, confirmPasswordValidator]]
    });

    // Update the validity of the 'passwordConfirm' field
    // when the 'password' field changes
    this.resetPasswordForm.get('Password').valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
      this.resetPasswordForm.get('Password2').updateValueAndValidity();
    });
  }
}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('Password');
  const passwordConfirm = control.parent.get('Password2');

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === '') {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { passwordsNotMatching: true };
};
