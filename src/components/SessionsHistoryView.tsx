import React, { useState } from 'react';
import {
  Calendar,
  Video,
  ChevronRight,
  Trash2,
  Clock,
  Plus,
  Share2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { SessionRecord, BabyProfile, User } from '../types';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { ShareAnalysisModal } from './ShareAnalysisModal';
import { accessControlService } from '../services/accessControlService';
import { useTranslation } from '../i18n/LanguageContext';

interface SessionsHistoryViewProps {
  sessions: SessionRecord[];
  activeBaby: BabyProfile | null;
  currentUser?: User | null;
  onSelectSession?: (session: SessionRecord) => void;
  onDeleteSession?: (sessionId: string) => void;
  onStartNewAnalysis?: () => void;
  onNewSession?: () => void;
  onNavigate?: (view: string) => void;
  onOpenCheckout?: () => void;
}

export const SessionsHistoryView: React.FC<SessionsHistoryViewProps> = ({
  sessions,
  activeBaby,
  currentUser = null,
  onSelectSession = (_session: SessionRecord) => {},
  onDeleteSession = (_sessionId: string) => {},
  onStartNewAnalysis = () => {},
  onNewSession = () => {},
  onNavigate = () => {},
  onOpenCheckout = () => {},
}) => {
  const { t, formatDate } = useTranslation();
  const [selectedExo, setSelectedExo] = useState<any | null>(null);
  const [sessionToShare, setSessionToShare] = useState<SessionRecord | null>(null);

  const effectiveRole = accessControlService.getEffectiveRole(currentUser);
  const isFree = effectiveRole === 'USER_FREE';

  const handleStartAnalysis = () => {
    if (isFree) {
      onOpenCheckout();
      return;
    }
    if (onNewSession) onNewSession();
    else onStartNewAnalysis();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>{t('sessions.historyBadge')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            {t('sessions.pageTitle', { name: activeBaby?.name || 'mon bébé' })}
          </h1>
          <p className="text-xs text-slate-500">
            {t('sessions.pageSubtitle')}
          </p>
        </div>

        <button
          onClick={handleStartAnalysis}
          className="px-5 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
        >
          {isFree ? <Lock className="w-4 h-4 text-amber-300" /> : <Plus className="w-4 h-4" />}
          <span>{isFree ? "Débloquer les séances (24,90 €)" : t('sessions.addSessionBtn')}</span>
        </button>
      </div>

      {/* Free User Paywall Lock Banner */}
      {isFree && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 sm:p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-up">
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                Historique et suivi des séances réservés aux membres Premium
              </h3>
              <p className="text-xs sm:text-sm text-amber-100 mt-0.5">
                Accédez à l'archivage complet des vidéos analysées, aux courbes d'évolution et aux bilans de séances pour 24,90 € à vie.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenCheckout}
            className="px-5 py-3 bg-white hover:bg-amber-50 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg transition-all hover:scale-102 cursor-pointer shrink-0"
          >
            Débloquer l'accès à vie (24,90 €)
          </button>
        </div>
      )}

      {/* List of Sessions */}
      {sessions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-4 border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
            <Video className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">
            {t('sessions.emptyTitle')}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t('sessions.emptySubtitle')}
          </p>
          <button
            onClick={onStartNewAnalysis}
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {t('sessions.startAnalysisBtn')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-100 shadow-xs hover:shadow-md hover:border-sky-200 transition-all space-y-4"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold">
                    {formatDate(session.date)}
                  </span>
                  <h3 className="font-bold text-base text-slate-900">
                    {session.situationTitle}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {session.videoDurationSeconds}s
                  </span>
                  <button
                    onClick={() => setSessionToShare(session)}
                    className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer flex items-center gap-1 text-xs font-medium"
                    title="Partager cette séance"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline text-[11px]">Partager</span>
                  </button>
                  <button
                    onClick={() => onDeleteSession(session.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title={t('sessions.deleteSessionTitle')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1.5">
                  <span className="font-bold uppercase text-[10px] tracking-wider text-sky-700 block">
                    🎯 {t('sessions.mainPointWorked')}
                  </span>
                  <p className="text-slate-800 font-medium leading-relaxed">
                    {session.analysis.priority}
                  </p>
                </div>

                <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-100 space-y-1.5">
                  <span className="font-bold uppercase text-[10px] tracking-wider text-emerald-800 block">
                    🏊 {t('sessions.recommendedExo')}
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-800 font-medium">
                      {session.analysis.recommended_exercise?.title}
                    </span>
                    <button
                      onClick={() => setSelectedExo(session.analysis.recommended_exercise)}
                      className="text-[11px] font-bold text-emerald-700 hover:underline cursor-pointer"
                    >
                      {t('sessions.details')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Notes if any */}
              {session.notes && (
                <p className="text-xs text-slate-500 italic bg-sky-50/40 p-2.5 rounded-xl">
                  « {session.notes} »
                </p>
              )}

              {/* Action Buttons: Consult and Share */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => onSelectSession(session)}
                  className="flex-1 py-3 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-bold text-xs rounded-2xl border border-slate-200 hover:border-sky-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t('sessions.reviewAnalysisBtn')}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSessionToShare(session)}
                  className="px-4 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-2xl border border-indigo-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Partager le bilan"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Partager</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      {sessionToShare && (
        <ShareAnalysisModal
          isOpen={!!sessionToShare}
          onClose={() => setSessionToShare(null)}
          analysis={sessionToShare.analysis}
          activeBaby={activeBaby}
          sessionDate={sessionToShare.date}
        />
      )}

      <ExerciseDetailModal
        exercise={selectedExo}
        onClose={() => setSelectedExo(null)}
      />
    </div>
  );
};
