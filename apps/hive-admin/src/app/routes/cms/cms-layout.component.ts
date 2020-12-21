/**
 * @license Hive
 * (c) 2010-2020 ApplicationHive. http://applicationhive.com
 * License: GNU LESSER GENERAL PUBLIC LICENSE
 *              Version 3, 29 June 2007
 */
import {Component, OnDestroy, OnInit} from '@angular/core';

@Component({
  selector: 'hive-cms-layout',
  template: `
    <a [routerLink]="['/']">Cms Home</a>
<a [routerLink]="['/auth/login']">Login</a>
    Apps:
    <hive-app-select></hive-app-select>
    <router-outlet></router-outlet>`
})
export class CmsLayoutComponent implements OnInit, OnDestroy {


  constructor() {

  }


  ngOnInit(): void {

  }


  ngOnDestroy(): void {

  }
}
