import { ExerciseItem, AdminLockedMediaRecord } from '../types';
import { EXERCISES_CATALOG, getLocalizedExercises } from '../data/pedagogicalDatabase';
import { createAdminMediaMetadata } from '../utils/imageLockUtils';

const STORAGE_KEY_EXERCISES = 'bsv_custom_exercises_v1';
const STORAGE_KEY_DELETED_EXERCISES = 'bsv_deleted_exercises_v1';
const STORAGE_KEY_ADMIN_MEDIA_REGISTRY = 'bsv_admin_media_registry_v1';

class ExerciseService {
  private exercises: ExerciseItem[] = [];
  private deletedIds: Set<string> = new Set();
  private mediaRegistry: Record<string, AdminLockedMediaRecord> = {};
  private listeners: Array<(exercises: ExerciseItem[]) => void> = [];

  constructor() {
    this.loadMediaRegistry();
    this.loadDeletedIds();
    this.loadExercises();
    this.fetchFromServer();
  }

  private loadMediaRegistry(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ADMIN_MEDIA_REGISTRY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          this.mediaRegistry = parsed;
        }
      }
    } catch {}
  }

  private saveMediaRegistry(): void {
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_MEDIA_REGISTRY, JSON.stringify(this.mediaRegistry));
    } catch {}
  }

  private loadDeletedIds(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DELETED_EXERCISES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          this.deletedIds = new Set(parsed);
        }
      }
    } catch {}
  }

  private saveDeletedIds(): void {
    try {
      localStorage.setItem(STORAGE_KEY_DELETED_EXERCISES, JSON.stringify(Array.from(this.deletedIds)));
    } catch {}
  }

  private mergeWithDefaults(incoming: ExerciseItem[]): ExerciseItem[] {
    const defaultExercises = Array.isArray(EXERCISES_CATALOG) ? EXERCISES_CATALOG : [];
    const incomingMap = new Map<string, ExerciseItem>();
    incoming.forEach((e) => {
      if (e && e.id) incomingMap.set(e.id, e);
    });

    const merged: ExerciseItem[] = defaultExercises
      .filter((defExo) => !this.deletedIds.has(defExo.id))
      .map((defExo) => {
        const override = incomingMap.get(defExo.id);
        const lockedMedia = this.mediaRegistry[`exercise:${defExo.id}`];

        const hasAdminImage = 
          Boolean(lockedMedia) ||
          override?.imageSource === 'admin' ||
          Boolean(override?.imageAdmin && override.imageAdmin.trim() !== '') ||
          override?.isLockedByAdmin;

        const adminImageUrl = lockedMedia?.downloadUrl || override?.imageAdmin || (override?.imageSource === 'admin' ? override.image : undefined);

        if (override) {
          if (hasAdminImage && adminImageUrl) {
            return {
              ...defExo,
              ...override,
              image: adminImageUrl,
              imageAdmin: adminImageUrl,
              imageDefault: defExo.image || '',
              imageSource: 'admin' as const,
              isLockedByAdmin: true,
              mediaId: lockedMedia?.mediaId || override.mediaId,
              storagePath: lockedMedia?.storagePath || override.storagePath,
              imageAdminUpdatedAt: lockedMedia?.updatedAt || override.imageAdminUpdatedAt,
              imageAdminUpdatedBy: lockedMedia?.updatedBy || override.imageAdminUpdatedBy || 'swimgaella@gmail.com',
            };
          }

          return {
            ...defExo,
            ...override,
            image: override.image || defExo.image,
            imageDefault: defExo.image,
            imageSource: (override.imageSource === 'admin' ? 'admin' : 'default') as 'default' | 'admin',
          };
        }

        if (lockedMedia && lockedMedia.downloadUrl) {
          return {
            ...defExo,
            image: lockedMedia.downloadUrl,
            imageAdmin: lockedMedia.downloadUrl,
            imageDefault: defExo.image || '',
            imageSource: 'admin' as const,
            isLockedByAdmin: true,
            mediaId: lockedMedia.mediaId,
            storagePath: lockedMedia.storagePath,
            imageAdminUpdatedAt: lockedMedia.updatedAt,
            imageAdminUpdatedBy: lockedMedia.updatedBy,
          };
        }

        return {
          ...defExo,
          imageDefault: defExo.image,
          imageSource: 'default' as const,
          isLockedByAdmin: false,
        };
      });

    const defaultIdSet = new Set(defaultExercises.map((e) => e.id));
    incoming.forEach((item) => {
      if (item && item.id && !defaultIdSet.has(item.id) && !this.deletedIds.has(item.id)) {
        const lockedMedia = this.mediaRegistry[`exercise:${item.id}`];
        if (lockedMedia && lockedMedia.downloadUrl) {
          item.image = lockedMedia.downloadUrl;
          item.imageAdmin = lockedMedia.downloadUrl;
          item.imageSource = 'admin';
          item.isLockedByAdmin = true;
          item.mediaId = lockedMedia.mediaId;
          item.storagePath = lockedMedia.storagePath;
        }
        merged.unshift(item);
      }
    });

    return merged;
  }

  private async fetchFromServer(): Promise<void> {
    try {
      const mediaRes = await fetch('/api/cms/media');
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        if (mediaData.registry && typeof mediaData.registry === 'object') {
          this.mediaRegistry = { ...this.mediaRegistry, ...mediaData.registry };
          this.saveMediaRegistry();
        }
      }

      const res = await fetch('/api/cms/exercises');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.exercises) && data.exercises.length > 0) {
          this.exercises = this.mergeWithDefaults(data.exercises);
          try {
            localStorage.setItem(STORAGE_KEY_EXERCISES, JSON.stringify(this.exercises));
          } catch {}
          this.notify();
        }
      }
    } catch {}
  }

  private loadExercises(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_EXERCISES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.exercises = this.mergeWithDefaults(parsed);
          this.saveToStorage();
        } else {
          this.exercises = this.mergeWithDefaults(EXERCISES_CATALOG);
          this.saveToStorage();
        }
      } else {
        this.exercises = this.mergeWithDefaults(EXERCISES_CATALOG);
        this.saveToStorage();
      }
    } catch {
      this.exercises = this.mergeWithDefaults(EXERCISES_CATALOG);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY_EXERCISES, JSON.stringify(this.exercises));
    } catch (err) {
      console.warn('Could not save exercises to localStorage:', err);
    }
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn(this.exercises));
  }

  public subscribe(listener: (exercises: ExerciseItem[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.exercises);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getExercises(locale: string = 'fr'): ExerciseItem[] {
    return this.getAllExercises(locale);
  }

  public getAllExercises(locale: string = 'fr'): ExerciseItem[] {
    const localizedDefaults = getLocalizedExercises(locale);
    if (!localizedDefaults || localizedDefaults.length === 0) {
      return [...this.exercises];
    }
    const incomingMap = new Map<string, ExerciseItem>();
    this.exercises.forEach((e) => {
      if (e && e.id) incomingMap.set(e.id, e);
    });

    const merged: ExerciseItem[] = localizedDefaults
      .filter((defExo) => !this.deletedIds.has(defExo.id))
      .map((defExo) => {
        const override = incomingMap.get(defExo.id);
        const lockedMedia = this.mediaRegistry[`exercise:${defExo.id}`];

        const hasAdminImage = 
          Boolean(lockedMedia) ||
          override?.imageSource === 'admin' ||
          Boolean(override?.imageAdmin && override.imageAdmin.trim() !== '') ||
          override?.isLockedByAdmin;

        const adminImageUrl = lockedMedia?.downloadUrl || override?.imageAdmin || (override?.imageSource === 'admin' ? override.image : undefined);

        if (hasAdminImage && adminImageUrl) {
          return {
            ...defExo,
            image: adminImageUrl,
            imageAdmin: adminImageUrl,
            imageDefault: defExo.image || '',
            imageSource: 'admin' as const,
            isLockedByAdmin: true,
            mediaId: lockedMedia?.mediaId || override?.mediaId,
            storagePath: lockedMedia?.storagePath || override?.storagePath,
            imageAdminUpdatedAt: lockedMedia?.updatedAt || override?.imageAdminUpdatedAt,
            imageAdminUpdatedBy: lockedMedia?.updatedBy || override?.imageAdminUpdatedBy || 'swimgaella@gmail.com',
          };
        }

        if (override) {
          return {
            ...defExo,
            image: override.image || defExo.image,
            imageDefault: defExo.image,
            imageSource: 'default' as const,
            isLockedByAdmin: false,
          };
        }

        return {
          ...defExo,
          imageDefault: defExo.image,
          imageSource: 'default' as const,
          isLockedByAdmin: false,
        };
      });

    const defaultIdSet = new Set(localizedDefaults.map((e) => e.id));
    this.exercises.forEach((item) => {
      if (item && item.id && !defaultIdSet.has(item.id) && !this.deletedIds.has(item.id)) {
        merged.unshift(item);
      }
    });

    return merged;
  }

  public getExerciseById(id: string, locale: string = 'fr'): ExerciseItem | undefined {
    const localizedList = getLocalizedExercises(locale);
    const localized = localizedList.find((e) => e.id === id);
    const custom = this.exercises.find((e) => e.id === id);
    const lockedMedia = this.mediaRegistry[`exercise:${id}`];

    const hasAdminImage = 
      Boolean(lockedMedia) ||
      custom?.imageSource === 'admin' ||
      Boolean(custom?.imageAdmin && custom.imageAdmin.trim() !== '') ||
      custom?.isLockedByAdmin;

    const adminImageUrl = lockedMedia?.downloadUrl || custom?.imageAdmin || (custom?.imageSource === 'admin' ? custom?.image : undefined);

    if (localized) {
      if (hasAdminImage && adminImageUrl) {
        return {
          ...localized,
          image: adminImageUrl,
          imageAdmin: adminImageUrl,
          imageDefault: localized.image || '',
          imageSource: 'admin' as const,
          isLockedByAdmin: true,
        };
      }
      if (custom) {
        return {
          ...localized,
          image: custom.image || localized.image,
          imageDefault: localized.image,
        };
      }
      return localized;
    }

    if (custom && hasAdminImage && adminImageUrl) {
      return {
        ...custom,
        image: adminImageUrl,
        imageAdmin: adminImageUrl,
        imageSource: 'admin' as const,
        isLockedByAdmin: true,
      };
    }

    return custom;
  }

  public getExercisesByCategory(category: string): ExerciseItem[] {
    return this.exercises.filter((e) => e.situationCategory === category);
  }

  public getExercisesByLevel(level: string): ExerciseItem[] {
    return this.exercises.filter((e) => e.level === level);
  }

  public saveExercise(exercise: ExerciseItem): ExerciseItem {
    const index = this.exercises.findIndex((e) => e.id === exercise.id);
    const lockedMedia = this.mediaRegistry[`exercise:${exercise.id}`];

    if (lockedMedia || exercise.imageSource === 'admin' || exercise.imageAdmin) {
      exercise.imageAdmin = exercise.imageAdmin || lockedMedia?.downloadUrl || exercise.image;
      exercise.image = exercise.imageAdmin || exercise.image;
      exercise.imageSource = 'admin';
      exercise.isLockedByAdmin = true;
      exercise.mediaId = lockedMedia?.mediaId || exercise.mediaId;
      exercise.storagePath = lockedMedia?.storagePath || exercise.storagePath;
      exercise.imageAdminUpdatedAt = exercise.imageAdminUpdatedAt || lockedMedia?.updatedAt || new Date().toISOString();
      exercise.imageAdminUpdatedBy = exercise.imageAdminUpdatedBy || lockedMedia?.updatedBy || 'swimgaella@gmail.com';
    }

    if (index >= 0) {
      this.exercises[index] = { ...this.exercises[index], ...exercise };
    } else {
      this.exercises.unshift({ ...exercise });
    }
    this.saveToStorage();

    // Sync with server
    fetch('/api/cms/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(exercise),
    }).catch(() => {});

    return exercise;
  }

  public updateExerciseImage(
    id: string,
    imageUrl: string,
    metadata?: { caption?: string; updatedBy?: string }
  ): boolean {
    let exercise = this.exercises.find((e) => e.id === id);

    if (!exercise) {
      const def = EXERCISES_CATALOG.find((e) => e.id === id);
      if (def) {
        exercise = { ...def };
        this.exercises.push(exercise);
      }
    }

    if (!exercise) return false;

    const updatedBy = metadata?.updatedBy || 'swimgaella@gmail.com';
    const mediaMeta = createAdminMediaMetadata('exercise', exercise.id, imageUrl, updatedBy);
    if (metadata?.caption) {
      mediaMeta.imageCaption = metadata.caption;
    }

    this.mediaRegistry[`exercise:${exercise.id}`] = mediaMeta;
    this.saveMediaRegistry();

    exercise.image = imageUrl;
    exercise.imageAdmin = imageUrl;
    exercise.imageDefault = exercise.imageDefault || defImageFallback(exercise.id) || '';
    exercise.imageSource = 'admin';
    exercise.isLockedByAdmin = true;
    exercise.mediaId = mediaMeta.mediaId;
    exercise.storagePath = mediaMeta.storagePath;
    exercise.downloadUrl = imageUrl;
    exercise.imageAdminUpdatedAt = mediaMeta.updatedAt;
    exercise.imageAdminUpdatedBy = updatedBy;

    this.saveToStorage();

    fetch(`/api/cms/exercises/${encodeURIComponent(exercise.id)}/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageUrl,
        mediaId: mediaMeta.mediaId,
        storagePath: mediaMeta.storagePath,
        downloadUrl: imageUrl,
        source: 'admin',
        updatedBy,
      }),
    }).catch(() => {});

    fetch('/api/cms/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ record: mediaMeta }),
    }).catch(() => {});

    return true;
  }

  public createExercise(exerciseData: Partial<ExerciseItem>): ExerciseItem {
    const id = exerciseData.id || `exo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newExo: ExerciseItem = {
      id,
      title: exerciseData.title || 'Nouvel Exercice Aquatique',
      objective: exerciseData.objective || 'Objectif moteur et confiance aquatique...',
      level: exerciseData.level || 'decouverte',
      recommendedAge: exerciseData.recommendedAge || '4 - 18 mois',
      situationCategory: exerciseData.situationCategory || 'portage',
      image: exerciseData.image,
      imageDefault: exerciseData.imageDefault || exerciseData.image,
      imageAdmin: exerciseData.imageAdmin,
      imageSource: exerciseData.imageSource || (exerciseData.imageAdmin ? 'admin' : 'default'),
      isLockedByAdmin: Boolean(exerciseData.isLockedByAdmin || exerciseData.imageAdmin),
      steps: exerciseData.steps && exerciseData.steps.length > 0 ? exerciseData.steps : [
        'Étape 1 : Mettre bébé en confiance et capter son regard',
        'Étape 2 : Accompagner le mouvement avec douceur et soutien ventral/dorsal',
        'Étape 3 : Féliciter et encourager l’autonomie motrice'
      ],
      commonMistakes: exerciseData.commonMistakes && exerciseData.commonMistakes.length > 0 ? exerciseData.commonMistakes : [
        'Tension excessive dans les bras du parent',
        'Imposer un rythme trop rapide sans temps de flottaison'
      ],
      corrections: exerciseData.corrections && exerciseData.corrections.length > 0 ? exerciseData.corrections : [
        'Relâcher les épaules et respirer calmement avec bébé',
        'Laisser le corps de l’enfant flotter librement'
      ],
      safetyTips: exerciseData.safetyTips && exerciseData.safetyTips.length > 0 ? exerciseData.safetyTips : [
        'Toujours maintenir un contact visuel ou tactile rassurant',
        'Vérifier la température de l’eau (32°C recommandé)'
      ],
      duration: exerciseData.duration || '3 à 5 minutes',
      tags: exerciseData.tags && exerciseData.tags.length > 0 ? exerciseData.tags : ['Éveil', 'Portage', 'Confiance']
    };

    if (newExo.image && newExo.imageSource === 'admin') {
      const meta = createAdminMediaMetadata('exercise', id, newExo.image);
      this.mediaRegistry[`exercise:${id}`] = meta;
      this.saveMediaRegistry();
    }

    this.exercises.unshift(newExo);
    this.saveToStorage();

    fetch('/api/cms/exercises', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newExo),
    }).catch(() => {});

    return newExo;
  }

  public deleteExercise(id: string): boolean {
    this.deletedIds.add(id);
    this.saveDeletedIds();

    delete this.mediaRegistry[`exercise:${id}`];
    this.saveMediaRegistry();

    this.exercises = this.exercises.filter((e) => e.id !== id);
    this.saveToStorage();

    fetch(`/api/cms/exercises/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    }).catch(() => {});

    return true;
  }

  public resetToDefaults(): ExerciseItem[] {
    this.exercises = this.mergeWithDefaults(EXERCISES_CATALOG);
    this.saveToStorage();
    return this.exercises;
  }
}

function defImageFallback(id: string): string {
  const def = EXERCISES_CATALOG.find((e) => e.id === id);
  return def?.image || '';
}

export const exerciseService = new ExerciseService();
