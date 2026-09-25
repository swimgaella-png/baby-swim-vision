import { DemoVideoItem } from '../types';
import { authService } from './authService';

const STORAGE_KEY = 'cms_demo_videos_cache';
const DISK_FILES_KEY = 'cms_demo_videos_disk_files_cache';

type Listener = (videos: DemoVideoItem[]) => void;

class DemoVideoService {
  private cache: DemoVideoItem[] = [];
  private diskFiles: string[] = [];
  private listeners: Set<Listener> = new Set();
  private isInitialized = false;

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        this.cache = JSON.parse(stored);
      }
      const storedFiles = localStorage.getItem(DISK_FILES_KEY);
      if (storedFiles) {
        this.diskFiles = JSON.parse(storedFiles);
      }
    } catch (e) {
      console.warn('Could not read demo videos from localStorage', e);
    }
  }

  private saveToLocalStorage(): void {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
      localStorage.setItem(DISK_FILES_KEY, JSON.stringify(this.diskFiles));
    } catch (e) {
      console.warn('Could not save demo videos to localStorage', e);
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    if (this.cache.length > 0) {
      listener(this.cache);
    }
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn(this.cache));
  }

  public normalizeFileName(input: string): { fileName: string; videoUrl: string } {
    let clean = (input || '').trim().replace(/\\/g, '/');
    // Strip public/ or /public/
    clean = clean.replace(/^(\/?public\/)+/i, '');
    // Strip media/demo-videos/ or /media/demo-videos/
    clean = clean.replace(/^(\/?media\/demo-videos\/)+/i, '');
    // Strip media/videos/ or /media/videos/
    clean = clean.replace(/^(\/?media\/videos\/)+/i, '');
    // Strip any remaining leading slashes
    clean = clean.replace(/^\/+/, '');
    
    // Extract filename
    const parts = clean.split('/');
    const fileName = parts[parts.length - 1] || 'video.mp4';
    const videoUrl = `/media/demo-videos/${fileName}`;

    return { fileName, videoUrl };
  }

  public async uploadVideoFile(file: File): Promise<{ fileName: string; videoUrl: string; sizeMB: number }> {
    const formData = new FormData();
    formData.append('video', file);

    const headers: Record<string, string> = {};
    const token = authService.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch('/api/cms/demo-videos/upload', {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || 'Erreur lors du téléversement de la vidéo');
    }

    const data = await res.json();
    // Refresh disk files so the new file is immediately in the list
    await this.fetchDiskFiles();
    return {
      fileName: data.fileName,
      videoUrl: data.videoUrl,
      sizeMB: data.sizeMB || Number((file.size / (1024 * 1024)).toFixed(1)),
    };
  }

  public async fetchDemoVideos(forceRefresh = false): Promise<DemoVideoItem[]> {
    try {
      const res = await fetch('/api/cms/demo-videos');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.demoVideos)) {
          this.cache = data.demoVideos;
          if (Array.isArray(data.diskFiles)) {
            this.diskFiles = data.diskFiles;
          }
          this.saveToLocalStorage();
          this.isInitialized = true;
          this.notify();
          return this.cache;
        }
      }
    } catch (err) {
      console.warn('API /api/cms/demo-videos unreachable, using local cache:', err);
    }

    this.isInitialized = true;
    return this.cache;
  }

  public async getAllDemoVideos(forceRefresh = true): Promise<DemoVideoItem[]> {
    return this.fetchDemoVideos(forceRefresh);
  }

  public async getDemoVideos(forceRefresh = true): Promise<DemoVideoItem[]> {
    return this.fetchDemoVideos(forceRefresh);
  }

  public getCachedDemoVideos(): DemoVideoItem[] {
    return this.cache;
  }

  public getDiskFiles(): string[] {
    return this.diskFiles;
  }

  public async fetchDiskFiles(): Promise<string[]> {
    try {
      const res = await fetch('/api/cms/demo-videos/files');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.files)) {
          this.diskFiles = data.files;
          this.saveToLocalStorage();
          return this.diskFiles;
        }
      }
    } catch (e) {
      console.warn('Could not fetch disk files:', e);
    }
    return this.diskFiles;
  }

  public async saveDemoVideo(video: Partial<DemoVideoItem>): Promise<DemoVideoItem> {
    const rawFile = video.videoFileName || video.videoUrl || 'video.mp4';
    const { fileName, videoUrl } = this.normalizeFileName(rawFile);

    const payload = {
      ...video,
      videoFileName: fileName,
      videoUrl,
      isPermanentAdminVideo: true,
      source: 'admin',
      skills: Array.isArray(video.skills) ? video.skills : (video.skills ? [video.skills] : []),
    };

    let responseData: any = null;
    try {
      const res = await fetch('/api/cms/demo-videos', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || `Erreur serveur (${res.status}) lors de l'enregistrement.`);
      }

      responseData = await res.json();
    } catch (err: any) {
      console.error('Save demo video failed on server:', err);
      throw new Error(err.message || "Erreur de connexion au serveur. La vidéo n'a pas pu être sauvegardée de manière persistante.");
    }

    if (responseData && Array.isArray(responseData.demoVideos)) {
      this.cache = responseData.demoVideos;
      this.saveToLocalStorage();
      this.notify();
    }

    // Re-verify from the server to guarantee persistence
    await this.fetchDemoVideos(true);

    return responseData.demoVideo || (payload as DemoVideoItem);
  }

  public async reorderDemoVideos(orderedIds: string[]): Promise<boolean> {
    try {
      const res = await fetch('/api/cms/demo-videos/reorder', {
        method: 'POST',
        headers: authService.getAuthHeaders(),
        body: JSON.stringify({ orderedIds }),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || "Erreur lors de l'enregistrement du nouvel ordre.");
      }

      const data = await res.json();
      if (data && Array.isArray(data.demoVideos)) {
        this.cache = data.demoVideos;
        this.saveToLocalStorage();
        this.notify();
      }

      await this.fetchDemoVideos(true);
      return true;
    } catch (err: any) {
      console.error('Reorder demo videos failed:', err);
      throw new Error(err.message || "Impossible d'enregistrer l'ordre d'affichage sur le serveur.");
    }
  }

  public async deleteDemoVideo(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/cms/demo-videos/${id}`, {
        method: 'DELETE',
        headers: authService.getAuthHeaders(),
      });

      if (!res.ok) {
        const errorJson = await res.json().catch(() => ({}));
        throw new Error(errorJson.error || `Erreur serveur (${res.status}) lors de la suppression.`);
      }

      const data = await res.json();
      if (data && Array.isArray(data.demoVideos)) {
        this.cache = data.demoVideos;
      } else {
        this.cache = this.cache.filter((v) => v.id !== id);
      }
      this.saveToLocalStorage();
      this.notify();

      await this.fetchDemoVideos(true);
      return true;
    } catch (err: any) {
      console.error('Delete demo video failed on server:', err);
      throw new Error(err.message || "Erreur de connexion : la vidéo n'a pas pu être supprimée du serveur.");
    }
  }
}

export const demoVideoService = new DemoVideoService();
