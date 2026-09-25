import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  X,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { adminManagementService, AdminKnowledgeItem } from '../../services/adminManagementService';

interface AdminKnowledgeSubViewProps {
  onBack: () => void;
  showFeedback: (msg: string) => void;
}

export const AdminKnowledgeSubView: React.FC<AdminKnowledgeSubViewProps> = ({ onBack, showFeedback }) => {
  const [items, setItems] = useState<AdminKnowledgeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<AdminKnowledgeItem | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formSituationKey, setFormSituationKey] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formKeyPoints, setFormKeyPoints] = useState('');
  const [formSafetyRules, setFormSafetyRules] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await adminManagementService.fetchKnowledgeBase();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('Pédagogie & Éveil');
    setFormSituationKey('sit_general');
    setFormDesc('');
    setFormKeyPoints('');
    setFormSafetyRules('');
    setIsModalOpen(true);
  };

  const openEdit = (item: AdminKnowledgeItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormSituationKey(item.situationKey || 'sit_general');
    setFormDesc(item.description);
    setFormKeyPoints((item.keyPoints || []).join('\n'));
    setFormSafetyRules((item.safetyRules || []).join('\n'));
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert('Veuillez renseigner un titre');
      return;
    }

    setIsSaving(true);
    const keyPointsArray = formKeyPoints
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const safetyRulesArray = formSafetyRules
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<AdminKnowledgeItem> = {
      id: editingItem?.id,
      title: formTitle.trim(),
      category: formCategory.trim(),
      situationKey: formSituationKey.trim(),
      description: formDesc.trim(),
      keyPoints: keyPointsArray,
      safetyRules: safetyRulesArray,
    };

    const res = await adminManagementService.saveKnowledgeItem(payload);
    setIsSaving(false);

    if (res) {
      showFeedback(editingItem ? 'Connaissance mise à jour' : 'Nouvelle règle pédagogique ajoutée');
      setIsModalOpen(false);
      loadData();
    } else {
      alert('Erreur lors de l’enregistrement');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer cette règle de la base de connaissances ?')) {
      const ok = await adminManagementService.deleteKnowledgeItem(id);
      if (ok) {
        showFeedback('Connaissance supprimée');
        loadData();
      } else {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const filteredItems = items.filter((it) =>
    (it.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (it.category || '').toLowerCase().includes(search.toLowerCase()) ||
    (it.description || '').toLowerCase().includes(search.toLowerCase())
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
            <span className="text-xs font-semibold text-slate-900">Base de connaissances</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-600" />
            Base de Connaissances & Règles Pédagogiques
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérer les règles et critères guidant les analyses vidéo et les recommandations Baby Swim Vision.
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
            onClick={openCreate}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Ajouter une règle
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par titre, catégorie..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>
        <span className="text-xs font-semibold text-slate-500">{filteredItems.length} élément(s)</span>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-teal-500" />
            Chargement de la base de connaissances...
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200/80">
            Aucun élément trouvé.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 hover:border-slate-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    {item.category || 'Pédagogie'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>

                {item.keyPoints && item.keyPoints.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Repères d’observation
                    </span>
                    <ul className="space-y-1 text-xs text-slate-600">
                      {item.keyPoints.map((pt, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-teal-600 shrink-0 mt-0.5" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {item.safetyRules && item.safetyRules.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                      Règles de sécurité
                    </span>
                    <ul className="space-y-1 text-xs text-rose-700">
                      {item.safetyRules.map((sr, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0 mt-0.5" />
                          <span>{sr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 font-mono">
                Clé moteur : {item.situationKey || 'sit_general'}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal create / edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingItem ? 'Modifier la règle de connaissance' : 'Ajouter une règle de connaissance'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Titre de la compétence ou situation</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Immersion réflexe & contact visuel"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Catégorie</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Sécurité & Physiologie"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Clé de situation IA</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: sit_immersion_verticale"
                    value={formSituationKey}
                    onChange={(e) => setFormSituationKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description pédagogique</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Principes fondamentaux observés..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Repères d'observation (un par ligne)
                </label>
                <textarea
                  rows={3}
                  placeholder="Critère 1&#10;Critère 2..."
                  value={formKeyPoints}
                  onChange={(e) => setFormKeyPoints(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Règles de sécurité indispensables (une par ligne)
                </label>
                <textarea
                  rows={2}
                  placeholder="Règle 1&#10;Règle 2..."
                  value={formSafetyRules}
                  onChange={(e) => setFormSafetyRules(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-rose-900"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-xs flex items-center gap-1.5"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Enregistrer dans la base
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
