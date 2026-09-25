import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  LanguageDefinition,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  detectBrowserLanguage,
} from './languages';
import { getDictionary, translations } from './translations';

interface LanguageContextType {
  locale: string;
  language: string;
  currentLanguage: LanguageDefinition;
  detectedLanguage: LanguageDefinition;
  hasChosenLanguage: boolean;
  isRTL: boolean;
  isLanguageModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
  setLocale: (code: string, markChosen?: boolean) => void;
  confirmDetectedLanguage: () => void;
  t: (keyPath: string, params?: Record<string, string | number>) => string;
  tArray: <T = string>(keyPath: string, fallback?: T[]) => T[];
  formatDate: (date: string | Date | number, options?: Intl.DateTimeFormatOptions) => string;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY_LOCALE = 'baby_swim_locale';
const STORAGE_KEY_CHOSEN = 'baby_swim_language_chosen';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const detected = useMemo(() => detectBrowserLanguage(), []);
  
  const [locale, setLocaleState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        let q = params.get('lang') || params.get('locale');
        if (q) {
          q = q.trim();
          if (q.toLowerCase() === 'zh' || q.toLowerCase() === 'zh-cn' || q.toLowerCase() === 'zh_cn') q = 'zhCN';
          if (q.toLowerCase() === 'pt' || q.toLowerCase() === 'pt-br' || q.toLowerCase() === 'pt_br') q = 'ptBR';
          const matched = SUPPORTED_LANGUAGES.find((l) => l.code.toLowerCase() === q!.toLowerCase());
          if (matched) return matched.code;
        }
      } catch (_) {}
      const saved = localStorage.getItem(STORAGE_KEY_LOCALE);
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved;
      }
    }
    return detected.code;
  });

  const [hasChosenLanguage, setHasChosenLanguage] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('lang') || params.get('locale')) {
          return true;
        }
      } catch (_) {}
      return localStorage.getItem(STORAGE_KEY_CHOSEN) === 'true';
    }
    return false;
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState<boolean>(false);

  const currentLanguage = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === locale) ||
      SUPPORTED_LANGUAGES.find((l) => l.code === DEFAULT_LANGUAGE) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [locale]);

  const isRTL = Boolean(currentLanguage.isRTL);

  // Sync HTML dir and lang attributes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
      if (isRTL) {
        document.body.classList.add('rtl-layout');
      } else {
        document.body.classList.remove('rtl-layout');
      }
    }
  }, [locale, isRTL]);

  const setLocale = useCallback((code: string, markChosen = true) => {
    const lang = SUPPORTED_LANGUAGES.find((l) => l.code === code);
    if (!lang) return;

    setLocaleState(code);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY_LOCALE, code);
      if (markChosen) {
        localStorage.setItem(STORAGE_KEY_CHOSEN, 'true');
        setHasChosenLanguage(true);
      }
    }
  }, []);

  const confirmDetectedLanguage = useCallback(() => {
    setLocale(detected.code, true);
    setIsLanguageModalOpen(false);
  }, [detected, setLocale]);

  const openLanguageModal = useCallback(() => {
    setIsLanguageModalOpen(true);
  }, []);

  const closeLanguageModal = useCallback(() => {
    setIsLanguageModalOpen(false);
  }, []);

  // Nested translation helper with parameter interpolation and fallback
  const t = useCallback(
    (keyPath: string, params?: Record<string, string | number>): string => {
      const dict = getDictionary(locale);
      const fallbackDict = getDictionary(FALLBACK_LANGUAGE);
      const frenchDict = getDictionary(DEFAULT_LANGUAGE);

      const keys = keyPath.split('.');
      
      let val: any = dict;
      for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
          val = val[k];
        } else {
          val = undefined;
          break;
        }
      }

      // Try English fallback
      if (val === undefined) {
        let fVal: any = fallbackDict;
        for (const k of keys) {
          if (fVal && typeof fVal === 'object' && k in fVal) {
            fVal = fVal[k];
          } else {
            fVal = undefined;
            break;
          }
        }
        val = fVal;
      }

      // Try French fallback
      if (val === undefined) {
        let frVal: any = frenchDict;
        for (const k of keys) {
          if (frVal && typeof frVal === 'object' && k in frVal) {
            frVal = frVal[k];
          } else {
            frVal = undefined;
            break;
          }
        }
        val = frVal;
      }

      if (Array.isArray(val)) {
        return val as any;
      }

      if (typeof val !== 'string') {
        return keyPath;
      }

      // Replace {paramName}
      if (params) {
        return val.replace(/\{(\w+)\}/g, (_, key) => {
          return key in params ? String(params[key]) : `{${key}}`;
        });
      }

      return val;
    },
    [locale]
  );

  // Array / list translation helper
  const tArray = useCallback(
    <T = string>(keyPath: string, fallback: T[] = []): T[] => {
      const keys = keyPath.split('.');
      const dict = getDictionary(locale);
      const fallbackDict = getDictionary(FALLBACK_LANGUAGE);
      const frenchDict = getDictionary(DEFAULT_LANGUAGE);

      let val: any = dict;
      for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
          val = val[k];
        } else {
          val = undefined;
          break;
        }
      }

      if (val === undefined) {
        let fVal: any = fallbackDict;
        for (const k of keys) {
          if (fVal && typeof fVal === 'object' && k in fVal) {
            fVal = fVal[k];
          } else {
            fVal = undefined;
            break;
          }
        }
        val = fVal;
      }

      if (val === undefined) {
        let frVal: any = frenchDict;
        for (const k of keys) {
          if (frVal && typeof frVal === 'object' && k in frVal) {
            frVal = frVal[k];
          } else {
            frVal = undefined;
            break;
          }
        }
        val = frVal;
      }

      if (Array.isArray(val)) {
        return val as T[];
      }
      return fallback;
    },
    [locale]
  );

  // Localized date formatting
  const formatDate = useCallback(
    (date: string | Date | number, options?: Intl.DateTimeFormatOptions): string => {
      try {
        const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
        if (isNaN(d.getTime())) return String(date);

        const defaultOptions: Intl.DateTimeFormatOptions = options || {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        };

        return new Intl.DateTimeFormat(locale, defaultOptions).format(d);
      } catch (e) {
        return String(date);
      }
    },
    [locale]
  );

  // Localized number formatting
  const formatNumber = useCallback(
    (num: number, options?: Intl.NumberFormatOptions): string => {
      try {
        return new Intl.NumberFormat(locale, options).format(num);
      } catch (e) {
        return String(num);
      }
    },
    [locale]
  );

  return (
    <LanguageContext.Provider
      value={{
        locale,
        language: locale,
        currentLanguage,
        detectedLanguage: detected,
        hasChosenLanguage,
        isRTL,
        isLanguageModalOpen,
        openLanguageModal,
        closeLanguageModal,
        setLocale,
        confirmDetectedLanguage,
        t,
        tArray,
        formatDate,
        formatNumber,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
