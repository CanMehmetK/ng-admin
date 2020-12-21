import { env } from './.env';

export const environment = {
  production: true,
  hmr: false,
  useHash: false,
  version: env.npm_package_version + '-prod',
  serverDataTimeout: 300000, // 5 minutes...
  SERVER_URL: 'https://api.example.com.tr',
  SIGNALR_SERVER: 'https://api.example.com.tr:44304',
  API_URL: '/api',
  LOGIN_URL: '/api/account/login',
  defaultLanguage: 'tr-TR',
  supportedLanguages: ['tr-TR', 'en-US'],
  interceptRequestTime: true,
  use_hive_server_side_toast: true,
  use_hive_cms: env.use_hive_cms,
  use_hive_demos: env.hive_demos_included,
  disableMaterialRipple: env.disableMaterialRipple,
  use_hive_partial_login: env.use_hive_partial_login,
  use_signalr: env.use_signalr,
};
