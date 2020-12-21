import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {HiveSharedModule} from '@hive/hive-shared.module';


const routes: Routes = [];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes),
    CommonModule,
    RouterModule, HiveSharedModule
  ],
  exports: [RouterModule]
})
export class TestModule {
}
