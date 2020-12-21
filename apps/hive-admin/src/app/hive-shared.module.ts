import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCommonModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { HiveProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { HiveAppSelectComponent } from './components/app-select/app-select.component';


const COMPONENTS = [HiveProgressBarComponent, HiveAppSelectComponent];

// Common,General Material Modules..
const MATERIAL_MODULES = [
  MatToolbarModule,
  MatExpansionModule, MatButtonToggleModule,
  MatRadioModule, MatCheckboxModule,
  MatCommonModule, MatButtonModule,
  MatFormFieldModule, MatInputModule,
  MatIconModule
];

const THIRD_MODULES = [CommonModule, HttpClientModule, FormsModule, FlexLayoutModule];


const routes: Routes = [];

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    RouterModule.forChild(routes),

    ...THIRD_MODULES,
    ...MATERIAL_MODULES,
    MatProgressBarModule
  ],
  exports: [
    RouterModule,
    ...THIRD_MODULES,
    ...MATERIAL_MODULES,
    ...COMPONENTS
  ]
})
export class HiveSharedModule {
}
