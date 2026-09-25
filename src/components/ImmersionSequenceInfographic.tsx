import React, { useState } from 'react';
import { 
  ArrowDown, 
  ArrowUp, 
  Heart, 
  Smile, 
  UserCheck, 
  Waves, 
  ShieldCheck
} from 'lucide-react';

interface StepData {
  time: string;
  secondNum: number;
  title: string;
  desc: string;
  phase: 'surface' | 'descent' | 'underwater' | 'ascent' | 'exit';
  bgGradient: string;
  icon: React.ReactNode;
}

const STEPS: StepData[] = [
  {
    time: '0s',
    secondNum: 0,
    title: 'Position de départ en surface',
    desc: 'Le bébé est à la verticale contre le parent. Une main derrière la tête, l\'autre derrière les fesses.',
    phase: 'surface',
    bgGradient: 'from-sky-50 to-white',
    icon: <UserCheck className="w-4 h-4 text-sky-700" />,
  },
  {
    time: '1s',
    secondNum: 1,
    title: 'Préparation à la descente',
    desc: 'Le parent se prépare à descendre en inspirant et en sécurisant sa prise.',
    phase: 'surface',
    bgGradient: 'from-sky-100 to-sky-50',
    icon: <ArrowDown className="w-4 h-4 text-sky-700" />,
  },
  {
    time: '2s',
    secondNum: 2,
    title: 'Début de la descente, entrée de la tête',
    desc: 'Début de la descente douce et franche. La tête du bébé entre sous l\'eau.',
    phase: 'descent',
    bgGradient: 'from-sky-200 to-sky-100',
    icon: <ArrowDown className="w-4 h-4 text-indigo-700" />,
  },
  {
    time: '3s',
    secondNum: 3,
    title: 'Immersion complète du bébé',
    desc: 'Immersion complète du bébé. Restez calme et sécurisant.',
    phase: 'underwater',
    bgGradient: 'from-indigo-200 to-sky-200',
    icon: <Waves className="w-4 h-4 text-indigo-800" />,
  },
  {
    time: '4s',
    secondNum: 4,
    title: 'Descente continue sous l\'eau',
    desc: 'Descente continue sous l\'eau, toujours en douceur et sans sauter.',
    phase: 'underwater',
    bgGradient: 'from-indigo-300 to-indigo-200',
    icon: <ArrowDown className="w-4 h-4 text-indigo-900" />,
  },
  {
    time: '5s',
    secondNum: 5,
    title: 'Stabilisation sous l\'eau',
    desc: 'Stabilisation quelques instants sous l\'eau, en toute sécurité.',
    phase: 'underwater',
    bgGradient: 'from-indigo-300 to-indigo-200',
    icon: <Heart className="w-4 h-4 text-rose-600 fill-rose-500/20" />,
  },
  {
    time: '6s',
    secondNum: 6,
    title: 'Remontée vers la surface',
    desc: 'Remontée douce vers la surface, toujours bien maintenu.',
    phase: 'ascent',
    bgGradient: 'from-sky-200 to-indigo-100',
    icon: <ArrowUp className="w-4 h-4 text-sky-700" />,
  },
  {
    time: '7s',
    secondNum: 7,
    title: 'Sortie d\'eau en douceur',
    desc: 'Sortie d\'eau en douceur. Le bébé reste contre le parent.',
    phase: 'exit',
    bgGradient: 'from-emerald-50 to-sky-50',
    icon: <Smile className="w-4 h-4 text-emerald-600" />,
  },
];

export const ImmersionSequenceInfographic: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="space-y-4 my-6">
      {/* Main Header Banner */}
      <div className="bg-gradient-to-r from-sky-950 via-indigo-950 to-slate-950 rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-300 border border-sky-300/30 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                Infographie Pédagogique
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 text-[10px] sm:text-xs font-black">
                ⏱️ 7 SECONDES
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white uppercase">
              IMMERSION PARENT-BÉBÉ CONTRE LE PARENT – DESCENTE DOUCE ET FRANCHE
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 font-medium">
              Descente douce, continue et franche — chronologie seconde par seconde (0s à 7s)
            </p>
          </div>

          <div className="p-3 bg-white/10 rounded-2xl border border-white/15 text-xs text-sky-200 flex items-center gap-2 shrink-0">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-[11px] leading-tight">Maintien vertical strict<br />Axe tête-tronc protégé</span>
          </div>
        </div>
      </div>

      {/* Interactive Step-by-Step Chrono Grid (8 steps: 0s to 7s) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-sky-600" />
            Déroulement chronologique détaillé (0s à 7s)
          </span>
          <span className="text-[11px] text-slate-500 font-medium">
            Cliquez sur une seconde pour l'observer
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {STEPS.map((step) => {
            const isSelected = activeStep === step.secondNum;
            const isUnderwater = step.phase === 'underwater';

            return (
              <div
                key={step.time}
                onClick={() => setActiveStep(step.secondNum)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2 relative ${
                  isSelected
                    ? 'ring-2 ring-indigo-500 shadow-lg scale-102 bg-indigo-50/90 border-indigo-300'
                    : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-2xs hover:shadow-xs'
                }`}
              >
                {/* Second Badge & Icon */}
                <div className="flex items-center justify-between">
                  <span
                    className={`font-black font-mono text-xs px-2 py-0.5 rounded-full ${
                      isUnderwater
                        ? 'bg-indigo-600 text-white'
                        : step.phase === 'exit'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-sky-100 text-sky-900'
                    }`}
                  >
                    {step.time}
                  </span>
                  <div className="p-1 rounded-full bg-white shadow-2xs border border-slate-100">
                    {step.icon}
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold text-slate-900 leading-tight">
                    {step.title}
                  </h4>
                  <p className="text-[10px] text-slate-600 leading-snug line-clamp-3">
                    {step.desc}
                  </p>
                </div>

                {/* Submersion depth indicator */}
                <div className="pt-1">
                  <div
                    className={`h-1 rounded-full ${
                      step.phase === 'underwater'
                        ? 'bg-indigo-600'
                        : step.phase === 'descent' || step.phase === 'ascent'
                        ? 'bg-sky-400'
                        : 'bg-slate-200'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Step Detail Spotlight */}
      {activeStep !== null && STEPS.find(s => s.secondNum === activeStep) && (() => {
        const stepDetail = STEPS.find(s => s.secondNum === activeStep)!;
        return (
          <div className="p-4 sm:p-5 bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-200 rounded-2xl space-y-2 animate-fade-in shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm px-2.5 py-0.5 rounded-full bg-indigo-600 text-white">
                  {stepDetail.time}
                </span>
                <h4 className="font-extrabold text-sm sm:text-base text-indigo-950">
                  {stepDetail.title}
                </h4>
              </div>
              <button
                onClick={() => setActiveStep(null)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
              >
                Fermer le focus
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {stepDetail.desc}
            </p>
          </div>
        );
      })()}

      {/* Golden Rule Footer Banner */}
      <div className="p-4 sm:p-5 bg-sky-50 border-2 border-sky-200 rounded-2xl sm:rounded-3xl flex items-start sm:items-center gap-3.5 shadow-xs">
        <div className="p-2.5 rounded-2xl bg-sky-600 text-white shrink-0 shadow-sm">
          <Heart className="w-5 h-5 fill-white" />
        </div>
        <div className="space-y-0.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-sky-800 block">
            Règle d'or absolue
          </span>
          <p className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
            Descente douce, continue et franche, sans sauter. Le bébé est maintenu à la verticale, bien contre le parent, en toute sécurité.
          </p>
        </div>
      </div>
    </div>
  );
};


