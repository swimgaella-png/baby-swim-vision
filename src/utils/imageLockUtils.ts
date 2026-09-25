import { AdminLockedMediaRecord } from '../types';

/**
 * Interface representing standard image fields on an item
 */
export interface ImageHolder {
  image?: string;
  imageDefault?: string;
  imageAdmin?: string;
  imageSource?: 'default' | 'admin';
  mediaId?: string;
  storagePath?: string;
  downloadUrl?: string;
  imageAdminUpdatedAt?: string;
  imageAdminUpdatedBy?: string;
  isLockedByAdmin?: boolean;
}

/**
 * Universal Resolver for Admin-Locked Images.
 *
 * RÈGLE ABSOLUE :
 * 1. SI l'image a été choisie par ADMIN (imageSource === 'admin' OU imageAdmin défini)
 *    -> TOUJOURS utiliser imageAdmin comme source de vérité.
 * 2. SINON
 *    -> utiliser imageDefault ou fallbackDefault.
 *
 * imageAdmin > imageDefault
 */
export function resolveLockedImage<T extends ImageHolder>(
  item: T,
  fallbackDefault?: string
): {
  displayImage: string;
  imageAdmin?: string;
  imageDefault: string;
  imageSource: 'default' | 'admin';
  isLockedByAdmin: boolean;
  mediaId?: string;
  storagePath?: string;
} {
  const defaultImg = item.imageDefault || fallbackDefault || item.image || '';

  // 1. Direct explicit Admin Lock
  if (item.imageSource === 'admin' && item.imageAdmin && item.imageAdmin.trim() !== '') {
    return {
      displayImage: item.imageAdmin,
      imageAdmin: item.imageAdmin,
      imageDefault: defaultImg,
      imageSource: 'admin',
      isLockedByAdmin: true,
      mediaId: item.mediaId,
      storagePath: item.storagePath,
    };
  }

  // 2. imageAdmin is populated even if source wasn't explicitly set
  if (item.imageAdmin && item.imageAdmin.trim() !== '') {
    return {
      displayImage: item.imageAdmin,
      imageAdmin: item.imageAdmin,
      imageDefault: defaultImg,
      imageSource: 'admin',
      isLockedByAdmin: true,
      mediaId: item.mediaId,
      storagePath: item.storagePath,
    };
  }

  // 3. imageSource is explicitly 'admin' and image is set
  if (item.imageSource === 'admin' && item.image && item.image.trim() !== '') {
    return {
      displayImage: item.image,
      imageAdmin: item.image,
      imageDefault: defaultImg,
      imageSource: 'admin',
      isLockedByAdmin: true,
      mediaId: item.mediaId,
      storagePath: item.storagePath,
    };
  }

  // 4. Default state
  return {
    displayImage: defaultImg,
    imageAdmin: undefined,
    imageDefault: defaultImg,
    imageSource: 'default',
    isLockedByAdmin: false,
    mediaId: undefined,
    storagePath: undefined,
  };
}

/**
 * Creates full admin media metadata for an image replacement action.
 */
export function createAdminMediaMetadata(
  targetType: 'article' | 'exercise' | 'settings' | 'hero',
  targetId: string,
  imageUrl: string,
  updatedBy: string = 'swimgaella@gmail.com'
): AdminLockedMediaRecord {
  const timestamp = Date.now();
  const cleanTargetId = targetId.replace(/[^a-zA-Z0-9_-]/g, '_');
  const mediaId = `media_${targetType}_${cleanTargetId}_${timestamp}`;
  const storagePath = `uploads/${targetType}s/${cleanTargetId}_${timestamp}.jpg`;

  return {
    mediaId,
    targetType,
    targetId,
    storagePath,
    downloadUrl: imageUrl,
    source: 'admin',
    updatedAt: new Date().toISOString(),
    updatedBy,
  };
}

/**
 * Applies an Admin Lock to an item (Article or Exercise).
 */
export function applyAdminImageLock<T extends ImageHolder>(
  item: T,
  newImageUrl: string,
  metadata?: Partial<AdminLockedMediaRecord>
): T {
  const targetType = (metadata?.targetType as any) || 'article';
  const targetId = (item as any).id || (item as any).slug || 'item';
  const fullMeta = createAdminMediaMetadata(
    targetType,
    targetId,
    newImageUrl,
    metadata?.updatedBy || 'swimgaella@gmail.com'
  );

  const existingDefault = item.imageDefault || item.image || '';

  return {
    ...item,
    image: newImageUrl,
    imageAdmin: newImageUrl,
    imageDefault: existingDefault,
    imageSource: 'admin' as const,
    isLockedByAdmin: true,
    mediaId: metadata?.mediaId || fullMeta.mediaId,
    storagePath: metadata?.storagePath || fullMeta.storagePath,
    downloadUrl: newImageUrl,
    imageAdminUpdatedAt: fullMeta.updatedAt,
    imageAdminUpdatedBy: fullMeta.updatedBy,
  };
}
