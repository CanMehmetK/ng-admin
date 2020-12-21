import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {IHiveConfig} from '@hivelib';
import {IHiveMenu} from '@hivelib';

import {HiveMenuService} from '@hive/shell-module/layouts/components/menu/menu.service';
import {HiveConfigService} from '@hive/services/config.service';
import {CredentialsService} from '@hive/auth/credentials.service';

@Component({
    selector: 'vertical-1',
    templateUrl: './layout-1.component.html',
    styleUrls: ['./layout-1.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class VerticalLayout1Component implements OnInit, OnDestroy {
    appConfig: IHiveConfig;
    navigation: IHiveMenu[];

    // Private
    private unsubscribeAll: Subject<any>;

    constructor(
        private hiveMenuService: HiveMenuService,
        private hiveConfigService: HiveConfigService,
        private credentialsService: CredentialsService
    ) {
        // TODO: Kullanıcı -> Uygulama -> Yetki
        // Set the defaults
        // this.navigation = navigation;

        // Set the private defaults
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to config changes
        this.hiveConfigService.config
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((config: IHiveConfig) => {
                this.appConfig = config;
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
}
