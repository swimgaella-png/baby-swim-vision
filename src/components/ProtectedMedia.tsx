import React, { useState, useEffect, useRef } from 'react';
import { Shield, EyeOff } from 'lucide-react';

interface ProtectedImageProps {
  src: string;
  alt?: string;
  className?: string;
  containerClassName?: string;
  withWatermark?: boolean;
  watermarkText?: string;
  loading?: 'lazy' | 'eager';
  caption?: string;
  captionClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  enableBlurProtection?: boolean;
}

/**
 * Hook to detect tab/window visibility loss and protect media from background grabbers.
 * Only triggers when the tab is actually hidden (switching tabs or minimizing window),
 * never during normal in-app interaction, scrolling, or modal navigation.
 */
export function useMediaVisibilityProtection(enabled: boolean = true) {
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [enabled]);

  return isBlurred;
}

/**
 * Discrete, elegant diagonal watermark pattern overlay.
 * Renders subtle repeating branding across the media at low opacity,
 * protecting intellectual property against cropping while keeping pedagogy crystal clear.
 */
export const DiscreteWatermarkOverlay: React.FC<{ text?: string }> = ({
  text = 'Baby Swim Vision',
}) => {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 z-20 pointer-events-none select-none overflow-hidden"
    >
      {/* Subtle repeating micro-text pattern */}
      <div
        className="absolute -inset-[50%] w-[200%] h-[200%] rotate-[-24deg] flex flex-wrap content-center justify-around opacity-[0.05] pointer-events-none text-white font-extrabold uppercase text-[11px] tracking-widest leading-loose"
        style={{ userSelect: 'none' }}
      >
        {Array.from({ length: 48 }).map((_, i) => (
          <span key={i} className="px-6 py-4 inline-block whitespace-nowrap">
            {text} • Pédagogie Aquatique
          </span>
        ))}
      </div>

      {/* Discrete bottom corner branding stamp */}
      <div className="absolute bottom-3 right-3 z-20 pointer-events-none select-none flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-950/45 backdrop-blur-xs border border-white/15 text-white/70 text-[10px] sm:text-[11px] font-black uppercase tracking-wider shadow-sm">
        <Shield className="w-3 h-3 text-sky-400 shrink-0" />
        <span>{text}</span>
      </div>
    </div>
  );
};

/**
 * ProtectedImage:
 * - Disables right-click (context menu)
 * - Disables drag and drop
 * - Disables text/image selection
 * - Transparent shield overlay intercepting direct clicks/context actions
 * - Discrete dynamic watermark "Baby Swim Vision"
 * - Visibility blur protection on background tab switch
 */
export const ProtectedImage: React.FC<ProtectedImageProps> = ({
  src,
  alt = 'Image pédagogique Baby Swim Vision',
  className = 'w-full h-full object-cover',
  containerClassName = '',
  withWatermark = true,
  watermarkText = 'Baby Swim Vision',
  loading = 'lazy',
  caption,
  captionClassName = 'p-3 bg-slate-900/90 text-slate-200 text-xs italic text-center border-t border-slate-800',
  onClick,
  onError,
  onLoad,
  enableBlurProtection = true,
}) => {
  const isBlurred = useMediaVisibilityProtection(enableBlurProtection);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <div
      className={`relative select-none overflow-hidden ${containerClassName}`}
      style={{
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
      data-protected-media="true"
    >
      {/* Background Tab Privacy Protection Overlay */}
      {isBlurred && (
        <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-xl flex flex-col items-center justify-center p-4 text-center text-white space-y-2 select-none pointer-events-none animate-fade-in">
          <EyeOff className="w-8 h-8 text-sky-400 animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Contenu protégé
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Baby Swim Vision — Lecture active
          </p>
        </div>
      )}

      {/* Main Image */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        draggable={false}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onError={onError}
        onLoad={onLoad}
        referrerPolicy="no-referrer"
        className={`${className} ${isBlurred ? 'filter blur-xl' : ''} transition-all duration-200 select-none pointer-events-none`}
        style={{
          WebkitUserSelect: 'none',
          userSelect: 'none',
        } as React.CSSProperties}
      />

      {/* Discrete Anti-Piracy Watermark */}
      {withWatermark && <DiscreteWatermarkOverlay text={watermarkText} />}

      {/* Interactive Shield Overlay: Intercepts right-clicks while propagating user clicks */}
      <div
        className={`absolute inset-0 z-10 select-none bg-transparent ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={onClick}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onMouseDown={(e) => {
          if (e.button === 2) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        title=""
        aria-hidden="true"
        style={{
          WebkitUserSelect: 'none',
          userSelect: 'none',
          WebkitTouchCallout: 'none',
        }}
      />

      {/* Caption if present */}
      {caption && <div className={captionClassName}>{caption}</div>}
    </div>
  );
};

interface ProtectedVideoProps {
  src: string;
  poster?: string;
  controls?: boolean;
  autoPlay?: boolean;
  playsInline?: boolean;
  preload?: 'auto' | 'metadata' | 'none';
  className?: string;
  containerClassName?: string;
  withWatermark?: boolean;
  watermarkText?: string;
  videoRef?: React.RefObject<HTMLVideoElement | null>;
  onError?: (e: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onPlay?: () => void;
  onPause?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  enableBlurProtection?: boolean;
}

/**
 * ProtectedVideo:
 * - controlsList="nodownload noplaybackrate noremoteplayback"
 * - disablePictureInPicture
 * - disables context menu & drag
 * - Discrete dynamic watermark for pedagogical/demo videos
 * - Visibility protection: auto-pauses/blurs if tab is backgrounded
 */
export const ProtectedVideo: React.FC<ProtectedVideoProps> = ({
  src,
  poster,
  controls = true,
  autoPlay = false,
  playsInline = true,
  preload = 'metadata',
  className = 'w-full h-full object-contain',
  containerClassName = '',
  withWatermark = true,
  watermarkText = 'Baby Swim Vision',
  videoRef: externalRef,
  onError,
  onPlay,
  onPause,
  onClick,
  enableBlurProtection = true,
}) => {
  const internalRef = useRef<HTMLVideoElement | null>(null);
  const activeRef = externalRef || internalRef;
  const isBlurred = useMediaVisibilityProtection(enableBlurProtection);

  useEffect(() => {
    if (isBlurred && activeRef.current && !activeRef.current.paused) {
      activeRef.current.pause();
    }
  }, [isBlurred, activeRef]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  return (
    <div
      className={`relative select-none overflow-hidden bg-black flex items-center justify-center ${containerClassName}`}
      style={{
        WebkitUserSelect: 'none',
        userSelect: 'none',
        WebkitTouchCallout: 'none',
      }}
      data-protected-media="true"
    >
      {/* Background Tab Privacy Protection */}
      {isBlurred && (
        <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-xl flex flex-col items-center justify-center p-4 text-center text-white space-y-2 select-none pointer-events-none animate-fade-in">
          <EyeOff className="w-8 h-8 text-sky-400 animate-pulse" />
          <p className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Vidéo protégée
          </p>
          <p className="text-[11px] text-slate-400 font-medium">
            Baby Swim Vision — Lecture active
          </p>
        </div>
      )}

      {/* Video Element */}
      <video
        ref={activeRef}
        src={src}
        poster={poster}
        controls={controls}
        controlsList="nodownload noplaybackrate noremoteplayback"
        disablePictureInPicture
        autoPlay={autoPlay}
        playsInline={playsInline}
        preload={preload}
        draggable={false}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onError={onError}
        onPlay={onPlay}
        onPause={onPause}
        onClick={onClick}
        className={`${className} ${isBlurred ? 'filter blur-xl' : ''} transition-all duration-200 select-none`}
        style={{
          WebkitUserSelect: 'none',
          userSelect: 'none',
        }}
      />

      {/* Discrete Watermark for pedagogical / demo videos */}
      {withWatermark && <DiscreteWatermarkOverlay text={watermarkText} />}
    </div>
  );
};
