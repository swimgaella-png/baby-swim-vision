import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Video,
  Save,
  Trash2,
  AlertTriangle,
  Check,
  CheckCircle2,
  FolderOpen,
  Eye,
  EyeOff,
  Clock,
  Layers,
  Award,
  Upload,
  ShieldCheck,
  Loader2,
  Play,
} from 'lucide-react';
import { DemoVideoItem } from '../types';
import { demoVideoService } from '../services/demoVideoService';
import { useAdminMode } from '../context/AdminModeContext';

interface DemoVideoModalProps {
  isOpen: boolean;
  video: DemoVideoItem | null;
  isCreating: boolean;
  onClose: () => void;
  onSaved?: (video: DemoVideoItem) => void;
  onDeleted?: (id: string) => void;
}

const CATEGORY_OPTIONS = [
  'IMMERSION',
  'PORTAGE',
  'FLOTTAISON',
  'PROPULSION',
  'ÉQUILIBRE',
  'DÉCOUVERTE',
  'RESPIRATION',
  'SÉCURITÉ',
  'AUTRE',
];

export const DemoVideoModal: React.FC<DemoVideoModalProps> = ({
  isOpen,
  video,
  isCreating,
  onClose,
  onSaved,
  onDeleted,
}) => {
  const { handleSaveDemoVideo, handleDeleteDemoVideo } = useAdminMode();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pedagogicalExplanation, setPedagogicalExplanation] = useState('');
  const [category, setCategory] = useState('IMMERSION');
  const [videoFileName, setVideoFileName] = useState('');
  const [recommendedAge, setRecommendedAge] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [visible, setVisible] = useState(true);
  const [videoDuration, setVideoDuration] = useState<number>(20);

  const [diskFiles, setDiskFiles] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load available disk files
  useEffect(() => {
    if (isOpen) {
      demoVideoService.fetchDiskFiles().then((files) => {
        setDiskFiles(files || []);
      });
    }
  }, [isOpen]);

  // Populate form fields
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setConfirmDelete(false);
      setUploadSuccess(null);
      setSaveSuccess(false);

      if (video && !isCreating) {
        setTitle(video.title || '');
        setDescription(video.description || video.pedagogicalExplanation || '');
        setPedagogicalExplanation(video.pedagogicalExplanation || '');
        setCategory(video.category || 'IMMERSION');
        setVideoFileName(video.videoFileName || '');
        setRecommendedAge(video.recommendedAge || '');
        setSkillsText((video.skills || []).join(', '));
        setOrder(video.order || 1);
        setVisible(video.visible !== false);
        setVideoDuration(video.videoDuration || 20);
      } else {
        // Defaults for new video
        setTitle('');
        setDescription('');
        setPedagogicalExplanation('');
        setCategory('IMMERSION');
        setVideoFileName('glenn immersion lâchée.mp4');
        setRecommendedAge('4 - 12 mois');
        setSkillsText('Immersion progressive, Contrôle respiratoire, Confiance parent-bébé');
        setOrder(1);
        setVisible(true);
        setVideoDuration(20);
      }
    }
  }, [isOpen, video, isCreating]);

  if (!isOpen) return null;

  const normalized = demoVideoService.normalizeFileName(videoFileName);
  const isFileOnDisk = diskFiles.includes(normalized.fileName) || diskFiles.includes(decodeURIComponent(normalized.fileName));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadSuccess(null);

    try {
      const result = await demoVideoService.uploadVideoFile(file);
      setVideoFileName(result.fileName);
      setUploadSuccess(`Vidéo ancrée de manière permanente dans /public/media/demo-videos/${result.fileName} (${result.sizeMB} Mo)`);
      // Update title if empty
      if (!title.trim()) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
      // Refresh disk files
      const updatedFiles = await demoVideoService.fetchDiskFiles();
      setDiskFiles(updatedFiles);
    } catch (err: any) {
      setError(err?.message || 'Erreur lors du téléversement du fichier');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Veuillez renseigner un titre.');
      return;
    }
    if (!normalized.fileName) {
      setError('Veuillez renseigner le nom du fichier vidéo.');
      return;
    }

    setIsSaving(true);
    setError(null);

    const parsedSkills = skillsText
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Partial<DemoVideoItem> = {
      ...(video?.id ? { id: video.id } : {}),
      title: title.trim(),
      description: description.trim(),
      pedagogicalExplanation: description.trim(),
      category: category.trim().toUpperCase(),
      videoFileName: normalized.fileName,
      videoUrl: normalized.videoUrl,
      recommendedAge: recommendedAge.trim(),
      skills: parsedSkills,
      order: Number(order) || 1,
      visible,
      videoDuration: Number(videoDuration) || 20,
      isPermanentAdminVideo: true,
      source: 'admin',
    };

    try {
      const saved = await handleSaveDemoVideo(payload);
      setSaveSuccess(true);
      setError(null);
      if (onSaved) onSaved(saved);
      // Brief delay so the user clearly perceives the confirmation
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setSaveSuccess(false);
      setError(err?.message || "Erreur : La modification n'a pas pu être enregistrée sur le serveur.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!video?.id) return;
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }

    setIsDeleting(true);
    try {
      await handleDeleteDemoVideo(video.id);
      if (onDeleted) onDeleted(video.id);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="demo-video-modal"
        className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold shadow-sm">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {isCreating
                  ? 'Ajouter une vidéo de démonstration'
                  : 'Modifier la vidéo de démonstration'}
              </h2>
              <p className="text-xs text-slate-500">
                Gestionnaire administrateur de la bibliothèque de démonstration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {saveSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2.5 shadow-xs">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Modifications enregistrées avec succès sur le serveur.</span>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Video File Name & Permanent Administrator Upload */}
          <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
              <label className="text-xs font-bold text-sky-950 uppercase tracking-wider flex items-center gap-1.5">
                <FolderOpen className="w-4 h-4 text-sky-600" />
                <span>1. Fichier Vidéo Permanent Administrateur</span>
              </label>
              <div className="flex items-center gap-1.5 text-[11px] text-sky-800 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Dossier permanent : <code className="bg-sky-100 px-1.5 py-0.5 rounded text-sky-900 font-mono text-[10px]">/public/media/demo-videos/</code></span>
              </div>
            </div>

            {/* Direct Upload CTA */}
            <div className="p-3 bg-white border border-sky-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5 text-sky-600" />
                  <span>Téléverser directement une vidéo vers le dossier permanent</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Le fichier sera automatiquement copié dans <code className="text-sky-700">/public/media/demo-videos/</code> et ne sera jamais supprimé lors des mises à jour.
                </p>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="video/mp4,video/quicktime,video/webm,video/*"
                  className="hidden"
                  id="admin-video-upload-input"
                />
                <label
                  htmlFor="admin-video-upload-input"
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl cursor-pointer transition-all shadow-sm ${
                    isUploading
                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                      : 'bg-sky-600 text-white hover:bg-sky-700 active:scale-95'
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Téléversement en cours...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" />
                      <span>Sélectionner un fichier vidéo</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            {uploadSuccess && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nom du fichier vidéo physique <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={videoFileName}
                  onChange={(e) => setVideoFileName(e.target.value)}
                  placeholder="ex: glenn immersion lâchée.mp4"
                  className="w-full px-3 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ou sélectionner parmi les vidéos permanentes existantes :
                </label>
                <select
                  value={diskFiles.includes(normalized.fileName) ? normalized.fileName : ''}
                  onChange={(e) => {
                    if (e.target.value) setVideoFileName(e.target.value);
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">-- Fichiers permanents sur le serveur --</option>
                  {diskFiles.map((file) => (
                    <option key={file} value={file}>
                      📹 {file}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Association Status Box */}
            <div className="pt-2 border-t border-sky-100 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                {isFileOnDisk ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    <Check className="w-3 h-3 text-emerald-600" />
                    Fichier permanent présent ({normalized.fileName})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Fichier non détecté sur le disque (Recherché dans public/media/demo-videos/)
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">
                URL de lecture permanente : <code className="text-sky-700 font-mono font-medium">{normalized.videoUrl}</code>
              </div>
            </div>
          </div>

          {/* 2. Titre & Catégorie */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                2. Titre de la démonstration <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="ex: 1ère immersion de référence — Portage vertical"
                className="w-full px-3.5 py-2.5 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Catégorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 3. Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3. Description de la démonstration
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ex: Cette démonstration montre la manière d'accompagner l'immersion en respectant le rythme du bébé et en maintenant une position stable et sécurisante."
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500 resize-none"
            />
          </div>

          {/* 4. Métadonnées additionnelles : Âge, Ordre, Durée */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Âge recommandé</span>
              </label>
              <input
                type="text"
                value={recommendedAge}
                onChange={(e) => setRecommendedAge(e.target.value)}
                placeholder="ex: 4 - 12 mois"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span>Ordre d'affichage</span>
              </label>
              <input
                type="number"
                min={1}
                max={99}
                value={order}
                onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Durée (secondes)</span>
              </label>
              <input
                type="number"
                min={5}
                max={600}
                value={videoDuration}
                onChange={(e) => setVideoDuration(parseInt(e.target.value) || 20)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* 5. Compétences Travaillées */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-slate-400" />
              <span>Compétences travaillées (séparées par des virgules)</span>
            </label>
            <input
              type="text"
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              placeholder="ex: Immersion progressive, Contrôle respiratoire, Confiance parent-bébé"
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {/* 6. Visibilité Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                {visible ? (
                  <Eye className="w-4 h-4 text-emerald-600" />
                ) : (
                  <EyeOff className="w-4 h-4 text-slate-400" />
                )}
                <span>Statut de visibilité</span>
              </span>
              <p className="text-[11px] text-slate-500">
                {visible
                  ? 'Visible par tous les utilisateurs dans la section Analyse vidéo'
                  : 'Masquée pour les utilisateurs (visible uniquement par les administrateurs)'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                visible
                  ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
                  : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
              }`}
            >
              {visible ? 'Visible' : 'Masquée'}
            </button>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/80">
          <div>
            {!isCreating && video?.id && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || isSaving}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  confirmDelete
                    ? 'bg-rose-600 text-white hover:bg-rose-700'
                    : 'text-rose-600 hover:bg-rose-50'
                }`}
              >
                <Trash2 className="w-4 h-4" />
                <span>{confirmDelete ? 'Confirmer la suppression' : 'Supprimer'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving || isDeleting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/50 rounded-xl transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isDeleting || saveSuccess}
              className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                saveSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-sky-600 text-white hover:bg-sky-700 shadow-sky-600/20'
              } disabled:opacity-50`}
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                  <span>Modifications enregistrées</span>
                </>
              ) : isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Enregistrer la vidéo</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
