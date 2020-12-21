import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {IHiveConfig} from '@hivelib';
import {HiveConfigService} from '@hive/services/config.service';
import {HiveMenuService} from '@hive/shell-module/layouts/components/menu/menu.service';
import {HiveSidebarService} from '@hive/components/sidebar/sidebar.service';

@Component({
  selector: 'navbar-vertical-style-2',
  templateUrl: './style-2.component.html',
  styleUrls: ['./style-2.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NavbarVerticalStyle2Component implements OnInit, OnDestroy {
  appConfig: IHiveConfig;
  navigation: any;

  // Private
  // private hiveCustomScroll: HiveCustomScrollDirective;
  private unsubscribeAll: Subject<any>;

  constructor(
    private hiveConfigService: HiveConfigService,
    private hiveMenuService: HiveMenuService,
    private hiveSidebarService: HiveSidebarService,
    private router: Router
  ) {
    // Set the private defaults
    this.unsubscribeAll = new Subject();
  }

  // Directive
  // @ViewChild(HiveCustomScrollDirective, {static: true})
  // set directive(theDirective: HiveCustomScrollDirective) {
  //     if (!theDirective) {
  //         return;
  //     }
  //
  //     this.hiveCustomScroll = theDirective;
  //
  //     // Update the scrollbar on collapsable item toggle
  //     this.hiveMenuService.onItemCollapseToggled
  //         .pipe(delay(500), takeUntil(this.unsubscribeAll))
  //         .subscribe(() => {
  //             this.hiveCustomScroll.update();
  //         });
  //
  //     // Scroll to the active item position
  //     this.router.events
  //         .pipe(
  //             filter((event) => event instanceof NavigationEnd),
  //             take(1)
  //         )
  //         .subscribe(() => {
  //             setTimeout(() => {
  //                 this.hiveCustomScroll.scrollToElement(
  //                     'navbar .nav-link.active',
  //                     -120
  //                 );
  //             });
  //         });
  // }

  ngOnInit(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe(() => {
        if (this.hiveSidebarService.getSidebar('navbar')) {
          this.hiveSidebarService.getSidebar('navbar').close();
        }
      });

    // Get current navigation
    this.hiveMenuService.onNavigationChanged
      .pipe(
        filter((value) => value !== null),
        takeUntil(this.unsubscribeAll)
      )
      .subscribe(() => {
        this.navigation = this.hiveMenuService.getCurrentNavigation();
      });

    // Subscribe to the config changes
    this.hiveConfigService.config
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe((config) => {
        this.appConfig = config;
      });
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }


  toggleSidebarOpened(): void {
    this.hiveSidebarService.getSidebar('navbar').toggleOpen();
  }

  toggleSidebarFolded(): void {
    this.hiveSidebarService.getSidebar('navbar').toggleFold();
  }
}
