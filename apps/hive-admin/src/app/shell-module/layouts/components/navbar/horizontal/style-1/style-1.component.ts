import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {IHiveConfig} from '@hivelib';
import {IHiveMenu} from '@hivelib';
import {HiveConfigService} from '@hive/services/config.service';
import {HiveMenuService} from '@hive/shell-module/layouts/components/menu/menu.service';
import {HiveSidebarService} from '@hive/components/sidebar/sidebar.service';

@Component({
  selector: 'navbar-horizontal-style-1',
  templateUrl: './style-1.component.html',
  styleUrls: ['./style-1.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NavbarHorizontalStyle1Component implements OnInit, OnDestroy {
  appConfig: IHiveConfig;
  navigation: IHiveMenu[];

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _hiveConfigService: HiveConfigService,
    private _hiveMenuService: HiveMenuService,
    private _hiveSidebarService: HiveSidebarService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Get current navigation
    this._hiveMenuService.onNavigationChanged
      .pipe(
        filter((value) => value !== null),
        takeUntil(this._unsubscribeAll)
      )
      .subscribe(() => {
        this.navigation = this._hiveMenuService.getCurrentNavigation();
      });

    // Subscribe to the config changes
    this._hiveConfigService.config
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((config) => {
        this.appConfig = config;
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
