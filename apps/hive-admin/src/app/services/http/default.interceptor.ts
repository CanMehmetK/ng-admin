/**
 * @license Hive
 * (c) 2010-2020 ApplicationHive. http://applicationhive.com
 * License: GNU LESSER GENERAL PUBLIC LICENSE
 *              Version 3, 29 June 2007
 */
import {Injectable} from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {catchError, map, mergeMap, tap} from 'rxjs/operators';
import {ToastrService} from 'ngx-toastr';
import {environment} from '@environments/environment';
import {Logger} from '@hive/services/logger.service';
import {CredentialsService} from '@hive/auth/credentials.service';


const log = new Logger('DefaultInterceptor');

/** Pass untouched request through to the next request handler. */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(
    private toasterService: ToastrService,
    private readonly appTokenService: CredentialsService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const startTime = new Date().getTime();
    
    if (this.appTokenService.credentials?.Token) {
      request = request.clone({setHeaders: {Authorization: `Bearer ${this.appTokenService.credentials.Token}`}});
    }
    if (!request.headers.has('fileuploader')) {
      if (!request.headers.has('Content-Type')) {
        request = request.clone({
          headers: request.headers.set('Content-Type', 'application/json'),
        });
      }
      if (!request.headers.has('Accept')) {
        request = request.clone({headers: request.headers.set('Accept', 'application/json')});
      }
    }
    return next.handle(request);

  }
}
