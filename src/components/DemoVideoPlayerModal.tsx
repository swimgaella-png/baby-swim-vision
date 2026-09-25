import React, { useState, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Sparkles,
  Info,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video as VideoIcon,
  Tag,
  Eye,
} from 'lucide-react';
import { DemoVideoItem } from '../types';
import { useAdminMode } from '../context/AdminModeContext';
import { ProtectedVideo } from './ProtectedMedia';

interface DemoVideoPlayerModalProps {
  video: DemoVideoItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DemoVideoPlayerModal: React.FC<DemoVideoPlayerModalProps> = ({
  video,
  isOpen,
  onClose,
}) => {
  const { isAdminModeActive } = useAdminMode();
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  if (!isOpen || !video) return null;

  // Resolve video URL from videoUrl or videoFileName
  const resolvedUrl =
    video.videoUrl ||
    (video.videoFileName ? `/media/videos/${video.videoFileName}` : '');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 bg-sky-500/20 text-sky-300 border border-sky-400/30 rounded-full">
              {video.category || 'DÉMONSTRATION PÉDAGOGIQUE'}
            </span>
            {video.recommendedAge && (
              <span className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full">
                <Clock className="w-3.5 h-3.5 text-sky-400" />
                <span>{video.recommendedAge}</span>
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fermer le lecteur"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Video Player Container */}
          <div className="relative rounded-2xl bg-black overflow-hidden shadow-md flex items-center justify-center aspect-16/9 max-h-[50vh]">
            {!hasVideoError && resolvedUrl ? (
              <ProtectedVideo
                videoRef={videoRef}
                src={resolvedUrl}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="w-full h-full object-contain"
                containerClassName="w-full h-full"
                onError={() => setHasVideoError(true)}
                withWatermark={true}
              />
            ) : (
              <div className="text-center p-6 text-slate-300 space-y-3">
                <VideoIcon className="w-12 h-12 mx-auto text-slate-500" />
                <p className="text-sm font-semibold">
                  Fichier vidéo non accessible ou en cours d'intégration
                </p>
                <p className="text-xs text-slate-400 max-w-sm mx-auto font-mono">
                  {video.videoFileName || resolvedUrl}
                </p>
                {isAdminModeActive && (
                  <div className="p-3 bg-amber-950/80 border border-amber-600/50 rounded-xl text-amber-300 text-xs text-left max-w-md mx-auto space-y-1">
                    <p className="font-bold flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>Mode Administrateur — Fichier physique manquant</span>
                    </p>
                    <p className="font-mono text-[11px] text-amber-200">
                      Déposez le fichier dans : <br />
                      <span className="text-white font-bold">
                        public/media/videos/{video.videoFileName || 'nom-du-fichier.mp4'}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title & Age */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                {video.title}
              </h3>
              {video.videoDuration && (
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                  ⏱ Durée : ~{video.videoDuration}s
                </span>
              )}
            </div>
            {video.recommendedAge && (
              <div className="sm:hidden inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>Âge recommandé : {video.recommendedAge}</span>
              </div>
            )}
          </div>

          {/* Description de la démonstration */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-700">
              <Eye className="w-4 h-4 text-sky-600 shrink-0" />
              <span>Description</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-normal">
              {video.description || video.pedagogicalExplanation || 'Aucune description fournie.'}
            </p>
          </div>

          {/* Section 3: Compétences illustrées (si renseignées) */}
          {video.skills && video.skills.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                <span>Points d'attention & repères moteurs</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {video.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-50 text-sky-900 border border-sky-100"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            💡 Démonstration pédagogique de référence • Aucun calcul IA
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Fermer la vidéo
          </button>
        </div>
      </div>
    </div>
  );
};
