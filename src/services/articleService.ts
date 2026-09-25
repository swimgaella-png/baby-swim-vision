import { PedagogicalArticle, AdminLockedMediaRecord } from '../types';
import { PEDAGOGICAL_ARTICLES, getLocalizedArticles, getLocalizedArticle } from '../data/articlesDatabase';
import { resolveLockedImage, createAdminMediaMetadata } from '../utils/imageLockUtils';

const STORAGE_KEY_ARTICLES = 'bsv_custom_articles_v3';
const STORAGE_KEY_DELETED_ARTICLES = 'bsv_deleted_articles_v3';
const STORAGE_KEY_ADMIN_MEDIA_REGISTRY = 'bsv_admin_media_registry_v1';

const OBSOLETE_ARTICLE_IDS = new Set([
  'first-immersion',
  '1ere-immersion-guide-etape-par-etape-7-secondes',
  'first-immersion-step-by-step-7-second-guide',
  'water-discovery-psychomotor',
  'each-baby-is-unique',
  'water-temperature-guidelines',
  'history-evolution-pedagogy',
  'the-big-dip-baby-first-immersion-practical-guide',
  'reflexes-myths-diving-swimming',
  'reflexe-d-apnee-reflexe-de-nage-attention-aux-idees-recues',
  'diving-and-swimming-reflexes-myths-vs-facts',
]);

class ArticleService {
  private articles: PedagogicalArticle[] = [];
  private deletedIds: Set<string> = new Set(OBSOLETE_ARTICLE_IDS);
  private mediaRegistry: Record<string, AdminLockedMediaRecord> = {};
  private listeners: Array<(articles: PedagogicalArticle[]) => void> = [];

  constructor() {
    this.loadMediaRegistry();
    this.loadDeletedIds();
    this.loadArticles();
    this.fetchFromServer();
  }

  /**
   * Loads the persistent Admin Media Registry from localStorage.
   * This registry stores all images uploaded or selected by the Admin
   * and guarantees they can NEVER be overwritten by app updates or defaults.
   */
  private loadMediaRegistry(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ADMIN_MEDIA_REGISTRY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          this.mediaRegistry = parsed;
        }
      }
    } catch (err) {
      console.warn('Could not load admin media registry:', err);
    }
  }

  /**
   * Saves the Admin Media Registry to localStorage.
   */
  private saveMediaRegistry(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_MEDIA_REGISTRY, JSON.stringify(this.mediaRegistry));
    } catch (err) {
      console.warn('Could not save admin media registry:', err);
    }
  }

  private loadDeletedIds(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY_DELETED_ARTICLES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          parsed.forEach((id) => this.deletedIds.add(id));
        }
      }
      OBSOLETE_ARTICLE_IDS.forEach((id) => this.deletedIds.add(id));
    } catch {}
  }

  private saveDeletedIds(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_DELETED_ARTICLES, JSON.stringify(Array.from(this.deletedIds)));
    } catch {}
  }

  /**
   * Merges default articles with stored articles and admin media registry.
   * 
   * RÈGLE ABSOLUE :
   * SI l'article a une image ADMIN (soit dans mediaRegistry, soit imageSource === 'admin', soit imageAdmin défini)
   * -> TOUJOURS conserver l'image ADMIN.
   * -> Les mises à jour de code ne modifient que imageDefault, JAMAIS l'image officielle ADMIN.
   */
  private mergeWithDefaults(incoming: PedagogicalArticle[]): PedagogicalArticle[] {
    const defaultArticles = (PEDAGOGICAL_ARTICLES && PEDAGOGICAL_ARTICLES['fr']) ? PEDAGOGICAL_ARTICLES['fr'] : [];
    const incomingMap = new Map<string, PedagogicalArticle>();

    incoming.forEach((a) => {
      if (a && a.id && !OBSOLETE_ARTICLE_IDS.has(a.id)) incomingMap.set(a.id, a);
      if (a && a.slug && !OBSOLETE_ARTICLE_IDS.has(a.slug)) incomingMap.set(a.slug, a);
    });

    const merged: PedagogicalArticle[] = defaultArticles
      .filter((defArt) => !this.deletedIds.has(defArt.id) && (!defArt.slug || !this.deletedIds.has(defArt.slug)) && !OBSOLETE_ARTICLE_IDS.has(defArt.id))
      .map((defArt) => {
        const override = incomingMap.get(defArt.id) || (defArt.slug ? incomingMap.get(defArt.slug) : undefined);
        const lockedMedia = this.mediaRegistry[`article:${defArt.id}`] || (defArt.slug ? this.mediaRegistry[`article:${defArt.slug}`] : undefined);

        // Check if Admin Image is locked
        const hasAdminImage = 
          Boolean(lockedMedia) ||
          override?.imageSource === 'admin' ||
          Boolean(override?.imageAdmin && override.imageAdmin.trim() !== '') ||
          override?.isLockedByAdmin;

        const resolvedAdminImage = lockedMedia?.downloadUrl || override?.imageAdmin || (override?.imageSource === 'admin' ? override.image : undefined);

        if (override) {
          if (hasAdminImage && resolvedAdminImage) {
            return {
              ...defArt,
              ...override,
              image: resolvedAdminImage,
              imageAdmin: resolvedAdminImage,
              imageDefault: defArt.image || override.imageDefault || '',
              imageSource: 'admin' as const,
              isLockedByAdmin: true,
              mediaId: lockedMedia?.mediaId || override.mediaId,
              storagePath: lockedMedia?.storagePath || override.storagePath,
              imageAdminUpdatedAt: lockedMedia?.updatedAt || override.imageAdminUpdatedAt,
              imageAdminUpdatedBy: lockedMedia?.updatedBy || override.imageAdminUpdatedBy || 'swimgaella@gmail.com',
              imageCaption: override.imageCaption || defArt.imageCaption,
            };
          }

          // Override exists but no admin lock: use default image from code as latest default
          return {
            ...defArt,
            ...override,
            image: override.image || defArt.image,
            imageDefault: defArt.image,
            imageSource: (override.imageSource === 'admin' ? 'admin' : 'default') as 'default' | 'admin',
            imageCaption: override.imageCaption || defArt.imageCaption,
          };
        }

        // If no full article override but admin image is locked in registry
        if (lockedMedia && lockedMedia.downloadUrl) {
          return {
            ...defArt,
            image: lockedMedia.downloadUrl,
            imageAdmin: lockedMedia.downloadUrl,
            imageDefault: defArt.image || '',
            imageSource: 'admin' as const,
            isLockedByAdmin: true,
            mediaId: lockedMedia.mediaId,
            storagePath: lockedMedia.storagePath,
            imageAdminUpdatedAt: lockedMedia.updatedAt,
            imageAdminUpdatedBy: lockedMedia.updatedBy,
          };
        }

        // Fresh default article
        return {
          ...defArt,
          imageDefault: defArt.image,
          imageSource: 'default' as const,
          isLockedByAdmin: false,
        };
      });

    const defaultIdSet = new Set(defaultArticles.map((a) => a.id));
    incoming.forEach((item) => {
      if (
        item &&
        item.id &&
        !defaultIdSet.has(item.id) &&
        !this.deletedIds.has(item.id) &&
        !OBSOLETE_ARTICLE_IDS.has(item.id) &&
        (!item.slug || (!this.deletedIds.has(item.slug) && !OBSOLETE_ARTICLE_IDS.has(item.slug)))
      ) {
        const lockedMedia = this.mediaRegistry[`article:${item.id}`] || (item.slug ? this.mediaRegistry[`article:${item.slug}`] : undefined);
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
      // 1. Fetch Admin Media Registry
      const mediaRes = await fetch('/api/cms/media');
      if (mediaRes.ok) {
        const mediaData = await mediaRes.json();
        if (mediaData.registry && typeof mediaData.registry === 'object') {
          this.mediaRegistry = { ...this.mediaRegistry, ...mediaData.registry };
          this.saveMediaRegistry();
        }
      }

      // 2. Fetch Articles
      const res = await fetch('/api/cms/articles');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.articles) && data.articles.length > 0) {
          this.articles = this.mergeWithDefaults(data.articles);
          try {
            localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(this.articles));
          } catch {}
          this.notify();
        }
      }
    } catch {
      // Offline fallback
    }
  }

  private loadArticles(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      this.articles = this.mergeWithDefaults(PEDAGOGICAL_ARTICLES['fr'] || []);
      return;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ARTICLES);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.articles = this.mergeWithDefaults(parsed);
          this.saveToStorage();
        } else {
          this.articles = this.mergeWithDefaults(PEDAGOGICAL_ARTICLES['fr'] || []);
          this.saveToStorage();
        }
      } else {
        this.articles = this.mergeWithDefaults(PEDAGOGICAL_ARTICLES['fr'] || []);
        this.saveToStorage();
      }
    } catch {
      this.articles = this.mergeWithDefaults(PEDAGOGICAL_ARTICLES['fr'] || []);
    }
  }

  private saveToStorage(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      this.notify();
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY_ARTICLES, JSON.stringify(this.articles));
    } catch (err) {
      console.warn('Could not save articles to localStorage:', err);
    }
    this.notify();
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn(this.articles));
  }

  public subscribe(listener: (articles: PedagogicalArticle[]) => void): () => void {
    this.listeners.push(listener);
    listener(this.articles);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getArticles(locale: string = 'fr'): PedagogicalArticle[] {
    return this.getAllArticles(locale);
  }

  /**
   * Retrieves all articles for the specified locale.
   * Ensures that if an admin has chosen an image, it is ALWAYS returned as the official image
   * across all language views.
   */
  public getAllArticles(locale: string = 'fr'): PedagogicalArticle[] {
    const localizedDefaults = getLocalizedArticles(locale);
    if (!localizedDefaults || localizedDefaults.length === 0) {
      return [...this.articles];
    }
    const incomingMap = new Map<string, PedagogicalArticle>();
    this.articles.forEach((a) => {
      if (a && a.id) incomingMap.set(a.id, a);
      if (a && a.slug) incomingMap.set(a.slug, a);
    });

    const merged: PedagogicalArticle[] = localizedDefaults
      .filter((defArt) => !this.deletedIds.has(defArt.id) && (!defArt.slug || !this.deletedIds.has(defArt.slug)) && !OBSOLETE_ARTICLE_IDS.has(defArt.id))
      .map((defArt) => {
        const override = incomingMap.get(defArt.id) || (defArt.slug ? incomingMap.get(defArt.slug) : undefined);
        const lockedMedia = this.mediaRegistry[`article:${defArt.id}`] || (defArt.slug ? this.mediaRegistry[`article:${defArt.slug}`] : undefined);

        const hasAdminImage = 
          Boolean(lockedMedia) ||
          override?.imageSource === 'admin' ||
          Boolean(override?.imageAdmin && override.imageAdmin.trim() !== '') ||
          override?.isLockedByAdmin;

        const adminImageUrl = lockedMedia?.downloadUrl || override?.imageAdmin || (override?.imageSource === 'admin' ? override.image : undefined);

        if (hasAdminImage && adminImageUrl) {
          return {
            ...defArt,
            image: adminImageUrl,
            imageAdmin: adminImageUrl,
            imageDefault: defArt.image || '',
            imageSource: 'admin' as const,
            isLockedByAdmin: true,
            mediaId: lockedMedia?.mediaId || override?.mediaId,
            storagePath: lockedMedia?.storagePath || override?.storagePath,
            imageAdminUpdatedAt: lockedMedia?.updatedAt || override?.imageAdminUpdatedAt,
            imageAdminUpdatedBy: lockedMedia?.updatedBy || override?.imageAdminUpdatedBy || 'swimgaella@gmail.com',
            imageCaption: override?.imageCaption || defArt.imageCaption,
          };
        }

        if (override) {
          return {
            ...defArt,
            image: override.image || defArt.image,
            imageDefault: defArt.image,
            imageSource: 'default' as const,
            isLockedByAdmin: false,
            imageCaption: override.imageCaption || defArt.imageCaption,
          };
        }

        return {
          ...defArt,
          imageDefault: defArt.image,
          imageSource: 'default' as const,
          isLockedByAdmin: false,
        };
      });

    const defaultIdSet = new Set(localizedDefaults.map((a) => a.id));
    this.articles.forEach((item) => {
      if (
        item &&
        item.id &&
        !defaultIdSet.has(item.id) &&
        !this.deletedIds.has(item.id) &&
        !OBSOLETE_ARTICLE_IDS.has(item.id)
      ) {
        merged.unshift(item);
      }
    });

    return merged;
  }

  public getArticleById(id: string, locale: string = 'fr'): PedagogicalArticle | undefined {
    const localized = getLocalizedArticle(id, locale);
    const custom = this.articles.find((a) => a.id === id || a.slug === id);
    const lockedMedia = this.mediaRegistry[`article:${id}`] || (custom?.slug ? this.mediaRegistry[`article:${custom.slug}`] : undefined);

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
          mediaId: lockedMedia?.mediaId || custom?.mediaId,
          storagePath: lockedMedia?.storagePath || custom?.storagePath,
          imageAdminUpdatedAt: lockedMedia?.updatedAt || custom?.imageAdminUpdatedAt,
          imageAdminUpdatedBy: lockedMedia?.updatedBy || custom?.imageAdminUpdatedBy || 'swimgaella@gmail.com',
          imageCaption: custom?.imageCaption || localized.imageCaption,
        };
      }

      if (custom) {
        return {
          ...localized,
          image: custom.image || localized.image,
          imageDefault: localized.image,
          imageCaption: custom.imageCaption || localized.imageCaption,
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

  public saveArticle(article: PedagogicalArticle): PedagogicalArticle {
    const index = this.articles.findIndex((a) => a.id === article.id || (article.slug && a.slug === article.slug));
    const lockedMedia = this.mediaRegistry[`article:${article.id}`] || (article.slug ? this.mediaRegistry[`article:${article.slug}`] : undefined);

    // If this article was previously locked with an admin image, preserve the lock
    if (lockedMedia || article.imageSource === 'admin' || article.imageAdmin) {
      article.imageAdmin = article.imageAdmin || lockedMedia?.downloadUrl || article.image;
      article.image = article.imageAdmin || article.image;
      article.imageSource = 'admin';
      article.isLockedByAdmin = true;
      article.mediaId = lockedMedia?.mediaId || article.mediaId;
      article.storagePath = lockedMedia?.storagePath || article.storagePath;
      article.imageAdminUpdatedAt = article.imageAdminUpdatedAt || lockedMedia?.updatedAt || new Date().toISOString();
      article.imageAdminUpdatedBy = article.imageAdminUpdatedBy || lockedMedia?.updatedBy || 'swimgaella@gmail.com';
    }

    if (index >= 0) {
      this.articles[index] = { ...this.articles[index], ...article };
    } else {
      this.articles.unshift({ ...article });
    }
    this.saveToStorage();

    // Sync with backend
    fetch('/api/cms/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(article),
    }).catch(() => {});

    return article;
  }

  public createArticle(articleData: Partial<PedagogicalArticle>): PedagogicalArticle {
    const id = articleData.id || `article_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const slug = articleData.slug || id.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newArticle: PedagogicalArticle = {
      id,
      slug,
      title: articleData.title || 'Nouvel Article Pédagogique',
      category: articleData.category || 'psychomotor',
      categoryLabel: articleData.categoryLabel || 'Développement Psychomoteur & Éveil',
      readingTime: articleData.readingTime || '5 min',
      icon: articleData.icon || '📘',
      badge: articleData.badge || 'Nouveau',
      summary: articleData.summary || 'Résumé synthétique de l’article...',
      featured: articleData.featured ?? false,
      publishedDate: articleData.publishedDate || new Date().toISOString().split('T')[0],
      author: articleData.author || 'Équipe Pédagogique Baby Swim Vision',
      tags: articleData.tags && articleData.tags.length > 0 ? articleData.tags : ['Éveil aquatique', 'Conseils'],
      image: articleData.image,
      imageDefault: articleData.imageDefault || articleData.image,
      imageAdmin: articleData.imageAdmin,
      imageSource: articleData.imageSource || (articleData.imageAdmin ? 'admin' : 'default'),
      isLockedByAdmin: Boolean(articleData.isLockedByAdmin || articleData.imageAdmin),
      imageCaption: articleData.imageCaption,
      goldenRule: articleData.goldenRule,
      content: articleData.content || {
        introduction: 'Introduction de l’article rédigée par l’administrateur.',
        sections: [
          {
            title: '1. Principes clés et repères pratiques',
            paragraphs: [
              'Premier paragraphe détaillant les conseils pédagogiques et l’accompagnement dans l’eau.',
              'Second paragraphe précisant les bonnes postures et la sécurisation du tout-petit.'
            ],
            keyPoints: [
              'Point d’attention n°1 : Respect du rythme de l’enfant',
              'Point d’attention n°2 : Écoute et communication bienveillante'
            ]
          }
        ],
        takeaways: [
          'Un apprentissage progressif basé sur la confiance',
          'Une découverte sans contrainte ni performance'
        ]
      }
    };

    if (newArticle.image && newArticle.imageSource === 'admin') {
      const meta = createAdminMediaMetadata('article', id, newArticle.image);
      this.mediaRegistry[`article:${id}`] = meta;
      this.saveMediaRegistry();
    }

    this.articles.unshift(newArticle);
    this.saveToStorage();

    // Sync with backend
    fetch('/api/cms/articles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newArticle),
    }).catch(() => {});

    return newArticle;
  }

  public deleteArticle(id: string): boolean {
    const target = this.articles.find((a) => a.id === id || a.slug === id);
    const idToDelete = target?.id || id;
    const slugToDelete = target?.slug;

    this.deletedIds.add(idToDelete);
    if (slugToDelete) {
      this.deletedIds.add(slugToDelete);
    }
    this.saveDeletedIds();

    delete this.mediaRegistry[`article:${idToDelete}`];
    if (slugToDelete) {
      delete this.mediaRegistry[`article:${slugToDelete}`];
    }
    this.saveMediaRegistry();

    this.articles = this.articles.filter((a) => a.id !== id && a.slug !== id && a.id !== idToDelete);
    this.saveToStorage();

    // Sync with backend
    fetch(`/api/cms/articles/${encodeURIComponent(idToDelete)}`, {
      method: 'DELETE',
    }).catch(() => {});

    return true;
  }

  /**
   * 🔒 IMMUTABLE ADMIN IMAGE LOCKING PROCEDURE
   * 
   * When an Admin changes or replaces an article image:
   * 1. Generates complete media metadata (mediaId, storagePath, downloadUrl, source="admin", updatedAt, updatedBy)
   * 2. Sets imageAdmin and active image to the new URL
   * 3. Sets imageSource to 'admin' and isLockedByAdmin to true
   * 4. Updates both the persistent Media Registry and the custom articles storage
   * 5. Atomically synchronizes to the server backend
   */
  public updateArticleImage(
    id: string,
    imageUrl: string,
    metadata?: { caption?: string; updatedBy?: string }
  ): boolean {
    let article = this.articles.find((a) => a.id === id || a.slug === id);

    // If not yet in this.articles, try finding from defaults
    if (!article) {
      const def = getLocalizedArticle(id, 'fr');
      if (def) {
        article = { ...def };
        this.articles.push(article);
      }
    }

    if (!article) return false;

    const updatedBy = metadata?.updatedBy || 'swimgaella@gmail.com';
    const mediaMeta = createAdminMediaMetadata('article', article.id, imageUrl, updatedBy);
    if (metadata?.caption) {
      mediaMeta.imageCaption = metadata.caption;
    }

    // Register in persistent Admin Media Registry
    this.mediaRegistry[`article:${article.id}`] = mediaMeta;
    if (article.slug) {
      this.mediaRegistry[`article:${article.slug}`] = mediaMeta;
    }
    this.saveMediaRegistry();

    // Lock article
    article.image = imageUrl;
    article.imageAdmin = imageUrl;
    article.imageDefault = article.imageDefault || defImageFallback(article.id) || '';
    article.imageSource = 'admin';
    article.isLockedByAdmin = true;
    article.mediaId = mediaMeta.mediaId;
    article.storagePath = mediaMeta.storagePath;
    article.downloadUrl = imageUrl;
    article.imageAdminUpdatedAt = mediaMeta.updatedAt;
    article.imageAdminUpdatedBy = updatedBy;
    if (metadata?.caption !== undefined) {
      article.imageCaption = metadata.caption;
    }

    this.saveToStorage();

    // Dedicated atomic backend sync
    fetch(`/api/cms/articles/${encodeURIComponent(article.id)}/image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageUrl,
        mediaId: mediaMeta.mediaId,
        storagePath: mediaMeta.storagePath,
        downloadUrl: imageUrl,
        source: 'admin',
        updatedBy,
        caption: metadata?.caption,
      }),
    }).catch(() => {});

    // Sync media registry to backend
    fetch('/api/cms/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ record: mediaMeta }),
    }).catch(() => {});

    return true;
  }

  public resetToDefaults(): PedagogicalArticle[] {
    // Re-merges defaults while strictly preserving ALL Admin-locked images
    this.articles = this.mergeWithDefaults(PEDAGOGICAL_ARTICLES['fr'] || []);
    this.saveToStorage();
    return this.articles;
  }
}

function defImageFallback(id: string): string {
  const def = (PEDAGOGICAL_ARTICLES['fr'] || []).find((a) => a.id === id || a.slug === id);
  return def?.image || '';
}

export const articleService = new ArticleService();
