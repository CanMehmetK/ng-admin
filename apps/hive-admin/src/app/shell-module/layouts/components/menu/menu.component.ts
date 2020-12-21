import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {merge, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {HiveMenuService} from '@hive/shell-module/layouts/components/menu/menu.service';


@Component({
  selector: 'hive-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HiveMenuComponent implements OnInit {
  @Input() layout = 'vertical';
  @Input() navigationKey: any;
  @Input() navigation: any;

  private unsubscribeAll: Subject<any>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private hiveMenuService: HiveMenuService
  ) {
    // Set the private defaults
    this.unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    if (this.navigationKey && this.navigation && !this.hiveMenuService.queryregister(this.navigationKey)) {
      this.hiveMenuService.register(this.navigationKey, this.navigation);
    } else if (this.navigationKey) {
      this.navigation = this.hiveMenuService.getNavigation(this.navigationKey);
    } else {
      this.navigation =
        this.navigation || this.hiveMenuService.getCurrentNavigation();
    }


    // Subscribe to the current navigation changes
    this.hiveMenuService.onNavigationChanged
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => {
        if (this.navigationKey) {
          this.navigation = this.hiveMenuService.getNavigation(this.navigationKey);
        } else {
          this.navigation = this.hiveMenuService.getCurrentNavigation();
        }

        // Mark for check
        this.changeDetectorRef.markForCheck();
      });

    // Subscribe to navigation item
    merge(
      this.hiveMenuService.onNavigationItemAdded,
      this.hiveMenuService.onNavigationItemUpdated,
      this.hiveMenuService.onNavigationItemRemoved
    )
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => {
        // Mark for check
        this.changeDetectorRef.markForCheck();
      });
  }
}
