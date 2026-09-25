import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowLeft, 
  Heart, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Zap, 
  Share2, 
  Bookmark, 
  ThumbsUp, 
  Award, 
  HelpCircle, 
  Smile, 
  Compass, 
  MessageSquareQuote,
  ChevronDown,
  ChevronUp,
  Check,
  RotateCcw,
  Edit2,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PedagogicalArticle } from '../types';
import { ProtectedImage } from './ProtectedMedia';
import { useTranslation } from '../i18n/LanguageContext';
import { getLocalizedArticle } from '../data/articlesDatabase';
import { articleService } from '../services/articleService';
import { ImmersionSequenceInfographic } from './ImmersionSequenceInfographic';
import { useAdminMode } from '../context/AdminModeContext';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

interface ArticleDetailModalProps {
  article: PedagogicalArticle | null;
  onClose: () => void;
}

// Generate contextual mini-quiz based on article ID
const getQuizForArticle = (articleId: string) => {
  switch (articleId) {
    case 'eveil-aquatique-decouverte-eau':
      return {
        question: "Quel est l'objectif premier de l'éveil aquatique chez le tout-petit ?",
        options: [
          { text: "Lui apprendre à nager le crawl ou la brasse le plus vite possible", correct: false, explain: "La technique codifiée n'intervient que vers 6 ans !" },
          { text: "Découvrir l'eau en confiance avec son parent et construire ses appuis par le jeu", correct: true, explain: "Exactement ! L'éveil repose sur la relation, le plaisir partagé et l'expérimentation libre." },
          { text: "Le rendre immédiatement autonome sans aucune aide de l'adulte", correct: false, explain: "La présence et l'étayage sécurisant du parent sont indispensables." }
        ]
      };
    case 'first-immersion':
    case 'first-immersion-milestone':
      return {
        question: "Comment doit être effectuée la première immersion du bébé ?",
        options: [
          { text: "De manière douce, continue et franche (7 secondes) face au parent, axe tête-tronc aligné", correct: true, explain: "Bravo ! Descente verticale continue sans à-coups ni hésitation, remontée portée par la poussée d'Archimède." },
          { text: "En le lançant délicatement dans l'eau pour stimuler son réflexe", correct: false, explain: "Jamais de lancer ni d'hésitation brutale !" },
          { text: "En l'allongeant sur le ventre sous l'eau", correct: false, explain: "On privilégie le maintien vertical face au parent." }
        ]
      };
    case 'dorsal-float-evolution-boat-game':
      return {
        question: "Pourquoi le bébé peut-il chercher à relever la tête en position dorsale ?",
        options: [
          { text: "C'est une réaction tonique normale d'observation visuelle et de recherche de repères", correct: true, explain: "Parfait ! Relever la tête est un réflexe sain de contrôle de l'environnement." },
          { text: "Parce qu'il refuse l'eau et ne flottera jamais", correct: false, explain: "C'est une étape tout à fait normale de son développement moteur !" }
        ]
      };
    case 'water-temperature-baby-swimming':
      return {
        question: "À quelle température idéale doit être l'eau pour un bébé de moins de 12 mois ?",
        options: [
          { text: "Entre 26°C et 28°C", correct: false, explain: "Trop froide ! Le bébé se refroidit très vite." },
          { text: "Entre 31°C et 33°C", correct: true, explain: "Exactement ! Une eau chaude à 32°C garantit détente musculaire et confort optimal." },
          { text: "Au moins 38°C", correct: false, explain: "Trop chaud, risque de déshydratation." }
        ]
      };
    case 'not-a-swimming-lesson-7-commandments':
      return {
        question: "Les réflexes archaïques (apnée, pédalage) sont-ils une garantie de savoir nager ou de sécurité ?",
        options: [
          { text: "Oui, tous les bébés savent nager d'instinct et se sauvent seuls", correct: false, explain: "Idée reçue dangereuse ! Un réflexe inné est involontaire et s'estompe vers 4-5 mois." },
          { text: "Non, un réflexe automatique n'est pas de la nage volontaire : la surveillance active reste indispensable", correct: true, explain: "Bravo ! Réflexes ≠ Savoir nager ≠ Savoir se sauver. La sécurité repose toujours sur le parent à portée de bras." },
          { text: "Oui, il suffit de lâcher le bébé pour stimuler sa survie", correct: false, explain: "À bannir absolument : ne jamais tester ni forcer un enfant par surprise !" }
        ]
      };
    case 'les-5-sens-bebe-eau':
      return {
        question: "Comment les sens du bébé fonctionnent-ils lorsqu'il explore le milieu aquatique ?",
        options: [
          { text: "Ils travaillent ensemble de façon combinée pour enrichir son expérience corporelle et spatiale", correct: true, explain: "Exactement ! Le cerveau du bébé intègre et associe simultanément les sensations tactiles, visuelles, auditives, olfactives et gustatives." },
          { text: "Chaque sens fonctionne de manière complètement isolée sans aucun lien", correct: false, explain: "Non, les 5 sens sont en interaction permanente et s'enrichissent mutuellement dans l'eau." },
          { text: "Le bébé n'utilise que la vue et ignore totalement les sensations tactiles de l'eau", correct: false, explain: "Au contraire, le toucher avec tout son corps est l'un des sens les plus intensément stimulés en immersion !" }
        ]
      };
    default:
      return {
        question: "Quelle est la règle d'or pour accompagner bébé dans l'eau ?",
        options: [
          { text: "Observer ses signaux émotionnels et respecter son rythme sans forcer", correct: true, explain: "Génial ! Un bébé écouté et rassuré progresse avec joie." },
          { text: "Lui imposer des exercices stricts chronométrés", correct: false, explain: "Le jeu et la bienveillance priment toujours." }
        ]
      };
  }
};

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article: initialArticle,
  onClose,
}) => {
  const { t, locale } = useTranslation();
  const rawArticle = initialArticle
    ? (articleService.getArticleById(initialArticle.id, locale) || getLocalizedArticle(initialArticle.id, locale) || initialArticle)
    : null;
  const article = rawArticle
    ? {
        ...rawArticle,
        image: initialArticle?.image || rawArticle.image,
        imageCaption: initialArticle?.imageCaption || rawArticle.imageCaption,
      }
    : null;
  const { isAdminModeActive, setEditingArticle, handleDeleteArticle } = useAdminMode();
  const [viewMode, setViewMode] = useState<'flash' | 'fluid'>('flash');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [readProgress, setReadProgress] = useState<number>(0);
  const [completedSections, setCompletedSections] = useState<Record<number, boolean>>({});
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [reactions, setReactions] = useState<{ reassuring: number; lightbulb: number; excited: number; loved: number }>({
    reassuring: 14,
    lightbulb: 28,
    excited: 19,
    loved: 42,
  });
  const [userReacted, setUserReacted] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copiedNotification, setCopiedNotification] = useState<boolean>(false);
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const isFirstImmersion = article ? (article.id === 'first-immersion' || article.id === 'first-immersion-milestone' || Boolean(article.timelineSteps)) : false;
  const quiz = article ? getQuizForArticle(article.id) : getQuizForArticle('');

  // Reset state when article changes
  useEffect(() => {
    setIsQuizSubmitted(false);
    setSelectedQuizOption(null);
    setReadProgress(0);
    setUserReacted(null);
    setExpandedSections({ 0: true, 1: true });
    if ('speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {
        // ignore
      }
    }
    setIsSpeaking(false);
  }, [article?.id, locale]);

  // Audio Speech Synthesis handler
  const handleToggleAudio = () => {
    try {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }

      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        window.speechSynthesis.cancel();
        const takeawaysText = (article?.content?.takeaways || []).slice(0, 3).join('. ');
        const textToSpeak = `${article?.title || ''}. ${t('common.summary') || 'Résumé'} : ${article?.summary || ''}. ${takeawaysText ? `${t('library.keyPoints') || 'Points clés'} : ${takeawaysText}` : ''}`;
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        const langMap: Record<string, string> = {
          en: 'en-US',
          es: 'es-ES',
          de: 'de-DE',
          pt: 'pt-PT',
          'pt-BR': 'pt-BR',
          zh: 'zh-CN',
          'zh-CN': 'zh-CN',
          ja: 'ja-JP',
          fr: 'fr-FR',
        };
        const baseLocale = locale.split('-')[0];
        utterance.lang = langMap[locale] || langMap[baseLocale] || 'fr-FR';
        utterance.rate = 1.0;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      setIsSpeaking(false);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {
        // ignore
      }
    };
  }, []);

  // Track scroll progress
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const totalScroll = scrollHeight - clientHeight;
      if (totalScroll > 0) {
        const currentProgress = Math.min(100, Math.round((scrollTop / totalScroll) * 100));
        setReadProgress(currentProgress);
      }
    }
  };

  const toggleSection = (idx: number) => {
    setExpandedSections(prev => ({ ...prev, [idx]: !prev[idx] }));
    setCompletedSections(prev => ({ ...prev, [idx]: true }));
  };

  const handleReaction = (type: 'reassuring' | 'lightbulb' | 'excited' | 'loved') => {
    if (userReacted === type) {
      setReactions(prev => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
      setUserReacted(null);
    } else {
      setReactions(prev => {
        const next = { ...prev };
        if (userReacted) {
          next[userReacted as keyof typeof next] = Math.max(0, next[userReacted as keyof typeof next] - 1);
        }
        next[type] += 1;
        return next;
      });
      setUserReacted(type);
    }
  };

  const handleShareQuote = (text: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(`« ${text} » — Source : Baby Swim Vision (${article?.title || ''})`).then(() => {
          setCopiedNotification(true);
          setTimeout(() => setCopiedNotification(false), 2500);
        }).catch(() => {
          // fallback
          setCopiedNotification(true);
          setTimeout(() => setCopiedNotification(false), 2500);
        });
      } else {
        setCopiedNotification(true);
        setTimeout(() => setCopiedNotification(false), 2500);
      }
    } catch (e) {
      console.warn('Share quote error:', e);
    }
  };

  if (!article) return null;

  // Safe sections fallback
  const sections = article.content?.sections && article.content.sections.length > 0
    ? article.content.sections
    : [
        {
          title: article.title,
          paragraphs: [article.summary],
          keyPoints: article.tags || []
        }
      ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto animate-fade-in">
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="bg-white w-full max-w-4xl rounded-2xl sm:rounded-3xl max-h-[92vh] overflow-y-auto shadow-2xl relative my-auto border border-slate-100 flex flex-col"
      >
        {/* Sticky Dynamic Top Header & Progress Bar */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 sm:px-6 py-3.5 shadow-2xs">
          <div className="flex items-center justify-between gap-3">
            {/* Category & Title */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl shrink-0">{article.icon}</span>
              <div className="min-w-0">
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100 uppercase tracking-wider hidden sm:inline-block">
                  {article.categoryLabel}
                </span>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">
                  {article.title}
                </h3>
              </div>
            </div>

            {/* Reading Mode Pill Toggle & Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Flash / Fluid Switcher */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/80 text-xs">
                <button
                  onClick={() => setViewMode('flash')}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer text-[11px] ${
                    viewMode === 'flash'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Lecture Flash & Cartes interactives"
                >
                  <Zap className="w-3 h-3" />
                  <span>Flash</span>
                </button>
                <button
                  onClick={() => setViewMode('fluid')}
                  className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition-all cursor-pointer text-[11px] ${
                    viewMode === 'fluid'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="Lecture fluide complète aérée"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Détaillé</span>
                </button>
              </div>

              {/* Audio Listen Button */}
              <button
                onClick={handleToggleAudio}
                className={`p-1.5 sm:px-2.5 sm:py-1 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer border ${
                  isSpeaking
                    ? 'bg-sky-500 text-white border-sky-600 animate-pulse shadow-xs'
                    : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                }`}
                title={isSpeaking ? "Arrêter l'audio" : "Écouter le résumé audio"}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span className="hidden md:inline">{isSpeaking ? 'Pause' : 'Écouter'}</span>
              </button>

              {/* Bookmark Save */}
              <button
                onClick={() => setIsSaved(!isSaved)}
                className={`p-1.5 rounded-xl transition-all cursor-pointer border ${
                  isSaved
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border-slate-200'
                }`}
                title="Enregistrer dans mes favoris"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-amber-600 text-amber-600' : ''}`} />
              </button>

              {/* Admin Direct Controls if in Admin Mode */}
              {isAdminModeActive && (
                <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingArticle(article);
                      onClose();
                    }}
                    className="p-1 text-indigo-700 hover:bg-indigo-100 rounded-lg cursor-pointer transition-colors"
                    title="Modifier cet article en direct"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDeleting(true)}
                    className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg cursor-pointer transition-colors"
                    title="Supprimer cet article"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Close Modal */}
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reading Progress Indicator Bar */}
          <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-sky-400 via-indigo-500 to-emerald-400"
              style={{ width: `${Math.max(8, readProgress)}%` }}
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-8 space-y-6">
          {/* Hero Header Card */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 p-6 sm:p-8 text-white shadow-xl">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-black uppercase tracking-wider border border-white/20">
                  {article.badge || "Pédagogie & Éveil"}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-400/20 text-sky-200 text-xs font-semibold flex items-center gap-1 border border-sky-300/20">
                  <Clock className="w-3 h-3" />
                  {article.readingTime} {t('library.readingTime')}
                </span>
                {article.author && (
                  <span className="text-slate-300 text-xs hidden sm:inline-block">
                    • Par {article.author}
                  </span>
                )}
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
                {article.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed max-w-2xl">
                {article.summary}
              </p>

              {/* Tags Cloud */}
              {article.tags && article.tags.length > 0 && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {article.tags.map((tag, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="px-2 py-0.5 rounded-md bg-white/10 text-white/90 text-[10px] sm:text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Article Image Miniature if present */}
          {article.image && (
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-xs">
              <div className="relative w-48 sm:w-60 aspect-[3/2] rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-slate-200 shadow-xs">
                <ProtectedImage
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover object-center"
                  withWatermark={true}
                />
              </div>
              <div className="space-y-1.5 text-left flex-1 py-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full inline-block">
                  {t('library.imageMiniatureBadge', { defaultValue: 'Miniature illustrative' })}
                </span>
                {article.imageCaption ? (
                  <p className="text-xs sm:text-sm text-slate-700 font-medium italic leading-relaxed">
                    « {article.imageCaption} »
                  </p>
                ) : (
                  <p className="text-xs text-slate-500 italic">
                    {article.title}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Copy Quote Toast Feedback */}
          {copiedNotification && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <Check className="w-4 h-4" />
              <span>Citation copiée dans le presse-papier ! Prête à être partagée ✨</span>
            </motion.div>
          )}

          {/* Intro Box */}
          {article.content?.introduction && (
            <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-50 to-indigo-50/80 border border-sky-200/80 rounded-2xl sm:rounded-3xl text-slate-800 text-xs sm:text-sm leading-relaxed font-medium shadow-xs relative">
              <div className="flex items-start gap-3">
                <span className="p-2 rounded-xl bg-sky-500 text-white shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div className="space-y-2">
                  <span className="text-[11px] font-black uppercase tracking-wider text-sky-800 block">
                    Introduction & Contexte
                  </span>
                  <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                    {article.content.introduction}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Specific Visual Infographic if present */}
          {isFirstImmersion && (
            <ImmersionSequenceInfographic />
          )}

          {/* Interactive Mode Content Switcher */}
          {viewMode === 'flash' ? (
            /* ================= FLASH BENTO MODE ================= */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Mode Flash : L'Essentiel en Cartes Interactives
                </h3>
                <span className="text-[11px] text-slate-500">
                  Cliquez sur une carte pour explorer
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                {sections.map((section, idx) => {
                  const isExpanded = Boolean(expandedSections[idx]);
                  const isDone = Boolean(completedSections[idx]);
                  const paragraphs = section.paragraphs || [];
                  const firstParagraph = paragraphs[0] || '';
                  const remainingParagraphs = paragraphs.slice(1);

                  return (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => toggleSection(idx)}
                      className={`p-4 sm:p-5 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                        isExpanded
                          ? 'bg-gradient-to-br from-white to-indigo-50/40 border-indigo-300 shadow-md ring-2 ring-indigo-500/10'
                          : 'bg-white hover:bg-slate-50/80 border-slate-200/80 shadow-2xs hover:shadow-xs'
                      }`}
                    >
                      {/* Top Bar of Card */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                            {section.title}
                          </h4>
                        </div>
                        <div className="p-1 rounded-lg bg-slate-100 group-hover:bg-indigo-100 text-slate-500 group-hover:text-indigo-600 transition-colors">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </div>
                      </div>

                      {/* Content preview or full */}
                      <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                        <p className={isExpanded ? '' : 'line-clamp-2'}>
                          {firstParagraph}
                        </p>

                        {isExpanded && remainingParagraphs.map((p, pIdx) => (
                          <p key={pIdx} className="text-slate-600">{p}</p>
                        ))}
                      </div>

                      {/* Key points tags */}
                      {section.keyPoints && section.keyPoints.length > 0 && (
                        <div className="pt-2 border-t border-slate-100">
                          <div className="space-y-1.5">
                            {(section.keyPoints || []).map((kp, kpIdx) => (
                              <div key={kpIdx} className="flex items-start gap-1.5 text-[11px] font-medium text-slate-700 bg-slate-50 p-2 rounded-xl border border-slate-100">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{kp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Warning box if any */}
                      {section.warning && (
                        <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-1.5 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                          <span>{section.warning}</span>
                        </div>
                      )}

                      {/* Bottom status chip */}
                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                        <span>{isExpanded ? "Cliquez pour replier" : "Cliquez pour dérouler"}</span>
                        {isDone && (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <Check className="w-3 h-3" /> Lu
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ================= FLUID IMMERSION MODE ================= */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  Lecture Détaillée et Aérée
                </h3>
              </div>

              <div className="space-y-6">
                {sections.map((section, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shadow-xs">
                        {idx + 1}
                      </div>
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                        {section.title}
                      </h3>
                    </div>

                    <div className="space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {(section.paragraphs || []).map((p, pIdx) => (
                        <p key={pIdx} className="leading-relaxed font-normal">{p}</p>
                      ))}
                    </div>

                    {/* Key points in fluid mode */}
                    {section.keyPoints && section.keyPoints.length > 0 && (
                      <div className="bg-sky-50/60 p-4 rounded-2xl border border-sky-100 space-y-2">
                        <span className="text-[11px] font-black text-sky-900 uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
                          Repères d'application
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-700">
                          {(section.keyPoints || []).map((kp, kpIdx) => (
                            <li key={kpIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5" />
                              <span>{kp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {section.warning && (
                      <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2 font-medium">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span>{section.warning}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Inspirational Golden Quote Card */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-50 via-sky-50 to-indigo-50 border-2 border-amber-200/80 rounded-2xl sm:rounded-3xl shadow-xs relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-2xl bg-amber-500 text-white shrink-0 shadow-sm mt-0.5">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 block">
                    La pensée clé à retenir
                  </span>
                  <p className="text-xs sm:text-sm font-black text-slate-900 italic leading-snug">
                    « Avant d’apprendre à nager, l’enfant apprend d’abord à être dans l’eau et à y prendre confiance avec son parent. »
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleShareQuote("Avant d’apprendre à nager, l’enfant apprend d’abord à être dans l’eau et à y prendre confiance avec son parent.")}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-amber-100/50 text-amber-900 text-xs font-bold transition-all border border-amber-200 shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer self-end sm:self-center"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Partager cette pensée</span>
              </button>
            </div>
          </div>

          {/* Takeaways Section */}
          {article.content?.takeaways && article.content.takeaways.length > 0 && (
            <div className="p-5 sm:p-6 bg-gradient-to-br from-indigo-950 to-slate-900 text-white rounded-2xl sm:rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <h4 className="text-xs sm:text-sm font-black text-sky-200 uppercase tracking-wider">
                  {t('library.takeawaysTitle')}
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {article.content.takeaways.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 bg-white/10 backdrop-blur-xs p-3 rounded-2xl border border-white/10 text-xs text-slate-100">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5 border border-emerald-400/30">
                      ✓
                    </span>
                    <span className="leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Mini-Quiz Express */}
          <div className="p-5 sm:p-6 bg-white rounded-2xl sm:rounded-3xl border-2 border-indigo-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-xl bg-indigo-100 text-indigo-700">
                  <HelpCircle className="w-4 h-4" />
                </span>
                <h4 className="text-xs sm:text-sm font-black text-indigo-950 uppercase tracking-wider">
                  Mini-Quiz Express : Testez votre regard !
                </h4>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                1 question ludique
              </span>
            </div>

            <p className="text-xs sm:text-sm font-bold text-slate-800">
              {quiz.question}
            </p>

            <div className="space-y-2">
              {quiz.options.map((opt, oIdx) => {
                const isSelected = selectedQuizOption === oIdx;
                let btnStyle = "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700";

                if (isQuizSubmitted) {
                  if (opt.correct) {
                    btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-950 ring-2 ring-emerald-400/20";
                  } else if (isSelected && !opt.correct) {
                    btnStyle = "bg-rose-50 border-rose-400 text-rose-950";
                  }
                } else if (isSelected) {
                  btnStyle = "bg-indigo-50 border-indigo-400 text-indigo-950 ring-2 ring-indigo-400/20";
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => {
                      if (!isQuizSubmitted) {
                        setSelectedQuizOption(oIdx);
                      }
                    }}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2.5 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white border border-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <div className="space-y-1">
                      <span>{opt.text}</span>
                      {isQuizSubmitted && (
                        <p className={`text-[11px] font-bold ${opt.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {opt.explain}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quiz Submit Action */}
            <div className="flex items-center justify-between pt-1">
              {!isQuizSubmitted ? (
                <button
                  onClick={() => {
                    if (selectedQuizOption !== null) {
                      setIsQuizSubmitted(true);
                    }
                  }}
                  disabled={selectedQuizOption === null}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  Vérifier ma réponse
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsQuizSubmitted(false);
                    setSelectedQuizOption(null);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Recommencer</span>
                </button>
              )}
            </div>
          </div>

          {/* Interactive Reactions Bar */}
          <div className="p-4 sm:p-5 bg-slate-50 border border-slate-200/80 rounded-2xl sm:rounded-3xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
                Votre ressenti après cette lecture :
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Cliquez pour réagir
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => handleReaction('loved')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  userReacted === 'loved'
                    ? 'bg-rose-50 border-rose-300 text-rose-700 scale-102 shadow-2xs'
                    : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-700'
                }`}
              >
                <span>💖</span>
                <span>Très touchant</span>
                <span className="text-[10px] text-slate-400 font-normal">({reactions.loved})</span>
              </button>

              <button
                onClick={() => handleReaction('reassuring')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  userReacted === 'reassuring'
                    ? 'bg-sky-50 border-sky-300 text-sky-700 scale-102 shadow-2xs'
                    : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-700'
                }`}
              >
                <span>🛡️</span>
                <span>Rassurant</span>
                <span className="text-[10px] text-slate-400 font-normal">({reactions.reassuring})</span>
              </button>

              <button
                onClick={() => handleReaction('lightbulb')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  userReacted === 'lightbulb'
                    ? 'bg-amber-50 border-amber-300 text-amber-700 scale-102 shadow-2xs'
                    : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-700'
                }`}
              >
                <span>💡</span>
                <span>Vrai déclic</span>
                <span className="text-[10px] text-slate-400 font-normal">({reactions.lightbulb})</span>
              </button>

              <button
                onClick={() => handleReaction('excited')}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  userReacted === 'excited'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700 scale-102 shadow-2xs'
                    : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-700'
                }`}
              >
                <span>🌊</span>
                <span>Hâte de tester</span>
                <span className="text-[10px] text-slate-400 font-normal">({reactions.excited})</span>
              </button>
            </div>
          </div>

          {/* Sources */}
          {article.content?.sources && article.content.sources.length > 0 && (
            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <span className="font-semibold block">{t('library.sourcesTitle')} :</span>
              <ul className="list-disc list-inside space-y-0.5 pl-1 text-[11px]">
                {article.content.sources.map((src, idx) => (
                  <li key={idx}>{src}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Footer Back Button */}
          <div className="pt-2 flex justify-between items-center">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('library.backToArticles')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal for Article */}
      {isDeleting && (
        <DeleteConfirmationModal
          isOpen={isDeleting}
          title={article.title}
          itemType="article"
          onConfirm={() => {
            handleDeleteArticle(article.id);
            setIsDeleting(false);
            onClose();
          }}
          onCancel={() => setIsDeleting(false)}
        />
      )}
    </div>
  );
};
