import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Palette,
  Image as ImageIcon,
  Type,
  Upload,
  RotateCcw,
  Save,
  CheckCircle2,
  Gift,
  Shield,
  Eye,
  EyeOff,
  Sliders,
  Sparkles,
  Users,
  Baby as BabyIcon,
  Trash2,
  Crown,
  Lock,
  Calendar,
  Video,
  Plus,
  Pencil,
  AlertTriangle,
  FolderOpen,
  ShieldCheck,
  ArrowUp,
  ArrowDown,
  CreditCard,
} from 'lucide-react';
import { User, BabyProfile, DemoVideoItem } from '../types';
import { babyService } from '../services/babyService';
import { interfaceSettingsService, InterfaceSettings } from '../services/interfaceSettingsService';
import { paymentService, calculateOneMonthEndDate } from '../services/paymentService';
import { authService } from '../services/authService';
import { demoVideoService } from '../services/demoVideoService';
import { useAdminMode } from '../context/AdminModeContext';
import { BabyAvatar } from './BabyAvatar';
import { AdminClubsManager } from './AdminClubsManager';
import { AdminPaymentAuditPanel } from './AdminPaymentAuditPanel';

interface VisualEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onUserUpdated?: () => void;
  initialTab?: 'photos' | 'texts' | 'videos' | 'promo' | 'roles' | 'clubs' | 'payment';
}

export const VisualEditorModal: React.FC<VisualEditorModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserUpdated,
  initialTab = 'photos',
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'texts' | 'videos' | 'promo' | 'roles' | 'clubs' | 'payment'>(initialTab);
  const [babies, setBabies] = useState<BabyProfile[]>([]);
  const [settings, setSettings] = useState<InterfaceSettings>(interfaceSettingsService.getSettings());
  const [demoVideos, setDemoVideos] = useState<DemoVideoItem[]>([]);
  const [selectedBabyForUpload, setSelectedBabyForUpload] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const {
    setIsCreatingDemoVideo,
    setEditingDemoVideo,
    handleDeleteDemoVideo,
    handleSaveDemoVideo,
  } = useAdminMode();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialTab) {
        setActiveTab(initialTab);
      }
      setBabies(babyService.getBabies());
      setSettings(interfaceSettingsService.getSettings());
      demoVideoService.getAllDemoVideos().then((vids) => setDemoVideos(vids));
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const unsub = demoVideoService.subscribe((vids) => {
      setDemoVideos(vids);
    });
    return () => unsub();
  }, []);

  if (!isOpen) return null;

  const showFeedback = (msg: string) => {
    setFeedbackMessage(msg);
    setTimeout(() => setFeedbackMessage(null), 3000);
  };

  const handleMoveVideo = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= demoVideos.length) return;
    const copy = [...demoVideos];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    const orderedIds = copy.map((v) => v.id);
    try {
      await demoVideoService.reorderDemoVideos(orderedIds);
      setDemoVideos(copy);
      showFeedback("Ordre d'affichage enregistré avec succès");
    } catch (err: any) {
      alert(err?.message || "Erreur lors de l'enregistrement de l'ordre");
    }
  };

  const handleToggleVideoVisibility = async (video: DemoVideoItem) => {
    try {
      await handleSaveDemoVideo({
        id: video.id,
        visible: !video.visible,
      });
      showFeedback(video.visible !== false ? 'Vidéo masquée avec succès' : 'Vidéo rendue visible avec succès');
    } catch (err: any) {
      alert(err?.message || 'Erreur lors de la modification de la visibilité');
    }
  };

  const handleDeleteVideoWithConfirm = async (video: DemoVideoItem) => {
    if (window.confirm(`Supprimer définitivement la vidéo "${video.title}" ?`)) {
      try {
        await handleDeleteDemoVideo(video.id);
        setDemoVideos((prev) => prev.filter((v) => v.id !== video.id));
        showFeedback('Vidéo supprimée définitivement');
      } catch (err: any) {
        alert(err?.message || 'Erreur lors de la suppression');
      }
    }
  };

  const handleSaveTexts = (e: React.FormEvent) => {
    e.preventDefault();
    interfaceSettingsService.updateSettings(settings);
    showFeedback('Textes enregistrés avec succès !');
  };

  const handleResetTexts = () => {
    const res = interfaceSettingsService.resetSettings();
    setSettings(res);
    showFeedback('Textes et paramètres réinitialisés aux valeurs par défaut.');
  };

  const handlePhotoUploadForBaby = (babyId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);

          babyService.updateBaby(babyId, {
            photoUrl: compressed,
            avatarType: 'photo',
          });
          setBabies(babyService.getBabies());
          onUserUpdated?.();
          showFeedback('Photo mise à jour avec succès !');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBabyPhoto = (babyId: string) => {
    babyService.updateBaby(babyId, {
      photoUrl: undefined,
      avatarType: 'avatar',
    });
    setBabies(babyService.getBabies());
    onUserUpdated?.();
    showFeedback('Photo supprimée (avatar rétabli).');
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;

        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          const updated = interfaceSettingsService.updateSettings({ heroImageUrl: compressed });
          setSettings(updated);
          showFeedback('Image principale mise à jour !');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const vipRedemptions = paymentService.getVipRedemptions();
  const vipRemaining = paymentService.getVipRemainingSpots();
  const dateRange = calculateOneMonthEndDate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fadeIn">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (selectedBabyForUpload) {
            handlePhotoUploadForBaby(selectedBabyForUpload, e);
          }
        }}
      />

      <input
        type="file"
        ref={heroImageInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleHeroImageUpload}
      />

      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/50 flex items-center justify-center border border-indigo-400/40 text-indigo-200">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">Éditeur Visuel & Personnalisation</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                  Sans Coder
                </span>
              </div>
              <p className="text-xs text-indigo-200/80">
                Modifiez facilement les photos, textes, code promo VIP et basculez entre les rôles.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('photos')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'photos'
                ? 'bg-white text-indigo-900 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-indigo-600" />
            <span>Photos & Visuels ({babies.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('texts')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'texts'
                ? 'bg-white text-indigo-900 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Type className="w-4 h-4 text-indigo-600" />
            <span>Textes & Accroches</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'videos'
                ? 'bg-white text-indigo-900 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-4 h-4 text-sky-600" />
            <span>Vidéos Démo ({demoVideos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('promo')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'promo'
                ? 'bg-white text-indigo-900 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gift className="w-4 h-4 text-indigo-600" />
            <span>Code VIP ({vipRemaining}/25)</span>
          </button>

          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'roles'
                ? 'bg-white text-indigo-900 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Bascule de Profils (3 Modes)</span>
          </button>

          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'clubs'
                ? 'bg-white text-indigo-900 border-t-2 border-indigo-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>🌍 Trouvez mon club (Annuaire)</span>
          </button>

          <button
            onClick={() => setActiveTab('payment')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'payment'
                ? 'bg-white text-emerald-900 border-t-2 border-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <span>💳 Contrôle Paiement & Sandbox</span>
          </button>
        </div>

        {/* Notification Feedback */}
        {feedbackMessage && (
          <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedbackMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: PHOTOS */}
          {activeTab === 'photos' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <BabyIcon className="w-4 h-4 text-indigo-600" />
                  Photos des Profils Bébés
                </h3>
                <p className="text-xs text-slate-500">
                  Cliquez sur "Importer une photo" pour téléverser directement une photo depuis votre appareil pour chaque bébé.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {babies.map((baby) => (
                  <div
                    key={baby.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col justify-between gap-3 hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-white border-2 border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                        {baby.photoUrl ? (
                          <img src={baby.photoUrl} alt={baby.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl">{baby.avatarUrl || '👶'}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-extrabold text-slate-900 text-sm truncate">{baby.name}</div>
                        <div className="text-xs text-slate-500">{baby.ageMonths} mois ({baby.level})</div>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-white border border-slate-200 text-slate-600 rounded text-[10px] font-bold">
                          {baby.photoUrl ? '📸 Photo active' : '👶 Avatar emoji'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBabyForUpload(baby.id);
                          fileInputRef.current?.click();
                        }}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{baby.photoUrl ? 'Changer photo' : 'Importer photo'}</span>
                      </button>

                      {baby.photoUrl && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBabyPhoto(baby.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          title="Supprimer la photo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: TEXTES */}
          {activeTab === 'texts' && (
            <form onSubmit={handleSaveTexts} className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Textes & Titres Visuels</h3>
                  <p className="text-xs text-slate-500">Personnalisez directement tous les textes affichés aux utilisateurs.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleResetTexts}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-bold transition-colors cursor-pointer"
                  >
                    Rétablir par défaut
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-md shadow-indigo-600/20 cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Enregistrer</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Slogan & Title */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="text-xs font-black text-slate-800">Titre Principal de l'Application</label>
                  <input
                    type="text"
                    value={settings.customHeaderTitle}
                    onChange={(e) => setSettings({ ...settings, customHeaderTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                  />
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="text-xs font-black text-slate-800">Sous-titre d'Accroche</label>
                  <input
                    type="text"
                    value={settings.customTagline}
                    onChange={(e) => setSettings({ ...settings, customTagline: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                  />
                </div>

                {/* Announcement Banner */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 md:col-span-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800">Bannière d'Annonce Supérieure</label>
                    <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.showAnnouncement}
                        onChange={(e) => setSettings({ ...settings, showAnnouncement: e.target.checked })}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span>Afficher la bannière</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                  />
                </div>

                {/* Hero Headline */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-800">Grand Titre de la Page d'Accueil</label>
                  <input
                    type="text"
                    value={settings.heroHeadline}
                    onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                  />
                </div>

                {/* Hero Subheadline */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 md:col-span-2">
                  <label className="text-xs font-black text-slate-800">Texte Descriptif de la Page d'Accueil</label>
                  <textarea
                    rows={2}
                    value={settings.heroSubheadline}
                    onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium resize-none"
                  />
                </div>

                {/* Facebook Group */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="text-xs font-black text-slate-800">Lien Groupe Facebook</label>
                  <input
                    type="text"
                    value={settings.facebookGroupUrl}
                    onChange={(e) => setSettings({ ...settings, facebookGroupUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                  />
                </div>

                {/* Support Email */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <label className="text-xs font-black text-slate-800">E-mail de Contact / Support</label>
                  <input
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                  />
                </div>
              </div>
            </form>
          )}

          {/* TAB: VIDÉOS DÉMO (BIBLIOTHÈQUE ADMINISTRATEUR) */}
          {activeTab === 'videos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm">
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <Video className="w-5 h-5 text-sky-400" />
                    <span>Bibliothèque des Vidéos de Démonstration</span>
                  </h3>
                  <p className="text-xs text-sky-200 mt-1">
                    Ajoutez vos propres vidéos physiques dans <code className="bg-white/10 px-1.5 py-0.5 rounded text-sky-300 font-mono text-[10px]">public/media/videos/</code> et gérez leurs fiches pédagogiques.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreatingDemoVideo(true)}
                  className="flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-xs font-black shadow-md cursor-pointer shrink-0 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une vidéo</span>
                </button>
              </div>

              {/* Instructions box */}
              <div className="p-4 bg-sky-50/70 border border-sky-200/80 rounded-2xl text-xs space-y-2 text-slate-700">
                <div className="font-bold text-sky-950 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4 text-sky-600" />
                    <span>Ancrage permanent des vidéos administratives</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Stockage permanent protégé
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Toute vidéo téléversée ou enregistrée par l'administrateur est ancrée dans <code className="bg-sky-100 text-sky-900 px-1 py-0.5 rounded font-mono font-semibold">/public/media/demo-videos/</code>.<br />
                  <strong className="text-slate-800">Règle absolue :</strong> Ces vidéos administratives ne sont jamais supprimées, remplacées ou réinitialisées automatiquement lors des mises à jour de l'application, des builds ou des déploiements.
                </p>
              </div>

              {/* Videos Table / Cards */}
              <div className="space-y-3">
                {demoVideos.length === 0 ? (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-400">
                    <Video className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-bold text-slate-700">Aucune vidéo de démonstration configurée</p>
                    <p className="text-[11px] text-slate-500">Cliquez sur « Ajouter une vidéo » pour commencer.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {demoVideos.map((video, idx) => (
                      <div
                        key={video.id}
                        className="p-4 bg-slate-50 border border-slate-200 hover:border-sky-300 rounded-2xl space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-800 bg-sky-100 px-2 py-0.5 rounded-md">
                                {video.category}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                  video.visible !== false
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-slate-200 text-slate-600'
                                }`}
                              >
                                {video.visible !== false ? 'Visible' : 'Masquée'}
                              </span>
                              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                                Permanente
                              </span>
                            </div>

                            {/* Order indicator & Up/Down reorder controls */}
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-slate-500 font-mono font-bold mr-1">
                                #{video.order || idx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleMoveVideo(idx, 'up')}
                                disabled={idx === 0}
                                className="p-1 text-slate-400 hover:text-sky-700 hover:bg-sky-100 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                title="Monter dans l'ordre d'affichage"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveVideo(idx, 'down')}
                                disabled={idx === demoVideos.length - 1}
                                className="p-1 text-slate-400 hover:text-sky-700 hover:bg-sky-100 rounded disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                                title="Descendre dans l'ordre d'affichage"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <h4 className="font-bold text-xs text-slate-900 leading-snug">{video.title}</h4>
                          <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                            {video.description || video.pedagogicalExplanation}
                          </p>

                          <div className="text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/80 font-mono flex items-center justify-between">
                            <span className="truncate mr-2 font-medium text-sky-900">📁 {video.videoFileName}</span>
                            {video.fileExists !== false ? (
                              <span className="text-emerald-700 font-sans font-semibold text-[10px] shrink-0">✓ Présent</span>
                            ) : (
                              <span className="text-amber-700 font-sans font-semibold text-[10px] shrink-0">Fichier manquant</span>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={() => handleToggleVideoVisibility(video)}
                            className="flex items-center gap-1 text-[11px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                          >
                            {video.visible !== false ? (
                              <>
                                <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                                <span>Masquer</span>
                              </>
                            ) : (
                              <>
                                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Rendre visible</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingDemoVideo(video)}
                              className="px-2.5 py-1 bg-white hover:bg-sky-50 text-sky-700 border border-slate-200 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3 h-3" />
                              <span>Modifier</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteVideoWithConfirm(video)}
                              className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer définitivement"
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
            </div>
          )}

          {/* TAB 3: CODE PROMO VIP */}
          {activeTab === 'promo' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold uppercase text-indigo-700">Code Actif</span>
                  <div className="text-xl font-black text-indigo-950 font-mono">VIPGLG25</div>
                  <p className="text-[11px] text-indigo-800">1 mois gratuit (date à date)</p>
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold uppercase text-emerald-700">Places Disponibles</span>
                  <div className="text-xl font-black text-emerald-950">{vipRemaining} / 25</div>
                  <p className="text-[11px] text-emerald-800">{25 - vipRemaining} compte(s) activé(s)</p>
                </div>

                <div className="p-4 bg-sky-50 border border-sky-200 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold uppercase text-sky-700">Validité Actuelle</span>
                  <div className="text-xs font-black text-sky-950 leading-snug">{dateRange.formattedDateRange}</div>
                  <p className="text-[11px] text-sky-800">Calcul jour pour jour</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const range = calculateOneMonthEndDate();
                    authService.activateOneMonthVipPromo({
                      email: currentUser?.email || 'swimgaella@gmail.com',
                      name: currentUser?.name || 'Gaëlla',
                      promoCode: 'VIPGLG25',
                      expiresAtIso: range.expiresAtIso,
                    });
                    paymentService.recordVipRedemption(currentUser?.email || 'swimgaella@gmail.com');
                    onUserUpdated?.();
                    showFeedback('1 mois VIP activé sur votre profil !');
                  }}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Gift className="w-4 h-4" />
                  <span>Tester l'activation VIP sur mon compte</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    paymentService.resetVipRedemptions();
                    onUserUpdated?.();
                    showFeedback('Quota réinitialisé à 25/25 places !');
                  }}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Réinitialiser les 25 places</span>
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
                <div className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Utilisateurs enregistrés avec le code VIPGLG25 ({vipRedemptions.length})
                </div>
                {vipRedemptions.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucune activation pour le moment.</p>
                ) : (
                  <div className="divide-y divide-slate-200 max-h-40 overflow-y-auto">
                    {vipRedemptions.map((r, i) => (
                      <div key={i} className="py-1.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{r.email}</span>
                        <span className="text-slate-400 text-[11px]">{new Date(r.date).toLocaleDateString('fr-FR')}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: LES 3 PROFILS / ROLES */}
          {activeTab === 'roles' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">Bascule Rapide des 3 Profils</h3>
                <p className="text-xs text-slate-500">
                  Passez d'un profil à un autre en 1 clic pour tester l'application sous chaque angle.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Utilisateur Free */}
                <div
                  onClick={() => {
                    authService.setSimulationMode('USER_FREE');
                    onUserUpdated?.();
                    showFeedback('Mode : Utilisateur Gratuit (Accès visuel seulement, 100% verrouillé)');
                  }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    currentUser?.simulatedRole === 'USER_FREE'
                      ? 'bg-amber-50 border-amber-500 ring-2 ring-amber-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🔵</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900">
                      Gratuit
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Utilisateur Free</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Accès visuel seulement. <strong>Aucune possibilité de lire un article, ni d'analyser une vidéo</strong>, ni de voir les détails : paywall strict affiché.
                  </p>
                </div>

                {/* 2. Utilisateur Premium */}
                <div
                  onClick={() => {
                    authService.setSimulationMode('USER_PREMIUM');
                    onUserUpdated?.();
                    showFeedback('Mode : Utilisateur Premium (Payé ou Code VIP)');
                  }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    currentUser?.simulatedRole === 'USER_PREMIUM'
                      ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🟢</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-900">
                      Premium
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Utilisateur Premium</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Utilisateur qui a payé les 24,90 € ou activé le code promo VIP. <strong>Accès intégral 100% débloqué</strong> sans restrictions.
                  </p>
                </div>

                {/* 3. Profil Admin */}
                <div
                  onClick={() => {
                    authService.ensureAdminMode();
                    onUserUpdated?.();
                    showFeedback('Mode : Profil Admin Actif (Plein contrôle & modification visuelle)');
                  }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    currentUser?.role === 'ADMIN' && !currentUser?.simulatedRole
                      ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">👑</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-900">
                      Admin
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm">Profil Administrateur</h4>
                  <p className="text-xs text-slate-600 mt-1">
                    Plein contrôle créateur : vous pouvez <strong>modifier tout sur l'appli (photos et textes)</strong> sur le visuel sans savoir coder.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: TROUVEZ MON CLUB (ANNUAIRE) */}
          {activeTab === 'clubs' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-base flex items-center gap-2">
                    <span>🌍 Gestion de l'Annuaire « Trouvez mon club »</span>
                  </h3>
                  <p className="text-xs text-sky-200 mt-1">
                    Gérez les propositions soumises par les clubs, validez-les, modifiez-les, ajoutez des recommandations ou supprimez-les.
                  </p>
                </div>
              </div>

              <AdminClubsManager onClubUpdated={() => showFeedback('Mise à jour effectuée dans l\'annuaire')} />
            </div>
          )}

          {/* TAB 6: CONTRÔLE DU SYSTÈME DE PAIEMENT & SANDBOX */}
          {activeTab === 'payment' && (
            <AdminPaymentAuditPanel onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};
