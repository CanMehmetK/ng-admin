import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Route, Routes } from '@angular/router';

import {LayoutHostDirective, ShellComponent} from './shell.component';
import { VerticalLayout1Component } from '@hive/shell-module/layouts/vertical/layout-1/layout-1.component';
import { HiveSidebarModule } from '@hive/components/sidebar/sidebar.module';
import { NavbarModule } from '@hive/shell-module/layouts/components/navbar/navbar.module';
import { HiveThemeOptionsComponent } from '@hive/components/theme-options/theme-options.component';
import { HiveSharedModule } from '@hive/hive-shared.module';
import { AuthenticationGuard } from '@hive/auth/authentication.guard';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';





const LAYOUT_COMPONENTS = [VerticalLayout1Component]
const LAYOUT_MODULES = [HiveSidebarModule, NavbarModule];

@NgModule({
  declarations: [
    LayoutHostDirective, ShellComponent, HiveThemeOptionsComponent,
    ...LAYOUT_COMPONENTS],
  exports: [    HiveThemeOptionsComponent  ],
  imports: [
    CommonModule,
    HiveSharedModule,
    DragDropModule,
    ScrollingModule,

    ...LAYOUT_MODULES,
    MatSlideToggleModule
  ]
})
export class ShellModule {
  static childRoutes(routes: Routes): Route {
    return {
      path: '',
      component: ShellComponent,
      children: routes,
      canActivate: [AuthenticationGuard],
      canLoad: [AuthenticationGuard],
      // Reuse ShellComponent instance when navigating between child views
      data: {reuse: true},
    };
  }
}

