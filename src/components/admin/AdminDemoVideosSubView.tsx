import React, { useState, useEffect } from 'react';
import {
  Video,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  RefreshCw,
  Play,
  Film,
  Sparkles,
} from 'lucide-react';
import { useAdminMode } from '../../context/AdminModeContext';
import { demoVideoService } from '../../services/demoVideoService';
import { DemoVideoItem } from '../../types';

interface AdminDemoVideosSubViewProps {
  onBack: () => void;
  showFeedback: (msg: string) => void;
}

export const AdminDemoVideosSubView: React.FC<AdminDemoVideosSubViewProps> = ({ onBack, showFeedback }) => {
  const { setEditingDemoVideo, setIsCreatingDemoVideo, handleDeleteDemoVideo } = useAdminMode();
  const [videos, setVideos] = useState<DemoVideoItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadVideos = async () => {
    setLoading(true);
    const data = await demoVideoService.getDemoVideos();
    setVideos(data);
    setLoading(false);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= videos.length) return;
    const copy = [...videos];
    const temp = copy[index];
    copy[index] = copy[target];
    copy[target] = temp;
    const orderedIds = copy.map((v) => v.id);

    try {
      await demoVideoService.reorderDemoVideos(orderedIds);
      setVideos(copy);
      showFeedback("Ordre d'affichage mis à jour avec succès");
    } catch {
      alert("Erreur lors de l'enregistrement de l'ordre");
    }
  };

  const handleToggleVisibility = async (video: DemoVideoItem) => {
    try {
      const isVisible = video.visible !== false;
      await demoVideoService.saveDemoVideo({
        ...video,
        visible: !isVisible,
      });
      showFeedback(!isVisible ? 'Vidéo affichée dans l’application' : 'Vidéo masquée');
      loadVideos();
    } catch {
      alert('Erreur lors du changement de visibilité');
    }
  };

  const handleDelete = async (video: DemoVideoItem) => {
    if (window.confirm(`Supprimer définitivement la vidéo "${video.title}" ?`)) {
      const ok = await handleDeleteDemoVideo(video.id);
      if (ok) {
        showFeedback('Vidéo supprimée définitivement');
        loadVideos();
      }
    }
  };

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
            <span className="text-xs font-semibold text-slate-900">Vidéos de démonstration</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Video className="w-5 h-5 text-rose-600" />
            Gestion des Vidéos de Démonstration
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ajouter, réordonner, masquer ou modifier les vidéos pédagogiques visibles par les familles.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadVideos}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button
            onClick={() => setIsCreatingDemoVideo(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Ajouter une vidéo
          </button>
        </div>
      </div>

      {/* Videos List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-rose-500" />
            Chargement des vidéos...
          </div>
        ) : videos.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Aucune vidéo de démonstration configurée.
          </div>
        ) : (
          videos.map((vid, idx) => {
            const isVisible = vid.visible !== false;
            return (
              <div
                key={vid.id}
                className={`p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                  isVisible ? 'hover:bg-slate-50/60' : 'bg-slate-50/80 opacity-70'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  <div className="relative w-28 h-20 bg-slate-900 rounded-xl overflow-hidden shrink-0 border border-slate-200 group">
                    {vid.thumbnailUrl ? (
                      <img src={vid.thumbnailUrl} alt={vid.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-600">
                        <Film className="w-6 h-6" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white/90" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400 font-bold">#{idx + 1}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-800 border border-rose-100">
                        {vid.category || 'Démonstration'}
                      </span>
                      {!isVisible && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                          Masquée
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm">{vid.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">{vid.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                    title="Monter"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === videos.length - 1}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                    title="Descendre"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleVisibility(vid)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                    title={isVisible ? 'Masquer' : 'Afficher'}
                  >
                    {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setEditingDemoVideo(vid)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(vid)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
