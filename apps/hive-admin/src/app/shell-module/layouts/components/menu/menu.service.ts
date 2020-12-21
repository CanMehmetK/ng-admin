/*
 *   @license Hive
 *   (c) 2010-2020 ApplicationHive. http://applicationhive.com
 *   License: GNU LESSER GENERAL PUBLIC LICENSE
 *                Version 3, 29 June 2007
 */

import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {CredentialsService} from '@hive/auth/credentials.service';
import {IHiveMenu, IHiveMenuItem} from '@hivelib';

@Injectable({providedIn: 'root'})
export class HiveMenuService {
  onItemCollapsed: Subject<any>;
  onItemCollapseToggled: Subject<any>;
  private mainNavigation: IHiveMenu[] = [];
  private currentMenuKey: string;
  private menuRegistry: { [key: string]: any } = {};
  private menuChanged: BehaviorSubject<any>;
  private menuRegistered: BehaviorSubject<any>;
  private menuUnregistered: BehaviorSubject<any>;
  private menunavigationItemAdded: BehaviorSubject<any>;
  private menuItemUpdated: BehaviorSubject<any>;
  private menuItemRemoved: BehaviorSubject<any>;

  constructor(private credentialsService: CredentialsService) {
    // Set the defaults
    this.onItemCollapsed = new Subject();
    this.onItemCollapseToggled = new Subject();
    this.currentMenuKey = null;
    this.menuChanged = new BehaviorSubject(null);
    this.menuRegistered = new BehaviorSubject(null);
    this.menuUnregistered = new BehaviorSubject(null);
    this.menunavigationItemAdded = new BehaviorSubject(null);
    this.menuItemUpdated = new BehaviorSubject(null);
    this.menuItemRemoved = new BehaviorSubject(null);

    this.credentialsService.currentCredentialsChanged.subscribe(t => {
      console.log('currentCredentialsChanged:Do Menu init');
      this.initNavigation();
    });
  }

  get onNavigationChanged(): Observable<any> {
    return this.menuChanged.asObservable();
  }

  get onNavigationRegistered(): Observable<any> {
    return this.menuRegistered.asObservable();
  }

  get onNavigationUnregistered(): Observable<any> {
    return this.menuUnregistered.asObservable();
  }

  get onNavigationItemAdded(): Observable<any> {
    return this.menunavigationItemAdded.asObservable();
  }

  get onNavigationItemUpdated(): Observable<any> {
    return this.menuItemUpdated.asObservable();
  }

  get onNavigationItemRemoved(): Observable<any> {
    return this.menuItemRemoved.asObservable();
  }

  initNavigation(initialApp?: string) {
    if (this.credentialsService.credentials.UserMenu) {
      for (let i = 0, len = this.credentialsService.credentials.UserMenu.length; i < len; i++) {
        const appMenu = this.credentialsService.credentials.UserMenu[i];
        if (this.queryregister(appMenu.app)) this.unregister(appMenu.app);
        this.register(appMenu.app, appMenu);
        this.menuRegistered.next([appMenu.app, [appMenu]]);
        console.log('Registered AppMenu:', this.credentialsService.credentials.UserMenu[i].app)
      }
    }
  }

  register(key, navigation): void {
    // Check if the key already being used
    if (this.menuRegistry[key]) {
      console.error(`The navigation  '${key}' already exists. Either unregister it first or use a unique key.`);
      return;
    }
    if (key === 'main') {
      console.log('main->split by app');
      this.mainNavigation = navigation;
      this.menuRegistry[key] = [];
      for (let i = 0, len = navigation.length; i < len; i++) {
        this.menuRegistry[navigation[i].app] = [navigation[i]];
        this.menuRegistered.next([navigation[i].app, [navigation[i]]]);
      }
    } else {
      // Add to the registry
      this.menuRegistry[key] = navigation;
      // Notify the subject
      this.menuRegistered.next([key, navigation]);
    }
  }

  unregister(key): void {
    if (!this.menuRegistry[key]) {
      console.warn(`The navigation  '${key}' doesn't exist.`);
    }

    // Unregister the sidebar
    delete this.menuRegistry[key];

    // Notify the subject
    this.menuUnregistered.next(key);
  }

  queryregister(key) {
    return this.menuRegistry[key];
  }

  getNavigation(key): any {
    // Check if the navigation exists
    if (!this.menuRegistry[key]) {
      console.warn(`The navigation  '${key}' doesn't exist.`);
      return;
    }

    // Return the sidebar
    return this.menuRegistry[key];
  }

  getFlatNavigation(navigation, flatNavigation: IHiveMenuItem[] = []): any {
    for (const item of navigation) {
      if (item.type === 'item') {
        flatNavigation.push(item);
        continue;
      }

      if (item.type === 'collapsable' || item.type === 'group') {
        if (item.children) {
          this.getFlatNavigation(item.children, flatNavigation);
        }
      }
    }

    return flatNavigation;
  }

  getCurrentNavigation(): any {
    if (!this.currentMenuKey) {
      console.warn(`The current navigation is not set.`);
      return;
    }
    return this.getNavigation(this.currentMenuKey);
  }

  setCurrentNavigation(key): void {
    if (Object.keys(this.menuRegistry).length === 0){
      this.initNavigation();
    }
    if (!this.menuRegistry[key]) {
      console.warn(`The navigation  '${key}' doesn't exist.`);
      return;
    }

    // Set the current navigation key
    this.currentMenuKey = key;

    // Notify the subject
    this.menuChanged.next(key);
  }

  getNavigationItem(id, navigation = null): any | boolean {
    if (!navigation) {
      navigation = this.getCurrentNavigation();
    }

    for (const item of navigation) {
      if (item.id === id) {
        return item;
      }

      if (item.children) {
        const childItem = this.getNavigationItem(id, item.children);

        if (childItem) {
          return childItem;
        }
      }
    }

    return false;
  }

  getNavigationItemParent(id, navigation = null, parent = null): any {
    if (!navigation) {
      navigation = this.getCurrentNavigation();
      parent = navigation;
    }

    for (const item of navigation) {
      if (item.id === id) {
        return parent;
      }

      if (item.children) {
        const childItem = this.getNavigationItemParent(id, item.children, item);

        if (childItem) {
          return childItem;
        }
      }
    }

    return false;
  }

  addNavigationItem(item, id): void {
    // Get the current navigation
    const navigation: any[] = this.getCurrentNavigation();

    // Add to the end of the navigation
    if (id === 'end') {
      navigation.push(item);

      // Trigger the observable
      this.menunavigationItemAdded.next(true);

      return;
    }

    // Add to the start of the navigation
    if (id === 'start') {
      navigation.unshift(item);

      // Trigger the observable
      this.menunavigationItemAdded.next(true);

      return;
    }

    // Add it to a specific location
    const parent: any = this.getNavigationItem(id);

    if (parent) {
      // Check if parent has a children entry,
      // and add it if it doesn't
      if (!parent.children) {
        parent.children = [];
      }

      // Add the item
      parent.children.push(item);
    }

    // Trigger the observable
    this.menunavigationItemAdded.next(true);
  }

  updateNavigationItem(id, properties): void {
    // Get the navigation item
    const navigationItem = this.getNavigationItem(id);

    // If there is no navigation with the give id, return
    if (!navigationItem) {
      return;
    }
    Object.assign({}, navigationItem, properties);

    // Trigger the observable
    this.menuItemUpdated.next(true);
  }

  removeNavigationItem(id): void {
    const item = this.getNavigationItem(id);
    if (!item) {
      return;
    }

    let parent = this.getNavigationItemParent(id);

    parent = parent.children || parent;
    parent.splice(parent.indexOf(item), 1);

    this.menuItemRemoved.next(true);
  }

  getMenuLevel(routeArr: string[]): string[] {
    const navigation = this.getCurrentNavigation();
    const tmpArr = [];
    navigation.forEach(item => {
      if (item.route === routeArr[0]) {
        tmpArr.push(item.name);
        // Level1
        if (item.children && item.children.length) {
          item.children.forEach(itemlvl1 => {
            if (routeArr[1] && itemlvl1.route === routeArr[1]) {
              tmpArr.push(itemlvl1.name);
              // Level2
              if (itemlvl1.children && itemlvl1.children.length) {
                itemlvl1.children.forEach(itemlvl2 => {
                  if (routeArr[2] && itemlvl2.route === routeArr[2]) {
                    tmpArr.push(itemlvl2.name);
                  }
                });
              }
            } else if (routeArr[1]) {
              // Level2
              if (itemlvl1.children && itemlvl1.children.length) {
                itemlvl1.children.forEach(itemlvl2 => {
                  if (itemlvl2.route === routeArr[1]) {
                    tmpArr.push(itemlvl1.name, itemlvl2.name);
                  }
                });
              }
            }
          });
        }
      }
    });
    return tmpArr;
  }
}
