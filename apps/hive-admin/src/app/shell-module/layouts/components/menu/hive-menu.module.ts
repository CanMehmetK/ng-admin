/*
 *  @license Hive
 *  (c) 2010-2020 ApplicationHive. http://applicationhive.com
 *  License: GNU LESSER GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { TranslateModule } from '@ngx-translate/core';

import { HiveMenuComponent } from './menu.component';

import { HiveNavVItemComponent } from './vertical/item/item.component';
import { HiveNavVCollapsableComponent } from './vertical/collapsable/collapsable.component';
import { HiveNavVGroupComponent } from './vertical/group/group.component';
import { HiveNavHItemComponent } from './horizontal/item/item.component';
import { HiveNavHCollapsableComponent } from './horizontal/collapsable/collapsable.component';

@NgModule({
    declarations: [
        HiveMenuComponent,
        HiveNavVGroupComponent,
        HiveNavVItemComponent,
        HiveNavVCollapsableComponent,
        HiveNavHItemComponent,
        HiveNavHCollapsableComponent,
    ],
    imports: [CommonModule, RouterModule, MatIconModule, MatRippleModule, TranslateModule.forChild()],
    exports: [HiveMenuComponent],
})
export class HiveMenuModule {}
