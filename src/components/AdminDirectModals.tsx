import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Trash2,
  Image as ImageIcon,
  Upload,
  Sparkles,
  BookOpen,
  Sliders,
  Check,
  Plus,
  AlertTriangle,
  Type,
  ExternalLink,
} from 'lucide-react';
import { useAdminMode } from '../context/AdminModeContext';
import { PedagogicalArticle, ExerciseItem } from '../types';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { DemoVideoModal } from './DemoVideoModal';

export const AdminDirectModals: React.FC = () => {
  const {
    editingArticle,
    setEditingArticle,
    isCreatingArticle,
    setIsCreatingArticle,
    editingExercise,
    setEditingExercise,
    isCreatingExercise,
    setIsCreatingExercise,
    editingDemoVideo,
    setEditingDemoVideo,
    isCreatingDemoVideo,
    setIsCreatingDemoVideo,
    editingSettingsField,
    setEditingSettingsField,
    editingImageTarget,
    setEditingImageTarget,
    handleSaveArticle,
    handleDeleteArticle,
    handleSaveExercise,
    handleDeleteExercise,
    handleSaveSettingsField,
    handleSaveImage,
  } = useAdminMode();

  // Local draft state for Article
  const [articleDraft, setArticleDraft] = useState<Partial<PedagogicalArticle>>({});
  
  // Local draft state for Exercise
  const [exerciseDraft, setExerciseDraft] = useState<Partial<ExerciseItem>>({});

  // Local state for image changer
  const [imageUrlInput, setImageUrlInput] = useState('');

  // Local state for single settings field editor
  const [fieldValueInput, setFieldValueInput] = useState('');

  // Validation error state
  const [formError, setFormError] = useState<string | null>(null);

  // Delete modal state inside editor
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    title: string;
    type: 'article' | 'exercice';
  } | null>(null);

  useEffect(() => {
    if (editingArticle) {
      setArticleDraft({ ...editingArticle });
    } else if (isCreatingArticle) {
      setArticleDraft({
        id: `article_${Date.now()}`,
        slug: `nouvel-article-${Date.now()}`,
        title: '',
        category: 'psychomotor',
        categoryLabel: 'Développement Psychomoteur & Éveil',
        readingTime: '5 min',
        icon: '📘',
        badge: 'Nouveau',
        summary: '',
        featured: false,
        publishedDate: new Date().toISOString().split('T')[0],
        author: 'Équipe Pédagogique Baby Swim Vision',
        tags: ['Éveil', 'Conseils'],
        content: {
          introduction: '',
          sections: [
            {
              title: '1. Repères et conseils pratiques',
              paragraphs: ['Rédigez le texte du paragraphe ici...'],
              keyPoints: ['Point clé 1', 'Point clé 2'],
            },
          ],
          takeaways: ['À retenir pour la séance'],
        },
      });
    }
  }, [editingArticle, isCreatingArticle]);

  useEffect(() => {
    if (editingExercise) {
      setExerciseDraft({ ...editingExercise });
    } else if (isCreatingExercise) {
      setExerciseDraft({
        id: `exo_${Date.now()}`,
        title: '',
        objective: '',
        level: 'decouverte',
        recommendedAge: '4 - 18 mois',
        situationCategory: 'portage',
        steps: ['Étape 1 : Mettre bébé en confiance', 'Étape 2 : Accompagner le mouvement'],
        commonMistakes: ['Mouvements trop brusques'],
        corrections: ['Prendre son temps et respirer'],
        safetyTips: ['Maintenir le contact visuel'],
        duration: '3 à 5 minutes',
        tags: ['Éveil', 'Portage'],
      });
    }
  }, [editingExercise, isCreatingExercise]);

  useEffect(() => {
    if (editingImageTarget) {
      setImageUrlInput(editingImageTarget.currentUrl || '');
    }
  }, [editingImageTarget]);

  useEffect(() => {
    if (editingSettingsField) {
      setFieldValueInput(editingSettingsField.value || '');
    }
  }, [editingSettingsField]);

  // Handle Photo upload / file convert to optimized Base64 data URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL('image/jpeg', 0.85);
            callback(optimized);
            return;
          }
          callback(reader.result as string);
        };
        img.onerror = () => {
          callback(reader.result as string);
        };
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      {/* 1. ARTICLE MODAL (CREATE / EDIT) */}
      {(editingArticle || isCreatingArticle) && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col my-auto animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {isCreatingArticle ? 'Créer un nouvel article' : 'Modifier l’article'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Modifiez le titre, le résumé, les paragraphes et la photo
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingArticle(null);
                  setIsCreatingArticle(false);
                }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre de l'article *</label>
                <input
                  type="text"
                  value={articleDraft.title || ''}
                  onChange={(e) => setArticleDraft({ ...articleDraft, title: e.target.value })}
                  placeholder="ex: Comment réussir la première immersion en douceur"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 text-sm font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={articleDraft.category || 'psychomotor'}
                    onChange={(e) => {
                      const cat = e.target.value as any;
                      const labelMap: Record<string, string> = {
                        psychomotor: 'Développement Psychomoteur & Éveil',
                        immersion: '1ère Immersion & Relâchement',
                        safety: 'Sécurité & Prévention Aquatique',
                        confidence: 'Confiance & Lien Parent-Bébé',
                      };
                      setArticleDraft({
                        ...articleDraft,
                        category: cat,
                        categoryLabel: labelMap[cat] || 'Général',
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
                  >
                    <option value="psychomotor">Développement Psychomoteur</option>
                    <option value="immersion">1ère Immersion</option>
                    <option value="safety">Sécurité & Prévention</option>
                    <option value="confidence">Confiance & Lien Parent-Bébé</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Temps de lecture</label>
                  <input
                    type="text"
                    value={articleDraft.readingTime || '5 min'}
                    onChange={(e) => setArticleDraft({ ...articleDraft, readingTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Photo & image upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Image de l'article</label>
                <div className="flex items-center gap-3">
                  {articleDraft.image ? (
                    <img
                      src={articleDraft.image}
                      alt="Aperçu"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      placeholder="URL de l'image (https://...)"
                      value={articleDraft.image || ''}
                      onChange={(e) => setArticleDraft({ ...articleDraft, image: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Uploader une photo depuis l'ordinateur</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (url) => setArticleDraft({ ...articleDraft, image: url }))
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Résumé / Chapô *</label>
                <textarea
                  rows={2}
                  value={articleDraft.summary || ''}
                  onChange={(e) => setArticleDraft({ ...articleDraft, summary: e.target.value })}
                  placeholder="Résumé accrocheur affiché sur la carte..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Introduction détaillée</label>
                <textarea
                  rows={3}
                  value={articleDraft.content?.introduction || ''}
                  onChange={(e) =>
                    setArticleDraft({
                      ...articleDraft,
                      content: {
                        ...(articleDraft.content || { sections: [], takeaways: [] }),
                        introduction: e.target.value,
                      },
                    })
                  }
                  placeholder="Texte complet d'introduction..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-800"
                />
              </div>

              {/* First Section Paragraph */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Contenu principal (Paragraphes)</label>
                <textarea
                  rows={4}
                  value={articleDraft.content?.sections?.[0]?.paragraphs?.join('\n\n') || ''}
                  onChange={(e) => {
                    const text = e.target.value;
                    const paragraphs = text.split('\n\n').filter((p) => p.trim());
                    const currentSections = [...(articleDraft.content?.sections || [])];
                    if (currentSections.length === 0) {
                      currentSections.push({
                        title: '1. Repères pratiques',
                        paragraphs: [text],
                        keyPoints: [],
                      });
                    } else {
                      currentSections[0] = {
                        ...currentSections[0],
                        paragraphs: paragraphs.length > 0 ? paragraphs : [text],
                      };
                    }
                    setArticleDraft({
                      ...articleDraft,
                      content: {
                        ...(articleDraft.content || { introduction: '', takeaways: [] }),
                        sections: currentSections,
                      },
                    });
                  }}
                  placeholder="Rédigez le texte du paragraphe..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-800 font-mono text-xs"
                />
              </div>

              {/* Règle d'or */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Règle d'or (Encadré mis en valeur)</label>
                <input
                  type="text"
                  value={articleDraft.goldenRule || ''}
                  onChange={(e) => setArticleDraft({ ...articleDraft, goldenRule: e.target.value })}
                  placeholder="ex: Toujours respecter le regard et les signaux de confort de bébé"
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-amber-50/50 text-sm font-semibold text-amber-900"
                />
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {!isCreatingArticle && editingArticle && (
                <button
                  type="button"
                  onClick={() => {
                    setDeleteTarget({
                      id: editingArticle.id,
                      title: editingArticle.title,
                      type: 'article',
                    });
                  }}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setEditingArticle(null);
                    setIsCreatingArticle(false);
                    setFormError(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!articleDraft.title?.trim()) {
                      setFormError('Veuillez renseigner un titre pour cet article');
                      return;
                    }
                    setFormError(null);
                    handleSaveArticle(articleDraft as PedagogicalArticle);
                  }}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer l'article</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. EXERCISE MODAL (CREATE / EDIT) */}
      {(editingExercise || isCreatingExercise) && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col my-auto animate-scale-up">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    {isCreatingExercise ? 'Créer un nouvel exercice' : 'Modifier la fiche exercice'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Modifiez le titre, l'objectif, les étapes et les corrections
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setEditingExercise(null);
                  setIsCreatingExercise(false);
                }}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Titre de l'exercice *</label>
                <input
                  type="text"
                  value={exerciseDraft.title || ''}
                  onChange={(e) => setExerciseDraft({ ...exerciseDraft, title: e.target.value })}
                  placeholder="ex: Portage vertical face à face & détente"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Palier / Niveau</label>
                  <select
                    value={exerciseDraft.level || 'decouverte'}
                    onChange={(e) => setExerciseDraft({ ...exerciseDraft, level: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
                  >
                    <option value="decouverte">Découverte (Palier 1)</option>
                    <option value="confiance">Confiance (Palier 2)</option>
                    <option value="autonomie">Autonomie (Palier 3)</option>
                    <option value="exploration">Exploration (Palier 4)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catégorie</label>
                  <select
                    value={exerciseDraft.situationCategory || 'portage'}
                    onChange={(e) => setExerciseDraft({ ...exerciseDraft, situationCategory: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
                  >
                    <option value="portage">Portage & Sécurisation</option>
                    <option value="flottaison">Flottaison & Équilibre</option>
                    <option value="immersion">Immersion & Souffle</option>
                    <option value="propulsion">Propulsion & Motricité</option>
                    <option value="autonomie">Bord & Sécurité</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Âge conseillé</label>
                  <input
                    type="text"
                    value={exerciseDraft.recommendedAge || '4 - 18 mois'}
                    onChange={(e) => setExerciseDraft({ ...exerciseDraft, recommendedAge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Photo & Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Illustration / Photo de l'exercice</label>
                <div className="flex items-center gap-3">
                  {exerciseDraft.image ? (
                    <img
                      src={exerciseDraft.image}
                      alt="Aperçu"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      placeholder="URL de l'image (https://...)"
                      value={exerciseDraft.image || ''}
                      onChange={(e) => setExerciseDraft({ ...exerciseDraft, image: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Uploader une photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileUpload(e, (url) => setExerciseDraft({ ...exerciseDraft, image: url }))
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Objectif pédagogique *</label>
                <textarea
                  rows={2}
                  value={exerciseDraft.objective || ''}
                  onChange={(e) => setExerciseDraft({ ...exerciseDraft, objective: e.target.value })}
                  placeholder="Objectif moteur et émotionnel visé..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Étapes pas-à-pas (Une étape par ligne)
                </label>
                <textarea
                  rows={3}
                  value={exerciseDraft.steps?.join('\n') || ''}
                  onChange={(e) =>
                    setExerciseDraft({
                      ...exerciseDraft,
                      steps: e.target.value.split('\n').filter((s) => s.trim()),
                    })
                  }
                  placeholder="Étape 1 : ...&#10;Étape 2 : ...&#10;Étape 3 : ..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-mono text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Erreurs fréquentes à éviter</label>
                  <textarea
                    rows={2}
                    value={exerciseDraft.commonMistakes?.join('\n') || ''}
                    onChange={(e) =>
                      setExerciseDraft({
                        ...exerciseDraft,
                        commonMistakes: e.target.value.split('\n').filter((s) => s.trim()),
                      })
                    }
                    placeholder="Une erreur par ligne..."
                    className="w-full px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/30 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Corrections & Postures recommandées</label>
                  <textarea
                    rows={2}
                    value={exerciseDraft.corrections?.join('\n') || ''}
                    onChange={(e) =>
                      setExerciseDraft({
                        ...exerciseDraft,
                        corrections: e.target.value.split('\n').filter((s) => s.trim()),
                      })
                    }
                    placeholder="Une consigne par ligne..."
                    className="w-full px-3 py-1.5 rounded-xl border border-emerald-200 bg-emerald-50/30 text-xs text-slate-800"
                  />
                </div>
              </div>
            </div>

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {!isCreatingExercise && editingExercise && (
                <button
                  type="button"
                  onClick={() => {
                    setDeleteTarget({
                      id: editingExercise.id,
                      title: editingExercise.title,
                      type: 'exercice',
                    });
                  }}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer</span>
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => {
                    setEditingExercise(null);
                    setIsCreatingExercise(false);
                    setFormError(null);
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!exerciseDraft.title?.trim()) {
                      setFormError('Veuillez renseigner un titre pour cet exercice');
                      return;
                    }
                    setFormError(null);
                    handleSaveExercise(exerciseDraft as ExerciseItem);
                  }}
                  className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer transition-all hover:scale-102"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer l'exercice</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteConfirmationModal
          isOpen={Boolean(deleteTarget)}
          title={deleteTarget.title}
          itemType={deleteTarget.type}
          onConfirm={() => {
            if (deleteTarget.type === 'article') {
              handleDeleteArticle(deleteTarget.id);
              setEditingArticle(null);
              setIsCreatingArticle(false);
            } else {
              handleDeleteExercise(deleteTarget.id);
              setEditingExercise(null);
              setIsCreatingExercise(false);
            }
            setDeleteTarget(null);
          }}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      {/* 3. DIRECT IMAGE REPLACEMENT MODAL */}
      {editingImageTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Modifier l'image</h3>
                  <p className="text-xs text-slate-500 truncate max-w-[240px]">{editingImageTarget.title}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingImageTarget(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              {imageUrlInput && (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-48 bg-slate-50 flex items-center justify-center">
                  <img
                    src={imageUrlInput}
                    alt="Aperçu"
                    className="w-full h-full max-h-48 object-contain"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">URL de l'image</label>
                <input
                  type="text"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-800"
                />
              </div>

              <div className="text-center">
                <span className="text-xs text-slate-400 font-bold uppercase">— ou —</span>
              </div>

              <label className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-sky-300 hover:border-sky-500 rounded-2xl bg-sky-50/50 hover:bg-sky-100/50 text-sky-800 text-xs font-bold cursor-pointer transition-colors">
                <Upload className="w-4 h-4 text-sky-600" />
                <span>Sélectionner une photo sur votre appareil</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, (url) => setImageUrlInput(url))}
                />
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              {(editingImageTarget.currentUrl || (editingImageTarget as any).currentImage) && (
                <button
                  type="button"
                  onClick={() => handleSaveImage('')}
                  className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer la photo</span>
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setEditingImageTarget(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveImage(imageUrlInput)}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all"
                >
                  Appliquer l'image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. DIRECT SINGLE FIELD EDITOR MODAL */}
      {editingSettingsField && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <Type className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Modifier le texte</h3>
                  <p className="text-xs text-slate-500">{editingSettingsField.label}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingSettingsField(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">{editingSettingsField.label}</label>
              <textarea
                rows={4}
                value={fieldValueInput}
                onChange={(e) => setFieldValueInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditingSettingsField(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleSaveSettingsField(editingSettingsField.key, fieldValueInput)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer transition-all"
              >
                Mettre à jour
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Demo Video Admin Modal */}
      {(editingDemoVideo || isCreatingDemoVideo) && (
        <DemoVideoModal
          isOpen={Boolean(editingDemoVideo || isCreatingDemoVideo)}
          video={editingDemoVideo}
          isCreating={isCreatingDemoVideo}
          onClose={() => {
            setEditingDemoVideo(null);
            setIsCreatingDemoVideo(false);
          }}
        />
      )}
    </>
  );
};
