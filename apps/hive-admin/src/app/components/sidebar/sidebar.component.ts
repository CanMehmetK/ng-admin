import { ChangeDetectorRef, Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, OnDestroy, OnInit, Output, Renderer2, ViewEncapsulation } from '@angular/core';
import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HiveConfigService } from '@hive/services/config.service';
import { MatchMediaService } from '@hive/services/match-media.service';
import { HiveSidebarService } from '@hive/components/sidebar/sidebar.service';
import { MediaObserver } from '@angular/flex-layout';
import { IHiveConfig } from '@hivelib';




@Component({
    selector: 'hive-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class HiveSidebarComponent implements OnInit, OnDestroy {
    // Name
    @Input() name: string;
    // Key
    @Input() key: string;
    // Position
    @Input() position: 'left' | 'right';
    // Open
    @HostBinding('class.open') opened: boolean;
    // Locked Open
    @Input() lockedOpen: string;
    // isLockedOpen
    @HostBinding('class.locked-open')
    isLockedOpen: boolean;
    // Folded width
    @Input() foldedWidth: number;
    // Folded auto trigger on hover
    @Input() foldedAutoTriggerOnHover: boolean;
    // Folded unfolded
    @HostBinding('class.unfolded')
    unfolded: boolean;
    // Invisible overlay
    @Input() invisibleOverlay: boolean;
    // Folded changed
    @Output() foldedChanged: EventEmitter<boolean>;
    // Opened changed
    @Output() openedChanged: EventEmitter<boolean>;
    @HostBinding('class.animations-enabled') private animationsEnabled: boolean;

    private appConfig: IHiveConfig;
    private wasActive: boolean;
    private wasFolded: boolean;
    private backdrop: HTMLElement | null = null;
    private player: AnimationPlayer;
    private unsubscribeAll: Subject<any>;


    constructor(
        private animationBuilder: AnimationBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef,
        private hiveConfigService: HiveConfigService,
        private hiveMatchMediaService: MatchMediaService,
        private hiveSidebarService: HiveSidebarService,
        private mediaObserver: MediaObserver,
        private renderer: Renderer2
    ) {
        // Set the defaults
        this.foldedAutoTriggerOnHover = true;
        this.foldedWidth = 64;
        this.foldedChanged = new EventEmitter();
        this.openedChanged = new EventEmitter();
        this.opened = false;
        this.position = 'left';
        this.invisibleOverlay = false;

        // Set the private defaults
        this.animationsEnabled = false;
        this._folded = false;
        this.unsubscribeAll = new Subject();
    }

    // Private
    private _folded: boolean;

    get folded(): boolean {
        return this._folded;
    }


    @Input() set folded(value: boolean) {
        // Set the folded
        this._folded = value;

        // Return if the sidebar is closed
        if (!this.opened) {
            return;
        }

        // Programmatically add/remove padding to the element
        // that comes after or before based on the position
        let sibling, styleRule;

        const styleValue = this.foldedWidth + 'px';

        // Get the sibling and set the style rule
        if (this.position === 'left') {
            sibling = this.elementRef.nativeElement.nextElementSibling;
            styleRule = 'padding-left';
        } else {
            sibling = this.elementRef.nativeElement.previousElementSibling;
            styleRule = 'padding-right';
        }

        // If there is no sibling, return...
        if (!sibling) {
            return;
        }

        // If folded...
        if (value) {
            // Fold the sidebar
            this.fold();

            // Set the folded width
            this.renderer.setStyle(
                this.elementRef.nativeElement,
                'width',
                styleValue
            );
            this.renderer.setStyle(
                this.elementRef.nativeElement,
                'min-width',
                styleValue
            );
            this.renderer.setStyle(
                this.elementRef.nativeElement,
                'max-width',
                styleValue
            );

            // Set the style and class
            this.renderer.setStyle(sibling, styleRule, styleValue);
            this.renderer.addClass(this.elementRef.nativeElement, 'folded');
        }
        // If unfolded...
        else {
            // Unfold the sidebar
            this.unfold();

            // Remove the folded width
            this.renderer.removeStyle(this.elementRef.nativeElement, 'width');
            this.renderer.removeStyle(this.elementRef.nativeElement, 'min-width');
            this.renderer.removeStyle(this.elementRef.nativeElement, 'max-width');

            // Remove the style and class
            this.renderer.removeStyle(sibling, styleRule);
            this.renderer.removeClass(this.elementRef.nativeElement, 'folded');
        }

        // Emit the 'foldedChanged' event
        this.foldedChanged.emit(this.folded);
    }

    ngOnInit(): void {
        // Subscribe to config changes
        this.hiveConfigService.config
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((config: IHiveConfig) => {
                this.appConfig = config;
            });

        // Register the sidebar
        this.hiveSidebarService.register(this.name, this);

        // Setup visibility
        this._setupVisibility();

        // Setup position
        this._setupPosition();

        // Setup lockedOpen
        this._setupLockedOpen();

        // Setup folded
        this._setupFolded();
    }

    ngOnDestroy(): void {
        // If the sidebar is folded, unfold it to revert modifications
        if (this.folded) {
            this.unfold();
        }

        // Unregister the sidebar
        this.hiveSidebarService.unregister(this.name);

        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    open(): void {
        if (this.opened || this.isLockedOpen) {
            return;
        }

        // Enable the animations
        this._enableAnimations();

        // Show the sidebar
        this._showSidebar();

        // Show the backdrop
        this._showBackdrop();

        // Set the appConfig status
        this.opened = true;

        // Emit the 'openedChanged' event
        this.openedChanged.emit(this.opened);

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    close(): void {
        if (!this.opened || this.isLockedOpen) {
            return;
        }

        // Enable the animations
        this._enableAnimations();

        // Hide the backdrop
        this._hideBackdrop();

        // Set the appConfig status
        this.opened = false;

        // Emit the 'openedChanged' event
        this.openedChanged.emit(this.opened);

        // Hide the sidebar
        this._hideSidebar();

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    toggleOpen(): void {
        if (this.opened) {
            this.close();
        } else {
            this.open();
        }
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        // Only work if the auto trigger is enabled
        if (!this.foldedAutoTriggerOnHover) {
            return;
        }

        this.unfoldTemporarily();
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        // Only work if the auto trigger is enabled
        if (!this.foldedAutoTriggerOnHover) {
            return;
        }

        this.foldTemporarily();
    }

    fold(): void {
        // Only work if the sidebar is not folded
        if (this.folded) {
            return;
        }

        // Enable the animations
        this._enableAnimations();

        // Fold
        this.folded = true;

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    unfold(): void {
        // Only work if the sidebar is folded
        if (!this.folded) {
            return;
        }

        // Enable the animations
        this._enableAnimations();

        // Unfold
        this.folded = false;

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    toggleFold(): void {
        if (this.folded) {
            this.unfold();
        } else {
            this.fold();
        }
    }

    foldTemporarily(): void {
        // Only work if the sidebar is folded
        if (!this.folded) {
            return;
        }

        // Enable the animations
        this._enableAnimations();

        // Fold the sidebar back
        this.unfolded = false;

        // Set the folded width
        const styleValue = this.foldedWidth + 'px';

        this.renderer.setStyle(
            this.elementRef.nativeElement,
            'width',
            styleValue
        );
        this.renderer.setStyle(
            this.elementRef.nativeElement,
            'min-width',
            styleValue
        );
        this.renderer.setStyle(
            this.elementRef.nativeElement,
            'max-width',
            styleValue
        );

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }



    unfoldTemporarily(): void {
        // Only work if the sidebar is folded
        if (!this.folded) {
            return;
        }

        // Enable the animations
        this._enableAnimations();

        // Unfold the sidebar temporarily
        this.unfolded = true;

        // Remove the folded width
        this.renderer.removeStyle(this.elementRef.nativeElement, 'width');
        this.renderer.removeStyle(this.elementRef.nativeElement, 'min-width');
        this.renderer.removeStyle(this.elementRef.nativeElement, 'max-width');

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Setup the visibility of the sidebar
     *
     * @private
     */
    private _setupVisibility(): void {
        // Remove the existing box-shadow
        this.renderer.setStyle(
            this.elementRef.nativeElement,
            'box-shadow',
            'none'
        );

        // Make the sidebar invisible
        this.renderer.setStyle(
            this.elementRef.nativeElement,
            'visibility',
            'hidden'
        );
    }

    /**
     * Setup the sidebar position
     *
     * @private
     */
    private _setupPosition(): void {
        // Add the correct class name to the sidebar
        // element depending on the position attribute
        if (this.position === 'right') {
            this.renderer.addClass(
                this.elementRef.nativeElement,
                'right-positioned'
            );
        } else {
            this.renderer.addClass(
                this.elementRef.nativeElement,
                'left-positioned'
            );
        }
    }

    /**
     * Setup the lockedOpen handler
     *
     * @private
     */
    private _setupLockedOpen(): void {
        // Return if the lockedOpen wasn't set
        if (!this.lockedOpen) {
            // Return
            return;
        }

        // Set the wasActive for the first time
        this.wasActive = false;

        // Set the wasFolded
        this.wasFolded = this.folded;

        // Show the sidebar
        this._showSidebar();

        // Act on every media change
        this.hiveMatchMediaService.onMediaChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(() => {
                // Get the active status
                const isActive = this.mediaObserver.isActive(this.lockedOpen);

                // If the both status are the same, don't act
                if (this.wasActive === isActive) {
                    return;
                }

                // Activate the lockedOpen
                if (isActive) {
                    // Set the lockedOpen status
                    this.isLockedOpen = true;

                    // Show the sidebar
                    this._showSidebar();

                    // Force the the appConfig status to true
                    this.opened = true;

                    // Emit the 'openedChanged' event
                    this.openedChanged.emit(this.opened);

                    // If the sidebar was folded, forcefully fold it again
                    if (this.wasFolded) {
                        // Enable the animations
                        this._enableAnimations();

                        // Fold
                        this.folded = true;

                        // Mark for check
                        this.changeDetectorRef.markForCheck();
                    }

                    // Hide the backdrop if any exists
                    this._hideBackdrop();
                }
                // De-Activate the lockedOpen
                else {
                    // Set the lockedOpen status
                    this.isLockedOpen = false;

                    // Unfold the sidebar in case if it was folded
                    this.unfold();

                    // Force the the appConfig status to close
                    this.opened = false;

                    // Emit the 'openedChanged' event
                    this.openedChanged.emit(this.opened);

                    // Hide the sidebar
                    this._hideSidebar();
                }

                // Store the new active status
                this.wasActive = isActive;
            });
    }

    /**
     * Setup the initial folded status
     *
     * @private
     */
    private _setupFolded(): void {
        // Return, if sidebar is not folded
        if (!this.folded) {
            return;
        }

        // Return if the sidebar is closed
        if (!this.opened) {
            return;
        }

        // Programmatically add/remove padding to the element
        // that comes after or before based on the position
        let sibling, styleRule;

        const styleValue = this.foldedWidth + 'px';

        // Get the sibling and set the style rule
        if (this.position === 'left') {
            sibling = this.elementRef.nativeElement.nextElementSibling;
            styleRule = 'padding-left';
        } else {
            sibling = this.elementRef.nativeElement.previousElementSibling;
            styleRule = 'padding-right';
        }

        // If there is no sibling, return...
        if (!sibling) {
            return;
        }

        // Fold the sidebar
        this.fold();

        // Set the folded width
        this.renderer.setStyle(
            this.elementRef.nativeElement,
            'width',
            styleValue
        );
        this.renderer.setStyle(
            this.elementRef.nativeElement,
            'min-width',
            styleValue
        );
        this.renderer.setStyle(
            this.elementRef.nativeElement,
            'max-width',
            styleValue
        );

        // Set the style and class
        this.renderer.setStyle(sibling, styleRule, styleValue);
        this.renderer.addClass(this.elementRef.nativeElement, 'folded');
    }

    /**
     * Show the backdrop
     *
     * @private
     */
    private _showBackdrop(): void {
        // Create the backdrop element
        this.backdrop = this.renderer.createElement('div');

        // Add a class to the backdrop element
        this.backdrop.classList.add('hive-sidebar-overlay');

        // Add a class depending on the invisibleOverlay option
        if (this.invisibleOverlay) {
            this.backdrop.classList.add('hive-sidebar-overlay-invisible');
        }

        // Append the backdrop to the parent of the sidebar
        this.renderer.appendChild(
            this.elementRef.nativeElement.parentElement,
            this.backdrop
        );

        // Create the enter animation and attach it to the player
        this.player = this.animationBuilder
            .build([animate('300ms ease', style({opacity: 1}))])
            .create(this.backdrop);

        // Play the animation
        this.player.play();

        // Add an event listener to the overlay
        this.backdrop.addEventListener('click', () => {
            this.close();
        });

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Hide the backdrop
     *
     * @private
     */
    private _hideBackdrop(): void {
        if (!this.backdrop) {
            return;
        }

        // Create the leave animation and attach it to the player
        this.player = this.animationBuilder
            .build([animate('300ms ease', style({opacity: 0}))])
            .create(this.backdrop);

        // Play the animation
        this.player.play();

        // Once the animation is done...
        this.player.onDone(() => {
            // If the backdrop still exists...
            if (this.backdrop) {
                // Remove the backdrop
                this.backdrop.parentNode.removeChild(this.backdrop);
                this.backdrop = null;
            }
        });

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    private _showSidebar(): void {
        // Remove the box-shadow style
        this.renderer.removeStyle(this.elementRef.nativeElement, 'box-shadow');

        // Make the sidebar invisible
        this.renderer.removeStyle(this.elementRef.nativeElement, 'visibility');

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    private _hideSidebar(delay = true): void {
        const delayAmount = delay ? 300 : 0;

        // Add a delay so close animation can play
        setTimeout(() => {
            // Remove the box-shadow
            this.renderer.setStyle(
                this.elementRef.nativeElement,
                'box-shadow',
                'none'
            );

            // Make the sidebar invisible
            this.renderer.setStyle(
                this.elementRef.nativeElement,
                'visibility',
                'hidden'
            );
        }, delayAmount);

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Enable the animations
     *
     * @private
     */
    private _enableAnimations(): void {
        // Return if animations already enabled
        if (this.animationsEnabled) {
            return;
        }

        // Enable the animations
        this.animationsEnabled = true;

        // Mark for check
        this.changeDetectorRef.markForCheck();
    }
}
