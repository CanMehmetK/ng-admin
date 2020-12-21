/*
 *   @license Hive
 *   (c) 2010-2020 ApplicationHive. http://applicationhive.com
 *   License: GNU LESSER GENERAL PUBLIC LICENSE
 *                Version 3, 29 June 2007
 */

export interface ResultViewModel {
  Type: string;
  HasError: boolean;
  ExceptionString: string;
  Toast: 'none' | 'success' | 'info' | 'warning' | 'error';
  Exception: IException;
  MessageTitle: string;
  Message: string;
}

interface IException {
  Message: string;
  InnerException?: IException;
}

/*

 */
export class ResultViewModelGeneric<ResultType> {
  Type?: string;
  HasError?: boolean;
  ExceptionString?: string;
  Toast?: 'none' | 'success' | 'info' | 'warning' | 'error';
  Exception?: IException;
  MessageTitle?: string;
  Message?: string;
  Data?: ResultType;
}

interface IException {
  Message: string;
  InnerException?: IException;
}
