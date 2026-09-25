import { LocalizedCategory, LocalizedSituation, LocalizedExercise } from '../pedagogicalDatabase';
import { esSkillCategories, esSituations, esExercises } from './es';
import { deSkillCategories, deSituations, deExercises } from './de';
import { ptSkillCategories, ptSituations, ptExercises } from './pt';
import { itSkillCategories, itSituations, itExercises } from './it';
import { zhSkillCategories, zhSituations, zhExercises } from './zh';
import { jaSkillCategories, jaSituations, jaExercises } from './ja';
import { multiSkillCategories } from './multiLang';

export const PEDAGOGICAL_TRANSLATIONS: {
  categories: Record<string, Record<string, LocalizedCategory>>;
  situations: Record<string, Record<string, LocalizedSituation>>;
  exercises: Record<string, Record<string, LocalizedExercise>>;
} = {
  categories: {
    es: esSkillCategories,
    de: deSkillCategories,
    pt: ptSkillCategories,
    it: itSkillCategories,
    zh: zhSkillCategories,
    ja: jaSkillCategories,
    nl: multiSkillCategories.nl || {},
    ru: multiSkillCategories.ru || {},
    ar: multiSkillCategories.ar || {},
  },
  situations: {
    es: esSituations,
    de: deSituations,
    pt: ptSituations,
    it: itSituations,
    zh: zhSituations,
    ja: jaSituations,
  },
  exercises: {
    es: esExercises,
    de: deExercises,
    pt: ptExercises,
    it: itExercises,
    zh: zhExercises,
    ja: jaExercises,
  }
};

/**
 * Returns localized category or undefined
 */
export function getTranslatedCategoryByLocale(catId: string, locale: string): LocalizedCategory | undefined {
  if (!locale || locale.startsWith('fr')) return undefined;
  const code = locale.toLowerCase().split('-')[0];
  const langDict = PEDAGOGICAL_TRANSLATIONS.categories[code] || PEDAGOGICAL_TRANSLATIONS.categories[locale];
  return langDict ? langDict[catId] : undefined;
}

/**
 * Returns localized situation or undefined
 */
export function getTranslatedSituationByLocale(sitId: string, locale: string): LocalizedSituation | undefined {
  if (!locale || locale.startsWith('fr')) return undefined;
  const code = locale.toLowerCase().split('-')[0];
  const langDict = PEDAGOGICAL_TRANSLATIONS.situations[code] || PEDAGOGICAL_TRANSLATIONS.situations[locale];
  return langDict ? langDict[sitId] : undefined;
}

/**
 * Returns localized exercise or undefined
 */
export function getTranslatedExerciseByLocale(exoId: string, locale: string): LocalizedExercise | undefined {
  if (!locale || locale.startsWith('fr')) return undefined;
  const code = locale.toLowerCase().split('-')[0];
  const langDict = PEDAGOGICAL_TRANSLATIONS.exercises[code] || PEDAGOGICAL_TRANSLATIONS.exercises[locale];
  return langDict ? langDict[exoId] : undefined;
}
