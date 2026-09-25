import React from 'react';
import {
  Video,
  Calendar,
  ChevronRight,
  Target,
  Clock,
  Users,
  ExternalLink,
  Plus,
  Baby,
  Sparkles,
  Lock,
  Globe,
} from 'lucide-react';
import { BabyProfile, SessionRecord, BabyProgressSummary } from '../types';
import { getLocalizedSkillCategories, getLocalizedExercise } from '../data/pedagogicalDatabase';
import { progressService } from '../services/progressService';
import { accessControlService } from '../services/accessControlService';
import { SafetyBanner } from './SafetyBanner';
import { BabyAvatar } from './BabyAvatar';
import { useTranslation } from '../i18n/LanguageContext';

interface DashboardProps {
  activeBaby: BabyProfile | null;
  babies?: BabyProfile[];
  progressSummary?: BabyProgressSummary | null;
  recentSessions?: SessionRecord[];
  sessions?: SessionRecord[];
  currentUser?: any;
  onStartNewAnalysis?: () => void;
  onViewSession?: (session: SessionRecord) => void;
  onNavigate: (view: string) => void;
  onEditBaby?: () => void;
  onOpenBabyModal?: () => void;
  onLaunchDemo?: (scenarioId: string) => void;
  onOpenDryDrowningFactsheet?: () => void;
  onOpenDryDrowning?: () => void;
  onOpenCheckout?: () => void;
  hasLifetimeAccess?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  activeBaby,
  babies,
  progressSummary,
  recentSessions,
  sessions,
  currentUser,
  onStartNewAnalysis,
  onViewSession,
  onNavigate,
  onEditBaby,
  onOpenBabyModal,
  onLaunchDemo,
  onOpenDryDrowningFactsheet,
  onOpenDryDrowning,
  onOpenCheckout,
  hasLifetimeAccess = false,
}) => {
  const { t, locale, formatDate } = useTranslation();
  const skillCategories = getLocalizedSkillCategories(locale);
  const nextExercise = getLocalizedExercise('exo_tapis_volant', locale);

  const effectiveRole = accessControlService.getEffectiveRole(currentUser);
  const isFree = effectiveRole === 'USER_FREE';

  const effectiveSessions = recentSessions || sessions || [];
  
  // Safe progress summary computation
  const effectiveProgressSummary: BabyProgressSummary = progressSummary || 
    (activeBaby ? progressService.getProgressSummary(activeBaby.id) : {
      babyId: 'demo',
      totalSessions: effectiveSessions.length,
      skillsStatus: {},
      categoryProgress: {},
    });

  const handleStartAnalysis = () => {
    if (isFree && onOpenCheckout) {
      onOpenCheckout();
      return;
    }
    if (onStartNewAnalysis) {
      onStartNewAnalysis();
    } else {
      onNavigate('record');
    }
  };

  const handleOpenDryDrowning = () => {
    if (isFree && onOpenCheckout) {
      onOpenCheckout();
      return;
    }
    const handler = onOpenDryDrowningFactsheet || onOpenDryDrowning;
    if (handler) handler();
  };

  const handleNavigateGated = (view: string) => {
    if (isFree && (view === 'record' || view === 'sessions' || view === 'library' || view === 'progress') && onOpenCheckout) {
      onOpenCheckout();
      return;
    }
    onNavigate(view);
  };

  const statusColors = {
    acquis: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    en_progression: 'bg-sky-50 text-sky-800 border-sky-200',
    en_decouverte: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    non_observe: 'bg-slate-50 text-slate-500 border-slate-200',
  };

  const statusLabels = {
    acquis: t('progress.statusAcquired'),
    en_progression: t('progress.statusInProgress'),
    en_decouverte: t('progress.statusDiscovery'),
    non_observe: t('progress.statusNotObserved'),
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Lifetime Access Promotion Banner for Discovery Mode */}
      {!hasLifetimeAccess && onOpenCheckout && (
        <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 rounded-3xl p-5 sm:p-6 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-sky-400/30">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase tracking-wider border border-emerald-400/30">
              Offre Unique • 24,90 € à vie
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white">
              Débloquez l'accès permanent et illimité à Baby Swim Vision
            </h3>
            <p className="text-xs text-sky-200">
              Un seul paiement • Aucun abonnement • Analyses vidéo illimitées & bibliothèque complète
            </p>
          </div>

          <button
            onClick={onOpenCheckout}
            className="px-5 py-3 bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-102 cursor-pointer shrink-0 uppercase tracking-wider"
          >
            Obtenir l'Accès à Vie — 24,90 €
          </button>
        </div>
      )}

      {/* Baby Hero Summary Card or Empty State */}
      {activeBaby ? (
        <section className="bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-sky-500/5 rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <BabyAvatar baby={activeBaby} size="xl" shape="rounded" />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    {activeBaby.name || 'Baby'}
                  </h1>
                  <button
                    onClick={() => onNavigate('baby-profile')}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-800 bg-white px-2.5 py-1 rounded-lg border border-sky-200 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Baby className="w-3.5 h-3.5" />
                    <span>Gérer le profil</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {t('dashboard.age')} : <strong className="text-slate-900">{activeBaby.ageMonths || 8} {t('common.months')}</strong> ({activeBaby.ageWeeks || 35} {t('dashboard.weeks')}) • {t('dashboard.level')} : <span className="capitalize font-semibold text-sky-700">{activeBaby.level || 'Découverte'}</span>
                </p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 pt-0.5">
                  {activeBaby.weightKg && (
                    <span className="bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/60 font-semibold text-slate-700">
                      ⚖️ {activeBaby.weightKg} kg
                    </span>
                  )}
                  {activeBaby.heightCm && (
                    <span className="bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/60 font-semibold text-slate-700">
                      📏 {activeBaby.heightCm} cm
                    </span>
                  )}
                  {activeBaby.waterComfortLevel && (
                    <span className="bg-white/80 px-2 py-0.5 rounded-md border border-slate-200/60 font-semibold text-sky-700">
                      🌊 {activeBaby.waterComfortLevel === 'tres_a_l_aise' ? 'Très à l\'aise' : activeBaby.waterComfortLevel === 'curieux_calme' ? 'Curieux calme' : activeBaby.waterComfortLevel === 'prudent_hesitant' ? 'Prudent' : 'Appréhensif'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick CTA to record / analyze */}
            <button
              onClick={handleStartAnalysis}
              className="px-6 py-4 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm sm:text-base rounded-2xl shadow-lg shadow-sky-600/25 flex items-center justify-center gap-2.5 transition-all hover:scale-102 cursor-pointer shrink-0"
            >
              <Video className="w-5 h-5" />
              <span>{t('dashboard.ctaNewVideo')}</span>
            </button>
          </div>

          {/* Baby goals pill badges */}
          {activeBaby.goals && activeBaby.goals.length > 0 && (
            <div className="mt-5 pt-4 border-t border-sky-100/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t('dashboard.currentGoals')} :
              </span>
              {activeBaby.goals.map((goal, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-white text-slate-700 rounded-full text-xs font-medium border border-sky-100 shadow-2xs"
                >
                  ✨ {goal}
                </span>
              ))}
            </div>
          )}
        </section>
      ) : (
        <section className="bg-gradient-to-r from-sky-500/10 via-teal-500/10 to-sky-500/5 rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-xs text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-white text-3xl flex items-center justify-center mx-auto shadow-md border border-sky-100">
            👶
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900">{t('babyProfile.noBabiesTitle')}</h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">{t('babyProfile.noBabiesDesc')}</p>
          </div>
          <button
            onClick={() => onNavigate('baby-profile')}
            className="px-6 py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t('babyProfile.addTitle')}</span>
          </button>
        </section>
      )}

      {/* Safety Notice */}
      <SafetyBanner compact />

      {/* Skills Matrix Summary Grid (8 Categories) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {t('dashboard.skillsTitle')}
            </h2>
            <p className="text-xs text-slate-500">
              {t('dashboard.skillsSubtitle')}
            </p>
          </div>
          <button
            onClick={() => handleNavigateGated('library')}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
          >
            {t('dashboard.viewFullMatrix')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {(skillCategories || []).map((cat) => {
            const progress = effectiveProgressSummary?.categoryProgress?.[cat.id] || {
              total: 2,
              acquis: 0,
              en_progression: 0,
              en_decouverte: 0,
              non_observe: 2,
            };

            const status = progress.acquis > 0
              ? 'acquis'
              : progress.en_progression > 0
              ? 'en_progression'
              : progress.en_decouverte > 0
              ? 'en_decouverte'
              : 'non_observe';

            return (
              <div
                key={cat.id}
                onClick={() => handleNavigateGated('library')}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 block line-clamp-1">
                    {cat.title}
                  </span>
                  <div className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusColors[status]}`}>
                    {statusLabels[status]}
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      status === 'acquis' ? 'bg-emerald-500 w-full' : status === 'en_progression' ? 'bg-sky-500 w-2/3' : status === 'en_decouverte' ? 'bg-indigo-400 w-1/3' : 'bg-slate-200 w-0'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Two Column Section: Recent Sessions & Recommended Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Sessions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              {t('dashboard.recentSessions')}
            </h3>
            <button
              onClick={() => handleNavigateGated('sessions')}
              className="text-xs font-semibold text-sky-600 hover:text-sky-800 cursor-pointer"
            >
              {t('dashboard.viewAllSessions', { count: effectiveSessions.length })}
            </button>
          </div>

          {effectiveSessions.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center space-y-3">
              <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mx-auto">
                <Video className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700">
                {t('dashboard.noSessionsYet')}
              </p>
              <button
                onClick={handleStartAnalysis}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl transition-colors cursor-pointer"
              >
                {t('dashboard.startFirstAnalysis')}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {effectiveSessions.slice(0, 3).map((session) => (
                <div
                  key={session.id}
                  onClick={() => {
                    if (isFree && onOpenCheckout) {
                      onOpenCheckout();
                      return;
                    }
                    if (onViewSession) onViewSession(session);
                    else handleNavigateGated('sessions');
                  }}
                  className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-100 shadow-xs hover:border-sky-200 hover:shadow-sm transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                        {formatDate(session.date)}
                      </span>
                      <span className="text-xs font-semibold text-slate-800 truncate">
                        {session.situationTitle}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      🎯 {session.analysis.priority}
                    </p>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-50 group-hover:bg-sky-50 text-slate-400 group-hover:text-sky-600 transition-colors shrink-0">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Suggested Next Exercise (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-600" />
            {t('dashboard.suggestedExercise')}
          </h3>

          <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[11px] font-bold border border-emerald-400/30">
                {nextExercise.level.toUpperCase()}
              </span>
              <span className="text-xs text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {nextExercise.duration}
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="text-base sm:text-lg font-bold text-white">
                {nextExercise.title}
              </h4>
              <p className="text-xs text-slate-300 line-clamp-2">
                {nextExercise.objective}
              </p>
            </div>

            <button
              onClick={() => handleNavigateGated('library')}
              className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <span>{t('dashboard.exploreInLibrary')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Trouvez mon club Card */}
          <div className="bg-gradient-to-br from-teal-50 via-sky-50 to-indigo-50 border border-sky-200/80 rounded-3xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 text-white shadow-xs">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  {t('findClub.badge') !== 'findClub.badge'
                    ? t('findClub.badge')
                    : (t('clubs.title') !== 'clubs.title' ? t('clubs.title') : 'Trouvez mon club')}
                </h4>
                <p className="text-[11px] text-teal-700 font-semibold">
                  {t('findClub.title') !== 'findClub.title'
                    ? t('findClub.title')
                    : (t('clubs.badge') !== 'clubs.badge' ? t('clubs.badge') : 'Piscines & Clubs certifiés')}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('findClub.subtitle') !== 'findClub.subtitle'
                ? t('findClub.subtitle')
                : (t('clubs.subtitle') !== 'clubs.subtitle' ? t('clubs.subtitle') : 'Découvrez les structures et cours bébés nageurs (eau chauffée à 32°C) vérifiés près de chez vous.')}
            </p>
            <button
              onClick={() => onNavigate('find-club')}
              className="w-full py-2.5 px-3 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>
                {t('findClub.searchButton') !== 'findClub.searchButton'
                  ? t('findClub.searchButton')
                  : (t('clubs.geolocateMe') !== 'clubs.geolocateMe' ? t('clubs.geolocateMe') : 'Rechercher un club')}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-teal-200" />
            </button>
          </div>

          {/* Safety / Dry Drowning Factsheet Card */}
          <div className="bg-gradient-to-br from-sky-50 to-indigo-50/60 border border-sky-200/80 rounded-3xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-600 text-white shadow-xs">
                <span className="text-sm">💧</span>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  {t('dryDrowning.dashboardBannerTitle')}
                </h4>
                <p className="text-[11px] text-sky-700 font-medium">
                  {t('dryDrowning.title')}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('dryDrowning.dashboardBannerDesc')}
            </p>
            <button
              onClick={handleOpenDryDrowning}
              className="w-full py-2.5 px-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <span>{t('dryDrowning.dashboardBannerBtn')}</span>
              <ChevronRight className="w-3.5 h-3.5 text-sky-200" />
            </button>
          </div>

          {/* Facebook Community Card */}
          <div className="bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100 rounded-3xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-800">
                  {t('community.cardTitle')}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {t('community.badge')}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t('community.cardDesc')}
            </p>
            <a
              href="https://www.facebook.com/groups/232584653458212"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>{t('community.joinBtn')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
