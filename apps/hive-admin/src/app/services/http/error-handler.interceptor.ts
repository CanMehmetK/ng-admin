/**
 * @license Hive
 * (c) 2010-2020 ApplicationHive. http://applicationhive.com
 * License: GNU LESSER GENERAL PUBLIC LICENSE
 *              Version 3, 29 June 2007
 *
 * Adds a default error handler to all requests.
 */
import {Injectable, Injector} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '@environments/environment';
import {Router} from '@angular/router';
import {Logger} from '@hive/services/logger.service';

const log = new Logger('ErrorHandlerInterceptor');

@Injectable({providedIn: 'root'})
export class ErrorHandlerInterceptor implements HttpInterceptor {
  // ref: DialogRef;

  constructor(private readonly injector: Injector) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(error => this.errorHandler(error)));
  }

  // Customize the default error handler here if needed
  private errorHandler(response: HttpEvent<any>): Observable<HttpEvent<any>> {
    if (!environment.production) {
      // Do something with the error
      log.error('Request error', response);

      // this.ref = dialogService.open(HivePartialLoginComponent);
      //
      // throw response;
    }
    if (response instanceof HttpErrorResponse) {
      switch (response.status) {
        case 401: {
          log.error('Request error 401 environment.use_hive_partial_login:', environment.use_hive_partial_login);
          if (environment.use_hive_partial_login === true) {
            // const dialogService = this.injector.get<DialogService>(DialogService);
            // this.ref = dialogService.open(HivePartialLoginComponent, { headerText: 'Login', overlayClickClose: false });
          } else {
            const router = this.injector.get<Router>(Router);
            router.navigate(['/login']).then();
            return null;
          }
          throw response;
        }
        case 422: {
          // TODO: Show error modal
          // const appModalService = this.injector.get<AppModalService>(
          //   AppModalService
          // );
          // appModalService.alert(response.error);
          return null;
        }
      }
    }
    throw response;
  }
}
