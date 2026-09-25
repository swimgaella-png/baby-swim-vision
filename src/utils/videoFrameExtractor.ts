/**
 * Media frame extractor utility for Multimodal Video & Image Analysis
 * Samples representative frames across the video timeline, or loads an uploaded image,
 * to pass to Gemini Vision.
 */

export async function extractFramesFromVideo(
  mediaSource: string | Blob | File,
  targetFrameCount = 6,
  maxDimension = 768
): Promise<string[]> {
  // 1. Check if mediaSource is an Image (File/Blob or image string/data URL)
  const isImageBlob = typeof Blob !== 'undefined' && mediaSource instanceof Blob && mediaSource.type.startsWith('image/');
  const isImageString = typeof mediaSource === 'string' && (
    mediaSource.startsWith('data:image/') ||
    mediaSource.startsWith('blob:') ||
    /\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i.test(mediaSource)
  );

  if (isImageBlob || isImageString) {
    return extractFromImage(mediaSource, maxDimension);
  }

  // 2. Otherwise handle as Video
  return extractFromVideo(mediaSource, targetFrameCount, maxDimension);
}

/**
 * Loads an image file or URL onto a canvas and extracts high-clarity JPEG Base64
 */
async function extractFromImage(
  imageSource: string | Blob | File,
  maxDimension: number
): Promise<string[]> {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      let objectUrl = '';
      let isObjectUrl = false;

      if (typeof imageSource === 'string') {
        img.src = imageSource;
      } else if (typeof Blob !== 'undefined' && imageSource instanceof Blob) {
        objectUrl = URL.createObjectURL(imageSource);
        isObjectUrl = true;
        img.src = objectUrl;
      } else {
        resolve([]);
        return;
      }

      const cleanup = () => {
        if (isObjectUrl && objectUrl) {
          try {
            URL.revokeObjectURL(objectUrl);
          } catch (e) {
            // Ignore
          }
        }
      };

      const timeoutId = setTimeout(() => {
        cleanup();
        resolve([]);
      }, 8000);

      img.onload = () => {
        try {
          clearTimeout(timeoutId);
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            cleanup();
            resolve([]);
            return;
          }

          let width = img.naturalWidth || img.width || 640;
          let height = img.naturalHeight || img.height || 480;

          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
          const base64 = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
          cleanup();
          resolve(base64 ? [base64] : []);
        } catch (e) {
          cleanup();
          resolve([]);
        }
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        cleanup();
        resolve([]);
      };
    } catch (e) {
      resolve([]);
    }
  });
}

/**
 * Extracts multiple evenly spaced frames across video duration
 */
async function extractFromVideo(
  videoSource: string | Blob | File,
  targetFrameCount: number,
  maxDimension: number
): Promise<string[]> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = 'anonymous';

      let videoUrl = '';
      let isObjectUrl = false;

      if (typeof videoSource === 'string') {
        videoUrl = videoSource;
      } else if (typeof Blob !== 'undefined' && videoSource instanceof Blob) {
        videoUrl = URL.createObjectURL(videoSource);
        isObjectUrl = true;
      } else {
        resolve([]);
        return;
      }

      video.src = videoUrl;

      const cleanup = () => {
        if (isObjectUrl && videoUrl) {
          try {
            URL.revokeObjectURL(videoUrl);
          } catch (e) {
            // Ignore
          }
        }
        video.remove();
      };

      const timeoutId = setTimeout(() => {
        cleanup();
        // If video extraction timed out, try treating as image if possible
        extractFromImage(videoSource, maxDimension).then(resolve);
      }, 10000);

      video.onloadedmetadata = async () => {
        try {
          const duration = Math.min(video.duration || 10, 60);
          if (!duration || isNaN(duration) || duration <= 0) {
            clearTimeout(timeoutId);
            cleanup();
            const imgFallback = await extractFromImage(videoSource, maxDimension);
            resolve(imgFallback);
            return;
          }

          // Calculate time offsets
          const timestamps: number[] = [];
          const count = Math.max(3, Math.min(targetFrameCount, 8));

          for (let i = 0; i < count; i++) {
            // Sample evenly across the duration (from 5% to 95%)
            const fraction = (i + 0.5) / count;
            timestamps.push(Math.max(0.1, Math.min(duration - 0.2, duration * fraction)));
          }

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            clearTimeout(timeoutId);
            cleanup();
            resolve([]);
            return;
          }

          // Compute aspect-ratio preserved dimensions
          const originalWidth = video.videoWidth || 640;
          const originalHeight = video.videoHeight || 480;
          let targetWidth = originalWidth;
          let targetHeight = originalHeight;

          if (originalWidth > originalHeight) {
            if (originalWidth > maxDimension) {
              targetWidth = maxDimension;
              targetHeight = Math.round((originalHeight * maxDimension) / originalWidth);
            }
          } else {
            if (originalHeight > maxDimension) {
              targetHeight = maxDimension;
              targetWidth = Math.round((originalWidth * maxDimension) / originalHeight);
            }
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const frames: string[] = [];

          const seekTo = (time: number): Promise<void> => {
            return new Promise((res) => {
              const onSeeked = () => {
                video.removeEventListener('seeked', onSeeked);
                res();
              };
              video.addEventListener('seeked', onSeeked);
              video.currentTime = time;
            });
          };

          for (const time of timestamps) {
            try {
              await seekTo(time);
              ctx.drawImage(video, 0, 0, targetWidth, targetHeight);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
              const base64Data = dataUrl.includes(',') ? dataUrl.split(',')[1] : dataUrl;
              if (base64Data) {
                frames.push(base64Data);
              }
            } catch (err) {
              console.warn('Frame capture failed at timestamp:', time, err);
            }
          }

          clearTimeout(timeoutId);
          cleanup();
          resolve(frames);
        } catch (e) {
          clearTimeout(timeoutId);
          cleanup();
          resolve([]);
        }
      };

      video.onerror = async () => {
        clearTimeout(timeoutId);
        cleanup();
        // If <video> failed, try image fallback in case it was a photo file
        const imgFallback = await extractFromImage(videoSource, maxDimension);
        resolve(imgFallback);
      };
    } catch (e) {
      resolve([]);
    }
  });
}
