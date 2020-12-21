/*
 *   @license Hive
 *   (c) 2010-2020 ApplicationHive. http://applicationhive.com
 *   License: GNU LESSER GENERAL PUBLIC LICENSE
 *                Version 3, 29 June 2007
 */

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ShellModule } from '@hive/shell-module/shell.module';


const routes: Routes = [
  {path: '', loadChildren: () => import('./routes/cms/cms.module').then(m => m.CMSModule)},
  {path: 'test', loadChildren: () => import('./routes/test/test.module').then(m => m.TestModule)},
  {path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
  ShellModule.childRoutes([
    {path: 'admin', loadChildren: () => import('./routes/admin/admin.module').then(m => m.AdminModule)},
  ])
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
