import {Component, HostBinding, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {customAnimations} from '@hive/helper-util/animations';
import {HiveConfigService} from '@hive/services/config.service';
import { IHiveConfig, IHiveMenuItem } from '@hivelib';

@Component({
  selector: 'hive-nav-horizontal-collapsable',
  templateUrl: './collapsable.component.html',
  styleUrls: ['./collapsable.component.scss'],
  animations: customAnimations,
})
export class HiveNavHCollapsableComponent implements OnInit, OnDestroy {
  appConfig: IHiveConfig;
  isOpen = false;

  @HostBinding('class') classes = 'nav-collapsable nav-item';
  @Input() item: IHiveMenuItem;

  // Private
  private unsubscribeAll: Subject<any>;

  constructor(private hiveConfigService: HiveConfigService) {
    // Set the private defaults
    this.unsubscribeAll = new Subject();
  }


  ngOnInit(): void {
    // Subscribe to config changes
    this.hiveConfigService.config.pipe(takeUntil(this.unsubscribeAll)).subscribe((config: IHiveConfig) => {
      this.appConfig = config;
    });
  }


  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }




  @HostListener('mouseenter')
  open(): void {
    this.isOpen = true;
  }


  @HostListener('mouseleave')
  close(): void {
    this.isOpen = false;
  }
}
