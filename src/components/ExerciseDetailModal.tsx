import React from 'react';
import { X, Clock, AlertCircle, CheckCircle2, BookOpen, Compass, Eye, Sparkles, Quote } from 'lucide-react';
import { ExerciseItem } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { getLocalizedExercises } from '../data/pedagogicalDatabase';
import { ProtectedImage } from './ProtectedMedia';

interface ExerciseDetailModalProps {
  exercise: ExerciseItem | null;
  onClose: () => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise: initialExercise,
  onClose,
}) => {
  const { t, locale } = useTranslation();
  const localizedList = getLocalizedExercises(locale);
  const localized = initialExercise ? localizedList.find((e) => e.id === initialExercise.id) : null;
  const exercise = localized ? { ...localized, image: initialExercise?.image || localized.image } : initialExercise;

  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-3 pr-8">
          {/* Exercise Image if present */}
          {exercise.image && (
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 shadow-sm bg-slate-900">
              <ProtectedImage
                src={exercise.image}
                alt={exercise.title}
                className="w-full max-h-72 object-cover"
                withWatermark={true}
              />
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
              {t('analysisResult.recommendedExerciseTitle')}
            </span>
            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
              {t('library.recommendedAge')} : {exercise.recommendedAge}
            </span>
            <span className="px-2.5 py-0.5 bg-sky-100 text-sky-700 rounded-full text-xs font-semibold">
              {exercise.level}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {exercise.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100 font-medium">
            🎯 <strong>{t('common.objective')} :</strong> {exercise.objective}
          </p>
        </div>

        {/* Evolution Guide Card (if present) */}
        {exercise.evolutionGuide && (
          <div className="bg-gradient-to-br from-indigo-50/80 via-sky-50/50 to-white rounded-3xl p-5 border border-indigo-100/80 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-indigo-900">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h3 className="font-extrabold text-sm sm:text-base">
                {exercise.evolutionGuide.title}
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div className="bg-white/90 p-3.5 rounded-2xl border border-indigo-50 space-y-1.5">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                  ❓ Pourquoi vers 7-8 mois bébé ne veut plus rester sur le dos ?
                </span>
                <p className="text-slate-600 text-xs">
                  {exercise.evolutionGuide.whyRefusalAt7Months}
                </p>
              </div>

              <div className="bg-white/90 p-3.5 rounded-2xl border border-indigo-50 space-y-1.5">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                  ✨ Rendre la position dorsale active
                </span>
                <p className="text-slate-600 text-xs">
                  {exercise.evolutionGuide.howToMakeActive}
                </p>
              </div>

              <div className="bg-white/90 p-3.5 rounded-2xl border border-indigo-50 space-y-1.5">
                <span className="font-bold text-indigo-950 flex items-center gap-1.5 text-xs">
                  <Eye className="w-3.5 h-3.5 text-sky-600 inline" /> Le regard : votre meilleur allié
                </span>
                <p className="text-slate-600 text-xs">
                  {exercise.evolutionGuide.eyeContactTip}
                </p>
              </div>

              {exercise.evolutionGuide.developmentalStages && (
                <div className="pt-1">
                  <span className="font-bold text-slate-800 text-xs uppercase tracking-wider block mb-2">
                    Progression du développement aquatique :
                  </span>
                  <div className="grid grid-cols-1 gap-2">
                    {(exercise.evolutionGuide.developmentalStages || []).map((stage, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs bg-indigo-100/60 px-3 py-2 rounded-xl font-medium text-indigo-900">
                        <span className="w-5 h-5 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {idx + 1}
                        </span>
                        <span>{stage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {exercise.evolutionGuide.quotes && (exercise.evolutionGuide.quotes || []).map((quote, qIdx) => (
                <div key={qIdx} className="bg-indigo-900 text-indigo-100 p-3 rounded-2xl flex items-start gap-2 italic text-xs">
                  <Quote className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{quote}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Boat Game Script (if present) */}
        {exercise.boatGame && (
          <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200 space-y-2.5">
            <h4 className="font-bold text-xs text-sky-950 flex items-center gap-1.5 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5 text-sky-600" />
              {exercise.boatGame.title}
            </h4>
            <div className="space-y-1.5">
              {(exercise.boatGame.phrases || []).map((phrase, idx) => (
                <div key={idx} className="text-xs bg-white px-3 py-2 rounded-xl text-sky-900 font-medium border border-sky-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                  <span>{phrase}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step-by-step instructions */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-sky-600" />
            {t('exerciseModal.stepInstructions')}
          </h3>

          <div className="space-y-2.5">
            {(exercise.steps || []).map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <span className="w-6 h-6 rounded-xl bg-sky-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Common pitfalls vs positive corrections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-xs text-amber-900 flex items-center gap-1.5 uppercase tracking-wider">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              {t('exerciseModal.mistakesTitle')}
            </h4>
            <ul className="text-xs text-amber-950 space-y-1.5 list-disc pl-4">
              {(exercise.commonMistakes || []).map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 space-y-2">
            <h4 className="font-bold text-xs text-emerald-900 flex items-center gap-1.5 uppercase tracking-wider">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t('exerciseModal.correctionsTitle')}
            </h4>
            <ul className="text-xs text-emerald-950 space-y-1.5 list-disc pl-4">
              {(exercise.corrections || []).map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Safety & Duration footer */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs">
          <div className="flex items-center justify-between font-semibold text-slate-300">
            <span className="flex items-center gap-1 text-sky-400">
              <Clock className="w-4 h-4" />
              {t('exerciseModal.duration')} : {exercise.duration}
            </span>
            {exercise.repetition && (
              <span>{t('exerciseModal.repetitions')} : {exercise.repetition}</span>
            )}
          </div>
          <div className="pt-2 border-t border-slate-800 text-slate-300 leading-relaxed">
            <strong className="text-amber-400">{t('common.safety')} :</strong> {(exercise.safetyTips || []).join(' • ')}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
        >
          {t('common.close')}
        </button>
      </div>
    </div>
  );
};
