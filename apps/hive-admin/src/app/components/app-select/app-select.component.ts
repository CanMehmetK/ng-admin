
/*
 *   @license Hive
 *   (c) 2010-2020 ApplicationHive. http://applicationhive.com
 *   License: GNU LESSER GENERAL PUBLIC LICENSE
 *                Version 3, 29 June 2007
 */

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {HiveMenuService} from '@hive/shell-module/layouts/components/menu/menu.service';
import {CredentialsService} from '@hive/auth/credentials.service';
import {IdentityAppModel} from '@hivelib';

@Component({
  selector: 'hive-app-select',
  templateUrl: './app-select.component.html',
  styleUrls: ['./app-select.component.scss'],
})
export class HiveAppSelectComponent implements OnInit {
  userApps: IdentityAppModel[] = [];
  currentUserApp: IdentityAppModel = undefined;

  constructor(private router: Router,
              private credentialsService: CredentialsService, // Applist, Kullanıcı Uygulama Listesini
              private hiveMenuService: HiveMenuService, // Menuler ^
  ) {
    this.credentialsChanged();
    this.credentialsService.currentCredentialsChanged.subscribe(() => {
      this.credentialsChanged();
    })
  }

  ngOnInit() {
  }

  credentialsChanged() {
    console.log('Checking Apps from Credentials')
    if (this.credentialsService.credentials &&
      this.credentialsService.credentials.UserMenu &&
      this.credentialsService.credentials.UserMenu.length) {
      this.userApps = this.credentialsService.getUserApps();
      console.log('Found Apps:', this.userApps);
    }
  }

  appChanged(currentUserApp) {
    console.log('App Changing To:', currentUserApp, 'currentUrl:',this.router.url);
    this.hiveMenuService.setCurrentNavigation(currentUserApp.Name);
    if(!this.router.url.startsWith(currentUserApp.Start)){
      this.router.navigateByUrl(currentUserApp.Start).then()
    }
  }
}
