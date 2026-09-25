import { fr } from './fr';
import { en } from './en';
import { es } from './es';
import { pt } from './pt';
import { ptBR } from './ptBR';
import { de } from './de';
import { it } from './it';
import { nl } from './nl';
import { sv } from './sv';
import { da } from './da';
import { no } from './no';
import { fi } from './fi';
import { pl } from './pl';
import { cs } from './cs';
import { sk } from './sk';
import { hu } from './hu';
import { ro } from './ro';
import { tr } from './tr';
import { ru } from './ru';
import { el } from './el';
import { uk } from './uk';
import { zhCN } from './zhCN';
import { zhTW } from './zhTW';
import { ja } from './ja';
import { ko } from './ko';
import { hi } from './hi';
import { ar } from './ar';
import { he } from './he';

export type TranslationDictionary = typeof en;

export const translations: Record<string, any> = {
  fr,
  en,
  es,
  pt,
  'pt-BR': ptBR,
  de,
  it,
  nl,
  sv,
  da,
  no,
  fi,
  pl,
  cs,
  sk,
  hu,
  ro,
  el,
  tr,
  ru,
  uk,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  ja,
  ko,
  hi,
  ar,
  he,
};

export function getDictionary(locale: string): TranslationDictionary {
  if (translations[locale]) {
    return translations[locale];
  }
  // Try language prefix (e.g. 'pt-BR' -> 'pt' or 'fr-CA' -> 'fr')
  const prefix = locale.split('-')[0];
  if (translations[prefix]) {
    return translations[prefix];
  }
  // Fallback to English, then French
  return translations.en || translations.fr;
}
