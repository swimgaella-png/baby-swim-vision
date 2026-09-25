import { Club, ClubStatus, ClubSubmissionForm, DuplicateCheckResult } from '../types';
import { authService } from './authService';
import initialClubsRegistry from '../data/clubs_registry.json';

export const CLUB_ACTIVITY_CATEGORIES = [
  { id: 'bebes_nageurs', label: 'Bébés nageurs', icon: '👶' },
  { id: 'eveil_aquatique', label: 'Éveil aquatique', icon: '🌊' },
  { id: 'familiarisation', label: 'Familiarisation aquatique', icon: '💧' },
  { id: 'parent_bebe', label: 'Séance parent-bébé', icon: '👨‍👩‍👧' },
  { id: 'seances_collectives', label: 'Séances collectives', icon: '👥' },
  { id: 'seances_individuelles', label: 'Séances individuelles', icon: '🎯' },
  { id: 'activites_adaptees', label: 'Activités adaptées', icon: '✨' },
  { id: 'handicap_accessibilite', label: 'Handicap & Accessibilité PMR', icon: '♿' },
];

export const CLUB_LANGUAGES = [
  { code: 'fr', label: 'Français 🇫🇷' },
  { code: 'en', label: 'English 🇬🇧' },
  { code: 'es', label: 'Español 🇪🇸' },
  { code: 'pt', label: 'Português 🇵🇹' },
  { code: 'de', label: 'Deutsch 🇩🇪' },
  { code: 'it', label: 'Italiano 🇮🇹' },
  { code: 'nl', label: 'Nederlands 🇳🇱' },
  { code: 'ar', label: 'العربية 🇸🇦' },
];

// Haversine formula to compute great-circle distance between two GPS coordinates in kilometers
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Normalizes any photo path to valid web route (e.g. /media/structure/...)
export function formatClubPhotoUrl(url?: string): string {
  if (!url) return '';
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  let clean = trimmed.replace(/\\/g, '/');
  if (clean.startsWith('public/')) clean = '/' + clean.substring('public/'.length);
  if (clean.startsWith('/public/')) clean = '/' + clean.substring('/public/'.length);
  if (!clean.startsWith('/')) clean = '/' + clean;
  return clean;
}

const STORAGE_KEY_CLUBS_CACHE = 'baby_swim_clubs_cache';
const STORAGE_KEY_DELETED_CLUBS = 'baby_swim_deleted_club_ids';

function getLocalDeletedClubIds(): Set<string> {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY_DELETED_CLUBS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Aqua Forme (club_quimper_ergue) is the primary protected club and can never be blacklisted by client cache
          const sanitized = parsed.filter((id) => id && id !== 'club_quimper_ergue');
          if (sanitized.length !== parsed.length) {
            localStorage.setItem(STORAGE_KEY_DELETED_CLUBS, JSON.stringify(sanitized));
          }
          return new Set(sanitized);
        }
      }
    }
  } catch (e) {}
  return new Set();
}

function addLocalDeletedClubId(id: string): void {
  try {
    if (typeof window !== 'undefined' && id && id !== 'club_quimper_ergue') {
      const set = getLocalDeletedClubIds();
      set.add(id);
      localStorage.setItem(STORAGE_KEY_DELETED_CLUBS, JSON.stringify(Array.from(set)));
    }
  } catch (e) {}
}

function getLocalClubsCache(): Club[] {
  try {
    if (typeof window !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY_CLUBS_CACHE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const deletedSet = getLocalDeletedClubIds();
          const list = parsed.filter((c: any) => c && c.id && !deletedSet.has(c.id));
          if (list.length > 0) return list;
        }
      }
    }
  } catch (e) {}
  // Default fallback from permanent clubs registry
  const deletedSet = getLocalDeletedClubIds();
  return (initialClubsRegistry as Club[]).filter((c) => c && c.id && !deletedSet.has(c.id));
}

function setLocalClubsCache(clubs: Club[]): void {
  try {
    if (typeof window !== 'undefined') {
      const deletedSet = getLocalDeletedClubIds();
      const clean = (clubs || []).filter((c) => c && c.id && !deletedSet.has(c.id));
      localStorage.setItem(STORAGE_KEY_CLUBS_CACHE, JSON.stringify(clean));
    }
  } catch (e) {}
}

class ClubService {
  private cachedValidatedClubs: Club[] = getLocalClubsCache();
  private listeners: Array<() => void> = [];

  subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  // Public: Get all validated clubs
  async getValidatedClubs(): Promise<Club[]> {
    try {
      const res = await fetch('/api/clubs');
      if (res.ok) {
        const data = await res.json();
        const rawList = Array.isArray(data.clubs) ? data.clubs : [];
        const deletedSet = getLocalDeletedClubIds();
        const list = rawList.filter((c: any) => c && c.id && !deletedSet.has(c.id));
        if (list.length > 0) {
          this.cachedValidatedClubs = list;
          setLocalClubsCache(list);
          return this.cachedValidatedClubs;
        }
      }
    } catch (err) {
      console.warn('Error fetching public clubs:', err);
    }
    const deletedSet = getLocalDeletedClubIds();
    const fallback = getLocalClubsCache().filter((c) => c && c.id && !deletedSet.has(c.id));
    if (fallback.length > 0) {
      this.cachedValidatedClubs = fallback;
    } else {
      this.cachedValidatedClubs = (initialClubsRegistry as Club[]).filter((c) => c && c.id && !deletedSet.has(c.id));
    }
    return this.cachedValidatedClubs;
  }

  // Public: Submit a club proposal (always status='pending')
  async submitClub(form: ClubSubmissionForm): Promise<{
    success: boolean;
    message: string;
    club?: Club;
    duplicateCheck?: DuplicateCheckResult;
  }> {
    try {
      const res = await fetch('/api/clubs/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.notify();
        return data;
      }
      return {
        success: false,
        message: data.error || 'Impossible de soumettre le club pour le moment.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Erreur réseau lors de la soumission.',
      };
    }
  }

  // Admin: Get all clubs including pending, rejected, inactive
  async getAdminClubs(): Promise<{
    clubs: Club[];
    counts: {
      pending: number;
      validated: number;
      rejected: number;
      inactive: number;
      total: number;
    };
  }> {
    try {
      const res = await fetch('/api/admin/clubs', {
        headers: authService.getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.clubs) && data.clubs.length > 0) {
          return data;
        }
      }
    } catch (err) {
      console.warn('Error fetching admin clubs:', err);
    }
    // Fallback: Never return empty when validated clubs exist
    const validated = await this.getValidatedClubs();
    return {
      clubs: validated,
      counts: {
        pending: 0,
        validated: validated.length,
        rejected: 0,
        inactive: 0,
        total: validated.length,
      },
    };
  }

  async getClubs(): Promise<Club[]> {
    const adminData = await this.getAdminClubs();
    if (adminData.clubs && adminData.clubs.length > 0) {
      return adminData.clubs;
    }
    return this.getValidatedClubs();
  }

  // Admin: Save or update club
  async saveClub(clubData: Partial<Club>): Promise<{ success: boolean; club?: Club; error?: string }> {
    try {
      const res = await fetch('/api/admin/clubs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify(clubData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.notify();
        return data;
      }
      return { success: false, error: data.error || 'Erreur lors de la sauvegarde.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur réseau.' };
    }
  }

  // Admin: Update club status
  async updateClubStatus(
    id: string,
    status: ClubStatus,
    rejectionReason?: string
  ): Promise<{ success: boolean; club?: Club; error?: string }> {
    try {
      const res = await fetch(`/api/admin/clubs/${id}/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify({ status, rejectionReason }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.notify();
        return data;
      }
      return { success: false, error: data.error || 'Erreur de mise à jour du statut.' };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Admin: Toggle recommendation
  async toggleRecommendClub(id: string): Promise<{ success: boolean; isRecommended?: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/clubs/${id}/toggle-recommend`, {
        method: 'POST',
        headers: authService.getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.notify();
        return data;
      }
      return { success: false, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Admin: Delete club permanently
  async deleteClub(id: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`/api/admin/clubs/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        addLocalDeletedClubId(id);
        this.cachedValidatedClubs = this.cachedValidatedClubs.filter((c) => c && c.id !== id);
        setLocalClubsCache(this.cachedValidatedClubs);
        this.notify();
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  // Admin: Check potential duplicates
  async checkDuplicates(club: Partial<Club>, excludeId?: string): Promise<DuplicateCheckResult> {
    try {
      const res = await fetch('/api/admin/clubs/check-duplicates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify({ club, excludeId }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Error checking duplicates:', err);
    }
    return { hasPotentialDuplicate: false, matchedClubs: [] };
  }

  // Precise Geocoding API helper (Multi-Engine: BAN + Nominatim + Photon)
  async geocodeAddress(
    address?: string,
    postalCode?: string,
    city?: string,
    country?: string
  ): Promise<{
    success: boolean;
    lat?: number;
    lng?: number;
    displayName?: string;
    precision?: string;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/geocode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, postalCode, city, country }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data;
      }
      return { success: false, error: data.error || 'Geocoding failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur réseau de géocodage' };
    }
  }

  // Address Autocomplete API helper
  async searchAddressAutocomplete(
    query: string,
    country: string = 'France'
  ): Promise<Array<{
    label: string;
    street?: string;
    postalCode?: string;
    city?: string;
    country?: string;
    lat: number;
    lng: number;
    precision: 'exact' | 'street' | 'postal' | 'city';
  }>> {
    if (!query || query.trim().length < 2) return [];
    try {
      const res = await fetch(`/api/address-autocomplete?q=${encodeURIComponent(query)}&country=${encodeURIComponent(country)}`);
      if (res.ok) {
        const data = await res.json();
        return data.suggestions || [];
      }
    } catch (err) {
      console.warn('Error fetching address suggestions:', err);
    }
    return [];
  }

  // Admin: Get club submission notification logs
  async getSubmissionNotifications(): Promise<any[]> {
    try {
      const res = await fetch('/api/admin/submission-notifications', {
        headers: authService.getAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        return data.notifications || [];
      }
    } catch (err) {
      console.warn('Error fetching submission notifications:', err);
    }
    return [];
  }

  // Admin: Export backup of clubs registry
  async downloadBackup(): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/clubs/backup', {
        headers: authService.getAuthHeaders(),
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `baby_swim_annuaire_clubs_sauvegarde_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        return true;
      }
    } catch (err) {
      console.error('Error exporting clubs backup:', err);
    }
    return false;
  }

  // Admin: Restore backup of clubs registry
  async restoreBackup(backupData: any): Promise<{ success: boolean; message?: string; totalClubs?: number }> {
    try {
      const res = await fetch('/api/admin/clubs/backup/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
        },
        body: JSON.stringify(backupData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.notify();
        return data;
      }
      return { success: false, message: data.error || 'Échec de la restauration.' };
    } catch (err: any) {
      return { success: false, message: err.message };
    }
  }
}

export const clubService = new ClubService();
