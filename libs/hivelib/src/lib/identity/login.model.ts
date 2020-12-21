/*
 *   @license Hive
 *   (c) 2010-2020 ApplicationHive. http://applicationhive.com
 *   License: GNU LESSER GENERAL PUBLIC LICENSE
 *                Version 3, 29 June 2007
 */

import {IHiveMenu} from "@hivelib";

export interface LoginModel {
  username: string;
  password: string;
  remember?: boolean;
}

export interface ICredentialsModel {
  // Customize received credentials here
  Id: string; // Guid
  Adi: string;
  Soyadi: string;
  Email: string;
  Username: string;
  Token: string;
  UserMenu:IHiveMenu[];
}

export class IdentityAppModel {
  Id?: string; // Guid
  Start?:string;
  Name?: string;
  Title?: string; // For view
  Icon?: string; // LogoUrl
}


