import { Component, HostBinding, Inject, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


import { MatAccordion } from '@angular/material/expansion';
import { DOCUMENT } from '@angular/common';
import { customAnimations } from '@hive/helper-util/animations';
import { IHiveConfig } from '@hivelib';
import { HiveConfigService } from '@hive/services/config.service';
import { HiveMenuService } from '@hive/shell-module/layouts/components/menu/menu.service';
import { HiveSidebarService } from '@hive/components/sidebar/sidebar.service';



@Component({
    selector: 'hive-theme-options',
    templateUrl: './theme-options.component.html',
    styleUrls: ['./theme-options.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: customAnimations
})
export class HiveThemeOptionsComponent implements OnInit, OnDestroy {
    @ViewChild(MatAccordion) accordion: MatAccordion;
    @HostBinding('class.bar-closed')

    appConfig: IHiveConfig | undefined;
    barClosed: boolean;
    allCollapsed: boolean;
    private unsubscribeAll: Subject<any>;


    constructor(@Inject(DOCUMENT) private document: any,
                public hiveConfigService: HiveConfigService,
                private hiveMenuService: HiveMenuService,
                private hiveSidebarService: HiveSidebarService
    ) {
        // Set the defaults
        this.barClosed = false;
        // Set the private defaults
        this.unsubscribeAll = new Subject();
        this.allCollapsed = false;
    }

    ngOnInit() {
        this.hiveConfigService.config
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((config: IHiveConfig) => {
                // Update the stored config
                this.appConfig = config;
                // Boxed
                if (this.appConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                } else {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for (let i = 0; i < this.document.body.classList.length; i++) {
                    const className = this.document.body.classList[i];

                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.appConfig.colorTheme);
            });
    }

    toggleSidebarOpen(key: any): void {
        this.hiveSidebarService.getSidebar(key).toggleOpen();
    }

    configSectionAllCollapse() {
        this.allCollapsed = !this.allCollapsed;
        if (this.allCollapsed) {
            this.accordion.closeAll();
        } else {
            this.accordion.openAll();
        }
    }


    public layoutChanged(value: any): void {
        // const config: IHiveConfig = {
        //     layout: {
        //         width: 'fullwidth',
        //         navbar: {
        //             primaryBackground: 'hive-navy-700',
        //             secondaryBackground: 'hive-navy-900',
        //             folded: false,
        //             hidden: false,
        //             position: 'left',
        //             variant: 'vertical-style-1'
        //         },
        //         toolbar: {
        //             background: 'hive-white-500',
        //             customBackgroundColor: false,
        //             hidden: false,
        //             position: 'below-static'
        //         },
        //         footer: {
        //             background: 'hive-navy-900',
        //             customBackgroundColor: true,
        //             hidden: false,
        //             position: 'below-static'
        //         },
        //         sidepanel: {
        //             hidden: false,
        //             position: 'right'
        //         }
        //     }
        // };
        // switch (value) {
        //     case 'vertical-1': {
        //         config.layout.toolbar.position = 'below-static';
        //         config.layout.footer.position = 'below-static';
        //         break;
        //     }
        //     case 'vertical-2': {
        //         config.layout.toolbar.position = 'below';
        //         config.layout.footer.position = 'below';
        //         break;
        //     }
        //     case 'vertical-3': {
        //         config.layout.navbar.position = 'left';
        //         config.layout.toolbar.position = 'above-static';
        //         config.layout.footer.position = 'above-static';
        //         break;
        //     }
        //     case 'horizontal-1': {
        //         config.layout.navbar.position = 'top';
        //         config.layout.toolbar.position = 'above';
        //         config.layout.footer.position = 'above';
        //         break;
        //     }
        // }
        //
        // this.hiveConfigService.setConfig(config);
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();

        // Remove the custom function menu
        // this.hiveMenuService.removeNavigationItem('custom-function');
    }
}
