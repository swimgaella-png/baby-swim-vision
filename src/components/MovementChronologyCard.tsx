import React, { useState } from 'react';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  HandMetal,
  Layers,
  Sparkles,
  UserCheck,
  Waves,
  AlertTriangle,
  HelpCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MovementClassification, ChronologyStep } from '../types';

interface MovementChronologyCardProps {
  movementAnalysis?: MovementClassification;
  situationTitle?: string;
  babyName?: string;
}

export const MovementChronologyCard: React.FC<MovementChronologyCardProps> = ({
  movementAnalysis,
  situationTitle = 'Séance aquatique',
  babyName = 'Bébé',
}) => {
  const [showFullDetails, setShowFullDetails] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  if (!movementAnalysis) return null;

  const {
    primaryCategory,
    classificationLabel,
    sequenceSummary,
    glideOriginLabel,
    autonomyLevel,
    glideDurationSeconds,
    isRealGlide,
    wasHorizontalizedBeforeRelease,
    chronology,
    bodyAnalysis,
    pedagogicalDiagnostic,
    pedagogicalAlert,
    uncertaintyReason,
  } = movementAnalysis;

  // Category Theme Colors & Badges
  const getCategoryBadgeStyles = () => {
    switch (primaryCategory) {
      case 'portage_vertical':
        return {
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          badgeBg: 'bg-sky-600 text-white',
          accent: 'text-sky-700',
          border: 'border-sky-200',
          gradient: 'from-sky-500/10 via-blue-500/5 to-transparent',
        };
      case 'bebe_dans_les_bras':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          badgeBg: 'bg-blue-600 text-white',
          accent: 'text-blue-700',
          border: 'border-blue-200',
          gradient: 'from-blue-500/10 via-indigo-500/5 to-transparent',
        };
      case 'glisse_horizontale':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          badgeBg: 'bg-emerald-600 text-white',
          accent: 'text-emerald-700',
          border: 'border-emerald-200',
          gradient: 'from-emerald-500/10 via-teal-500/5 to-transparent',
        };
      case 'lacher_apres_horizontal':
        return {
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          badgeBg: 'bg-teal-600 text-white',
          accent: 'text-teal-700',
          border: 'border-teal-200',
          gradient: 'from-teal-500/10 via-emerald-500/5 to-transparent',
        };
      case 'lacher_depuis_vertical':
        return {
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          badgeBg: 'bg-amber-600 text-white',
          accent: 'text-amber-700',
          border: 'border-amber-300',
          gradient: 'from-amber-500/10 via-orange-500/5 to-transparent',
        };
      case 'situation_indeterminee':
        return {
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          badgeBg: 'bg-slate-700 text-white',
          accent: 'text-slate-700',
          border: 'border-slate-300',
          gradient: 'from-slate-500/10 to-transparent',
        };
      default:
        return {
          bg: 'bg-sky-50 text-sky-800 border-sky-200',
          badgeBg: 'bg-sky-600 text-white',
          accent: 'text-sky-700',
          border: 'border-sky-200',
          gradient: 'from-sky-500/10 to-transparent',
        };
    }
  };

  const styles = getCategoryBadgeStyles();

  // Autonomy badge style
  const getAutonomyBadgeStyle = () => {
    switch (autonomyLevel) {
      case 'Autonome':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Partiellement accompagné':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case '100% accompagné':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className={`bg-white rounded-3xl border ${styles.border} shadow-sm overflow-hidden space-y-0 transition-all`}>
      {/* Header Banner */}
      <div className={`p-5 sm:p-6 bg-gradient-to-r ${styles.gradient} border-b ${styles.border} space-y-3`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold shrink-0 shadow-xs">
              <Activity className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
                Analyse IA du Mouvement & Chronologie
              </span>
              <h3 className="font-extrabold text-lg sm:text-xl text-slate-900">
                {classificationLabel}
              </h3>
            </div>
          </div>

          {/* Autonomy & Glide Duration Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getAutonomyBadgeStyle()} flex items-center gap-1.5`}>
              <UserCheck className="w-3.5 h-3.5" />
              <span>Autonomie : {autonomyLevel}</span>
            </span>

            {isRealGlide && typeof glideDurationSeconds === 'number' && (
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white shadow-xs flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Glisse : {glideDurationSeconds.toFixed(1)} s</span>
              </span>
            )}
          </div>
        </div>

        {/* Sequence Overview Bar */}
        <div className="p-3 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-slate-800 shrink-0">Séquence :</span>
            <span className="text-slate-600 font-medium truncate sm:whitespace-normal">
              {sequenceSummary}
            </span>
          </div>

          {glideOriginLabel && (
            <div className="shrink-0 font-semibold text-[11px] text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              Origine : {glideOriginLabel}
            </div>
          )}
        </div>
      </div>

      {/* Pedagogical Alert (if release from vertical without horizontalizing) */}
      {pedagogicalAlert && (
        <div className="p-4 sm:p-5 bg-amber-500/10 border-b border-amber-200 text-amber-950 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-amber-900">Mise en garde pédagogique : Lâcher vertical détecté</h4>
            <p className="leading-relaxed text-amber-800">
              {pedagogicalAlert}
            </p>
          </div>
        </div>
      )}

      {/* Uncertainty Notice (if doubtful) */}
      {primaryCategory === 'situation_indeterminee' && uncertaintyReason && (
        <div className="p-4 sm:p-5 bg-slate-100 border-b border-slate-200 text-slate-800 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-slate-900">Évaluation sous réserve</h4>
            <p className="leading-relaxed text-slate-600">
              {uncertaintyReason}
            </p>
          </div>
        </div>
      )}

      {/* 6-Phase Temporal Chronology Step Flow */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800">
            <Layers className="w-4 h-4 text-sky-600" />
            <h4 className="font-bold text-sm text-slate-900 uppercase tracking-wider text-[12px]">
              Chronologie Séquentielle (Analyse Temporelle)
            </h4>
          </div>
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            6 étapes du mouvement
          </span>
        </div>

        {/* Timeline Grid / Step Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {chronology.map((step, idx) => {
            const isRelease = step.phase === 'lacher';
            const isDisplacement = step.phase === 'deplacement';

            return (
              <div
                key={step.stepIndex || idx}
                className={`p-3.5 rounded-2xl border transition-all text-xs space-y-2 ${
                  isRelease
                    ? wasHorizontalizedBeforeRelease
                      ? 'bg-teal-50/70 border-teal-200'
                      : 'bg-amber-50/70 border-amber-200'
                    : isDisplacement && isRealGlide
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="flex items-center justify-between gap-1.5">
                  <span className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center shrink-0">
                      {step.stepIndex}
                    </span>
                    <span>{step.title.split('. ')[1] || step.title}</span>
                  </span>

                  {step.timecode && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600">
                      {step.timecode}
                    </span>
                  )}
                </div>

                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {step.description}
                </p>

                {/* Sub-tags: Orientation & Contact */}
                <div className="pt-1.5 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5 text-[10px]">
                  {step.babyOrientation && (
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 capitalize font-medium">
                      Corps : {step.babyOrientation}
                    </span>
                  )}
                  {step.parentContact && (
                    <span className={`px-2 py-0.5 rounded-md border font-medium ${
                      step.parentContact === 'aucun'
                        ? 'bg-emerald-100/70 text-emerald-800 border-emerald-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      Contact : {step.parentContact.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Body Posture & Biomechanical Synthesis Accordion */}
      <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-100 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-indigo-600" />
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
              Biomécanique Corporelle & Points de Contact
            </h4>
          </div>

          <button
            onClick={() => setShowFullDetails(!showFullDetails)}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{showFullDetails ? 'Masquer les détails' : 'Voir les détails anatomiques'}</span>
            {showFullDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Synthesis Highlight */}
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-2xs space-y-2 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Synthèse de l'évaluation :</span>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {pedagogicalDiagnostic}
          </p>
        </div>

        {/* Detailed Breakdown (Accordion) */}
        {showFullDetails && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in duration-150 text-xs">
            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-sky-600" />
                <span>Tête, Regard & Visage</span>
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {bodyAnalysis.headAndFace}
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-teal-600" />
                <span>Tronc & Inclinaison du corps</span>
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {bodyAnalysis.trunkPosition} {bodyAnalysis.inclinationDetails ? `(${bodyAnalysis.inclinationDetails})` : ''}
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-600" />
                <span>Membres (Bras & Jambes)</span>
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {bodyAnalysis.limbsAction}
              </p>
            </div>

            <div className="p-3.5 bg-white rounded-2xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5">
                <HandMetal className="w-3.5 h-3.5 text-emerald-600" />
                <span>Contact des mains du parent & Distance</span>
              </span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {bodyAnalysis.parentContactDetails} — Distance : {bodyAnalysis.babyParentDistance}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
