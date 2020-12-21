import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {extract} from '@hive/i18n';
import {CmsLayoutComponent} from '@hive/routes/cms/cms-layout.component';
import {CmsHomeComponent} from './cms-home/cms-home.component';
import {HiveSharedModule} from '@hive/hive-shared.module';


const routes: Routes = [
  {
    path: '', component: CmsLayoutComponent, children: [
      {path: '', component: CmsHomeComponent, data: {title: extract('CmsHome')}}
    ]
  }
];

@NgModule({
  declarations: [CmsLayoutComponent, CmsHomeComponent],
  imports: [RouterModule.forChild(routes),
    CommonModule,
    RouterModule, HiveSharedModule
  ],
  exports: [RouterModule]
})
export class CMSModule {
}
