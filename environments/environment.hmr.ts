/*
 *   @license Hive
 *   (c) 2010-2020 ApplicationHive. http://applicationhive.com
 *   License: GNU LESSER GENERAL PUBLIC LICENSE
 *                Version 3, 29 June 2007
 */

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import {env} from './.env';

export const environment = {
  production: false,
  hmr: true,
  useHash: false,
  version: env.npm_package_version + '-dev',
  serverDataTimeout: 1000,
  SERVER_URL: 'http://localhost:3000',
  SIGNALR_SERVER: 'https://localhost:44304',
  API_URL: '/api',
  LOGIN_URL: '/api/account/login',
  defaultLanguage: 'tr-TR',
  supportedLanguages: ['tr-TR', 'en-US'],
  interceptRequestTime: false,
  use_hive_cms: env.use_hive_cms,
  use_hive_server_side_toast: true,
  use_hive_demos: env.hive_demos_included,
  disableMaterialRipple: env.disableMaterialRipple,
  use_hive_partial_login: env.use_hive_partial_login,
  use_signalr: env.use_signalr
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
