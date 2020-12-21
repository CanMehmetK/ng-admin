import {ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit} from '@angular/core';
import {merge, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IHiveMenuItem} from '@hivelib';
import {HiveMenuService} from '@hive/shell-module/layouts/components/menu/menu.service';

@Component({
  selector: 'hive-nav-vertical-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class HiveNavVItemComponent implements OnInit, OnDestroy {
  @HostBinding('class') classes = 'nav-item';
  @Input() item: IHiveMenuItem;
  private unsubscribeAll: Subject<any>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private hiveMenuService: HiveMenuService,
  ) {
    // Set the private defaults
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Subscribe to navigation item
    merge(
      this.hiveMenuService.onNavigationItemAdded,
      this.hiveMenuService.onNavigationItemUpdated,
      this.hiveMenuService.onNavigationItemRemoved,
    )
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => {
        // Mark for check
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }
}
