/**
 * @license Hive
 * (c) 2010-2020 ApplicationHive. http://applicationhive.com
 * License: GNU LESSER GENERAL PUBLIC LICENSE
 *              Version 3, 29 June 2007
 *
 * Prefixes all requests
 *  not starting with `http[s]` and
 *  starting with `/api`
 * with `environment.serverUrl`.
 */
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {Logger} from '@hive/services/logger.service';
const log = new Logger('ApiPrefixInterceptor');

@Injectable({
  providedIn: 'root',
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // log.debug(request.url);
    if (!/^(http|https):/i.test(request.url) && request.url.startsWith(environment.API_URL)) {
      request = request.clone({ url: environment.SERVER_URL + request.url });
    }
    return next.handle(request);
  }
}
