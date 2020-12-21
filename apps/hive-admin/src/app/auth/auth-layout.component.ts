/*
 *   @license Hive
 *   (c) 2010-2020 ApplicationHive. http://applicationhive.com
 *   License: GNU LESSER GENERAL PUBLIC LICENSE
 *                Version 3, 29 June 2007
 */

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hive-auth-layout',
  template: `<router-outlet></router-outlet>`
})
export class AuthLayoutComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
