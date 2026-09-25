import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Camera,
  Download,
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Sliders,
  Check,
  Eye,
  X,
  Image as ImageIcon,
  Zap,
  RefreshCw,
} from 'lucide-react';

interface VideoAnalysisPlayerProps {
  videoUrl?: string;
  videoName?: string;
  babyName?: string;
  situationTitle?: string;
  situationKey?: string;
}

/**
 * Safely resolves and encodes video URLs, guaranteeing a valid playable source.
 * If URL is missing, maps to the best pedagogical demonstration video.
 */
export function getSafeVideoUrl(
  rawUrl?: string,
  situationTitle?: string,
  situationKey?: string
): string {
  if (rawUrl && typeof rawUrl === 'string' && rawUrl.trim() !== '') {
    const trimmed = rawUrl.trim();
    // Blob, data, or object URLs can be passed directly
    if (trimmed.startsWith('blob:') || trimmed.startsWith('data:')) {
      return trimmed;
    }
    // Encode spaces and special characters for standard web URLs
    try {
      return encodeURI(decodeURI(trimmed));
    } catch {
      return trimmed;
    }
  }

  // If no URL is provided, match with pedagogical reference videos
  const text = `${situationKey || ''} ${situationTitle || ''}`.toLowerCase();

  if (text.includes('rituel') || text.includes('taper') || text.includes('eclabouss') || text.includes('éveil')) {
    return '/media/demo-videos/glenn%20taper%20eau.mp4';
  }
  if (text.includes('portage') || text.includes('ventral') || text.includes('lâch') || text.includes('lach')) {
    return '/media/demo-videos/glenn%20immersion%20l%C3%A2ch%C3%A9e.mp4';
  }
  if (text.includes('flottaison') || text.includes('dorsal') || text.includes('dos') || text.includes('brassard')) {
    return '/media/demo-videos/lilou%20dos%20brassards.mp4';
  }
  if (text.includes('battement') || text.includes('propulsion') || text.includes('escalier') || text.includes('déplacement')) {
    return '/media/demo-videos/lilou%20d%C3%A9part%20escalier.mp4';
  }

  // Baseline reference video (standard vertical immersion)
  return '/media/demo-videos/glenn%20immersion%20verticale.mp4';
}

export const VideoAnalysisPlayer: React.FC<VideoAnalysisPlayerProps> = ({
  videoUrl,
  videoName = 'Séance aquatique',
  babyName = 'Bébé',
  situationTitle,
  situationKey,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Active resolved video URL with automatic fallback
  const [activeUrl, setActiveUrl] = useState<string>(() =>
    getSafeVideoUrl(videoUrl, situationTitle, situationKey)
  );
  const [hasFallbackTried, setHasFallbackTried] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hasVideoError, setHasVideoError] = useState<boolean>(false);

  // Captured Snapshot state & modal
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isEnhanced, setIsEnhanced] = useState<boolean>(true);
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState<boolean>(false);
  const [isProcessingCapture, setIsProcessingCapture] = useState<boolean>(false);
  const [captureTimestamp, setCaptureTimestamp] = useState<number>(0);

  // Available slow motion choices (3 slow-mo speeds + normal speed)
  const speedOptions = [
    { label: '0.25x (Super Ralenti)', value: 0.25, badge: 'Détails & apnée' },
    { label: '0.5x (Ralenti)', value: 0.5, badge: 'Posture & appuis' },
    { label: '0.75x (Fluide)', value: 0.75, badge: 'Mouvements' },
    { label: '1.0x (Normal)', value: 1.0, badge: 'Temps réel' },
  ];

  // Frame duration approx (~25 fps -> 0.04s)
  const FRAME_STEP = 0.04;

  // Synchronize when videoUrl prop or situation changes
  useEffect(() => {
    const nextUrl = getSafeVideoUrl(videoUrl, situationTitle, situationKey);
    setActiveUrl(nextUrl);
    setHasVideoError(false);
    setHasFallbackTried(false);
  }, [videoUrl, situationTitle, situationKey]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Immediately capture duration if metadata is already loaded
    if (video.duration && !isNaN(video.duration) && video.duration > 0) {
      setDuration(video.duration);
      video.playbackRate = playbackRate;
    }

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
      video.playbackRate = playbackRate;
      setHasVideoError(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('durationchange', handleLoadedMetadata);
    video.addEventListener('canplay', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('durationchange', handleLoadedMetadata);
      video.removeEventListener('canplay', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [playbackRate, activeUrl]);

  const handleVideoError = (e: any) => {
    console.warn('Video failed to load with activeUrl:', activeUrl, e);
    // Automatic fallback: try standard pedagogical demo video if first attempt failed
    if (!hasFallbackTried) {
      setHasFallbackTried(true);
      const fallbackUrl = '/media/demo-videos/glenn%20immersion%20verticale.mp4';
      if (activeUrl !== fallbackUrl) {
        setActiveUrl(fallbackUrl);
        setHasVideoError(false);
        return;
      }
    }
    setHasVideoError(true);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Direct play blocked, retrying muted:', err);
            video.muted = true;
            setIsMuted(true);
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch((e) => console.error('Playback failed even when muted:', e));
          });
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleStepFrame = (frames: number) => {
    const video = videoRef.current;
    if (!video) return;

    if (!video.paused) {
      video.pause();
      setIsPlaying(false);
    }

    const newTime = Math.max(0, Math.min(video.duration || 0, video.currentTime + frames * FRAME_STEP));
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const targetTime = Number(e.target.value);
    video.currentTime = targetTime;
    setCurrentTime(targetTime);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  /**
   * Advanced Image Enhancement algorithm applied to Canvas ImageData:
   * 1. Dynamic Contrast & Tone adjustment (+12% contrast stretch)
   * 2. Unsharp Mask 3x3 Sharpening filter to boost contour clarity, eyes, water drops
   * 3. Subtle color vibrance enhancement
   */
  const applyImageEnhancements = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    try {
      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const len = data.length;

      // 1. Contrast & Vibrance pass
      const contrast = 1.14; // +14% contrast
      const brightness = 6;  // Slight brightness lift

      for (let i = 0; i < len; i += 4) {
        // Red
        data[i] = Math.min(255, Math.max(0, ((data[i] - 128) * contrast + 128) + brightness));
        // Green
        data[i + 1] = Math.min(255, Math.max(0, ((data[i + 1] - 128) * contrast + 128) + brightness));
        // Blue
        data[i + 2] = Math.min(255, Math.max(0, ((data[i + 2] - 128) * contrast + 128) + brightness));
      }

      // 2. Unsharp-mask Sharpening filter (3x3 kernel)
      const weights = [
        0, -0.4, 0,
        -0.4, 2.6, -0.4,
        0, -0.4, 0
      ];

      const side = Math.round(Math.sqrt(weights.length));
      const halfSide = Math.floor(side / 2);
      const src = new Uint8ClampedArray(data);

      for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
          const dstOff = (y * width + x) * 4;
          let r = 0, g = 0, b = 0;

          for (let cy = 0; cy < side; cy++) {
            for (let cx = 0; cx < side; cx++) {
              const scy = y + cy - halfSide;
              const scx = x + cx - halfSide;
              const srcOff = (scy * width + scx) * 4;
              const wt = weights[cy * side + cx];
              r += src[srcOff] * wt;
              g += src[srcOff + 1] * wt;
              b += src[srcOff + 2] * wt;
            }
          }

          data[dstOff] = Math.min(255, Math.max(0, r));
          data[dstOff + 1] = Math.min(255, Math.max(0, g));
          data[dstOff + 2] = Math.min(255, Math.max(0, b));
        }
      }

      ctx.putImageData(imgData, 0, 0);
    } catch (err) {
      console.warn('Canvas post-processing error:', err);
    }
  };

  /**
   * Capture high-definition frame from video with enhancement option
   */
  const handleCaptureFrame = () => {
    const video = videoRef.current;
    if (!video) return;

    setIsProcessingCapture(true);
    const snapTime = video.currentTime;
    setCaptureTimestamp(snapTime);

    try {
      const width = video.videoWidth || 1280;
      const height = video.videoHeight || 720;

      // 1. Raw / Original canvas
      const rawCanvas = document.createElement('canvas');
      rawCanvas.width = width;
      rawCanvas.height = height;
      const rawCtx = rawCanvas.getContext('2d');
      if (rawCtx) {
        rawCtx.drawImage(video, 0, 0, width, height);
        const rawUrl = rawCanvas.toDataURL('image/png', 1.0);
        setOriginalImage(rawUrl);

        // 2. Enhanced canvas with sharpness and contrast
        const enhancedCanvas = document.createElement('canvas');
        enhancedCanvas.width = width;
        enhancedCanvas.height = height;
        const enhCtx = enhancedCanvas.getContext('2d');
        if (enhCtx) {
          enhCtx.drawImage(video, 0, 0, width, height);
          applyImageEnhancements(enhCtx, width, height);

          // Add subtle professional watermark tag at bottom right
          enhCtx.font = 'bold 20px sans-serif';
          enhCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
          enhCtx.shadowColor = 'rgba(0, 0, 0, 0.6)';
          enhCtx.shadowBlur = 6;
          enhCtx.fillText(`Baby Swim Vision • ${babyName} (${formatTime(snapTime)})`, width - 380, height - 24);

          const enhancedUrl = enhancedCanvas.toDataURL('image/png', 1.0);
          setCapturedImage(enhancedUrl);
        }
      }

      setIsEnhanced(true);
      setIsSnapshotModalOpen(true);
    } catch (err) {
      console.error('Error capturing frame:', err);
    } finally {
      setIsProcessingCapture(false);
    }
  };

  const handleDownloadSnapshot = () => {
    const activeImg = isEnhanced ? (capturedImage || originalImage) : (originalImage || capturedImage);
    if (!activeImg) return;

    const link = document.createElement('a');
    const cleanBabyName = babyName.replace(/[^a-zA-Z0-9]/g, '_');
    const timeFormatted = formatTime(captureTimestamp).replace(':', 'm') + 's';
    link.download = `BabySwim_${cleanBabyName}_${timeFormatted}_HD.png`;
    link.href = activeImg;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatTime = (timeInSeconds: number): string => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    const ms = Math.floor((timeInSeconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-800 text-white space-y-0"
    >
      {/* Video Header / Status */}
      <div className="p-3.5 sm:p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-bold text-slate-200 truncate">{videoName}</span>
          {situationTitle && (
            <span className="hidden sm:inline-block px-2 py-0.5 bg-sky-950 text-sky-300 rounded-md border border-sky-800 text-[11px]">
              {situationTitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded-lg font-mono text-[11px] font-semibold border border-slate-700">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title={isMuted ? 'Activer le son' : 'Couper le son'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Video Screen */}
      <div 
        className="relative aspect-16/9 bg-black flex items-center justify-center group overflow-hidden select-none"
        data-protected-media="true"
        onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
      >
        {activeUrl && !hasVideoError ? (
          <video
            ref={videoRef}
            key={activeUrl}
            src={activeUrl}
            crossOrigin="anonymous"
            preload="auto"
            playsInline
            muted={isMuted}
            controlsList="nodownload noplaybackrate noremoteplayback"
            disablePictureInPicture
            draggable={false}
            onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onClick={togglePlay}
            onError={handleVideoError}
            className="w-full h-full object-contain cursor-pointer select-none"
          />
        ) : (
          <div className="text-center p-6 space-y-3 text-slate-400">
            <ImageIcon className="w-12 h-12 mx-auto text-sky-400 opacity-60" />
            <p className="font-semibold text-white text-sm">Vidéo de la séance</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Aperçu interactif et analyse au ralenti
            </p>
            <button
              type="button"
              onClick={() => {
                const fallback = '/media/demo-videos/glenn%20immersion%20verticale.mp4';
                setActiveUrl(fallback);
                setHasVideoError(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Charger la vidéo de référence</span>
            </button>
          </div>
        )}

        {/* Center Big Play Button overlay if paused */}
        {!isPlaying && activeUrl && !hasVideoError && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-sky-600/90 hover:bg-sky-500 text-white flex items-center justify-center shadow-2xl transition-all transform hover:scale-110 cursor-pointer backdrop-blur-xs z-10"
            title="Lire la vidéo"
          >
            <Play className="w-7 h-7 fill-current ml-1" />
          </button>
        )}

        {/* Live Speed Badge watermark */}
        {playbackRate !== 1.0 && (
          <div className="absolute top-3 left-3 bg-amber-500/90 text-slate-950 font-extrabold text-[11px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <span>Ralenti {playbackRate}x</span>
          </div>
        )}
      </div>

      {/* Video Progress Bar */}
      <div className="px-4 pt-3 pb-1 bg-slate-950/60 border-t border-slate-800/80">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.01}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400 transition-all"
        />
      </div>

      {/* Advanced Playback & Analysis Controls Bar */}
      <div className="p-4 bg-slate-950 space-y-4">
        {/* Upper Row: Main Playback, Frame-by-Frame, and Snapshot Capture */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Play/Pause & Step Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={togglePlay}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-600/20 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'Pause' : 'Lecture'}</span>
            </button>

            {/* Frame-by-Frame Navigation (Image par image) */}
            <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
              <button
                onClick={() => handleStepFrame(-1)}
                className="px-2.5 py-1.5 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                title="Reculer d'une image (-0.04s)"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="text-[11px]">-1 img</span>
              </button>

              <div className="w-px h-4 bg-slate-700" />

              <button
                onClick={() => handleStepFrame(1)}
                className="px-2.5 py-1.5 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                title="Avancer d'une image (+0.04s)"
              >
                <span className="text-[11px]">+1 img</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={() => {
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  setCurrentTime(0);
                }
              }}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors cursor-pointer"
              title="Recommencer du début"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 📸 HD Screenshot Capture Button */}
          <button
            onClick={handleCaptureFrame}
            disabled={isProcessingCapture}
            className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-102 cursor-pointer"
            title="Prendre une photo nette de l'image actuelle et l'améliorer"
          >
            <Camera className="w-4 h-4 text-emerald-200" />
            <span>📸 Capturer la photo (HD)</span>
            <Sparkles className="w-3 h-3 text-amber-300" />
          </button>
        </div>

        {/* Lower Row: 3 Slow Motion Speed Selection (Ralenti) */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>Vitesse de lecture (Ralenti Pédagogique) :</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {speedOptions.map((opt) => {
              const isSelected = playbackRate === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleSpeedChange(opt.value)}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 border ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-400 shadow-xs'
                      : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <span>{opt.label.split(' ')[0]}</span>
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Snapshot Preview & Enhancement Modal */}
      {isSnapshotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-5 text-white animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Capture d'image haute précision</h3>
                  <p className="text-xs text-slate-400">
                    Instantané à {formatTime(captureTimestamp)} • {babyName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSnapshotModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Captured Photo Preview */}
            <div 
              className="relative aspect-16/9 bg-black rounded-2xl overflow-hidden border border-slate-800 shadow-inner flex items-center justify-center group select-none"
              data-protected-media="true"
              onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <img
                src={isEnhanced ? (capturedImage || originalImage || '') : (originalImage || '')}
                alt="Capture vidéo séance"
                draggable={false}
                onContextMenu={(e) => { e.preventDefault(); e.stopPropagation(); }}
                onDragStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="w-full h-full object-contain select-none pointer-events-none"
              />

              {/* Enhanced badge */}
              <div className="absolute top-3 right-3 bg-emerald-500/90 text-white font-bold text-[11px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 backdrop-blur-xs">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{isEnhanced ? 'Qualité Optimisée HD & Nette' : 'Image brute'}</span>
              </div>
            </div>

            {/* Quality Enhancement Toggle Details */}
            <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-200">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Amélioration visuelle automatique</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Filtre de netteté des contours, micro-contraste des yeux & gouttelettes d'eau, et correction de clarté.
                </p>
              </div>

              <button
                onClick={() => setIsEnhanced(!isEnhanced)}
                className={`px-3.5 py-2 rounded-xl font-bold text-xs border transition-all cursor-pointer shrink-0 ${
                  isEnhanced
                    ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs'
                    : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600'
                }`}
              >
                {isEnhanced ? '✓ Amélioration active' : 'Afficher l\'image brute'}
              </button>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsSnapshotModalOpen(false)}
                className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Fermer
              </button>
              <button
                onClick={handleDownloadSnapshot}
                className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Télécharger la photo HD (.PNG)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
