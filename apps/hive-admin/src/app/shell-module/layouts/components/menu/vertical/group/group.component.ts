import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IHiveMenuItem } from '@hivelib';
import { HiveMenuService } from '@hive/shell-module/layouts/components/menu/menu.service';

@Component({
  selector: 'hive-nav-vertical-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class HiveNavVGroupComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  classes = 'nav-group nav-item';

  @Input()
  item: IHiveMenuItem;

  // Private
  private _unsubscribeAll: Subject<any>;

  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _hiveMenuService: HiveMenuService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Subscribe to navigation item
    merge(
      this._hiveMenuService.onNavigationItemAdded,
      this._hiveMenuService.onNavigationItemUpdated,
      this._hiveMenuService.onNavigationItemRemoved
    )
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe(() => {
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }
}
