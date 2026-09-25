/**
 * Baby Swim Vision - Persistence & Local Cache Sanitization Service
 * 
 * Provides robust validation, automatic self-healing, quota protection,
 * and emergency cleanup for client-side storage (localStorage) to prevent
 * corrupted or malformed data from breaking the application lifecycle.
 */

export interface CacheSanitizationReport {
  timestamp: string;
  totalKeysInspected: number;
  corruptedKeysRemoved: string[];
  repairedKeys: string[];
  totalStorageBytes: number;
  quotaWarning: boolean;
  status: 'clean' | 'repaired' | 'error';
}

export interface ClearCacheOptions {
  preserveAuth?: boolean;
  preservePreferences?: boolean;
  preserveUserData?: boolean;
}

const KNOWN_ARRAY_KEYS = [
  'baby_swim_vision_babies',
  'baby_swim_vision_simulation_babies',
  'baby_swim_vision_sessions',
  'baby_swim_vision_simulation_sessions',
  'baby_swim_vision_users_registry',
  'baby_swim_clubs_cache',
  'baby_swim_deleted_club_ids',
  'bsv_custom_articles_v3',
  'bsv_deleted_articles_v3',
  'bsv_custom_exercises_v1',
  'bsv_deleted_exercises_v1',
  'baby_swim_vision_vip_redemptions'
];

const KNOWN_OBJECT_KEYS = [
  'baby_swim_vision_current_user',
  'bsv_interface_settings',
  'bsv_admin_media_registry_v1',
  'cms_demo_videos_cache',
  'cms_demo_videos_disk_files'
];

const EPHEMERAL_CACHE_KEYS = [
  'baby_swim_clubs_cache',
  'cms_demo_videos_cache',
  'cms_demo_videos_disk_files'
];

class PersistenceService {
  private initialized = false;

  /**
   * Safely checks if localStorage is available and functioning in the current environment
   */
  public isStorageAvailable(): boolean {
    if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
      return false;
    }
    try {
      const testKey = '__bsv_storage_probe__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Calculates current total localStorage consumption in bytes
   */
  public getStorageUsage(): { bytes: number; kb: number; mb: number } {
    if (!this.isStorageAvailable()) return { bytes: 0, kb: 0, mb: 0 };

    let totalBytes = 0;
    try {
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) {
          const val = window.localStorage.getItem(key) || '';
          totalBytes += (key.length + val.length) * 2; // UTF-16 characters = 2 bytes
        }
      }
    } catch (e) {
      console.warn('[PersistenceService] Could not calculate storage usage:', e);
    }

    return {
      bytes: totalBytes,
      kb: Math.round(totalBytes / 1024),
      mb: Number((totalBytes / (1024 * 1024)).toFixed(2))
    };
  }

  /**
   * Comprehensive validation and sanitization of localStorage.
   * Detects and removes invalid JSON, malformed schemas, and corrupt strings.
   */
  public cleanCorruptedCache(): CacheSanitizationReport {
    const report: CacheSanitizationReport = {
      timestamp: new Date().toISOString(),
      totalKeysInspected: 0,
      corruptedKeysRemoved: [],
      repairedKeys: [],
      totalStorageBytes: 0,
      quotaWarning: false,
      status: 'clean'
    };

    if (!this.isStorageAvailable()) {
      report.status = 'error';
      return report;
    }

    try {
      const allKeys: string[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const key = window.localStorage.key(i);
        if (key) allKeys.push(key);
      }
      report.totalKeysInspected = allKeys.length;

      for (const key of allKeys) {
        // We only inspect application keys or suspicious raw string values
        const isAppKey =
          key.startsWith('baby_swim_') ||
          key.startsWith('bsv_') ||
          key.startsWith('cms_') ||
          KNOWN_ARRAY_KEYS.includes(key) ||
          KNOWN_OBJECT_KEYS.includes(key);

        if (!isAppKey) continue;

        const rawValue = window.localStorage.getItem(key);

        // Check 1: Null, undefined literal, or broken strings
        if (rawValue === null) continue;

        const trimmed = rawValue.trim();
        if (
          trimmed === 'undefined' ||
          trimmed === 'null' ||
          trimmed === '[object Object]' ||
          trimmed === 'NaN'
        ) {
          window.localStorage.removeItem(key);
          report.corruptedKeysRemoved.push(key);
          continue;
        }

        // Check 2: Validation of JSON keys
        const shouldBeArray = KNOWN_ARRAY_KEYS.includes(key);
        const shouldBeObject = KNOWN_OBJECT_KEYS.includes(key);

        if (shouldBeArray || shouldBeObject) {
          try {
            const parsed = JSON.parse(trimmed);

            if (shouldBeArray && !Array.isArray(parsed)) {
              console.warn(`[PersistenceService] Key "${key}" expected Array but found ${typeof parsed}. Resetting to empty array.`);
              window.localStorage.setItem(key, JSON.stringify([]));
              report.repairedKeys.push(key);
            } else if (shouldBeObject && (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed))) {
              console.warn(`[PersistenceService] Key "${key}" expected Object but found ${typeof parsed}. Removing corrupted key.`);
              window.localStorage.removeItem(key);
              report.corruptedKeysRemoved.push(key);
            }
          } catch (jsonErr) {
            console.error(`[PersistenceService] Fatal JSON corruption on key "${key}". Purging to prevent crash:`, jsonErr);
            window.localStorage.removeItem(key);
            report.corruptedKeysRemoved.push(key);
          }
        }
      }

      // Check 3: Storage Quota check (if > 2.5 MB, purge heavy ephemeral caches silently)
      const usage = this.getStorageUsage();
      report.totalStorageBytes = usage.bytes;

      if (usage.mb >= 2.5) {
        report.quotaWarning = true;
        for (const ephKey of EPHEMERAL_CACHE_KEYS) {
          if (window.localStorage.getItem(ephKey)) {
            window.localStorage.removeItem(ephKey);
            report.corruptedKeysRemoved.push(ephKey);
          }
        }
        // Also check if any non-essential key is extraordinarily heavy (> 500 KB)
        for (let i = 0; i < window.localStorage.length; i++) {
          const k = window.localStorage.key(i);
          if (k && !k.includes('user') && !k.includes('token') && !k.includes('locale')) {
            const val = window.localStorage.getItem(k) || '';
            if (val.length > 500000) {
              window.localStorage.removeItem(k);
              report.corruptedKeysRemoved.push(k);
            }
          }
        }
      }

      if (report.corruptedKeysRemoved.length > 0 || report.repairedKeys.length > 0) {
        report.status = 'repaired';
      }
    } catch (e) {
      console.error('[PersistenceService] Error while sanitizing local cache:', e);
      report.status = 'error';
    }

    return report;
  }

  /**
   * Granular cache purger for user-initiated resets or troubleshooting.
   */
  public clearAllCaches(options: ClearCacheOptions = {}): { removedCount: number } {
    if (!this.isStorageAvailable()) return { removedCount: 0 };

    let removedCount = 0;
    const authKeys = [
      'baby_swim_vision_current_user',
      'bsv_session_token',
      'bsv_admin_passcode_authenticated',
      'baby_swim_vision_users_registry'
    ];

    const preferenceKeys = [
      'baby_swim_language',
      'baby_swim_language_chosen',
      'baby_swim_vision_parental_consent',
      'bsv_interface_settings'
    ];

    const userDataKeys = [
      'baby_swim_vision_babies',
      'baby_swim_vision_active_baby_id',
      'baby_swim_vision_sessions',
      'baby_swim_vision_simulation_babies',
      'baby_swim_vision_simulation_sessions'
    ];

    const allKeys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) allKeys.push(key);
    }

    for (const key of allKeys) {
      if (options.preserveAuth && authKeys.includes(key)) continue;
      if (options.preservePreferences && preferenceKeys.includes(key)) continue;
      if (options.preserveUserData && userDataKeys.includes(key)) continue;

      if (
        key.startsWith('baby_swim_') ||
        key.startsWith('bsv_') ||
        key.startsWith('cms_')
      ) {
        window.localStorage.removeItem(key);
        removedCount++;
      }
    }

    console.info(`[PersistenceService] Purged ${removedCount} cache items.`);
    return { removedCount };
  }

  /**
   * Initializes automatic startup health check.
   * Safe to call anywhere early in the app lifecycle (e.g. main.tsx).
   */
  public autoSanitizeOnStartup(): void {
    if (this.initialized || typeof window === 'undefined') return;
    this.initialized = true;

    try {
      this.cleanCorruptedCache();

      // Expose diagnostic commands in DevTools for developers/admins
      const win = window as any;
      win.__BSV_PERSISTENCE__ = this;
      win.__BSV_CLEAR_CACHE__ = (opts?: ClearCacheOptions) => this.clearAllCaches(opts);
      win.__BSV_CACHE_HEALTH__ = () => this.cleanCorruptedCache();
    } catch (e) {
      console.warn('[PersistenceService] autoSanitizeOnStartup encountered a safe exception:', e);
    }
  }
}

export const persistenceService = new PersistenceService();
