import React, { useState } from 'react';
import {
  TrendingUp,
  CheckCircle2,
  Layers,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import { BabyProfile, SessionRecord, BabyProgressSummary, SkillStatus } from '../types';
import { getLocalizedSkillCategories } from '../data/pedagogicalDatabase';
import { SafetyBanner } from './SafetyBanner';
import { useTranslation } from '../i18n/LanguageContext';

interface ProgressViewProps {
  activeBaby: BabyProfile | null;
  progressSummary?: BabyProgressSummary | null;
  sessions: SessionRecord[];
  onStartNewAnalysis?: () => void;
  onNewAnalysis?: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({
  activeBaby,
  progressSummary,
  sessions,
  onStartNewAnalysis,
  onNewAnalysis,
}) => {
  const { t, locale } = useTranslation();
  const skillCategories = getLocalizedSkillCategories(locale);
  const [expandedCat, setExpandedCat] = useState<string | null>(skillCategories[0]?.id || 'equilibre');

  const statusBadge = (status: SkillStatus) => {
    switch (status) {
      case 'acquis':
        return (
          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t('progress.statusAcquired')}
          </span>
        );
      case 'en_progression':
        return (
          <span className="px-2.5 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold">
            {t('progress.statusInProgress')}
          </span>
        );
      case 'en_decouverte':
        return (
          <span className="px-2.5 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold">
            {t('progress.statusDiscovery')}
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium">
            {t('progress.statusNotObserved')}
          </span>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{t('progress.titleBadge')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {t('progress.pageTitle', { name: activeBaby?.name || 'Bébé' })}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          {t('progress.pageSubtitle')}
        </p>
      </div>

      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center space-y-1 shadow-2xs">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{sessions.length}</span>
          <span className="text-xs text-slate-500 block">{t('progress.statRecordedSessions')}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center space-y-1 shadow-2xs">
          <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600">8</span>
          <span className="text-xs text-slate-500 block">{t('progress.statDomains')}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center space-y-1 shadow-2xs">
          <span className="text-2xl sm:text-3xl font-extrabold text-sky-600">{activeBaby?.ageMonths || 8}</span>
          <span className="text-xs text-slate-500 block">{t('progress.statBabyMonths')}</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 text-center space-y-1 shadow-2xs">
          <span className="text-2xl sm:text-3xl font-extrabold text-indigo-600">100%</span>
          <span className="text-xs text-slate-500 block">{t('progress.statGentleness')}</span>
        </div>
      </div>

      {/* Important Pedagogical Principle Box */}
      <div className="bg-sky-50 border border-sky-200/80 rounded-2xl p-4 sm:p-5 text-sky-950 text-xs leading-relaxed space-y-1.5">
        <h4 className="font-bold flex items-center gap-1.5 text-sky-900 uppercase tracking-wider text-xs">
          <Info className="w-4 h-4 text-sky-600 shrink-0" />
          {t('progress.ruleTitle')}
        </h4>
        <p>
          {t('progress.ruleText')}
        </p>
      </div>

      {/* Categories Accordion */}
      <div className="space-y-3">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-600" />
          {t('progress.domainsTitle')}
        </h2>

        {(skillCategories || []).map((category) => {
          const isExpanded = expandedCat === category.id;

          return (
            <div
              key={category.id}
              className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden transition-all"
            >
              {/* Category Header */}
              <button
                onClick={() => setExpandedCat(isExpanded ? null : category.id)}
                className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors cursor-pointer"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm sm:text-base text-slate-900">
                      {category.title}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 max-w-xl">
                    {category.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </button>

              {/* Sub-skills details */}
              {isExpanded && (
                <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-slate-100 space-y-3 bg-slate-50/40">
                  {(category.skills || []).map((skill) => {
                    const safeSessions = sessions || [];
                    const hasObservation = safeSessions.some(s =>
                      s.analysis?.skills_observed?.some(o => o.skillName?.toLowerCase().includes(skill.name.toLowerCase().slice(0, 8)))
                    );
                    const status: SkillStatus = hasObservation ? (safeSessions.length >= 2 ? 'acquis' : 'en_progression') : 'en_decouverte';

                    return (
                      <div
                        key={skill.id}
                        className="bg-white p-4 rounded-2xl border border-slate-200/80 space-y-2"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <h4 className="font-bold text-xs sm:text-sm text-slate-800">
                            {skill.name}
                          </h4>
                          <div>{statusBadge(status)}</div>
                        </div>

                        <p className="text-xs text-slate-600">
                          {skill.description}
                        </p>

                        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {t('progress.criteriaObserved')} :
                          </span>
                          {(skill.observationChecklist || []).map((c, i) => (
                            <span
                              key={i}
                              className="text-[11px] bg-slate-50 text-slate-600 px-2.5 py-0.5 rounded-md border border-slate-200"
                            >
                              ✓ {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SafetyBanner />
    </div>
  );
};
