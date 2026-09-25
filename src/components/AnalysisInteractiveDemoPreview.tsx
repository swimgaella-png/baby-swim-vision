import React from 'react';
import {
  Compass,
  Activity,
  Heart,
  Hand
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

export const AnalysisInteractiveDemoPreview: React.FC = () => {
  const { t } = useTranslation();

  const corePillars = [
    {
      id: 'posture',
      icon: Compass,
      color: 'text-sky-600 bg-sky-50 border-sky-200/60',
      title: t('demoAnalysis.pillar1Title', { defaultValue: 'Posture & Flottaison' }),
      description: t('demoAnalysis.pillar1Desc', {
        defaultValue: 'Alignement horizontal, équilibre et sensation de portance dans l’eau.',
      }),
    },
    {
      id: 'motricite',
      icon: Activity,
      color: 'text-teal-600 bg-teal-50 border-teal-200/60',
      title: t('demoAnalysis.pillar2Title', { defaultValue: 'Motricité & Propulsion' }),
      description: t('demoAnalysis.pillar2Desc', {
        defaultValue: 'Spontanéité des battements de jambes, motricité libre des bras et exploration active.',
      }),
    },
    {
      id: 'bienetre',
      icon: Heart,
      color: 'text-rose-600 bg-rose-50 border-rose-200/60',
      title: t('demoAnalysis.pillar3Title', { defaultValue: 'Bien-être & Tonus' }),
      description: t('demoAnalysis.pillar3Desc', {
        defaultValue: 'Relâchement musculaire, absence de crispation, confiance et connexion visuelle.',
      }),
    },
    {
      id: 'prises',
      icon: Hand,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200/60',
      title: t('demoAnalysis.pillar4Title', { defaultValue: 'Prises du Parent' }),
      description: t('demoAnalysis.pillar4Desc', {
        defaultValue: 'Douceur des mains enveloppantes, posture immergée et sécurité affective.',
      }),
    },
  ];

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-sky-100 p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[11px] font-bold uppercase tracking-wider">
              {t('demoAnalysis.badge', { defaultValue: 'Ce que Baby Swim Vision analyse' })}
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {t('demoAnalysis.markersCount', { defaultValue: '4 repères clés' })}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-1">
            {t('demoAnalysis.title', { defaultValue: 'Une observation bienveillante de chaque instant' })}
          </h3>
        </div>
        <p className="text-xs text-slate-500 max-w-md sm:text-right leading-relaxed">
          {t('demoAnalysis.subtitle', {
            defaultValue: 'Des repères pédagogiques concrets pour vous guider en douceur, sans jugement ni notation :',
          })}
        </p>
      </div>

      {/* 4 Concise Core Observation Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {corePillars.map((pillar) => {
          const PillarIcon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-sky-200 transition-colors flex flex-col gap-2"
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${pillar.color}`}>
                  <PillarIcon className="w-4 h-4" />
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                  {pillar.title}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
