import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';


import * as enUS from '../../assets/translations/tr-TR.json';
import * as trTR from '../../assets/translations/tr-TR.json';

import {Logger} from '@hive/services/logger.service';

const log = new Logger('I18nService');
const languageKey = 'language';

export function extract(s: string) {
  return s;
}

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  defaultLanguage!: string;
  supportedLanguages!: string[];

  private langChangeSubscription!: Subscription;

  constructor(private translateService: TranslateService) {
    // Embed languages to avoid extra HTTP requests
    translateService.setTranslation('tr-TR', trTR);
    translateService.setTranslation('en-US', enUS);
  }

  init(defaultLanguage: string, supportedLanguages: string[]) {
    this.defaultLanguage = defaultLanguage;
    this.supportedLanguages = supportedLanguages;
    this.language = '';

    // Warning: this subscription will always be alive for the app's lifetime
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(
      (event: LangChangeEvent) => {
        localStorage.setItem(languageKey, event.lang);
      }
    );
  }


  destroy() {
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }

  set language(language: string) {
    language =
      language ||
      localStorage.getItem(languageKey) ||
      this.translateService.getBrowserCultureLang();
    let isSupportedLanguage = this.supportedLanguages.includes(language);

    // If no exact match is found, search without the region
    if (language && !isSupportedLanguage) {
      language = language.split('-')[0];
      language =
        this.supportedLanguages.find((supportedLanguage) =>
          supportedLanguage.startsWith(language)
        ) || '';
      isSupportedLanguage = Boolean(language);
    }

    // Fallback if language is not supported
    if (!isSupportedLanguage) {
      language = this.defaultLanguage;
    }

    log.debug(`Language set to ${language}`);
    this.translateService.use(language);
  }

  get language(): string {
    return this.translateService.currentLang;
  }
}
