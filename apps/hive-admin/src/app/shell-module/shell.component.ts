/*
 *   @license Hive
 *   (c) 2010-2020 ApplicationHive. http://applicationhive.com
 *   License: GNU LESSER GENERAL PUBLIC LICENSE
 *                Version 3, 29 June 2007
 */

import { Component, ComponentFactoryResolver, Directive, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { environment } from '@environments/environment';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { IHiveConfig } from '@hivelib';
import { VerticalLayout1Component } from '@hive/shell-module/layouts/vertical/layout-1/layout-1.component';
import { HttpClient } from '@angular/common/http';

@Directive({ selector: '[layout-host]' })
export class LayoutHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}

@Component({
  selector: 'hive-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent implements OnInit {
  env = environment;
  appConfig: IHiveConfig;
  dragging = false;
  @ViewChild(LayoutHostDirective, { static: true }) layoutHost: LayoutHostDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.loadLayout();
    this.loadApps();
  }

  toggleSidebarOpen(themeOptionsPanel: string) {

  }

  handleDragStart($event: CdkDragStart) {

  }

  private loadLayout() {

    // TODO: Component Type from Name
    let componentFactory;
    /*
   if (this.appConfig.layout.style === 'horizontal-1') {
     componentFactory = this.componentFactoryResolver.resolveComponentFactory(HorizontalLayout1Component);
   } else if (this.appConfig.layout.style === 'vertical-3') {
     componentFactory = this.componentFactoryResolver.resolveComponentFactory(VerticalLayout3Component);
   } else if (this.appConfig.layout.style === 'vertical-2') {
     componentFactory = this.componentFactoryResolver.resolveComponentFactory(VerticalLayout2Component);
   } else if (this.appConfig.layout.style === 'vertical-1') {
     componentFactory = this.componentFactoryResolver.resolveComponentFactory(VerticalLayout1Component);
   }
   */
    componentFactory = this.componentFactoryResolver.resolveComponentFactory(VerticalLayout1Component);
    const viewContainerRef = this.layoutHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
  }

  private loadApps() {
    this.httpClient.get('/api/app-list').subscribe((response) => {
      console.log(response);
    });
  }
}
