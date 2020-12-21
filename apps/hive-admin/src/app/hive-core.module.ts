/*
 *   @license Hive
 *   (c) 2010-2020 ApplicationHive. http://applicationhive.com
 *   License: GNU LESSER GENERAL PUBLIC LICENSE
 *                Version 3, 29 June 2007
 */

import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {IHiveConfig} from '@hivelib';
import {HIVE_CONFIG} from '@hive/services/config.service';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_RIPPLE_GLOBAL_OPTIONS} from '@angular/material/core';
import {ApiPrefixInterceptor} from '@hive/services/http/api-prefix.interceptor';
import {DefaultInterceptor} from '@hive/services/http/default.interceptor';
import {ErrorHandlerInterceptor} from '@hive/services/http/error-handler.interceptor';
import {RouteReuseStrategy} from '@angular/router';
import {RouteReusableStrategy} from '@hive/services/route-reusable-strategy';
import {LocationStrategy, PathLocationStrategy} from '@angular/common';

export const MY_FORMATS = {
  parse: {dateInput: 'DD.MM.YYYY'},
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};

@NgModule({
  providers: [
    Location,
    {provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true},
    {provide: RouteReuseStrategy, useClass: RouteReusableStrategy},
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    [
      {provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: false}},
      {
        provide: DateAdapter,
        useClass: MomentDateAdapter,
        deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
      }
    ],
    {provide: MAT_DATE_LOCALE, useValue: 'tr-TR'},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    // {provide: MAT_RIPPLE_GLOBAL_OPTIONS, useExisting: AppGlobalRippleOptions},
    {provide: MAT_RIPPLE_GLOBAL_OPTIONS, useValue: {disabled: environment.disableMaterialRipple}}
  ]
})
export class HiveCoreModule {
  constructor(
    @Optional() @SkipSelf() parentModule: HiveCoreModule,
    // private signalrService: HiveSignalRService,
    http: HttpClient
  ) {
    // Import guard
    if (parentModule) {
      throw new Error(
        `Hive Core has already been loaded. Import Core module in the AppModule only.`
      );
    }
    if (environment.use_hive_cms === true) {
      // http.get<ResultViewModelGeneric<CmsMenu>>('/api/hive-cms/get-menu');
    }
    if (environment.use_signalr === true) {

    }
  }

  static forRoot(config: IHiveConfig): ModuleWithProviders<HiveCoreModule> {
    return {
      ngModule: HiveCoreModule,
      providers: [{provide: HIVE_CONFIG, useValue: config}]
    };
  }
}
