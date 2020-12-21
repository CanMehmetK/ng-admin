import { ChangeDetectorRef, Component, HostBinding, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { merge, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { customAnimations } from '@hive/helper-util/animations';
import { IHiveMenuItem } from '@hivelib';
import { HiveMenuService } from '@hive/shell-module/layouts/components/menu/menu.service';


@Component({
    selector: 'hive-nav-vertical-collapsable',
    templateUrl: './collapsable.component.html',
    styleUrls: ['./collapsable.component.scss'],
    animations: customAnimations
})
export class HiveNavVCollapsableComponent implements OnInit, OnDestroy {
    @Input()
    item: IHiveMenuItem;

    @HostBinding('class')
    classes = 'nav-collapsable nav-item';

    @HostBinding('class.open')
    public isOpen = false;

    // Private
    private unsubscribeAll: Subject<any>;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private hiveMenuService: HiveMenuService,
        private router: Router
    ) {
        // Set the private defaults
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Listen for router events
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe((event: any) => {
                // Check if the url can be found in
                // one of the children of this item
                if (this.isUrlInChildren(this.item, event.urlAfterRedirects)) {
                    this.expand();
                } else {
                    this.collapse();
                }
            });

        // Listen for collapsing of any navigation item
        this.hiveMenuService.onItemCollapsed
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((clickedItem) => {
                if (clickedItem && clickedItem.children) {
                    // Check if the clicked item is one
                    // of the children of this item
                    if (this.isChildrenOf(this.item, clickedItem)) {
                        return;
                    }

                    // Check if the url can be found in
                    // one of the children of this item
                    if (this.isUrlInChildren(this.item, this.router.url)) {
                        return;
                    }

                    // If the clicked item is not this item, collapse...
                    if (this.item !== clickedItem) {
                        this.collapse();
                    }
                }
            });

        // Check if the url can be found in
        // one of the children of this item
        if (this.isUrlInChildren(this.item, this.router.url)) {
            this.expand();
        } else {
            this.collapse();
        }

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


    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }




    toggleOpen(ev): void {
        ev.preventDefault();

        this.isOpen = !this.isOpen;

        // Navigation collapse toggled...
        this.hiveMenuService.onItemCollapsed.next(this.item);
        this.hiveMenuService.onItemCollapseToggled.next();
    }


    expand(): void {
        if (this.isOpen) {
            return;
        }

        this.isOpen = true;

        // Mark for check
        this.changeDetectorRef.markForCheck();

        this.hiveMenuService.onItemCollapseToggled.next();
    }


    collapse(): void {
        if (!this.isOpen) {
            return;
        }

        this.isOpen = false;

        // Mark for check
        this.changeDetectorRef.markForCheck();

        this.hiveMenuService.onItemCollapseToggled.next();
    }


    isChildrenOf(parent, item): boolean {
        const children = parent.children;

        if (!children) {
            return false;
        }

        if (children.indexOf(item) > -1) {
            return true;
        }

        for (const child of children) {
            if (child.children) {
                if (this.isChildrenOf(child, item)) {
                    return true;
                }
            }
        }

        return false;
    }


    isUrlInChildren(parent, url): boolean {
        const children = parent.children;

        if (!children) {
            return false;
        }

        for (const child of children) {
            if (child.children) {
                if (this.isUrlInChildren(child, url)) {
                    return true;
                }
            }

            if (child.url === url || url.includes(child.url)) {
                return true;
            }
        }

        return false;
    }
}
