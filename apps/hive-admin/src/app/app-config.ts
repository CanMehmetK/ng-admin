/**
 * Default Hive Configuration
 */
import { IHiveConfig } from '@hivelib';

export const hiveAppConfig: IHiveConfig = {
  appName: 'HiveApps',
  theme: 'light',
  // Color themes can be defined in src/app/app.theme.scss
  colorTheme: 'theme-default',
  customScrollbars: true,
  dir: 'ltr',
  layout: {
    style: 'vertical-1',
    width: 'fullwidth',
    navbar: {
      primaryBackground: 'hive-navy-800',
      secondaryBackground: 'indigo-500',
      folded: false,
      hidden: false,
      position: 'left',
      variant: 'vertical-style-1',
      showUserPanel: true,
    },
    toolbar: {
      customBackgroundColor: false,
      background: 'indigo-500',
      hidden: false,
      position: 'below-fixed',
    },
    footer: {
      customBackgroundColor: true,
      background: 'indigo-500',
      hidden: false,
      position: 'below-fixed',
    },
    sidepanel: {
      hidden: false,
      position: 'right',
    },
  },
};
