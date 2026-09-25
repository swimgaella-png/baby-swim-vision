export interface LanguageDefinition {
  code: string;
  nativeName: string;
  englishName: string;
  flag: string;
  isRTL?: boolean;
  isReady: boolean; // MVP Complete vs In Preparation
  region?: string;
  dateFormat?: string;
}

export const SUPPORTED_LANGUAGES: LanguageDefinition[] = [
  {
    code: 'fr',
    nativeName: 'Français',
    englishName: 'French',
    flag: '🇫🇷',
    isReady: true,
    dateFormat: 'dd/MM/yyyy'
  },
  {
    code: 'en',
    nativeName: 'English',
    englishName: 'English',
    flag: '🇬🇧',
    isReady: true,
    dateFormat: 'MM/dd/yyyy'
  },
  {
    code: 'es',
    nativeName: 'Español',
    englishName: 'Spanish',
    flag: '🇪🇸',
    isReady: true,
    dateFormat: 'dd/MM/yyyy'
  },
  {
    code: 'pt',
    nativeName: 'Português',
    englishName: 'Portuguese',
    flag: '🇵🇹',
    isReady: true,
    dateFormat: 'dd/MM/yyyy'
  },
  {
    code: 'pt-BR',
    nativeName: 'Português (Brasil)',
    englishName: 'Portuguese (Brazil)',
    flag: '🇧🇷',
    isReady: true,
    dateFormat: 'dd/MM/yyyy'
  },
  {
    code: 'de',
    nativeName: 'Deutsch',
    englishName: 'German',
    flag: '🇩🇪',
    isReady: true,
    dateFormat: 'dd.MM.yyyy'
  },
  {
    code: 'zh-CN',
    nativeName: '中文（简体）',
    englishName: 'Chinese (Simplified)',
    flag: '🇨🇳',
    isReady: true,
    dateFormat: 'yyyy/MM/dd'
  },
  {
    code: 'ja',
    nativeName: '日本語',
    englishName: 'Japanese',
    flag: '🇯🇵',
    isReady: true,
    dateFormat: 'yyyy/MM/dd'
  }
];

export const DEFAULT_LANGUAGE = 'fr';
export const FALLBACK_LANGUAGE = 'en';

export function detectBrowserLanguage(): LanguageDefinition {
  if (typeof window === 'undefined' || !window.navigator) {
    return SUPPORTED_LANGUAGES[0];
  }

  const browserLang = (window.navigator.language || (window.navigator as any).userLanguage || '').toLowerCase();
  
  // Exact match (e.g., pt-BR or zh-CN)
  const exact = SUPPORTED_LANGUAGES.find(
    (l) => l.code.toLowerCase() === browserLang
  );
  if (exact) return exact;

  // Prefix match (e.g. 'fr-FR' -> 'fr')
  const primaryCode = browserLang.split('-')[0];
  const primary = SUPPORTED_LANGUAGES.find(
    (l) => l.code.toLowerCase() === primaryCode
  );
  if (primary) return primary;

  // Default to French or English
  return SUPPORTED_LANGUAGES[0];
}
