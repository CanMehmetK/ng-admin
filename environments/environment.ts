// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
import { env } from './.env';

export const environment = {
  production: false,
  hmr: true,
  useHash: false,
  version: env.npm_package_version + '-dev',
  serverDataTimeout: 1000,
  SERVER_URL: 'https://localhost:3000',
  SIGNALR_SERVER: 'https://localhost:44304',
  API_URL: '/api',
  LOGIN_URL: '/api/account/login',
  defaultLanguage: 'tr-TR',
  supportedLanguages: ['tr-TR', 'en-US'],
  interceptRequestTime: true,
  use_hive_cms: env.use_hive_cms,
  use_hive_server_side_toast: true,
  use_hive_demos: env.hive_demos_included,
  disableMaterialRipple: env.disableMaterialRipple,
  use_hive_partial_login: env.use_hive_partial_login,
  use_signalr: env.use_signalr,
  /**
   * Timeout for server activity.
   * If the server hasn't sent a message in this interval, the client considers the server disconnected and triggers the onclose event.
   * This value must be large enough for a ping message to be sent from the server and received by the client within the timeout interval.
   * The recommended value is a number at least double the server's KeepAliveInterval value to allow time for pings to arrive.
   * 0 means : Default 30 seconds (30,000 milliseconds)
   */
  serverTimeoutInMilliseconds: 0,
  /**
   * Determines the interval at which the client sends ping messages.
   * Sending any message from the client resets the timer to the start of the interval.
   * If the client hasn't sent a message in the ClientTimeoutInterval set on the server, the server considers the client disconnected.
   * 0 means : Default 15 seconds (15,000 milliseconds)
   */
  keepAliveIntervalInMilliseconds: 0
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
