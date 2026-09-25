import React, { useState, useEffect } from 'react';
import {
  Camera,
  Cpu,
  HeartHandshake,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Play,
  CheckCircle2,
  Users,
  ExternalLink,
  ShieldCheck,
  Infinity,
  BookOpen,
  Award,
  Video,
  Edit2,
} from 'lucide-react';
import { SafetyBanner } from './SafetyBanner';
import { useTranslation } from '../i18n/LanguageContext';
import { CommercialOfferCard } from './CommercialOfferCard';
import { AnalysisInteractiveDemoPreview } from './AnalysisInteractiveDemoPreview';
import { interfaceSettingsService, InterfaceSettings, DEFAULT_SETTINGS } from '../services/interfaceSettingsService';
import { useAdminMode } from '../context/AdminModeContext';

interface LandingPageProps {
  onStart: () => void;
  onExploreDemo: () => void;
  onOpenCheckout: () => void;
  hasLifetimeAccess?: boolean;
  onNavigate?: (view: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStart,
  onExploreDemo,
  onOpenCheckout,
  hasLifetimeAccess = false,
  onNavigate,
}) => {
  const { t, language } = useTranslation();
  const [settings, setSettings] = useState<InterfaceSettings>(interfaceSettingsService.getSettings());
  const { isAdminModeActive, setEditingSettingsField } = useAdminMode();

  useEffect(() => {
    const unsub = interfaceSettingsService.subscribe((s) => setSettings(s));
    return () => unsub();
  }, []);

  const getLocalizedText = (
    settingKey: keyof InterfaceSettings,
    translationKey: string,
    defaultFallback: string
  ): string => {
    if (language === 'fr' && settings[settingKey] && settings[settingKey] !== DEFAULT_SETTINGS[settingKey]) {
      return String(settings[settingKey]);
    }
    const translated = t(translationKey);
    return translated && translated !== translationKey ? translated : (String(settings[settingKey]) || defaultFallback);
  };

  const heroBadge = getLocalizedText('heroBadgeText', 'landing.heroBadge', "Application Pédagogique d'Analyse Aquatique Bébé");
  const heroHeadline = getLocalizedText('heroHeadline', 'landing.heroTitle', "Accompagnez l'éveil aquatique de votre bébé avec précision et sérénité");
  const heroSubheadline = getLocalizedText('heroSubheadline', 'landing.heroSubtitle', "Baby Swim Vision analyse vos vidéos aquatiques pour perfectionner vos prises, encourager l'autonomie motrice de votre enfant et faire de chaque baignade un moment de complicité sécurisé.");
  const heroCtaText = getLocalizedText('heroCtaText', 'landing.heroCta', "Obtenir Baby Swim Vision — 24,90 € à vie");

  const features = [
    {
      icon: Video,
      titleKey: 'feature1Title' as keyof InterfaceSettings,
      descKey: 'feature1Desc' as keyof InterfaceSettings,
      title: getLocalizedText('feature1Title', 'landing.feature1Title', "Analyse Vidéo Intelligente"),
      badge: t('landing.feature1Badge'),
      desc: getLocalizedText('feature1Desc', 'landing.feature1Desc', "Analyse en quelques secondes l'équilibre, l'horizontalité, les réflexes et la qualité des soutiens des parents (vidéos de 1 min max).")
    },
    {
      icon: BookOpen,
      titleKey: 'feature2Title' as keyof InterfaceSettings,
      descKey: 'feature2Desc' as keyof InterfaceSettings,
      title: getLocalizedText('feature2Title', 'landing.feature2Title', "Bibliothèque Pédagogique"),
      badge: t('landing.feature2Badge'),
      desc: getLocalizedText('feature2Desc', 'landing.feature2Desc', "Fiches d'exercices pas-à-pas, erreurs courantes à éviter, infographie détaillée de la 1ère immersion en 7 secondes et articles certifiés.")
    },
    {
      icon: Award,
      titleKey: 'feature3Title' as keyof InterfaceSettings,
      descKey: 'feature3Desc' as keyof InterfaceSettings,
      title: getLocalizedText('feature3Title', 'landing.feature3Title', "Grille de Compétences"),
      badge: t('landing.feature3Badge'),
      desc: getLocalizedText('feature3Desc', 'landing.feature3Desc', "Matrice complète des 4 paliers d'autonomie (Découverte, Confiance, Autonomie, Exploration) pour mesurer l'éveil sans compétition.")
    },
    {
      icon: TrendingUp,
      titleKey: 'feature4Title' as keyof InterfaceSettings,
      descKey: 'feature4Desc' as keyof InterfaceSettings,
      title: getLocalizedText('feature4Title', 'landing.feature4Title', "Journal de Séances Multi-Bébés"),
      badge: t('landing.feature4Badge'),
      desc: getLocalizedText('feature4Desc', 'landing.feature4Desc', "Historique visuel complet des progrès, notes personnalisées et suivi individualisé pour un ou plusieurs enfants.")
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 bg-gradient-to-b from-sky-50/80 via-white to-indigo-50/30 rounded-3xl border border-sky-100 shadow-xs">
        {/* Soft water-inspired decorative blobs */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-sky-100/90 text-sky-800 text-xs font-bold shadow-xs relative group">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>{heroBadge}</span>
              {isAdminModeActive && (
                <button
                  type="button"
                  onClick={() =>
                    setEditingSettingsField({
                      key: 'heroBadgeText',
                      label: 'Badge en haut du Hero',
                      value: settings.heroBadgeText || "Application Pédagogique d'Analyse Aquatique Bébé",
                    })
                  }
                  className="ml-1 p-1 bg-amber-200 hover:bg-amber-300 text-amber-900 rounded text-[10px] font-bold cursor-pointer"
                  title="Modifier ce texte"
                >
                  ✏️
                </button>
              )}
            </div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black shadow-xs">
              <Infinity className="w-3.5 h-3.5 text-emerald-600" />
              <span>{t('landing.heroPriceBadge')}</span>
            </div>
          </div>

          {/* Slogan / Main Headline */}
          <div className="relative group">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              {heroHeadline}
            </h1>
            {isAdminModeActive && (
              <button
                type="button"
                onClick={() =>
                  setEditingSettingsField({
                    key: 'heroHeadline',
                    label: 'Titre principal (Slogan Hero)',
                    value: settings.heroHeadline || "Accompagnez l'éveil aquatique de votre bébé avec précision et sérénité",
                  })
                }
                className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Modifier le titre principal</span>
              </button>
            )}
          </div>

          {/* Presentation text */}
          <div className="relative group">
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {heroSubheadline}
            </p>
            {isAdminModeActive && (
              <button
                type="button"
                onClick={() =>
                  setEditingSettingsField({
                    key: 'heroSubheadline',
                    label: 'Texte descriptif du Hero',
                    value: settings.heroSubheadline || "Baby Swim Vision analyse vos vidéos aquatiques pour perfectionner vos prises, encourager l'autonomie motrice de votre enfant et faire de chaque baignade un moment de complicité sécurisé.",
                  })
                }
                className="mt-2 inline-flex items-center gap-1 px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>Modifier ce paragraphe</span>
              </button>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={hasLifetimeAccess ? onStart : onOpenCheckout}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-600 via-teal-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-sky-600/30 flex items-center justify-center gap-2.5 transition-all hover:scale-102 cursor-pointer text-base"
            >
              <span>{hasLifetimeAccess ? t('landing.heroAccessApp') : heroCtaText}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('find-club')}
                className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-800 font-extrabold rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer text-base"
              >
                <span>🌍 {t('landing.findClubBtn')}</span>
              </button>
            )}
          </div>

          {/* Reassurance points below hero */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t('landing.oneTimePayment')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t('landing.noSubscription')}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              {t('landing.lifetimeAccess')}
            </span>
          </div>

          {/* Safety note in Hero */}
          <div className="pt-4 max-w-xl mx-auto">
            <SafetyBanner compact />
          </div>
        </div>
      </section>

      {/* Core Pedagogical Analysis Dimensions Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnalysisInteractiveDemoPreview />
      </section>

      {/* Primary Commercial Offer Box (24,90 € à vie) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <CommercialOfferCard
          onSelectBuy={onOpenCheckout}
          hasLifetimeAccess={hasLifetimeAccess}
        />
      </section>

      {/* Feature Grid Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            {t('landing.featuresBadge')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            {t('landing.featuresTitle')}
          </h2>
          <p className="text-sm text-slate-500 max-w-lg mx-auto">
            {t('landing.featuresSubtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => {
            const FIcon = f.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xs hover:shadow-md transition-shadow flex items-start gap-4 relative group"
              >
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-100">
                  <FIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-md">
                      {f.badge}
                    </span>
                    {isAdminModeActive && (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingSettingsField({
                            key: f.titleKey,
                            label: `Titre du bloc ${i + 1}`,
                            value: f.title,
                          })
                        }
                        className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[10px] font-bold cursor-pointer"
                      >
                        ✏️ Modifier
                      </button>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety Manifesto Footer */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6">
        <SafetyBanner />
      </section>
    </div>
  );
};
