/**
 * @license Hive
 * (c) 2010-2020 ApplicationHive. http://applicationhive.com
 * License: GNU LESSER GENERAL PUBLIC LICENSE
 *              Version 3, 29 June 2007
 */
export interface CredentialsModel {
  // Customize received credentials here
  Adi: string;
  Soyadi: string;
  Email: string;
  Username: string;
  Id: string; // Guid
  Token: string;
  BolgeId?: number;
  SubeId?: number;
  Firmas: CredentialDetayViewModel[];
  Apps: CredentialDetayViewModel[];
  AppList: CredentialDetayViewModel[];
}

export class CredentialDetayViewModel {
  Id: string; // Guid
  Name: string;
  Title?: string; // For view
  Icon?: string; // LogoUrl
}
