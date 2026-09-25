import { PedagogicalArticle } from '../../types';
import { enArticles } from './en';
import { esArticles } from './es';
import { ptArticles } from './pt';
import { deArticles } from './de';
import { itArticles } from './it';
import { nlArticles } from './nl';
import { ruArticles } from './ru';
import { trArticles } from './tr';
import { arArticles } from './ar';
import { zhArticles } from './zh';
import { jaArticles } from './ja';
import { koArticles } from './ko';
import { hiArticles } from './hi';
import { elArticles } from './el';
import { ukArticles } from './uk';
import { svArticles, daArticles, noArticles, fiArticles } from './nordic';
import { plArticles, csArticles, skArticles, huArticles, roArticles, heArticles } from './eastEurope';

export const ARTICLES_TRANSLATIONS: Record<string, PedagogicalArticle[]> = {
  en: enArticles,
  es: esArticles,
  pt: ptArticles,
  de: deArticles,
  it: itArticles,
  nl: nlArticles,
  ru: ruArticles,
  tr: trArticles,
  ar: arArticles,
  zh: zhArticles,
  ja: jaArticles,
  ko: koArticles,
  hi: hiArticles,
  el: elArticles,
  uk: ukArticles,
  sv: svArticles,
  da: daArticles,
  no: noArticles,
  fi: fiArticles,
  pl: plArticles,
  cs: csArticles,
  sk: skArticles,
  hu: huArticles,
  ro: roArticles,
  he: heArticles,
};

/**
 * Returns translated articles for a given locale or falls back to French or English.
 */
export function getTranslatedArticlesByLocale(locale: string): PedagogicalArticle[] | undefined {
  if (!locale || locale.startsWith('fr')) {
    return undefined; // use base FR articles
  }
  
  const code = locale.toLowerCase().split('-')[0];
  return ARTICLES_TRANSLATIONS[code] || ARTICLES_TRANSLATIONS[locale] || ARTICLES_TRANSLATIONS.en;
}
