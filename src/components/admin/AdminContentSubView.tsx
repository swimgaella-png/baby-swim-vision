import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  CheckCircle2,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink,
  Layers,
  Upload,
} from 'lucide-react';
import { useAdminMode } from '../../context/AdminModeContext';
import { articleService } from '../../services/articleService';
import { exerciseService } from '../../services/exerciseService';
import { PedagogicalArticle, ExerciseItem } from '../../types';

interface AdminContentSubViewProps {
  onBack: () => void;
  showFeedback: (msg: string) => void;
}

export const AdminContentSubView: React.FC<AdminContentSubViewProps> = ({ onBack, showFeedback }) => {
  const {
    setEditingArticle,
    setIsCreatingArticle,
    handleDeleteArticle,
    setEditingExercise,
    setIsCreatingExercise,
    handleDeleteExercise,
    setEditingImageTarget,
  } = useAdminMode();

  const [activeTab, setActiveTab] = useState<'articles' | 'exercises'>('articles');
  const [articles, setArticles] = useState<PedagogicalArticle[]>([]);
  const [exercises, setExercises] = useState<ExerciseItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    const [arts, exes] = await Promise.all([
      articleService.getArticles(),
      exerciseService.getExercises(),
    ]);
    setArticles(arts);
    setExercises(exes);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteArt = async (art: PedagogicalArticle) => {
    if (window.confirm(`Supprimer définitivement l'article "${art.title}" ?`)) {
      await handleDeleteArticle(art.id);
      showFeedback('Article supprimé avec succès');
      loadData();
    }
  };

  const handleDeleteExe = async (exe: ExerciseItem) => {
    if (window.confirm(`Supprimer définitivement l'exercice "${exe.title}" ?`)) {
      await handleDeleteExercise(exe.id);
      showFeedback('Exercice supprimé avec succès');
      loadData();
    }
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.summary?.toLowerCase().includes(search.toLowerCase()) ||
      a.categoryLabel?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredExercises = exercises.filter(
    (e) =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.objective?.toLowerCase().includes(search.toLowerCase()) ||
      e.recommendedAge?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
            >
              ← Administration
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-semibold text-slate-900">Gestion du contenu</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            Gestion des Contenus Pédagogiques
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Créer, modifier, illustrer et organiser les articles et exercices de la bibliothèque.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button
            onClick={() => {
              if (activeTab === 'articles') {
                setIsCreatingArticle(true);
              } else {
                setIsCreatingExercise(true);
              }
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'articles' ? 'Nouvel article' : 'Nouvel exercice'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'articles'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Articles Pédagogiques ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'exercises'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Exercices & Séances ({exercises.length})
          </button>
        </div>

        <div className="relative w-64 pr-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par mot-clé..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200/80">
          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
          Chargement des contenus...
        </div>
      ) : activeTab === 'articles' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="relative h-36 bg-slate-100 overflow-hidden group">
                  {art.image ? (
                    <img
                      src={art.image}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <button
                    onClick={() =>
                      setEditingImageTarget({
                        type: 'article',
                        id: art.id,
                        currentUrl: art.image,
                        title: art.title,
                      })
                    }
                    className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-semibold flex items-center gap-1 backdrop-blur-xs transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    Changer l'image
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-800 border border-indigo-100">
                      {art.categoryLabel || art.category}
                    </span>
                    <span className="text-slate-400 font-medium">{art.readingTime || '5 min'}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                    {art.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">
                  {art.publishedDate || 'Publié'}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingArticle(art)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteArt(art)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredExercises.map((exe) => (
            <div
              key={exe.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all"
            >
              <div>
                <div className="relative h-36 bg-slate-100 overflow-hidden group">
                  {exe.image ? (
                    <img
                      src={exe.image}
                      alt={exe.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  <button
                    onClick={() =>
                      setEditingImageTarget({
                        type: 'exercise',
                        id: exe.id,
                        currentUrl: exe.image,
                        title: exe.title,
                      })
                    }
                    className="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-900 text-white text-[11px] font-semibold flex items-center gap-1 backdrop-blur-xs transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                    Changer l'image
                  </button>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className="px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {exe.recommendedAge || 'Tous âges'}
                    </span>
                    <span className="text-slate-400 font-medium">{exe.duration || '5-10 min'}</span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug">
                    {exe.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {exe.objective}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {exe.steps?.length || 0} étape(s)
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditingExercise(exe)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDeleteExe(exe)}
                    className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
