import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Lightbulb,
  BookOpen,
  Dumbbell,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Layers,
  Calendar,
  Waves,
  Smile,
  HeartHandshake,
  Eye,
  Anchor,
  HelpCircle,
} from 'lucide-react';
import { SkillCategory, SkillItem, ExerciseItem, PedagogicalArticle, User } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { getLocalizedSkillCategories } from '../data/pedagogicalDatabase';

interface SkillsMatrixGridProps {
  categories?: SkillCategory[];
  allExercises?: ExerciseItem[];
  allArticles?: PedagogicalArticle[];
  onSelectExercise?: (exercise: ExerciseItem) => void;
  onSelectArticle?: (article: PedagogicalArticle) => void;
  onSelectSkill?: (skill: SkillItem) => void;
  currentUser?: User | null;
}

export const SkillsMatrixGrid: React.FC<SkillsMatrixGridProps> = ({
  categories: propCategories,
  allExercises = [],
  allArticles = [],
  onSelectExercise = () => {},
  onSelectArticle = () => {},
  onSelectSkill = () => {},
}) => {
  const { t, locale } = useTranslation();
  const [viewMode, setViewMode] = useState<'domain' | 'age'>('domain');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [selectedAgeFilter, setSelectedAgeFilter] = useState('all');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('all');
  const [showCommandments, setShowCommandments] = useState(false);

  const categories = useMemo(() => {
    if (propCategories && Array.isArray(propCategories) && propCategories.length > 0) {
      return propCategories;
    }
    return getLocalizedSkillCategories(locale);
  }, [propCategories, locale]);

  // Age brackets definition for the Age View
  const ageBrackets = useMemo(() => [
    {
      id: '0-6',
      label: locale === 'fr' ? '0 à 6 mois' : '0 to 6 months',
      subtitle: locale === 'fr' ? 'Découverte sensorielle & Bains doux' : 'Sensory discovery & Gentle baths',
      color: 'from-cyan-50 to-sky-50 border-sky-100 text-sky-900',
      badgeColor: 'bg-sky-100 text-sky-800',
      description: locale === 'fr'
        ? "Apprivoisement de l'élément aquatique, eau à 32°C, rituels du bain à la maison, arrosages bienveillants du front et contact peau à peau sécurisant."
        : "Getting comfortable in 32°C warm water, home bath rituals, forehead water trickles, and reassuring skin-to-skin contact."
    },
    {
      id: '6-12',
      label: locale === 'fr' ? '6 à 12 mois' : '6 to 12 months',
      subtitle: locale === 'fr' ? 'Équilibre, Flottaison & Premières immersions' : 'Balance, Floating & First submersions',
      color: 'from-indigo-50 to-blue-50 border-indigo-100 text-indigo-900',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      description: locale === 'fr'
        ? "Horizontalité ventrale spontanée, étoile de mer dorsale (oreilles dans l'eau), descente tonique 5s avec remontée passive, sauts assis amortis."
        : "Spontaneous prone horizontality, starfish back float with submerged ears, continuous 5s submersions, and cushioned seated jumps."
    },
    {
      id: '12-24',
      label: locale === 'fr' ? '12 à 24 mois' : '12 to 24 months',
      subtitle: locale === 'fr' ? 'Transition, Marche terrestre & Affirmation' : 'Transition, Walking & Milestone confidence',
      color: 'from-amber-50 to-orange-50 border-amber-100 text-amber-900',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: locale === 'fr'
        ? "Apparition normale de la phase d'hésitation aquatique liée à la marche terrestre (ne jamais forcer), souffle de bulles, coordination bras-jambes."
        : "Normal hesitation stage matching land walking onset (never force), surface bubble blowing, and early arm-leg propulsion coordination."
    },
    {
      id: '24-36',
      label: locale === 'fr' ? '24 à 36 mois+' : '24 to 36 months+',
      subtitle: locale === 'fr' ? 'Autonomie & Nage du « Petit Chien »' : 'Autonomy & Instinctive Doggy Paddle',
      color: 'from-emerald-50 to-teal-50 border-emerald-100 text-emerald-900',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: locale === 'fr'
        ? "Propulsion spontanée du petit chien, déplacements autonomes vers le bord ou un tapis, apnée volontaire et capacité à s'agripper pour se sécuriser."
        : "Spontaneous doggy paddle strokes, independent travel toward poolside or mats, voluntary submersions, and self-rescue edge grabbing."
    }
  ], [locale]);

  // The 7 Core Commandments based on Azémar and modern developmental pedagogy
  const commandments = useMemo(() => [
    {
      num: 1,
      title: locale === 'fr' ? 'Le jeu et le plaisir avant tout' : 'Play and joy first',
      desc: locale === 'fr' ? 'Ce n’est pas un cours de natation d’adulte : la curiosité et l’amusement sont les seuls vrais moteurs de progrès.' : 'Not an adult swimming class: curiosity and playfulness are the true drivers of motor learning.'
    },
    {
      num: 2,
      title: locale === 'fr' ? 'Frite souple plutôt que brassards rigides' : 'Flexible noodle over bulky armbands',
      desc: locale === 'fr' ? 'Les brassards bloquent la motricité de l’axe corporel et créent une fausse verticalité. La frite souple préserve la liberté de posture.' : 'Rigid armbands lock natural spine movements and cause artificial verticality. A flexible noodle preserves postural freedom.'
    },
    {
      num: 3,
      title: locale === 'fr' ? 'Zéro effet de surprise' : 'Zero startle or surprise',
      desc: locale === 'fr' ? 'Annoncez toujours chaque immersion par un rituel clair (souffle doux, compte à 3 ou comptine) pour préparer le réflexe d’apnée.' : 'Always telegraph submersions with a clear ritual cue (gentle breath, 3-count, song) so baby naturally prepares the dive reflex.'
    },
    {
      num: 4,
      title: locale === 'fr' ? 'Dédramatiser la petite tasse avec le sourire' : 'Normalize swallowed water with smiles',
      desc: locale === 'fr' ? 'Une petite gorgée avalée est sans gravité si le parent accueille bébé avec un grand sourire détendu (« tchin-tchin ! »).' : 'Swallowing a small sip is completely harmless if met with warm reassurance and a cheerful smile.'
    },
    {
      num: 5,
      title: locale === 'fr' ? 'Bébé toujours acteur de ses immersions' : 'Baby is always the active participant',
      desc: locale === 'fr' ? 'Ne forcez jamais la tête sous l’eau. Favorisez les immersions choisies pour attraper un jouet ou un miroir flottant.' : 'Never force a head underwater. Foster child-led explorations to retrieve sinking toys or gaze into mirrors.'
    },
    {
      num: 6,
      title: locale === 'fr' ? 'Surveillance active et regard affectif permanent' : 'Active supervision & unbroken eye contact',
      desc: locale === 'fr' ? 'Restez toujours à portée de main immédiate. Votre regard ininterrompu est la première bouée émotionnelle de votre enfant.' : 'Always stay within arm’s reach. Your uninterrupted loving gaze is your child’s emotional anchor.'
    },
    {
      num: 7,
      title: locale === 'fr' ? 'Remonter si l’enfant tourne sur lui-même' : 'Surface if child begins spinning',
      desc: locale === 'fr' ? 'Si l’enfant commence à tournoyer sous l’eau, remontez-le immédiatement et calmement pour lui faire retrouver ses repères visuels.' : 'If baby spins underwater losing visual cues, gently lift them to the surface to help them re-anchor.'
    }
  ], [locale]);

  // Flatten all skills for searching and age-filtering
  const allSkills = useMemo(() => {
    if (!categories || !Array.isArray(categories)) return [];
    return categories.flatMap(cat => {
      if (!cat || !Array.isArray(cat.skills)) return [];
      return cat.skills.map(skill => ({
        ...skill,
        categoryTitle: cat.title || '',
        categoryIcon: cat.icon || '💧',
        categoryBadge: cat.badge || '',
        categoryPrinciple: cat.keyPrinciple || '',
      }));
    });
  }, [categories]);

  // Filter skills based on search and filters
  const filteredSkills = useMemo(() => {
    return allSkills.filter(skill => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        skill.name.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        (skill.keyAdvice && skill.keyAdvice.toLowerCase().includes(q)) ||
        (skill.observationChecklist && skill.observationChecklist.some(c => c.toLowerCase().includes(q))) ||
        skill.categoryTitle.toLowerCase().includes(q);

      const matchesCategory = selectedCategoryFilter === 'all' || skill.categoryId === selectedCategoryFilter;
      const matchesLevel = selectedLevelFilter === 'all' || skill.level === selectedLevelFilter;

      let matchesAge = true;
      if (selectedAgeFilter !== 'all') {
        const skillAge = (skill.ageRange || '').toLowerCase();
        if (selectedAgeFilter === '0-6') {
          matchesAge = skillAge.includes('0') || skillAge.includes('4') || skillAge.includes('6');
        } else if (selectedAgeFilter === '6-12') {
          matchesAge = skillAge.includes('6') || skillAge.includes('8') || skillAge.includes('9') || skillAge.includes('10') || skillAge.includes('12');
        } else if (selectedAgeFilter === '12-24') {
          matchesAge = skillAge.includes('12') || skillAge.includes('18') || skillAge.includes('20') || skillAge.includes('24');
        } else if (selectedAgeFilter === '24-36') {
          matchesAge = skillAge.includes('18') || skillAge.includes('24') || skillAge.includes('36') || skillAge.includes('3 ans');
        }
      }

      return matchesSearch && matchesCategory && matchesLevel && matchesAge;
    });
  }, [allSkills, searchQuery, selectedCategoryFilter, selectedAgeFilter, selectedLevelFilter]);

  // Group filtered skills by Category
  const groupedByCategory = useMemo(() => {
    const map = new Map<string, typeof allSkills>();
    categories.forEach(cat => {
      const skillsInCat = filteredSkills.filter(s => s.categoryId === cat.id);
      if (skillsInCat.length > 0) {
        map.set(cat.id, skillsInCat);
      }
    });
    return map;
  }, [categories, filteredSkills]);

  // Group filtered skills by Age Bracket
  const groupedByAge = useMemo(() => {
    return ageBrackets.map(bracket => {
      const skillsInBracket = filteredSkills.filter(skill => {
        const age = (skill.ageRange || '').toLowerCase();
        if (bracket.id === '0-6') return age.includes('0') || age.includes('4') || age.includes('6 mois') || age.includes('0 - 6');
        if (bracket.id === '6-12') return age.includes('4 - 12') || age.includes('6 - 18') || age.includes('4 - 18') || age.includes('6 - 24') || age.includes('4 - 20');
        if (bracket.id === '12-24') return age.includes('10 - 18') || age.includes('12 - 36') || age.includes('6 - 24') || age.includes('12 - 24');
        if (bracket.id === '24-36') return age.includes('18 - 36') || age.includes('9 - 36') || age.includes('12 - 36') || age.includes('tous');
        return true;
      });
      return {
        ...bracket,
        skills: skillsInBracket
      };
    }).filter(b => b.skills.length > 0);
  }, [ageBrackets, filteredSkills]);

  const getLevelBadge = (level?: string) => {
    switch (level) {
      case 'decouverte':
        return <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-md text-[11px] font-bold">Découverte</span>;
      case 'confiance':
        return <span className="px-2 py-0.5 bg-sky-50 text-sky-700 border border-sky-100 rounded-md text-[11px] font-bold">Confiance</span>;
      case 'autonomie':
        return <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-md text-[11px] font-bold">Autonomie</span>;
      default:
        return <span className="px-2 py-0.5 bg-slate-50 text-slate-600 border border-slate-100 rounded-md text-[11px] font-bold">Éveil</span>;
    }
  };

  return (
    <div className="space-y-6" id="skills-matrix-root">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-xs font-semibold text-sky-200">
            <Sparkles className="w-3.5 h-3.5 text-sky-300" />
            <span>{t('skillsGrid.headerTitle') || "Grille de repères d'éveil aquatique (0 à 3 ans)"}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {locale === 'fr'
              ? "Les étapes clés du développement psychomoteur dans l'eau"
              : "Key Psychomotor Milestones in Aquatic Development"}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {t('skillsGrid.headerSubtitle') ||
              "Suivez les étapes clés de votre bébé : adaptation sensorielle, horizontalité ventrale, flottaison dorsale, immersion bienveillante et autonomie du « petit chien »."}
          </p>

          {/* Quick Counter */}
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 font-medium">
              <Layers className="w-4 h-4 text-sky-400" />
              <span><strong>{allSkills.length}</strong> {t('skillsGrid.totalSkills') || "repères pédagogiques"}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 font-medium">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span><strong>0 à 36 mois</strong> {locale === 'fr' ? 'de progression respectueuse' : 'of gentle progress'}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10 font-medium">
              <Waves className="w-4 h-4 text-emerald-400" />
              <span><strong>8 domaines</strong> {locale === 'fr' ? "d'apprentissage" : 'learning domains'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Accordion : The 7 Core Commandments */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setShowCommandments(!showCommandments)}
          className="w-full px-6 py-4.5 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
          id="btn-toggle-commandments"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-600 font-bold shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                {t('skillsGrid.commandmentsTitle') || "Les 7 Principes Fondamentaux du Bébé Nageur"}
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 rounded-full">
                  Méthode Azémar
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                {t('skillsGrid.commandmentsSubtitle') || "Principes de bienveillance, motricité libre et zéro contrainte pour un éveil serein."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="hidden sm:inline">
              {showCommandments ? (t('skillsGrid.commandmentsToggleHide') || 'Masquer') : (t('skillsGrid.commandmentsToggleShow') || 'Afficher')}
            </span>
            {showCommandments ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showCommandments && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-100 bg-slate-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              {commandments.map((cmd) => (
                <div
                  key={cmd.num}
                  className="p-3.5 bg-white rounded-2xl border border-slate-100 shadow-2xs space-y-1.5 flex gap-3 items-start"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {cmd.num}
                  </div>
                  <div className="space-y-0.5 text-xs">
                    <h4 className="font-bold text-slate-800">{cmd.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{cmd.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Controls & Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-100 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* View Mode Toggle */}
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('domain')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'domain'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="tab-view-domain"
            >
              <Layers className="w-4 h-4" />
              <span>{t('skillsGrid.viewByDomain') || "Vue par Domaine"}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('age')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'age'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              id="tab-view-age"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('skillsGrid.viewByAge') || "Vue par Stade d'Âge"}</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('skillsGrid.searchPlaceholder') || "Rechercher un repère, conseil, mot-clé..."}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              id="input-skills-search"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filtres :</span>
          </div>

          {/* Filter Category */}
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            id="select-category-filter"
          >
            <option value="all">{t('skillsGrid.filterCategory') || "Tous les domaines"}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon || '💧'} {cat.title}
              </option>
            ))}
          </select>

          {/* Filter Age */}
          <select
            value={selectedAgeFilter}
            onChange={(e) => setSelectedAgeFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            id="select-age-filter"
          >
            <option value="all">{t('skillsGrid.filterAge') || "Toutes les tranches d'âge"}</option>
            <option value="0-6">{t('skillsGrid.age0to6') || "0 - 6 mois (Découverte)"}</option>
            <option value="6-12">{t('skillsGrid.age6to12') || "6 - 12 mois (Équilibre & Flottaison)"}</option>
            <option value="12-24">{t('skillsGrid.age12to24') || "12 - 24 mois (Transition & Marche)"}</option>
            <option value="24-36">{t('skillsGrid.age24to36') || "24 - 36 mois+ (Autonomie & Petit Chien)"}</option>
          </select>

          {/* Filter Level */}
          <select
            value={selectedLevelFilter}
            onChange={(e) => setSelectedLevelFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            id="select-level-filter"
          >
            <option value="all">{t('library.allLevels') || "Tous les niveaux"}</option>
            <option value="decouverte">Découverte</option>
            <option value="confiance">Confiance</option>
            <option value="autonomie">Autonomie</option>
          </select>

          {(selectedCategoryFilter !== 'all' || selectedAgeFilter !== 'all' || selectedLevelFilter !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategoryFilter('all');
                setSelectedAgeFilter('all');
                setSelectedLevelFilter('all');
                setSearchQuery('');
              }}
              className="text-xs text-indigo-600 font-semibold hover:underline ml-auto"
            >
              Réinitialiser
            </button>
          )}
        </div>
      </div>

      {/* 4. Display Content */}
      {filteredSkills.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-100 text-slate-500 space-y-2">
          <HelpCircle className="w-10 h-10 mx-auto text-slate-300" />
          <p className="font-semibold text-sm">{t('skillsGrid.noResults') || "Aucun repère ne correspond à votre recherche."}</p>
          <p className="text-xs text-slate-400">Essayez de modifier vos filtres ou termes de recherche.</p>
        </div>
      ) : viewMode === 'domain' ? (
        /* MODE: View by Domain */
        <div className="space-y-8" id="skills-list-by-domain">
          {Array.from(groupedByCategory.entries()).map(([catId, skillsList]) => {
            const cat = categories.find(c => c.id === catId);
            if (!cat) return null;

            return (
              <div key={cat.id} className="space-y-4">
                {/* Category Header */}
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shrink-0">
                      {cat.icon || '💧'}
                    </div>
                    <div className="space-y-0.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-base text-slate-900">{cat.title}</h3>
                        {cat.badge && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-bold uppercase tracking-wider">
                            {cat.badge}
                          </span>
                        )}
                        {cat.ageRange && (
                          <span className="px-2 py-0.5 bg-sky-50 text-sky-700 rounded-md text-[11px] font-semibold">
                            {cat.ageRange}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{cat.description}</p>
                      {cat.keyPrinciple && (
                        <p className="text-xs text-indigo-700 font-medium pt-1 flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{cat.keyPrinciple}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 shrink-0 self-end sm:self-auto">
                    {skillsList.length} {skillsList.length > 1 ? 'repères' : 'repère'}
                  </span>
                </div>

                {/* Skills Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {skillsList.map((skill) => (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      allExercises={allExercises}
                      allArticles={allArticles}
                      onSelectExercise={onSelectExercise}
                      onSelectArticle={onSelectArticle}
                      getLevelBadge={getLevelBadge}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* MODE: View by Age Bracket */
        <div className="space-y-8" id="skills-list-by-age">
          {groupedByAge.map((bracket) => (
            <div key={bracket.id} className="space-y-4">
              {/* Bracket Header */}
              <div className={`p-6 rounded-3xl border bg-gradient-to-r ${bracket.color} shadow-xs space-y-2`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Calendar className="w-5 h-5 text-slate-700" />
                    <h3 className="font-bold text-lg text-slate-900">{bracket.label}</h3>
                    <span className="text-xs font-bold text-slate-600">— {bracket.subtitle}</span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${bracket.badgeColor}`}>
                    {bracket.skills.length} {bracket.skills.length > 1 ? 'repères' : 'repère'}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed max-w-3xl">{bracket.description}</p>
              </div>

              {/* Skills Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bracket.skills.map((skill) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    allExercises={allExercises}
                    allArticles={allArticles}
                    onSelectExercise={onSelectExercise}
                    onSelectArticle={onSelectArticle}
                    getLevelBadge={getLevelBadge}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Sub-Component: Individual Skill Card
interface SkillCardProps {
  skill: SkillItem & {
    categoryTitle?: string;
    categoryIcon?: string;
  };
  allExercises: ExerciseItem[];
  allArticles: PedagogicalArticle[];
  onSelectExercise: (exercise: ExerciseItem) => void;
  onSelectArticle: (article: PedagogicalArticle) => void;
  getLevelBadge: (level?: string) => React.ReactNode;
}

const SkillCard: React.FC<SkillCardProps> = ({
  skill,
  allExercises = [],
  allArticles = [],
  onSelectExercise,
  onSelectArticle,
  getLevelBadge,
}) => {
  const { t } = useTranslation();

  const linkedExercise = skill.relatedExerciseId && Array.isArray(allExercises)
    ? allExercises.find((e) => e && e.id === skill.relatedExerciseId)
    : null;

  const linkedArticle = skill.relatedArticleId && Array.isArray(allArticles)
    ? allArticles.find((a) => a && (a.id === skill.relatedArticleId || a.slug === skill.relatedArticleId))
    : null;

  return (
    <div
      className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
      id={`skill-card-${skill.id}`}
    >
      {/* Top Details */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-1.5">
              {getLevelBadge(skill.level)}
              {skill.ageRange && (
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[11px] font-semibold">
                  {skill.ageRange}
                </span>
              )}
            </div>
            <h4 className="font-bold text-sm sm:text-base text-slate-900 pt-0.5 leading-snug">
              {skill.name}
            </h4>
          </div>
          {skill.categoryIcon && (
            <span className="text-xl shrink-0 p-1 bg-slate-50 rounded-xl border border-slate-100">
              {skill.categoryIcon}
            </span>
          )}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {skill.description}
        </p>

        {/* Observation Checklist */}
        {skill.observationChecklist && skill.observationChecklist.length > 0 && (
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 space-y-2">
            <h5 className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-500" />
              <span>{t('skillsGrid.checklistLabel') || "Critères d'observation clés :"}</span>
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {skill.observationChecklist.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Advice & Golden Rule */}
        {skill.keyAdvice && (
          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-2xl space-y-1">
            <h5 className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
              <span>{t('skillsGrid.keyAdviceLabel') || "Conseil & Règle d'or :"}</span>
            </h5>
            <p className="text-xs text-amber-950 leading-relaxed">{skill.keyAdvice}</p>
          </div>
        )}
      </div>

      {/* Action Links (Exercise / Article) */}
      {(linkedExercise || linkedArticle) && (
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          {linkedExercise && (
            <button
              type="button"
              onClick={() => onSelectExercise(linkedExercise)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-colors"
              id={`btn-open-exercise-${skill.id}`}
            >
              <Dumbbell className="w-3.5 h-3.5 text-indigo-600" />
              <span>{t('skillsGrid.relatedExercise') || "Exercice"} : {linkedExercise.title}</span>
            </button>
          )}

          {linkedArticle && (
            <button
              type="button"
              onClick={() => onSelectArticle(linkedArticle)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 rounded-xl text-xs font-bold transition-colors"
              id={`btn-open-article-${skill.id}`}
            >
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>{t('skillsGrid.relatedArticle') || "Article"} : {linkedArticle.title}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
