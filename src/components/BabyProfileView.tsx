import React, { useState, useEffect, useRef } from 'react';
import {
  Baby,
  Plus,
  Edit2,
  Trash2,
  Check,
  Upload,
  Image as ImageIcon,
  Smile,
  Shield,
  Sparkles,
  Heart,
  Scale,
  Ruler,
  Thermometer,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  CheckCircle2,
  Info,
  Calendar,
  Lock,
  Crown,
  Key,
  Gift,
  RotateCcw,
  Save,
  ExternalLink,
  Sliders,
  Type,
  Eye,
  LogOut,
  BookOpen,
  FileText,
  Search,
  Users,
  Settings,
  X,
  Layers,
  ChevronRight,
  ShieldAlert,
  Infinity as InfinityIcon
} from 'lucide-react';
import { BabyProfile, User, PedagogicalArticle, ExerciseItem } from '../types';
import { babyService } from '../services/babyService';
import { accessControlService } from '../services/accessControlService';
import { authService } from '../services/authService';
import { articleService } from '../services/articleService';
import { exerciseService } from '../services/exerciseService';
import { interfaceSettingsService, InterfaceSettings } from '../services/interfaceSettingsService';
import { paymentService, calculateOneMonthEndDate } from '../services/paymentService';
import { BabyAvatar } from './BabyAvatar';
import { LockedFeatureModal } from './LockedFeatureModal';
import { useTranslation } from '../i18n/LanguageContext';

interface BabyProfileViewProps {
  babies: BabyProfile[];
  activeBaby: BabyProfile | null;
  currentUser?: User | null;
  onSelectBaby: (id: string) => void;
  onSaveBaby: (baby: BabyProfile) => void;
  onDeleteBaby: (id: string) => void;
  onNavigate: (view: string) => void;
  onOpenCheckout?: () => void;
  onOpenVisualEditor?: () => void;
  onSwitchRole?: (role: 'USER_FREE' | 'USER_PREMIUM' | 'ADMIN') => void;
}

const AVATAR_OPTIONS = [
  { emoji: '👶', label: 'Bébé baigneur' },
  { emoji: '🐬', label: 'Dauphin joueur' },
  { emoji: '🦆', label: 'Petit canard' },
  { emoji: '🌊', label: 'Vague douce' },
  { emoji: '⭐', label: 'Étoile de mer' },
  { emoji: '🐳', label: 'Baleineau' },
  { emoji: '🐠', label: 'Poisson corail' },
  { emoji: '⛵', label: 'Voilier' },
  { emoji: '🤿', label: 'Masque tuba' },
  { emoji: '🐙', label: 'Petite pieuvre' },
  { emoji: '🐢', label: 'Tortue marine' },
  { emoji: '🦭', label: 'Petit phoque' },
  { emoji: '🦀', label: 'Petit crabe' },
  { emoji: '🫧', label: 'Bulles d\'eau' },
];

const AVAILABLE_GOALS = [
  'Flottaison dorsale détendue',
  'Relâchement des tensions corporelles',
  'Immersion douce et acceptée',
  'Battements de jambes propulsifs',
  'Autonomie et appui bord de bassin',
  'Confiance parent-bébé dans l\'eau',
  'Jeux d\'équilibre et sauts du bord',
  'Souffle et fabrication de bulles',
];

export const BabyProfileView: React.FC<BabyProfileViewProps> = ({
  babies,
  activeBaby,
  currentUser = null,
  onSelectBaby,
  onSaveBaby,
  onDeleteBaby,
  onNavigate,
  onOpenCheckout = () => {},
  onOpenVisualEditor = () => {},
  onSwitchRole = (_role: 'USER_FREE' | 'USER_PREMIUM' | 'ADMIN') => {},
}) => {
  const { t } = useTranslation();

  const effectiveRole = accessControlService.getEffectiveRole(currentUser);
  const isRealAdmin = authService.isRealAdmin(currentUser);

  // Navigation mode inside Profile: non-admins NEVER access admin_cms
  const [profileViewMode, setProfileViewMode] = useState<'profile' | 'admin_cms'>('profile');
  const [babyFormMode, setBabyFormMode] = useState<'list' | 'create' | 'edit'>('list');

  // If not a real admin, force profileViewMode to 'profile'
  useEffect(() => {
    if (!isRealAdmin && profileViewMode === 'admin_cms') {
      setProfileViewMode('profile');
    }
  }, [isRealAdmin, profileViewMode]);

  // Admin CMS Subtabs
  const [adminCmsTab, setAdminCmsTab] = useState<'content_articles' | 'library_exercises' | 'users' | 'visuals_texts'>('content_articles');

  // Admin Passcode State
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminUnlocked, setAdminUnlocked] = useState(authService.isAdminUnlocked() || isRealAdmin);
  const [passcodeError, setPasscodeError] = useState(false);
  const [adminFeedback, setAdminFeedback] = useState<string | null>(null);

  // VIP promo code input in user profile
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Baby Form State
  const [editingBabyId, setEditingBabyId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [level, setLevel] = useState<'decouverte' | 'confiance' | 'autonomie' | 'exploration'>('decouverte');
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [hideName, setHideName] = useState(false);
  const [avatarType, setAvatarType] = useState<'avatar' | 'photo'>('avatar');
  const [avatarUrl, setAvatarUrl] = useState('👶');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [weightKg, setWeightKg] = useState<string>('');
  const [heightCm, setHeightCm] = useState<string>('');
  const [waterComfortLevel, setWaterComfortLevel] = useState<'tres_a_l_aise' | 'curieux_calme' | 'prudent_hesitant' | 'apprehensif'>('curieux_calme');
  const [thermalComfort, setThermalComfort] = useState<'tres_frileux' | 'standard_32c' | 'tres_a_l_aise'>('standard_32c');
  const [specialNotes, setSpecialNotes] = useState('');
  const [favoriteToyOrCue, setFavoriteToyOrCue] = useState('');
  const [babyToDelete, setBabyToDelete] = useState<string | null>(null);

  // CMS Data States
  const [articles, setArticles] = useState<PedagogicalArticle[]>(articleService.getAllArticles());
  const [exercises, setExercises] = useState<ExerciseItem[]>(exerciseService.getAllExercises());
  const [registeredUsers, setRegisteredUsers] = useState<User[]>(authService.getAllUsers());
  const [settings, setSettings] = useState<InterfaceSettings>(interfaceSettingsService.getSettings());
  const [articleSearchQuery, setArticleSearchQuery] = useState('');
  const [exerciseSearchQuery, setExerciseSearchQuery] = useState('');

  // Article Edit Modal / Drawer
  const [editingArticle, setEditingArticle] = useState<PedagogicalArticle | null>(null);
  const [isCreatingArticle, setIsCreatingArticle] = useState(false);

  // Exercise Edit Modal / Drawer
  const [editingExercise, setEditingExercise] = useState<ExerciseItem | null>(null);
  const [isCreatingExercise, setIsCreatingExercise] = useState(false);

  // File Upload Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const articlePhotoInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);
  const selectedArticleForPhotoRef = useRef<string | null>(null);

  // Subscribe to services
  useEffect(() => {
    const unsubArticles = articleService.subscribe(setArticles);
    const unsubExercises = exerciseService.subscribe(setExercises);
    const unsubSettings = interfaceSettingsService.subscribe(setSettings);
    return () => {
      unsubArticles();
      unsubExercises();
      unsubSettings();
    };
  }, []);

  const triggerFeedback = (msg: string) => {
    setAdminFeedback(msg);
    setTimeout(() => setAdminFeedback(null), 3500);
  };

  const handleUnlockAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await authService.unlockAdmin(adminPasscode);
    if (success) {
      setAdminUnlocked(true);
      setPasscodeError(false);
      setProfileViewMode('admin_cms');
      triggerFeedback('Mode Administrateur déverrouillé avec succès !');
    } else {
      setPasscodeError(true);
    }
  };

  const handleLockAdmin = () => {
    authService.lockAdmin();
    setAdminUnlocked(false);
    setProfileViewMode('profile');
    triggerFeedback('Mode Administrateur verrouillé.');
  };

  // Promo code redemption
  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoMessage(null);
    const clean = promoCodeInput.trim().toUpperCase();
    if (!clean) return;

    if (clean === 'VIPGLG25') {
      const remaining = paymentService.getVipRemainingSpots();
      if (remaining <= 0) {
        setPromoMessage({ type: 'error', text: 'Désolé, toutes les 25 places du code VIP ont été attribuées.' });
        return;
      }
      const dateRange = calculateOneMonthEndDate();
      const updated = authService.activateOneMonthVipPromo({
        email: currentUser?.email || 'parent@exemple.fr',
        name: currentUser?.name,
        promoCode: 'VIPGLG25',
        expiresAtIso: dateRange.expiresAtIso,
      });
      paymentService.recordVipRedemption(currentUser?.email || 'parent@exemple.fr');
      setPromoMessage({
        type: 'success',
        text: `Félicitations ! Code VIP validé : votre compte est Premium jusqu'au ${dateRange.formattedEndDate}.`,
      });
      setPromoCodeInput('');
      authService.saveUser(updated);
    } else {
      setPromoMessage({ type: 'error', text: 'Code promotionnel invalide ou expiré.' });
    }
  };

  // Photo uploads
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 400;
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
        ctx?.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.85);
        setPhotoUrl(compressed);
        setAvatarType('photo');
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  };

  const handleArticlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedArticleForPhotoRef.current) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      articleService.updateArticleImage(selectedArticleForPhotoRef.current!, result);
      triggerFeedback('Image de l\'article mise à jour immédiatement !');
      selectedArticleForPhotoRef.current = null;
    };
    reader.readAsDataURL(file);
  };

  const handleHeroPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      interfaceSettingsService.updateSettings({ heroImageUrl: result });
      triggerFeedback('Image principale (Hero) mise à jour avec succès !');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveInterfaceTexts = (e: React.FormEvent) => {
    e.preventDefault();
    interfaceSettingsService.updateSettings(settings);
    triggerFeedback('Textes et messages de l\'application enregistrés avec succès !');
  };

  // Baby Form Helpers
  const startNewBabyForm = () => {
    setEditingBabyId(null);
    setName('');
    const d = new Date();
    d.setMonth(d.getMonth() - 6);
    setBirthDate(d.toISOString().split('T')[0]);
    setLevel('decouverte');
    setSelectedGoals(['Flottaison dorsale détendue', 'Confiance parent-bébé dans l\'eau']);
    setHideName(false);
    setAvatarType('avatar');
    setAvatarUrl('👶');
    setPhotoUrl(undefined);
    setWeightKg('');
    setHeightCm('');
    setWaterComfortLevel('curieux_calme');
    setThermalComfort('standard_32c');
    setSpecialNotes('');
    setFavoriteToyOrCue('');
    setBabyFormMode('create');
  };

  const startEditBabyForm = (baby: BabyProfile) => {
    setEditingBabyId(baby.id);
    setName(baby.name);
    setBirthDate(baby.birthDate);
    setLevel(baby.level);
    setSelectedGoals(baby.goals || []);
    setHideName(baby.hideNameInAnalysis || false);
    setAvatarType(baby.avatarType || 'avatar');
    setAvatarUrl(baby.avatarUrl || '👶');
    setPhotoUrl(baby.photoUrl);
    setWeightKg(baby.weightKg ? String(baby.weightKg) : '');
    setHeightCm(baby.heightCm ? String(baby.heightCm) : '');
    setWaterComfortLevel(baby.waterComfortLevel || 'curieux_calme');
    setThermalComfort(baby.thermalComfort || 'standard_32c');
    setSpecialNotes(baby.specialNotes || '');
    setFavoriteToyOrCue(baby.favoriteToyOrCue || '');
    setBabyFormMode('edit');
  };

  const handleSubmitBabyForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) return;

    const birth = new Date(birthDate);
    const now = new Date();
    const diffMonths = Math.max(0, Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.4375)));
    const diffWeeks = Math.max(0, Math.floor((now.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 7)));

    const babyData: BabyProfile = {
      id: editingBabyId || ('baby_' + Date.now()),
      userId: currentUser?.id || 'anonymous',
      name: name.trim(),
      birthDate,
      ageMonths: diffMonths,
      ageWeeks: diffWeeks,
      level,
      startDate: new Date().toISOString().split('T')[0],
      goals: selectedGoals,
      hideNameInAnalysis: hideName,
      avatarType,
      avatarUrl: avatarType === 'avatar' ? avatarUrl : undefined,
      photoUrl: avatarType === 'photo' ? photoUrl : undefined,
      weightKg: weightKg ? parseFloat(weightKg) : undefined,
      heightCm: heightCm ? parseFloat(heightCm) : undefined,
      waterComfortLevel,
      thermalComfort,
      specialNotes: specialNotes.trim() || undefined,
      favoriteToyOrCue: favoriteToyOrCue.trim() || undefined,
    };

    onSaveBaby(babyData);
    setBabyFormMode('list');
    triggerFeedback(`Profil de ${babyData.name} enregistré avec succès !`);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 animate-fade-in">
      {/* Hidden File Inputs for Admin Image Uploads */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handlePhotoUpload}
      />
      <input
        type="file"
        ref={articlePhotoInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleArticlePhotoUpload}
      />
      <input
        type="file"
        ref={heroImageInputRef}
        accept="image/*"
        className="hidden"
        onChange={handleHeroPhotoUpload}
      />

      {/* Global Feedback Toast */}
      {adminFeedback && (
        <div className="bg-emerald-600 text-white px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between shadow-xl animate-fade-in border border-emerald-500">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
            <span>{adminFeedback}</span>
          </div>
          <button onClick={() => setAdminFeedback(null)} className="text-white/80 hover:text-white cursor-pointer ml-4">✕</button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HEADER BANNER & ACCOUNT STATUS */}
      {/* ========================================================================= */}
      <div className="bg-gradient-to-br from-sky-600 via-sky-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-sky-700/15 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-black tracking-wide">
              <span>{effectiveRole === 'USER_FREE' ? '🔵 Compte Découverte' : '🟢 Compte Premium — Accès illimité'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Espace Profil & Famille
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm max-w-2xl leading-relaxed">
              {effectiveRole === 'USER_FREE'
                ? "Vous êtes actuellement en compte découverte. Passez en Premium pour débloquer l'analyse vidéo intelligente et la bibliothèque intégrale."
                : "Gérez l'ensemble des profils de vos bébés, suivez leurs progrès et accédez à l'intégralité des analyses et fiches pédagogiques."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {effectiveRole === 'USER_FREE' && (
              <button
                type="button"
                onClick={onOpenCheckout}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-emerald-950 font-black rounded-2xl text-xs sm:text-sm shadow-lg shadow-emerald-900/20 transition-all hover:scale-102 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-emerald-950" />
                <span>Passer en Premium (24,90 €)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN CONTENT: STANDARD PROFIL */}
      {/* ========================================================================= */}
      {profileViewMode === 'profile' ? (
        /* ======================================================================= */
        /* STANDARD PROFILE VIEW (INFOS, BÉBÉS, ABONNEMENT) */
        /* ======================================================================= */
        <div className="space-y-8">
          {/* USER ACCOUNT CARD & STATUS */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 font-black text-xl flex items-center justify-center border border-sky-200 shrink-0">
                  {currentUser?.name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    {currentUser?.name || 'Parent Nageur'}
                  </h2>
                  <p className="text-xs text-slate-500">{currentUser?.email || 'parent@exemple.fr'}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {effectiveRole === 'USER_FREE' ? (
                  <div className="px-3.5 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>Compte Free</span>
                  </div>
                ) : (
                  <div className="px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-black flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Compte Premium — Accès actif</span>
                  </div>
                )}
              </div>
            </div>

            {/* If Free, offer promo code entry or direct upgrade */}
            {effectiveRole === 'USER_FREE' && (
              <div className="bg-gradient-to-r from-amber-50 via-sky-50 to-indigo-50 p-5 rounded-2xl border border-sky-100 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-900">
                      Passez en Premium pour débloquer toutes les fonctionnalités
                    </h3>
                    <p className="text-xs text-slate-600">
                      Accédez à l'analyse vidéo illimitée de 1 min max, à l'infographie de la 1ère immersion en 7 secondes et aux fiches détaillées.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCheckout}
                    className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-black shadow-md shadow-sky-600/20 cursor-pointer shrink-0"
                  >
                    Débloquer — 24,90 € à vie
                  </button>
                </div>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromoCode} className="pt-3 border-t border-slate-200/60 flex flex-col sm:flex-row items-center gap-2.5">
                  <div className="flex items-center gap-2 flex-1 w-full">
                    <Gift className="w-4 h-4 text-indigo-600 shrink-0" />
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value)}
                      placeholder="Entrez un code VIP (ex: VIPGLG25)"
                      className="w-full px-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 uppercase font-mono font-bold focus:outline-sky-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
                  >
                    Valider le code
                  </button>
                </form>

                {promoMessage && (
                  <p className={`text-xs font-bold ${promoMessage.type === 'success' ? 'text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200' : 'text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200'}`}>
                    {promoMessage.text}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ==================== BABIES SECTION ==================== */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Baby className="w-5 h-5 text-sky-600" />
                  <span>Mes Bébés ({babies.length})</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Sélectionnez un profil pour adapter les analyses vidéo et le suivi des progrès.
                </p>
              </div>

              {babyFormMode === 'list' && (
                <button
                  type="button"
                  onClick={startNewBabyForm}
                  className="flex items-center gap-2 px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 transition-all hover:scale-102 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un bébé</span>
                </button>
              )}
            </div>

            {babyFormMode === 'list' ? (
              babies.length === 0 ? (
                <div className="bg-gradient-to-br from-sky-50 via-teal-50/50 to-white rounded-3xl p-8 sm:p-12 border-2 border-dashed border-sky-200 text-center space-y-5">
                  <div className="w-16 h-16 rounded-3xl bg-white text-3xl flex items-center justify-center mx-auto shadow-md border border-sky-100 animate-bounce">
                    👶
                  </div>
                  <div className="space-y-2 max-w-md mx-auto">
                    <h3 className="text-lg sm:text-xl font-black text-slate-900">
                      Bienvenue ! Créez le profil de votre bébé
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Renseignez son prénom, sa date de naissance et son niveau aquatique pour démarrer un suivi sur-mesure et adapter les analyses de vos séances.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={startNewBabyForm}
                    className="px-6 py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-sm rounded-2xl shadow-lg shadow-sky-600/20 transition-all hover:scale-105 cursor-pointer inline-flex items-center gap-2.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Créer le profil de mon bébé</span>
                  </button>
                </div>
              ) : (
                /* Babies Grid */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {babies.map((b) => {
                  const isActive = activeBaby?.id === b.id;
                  return (
                    <div
                      key={b.id}
                      className={`relative bg-white rounded-3xl p-5 border-2 transition-all shadow-xs flex flex-col justify-between gap-4 ${
                        isActive
                          ? 'border-sky-500 ring-2 ring-sky-500/20 bg-sky-50/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3.5">
                            <BabyAvatar baby={b} size="lg" shape="rounded" />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="text-base font-black text-slate-900">{b.name}</h3>
                                {isActive && (
                                  <span className="px-2 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-black rounded-full">
                                    Actif
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500">
                                {b.ageMonths} mois ({b.ageWeeks} sem.) • Né(e) le {new Date(b.birthDate).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => startEditBabyForm(b)}
                              className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
                              title="Modifier ce profil"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {babies.length > 1 && (
                              <button
                                type="button"
                                onClick={() => setBabyToDelete(b.id)}
                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                                title="Supprimer ce profil"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Level & Characteristics */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Niveau</span>
                            <span className="font-bold text-slate-800 capitalize">{b.level}</span>
                          </div>
                          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Aisance dans l'eau</span>
                            <span className="font-bold text-slate-800 truncate block">{b.waterComfortLevel?.replace('_', ' ') || 'Normal'}</span>
                          </div>
                        </div>

                        {b.goals && b.goals.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {b.goals.slice(0, 3).map((g, idx) => (
                              <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-[10px] font-medium">
                                {g}
                              </span>
                            ))}
                            {b.goals.length > 3 && (
                              <span className="px-2 py-0.5 bg-slate-100 text-slate-400 rounded-md text-[10px] font-medium">
                                +{b.goals.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        {!isActive ? (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectBaby(b.id);
                              triggerFeedback(`${b.name} est maintenant le profil actif.`);
                            }}
                            className="px-3.5 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Sélectionner pour les analyses
                          </button>
                        ) : (
                          <span className="text-xs font-bold text-sky-700 flex items-center gap-1.5">
                            <Check className="w-4 h-4 text-sky-600" />
                            Profil utilisé actuellement
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => onNavigate('dashboard')}
                          className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 cursor-pointer"
                        >
                          <span>Voir progrès</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              )
            ) : (
              /* Baby Create/Edit Form */
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-slate-900">
                    {babyFormMode === 'create' ? 'Ajouter un nouveau profil bébé' : `Modifier le profil de ${name}`}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setBabyFormMode('list')}
                    className="text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Annuler
                  </button>
                </div>

                <form onSubmit={handleSubmitBabyForm} className="space-y-6">
                  {/* Photo / Avatar Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                      Illustration ou Photo du Bébé
                    </label>
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="relative">
                        {avatarType === 'photo' && photoUrl ? (
                          <img
                            src={photoUrl}
                            alt="Baby avatar"
                            className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-500 shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-2xl bg-sky-100 text-3xl flex items-center justify-center border-2 border-sky-200">
                            {avatarUrl}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-sky-200 cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5" />
                          <span>Téléverser une vraie photo</span>
                        </button>
                        {photoUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setPhotoUrl(undefined);
                              setAvatarType('avatar');
                            }}
                            className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold cursor-pointer"
                          >
                            Retirer photo
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Emoji choices */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {AVATAR_OPTIONS.map((opt) => (
                        <button
                          key={opt.emoji}
                          type="button"
                          onClick={() => {
                            setAvatarUrl(opt.emoji);
                            setAvatarType('avatar');
                          }}
                          className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all cursor-pointer ${
                            avatarType === 'avatar' && avatarUrl === opt.emoji
                              ? 'bg-sky-500 text-white shadow-xs scale-105'
                              : 'bg-slate-100 hover:bg-slate-200'
                          }`}
                          title={opt.label}
                        >
                          {opt.emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & BirthDate */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Prénom du bébé *</label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Ex: Noé, Léa, Arthur..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-sky-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Date de naissance *</label>
                      <input
                        type="date"
                        required
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-sky-600"
                      />
                    </div>
                  </div>

                  {/* Level & Water Comfort */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Palier aquatique</label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-sky-600"
                      >
                        <option value="decouverte">Découverte (4-9 mois) — Contact doux</option>
                        <option value="confiance">Confiance (9-15 mois) — Flottaison & appuis</option>
                        <option value="autonomie">Autonomie (15-24 mois) — Propulsion libre</option>
                        <option value="exploration">Exploration (24-36 mois) — Immersions & jeux</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Aisance dans l'eau</label>
                      <select
                        value={waterComfortLevel}
                        onChange={(e) => setWaterComfortLevel(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-sky-600"
                      >
                        <option value="tres_a_l_aise">Très à l'aise (Adore l'eau, éclabousse)</option>
                        <option value="curieux_calme">Curieux et calme (Observe sereinement)</option>
                        <option value="prudent_hesitant">Prudent / Hésitant (Besoin de contact serré)</option>
                        <option value="apprehensif">Appréhensif (Pleurs ou tension au début)</option>
                      </select>
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 block">Objectifs prioritaires</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {AVAILABLE_GOALS.map((g) => {
                        const checked = selectedGoals.includes(g);
                        return (
                          <label
                            key={g}
                            className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-colors ${
                              checked ? 'bg-sky-50 border-sky-300 text-sky-900 font-bold' : 'bg-slate-50 border-slate-200 text-slate-700'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedGoals([...selectedGoals, g]);
                                } else {
                                  setSelectedGoals(selectedGoals.filter((item) => item !== g));
                                }
                              }}
                              className="w-4 h-4 text-sky-600 rounded"
                            />
                            <span>{g}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setBabyFormMode('list')}
                      className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-md shadow-sky-600/20 cursor-pointer"
                    >
                      Enregistrer le profil
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ======================================================================= */
        /* 4. ADMIN IN-APP MINI CMS (CONTENT, ARTICLES, LIBRARY, USERS) */
        /* ======================================================================= */
        <div className="space-y-6 animate-fade-in">
          {!adminUnlocked ? (
            /* Passcode Unlock Form */
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl max-w-md mx-auto text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-900 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8 text-indigo-600" />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-black text-slate-900">
                  Déverrouiller le Mode Administrateur
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Entrez le code administrateur pour modifier directement les articles, fiches, textes et photos sans toucher au code source.
                </p>
              </div>

              <form onSubmit={handleUnlockAdmin} className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-700 block">Code secret</label>
                  <input
                    type="password"
                    value={adminPasscode}
                    onChange={(e) => {
                      setAdminPasscode(e.target.value);
                      setPasscodeError(false);
                    }}
                    placeholder="Entrez le code secret..."
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl text-sm font-mono tracking-wider focus:outline-indigo-600 ${
                      passcodeError ? 'border-rose-500 bg-rose-50/50' : 'border-slate-200'
                    }`}
                  />
                  {passcodeError && (
                    <p className="text-xs font-bold text-rose-600 mt-1">Code incorrect. Veuillez réessayer.</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-900 to-slate-900 hover:from-indigo-800 hover:to-slate-800 text-white rounded-2xl text-sm font-bold shadow-lg shadow-indigo-900/20 cursor-pointer"
                >
                  Déverrouiller la Console Admin
                </button>
              </form>
            </div>
          ) : (
            /* ==================== UNLOCKED ADMIN CMS ==================== */
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
              {/* CMS Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-100 text-indigo-950 flex items-center justify-center">
                    <Sliders className="w-6 h-6 text-indigo-700" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <span>Console Administrateur (Gestion Intégrée)</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full">
                        Temps Réel
                      </span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Toutes les modifications sont immédiatement enregistrées et visibles par les utilisateurs.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleLockAdmin}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Verrouiller</span>
                  </button>
                </div>
              </div>

              {/* 4 CMS Main Categories Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-3">
                <button
                  type="button"
                  onClick={() => setAdminCmsTab('content_articles')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    adminCmsTab === 'content_articles'
                      ? 'bg-indigo-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>1. Articles & Contenus ({articles.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminCmsTab('library_exercises')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    adminCmsTab === 'library_exercises'
                      ? 'bg-indigo-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>2. Fiches & Exercices ({exercises.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminCmsTab('users')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    adminCmsTab === 'users'
                      ? 'bg-indigo-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>3. Utilisateurs & Codes VIP</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminCmsTab('visuals_texts')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    adminCmsTab === 'visuals_texts'
                      ? 'bg-indigo-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Type className="w-3.5 h-3.5" />
                  <span>4. Textes & Visuels Généraux</span>
                </button>
              </div>

              {/* ========================================================= */}
              {/* CMS TAB 1: ARTICLES MANAGEMENT */}
              {/* ========================================================= */}
              {adminCmsTab === 'content_articles' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Gestion des Articles Pédagogiques</h3>
                      <p className="text-xs text-slate-500">Ajoutez, modifiez ou supprimez les articles consultables dans la bibliothèque.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingArticle(true);
                        setEditingArticle({
                          id: `art_${Date.now()}`,
                          slug: `article-${Date.now()}`,
                          title: 'Nouveau Titre d\'Article',
                          category: 'psychomotor',
                          categoryLabel: 'Développement Psychomoteur',
                          readingTime: '5 min',
                          icon: '🌊',
                          badge: 'Conseil Pratique',
                          summary: 'Résumé clair et concis de l\'article.',
                          tags: ['Éveil aquatique', 'Conseils'],
                          content: {
                            introduction: 'Introduction rédigée pour les parents.',
                            sections: [
                              {
                                title: '1. Recommandations et gestes clés',
                                paragraphs: ['Détaillez ici les conseils pour l\'accompagnement dans l\'eau.'],
                                keyPoints: ['Point essentiel à retenir']
                              }
                            ],
                            takeaways: ['Idée clé n°1']
                          }
                        });
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Nouvel Article</span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={articleSearchQuery}
                      onChange={(e) => setArticleSearchQuery(e.target.value)}
                      placeholder="Rechercher un article par titre, tag ou catégorie..."
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                    />
                  </div>

                  {/* Articles List Table / Cards */}
                  <div className="space-y-3">
                    {articles
                      .filter((a) =>
                        a.title.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
                        a.summary.toLowerCase().includes(articleSearchQuery.toLowerCase())
                      )
                      .map((art) => (
                        <div
                          key={art.id}
                          className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{art.icon || '📘'}</span>
                              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">{art.title}</h4>
                              <span className="px-2 py-0.5 bg-indigo-100 text-indigo-900 text-[10px] font-bold rounded-md shrink-0">
                                {art.categoryLabel || art.category}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{art.summary}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                selectedArticleForPhotoRef.current = art.id;
                                articlePhotoInputRef.current?.click();
                              }}
                              className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                              title="Changer l'image de l'article"
                            >
                              <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Image</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setIsCreatingArticle(false);
                                setEditingArticle({ ...art });
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Modifier</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Confirmer la suppression de l'article "${art.title}" ?`)) {
                                  articleService.deleteArticle(art.id);
                                  triggerFeedback(`Article supprimé avec succès.`);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Supprimer cet article"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* CMS TAB 2: EXERCISES MANAGEMENT */}
              {/* ========================================================= */}
              {adminCmsTab === 'library_exercises' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Gestion des Fiches & Exercices Aquatiques</h3>
                      <p className="text-xs text-slate-500">Personnalisez les consignes, erreurs courantes et corrections pédagogiques.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingExercise(true);
                        setEditingExercise({
                          id: `exo_${Date.now()}`,
                          title: 'Nouvel Exercice Aquatique',
                          objective: 'Favoriser l\'autonomie et la flottaison...',
                          level: 'decouverte',
                          recommendedAge: '4 - 18 mois',
                          situationCategory: 'portage',
                          steps: [
                            'Étape 1 : Mettre bébé en confiance',
                            'Étape 2 : Accompagner le mouvement avec douceur',
                            'Étape 3 : Féliciter et encourager'
                          ],
                          commonMistakes: ['Soutien trop rigide', 'Mouvements brusques'],
                          corrections: ['Relâcher les épaules', 'Observer la respiration du bébé'],
                          safetyTips: ['Maintenir un contact visuel rassurant'],
                          duration: '3 à 5 minutes',
                          tags: ['Portage', 'Confiance']
                        });
                      }}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Nouvel Exercice</span>
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={exerciseSearchQuery}
                      onChange={(e) => setExerciseSearchQuery(e.target.value)}
                      placeholder="Rechercher une fiche par titre ou situation..."
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                    />
                  </div>

                  {/* Exercise Cards */}
                  <div className="space-y-3">
                    {exercises
                      .filter((exo) =>
                        exo.title.toLowerCase().includes(exerciseSearchQuery.toLowerCase()) ||
                        exo.objective.toLowerCase().includes(exerciseSearchQuery.toLowerCase())
                      )
                      .map((exo) => (
                        <div
                          key={exo.id}
                          className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                        >
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate">{exo.title}</h4>
                              <span className="px-2 py-0.5 bg-sky-100 text-sky-900 text-[10px] font-bold rounded-md shrink-0 capitalize">
                                {exo.level}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-1">{exo.objective}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setIsCreatingExercise(false);
                                setEditingExercise({ ...exo });
                              }}
                              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>Modifier</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Confirmer la suppression de l'exercice "${exo.title}" ?`)) {
                                  exerciseService.deleteExercise(exo.id);
                                  triggerFeedback(`Exercice supprimé avec succès.`);
                                }
                              }}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Supprimer cet exercice"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* CMS TAB 3: USERS & VIP PROMO CODES */}
              {/* ========================================================= */}
              {adminCmsTab === 'users' && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h3 className="text-sm font-black text-slate-900">Comptes Utilisateurs & Attribution Premium</h3>
                    <p className="text-xs text-slate-500">Gérez le statut des comptes et les codes d'accès.</p>
                  </div>

                  {/* VIP Promo Code Widget */}
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100/80 p-5 rounded-2xl border border-amber-200 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Gift className="w-4 h-4 text-amber-700" />
                          <h4 className="text-sm font-black text-amber-950">Code Promo VIP : VIPGLG25</h4>
                        </div>
                        <p className="text-xs text-amber-800 mt-0.5">
                          Offre 1 mois d'accès gratuit calculé date à date.
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-amber-200 text-amber-950 font-black text-xs rounded-full">
                          {paymentService.getVipRemainingSpots()} / 25 places restantes
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            paymentService.resetVipRedemptions();
                            triggerFeedback('Les 25 places du code VIP ont été réinitialisées !');
                          }}
                          className="px-3 py-1.5 bg-white hover:bg-amber-50 text-amber-950 text-xs font-bold rounded-xl border border-amber-300 cursor-pointer flex items-center gap-1"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Réinitialiser à 25</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Users Directory Table */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 font-black text-xs text-slate-700 flex items-center justify-between">
                      <span>Comptes enregistrés ({registeredUsers.length})</span>
                      <button
                        type="button"
                        onClick={() => setRegisteredUsers(authService.getAllUsers())}
                        className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Actualiser</span>
                      </button>
                    </div>

                    <div className="divide-y divide-slate-100">
                      {registeredUsers.map((u) => {
                        const isUserPrem = u.role === 'USER_PREMIUM' || u.lifetimeAccess;
                        return (
                          <div key={u.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-extrabold text-xs text-slate-900">{u.name}</span>
                                <span className={`px-2 py-0.5 text-[10px] font-black rounded-md ${
                                  u.role === 'ADMIN'
                                    ? 'bg-indigo-100 text-indigo-900'
                                    : isUserPrem
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'bg-amber-100 text-amber-900'
                                }`}>
                                  {u.role === 'ADMIN' ? '👑 Admin' : isUserPrem ? '🟢 Premium' : '🔵 Free'}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500">{u.email}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              {u.role !== 'ADMIN' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const nextPrem = !isUserPrem;
                                    authService.adminSetUserPremium(u.email, nextPrem);
                                    setRegisteredUsers(authService.getAllUsers());
                                    triggerFeedback(`Statut de ${u.name} mis à jour (${nextPrem ? 'Premium' : 'Free'}).`);
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                                    isUserPrem
                                      ? 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  }`}
                                >
                                  {isUserPrem ? 'Retirer Premium' : 'Passer Premium'}
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* CMS TAB 4: VISUALS & TEXTS */}
              {/* ========================================================= */}
              {adminCmsTab === 'visuals_texts' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-slate-900">Textes Généraux & Bannières de l'Application</h3>
                      <p className="text-xs text-slate-500">Modifiez les slogans et bannières sans coder.</p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveInterfaceTexts} className="space-y-5">
                    {/* Hero Image replacement */}
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-black text-slate-900 block">Grande Image d'En-tête (Page d'accueil)</span>
                        <span className="text-xs text-slate-500">Remplacez la photo principale avec prévisualisation immédiate.</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => heroImageInputRef.current?.click()}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Téléverser une image</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Titre principal d'accueil</label>
                        <input
                          type="text"
                          value={settings.heroHeadline}
                          onChange={(e) => setSettings({ ...settings, heroHeadline: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Bannière d'annonce (Haut de page)</label>
                        <input
                          type="text"
                          value={settings.announcementText}
                          onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 block">Sous-titre d'accueil (Paragraphe)</label>
                      <textarea
                        rows={2}
                        value={settings.heroSubheadline}
                        onChange={(e) => setSettings({ ...settings, heroSubheadline: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Email de contact</label>
                        <input
                          type="email"
                          value={settings.supportEmail}
                          onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">Lien groupe Facebook</label>
                        <input
                          type="text"
                          value={settings.facebookGroupUrl}
                          onChange={(e) => setSettings({ ...settings, facebookGroupUrl: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          const res = interfaceSettingsService.resetSettings();
                          setSettings(res);
                          triggerFeedback('Textes réinitialisés aux valeurs par défaut.');
                        }}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Réinitialiser</span>
                      </button>

                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Save className="w-4 h-4" />
                        <span>Enregistrer les textes</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. ARTICLE EDIT / CREATE MODAL */}
      {/* ========================================================================= */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 border border-slate-200 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>{isCreatingArticle ? 'Créer un nouvel article' : 'Modifier l\'article'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingArticle(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                articleService.saveArticle(editingArticle);
                setEditingArticle(null);
                triggerFeedback(`Article "${editingArticle.title}" enregistré avec succès !`);
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Titre de l'article *</label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Catégorie</label>
                  <select
                    value={editingArticle.category}
                    onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                  >
                    <option value="psychomotor">Développement Psychomoteur</option>
                    <option value="safety">Sécurité & Prévention</option>
                    <option value="physiology">Physiologie & Réflexes</option>
                    <option value="parenting">Parentalité & Lien</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Temps de lecture</label>
                  <input
                    type="text"
                    value={editingArticle.readingTime}
                    onChange={(e) => setEditingArticle({ ...editingArticle, readingTime: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Résumé synthétique</label>
                <textarea
                  rows={2}
                  value={editingArticle.summary}
                  onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Introduction complète</label>
                <textarea
                  rows={4}
                  value={editingArticle.content?.introduction || ''}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      content: {
                        ...editingArticle.content!,
                        introduction: e.target.value,
                        sections: editingArticle.content?.sections || [],
                        takeaways: editingArticle.content?.takeaways || []
                      }
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingArticle(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Enregistrer l'article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. EXERCISE EDIT / CREATE MODAL */}
      {/* ========================================================================= */}
      {editingExercise && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-5 border border-slate-200 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>{isCreatingExercise ? 'Créer un nouvel exercice' : 'Modifier l\'exercice'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingExercise(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                exerciseService.saveExercise(editingExercise);
                setEditingExercise(null);
                triggerFeedback(`Exercice "${editingExercise.title}" enregistré avec succès !`);
              }}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Titre de l'exercice *</label>
                <input
                  type="text"
                  required
                  value={editingExercise.title}
                  onChange={(e) => setEditingExercise({ ...editingExercise, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Niveau</label>
                  <select
                    value={editingExercise.level}
                    onChange={(e) => setEditingExercise({ ...editingExercise, level: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                  >
                    <option value="decouverte">Découverte (4-9 mois)</option>
                    <option value="confiance">Confiance (9-15 mois)</option>
                    <option value="autonomie">Autonomie (15-24 mois)</option>
                    <option value="exploration">Exploration (24-36 mois)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">Âge recommandé</label>
                  <input
                    type="text"
                    value={editingExercise.recommendedAge}
                    onChange={(e) => setEditingExercise({ ...editingExercise, recommendedAge: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Objectif pédagogique</label>
                <textarea
                  rows={2}
                  value={editingExercise.objective}
                  onChange={(e) => setEditingExercise({ ...editingExercise, objective: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Erreurs courantes (1 par ligne)</label>
                <textarea
                  rows={2}
                  value={editingExercise.commonMistakes.join('\n')}
                  onChange={(e) =>
                    setEditingExercise({
                      ...editingExercise,
                      commonMistakes: e.target.value.split('\n').filter((l) => l.trim())
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">Corrections proposées (1 par ligne)</label>
                <textarea
                  rows={2}
                  value={editingExercise.corrections.join('\n')}
                  onChange={(e) =>
                    setEditingExercise({
                      ...editingExercise,
                      corrections: e.target.value.split('\n').filter((l) => l.trim())
                    })
                  }
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingExercise(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Enregistrer l'exercice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {babyToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 border border-slate-200 shadow-2xl animate-fade-in text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-slate-900">Supprimer ce profil ?</h4>
              <p className="text-xs text-slate-500">
                Cette action supprimera les données du profil bébé de votre appareil.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBabyToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteBaby(babyToDelete);
                  setBabyToDelete(null);
                  triggerFeedback('Profil supprimé.');
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
