import {Inject, Injectable, InjectionToken} from '@angular/core';
import {Router} from '@angular/router';
import {Platform} from '@angular/cdk/platform';
import {BehaviorSubject, Observable} from 'rxjs';
import {IHiveConfig} from '@hivelib';


// Create the injection token for the custom settings
export const HIVE_CONFIG = new InjectionToken('hiveCustomConfig');

@Injectable({providedIn: 'root'})

export class HiveConfigService {
  // Private
  private readonly configSubject: BehaviorSubject<IHiveConfig>;
  private readonly defaultConfiguration: IHiveConfig;

  constructor(
    private platform: Platform,
    private router: Router,
    @Inject(HIVE_CONFIG) private configuration?: IHiveConfig,
  ) {
    // Set the default config from the user provided config (from forRoot)
    this.defaultConfiguration = configuration;

    if (this.platform.ANDROID || this.platform.IOS) {
      this.defaultConfiguration.customScrollbars = false;
    }

    // Set the config from the default config
    this.configSubject = new BehaviorSubject(
      Object.assign({}, this.defaultConfiguration),
    );
  }

  get config(): any | Observable<any> {
    return this.configSubject.asObservable();
  }

  set config(value) {
    // Get the value from the behavior subject
    let config = this.configSubject.getValue();

    // Merge the new config
    config = Object.assign({}, config, value);

    // Notify the observers
    this.configSubject.next(config);
  }

  get defaultConfig(): any {
    return this.defaultConfiguration;
  }

  setConfig(value: IHiveConfig, opts = {emitEvent: true}): void {
    // Get the value from the behavior subject
    let config = this.configSubject.getValue();

    // Merge the new config
    config = Object.assign({}, config, value);

    // If emitEvent option is true...
    if (opts.emitEvent === true) {
      // Notify the observers
      this.configSubject.next(config);
    }
  }

  setNavState(type: string, value: boolean) {
    this.configSubject.next({type, value} as any);
  }

  getConfig(): Observable<IHiveConfig> {
    return this.configSubject.asObservable();
  }

  resetToDefaults(): void {
    // Set the config from the default config
    this.configSubject.next(Object.assign({}, this.defaultConfig));
  }

  destroy() {
    if (this.configSubject) {
      this.configSubject.unsubscribe();
    }
  }

}
