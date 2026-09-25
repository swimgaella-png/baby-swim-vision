import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Heart,
  PhoneCall,
  Info,
  CheckCircle2,
  XCircle,
  HelpCircle,
  BookOpen,
  ExternalLink,
  Sparkles,
  Eye,
  Activity,
  Droplet,
  Waves,
  X
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface DryDrowningFactsheetProps {
  onClose?: () => void;
  isModal?: boolean;
}

export const DryDrowningFactsheet: React.FC<DryDrowningFactsheetProps> = ({
  onClose,
  isModal = false,
}) => {
  const { t, tArray } = useTranslation();

  // Interactive Quiz State
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: boolean | null }>({
    1: null,
    2: null,
    3: null,
  });

  const handleAnswer = (questionIndex: number, answer: boolean) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionIndex]: answer,
    }));
  };

  const resetQuiz = () => {
    setQuizAnswers({ 1: null, 2: null, 3: null });
  };

  return (
    <div className={`space-y-8 ${isModal ? 'max-w-3xl mx-auto' : 'max-w-4xl mx-auto'}`}>
      {/* 1. Header & Reassuring Visual */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 text-white p-6 sm:p-8 shadow-xl">
        {/* Soft Background Ripples */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-sky-300/10 rounded-full blur-xl pointer-events-none" />

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-sky-200" />
            <span>{t('dryDrowning.badge')}</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              🏊‍♀️ {t('dryDrowning.title')}
            </h1>
            <p className="text-sm sm:text-base text-sky-100 max-w-2xl leading-relaxed">
              {t('dryDrowning.subtitle')}
            </p>
          </div>

          {/* Gentle SVG illustration representing parent & child in water */}
          <div className="pt-2 flex items-center justify-center">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-center gap-4">
              <svg viewBox="0 0 200 90" className="w-48 sm:w-56 h-auto drop-shadow-sm" fill="none">
                {/* Water surface waves */}
                <path
                  d="M0 60 C 30 55, 50 65, 80 60 C 110 55, 130 65, 160 60 C 180 57, 195 62, 200 60 L 200 90 L 0 90 Z"
                  fill="rgba(255,255,255,0.25)"
                />
                <path
                  d="M0 65 C 25 62, 55 68, 85 64 C 115 60, 145 67, 175 63 L 200 65 L 200 90 L 0 90 Z"
                  fill="rgba(255,255,255,0.35)"
                />
                {/* Parent figure (gentle circle & shoulders) */}
                <circle cx="70" cy="35" r="14" fill="#FDE68A" />
                <path d="M50 58 C 50 48, 90 48, 90 58 Z" fill="#60A5FA" />
                {/* Parent smiling eye */}
                <path d="M68 34 Q 72 38 76 34" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />
                
                {/* Baby figure (supported in water) */}
                <circle cx="115" cy="40" r="11" fill="#FEF3C7" />
                <path d="M102 58 C 102 50, 128 50, 128 58 Z" fill="#38BDF8" />
                {/* Baby smile */}
                <path d="M112 40 Q 115 44 118 40" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" />

                {/* Supporting hands under baby */}
                <path d="M85 52 Q 105 54 110 52" stroke="#FDE68A" strokeWidth="4" strokeLinecap="round" />
                
                {/* Friendly Floating Toy Duck */}
                <path d="M148 55 C 145 50, 155 45, 162 48 C 166 45, 170 47, 168 53 C 164 57, 150 58, 148 55 Z" fill="#FBBF24" />
                <circle cx="163" cy="48" r="1" fill="#78350F" />
                <path d="M166 49 L 170 50 L 166 52 Z" fill="#F97316" />

                {/* Bubbles */}
                <circle cx="132" cy="32" r="3" fill="rgba(255,255,255,0.6)" />
                <circle cx="138" cy="24" r="2" fill="rgba(255,255,255,0.4)" />
                <circle cx="60" cy="25" r="2" fill="rgba(255,255,255,0.5)" />
              </svg>
              <div className="text-left space-y-1">
                <span className="text-xs font-bold text-sky-100 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-300 fill-rose-300" />
                  {t('dryDrowning.pleasureAndSafety')}
                </span>
                <p className="text-[11px] text-sky-100 leading-snug">
                  {t('dryDrowning.pleasureAndSafetyDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Message Principal : Le mythe expliqué */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 rounded-full text-xs font-bold">
            ❌ {t('dryDrowning.mainMessageBadge')}
          </span>
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
          {t('dryDrowning.mainMessageTitle')}
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>{t('dryDrowning.mainMessageP1')}</p>
          <p className="font-semibold text-slate-800">{t('dryDrowning.mainMessageP2')}</p>
          <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl text-slate-700 space-y-2">
            <p className="font-medium text-sky-950">{t('dryDrowning.mainMessageP3')}</p>
            <p className="text-xs text-sky-800 italic">{t('dryDrowning.mainMessageP4')}</p>
          </div>
        </div>
      </section>

      {/* 2bis. Éclairage anatomique : Position du larynx et évolution */}
      <section className="bg-gradient-to-br from-indigo-50/80 via-sky-50/60 to-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span>{t('dryDrowning.childPhysiologyBadge')}</span>
          </div>
          <span className="text-[11px] font-semibold text-indigo-600 bg-white px-2.5 py-0.5 rounded-full border border-indigo-200 shadow-2xs">
            {t('dryDrowning.ageRangeBadge')}
          </span>
        </div>

        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <span>👶</span>
          <span>{t('dryDrowning.larynxTitle')}</span>
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-4 sm:p-5 bg-white rounded-2xl border border-indigo-200/80 shadow-2xs space-y-3">
            <p className="text-slate-900 font-medium leading-relaxed">
              « {t('dryDrowning.larynxText')} »
            </p>
            <div className="pt-2 border-t border-indigo-100/80 flex items-start gap-2.5 text-xs text-slate-600">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <p className="italic text-[12px] text-indigo-950">
                {t('dryDrowning.larynxNote')}
              </p>
            </div>
          </div>

          {/* Timeline visual of larynx descent */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 text-center space-y-1">
              <span className="text-xs font-black text-indigo-900 block">{t('dryDrowning.larynxStep1Age')}</span>
              <p className="text-[11px] text-slate-600 leading-tight">
                {t('dryDrowning.larynxStep1Desc')}
              </p>
            </div>
            <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 text-center space-y-1">
              <span className="text-xs font-black text-indigo-900 block">{t('dryDrowning.larynxStep2Age')}</span>
              <p className="text-[11px] text-slate-600 leading-tight">
                {t('dryDrowning.larynxStep2Desc')}
              </p>
            </div>
            <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 text-center space-y-1">
              <span className="text-xs font-black text-indigo-900 block">{t('dryDrowning.larynxStep3Age')}</span>
              <p className="text-[11px] text-slate-600 leading-tight">
                {t('dryDrowning.larynxStep3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Ne pas banaliser le fait de boire la tasse */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50/70 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5 text-amber-900 font-bold text-sm sm:text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <span>{t('dryDrowning.nuanceTitle')}</span>
        </div>

        <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
          {t('dryDrowning.nuanceText')}
        </p>

        <div className="p-3.5 bg-white/80 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{t('dryDrowning.nuanceMinistry')}</span>
        </div>
      </section>

      {/* 4. Les signes qui doivent alerter (Cartes visuelles) */}
      <section className="space-y-4">
        <div className="text-center sm:text-left space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-bold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>{t('dryDrowning.observationSignsBadge')}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
            🚨 {t('dryDrowning.signsSectionTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            {t('dryDrowning.signsSectionSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Carte 1: Respiration */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 hover:border-sky-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-lg">
                🫁
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {t('dryDrowning.signRespirationTitle')}
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              {tArray<string>('dryDrowning.signRespirationItems').map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Carte 2: État Général */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 hover:border-indigo-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                😴
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {t('dryDrowning.signGeneralStateTitle')}
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              {tArray<string>('dryDrowning.signGeneralStateItems').map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Carte 3: Coloration */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 hover:border-purple-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">
                👄
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {t('dryDrowning.signColorationTitle')}
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              {tArray<string>('dryDrowning.signColorationItems').map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Carte 4: Autres signes */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3 hover:border-rose-300 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-lg">
                🤢
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {t('dryDrowning.signOtherTitle')}
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-600">
              {tArray<string>('dryDrowning.signOtherItems').map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 text-center font-medium">
          {t('dryDrowning.signsDisclaimer')}
        </div>
      </section>

      {/* 5. Il a bu la tasse… que faire ? (Action plan 3 tiers) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
          <span>😮</span>
          <span>{t('dryDrowning.whatToDoTitle')}</span>
        </h2>

        <div className="space-y-4">
          {/* Situation 1: Vert (Toux brève) */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs sm:text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{t('dryDrowning.case1Title')}</span>
            </div>
            <p className="text-xs text-emerald-800 pl-4 font-medium">
              👉 {t('dryDrowning.case1Text')}
            </p>
          </div>

          {/* Situation 2: Orange (Toux persistante ou symptômes) */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1.5">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs sm:text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span>{t('dryDrowning.case2Title')}</span>
            </div>
            <p className="text-xs text-amber-800 pl-4 font-medium">
              👉 {t('dryDrowning.case2Text')}
            </p>
          </div>

          {/* Situation 3: Rouge (Détresse respiratoire ou inconscience) */}
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs sm:text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0 animate-ping" />
              <span>{t('dryDrowning.case3Title')}</span>
            </div>
            <p className="text-xs font-bold text-rose-800 pl-4">
              🚨 {t('dryDrowning.case3Text')}
            </p>

            {/* Emergency Numbers */}
            <div className="mt-2 pt-3 border-t border-rose-200/80">
              <span className="text-[11px] font-bold text-rose-900 uppercase tracking-wider block mb-2">
                {t('dryDrowning.emergencyNumbersTitle')}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold text-rose-900">
                <div className="bg-white p-2.5 rounded-xl border border-rose-200 flex items-center justify-center gap-2 shadow-2xs">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t('dryDrowning.samu')}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-rose-200 flex items-center justify-center gap-2 shadow-2xs">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t('dryDrowning.pompiers')}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-rose-200 flex items-center justify-center gap-2 shadow-2xs">
                  <PhoneCall className="w-3.5 h-3.5 text-rose-600" />
                  <span>{t('dryDrowning.europe')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Correction d'une idée fausse (Encadré comparatif) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fausse croyance */}
        <div className="bg-rose-50/80 border border-rose-200 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm sm:text-base">
            <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>❌ {t('dryDrowning.beliefBoxFalseTitle')}</span>
          </div>
          <p className="text-xs sm:text-sm text-rose-900 italic leading-relaxed bg-white/80 p-4 rounded-2xl border border-rose-100">
            {t('dryDrowning.beliefBoxFalseText')}
          </p>
        </div>

        {/* Ce qu'il faut retenir */}
        <div className="bg-emerald-50/80 border border-emerald-200 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm sm:text-base">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>✅ {t('dryDrowning.beliefBoxTrueTitle')}</span>
          </div>
          <div className="space-y-2 text-xs text-emerald-950 leading-relaxed font-medium">
            <p>• {t('dryDrowning.beliefBoxTrueText1')}</p>
            <p>• {t('dryDrowning.beliefBoxTrueText2')}</p>
            <p className="text-[11px] text-emerald-800 font-normal">
              • {t('dryDrowning.beliefBoxTrueText3')}
            </p>
          </div>
        </div>
      </section>

      {/* 8. Prévention : Le message le plus important */}
      <section className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-md space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 text-sky-200 text-xs font-bold">
          <Eye className="w-3.5 h-3.5" />
          <span>{t('dryDrowning.activeVigilanceBadge')}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white">
          👀 {t('dryDrowning.preventionTitle')}
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-slate-200 leading-relaxed">
          <p className="text-base font-semibold text-white">
            {t('dryDrowning.preventionP1')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
              <span className="font-bold text-sky-200 block mb-1">{t('dryDrowning.zeroExceptionsTitle')}</span>
              <p className="text-xs text-slate-300">{t('dryDrowning.preventionP2')}</p>
            </div>
            <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
              <span className="font-bold text-sky-200 block mb-1">{t('dryDrowning.designatedAdultTitle')}</span>
              <p className="text-xs text-slate-300">{t('dryDrowning.preventionP3')}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 italic pt-1">
            {t('dryDrowning.preventionNotice')}
          </p>
        </div>
      </section>

      {/* 9. Message spécifique Bébé Nageur */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👶</span>
          <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
            {t('dryDrowning.babySwimmerTitle')}
          </h3>
        </div>

        <div className="space-y-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <p>{t('dryDrowning.babySwimmerP1')}</p>
          <p className="font-bold text-slate-800">{t('dryDrowning.babySwimmerP2')}</p>
          <p>{t('dryDrowning.babySwimmerP3')}</p>
        </div>

        <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 text-xs text-sky-800 font-medium">
          {t('dryDrowning.babySwimmerMilestones')}
        </div>
      </section>

      {/* 10. Mini Quiz Interactif */}
      <section className="bg-gradient-to-br from-indigo-50 via-sky-50 to-white rounded-3xl p-6 sm:p-8 border border-indigo-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t('dryDrowning.miniQuizBadge')}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
              🧠 {t('dryDrowning.quizTitle')}
            </h2>
            <p className="text-xs text-slate-600">
              {t('dryDrowning.quizSubtitle')}
            </p>
          </div>

          <button
            onClick={resetQuiz}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-white px-3 py-1.5 rounded-xl border border-indigo-100 shadow-2xs cursor-pointer"
          >
            {t('dryDrowning.resetQuizBtn')}
          </button>
        </div>

        <div className="space-y-4">
          {/* Question 1 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <p className="font-bold text-xs sm:text-sm text-slate-800">
              1. « {t('dryDrowning.quizQ1')} »
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleAnswer(1, true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  quizAnswers[1] === true
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('dryDrowning.quizBtnTrue')}
              </button>
              <button
                onClick={() => handleAnswer(1, false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  quizAnswers[1] === false
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('dryDrowning.quizBtnFalse')}
              </button>
            </div>
            {quizAnswers[1] !== null && (
              <div
                className={`p-3 rounded-xl text-xs font-medium space-y-1 ${
                  quizAnswers[1] === false
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                <span className="font-bold block">
                  {quizAnswers[1] === false ? `✅ ${t('dryDrowning.quizCorrect')}` : `❌ ${t('dryDrowning.quizIncorrect')}`}
                </span>
                <p>{t('dryDrowning.quizQ1Feedback')}</p>
              </div>
            )}
          </div>

          {/* Question 2 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <p className="font-bold text-xs sm:text-sm text-slate-800">
              2. « {t('dryDrowning.quizQ2')} »
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleAnswer(2, true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  quizAnswers[2] === true
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('dryDrowning.quizBtnTrue')}
              </button>
              <button
                onClick={() => handleAnswer(2, false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  quizAnswers[2] === false
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('dryDrowning.quizBtnFalse')}
              </button>
            </div>
            {quizAnswers[2] !== null && (
              <div
                className={`p-3 rounded-xl text-xs font-medium space-y-1 ${
                  quizAnswers[2] === true
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                <span className="font-bold block">
                  {quizAnswers[2] === true ? `✅ ${t('dryDrowning.quizCorrect')}` : `❌ ${t('dryDrowning.quizIncorrect')}`}
                </span>
                <p>{t('dryDrowning.quizQ2Feedback')}</p>
              </div>
            )}
          </div>

          {/* Question 3 */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
            <p className="font-bold text-xs sm:text-sm text-slate-800">
              3. « {t('dryDrowning.quizQ3')} »
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleAnswer(3, true)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  quizAnswers[3] === true
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('dryDrowning.quizBtnTrue')}
              </button>
              <button
                onClick={() => handleAnswer(3, false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  quizAnswers[3] === false
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t('dryDrowning.quizBtnFalse')}
              </button>
            </div>
            {quizAnswers[3] !== null && (
              <div
                className={`p-3 rounded-xl text-xs font-medium space-y-1 ${
                  quizAnswers[3] === false
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-rose-50 text-rose-900 border border-rose-200'
                }`}
              >
                <span className="font-bold block">
                  {quizAnswers[3] === false ? `✅ ${t('dryDrowning.quizCorrect')}` : `❌ ${t('dryDrowning.quizIncorrect')}`}
                </span>
                <p>{t('dryDrowning.quizQ3Feedback')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 11. Version « À retenir » (4 choses à retenir) */}
      <section className="bg-gradient-to-br from-blue-600 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-300 fill-rose-300" />
          <h2 className="text-lg sm:text-xl font-extrabold text-white">
            {t('dryDrowning.fourPointsTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20 space-y-1">
            <span className="text-xs font-bold text-sky-200">
              1️⃣ {t('dryDrowning.fourPoints1Title')}
            </span>
            <p className="text-xs text-white/90 leading-relaxed">
              {t('dryDrowning.fourPoints1Desc')}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20 space-y-1">
            <span className="text-xs font-bold text-sky-200">
              2️⃣ {t('dryDrowning.fourPoints2Title')}
            </span>
            <p className="text-xs text-white/90 leading-relaxed">
              {t('dryDrowning.fourPoints2Desc')}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20 space-y-1">
            <span className="text-xs font-bold text-sky-200">
              3️⃣ {t('dryDrowning.fourPoints3Title')}
            </span>
            <p className="text-xs text-white/90 leading-relaxed">
              {t('dryDrowning.fourPoints3Desc')}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-2xl border border-white/20 space-y-1">
            <span className="text-xs font-bold text-sky-200">
              4️⃣ {t('dryDrowning.fourPoints4Title')}
            </span>
            <p className="text-xs text-white/90 leading-relaxed">
              {t('dryDrowning.fourPoints4Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 12. Sources et références officielles */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-sm sm:text-base text-slate-900">
            📚 {t('dryDrowning.sourcesTitle')}
          </h3>
        </div>

        <p className="text-xs text-slate-500">
          {t('dryDrowning.sourcesIntro')}
        </p>

        <div className="space-y-2">
          {tArray<{ name: string; url: string }>('dryDrowning.sourcesList').map((source, idx) => (
            <a
              key={idx}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 flex items-center justify-between text-xs text-slate-700 hover:text-indigo-700 transition-colors group"
            >
              <span className="font-medium">{source.name}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0" />
            </a>
          ))}
        </div>
      </section>

      {isModal && onClose && (
        <div className="text-center pt-2">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-2xl transition-colors cursor-pointer shadow-sm"
          >
            {t('dryDrowning.closeBtn')}
          </button>
        </div>
      )}
    </div>
  );
};
