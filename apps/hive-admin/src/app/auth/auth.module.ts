import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { extract, I18nModule } from '@hive/i18n';

import { AuthLayoutComponent } from './auth-layout.component';
import { LoginComponent } from './login/login.component';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { HiveSharedModule } from '@hive/hive-shared.module';


const routes: Routes = [
  {
    path: '', component: AuthLayoutComponent, children: [
      { path: 'login/:code', component: LoginComponent, data: { title: extract('Login') } },
      { path: 'login', component: LoginComponent, data: { title: extract('Login') } },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    I18nModule,
    RouterModule.forChild(routes),
    MatPasswordStrengthModule,
    HiveSharedModule

  ],
  declarations: [LoginComponent, AuthLayoutComponent]
})
export class AuthModule {
}
