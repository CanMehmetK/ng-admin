import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { HiveSharedModule } from '@hive/hive-shared.module';
import { hiveAppConfig } from '@hive/app-config';
import { HiveCoreModule } from '@hive/hive-core.module';
import { AppRoutingModule } from '@hive/app-routing.module';
import { ShellModule } from '@hive/shell-module/shell.module';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,

    HiveCoreModule.forRoot(hiveAppConfig),
    TranslateModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 3000,
      autoDismiss: true,
      preventDuplicates: true
    }),
    HiveSharedModule,
    ShellModule,
    AppRoutingModule,
  ],
  exports: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
