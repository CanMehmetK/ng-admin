/*
 *   @license Hive
 *   (c) 2010-2020 ApplicationHive. http://applicationhive.com
 *   License: GNU LESSER GENERAL PUBLIC LICENSE
 *                Version 3, 29 June 2007
 */

export interface IHiveConfig {
  appName?: string;
  dir?: 'ltr' | 'rtl';
  theme?: 'light' | 'dark';
  colorTheme?: string;
  customScrollbars?: boolean;
  layout: {
    style?: string | 'vertical-1' | 'vertical-2' | 'vertical-3' | 'horizontal-1'
    width: 'fullwidth' | 'boxed';
    navbar: {
      primaryBackground: string;
      secondaryBackground: string;
      hidden: boolean;
      folded: boolean;
      position: 'left' | 'right' | 'top';
      variant: string;
      showUserPanel?: boolean;
      sidenavOpened?: boolean;
      sidenavCollapsed?: boolean;
    };
    toolbar: {
      customBackgroundColor: boolean;
      background: string;
      hidden: boolean;
      position:
        | 'above'
        | 'above-static'
        | 'above-fixed'
        | 'below'
        | 'below-static'
        | 'below-fixed';
    };
    footer: {
      customBackgroundColor: boolean;
      background: string;
      hidden: boolean;
      position:
        | 'above'
        | 'above-static'
        | 'above-fixed'
        | 'below'
        | 'below-static'
        | 'below-fixed';
    };
    sidepanel: {
      hidden: boolean;
      position: 'left' | 'right';
    };
  };
  // *********************** -----
  navPos?: 'side' | 'top';
  showHeader?: boolean;
  headerPos?: 'fixed' | 'static' | 'above';
  showUserPanel?: boolean;
  sidenavOpened?: boolean;
  sidenavCollapsed?: boolean;
  isOver?: boolean;
}
