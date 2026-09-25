import { VideoMetadata, VideoIngestionResult } from '../types';

export interface VideoUploadResult {
  url: string;
  file: File | Blob;
  name: string;
  durationSeconds: number;
  sizeMB: number;
  type: string;
  thumbnailUrl?: string;
  metadata?: VideoMetadata;
}

export interface VideoPreparationProgress {
  message: string;
  step: 'detecting' | 'converting' | 'ready' | 'error';
  detectedFormat?: string;
  detectedCodec?: string;
  wasConverted?: boolean;
}

class VideoService {
  public maxDurationSeconds = 60;
  public maxSizeBytes = 200 * 1024 * 1024; // 200 MB max for high-res smartphone clips

  private supportedExtensions = new Set([
    'mp4', 'mov', 'm4v', 'avi', 'wmv', 'mkv', 'webm', '3gp', '3g2',
    'mpeg', 'mpg', 'm2ts', 'ts', 'flv', 'ogv', 'jpeg', 'jpg', 'png', 'webp'
  ]);

  public validateVideoFile(file: File): { valid: boolean; error?: string } {
    const isVideoMime = file.type && (file.type.startsWith('video/') || file.type.startsWith('image/'));
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const hasSupportedExt = this.supportedExtensions.has(ext);

    if (!isVideoMime && !hasSupportedExt) {
      return {
        valid: false,
        error: 'Format non reconnu. Veuillez sélectionner une vidéo (MP4, MOV, WebM, AVI, WMV, MKV, 3GP, MPEG...) ou une photo.',
      };
    }

    if (file.size > this.maxSizeBytes) {
      return {
        valid: false,
        error: `La taille du fichier ne doit pas dépasser 200 Mo (${(file.size / (1024 * 1024)).toFixed(1)} Mo détectés).`,
      };
    }

    return { valid: true };
  }

  public validateDuration(seconds: number): { valid: boolean; error?: string } {
    if (seconds > 65) {
      return {
        valid: false,
        error: `La vidéo dure ${Math.round(seconds)} secondes. La durée maximale acceptée est de 1 minute (60 secondes) pour préserver la précision de l'analyse pédagogique des mouvements du bébé.`,
      };
    }
    return { valid: true };
  }

  /**
   * Main universal ingestion pipeline:
   * Inspects format & codec, auto-converts unsupported formats (MKV, AVI, WMV, 3GP, MPEG, unsupported codecs),
   * preserves natural orientation, duration, timestamps and speed.
   */
  public async prepareVideoForAnalysis(
    file: File,
    onProgress?: (progress: VideoPreparationProgress) => void
  ): Promise<VideoIngestionResult> {
    const isImage = file.type.startsWith('image/') || /\.(jpeg|jpg|png|webp)$/i.test(file.name);
    if (isImage) {
      onProgress?.({ message: 'Préparation de votre photo…', step: 'ready' });
      const imgMeta = await this.probeImageMetadata(file);
      const url = URL.createObjectURL(file);
      return {
        videoBlob: file,
        videoUrl: url,
        name: file.name,
        metadata: imgMeta,
        thumbnailUrl: url,
      };
    }

    onProgress?.({ message: 'Détection du format vidéo…', step: 'detecting' });

    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const isKnownNonBrowserContainer = ['mkv', 'avi', 'wmv', '3gp', '3g2', 'flv', 'mpg', 'mpeg', 'ts'].includes(ext);

    // If it's a known non-browser container, convert immediately via server
    if (isKnownNonBrowserContainer) {
      return this.convertOnServer(file, onProgress);
    }

    // Try direct browser decoding
    try {
      const browserMeta = await this.probeVideoInBrowser(file);
      
      // If browser handled it and duration is valid
      const durationVal = this.validateDuration(browserMeta.durationSeconds);
      if (!durationVal.valid) {
        throw new Error(durationVal.error);
      }

      const videoUrl = URL.createObjectURL(file);
      const thumb = await this.generateThumbnail(file);

      onProgress?.({
        message: 'Vidéo prête pour l\'analyse',
        step: 'ready',
        detectedFormat: browserMeta.format,
        detectedCodec: browserMeta.codec,
        wasConverted: false,
      });

      return {
        videoBlob: file,
        videoUrl,
        name: file.name,
        metadata: browserMeta,
        thumbnailUrl: thumb,
      };
    } catch (browserErr: any) {
      // If duration error, throw immediately
      if (browserErr.message && browserErr.message.includes('durée')) {
        throw browserErr;
      }

      // Browser failed to decode natively (e.g. HEVC on Firefox/Chrome PC or specific container)
      // Fallback seamlessly to transparent server conversion
      console.log('Direct browser decode not possible, starting transparent server conversion...', browserErr);
      return this.convertOnServer(file, onProgress);
    }
  }

  public async processUploadedVideo(
    file: File,
    onProgress?: (progress: VideoPreparationProgress) => void
  ): Promise<VideoIngestionResult> {
    return this.prepareVideoForAnalysis(file, onProgress);
  }

  /**
   * Transparent Server Conversion using ffmpeg
   */
  private async convertOnServer(
    file: File,
    onProgress?: (progress: VideoPreparationProgress) => void
  ): Promise<VideoIngestionResult> {
    onProgress?.({
      message: 'Préparation de votre vidéo…',
      step: 'converting',
    });

    const formData = new FormData();
    formData.append('video', file, file.name);

    try {
      const response = await fetch('/api/video/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.message || errJson.error || 'Cette vidéo ne peut pas être traitée automatiquement. Essayez une autre vidéo.');
      }

      // Parse metadata from response headers
      const convertedBlob = await response.blob();
      const format = response.headers.get('X-Video-Format') || 'MP4';
      const codec = response.headers.get('X-Video-Codec') || 'H.264 / AVC';
      const width = parseInt(response.headers.get('X-Video-Width') || '720', 10);
      const height = parseInt(response.headers.get('X-Video-Height') || '1280', 10);
      const orientation = (response.headers.get('X-Video-Orientation') || (height > width ? 'portrait' : 'landscape')) as 'portrait' | 'landscape' | 'square';
      const fps = parseInt(response.headers.get('X-Video-Fps') || '30', 10);
      const durationSeconds = parseFloat(response.headers.get('X-Video-Duration') || '15');
      const origFormat = decodeURIComponent(response.headers.get('X-Original-Format') || '');
      const origCodec = decodeURIComponent(response.headers.get('X-Original-Codec') || '');

      const sizeMB = Number((convertedBlob.size / (1024 * 1024)).toFixed(2));
      const aspectRatio = `${width}×${height}`;

      const metadata: VideoMetadata = {
        format,
        codec,
        width,
        height,
        aspectRatio,
        orientation,
        fps,
        durationSeconds,
        sizeMB,
        wasConverted: true,
        originalFormat: origFormat || extToFormatLabel(file.name),
        originalCodec: origCodec || 'Non standard',
      };

      const videoUrl = URL.createObjectURL(convertedBlob);
      const thumb = await this.generateThumbnail(convertedBlob);

      onProgress?.({
        message: 'Vidéo prête pour l\'analyse',
        step: 'ready',
        detectedFormat: metadata.format,
        detectedCodec: metadata.codec,
        wasConverted: true,
      });

      return {
        videoBlob: convertedBlob,
        videoUrl,
        name: file.name.replace(/\.[^/.]+$/, "") + ".mp4",
        metadata,
        thumbnailUrl: thumb,
      };
    } catch (err: any) {
      console.error('Server conversion error:', err);
      onProgress?.({
        message: 'Cette vidéo ne peut pas être traitée automatiquement. Essayez une autre vidéo.',
        step: 'error',
      });
      throw new Error(err.message || 'Cette vidéo ne peut pas être traitée automatiquement. Essayez une autre vidéo.');
    }
  }

  /**
   * Browser-native probe using HTML5 Video Element
   */
  private async probeVideoInBrowser(file: File): Promise<VideoMetadata> {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;

      const url = URL.createObjectURL(file);
      video.src = url;

      const timeoutId = setTimeout(() => {
        URL.revokeObjectURL(url);
        video.remove();
        reject(new Error('Timeout lors de la lecture des métadonnées'));
      }, 6000);

      video.onloadedmetadata = () => {
        clearTimeout(timeoutId);
        const width = video.videoWidth || 640;
        const height = video.videoHeight || 480;
        const duration = video.duration || 15;
        const sizeMB = Number((file.size / (1024 * 1024)).toFixed(2));

        let orientation: 'portrait' | 'landscape' | 'square' = 'landscape';
        if (height > width * 1.05) {
          orientation = 'portrait';
        } else if (width > height * 1.05) {
          orientation = 'landscape';
        } else {
          orientation = 'square';
        }

        const ext = (file.name.split('.').pop() || 'mp4').toUpperCase();
        const formatLabel = extToFormatLabel(file.name);
        const codecLabel = file.type.includes('webm') ? 'VP8/VP9' : 'H.264 / AAC';

        URL.revokeObjectURL(url);
        video.remove();

        resolve({
          format: formatLabel,
          codec: codecLabel,
          width,
          height,
          aspectRatio: `${width}×${height}`,
          orientation,
          fps: 30, // standard baseline
          durationSeconds: Number(duration.toFixed(2)),
          sizeMB,
          wasConverted: false,
        });
      };

      video.onerror = () => {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(url);
        video.remove();
        reject(new Error('Format non lisible directement par le navigateur.'));
      };
    });
  }

  private async probeImageMetadata(file: File): Promise<VideoMetadata> {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.src = url;
      img.onload = () => {
        const width = img.naturalWidth || 800;
        const height = img.naturalHeight || 600;
        URL.revokeObjectURL(url);
        resolve({
          format: file.type.includes('png') ? 'PNG' : 'JPEG',
          codec: 'Image',
          width,
          height,
          aspectRatio: `${width}×${height}`,
          orientation: height > width ? 'portrait' : 'landscape',
          fps: 1,
          durationSeconds: 5,
          sizeMB: Number((file.size / (1024 * 1024)).toFixed(2)),
          wasConverted: false,
        });
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({
          format: 'JPEG',
          codec: 'Image',
          width: 800,
          height: 600,
          aspectRatio: '800×600',
          orientation: 'landscape',
          fps: 1,
          durationSeconds: 5,
          sizeMB: Number((file.size / (1024 * 1024)).toFixed(2)),
          wasConverted: false,
        });
      };
    });
  }

  public async getVideoDuration(file: File | Blob): Promise<number> {
    if (file.type && file.type.startsWith('image/')) {
      return 5;
    }
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration || 15);
      };
      video.onerror = () => {
        resolve(15);
      };
      video.src = URL.createObjectURL(file);
    });
  }

  public async generateThumbnail(file: File | Blob): Promise<string> {
    if (file.type && file.type.startsWith('image/')) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve((reader.result as string) || '');
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });
    }

    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(file);
      video.src = url;

      const timeoutId = setTimeout(() => {
        URL.revokeObjectURL(url);
        resolve('');
      }, 5000);

      video.onloadeddata = () => {
        video.currentTime = Math.min(1.0, video.duration / 2 || 0.5);
      };

      video.onseeked = () => {
        try {
          clearTimeout(timeoutId);
          const canvas = document.createElement('canvas');
          canvas.width = 320;
          canvas.height = 180;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbUrl = canvas.toDataURL('image/jpeg', 0.8);
            URL.revokeObjectURL(url);
            resolve(thumbUrl);
            return;
          }
        } catch (e) {
          console.warn('Canvas thumbnail error:', e);
        }
        clearTimeout(timeoutId);
        URL.revokeObjectURL(url);
        resolve('');
      };

      video.onerror = () => {
        clearTimeout(timeoutId);
        URL.revokeObjectURL(url);
        resolve('');
      };
    });
  }

  public createSampleVideoBlob(title: string, durationSeconds: number = 15): Blob {
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 360;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return new Blob([], { type: 'video/webm' });
    }

    const gradient = ctx.createLinearGradient(0, 0, 0, 360);
    gradient.addColorStop(0, '#38bdf8');
    gradient.addColorStop(0.5, '#0284c7');
    gradient.addColorStop(1, '#0369a1');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 640, 360);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(320, 200, 180, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Baby Swim Vision — Séquence Démo', 320, 150);

    ctx.font = '16px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillText(title, 320, 190);
    ctx.fillText(`Durée : ${durationSeconds}s • Démo Pédagogique`, 320, 220);

    return new Blob([canvas.toDataURL('image/jpeg')], { type: 'video/mp4' });
  }
}

function extToFormatLabel(filename: string): string {
  const ext = (filename.split('.').pop() || '').toLowerCase();
  switch (ext) {
    case 'mov': return 'MOV (iPhone / QuickTime)';
    case 'mp4': return 'MP4';
    case 'm4v': return 'M4V';
    case 'mkv': return 'MKV';
    case 'avi': return 'AVI';
    case 'wmv': return 'WMV';
    case 'webm': return 'WebM';
    case '3gp':
    case '3g2': return '3GP';
    case 'mpeg':
    case 'mpg': return 'MPEG';
    default: return ext ? ext.toUpperCase() : 'MP4';
  }
}

export const videoService = new VideoService();
