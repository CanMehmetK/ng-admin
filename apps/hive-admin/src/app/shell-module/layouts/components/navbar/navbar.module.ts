import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavbarVerticalStyle2Component} from './vertical/style-2/style-2.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NavbarComponent} from '@hive/shell-module/layouts/components/navbar/navbar.component';
import {NavbarHorizontalStyle1Component} from '@hive/shell-module/layouts/components/navbar/horizontal/style-1/style-1.component';
import {NavbarVerticalStyle1Component} from '@hive/shell-module/layouts/components/navbar/vertical/style-1/style-1.component';
import {HiveSharedModule} from '@hive/hive-shared.module';
import {HiveMenuModule} from '@hive/shell-module/layouts/components/menu/hive-menu.module';

@NgModule({
  declarations: [
    NavbarComponent,
    NavbarHorizontalStyle1Component,
    NavbarVerticalStyle1Component,
    NavbarVerticalStyle2Component,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HiveSharedModule,
    HiveMenuModule
  ],
  exports: [NavbarComponent],
})
export class NavbarModule {
}
