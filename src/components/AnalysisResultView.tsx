import React, { useState } from 'react';
import {
  Sparkles,
  ThumbsUp,
  Eye,
  Target,
  Waves,
  ShieldAlert,
  BookmarkCheck,
  RotateCcw,
  CheckCircle2,
  BookOpen,
  Calendar,
  Compass,
  Share2,
  FileVideo,
} from 'lucide-react';
import { AnalysisResult, BabyProfile } from '../types';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { ShareAnalysisModal } from './ShareAnalysisModal';
import { VideoAnalysisPlayer } from './VideoAnalysisPlayer';
import { MovementChronologyCard } from './MovementChronologyCard';
import { progressService } from '../services/progressService';
import { useTranslation } from '../i18n/LanguageContext';

interface AnalysisResultViewProps {
  analysis: AnalysisResult;
  activeBaby: BabyProfile | null;
  videoUrl?: string;
  onSaveSession?: () => void;
  onNewAnalysis: () => void;
  onViewProgress?: () => void;
  onGoToDashboard?: () => void;
  onOpenDryDrowning?: () => void;
}

export const AnalysisResultView: React.FC<AnalysisResultViewProps> = ({
  analysis,
  activeBaby,
  videoUrl,
  onSaveSession,
  onNewAnalysis,
  onViewProgress,
  onGoToDashboard,
  onOpenDryDrowning,
}) => {
  const { t, locale } = useTranslation();
  const [selectedExercise, setSelectedExercise] = useState<any | null>(null);
  const [sessionSaved, setSessionSaved] = useState<boolean>(false);
  const [sessionNotes, setSessionNotes] = useState<string>('');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  const babyDisplayName = activeBaby?.hideNameInAnalysis
    ? 'Bébé'
    : (activeBaby?.name || 'Bébé');

  const handleSave = () => {
    progressService.saveSession({
      id: analysis.sessionId || 'session_' + Math.random().toString(36).substring(2, 9),
      userId: activeBaby?.userId || 'user_demo',
      babyId: activeBaby?.id || 'baby_demo',
      date: new Date().toISOString().slice(0, 10),
      title: analysis.situation,
      videoDurationSeconds: 20,
      videoSizeMB: 12.0,
      situationKey: analysis.situationKey,
      situationTitle: analysis.situation,
      analysis,
      notes: sessionNotes || `${analysis.situation}`,
    });
    setSessionSaved(true);
    if (onSaveSession) {
      onSaveSession();
    }
  };

  const statusLabels: Record<string, string> = {
    acquis: t('progress.statusAcquired'),
    en_progression: t('progress.statusInProgress'),
    en_decouverte: t('progress.statusDiscovery'),
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Top Banner: Prototype Demo Notice + Share Action */}
      <div className="bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-indigo-500/10 border border-sky-200 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-sm text-slate-900">
                {analysis.isDemo
                  ? t('analysisResult.demoBadge')
                  : t('analysisResult.aiBadge')}
              </span>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {t('analysisResult.confidence')} : {Math.round(analysis.confidence * 100)}%
              </span>
            </div>
            <p className="text-xs text-slate-600">
              {t('analysisResult.situationIdentified', { situation: analysis.situation, name: babyDisplayName })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setIsShareModalOpen(true)}
            className="px-3.5 py-2 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all hover:scale-102 cursor-pointer flex items-center gap-1.5"
            title="Partager le résultat sur les réseaux ou par message"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Partager le résultat</span>
          </button>

          <div className="text-xs text-slate-500 bg-white/80 px-3 py-1.5 rounded-xl border border-sky-100 font-medium hidden md:block">
            Moteur v1.0 • Baby Swim Vision
          </div>
        </div>
      </div>

      {/* 📹 Interactive Video Analysis Player with 3 Slow-Motion Speeds, Frame-by-Frame, and HD Enhanced Capture */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 text-slate-800 text-xs font-bold uppercase tracking-wider">
            <FileVideo className="w-4 h-4 text-sky-600" />
            <span>Revue vidéo détaillée & Ralenti pédagogique</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Contrôles image par image & capture HD disponibles
          </span>
        </div>

        <VideoAnalysisPlayer
          videoUrl={videoUrl}
          videoName={`Vidéo analysée • ${analysis.situation || 'Séance aquatique'}`}
          babyName={babyDisplayName}
          situationTitle={analysis.situation}
          situationKey={analysis.situationKey}
        />
      </div>

      {/* 🧭 Movement Classification & 6-Phase Pedagogical Chronology */}
      {analysis.movementAnalysis && (
        <MovementChronologyCard
          movementAnalysis={analysis.movementAnalysis}
          situationTitle={analysis.situation}
          babyName={babyDisplayName}
        />
      )}

      {/* Main Analysis Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Positive Points & Observations (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* 👍 Positive Points */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-emerald-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-700">
              <div className="p-1.5 bg-emerald-100 rounded-xl">
                <ThumbsUp className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-slate-900">{t('analysisResult.positivePoints')}</h3>
            </div>

            <div className="space-y-2">
              {analysis.positive_points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 👀 Observations */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-sky-700">
              <div className="p-1.5 bg-sky-100 rounded-xl">
                <Eye className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base text-slate-900">{t('analysisResult.observations')}</h3>
            </div>

            <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
              {analysis.observations.map((obs, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  {obs}
                </div>
              ))}
            </div>
          </div>

          {/* 🧭 Posture & Orientation Corporelle */}
          {(analysis.posture || analysis.biomechanics) && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-indigo-100 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-700">
                  <div className="p-1.5 bg-indigo-100 rounded-xl">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900">Posture & Orientation</h3>
                </div>
                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full text-[11px] font-bold border border-indigo-100 capitalize">
                  {analysis.posture?.orientation === 'horizontale' || analysis.biomechanics?.orientation === 'horizontale'
                    ? 'Position Horizontale'
                    : analysis.posture?.orientation === 'verticale' || analysis.biomechanics?.orientation === 'verticale'
                    ? 'Position Verticale'
                    : 'Position Semi-verticale'}
                </span>
              </div>

              <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/70 text-xs text-indigo-950 space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5">
                  <span>💡 Ajustement global :</span>
                </div>
                <p className="leading-relaxed text-slate-700">
                  {analysis.posture?.correction ||
                    analysis.biomechanics?.correction ||
                    (analysis.biomechanics?.targetOrientation === 'horizontale'
                      ? "Favoriser l'horizontalité du corps en s'accroupissant légèrement dans l'eau pour accompagner la glisse et la détente."
                      : "Maintenir une posture verticale rassurante et enveloppante contre le torse du parent.")}
                </p>
                {analysis.biomechanics?.parentHoldType && (
                  <p className="text-[11px] text-slate-500 pt-1 border-t border-indigo-100/60">
                    <span className="font-semibold text-slate-600">Soutien : </span>
                    {analysis.biomechanics.parentHoldType}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Skills observed evolution */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {t('analysisResult.skillsEngaged')}
            </h4>
            <div className="space-y-2">
              {analysis.skills_observed.map((sk, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block">{sk.skillName}</span>
                    <span className="text-[10px] text-slate-400">{sk.categoryName}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    sk.status === 'acquis'
                      ? 'bg-emerald-100 text-emerald-800'
                      : sk.status === 'en_progression'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {statusLabels[sk.status] || sk.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Priority Focus & Recommended Exercise (7 cols) */}
        <div className="md:col-span-7 space-y-6">
          {/* 🎯 Le point principal à travailler (1 unique priority) */}
          <div className="bg-gradient-to-br from-sky-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-lg space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-sky-500/30 text-sky-300 rounded-xl border border-sky-400/30">
                <Target className="w-4 h-4" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                {t('analysisResult.mainPriorityTitle')}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {analysis.priority}
            </h3>

            <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-4 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2">
              <p>💡 {analysis.main_recommendation}</p>
              {analysis.secondary_recommendations && analysis.secondary_recommendations.length > 0 && (
                <div className="pt-2 border-t border-white/10 text-xs text-sky-200">
                  <strong>Piste complémentaire :</strong> {analysis.secondary_recommendations[0]}
                </div>
              )}
            </div>
          </div>

          {/* 🏊 Exercice conseillé */}
          {analysis.recommended_exercise && (
            <div className="bg-white rounded-3xl p-6 border border-emerald-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                    <Waves className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                      {t('analysisResult.recommendedExerciseTitle')}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">
                      {analysis.recommended_exercise.title}
                    </h4>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  {analysis.recommended_exercise.duration}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {analysis.recommended_exercise.objective}
              </p>

              <button
                onClick={() => setSelectedExercise(analysis.recommended_exercise)}
                className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer border border-emerald-200"
              >
                <BookOpen className="w-4 h-4" />
                <span>{t('analysisResult.viewInstructions')}</span>
              </button>
            </div>
          )}

          {/* ⚠️ Sécurité Aquatique */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-900 space-y-1.5">
            <h5 className="font-bold flex items-center gap-1.5 text-amber-950 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              {t('analysisResult.safetyReminderTitle')}
            </h5>
            <p className="leading-relaxed">
              {analysis.safety_notes[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Save Session / Navigation Action Footer */}
      <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            {t('analysisResult.personalNoteLabel')}
          </label>
          <input
            type="text"
            placeholder={t('analysisResult.personalNotePlaceholder')}
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-sky-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <button
            onClick={handleSave}
            disabled={sessionSaved}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              sessionSaved
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : 'bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 text-white shadow-md shadow-sky-600/20'
            }`}
          >
            <BookmarkCheck className="w-4 h-4" />
            <span>{sessionSaved ? t('analysisResult.saveSuccess') : t('analysisResult.saveSessionBtn')}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex-1 sm:flex-none px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-2xl transition-colors border border-indigo-200 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Share2 className="w-4 h-4 text-indigo-600" />
              <span>Partager</span>
            </button>
            <button
              onClick={onViewProgress}
              className="flex-1 sm:flex-none px-4 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-2xl transition-colors border border-slate-200 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>{t('analysisResult.viewProgressBtn')}</span>
            </button>
            <button
              onClick={onNewAnalysis}
              className="flex-1 sm:flex-none px-4 py-3 bg-sky-50 hover:bg-sky-100 text-sky-700 font-semibold text-xs rounded-2xl transition-colors border border-sky-200 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t('analysisResult.newAnalysisBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Analysis Modal */}
      <ShareAnalysisModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        analysis={analysis}
        activeBaby={activeBaby}
      />

      {/* Exercise Detail Popup */}
      <ExerciseDetailModal
        exercise={selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </div>
  );
};

