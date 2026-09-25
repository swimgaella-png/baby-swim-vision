import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle2,
  XCircle,
  Clock,
  Star,
  Edit,
  Trash2,
  Search,
  Plus,
  AlertTriangle,
  MapPin,
  Globe,
  Phone,
  Mail,
  Shield,
  Eye,
  RotateCcw,
  Thermometer,
  Users,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Image,
  Upload,
  Crosshair,
  Send,
  Bell,
  Check,
  ArrowLeft,
  ArrowRight,
  Download,
  UploadCloud,
  X,
  Lock,
} from 'lucide-react';
import { Club, ClubStatus, ClubSubmissionNotification, DuplicateCheckResult } from '../types';
import { clubService, CLUB_ACTIVITY_CATEGORIES, CLUB_LANGUAGES } from '../services/clubService';
import { PinpointMapPicker } from './PinpointMapPicker';

interface AdminClubsManagerProps {
  onClubUpdated?: () => void;
  onClose?: () => void;
  initialTab?: ClubStatus | 'create' | 'notifications';
}

export const AdminClubsManager: React.FC<AdminClubsManagerProps> = ({
  onClubUpdated,
  onClose,
  initialTab = 'pending',
}) => {
  const [activeTab, setActiveTab] = useState<ClubStatus | 'create' | 'notifications'>(initialTab);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [counts, setCounts] = useState({ pending: 0, validated: 0, rejected: 0, inactive: 0, total: 0 });
  const [notifications, setNotifications] = useState<ClubSubmissionNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [rejectingClub, setRejectingClub] = useState<Club | null>(null);
  const [deletingClub, setDeletingClub] = useState<Club | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [rejectionReason, setRejectionReason] = useState<string>('Informations incomplètes ou non conformes aux critères pédagogiques.');
  const [feedback, setFeedback] = useState<string | null>(null);

  // Photo URL inputs
  const [createPhotoUrl, setCreatePhotoUrl] = useState<string>('');
  const [editPhotoUrl, setEditPhotoUrl] = useState<string>('');

  // Geocode loading states
  const [isGeocodingCreate, setIsGeocodingCreate] = useState<boolean>(false);
  const [isGeocodingEdit, setIsGeocodingEdit] = useState<boolean>(false);
  const [geocodeFeedbackCreate, setGeocodeFeedbackCreate] = useState<string | null>(null);
  const [geocodeFeedbackEdit, setGeocodeFeedbackEdit] = useState<string | null>(null);

  const [createForm, setCreateForm] = useState<Partial<Club>>({
    name: '',
    managerName: '',
    email: '',
    phone: '',
    website: '',
    bookingUrl: '',
    address: '',
    postalCode: '',
    city: '',
    region: '',
    country: 'France',
    latitude: undefined,
    longitude: undefined,
    description: '',
    activities: ['bebes_nageurs', 'eveil_aquatique'],
    minAgeMonths: 4,
    maxAgeMonths: 36,
    languages: ['fr'],
    groupType: 'collectif',
    team: '',
    qualifications: '',
    poolInformation: {
      waterTemperatureC: 32,
      poolType: "Bassin d'apprentissage chauffé",
      hygieneNotes: '',
    },
    accessibility: false,
    accessibilityDetails: '',
    logo: '',
    photos: [],
    status: 'validated',
    isRecommended: false,
  });

  const loadData = async () => {
    setLoading(true);
    const res = await clubService.getAdminClubs();
    setClubs(res.clubs);
    setCounts(res.counts);
    const notifs = await clubService.getSubmissionNotifications();
    setNotifications(notifs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const unsub = clubService.subscribe(loadData);
    return () => unsub();
  }, []);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 4000);
  };

  // Geocoding helper for Create form
  const handleGeocodeCreate = async () => {
    if (!createForm.city && !createForm.address) {
      setGeocodeFeedbackCreate('Veuillez au moins saisir la ville et l\'adresse.');
      return;
    }
    setIsGeocodingCreate(true);
    setGeocodeFeedbackCreate(null);
    const res = await clubService.geocodeAddress(
      createForm.address,
      createForm.postalCode,
      createForm.city,
      createForm.country
    );
    setIsGeocodingCreate(false);
    if (res.success && typeof res.lat === 'number' && typeof res.lng === 'number') {
      setCreateForm((prev) => ({
        ...prev,
        latitude: res.lat,
        longitude: res.lng,
      }));
      setGeocodeFeedbackCreate(`📍 Coordonnées précises trouvées : ${res.lat.toFixed(5)}, ${res.lng.toFixed(5)} (${res.precision || 'exact'})`);
    } else {
      setGeocodeFeedbackCreate('Impossible de géolocaliser précisément cette adresse. Vérifiez l\'orthographe.');
    }
  };

  // Geocoding helper for Edit form
  const handleGeocodeEdit = async () => {
    if (!editingClub || (!editingClub.city && !editingClub.address)) {
      setGeocodeFeedbackEdit('Veuillez au moins saisir la ville et l\'adresse.');
      return;
    }
    setIsGeocodingEdit(true);
    setGeocodeFeedbackEdit(null);
    const res = await clubService.geocodeAddress(
      editingClub.address,
      editingClub.postalCode,
      editingClub.city,
      editingClub.country
    );
    setIsGeocodingEdit(false);
    if (res.success && typeof res.lat === 'number' && typeof res.lng === 'number') {
      setEditingClub((prev) => (prev ? {
        ...prev,
        latitude: res.lat,
        longitude: res.lng,
      } : null));
      setGeocodeFeedbackEdit(`📍 Coordonnées précises trouvées : ${res.lat.toFixed(5)}, ${res.lng.toFixed(5)} (${res.precision || 'exact'})`);
    } else {
      setGeocodeFeedbackEdit('Impossible de géolocaliser précisément cette adresse.');
    }
  };

  // Photo handlers for Create Form
  const handleAddCreatePhotoUrl = () => {
    if (!createPhotoUrl.trim()) return;
    setCreateForm((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), createPhotoUrl.trim()],
    }));
    setCreatePhotoUrl('');
  };

  const handleRemoveCreatePhoto = (index: number) => {
    setCreateForm((prev) => ({
      ...prev,
      photos: (prev.photos || []).filter((_, i) => i !== index),
    }));
  };

  const handleCreateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCreateForm((prev) => ({
          ...prev,
          photos: [...(prev.photos || []), reader.result as string],
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Photo handlers for Edit Form
  const handleAddEditPhotoUrl = () => {
    if (!editPhotoUrl.trim() || !editingClub) return;
    setEditingClub({
      ...editingClub,
      photos: [...(editingClub.photos || []), editPhotoUrl.trim()],
    });
    setEditPhotoUrl('');
  };

  const handleRemoveEditPhoto = (index: number) => {
    if (!editingClub) return;
    setEditingClub({
      ...editingClub,
      photos: (editingClub.photos || []).filter((_, i) => i !== index),
    });
  };

  const handleSetCoverPhoto = (index: number) => {
    if (!editingClub || !editingClub.photos || index <= 0) return;
    const newPhotos = [...editingClub.photos];
    const [selectedPhoto] = newPhotos.splice(index, 1);
    newPhotos.unshift(selectedPhoto);
    setEditingClub({
      ...editingClub,
      photos: newPhotos,
    });
  };

  const handleMovePhoto = (fromIndex: number, toIndex: number) => {
    if (!editingClub || !editingClub.photos) return;
    if (toIndex < 0 || toIndex >= editingClub.photos.length) return;
    const newPhotos = [...editingClub.photos];
    const [moved] = newPhotos.splice(fromIndex, 1);
    newPhotos.splice(toIndex, 0, moved);
    setEditingClub({
      ...editingClub,
      photos: newPhotos,
    });
  };

  const handleEditFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingClub) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setEditingClub((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              photos: [...(prev.photos || []), reader.result as string],
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });
    // Reset file input
    e.target.value = '';
  };

  const handleValidate = async (clubId: string) => {
    const res = await clubService.updateClubStatus(clubId, 'validated');
    if (res.success) {
      showToast('Structure validée et publiée avec succès dans l\'annuaire !');
      loadData();
      onClubUpdated?.();
    }
  };

  const handleReject = async () => {
    if (!rejectingClub) return;
    const res = await clubService.updateClubStatus(rejectingClub.id, 'rejected', rejectionReason);
    if (res.success) {
      showToast('Structure refusée avec motif archivé.');
      setRejectingClub(null);
      loadData();
      onClubUpdated?.();
    }
  };

  const handleToggleStatus = async (club: Club) => {
    const nextStatus: ClubStatus = club.status === 'validated' ? 'inactive' : 'validated';
    const res = await clubService.updateClubStatus(club.id, nextStatus);
    if (res.success) {
      showToast(`Statut mis à jour : ${nextStatus === 'validated' ? 'Publié' : 'Inactif'}`);
      loadData();
      onClubUpdated?.();
    }
  };

  const handleToggleRecommend = async (clubId: string) => {
    const res = await clubService.toggleRecommendClub(clubId);
    if (res.success) {
      showToast(res.isRecommended ? 'Badge Recommandé activé ⭐' : 'Badge Recommandé retiré');
      loadData();
      onClubUpdated?.();
    }
  };

  const handleDelete = (club: Club) => {
    setDeletingClub(club);
  };

  const handleConfirmDelete = async () => {
    if (!deletingClub) return;
    setIsDeleting(true);
    const deletedId = deletingClub.id;
    const deletedName = deletingClub.name;
    // Optimistically remove from state so it disappears instantly
    setClubs((prev) => prev.filter((c) => c.id !== deletedId));
    const res = await clubService.deleteClub(deletedId);
    setIsDeleting(false);
    if (res.success) {
      showToast(`Structure « ${deletedName} » supprimée définitivement de la base de données.`);
      if (editingClub?.id === deletedId) {
        setEditingClub(null);
      }
      setDeletingClub(null);
      loadData();
      onClubUpdated?.();
    } else {
      showToast(res.error || 'Erreur lors de la suppression de la structure.');
      loadData();
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClub) return;
    const res = await clubService.saveClub(editingClub);
    if (res.success) {
      showToast('Fiche du club modifiée et enregistrée avec succès !');
      setEditingClub(null);
      loadData();
      onClubUpdated?.();
    }
  };

  const handleCreateNewClub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.name || !createForm.city || !createForm.country) {
      alert('Nom, ville et pays sont obligatoires.');
      return;
    }
    const res = await clubService.saveClub({
      ...createForm,
      createdByAdmin: true,
      isLockedByAdmin: true,
      status: 'validated',
    });
    if (res.success) {
      showToast('Nouveau club ajouté et publié avec succès avec ses photos !');
      setActiveTab('validated');
      loadData();
      onClubUpdated?.();
    }
  };

  const handleExportBackup = async () => {
    const ok = await clubService.downloadBackup();
    if (ok) {
      showToast('Sauvegarde de l\'annuaire téléchargée avec succès !');
    } else {
      showToast('Erreur lors du téléchargement de la sauvegarde.');
    }
  };

  const handleImportBackup = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await clubService.restoreBackup(json);
      if (res.success) {
        showToast(res.message || 'Sauvegarde restaurée avec succès !');
        loadData();
        onClubUpdated?.();
      } else {
        showToast(res.message || 'Erreur lors de la restauration du fichier.');
      }
    } catch (err: any) {
      showToast('Fichier JSON invalide : ' + (err.message || 'Format incorrect'));
    }
    e.target.value = '';
  };

  const filteredClubs = clubs.filter((c) => {
    if (activeTab !== 'create' && activeTab !== 'notifications' && c.status !== activeTab) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      (c.address && c.address.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Admin Navigation & Persistence Toolbar */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-sky-800/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-sky-500/20 text-sky-300 border border-sky-400/30">
              Espace Administrateur
            </span>
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Synchronisation permanente active
            </span>
          </div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-400" />
            Gestion des Clubs & Structures
          </h2>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Validez les suggestions d'utilisateurs pour les rendre visibles, ajoutez vos propres structures et gérez les fiches. Toutes vos modifications sont verrouillées et protégées contre toute réinitialisation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('create')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              activeTab === 'create'
                ? 'bg-sky-500 text-white shadow-sky-500/30'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une structure</span>
          </button>

          <button
            type="button"
            onClick={handleExportBackup}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
            title="Télécharger une sauvegarde JSON complète de l'annuaire"
          >
            <Download className="w-3.5 h-3.5 text-sky-300" />
            <span>Sauvegarder</span>
          </button>

          <label
            className="px-3 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer border border-white/10"
            title="Restaurer un fichier de sauvegarde JSON"
          >
            <UploadCloud className="w-3.5 h-3.5 text-amber-300" />
            <span>Restaurer</span>
            <input
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportBackup}
            />
          </label>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Fermer l'espace d'administration"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      {/* Toast Feedback */}
      {feedback && (
        <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-lg flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-white/80 hover:text-white cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Header Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <button
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'pending'
              ? 'bg-amber-500/10 border-amber-500 shadow-md ring-2 ring-amber-500/20'
              : 'bg-white border-slate-200 hover:border-amber-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-amber-700">À valider</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{counts.pending}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">En attente de validation</p>
        </button>

        <button
          onClick={() => setActiveTab('validated')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'validated'
              ? 'bg-emerald-500/10 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-700">Publiés</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{counts.validated}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Visibles dans l'annuaire</p>
        </button>

        <button
          onClick={() => setActiveTab('inactive')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'inactive'
              ? 'bg-slate-500/10 border-slate-500 shadow-md ring-2 ring-slate-500/20'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-slate-700">Inactifs</span>
            <RotateCcw className="w-4 h-4 text-slate-500" />
          </div>
          <span className="text-2xl font-black text-slate-900">{counts.inactive}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Masqués au public</p>
        </button>

        <button
          onClick={() => setActiveTab('rejected')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
            activeTab === 'rejected'
              ? 'bg-rose-500/10 border-rose-500 shadow-md ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200 hover:border-rose-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-rose-700">Refusés</span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{counts.rejected}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Non retenus</p>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer col-span-2 sm:col-span-1 ${
            activeTab === 'notifications'
              ? 'bg-sky-500/10 border-sky-500 shadow-md ring-2 ring-sky-500/20'
              : 'bg-white border-slate-200 hover:border-sky-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-sky-700">Emails Gaëlla</span>
            <Mail className="w-4 h-4 text-sky-600" />
          </div>
          <span className="text-2xl font-black text-slate-900">{notifications.length}</span>
          <p className="text-[10px] text-slate-500 mt-0.5">Notifs swimgaella@gmail.com</p>
        </button>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            ⏳ À valider ({counts.pending})
          </button>
          <button
            onClick={() => setActiveTab('validated')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'validated'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            ✅ Publiés ({counts.validated})
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'inactive'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            ⏸ Inactifs ({counts.inactive})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'rejected'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            ❌ Refusés ({counts.rejected})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'notifications'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Emails envoyés</span>
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'create'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter avec photos</span>
          </button>
        </div>

        {activeTab !== 'create' && activeTab !== 'notifications' && (
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filtrer nom, ville, adresse..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>
        )}
      </div>

      {/* Tab Contents: Notifications Log */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Journal des notifications email transmises à swimgaella@gmail.com
                </h3>
                <p className="text-xs text-slate-500">
                  Chaque soumission de club déclenche l'envoi d'une notification pour approbation
                </p>
              </div>
            </div>
            <a
              href="mailto:swimgaella@gmail.com"
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ouvrir boîte Gaëlla</span>
            </a>
          </div>

          {notifications.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
              Aucune notification enregistrée pour le moment. Dès qu'un club sera soumis, l'email apparaîtra ici.
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-slate-900">{n.clubName}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
                        Destinataire : {n.sentTo}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        n.status === 'sent' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {n.status === 'sent' ? '✅ Email expédié' : '📝 Enregistré & loggé'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">
                      📍 {n.city}, {n.country} • Responsable : {n.managerName || 'Non renseigné'} • Contact : {n.email || n.phone || 'Non renseigné'}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Reçu le : {new Date(n.submittedAt).toLocaleString('fr-FR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setActiveTab('pending');
                        const found = clubs.find((c) => c.id === n.clubId);
                        if (found) setEditingClub(found);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Examiner la fiche</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Contents: Create Form */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-9 h-9 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-900">
                Ajouter une structure avec photos et localisation exacte
              </h3>
              <p className="text-xs text-slate-500">
                Création directe validée par l'administrateur
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateNewClub} className="space-y-6">
            {/* General Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom du club / piscine / structure *
                </label>
                <input
                  type="text"
                  required
                  value={createForm.name}
                  onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
                  placeholder="Ex: Club Les Bébés Dauphins"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nom du responsable / maître-nageur
                </label>
                <input
                  type="text"
                  value={createForm.managerName}
                  onChange={(e) => setCreateForm({ ...createForm, managerName: e.target.value })}
                  placeholder="Ex: Gaëlla Le Gall"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email de contact pro
                </label>
                <input
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                  placeholder="contact@bebesdauphins.fr"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Téléphone direct
                </label>
                <input
                  type="tel"
                  value={createForm.phone}
                  onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })}
                  placeholder="02 98 55 00 00"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Site internet officiel
                </label>
                <input
                  type="url"
                  value={createForm.website}
                  onChange={(e) => setCreateForm({ ...createForm, website: e.target.value })}
                  placeholder="https://www.bebesdauphins.fr"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            {/* Address & Precise Geocoding */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Adresse (numéro et rue) *
                  </label>
                  <input
                    type="text"
                    value={createForm.address}
                    onChange={(e) => setCreateForm({ ...createForm, address: e.target.value })}
                    placeholder="Ex: Avenue du Rouillen"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Code Postal
                  </label>
                  <input
                    type="text"
                    value={createForm.postalCode}
                    onChange={(e) => setCreateForm({ ...createForm, postalCode: e.target.value })}
                    placeholder="Ex: 29500"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.city}
                    onChange={(e) => setCreateForm({ ...createForm, city: e.target.value })}
                    placeholder="Ex: Ergué-Gabéric"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Pays *
                  </label>
                  <input
                    type="text"
                    required
                    value={createForm.country}
                    onChange={(e) => setCreateForm({ ...createForm, country: e.target.value })}
                    placeholder="Ex: France"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Pinpoint Map GPS Picker */}
              <PinpointMapPicker
                latitude={createForm.latitude}
                longitude={createForm.longitude}
                address={createForm.address}
                postalCode={createForm.postalCode}
                city={createForm.city}
                country={createForm.country}
                onChange={(coords) => {
                  setCreateForm((prev) => ({
                    ...prev,
                    latitude: coords.lat,
                    longitude: coords.lng,
                    address: coords.address || prev.address,
                    postalCode: coords.postalCode || prev.postalCode,
                    city: coords.city || prev.city,
                  }));
                }}
              />
            </div>

            {/* Photos Management Section */}
            <div className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200/60 space-y-4">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-xs text-amber-900">Photos de la structure & du bassin</span>
              </div>

              {/* Photo Gallery Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(createForm.photos || []).map((photoUrl, idx) => (
                  <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white aspect-video flex items-center justify-center">
                    <img
                      src={photoUrl}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    {idx === 0 && (
                      <span className="absolute top-1.5 left-1.5 bg-sky-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        Couverture
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveCreatePhoto(idx)}
                      className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-rose-600 text-white opacity-90 hover:opacity-100 shadow-md cursor-pointer transition-opacity"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {/* Upload Button */}
                <label className="border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-50 rounded-xl aspect-video flex flex-col items-center justify-center gap-1 text-amber-800 text-[11px] font-bold cursor-pointer transition-colors p-2 text-center">
                  <Upload className="w-5 h-5 text-amber-600" />
                  <span>Importer un fichier</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCreateFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Add by URL */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="url"
                  value={createPhotoUrl}
                  onChange={(e) => setCreatePhotoUrl(e.target.value)}
                  placeholder="Ou collez l'URL d'une image (https://...)"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                />
                <button
                  type="button"
                  onClick={handleAddCreatePhotoUrl}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shrink-0"
                >
                  Ajouter l'URL
                </button>
              </div>
            </div>

            {/* Description & Pool Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description pédagogique
                </label>
                <textarea
                  rows={3}
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                  placeholder="Présentation des séances, encadrement bienveillant, pédagogie..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Température de l'eau (°C)
                </label>
                <input
                  type="number"
                  value={createForm.poolInformation?.waterTemperatureC || 32}
                  onChange={(e) => setCreateForm({
                    ...createForm,
                    poolInformation: {
                      ...createForm.poolInformation,
                      waterTemperatureC: parseFloat(e.target.value) || 32,
                    },
                  })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Âge minimum (mois)
                </label>
                <input
                  type="number"
                  value={createForm.minAgeMonths || 4}
                  onChange={(e) => setCreateForm({ ...createForm, minAgeMonths: parseInt(e.target.value) || 4 })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Âge maximum (mois)
                </label>
                <input
                  type="number"
                  value={createForm.maxAgeMonths || 36}
                  onChange={(e) => setCreateForm({ ...createForm, maxAgeMonths: parseInt(e.target.value) || 36 })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={createForm.isRecommended}
                  onChange={(e) => setCreateForm({ ...createForm, isRecommended: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500"
                />
                <span>⭐ Marquer comme « Recommandé Baby Swim Vision »</span>
              </label>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setActiveTab('validated')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Enregistrer & Publier la fiche
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab Contents: List of Clubs */}
      {activeTab !== 'create' && activeTab !== 'notifications' && (
        <div className="space-y-3">
          {filteredClubs.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-dashed border-slate-200 text-slate-500 text-xs">
              Aucune structure trouvée dans cette catégorie.
            </div>
          ) : (
            filteredClubs.map((club) => (
              <div
                key={club.id}
                className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-slate-300"
              >
                {/* Thumbnail Preview */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 shrink-0 overflow-hidden border border-slate-200 flex items-center justify-center">
                    {club.photos && club.photos.length > 0 ? (
                      <img
                        src={club.photos[0]}
                        alt={club.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <Building2 className="w-7 h-7 text-slate-400" />
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-base text-slate-900">
                        {club.name}
                      </h4>
                      {club.isRecommended && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          Recommandé
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          club.status === 'validated'
                            ? 'bg-emerald-100 text-emerald-800'
                            : club.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : club.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {club.status}
                      </span>
                      {club.photos && club.photos.length > 0 && (
                        <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md font-bold">
                          🖼️ {club.photos.length} photo(s)
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {club.address ? `${club.address}, ` : ''}{club.postalCode ? `${club.postalCode} ` : ''}{club.city}, {club.country}
                      </span>
                      {typeof club.latitude === 'number' && typeof club.longitude === 'number' && (
                        <span className="text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-mono">
                          📍 GPS : {club.latitude.toFixed(4)}, {club.longitude.toFixed(4)}
                        </span>
                      )}
                      {club.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          {club.email}
                        </span>
                      )}
                      {club.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {club.phone}
                        </span>
                      )}
                    </div>

                    {club.status === 'rejected' && club.rejectionReason && (
                      <div className="text-[11px] text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg">
                        <strong>Motif de refus :</strong> {club.rejectionReason}
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400">
                      Soumis le : {new Date(club.submittedAt).toLocaleDateString('fr-FR')}
                      {club.validatedAt && ` • Validé le : ${new Date(club.validatedAt).toLocaleDateString('fr-FR')}`}
                    </div>
                  </div>
                </div>

                {/* Actions Toolbar */}
                <div className="flex flex-wrap items-center gap-1.5 shrink-0 self-end md:self-center">
                  {club.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleValidate(club.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shadow-xs cursor-pointer"
                        title="Valider et publier dans l'annuaire"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Valider</span>
                      </button>

                      <button
                        onClick={() => setRejectingClub(club)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 border border-rose-200 cursor-pointer"
                        title="Refuser la proposition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Refuser</span>
                      </button>
                    </>
                  )}

                  {club.status === 'validated' && (
                    <button
                      onClick={() => handleToggleRecommend(club.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1 cursor-pointer ${
                        club.isRecommended
                          ? 'bg-amber-100 border-amber-300 text-amber-900'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50'
                      }`}
                      title="Activer ou désactiver le badge recommandé"
                    >
                      <Star className={`w-3.5 h-3.5 ${club.isRecommended ? 'fill-amber-500 text-amber-500' : ''}`} />
                      <span>{club.isRecommended ? 'Recommandé' : 'Recommander'}</span>
                    </button>
                  )}

                  {(club.status === 'validated' || club.status === 'inactive') && (
                    <button
                      onClick={() => handleToggleStatus(club)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {club.status === 'validated' ? 'Désactiver' : 'Réactiver'}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setEditingClub(club);
                      setGeocodeFeedbackEdit(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                    title="Modifier la fiche et les photos"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Modifier</span>
                  </button>

                  <button
                    onClick={() => handleDelete(club)}
                    className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                    title="Supprimer définitivement la structure"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Refusal Reason Modal */}
      {rejectingClub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Refuser la structure « {rejectingClub.name} »
            </h3>
            <p className="text-xs text-slate-600">
              Veuillez préciser le motif du refus pour conservation administrative :
            </p>
            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectingClub(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Confirmer le refus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Club Full Modal with Photos & Geocoding */}
      {editingClub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900">
                  Modifier la fiche : {editingClub.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Gestion des photos, des informations et de la géolocalisation exacte
                </p>
              </div>
              <button onClick={() => setEditingClub(null)} className="p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer">
                <XCircle className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-6">
              {/* General Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700">Nom de la structure *</label>
                  <input
                    type="text"
                    required
                    value={editingClub.name}
                    onChange={(e) => setEditingClub({ ...editingClub, name: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Responsable / Éducateur</label>
                  <input
                    type="text"
                    value={editingClub.managerName || ''}
                    onChange={(e) => setEditingClub({ ...editingClub, managerName: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Email professionnel</label>
                  <input
                    type="email"
                    value={editingClub.email || ''}
                    onChange={(e) => setEditingClub({ ...editingClub, email: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Téléphone</label>
                  <input
                    type="tel"
                    value={editingClub.phone || ''}
                    onChange={(e) => setEditingClub({ ...editingClub, phone: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Site web</label>
                  <input
                    type="url"
                    value={editingClub.website || ''}
                    onChange={(e) => setEditingClub({ ...editingClub, website: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Exact Geolocation Box */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-700">Adresse complète (rue & numéro)</label>
                    <input
                      type="text"
                      value={editingClub.address}
                      onChange={(e) => setEditingClub({ ...editingClub, address: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700">Code postal</label>
                    <input
                      type="text"
                      value={editingClub.postalCode || ''}
                      onChange={(e) => setEditingClub({ ...editingClub, postalCode: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700">Ville *</label>
                    <input
                      type="text"
                      required
                      value={editingClub.city}
                      onChange={(e) => setEditingClub({ ...editingClub, city: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-700">Pays *</label>
                    <input
                      type="text"
                      required
                      value={editingClub.country}
                      onChange={(e) => setEditingClub({ ...editingClub, country: e.target.value })}
                      className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* Interactive Pinpoint Map Picker for Edit Modal */}
                <PinpointMapPicker
                  latitude={editingClub.latitude}
                  longitude={editingClub.longitude}
                  address={editingClub.address}
                  postalCode={editingClub.postalCode}
                  city={editingClub.city}
                  country={editingClub.country}
                  onChange={(coords) => {
                    setEditingClub((prev) => (prev ? {
                      ...prev,
                      latitude: coords.lat,
                      longitude: coords.lng,
                      address: coords.address || prev.address,
                      postalCode: coords.postalCode || prev.postalCode,
                      city: coords.city || prev.city,
                    } : null));
                  }}
                />
              </div>

              {/* Photos Management Section in Edit Modal */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Image className="w-4 h-4 text-amber-600" />
                    <span className="font-bold text-xs text-amber-900">Photos de la structure (Galerie)</span>
                  </div>
                  <span className="text-[11px] text-amber-700 font-medium">
                    {(editingClub.photos || []).length} photo(s) • La 1ère photo sert de couverture
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(editingClub.photos || []).map((photoUrl, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-white aspect-video flex items-center justify-center shadow-xs">
                      <img
                        src={photoUrl}
                        alt={`Photo ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      {idx === 0 ? (
                        <span className="absolute top-1.5 left-1.5 bg-sky-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-white" />
                          Couverture
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSetCoverPhoto(idx)}
                          className="absolute top-1.5 left-1.5 p-1 rounded-md bg-slate-900/80 hover:bg-sky-600 text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-xs flex items-center gap-1 cursor-pointer"
                          title="Définir comme photo principale"
                        >
                          <Star className="w-2.5 h-2.5" />
                          <span>Couverture</span>
                        </button>
                      )}

                      {/* Move left / right buttons */}
                      <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMovePhoto(idx, idx - 1)}
                            className="p-1 rounded bg-slate-900/80 hover:bg-slate-900 text-white cursor-pointer shadow-xs"
                            title="Déplacer vers la gauche"
                          >
                            <ArrowLeft className="w-2.5 h-2.5" />
                          </button>
                        )}
                        {idx < (editingClub.photos?.length || 0) - 1 && (
                          <button
                            type="button"
                            onClick={() => handleMovePhoto(idx, idx + 1)}
                            className="p-1 rounded bg-slate-900/80 hover:bg-slate-900 text-white cursor-pointer shadow-xs"
                            title="Déplacer vers la droite"
                          >
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveEditPhoto(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white opacity-90 hover:opacity-100 shadow-md cursor-pointer transition-opacity"
                        title="Supprimer cette photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  <label className="border-2 border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-50 rounded-xl aspect-video flex flex-col items-center justify-center gap-1 text-amber-800 text-[11px] font-bold cursor-pointer transition-colors p-2 text-center">
                    <Upload className="w-5 h-5 text-amber-600" />
                    <span>Ajouter photo(s)</span>
                    <span className="text-[9px] text-amber-600 font-normal">Fichiers ou galerie</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleEditFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    value={editPhotoUrl}
                    onChange={(e) => setEditPhotoUrl(e.target.value)}
                    placeholder="Ajouter une photo par lien URL (https://...)"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddEditPhotoUrl}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs cursor-pointer shrink-0"
                  >
                    Ajouter URL
                  </button>
                </div>
              </div>

              {/* Description & Pool Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="sm:col-span-3">
                  <label className="font-bold text-slate-700">Description</label>
                  <textarea
                    rows={3}
                    value={editingClub.description}
                    onChange={(e) => setEditingClub({ ...editingClub, description: e.target.value })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Température de l'eau (°C)</label>
                  <input
                    type="number"
                    value={editingClub.poolInformation?.waterTemperatureC || 32}
                    onChange={(e) => setEditingClub({
                      ...editingClub,
                      poolInformation: {
                        ...editingClub.poolInformation,
                        waterTemperatureC: parseFloat(e.target.value) || 32,
                      },
                    })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Âge min (mois)</label>
                  <input
                    type="number"
                    value={editingClub.minAgeMonths}
                    onChange={(e) => setEditingClub({ ...editingClub, minAgeMonths: parseInt(e.target.value) || 4 })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Âge max (mois)</label>
                  <input
                    type="number"
                    value={editingClub.maxAgeMonths}
                    onChange={(e) => setEditingClub({ ...editingClub, maxAgeMonths: parseInt(e.target.value) || 36 })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700">Statut de validation</label>
                  <select
                    value={editingClub.status}
                    onChange={(e) => setEditingClub({ ...editingClub, status: e.target.value as any })}
                    className="w-full mt-1 p-2.5 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="validated">Validé & Publié</option>
                    <option value="pending">En attente de validation</option>
                    <option value="inactive">Inactif (masqué)</option>
                    <option value="rejected">Refusé</option>
                  </select>
                </div>

                <div className="flex items-center pt-5 sm:col-span-2">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={editingClub.isRecommended}
                      onChange={(e) => setEditingClub({ ...editingClub, isRecommended: e.target.checked })}
                      className="w-4 h-4 rounded text-amber-500"
                    />
                    <span>⭐ Recommandé Baby Swim Vision</span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeletingClub(editingClub)}
                  className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 border border-rose-200 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Supprimer cette structure</span>
                </button>

                <div className="flex items-center gap-2.5 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingClub(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md cursor-pointer"
                  >
                    Enregistrer les modifications
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {deletingClub && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-rose-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Supprimer la structure ?
                </h3>
                <p className="text-xs text-rose-600 font-semibold">
                  Action définitive et irréversible
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <p className="font-bold text-slate-900 text-sm">{deletingClub.name}</p>
              <p className="text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {deletingClub.address ? `${deletingClub.address}, ` : ''}{deletingClub.city}, {deletingClub.country}
              </p>
              {deletingClub.email && (
                <p className="text-slate-500 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {deletingClub.email}
                </p>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement cette structure de l'annuaire et de la base de données ?
            </p>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingClub(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isDeleting ? 'Suppression...' : 'Oui, supprimer définitivement'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
