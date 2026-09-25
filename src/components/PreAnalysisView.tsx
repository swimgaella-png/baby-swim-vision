import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Shield,
  FileVideo,
  AlertTriangle,
  ArrowRight,
  Bot,
  Check,
} from 'lucide-react';
import { BabyProfile, AnalysisResult, VideoMetadata, DemoVideoItem } from '../types';
import { videoAnalysisService } from '../services/analysisService';
import { useTranslation } from '../i18n/LanguageContext';
import { ProtectedImage, ProtectedVideo } from './ProtectedMedia';

interface PreAnalysisViewProps {
  activeBaby: BabyProfile | null;
  videoParams?: {
    videoBlob?: Blob | File;
    videoUrl?: string;
    durationSeconds?: number;
    sizeMB?: number;
    name?: string;
    situationKey?: string;
    demoScenarioId?: string;
    demoVideo?: DemoVideoItem;
    metadata?: VideoMetadata;
  };
  // Fallbacks for direct props if passed
  videoBlob?: Blob | File;
  videoUrl?: string;
  videoDurationSeconds?: number;
  videoSizeMB?: number;
  videoName?: string;
  demoScenarioId?: string;
  demoVideo?: DemoVideoItem;
  situationKey?: string;
  onBack?: () => void;
  onCancel?: () => void;
  onAnalysisCompleted?: (result: AnalysisResult) => void;
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

export const PreAnalysisView: React.FC<PreAnalysisViewProps> = ({
  activeBaby,
  videoParams,
  videoBlob: directBlob,
  videoUrl: directUrl,
  videoDurationSeconds: directDuration,
  videoSizeMB: directSize,
  videoName: directName,
  demoScenarioId: directScenarioId,
  demoVideo: directDemoVideo,
  situationKey: directSituationKey,
  onBack,
  onCancel,
  onAnalysisCompleted,
  onAnalysisComplete,
}) => {
  const { t, locale } = useTranslation();

  const [consentAccepted, setConsentAccepted] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Safe parameters extraction
  const effectiveUrl = videoParams?.videoUrl ?? directUrl ?? '';
  const effectiveBlob = videoParams?.videoBlob ?? directBlob ?? new Blob([], { type: 'video/mp4' });
  const effectiveDuration = videoParams?.durationSeconds ?? directDuration ?? 20;
  const effectiveSize = videoParams?.sizeMB ?? directSize ?? 10;
  const effectiveName = videoParams?.name ?? directName ?? 'Vidéo de séance';
  const initialSituationKey = videoParams?.situationKey ?? directSituationKey ?? 'auto';
  const effectiveScenarioId = videoParams?.demoScenarioId ?? directScenarioId;
  const effectiveDemoVideo = videoParams?.demoVideo ?? directDemoVideo;

  // Selected situation: defaults to automatic AI detection
  const selectedSituationKey = effectiveDemoVideo?.situationKey || initialSituationKey || 'auto';

  const handleBackAction = () => {
    if (onBack) onBack();
    else if (onCancel) onCancel();
  };

  const handleCompleteAction = (result: AnalysisResult) => {
    if (onAnalysisCompleted) onAnalysisCompleted(result);
    else if (onAnalysisComplete) onAnalysisComplete(result);
  };

  const handleRunAnalysis = async () => {
    if (!consentAccepted) {
      setErrorMsg(t('preAnalysis.consentWarning'));
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const result = await videoAnalysisService.analyzeVideo({
        babyProfile: activeBaby || {
          id: 'demo',
          userId: 'demo',
          name: 'Baby',
          birthDate: '2025-12-10',
          ageMonths: 8,
          ageWeeks: 35,
          level: 'decouverte',
          startDate: '2026-04-15',
          goals: [],
          hideNameInAnalysis: false,
        },
        videoUrl: effectiveUrl,
        videoBlob: effectiveBlob,
        videoName: effectiveName,
        videoDurationSeconds: effectiveDuration,
        situationKey: selectedSituationKey,
        selectedDemoScenarioId: effectiveScenarioId,
        language: locale,
      });

      handleCompleteAction(result);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(t('preAnalysis.error') + (err.message || ''));
      setIsAnalyzing(false);
    }
  };

  const isImageMedia = (effectiveBlob && effectiveBlob.type && effectiveBlob.type.startsWith('image/')) ||
    (/\.(jpeg|jpg|png|webp|gif)$/i.test(effectiveName || '')) ||
    (typeof effectiveUrl === 'string' && effectiveUrl.startsWith('data:image/'));

  const [videoLoadError, setVideoLoadError] = useState<boolean>(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={handleBackAction}
          disabled={isAnalyzing}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          {t('preAnalysis.changeVideo')}
        </button>
        <div className="text-xs font-medium text-slate-400">
          {t('preAnalysis.preAnalysisTitle')}
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('preAnalysis.readyTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('preAnalysis.readySubtitle', { name: activeBaby?.name || 'votre bébé' })}
          </p>
        </div>

        {/* Video / Image Player & Metadata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
          <div className="relative aspect-16/9 bg-slate-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center group">
            {effectiveUrl && !videoLoadError ? (
              isImageMedia ? (
                <ProtectedImage
                  src={effectiveUrl}
                  alt="Photo de séance"
                  className="w-full h-full object-contain"
                  containerClassName="w-full h-full"
                  onError={() => setVideoLoadError(true)}
                  withWatermark={Boolean(effectiveDemoVideo)}
                />
              ) : (
                <ProtectedVideo
                  src={effectiveUrl}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                  containerClassName="w-full h-full"
                  onError={() => setVideoLoadError(true)}
                  withWatermark={Boolean(effectiveDemoVideo)}
                />
              )
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs space-y-2">
                <FileVideo className="w-8 h-8 mx-auto text-sky-400 animate-pulse" />
                <p className="font-semibold text-white">Vidéo de démonstration</p>
                <p className="text-[11px] text-slate-400">{effectiveName}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 space-y-2 text-xs">
              <div className="font-bold text-slate-800 flex items-center justify-between border-b border-sky-100/60 pb-2">
                <div className="flex items-center gap-1.5 uppercase tracking-wider text-sky-900 font-bold">
                  <FileVideo className="w-3.5 h-3.5 text-sky-600" />
                  <span>{t('preAnalysis.videoInfo')}</span>
                </div>
                {videoParams?.metadata?.wasConverted && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Adaptée & Optimisée</span>
                  </span>
                )}
              </div>

              {/* Technical detection badges */}
              <div className="grid grid-cols-2 gap-2 py-1">
                <div className="bg-white/80 p-2 rounded-xl border border-sky-100/80">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Format & Codec</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {videoParams?.metadata?.format || 'MP4'}
                  </span>
                  {videoParams?.metadata?.codec && (
                    <span className="text-[10px] text-slate-500 block">
                      {videoParams.metadata.codec}
                    </span>
                  )}
                </div>

                <div className="bg-white/80 p-2 rounded-xl border border-sky-100/80">
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">Résolution</span>
                  <span className="font-bold text-slate-800 text-xs">
                    {videoParams?.metadata?.width && videoParams?.metadata?.height
                      ? `${videoParams.metadata.width}×${videoParams.metadata.height}`
                      : 'HD'}
                  </span>
                  <span className="text-[10px] text-slate-500 block capitalize">
                    {videoParams?.metadata?.orientation === 'portrait' ? '📱 Portrait' : '🖥️ Paysage'}
                    {videoParams?.metadata?.fps ? ` • ${videoParams.metadata.fps} FPS` : ''}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-slate-600 py-0.5 border-t border-sky-100/60 pt-1.5">
                <span>{t('preAnalysis.duration')} :</span>
                <span className="font-semibold text-slate-900">{effectiveDuration} {t('common.seconds')}</span>
              </div>
              <div className="flex justify-between text-slate-600 py-0.5">
                <span>{t('preAnalysis.fileSize')} :</span>
                <span className="font-semibold text-slate-900">{effectiveSize} Mo</span>
              </div>
              <div className="flex justify-between text-slate-600 py-0.5">
                <span>{t('common.baby')} :</span>
                <span className="font-semibold text-slate-900">
                  {activeBaby?.name || 'Bébé'} ({activeBaby?.ageMonths || 8} {t('common.months')})
                </span>
              </div>
            </div>

            <div className="p-3 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200/80 rounded-2xl space-y-1 text-xs text-slate-700">
              <div className="flex items-center gap-1.5 font-bold text-sky-900">
                <Bot className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>Moteur Pédagogique IA Baby Swim Vision</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                L'IA analyse le mouvement en respectant l'orientation et la vitesse normale du bébé dans l'eau.
              </p>
            </div>
          </div>
        </div>

        {/* Demo Video Pedagogical Explanation Banner */}
        {effectiveDemoVideo && (
          <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Ce que montre cette vidéo de démonstration</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                {effectiveDemoVideo.category || 'DÉMONSTRATION'}
              </span>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              {effectiveDemoVideo.pedagogicalExplanation || effectiveDemoVideo.description}
            </p>
            {effectiveDemoVideo.skills && effectiveDemoVideo.skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {effectiveDemoVideo.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white border border-amber-200 text-amber-900 shadow-2xs"
                  >
                    🎯 {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Automated AI Situation & Exercise Detection */}
        <div className="space-y-3 pt-2">
          <div className="p-4 bg-gradient-to-br from-sky-50/90 via-sky-50/60 to-indigo-50/80 border border-sky-200/90 rounded-2xl flex items-start gap-3.5 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Bot className="w-5 h-5" />
            </div>
            <div className="space-y-1 flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
                  <span>Détection automatique par l'IA</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 border border-sky-200/80">
                  100% Automatisé
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                L'IA analyse directement la vidéo pour identifier automatiquement la situation et l'exercice aquatique (départ assis au bord, glisse ventrale, flottaison dorsale, portage vertical ou immersion) et calibrer les repères biomécaniques sans sélection manuelle.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer & Mandatory Consent */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
            <p className="text-xs text-slate-600 leading-relaxed">
              <strong>{t('preAnalysis.frameworkNotice')}</strong>
            </p>
          </div>
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={consentAccepted}
              onChange={(e) => setConsentAccepted(e.target.checked)}
              disabled={isAnalyzing}
              className="w-4 h-4 text-sky-600 rounded-sm focus:ring-sky-500 border-slate-300 cursor-pointer"
            />
            <span>
              {t('preAnalysis.consentCheckbox')}
            </span>
          </label>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-800 rounded-xl flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button & Loading Indicator */}
        <div className="space-y-3 pt-2">
          {!isAnalyzing ? (
            <button
              onClick={handleRunAnalysis}
              className="w-full py-4 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2 transition-all hover:scale-101 cursor-pointer"
            >
              <Sparkles className="w-5 h-5" />
              <span>{t('preAnalysis.runAnalysisBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="p-5 bg-sky-50 rounded-2xl border border-sky-200 text-center space-y-2">
              <div className="flex items-center justify-center gap-2 text-sky-800 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>{t('preAnalysis.analyzingTitle')}</span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                {t('preAnalysis.stepPriority')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
