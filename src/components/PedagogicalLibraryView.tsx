import React, { useState, useEffect, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Clock,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  ArrowLeft,
  Lock,
  Edit2,
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { getLocalizedSkillCategories } from '../data/pedagogicalDatabase';
import { ExerciseItem, PedagogicalArticle, User } from '../types';
import { accessControlService } from '../services/accessControlService';
import { articleService } from '../services/articleService';
import { exerciseService } from '../services/exerciseService';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { ArticleDetailModal } from './ArticleDetailModal';
import { DryDrowningFactsheet } from './DryDrowningFactsheet';
import { LockedFeatureModal } from './LockedFeatureModal';
import { SkillsMatrixGrid } from './SkillsMatrixGrid';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { ProtectedImage } from './ProtectedMedia';
import { useTranslation } from '../i18n/LanguageContext';
import { useAdminMode } from '../context/AdminModeContext';

interface PedagogicalLibraryViewProps {
  initialTab?: 'articles' | 'exercises' | 'skills' | 'safety';
  currentUser?: User | null;
  onOpenCheckout?: () => void;
}

export const PedagogicalLibraryView: React.FC<PedagogicalLibraryViewProps> = ({
  initialTab = 'articles',
  currentUser = null,
  onOpenCheckout = () => {},
}) => {
  const { t, locale } = useTranslation();
  const tr = (key: string, fallback: string) => {
    const v = t(key);
    return v && v !== key ? v : fallback;
  };
  const [activeTab, setActiveTab] = useState<'articles' | 'exercises' | 'skills' | 'safety'>(
    initialTab === 'safety' ? 'articles' : initialTab
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedArticleCategory, setSelectedArticleCategory] = useState<string>('all');
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<PedagogicalArticle | null>(null);
  const [readingDryDrowning, setReadingDryDrowning] = useState<boolean>(false);
  const [lockedModalInfo, setLockedModalInfo] = useState<{
    isOpen: boolean;
    title?: string;
    message?: string;
  }>({ isOpen: false });

  // Delete confirmation target modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
    type: 'article' | 'exercice';
  } | null>(null);

  // Quick toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time articles & exercises from services
  const [articles, setArticles] = useState<PedagogicalArticle[]>(articleService.getAllArticles());
  const [exercises, setExercises] = useState<ExerciseItem[]>(exerciseService.getAllExercises());

  // Global in-app Admin Direct Mode Context
  const {
    isAdminModeActive,
    setEditingArticle,
    setIsCreatingArticle,
    setEditingExercise,
    setIsCreatingExercise,
    setEditingImageTarget,
    handleDeleteArticle,
    handleDeleteExercise,
  } = useAdminMode();

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const { id, title, type } = deleteTarget;
    if (type === 'article') {
      handleDeleteArticle(id);
      triggerToast(`Article « ${title} » supprimé avec succès.`);
    } else {
      handleDeleteExercise(id);
      triggerToast(`Exercice « ${title} » supprimé avec succès.`);
    }
    setDeleteTarget(null);
  };

  useEffect(() => {
    setArticles(articleService.getAllArticles(locale));
    setExercises(exerciseService.getAllExercises(locale));
  }, [locale]);

  useEffect(() => {
    const unsubA = articleService.subscribe((arts) => {
      setArticles(articleService.getAllArticles(locale));
    });
    const unsubE = exerciseService.subscribe((exos) => {
      setExercises(exerciseService.getAllExercises(locale));
    });
    return () => {
      unsubA();
      unsubE();
    };
  }, [locale]);

  const effectiveRole = accessControlService.getEffectiveRole(currentUser);
  const isPremium = effectiveRole === 'USER_PREMIUM' || effectiveRole === 'ADMIN';
  const showAdminControls = isAdminModeActive || currentUser?.role === 'ADMIN';

  const skillCategories = getLocalizedSkillCategories(locale);

  const dryDrowningArticle = useMemo(() => {
    return articles.find((a) => a.id === 'dry-drowning') || articleService.getArticleById('dry-drowning', locale);
  }, [articles, locale]);

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedArticleCategory === 'all' || art.category === selectedArticleCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredExercises = exercises.filter((exo) => {
    const matchesSearch =
      exo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exo.objective.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exo.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLevel = selectedLevel === 'all' || exo.level === selectedLevel;
    return matchesSearch && matchesLevel;
  });

  const handleOpenArticle = (art: PedagogicalArticle) => {
    const check = accessControlService.canAccess('FEATURE_ARTICLE_READ', currentUser);
    if (!check.allowed) {
      setLockedModalInfo({
        isOpen: true,
        title: `${tr('library.lockedArticleTitle', 'Lecture protégée')} : ${art.title}`,
        message: check.paywallMessage || tr('library.lockedArticleMessage', "La lecture intégrale de cet article spécialisé est réservée aux membres ayant débloqué l'accès complet Baby Swim Vision (24,90 € à vie ou code promo)."),
      });
      return;
    }

    if (art.id === 'dry-drowning') {
      setReadingDryDrowning(true);
    } else {
      setSelectedArticle(art);
    }
  };

  const handleOpenDryDrowning = () => {
    const check = accessControlService.canAccess('FEATURE_DRY_DROWNING_FACTSHEET', currentUser);
    if (!check.allowed) {
      setLockedModalInfo({
        isOpen: true,
        title: dryDrowningArticle?.title || tr('library.dryDrowningLockTitle', "Dossier médical complet : Noyade Sèche"),
        message: check.paywallMessage || tr('library.dryDrowningLockMessage', "L'accès à la fiche médicale complète et aux réflexes pédiatriques est réservé aux membres Baby Swim Vision."),
      });
      return;
    }
    setReadingDryDrowning(true);
  };

  const handleOpenExercise = (exo: ExerciseItem) => {
    const check = accessControlService.canAccess('FEATURE_EXERCISE_DETAIL', currentUser);
    if (!check.allowed) {
      setLockedModalInfo({
        isOpen: true,
        title: `Fiche exercice : ${exo.title}`,
        message: check.paywallMessage || "L'accès aux repères biomécaniques et consignes d'évolution de cet exercice est réservé aux membres ayant débloqué l'accès complet.",
      });
      return;
    }
    setSelectedExercise(exo);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>{t('library.knowledgeBadge')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          {t('library.pageTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          {t('library.pageSubtitle')}
        </p>
      </div>

      {/* Free User Paywall Banner */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 sm:p-6 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-up">
          <div className="flex items-center gap-3 text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                Articles & Fiches d'exercices réservés aux membres Premium
              </h3>
              <p className="text-xs sm:text-sm text-amber-100 mt-0.5">
                Débloquez l'accès complet à vie (24,90 €) pour consulter l'intégralité des articles, repères biomécaniques et fiches d'exercices.
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

      {/* If reading the Dry Drowning full factsheet in-line */}
      {readingDryDrowning ? (
        <div className="space-y-4">
          <button
            onClick={() => setReadingDryDrowning(false)}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('library.backToArticles')}</span>
          </button>
          <DryDrowningFactsheet isModal={false} />
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="flex flex-wrap items-center justify-center p-1 bg-slate-100 rounded-2xl max-w-xl mx-auto text-xs sm:text-sm font-semibold gap-1">
            <button
              onClick={() => setActiveTab('articles')}
              className={`flex-1 min-w-[120px] py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'articles'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📑 {t('library.tabArticles')} ({articles.length})
            </button>
            <button
              onClick={() => setActiveTab('exercises')}
              className={`flex-1 min-w-[110px] py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'exercises'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏊 {t('library.tabExercises')} ({exercises.length})
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`flex-1 min-w-[110px] py-2.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'skills'
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⭐ {t('library.tabSkills')} ({skillCategories.length})
            </button>
          </div>

          {/* TAB: Articles */}
          {activeTab === 'articles' && (
            <div className="space-y-6">
              {/* Search & Category Filter + Admin Add Button */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t('library.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-indigo-500"
                  />
                </div>

                <select
                  value={selectedArticleCategory}
                  onChange={(e) => setSelectedArticleCategory(e.target.value)}
                  className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-indigo-500 cursor-pointer"
                >
                  <option value="all">Toutes les thématiques</option>
                  <option value="safety">Sécurité & Prévention</option>
                  <option value="psychomotor">Développement & Pédagogie</option>
                  <option value="physiology">Physiologie & Confort</option>
                  <option value="parenting">Lien Parent-Bébé</option>
                </select>

                {showAdminControls && (
                  <button
                    onClick={() => setIsCreatingArticle(true)}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer transition-all hover:scale-102 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Nouvel Article</span>
                  </button>
                )}
              </div>

              {/* Featured Card: Noyade Sèche Factsheet */}
              {selectedArticleCategory === 'all' && searchQuery === '' && (
                <div
                  onClick={handleOpenDryDrowning}
                  className="bg-gradient-to-br from-sky-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden cursor-pointer group hover:shadow-xl transition-all"
                >
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-400/30 text-[11px] font-bold">
                        ⭐ {t('library.featuredArticle')}
                      </span>
                      {!isPremium && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-200 border border-amber-400/40 text-[10px] font-extrabold flex items-center gap-1">
                          <Lock className="w-3 h-3" /> {tr('library.subscriberContent', 'Contenu Abonné')}
                        </span>
                      )}
                      <span className="text-xs text-slate-300 flex items-center gap-1 font-medium">
                        <Clock className="w-3.5 h-3.5" /> {dryDrowningArticle?.readingTime || '4 min'} {t('library.readingTime')}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-sky-200 transition-colors">
                      {dryDrowningArticle?.title || tr('library.dryDrowningTitle', 'La « noyade sèche » : vrai ou faux ?')}
                    </h2>

                    <p className="text-xs sm:text-sm text-slate-200 max-w-2xl leading-relaxed">
                      {dryDrowningArticle?.summary || tr('library.dryDrowningSummary', 'Une idée très répandue sur les réseaux sociaux… mais que dit réellement la science médicale sur le fait de boire la tasse ? Découvrez les vraies réponses, les symptômes à surveiller et les bons réflexes.')}
                    </p>

                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {dryDrowningArticle?.tags && dryDrowningArticle.tags.length > 0 ? (
                          dryDrowningArticle.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-slate-300">
                              {tag}
                            </span>
                          ))
                        ) : (
                          <>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-slate-300">
                              💧 {tr('library.tagPrevention', 'Prévention')}
                            </span>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-slate-300">
                              🩺 {tr('library.tagPediatrics', 'Pédiatrie')}
                            </span>
                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-slate-300">
                              🚨 {tr('library.tagAlertSigns', "Signes d'alerte")}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="inline-flex items-center gap-1 text-xs font-bold text-sky-300 group-hover:translate-x-1 transition-transform">
                        <span>{isPremium ? t('library.readArticle') : tr('library.readSubscribersOnly', 'Lire (Réservé abonnés 🔒)')}</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of Articles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredArticles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group relative"
                  >
                    <div className="space-y-3">
                      {/* Photo Thumbnail if present */}
                      {article.image && (
                        <div
                          onClick={() => handleOpenArticle(article)}
                          className="relative w-full h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 cursor-pointer shrink-0"
                        >
                          <ProtectedImage
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                            loading="lazy"
                            withWatermark={true}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1">
                            <span>{article.icon}</span>
                            <span>{article.categoryLabel}</span>
                          </span>
                          {article.badge && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                              {article.badge}
                            </span>
                          )}
                          {!isPremium && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                              <Lock className="w-2.5 h-2.5" /> {tr('library.premiumBadge', '100% Payant')}
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
                          <Clock className="w-3 h-3" />
                          {article.readingTime}
                        </span>
                      </div>

                      <h3
                        onClick={() => handleOpenArticle(article)}
                        className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug cursor-pointer"
                      >
                        {article.title}
                      </h3>

                      <p
                        onClick={() => handleOpenArticle(article)}
                        className="text-xs text-slate-600 line-clamp-2 leading-relaxed cursor-pointer"
                      >
                        {article.summary}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 2).map((tag, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Admin Direct Action Buttons on Card */}
                        {showAdminControls && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingImageTarget({
                                  type: 'article',
                                  id: article.id,
                                  currentUrl: article.image,
                                  title: article.title,
                                });
                              }}
                              className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-indigo-200 cursor-pointer"
                              title="Modifier l'image de cet article"
                            >
                              <ImageIcon className="w-3 h-3" />
                              <span>📷 Photo</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingArticle(article);
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Modifier tout le texte de cet article"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>✏️ Modifier</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget({
                                  id: article.id,
                                  title: article.title,
                                  type: 'article',
                                });
                              }}
                              className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer transition-colors"
                              title="Supprimer l'article de la bibliothèque"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenArticle(article)}
                          className="flex items-center gap-0.5 cursor-pointer text-indigo-600 hover:text-indigo-800"
                        >
                          <span>{isPremium ? t('library.readArticle') : 'Lire 🔒'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Exercises */}
          {activeTab === 'exercises' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t('library.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-indigo-500"
                  />
                </div>

                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-indigo-500 cursor-pointer"
                >
                  <option value="all">{t('library.allLevels')}</option>
                  <option value="decouverte">Découverte</option>
                  <option value="confiance">Confiance</option>
                  <option value="autonomie">Autonomie</option>
                  <option value="exploration">Exploration</option>
                </select>

                {showAdminControls && (
                  <button
                    onClick={() => setIsCreatingExercise(true)}
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-sky-600/20 cursor-pointer transition-all hover:scale-102 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Nouvel Exercice</span>
                  </button>
                )}
              </div>

              {/* Grid of Exercises */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredExercises.map((exo) => (
                  <div
                    key={exo.id}
                    className="bg-white p-5 rounded-3xl border border-slate-100 shadow-xs hover:border-indigo-200 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                  >
                    <div className="space-y-3">
                      {/* Photo Thumbnail if present */}
                      {exo.image && (
                        <div
                          onClick={() => handleOpenExercise(exo)}
                          className="relative w-full h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 cursor-pointer shrink-0"
                        >
                          <ProtectedImage
                            src={exo.image}
                            alt={exo.title}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                            loading="lazy"
                            withWatermark={true}
                          />
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100 capitalize">
                          {exo.level} • {exo.recommendedAge}
                        </span>
                        {!isPremium && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Fiche Abonné
                          </span>
                        )}
                      </div>

                      <h3
                        onClick={() => handleOpenExercise(exo)}
                        className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug cursor-pointer"
                      >
                        {exo.title}
                      </h3>

                      <p
                        onClick={() => handleOpenExercise(exo)}
                        className="text-xs text-slate-600 line-clamp-2 leading-relaxed cursor-pointer"
                      >
                        {exo.objective}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600">
                      <span className="text-[11px] text-slate-400 font-normal">
                        ⏱️ {exo.duration}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* Admin Action Buttons on Exercise */}
                        {showAdminControls && (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingImageTarget({
                                  type: 'exercise',
                                  id: exo.id,
                                  currentUrl: exo.image,
                                  title: exo.title,
                                });
                              }}
                              className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-900 rounded-lg text-[10px] font-bold flex items-center gap-1 border border-sky-200 cursor-pointer"
                              title="Modifier la photo"
                            >
                              <ImageIcon className="w-3 h-3" />
                              <span>📷 Photo</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingExercise(exo);
                              }}
                              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer shadow-2xs"
                              title="Modifier l'exercice"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>✏️ Modifier</span>
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget({
                                  id: exo.id,
                                  title: exo.title,
                                  type: 'exercice',
                                });
                              }}
                              className="p-1.5 text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer transition-colors"
                              title="Supprimer l'exercice de la bibliothèque"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleOpenExercise(exo)}
                          className="flex items-center gap-0.5 cursor-pointer text-indigo-600 hover:text-indigo-800 font-bold"
                        >
                          <span>{isPremium ? t('library.viewExercise') : 'Voir 🔒'}</span>
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Skills Matrix */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <SkillsMatrixGrid
                categories={skillCategories}
                allExercises={exercises}
                allArticles={articles}
                currentUser={currentUser}
                onSelectExercise={handleOpenExercise}
                onSelectArticle={handleOpenArticle}
                onSelectSkill={(skill) => {
                  if (skill.relatedExerciseId) {
                    const found = exercises.find((e) => e.id === skill.relatedExerciseId);
                    if (found) {
                      handleOpenExercise(found);
                    }
                  }
                }}
              />
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmationModal
          isOpen={Boolean(deleteTarget)}
          title={deleteTarget.title}
          itemType={deleteTarget.type}
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* Action Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}

      {/* Exercise Detail Modal */}
      {selectedExercise && (
        <ExerciseDetailModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}

      {/* Locked Feature Modal */}
      {lockedModalInfo.isOpen && (
        <LockedFeatureModal
          isOpen={lockedModalInfo.isOpen}
          title={lockedModalInfo.title}
          message={lockedModalInfo.message}
          onClose={() => setLockedModalInfo({ isOpen: false })}
          onOpenCheckout={() => {
            setLockedModalInfo({ isOpen: false });
            onOpenCheckout();
          }}
          onUnlock={() => {
            setLockedModalInfo({ isOpen: false });
            onOpenCheckout();
          }}
        />
      )}
    </div>
  );
};
