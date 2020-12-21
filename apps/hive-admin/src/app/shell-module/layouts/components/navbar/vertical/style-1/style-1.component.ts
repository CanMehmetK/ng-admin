import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { delay, filter, take, takeUntil } from 'rxjs/operators';

import {HiveConfigService} from '@hive/services/config.service';
import {CredentialsService} from '@hive/auth/credentials.service';
import {HiveMenuService} from '@hive/shell-module/layouts/components/menu/menu.service';
import {HiveSidebarService} from '@hive/components/sidebar/sidebar.service';
import { IHiveConfig, IHiveMenu } from '@hivelib';

@Component({
    selector: 'navbar-vertical-style-1',
    templateUrl: './style-1.component.html',
    styleUrls: ['./style-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavbarVerticalStyle1Component implements OnInit, OnDestroy {
    appConfig: IHiveConfig;
    navigation: IHiveMenu[];

    // Private
    // private hiveCustomScroll: HiveCustomScrollDirective;
    private unsubscribeAll: Subject<any>;

    constructor(
        private hiveConfigService: HiveConfigService,
        private credentialsService: CredentialsService,
        private hiveMenuService: HiveMenuService,
        private hiveSidebarService: HiveSidebarService,
        private router: Router
    ) {
        // Set the private defaults
        this.unsubscribeAll = new Subject();


    }
/*
    @ViewChild(HiveCustomScrollDirective, {static: true})
    set directive(theDirective: HiveCustomScrollDirective) {
        if (!theDirective) {
            return;
        }

        this.hiveCustomScroll = theDirective;

        // Update the scrollbar on collapsable item toggle
        this.hiveMenuService.onItemCollapseToggled
            .pipe(delay(500), takeUntil(this.unsubscribeAll))
            .subscribe(() => {
                this.hiveCustomScroll.update();
            });

        // Scroll to the active item position
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                take(1)
            )
            .subscribe(() => {
                setTimeout(() => {
                    this.hiveCustomScroll.scrollToElement(
                        'navbar .nav-link.active',
                        -120
                    );
                });
            });
    }
*/
    get adisoyadi(): string {
        const credentials = this.credentialsService.credentials;
        if (credentials.Adi && credentials.Soyadi) {
            return credentials.Adi + ' ' + credentials.Soyadi;
        }
        return null;

    }

    get emailadresi(): string {
        const credentials = this.credentialsService.credentials;
        return credentials.Email;
    }

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

        // Subscribe to the config changes
        this.hiveConfigService.config
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((config) => {
                this.appConfig = config;
            });

        // Get current navigation
        this.hiveMenuService.onNavigationChanged
            .pipe(filter((value) => value !== null), takeUntil(this.unsubscribeAll))
            .subscribe(() => {
                this.navigation = this.hiveMenuService.getCurrentNavigation();
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
