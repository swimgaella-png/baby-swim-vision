import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  MapPin,
  Compass,
  Filter,
  SlidersHorizontal,
  Plus,
  Star,
  Layers,
  Map,
  X,
  RotateCcw,
  Sparkles,
  Building2,
  Users,
  Clock,
  Thermometer,
  ShieldCheck,
  ChevronDown,
  Shield,
  Lock,
  Download,
  UploadCloud,
  CheckCircle2,
  XCircle,
  Trash2,
  Edit,
  AlertTriangle,
} from 'lucide-react';
import { Club, BabyProfile, ClubStatus } from '../types';
import { clubService, calculateDistanceKm, CLUB_ACTIVITY_CATEGORIES, CLUB_LANGUAGES } from '../services/clubService';
import { ClubCard } from './ClubCard';
import { ClubDetailModal } from './ClubDetailModal';
import { SubmitClubModal } from './SubmitClubModal';
import { ClubMapView } from './ClubMapView';
import { AdminClubsManager } from './AdminClubsManager';
import { useTranslation } from '../i18n/LanguageContext';
import { useAdminMode } from '../context/AdminModeContext';

interface FindClubViewProps {
  activeBaby?: BabyProfile | null;
  onNavigateHome?: () => void;
}

export const FindClubView: React.FC<FindClubViewProps> = ({
  activeBaby,
  onNavigateHome,
}) => {
  const { t } = useTranslation();
  const { isAdminModeActive } = useAdminMode();

  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');

  // Admin specific states
  const [adminTab, setAdminTab] = useState<'validated' | 'pending' | 'all'>('validated');
  const [adminCounts, setAdminCounts] = useState({ pending: 0, validated: 0, rejected: 0, inactive: 0, total: 0 });
  const [isAdminManagerOpen, setIsAdminManagerOpen] = useState<boolean>(false);
  const [adminManagerInitialTab, setAdminManagerInitialTab] = useState<ClubStatus | 'create' | 'notifications'>('pending');
  const [adminToast, setAdminToast] = useState<string | null>(null);
  const [deletingClub, setDeletingClub] = useState<Club | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [rejectingClub, setRejectingClub] = useState<Club | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string>('Informations incomplètes ou critères pédagogiques non vérifiés.');

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<string>('all');
  const [selectedAgeMonths, setSelectedAgeMonths] = useState<number | 'all'>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [selectedGroupType, setSelectedGroupType] = useState<string>('all');
  const [filterPmrOnly, setFilterPmrOnly] = useState<boolean>(false);
  const [filterRecommendedOnly, setFilterRecommendedOnly] = useState<boolean>(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState<boolean>(false);

  // Geolocation & Distance
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [radiusKm, setRadiusKm] = useState<number>(50);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Modals
  const [selectedClubForDetail, setSelectedClubForDetail] = useState<Club | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setAdminToast(msg);
    setTimeout(() => {
      setAdminToast(null);
    }, 4500);
  };

  const fetchClubs = async () => {
    setLoading(true);
    try {
      if (isAdminModeActive) {
        const adminData = await clubService.getAdminClubs();
        setAdminCounts(adminData.counts);
        if (adminData.clubs && adminData.clubs.length > 0) {
          setClubs(adminData.clubs);
        } else {
          const fallback = await clubService.getValidatedClubs();
          setClubs(fallback);
        }
      } else {
        const data = await clubService.getValidatedClubs();
        setClubs(data);
      }
    } catch (err) {
      console.warn('Error fetching clubs in FindClubView:', err);
      const fallback = await clubService.getValidatedClubs();
      setClubs(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
    const unsub = clubService.subscribe(fetchClubs);
    return () => unsub();
  }, [isAdminModeActive]);

  // Request browser geolocation
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('La géolocalisation n\'est pas supportée par votre navigateur.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationError('Permission refusée. Vous pouvez rechercher manuellement par ville ou pays.');
        } else {
          setLocationError('Impossible d\'obtenir votre position actuelle.');
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleResetLocation = () => {
    setUserLocation(null);
    setLocationError(null);
  };

  // Admin Quick Actions
  const handleQuickValidate = async (club: Club) => {
    const res = await clubService.updateClubStatus(club.id, 'validated');
    if (res.success) {
      showToast(`La structure « ${club.name} » a été validée et est désormais visible par tous les utilisateurs !`);
      fetchClubs();
    } else {
      showToast(res.error || 'Erreur lors de la validation.');
    }
  };

  const handleQuickToggleRecommend = async (club: Club) => {
    const res = await clubService.toggleRecommendClub(club.id);
    if (res.success) {
      showToast(
        res.isRecommended
          ? `« ${club.name} » est désormais marqué comme Recommandé Baby Swim !`
          : `Recommandation retirée pour « ${club.name} »`
      );
      fetchClubs();
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingClub) return;
    setIsDeleting(true);
    const clubName = deletingClub.name;
    const res = await clubService.deleteClub(deletingClub.id);
    setIsDeleting(false);
    if (res.success) {
      showToast(`Structure « ${clubName} » supprimée définitivement de l'annuaire.`);
      setDeletingClub(null);
      if (selectedClubForDetail?.id === deletingClub.id) {
        setSelectedClubForDetail(null);
      }
      fetchClubs();
    } else {
      showToast(res.error || 'Erreur lors de la suppression.');
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingClub) return;
    const res = await clubService.updateClubStatus(rejectingClub.id, 'rejected', rejectionReason);
    if (res.success) {
      showToast(`Suggestion « ${rejectingClub.name} » refusée.`);
      setRejectingClub(null);
      fetchClubs();
    } else {
      showToast(res.error || 'Erreur lors du refus.');
    }
  };

  const handleExportBackup = async () => {
    const ok = await clubService.downloadBackup();
    if (ok) {
      showToast('Sauvegarde JSON de l\'annuaire téléchargée avec succès !');
    } else {
      showToast('Erreur lors de la génération de la sauvegarde.');
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
        fetchClubs();
      } else {
        showToast(res.message || 'Erreur lors de la restauration.');
      }
    } catch (err: any) {
      showToast('Format JSON invalide : ' + (err.message || 'Fichier corrompu'));
    }
    e.target.value = '';
  };

  // Available countries & cities list from loaded clubs
  const availableCountries = useMemo(() => {
    const set = new Set<string>();
    clubs.forEach((c) => {
      if (c.country) set.add(c.country);
    });
    return Array.from(set).sort();
  }, [clubs]);

  const availableCities = useMemo(() => {
    const set = new Set<string>();
    clubs.forEach((c) => {
      if (selectedCountry === 'all' || c.country === selectedCountry) {
        if (c.city) set.add(c.city);
      }
    });
    return Array.from(set).sort();
  }, [clubs, selectedCountry]);

  // Filtered & Sorted Clubs
  const filteredClubs = useMemo(() => {
    return clubs
      .filter((club) => {
        // In admin mode, respect the adminTab selection
        if (isAdminModeActive) {
          if (adminTab === 'validated' && club.status !== 'validated') return false;
          if (adminTab === 'pending' && club.status !== 'pending') return false;
        } else {
          // Regular users only see validated
          if (club.status !== 'validated') return false;
        }
        return true;
      })
      .map((club) => {
        let distance: number | undefined = undefined;
        if (userLocation && typeof club.latitude === 'number' && typeof club.longitude === 'number') {
          distance = calculateDistanceKm(
            userLocation.lat,
            userLocation.lng,
            club.latitude,
            club.longitude
          );
        }
        return { ...club, distanceKm: distance };
      })
      .filter((club) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = club.name.toLowerCase().includes(q);
          const matchCity = club.city.toLowerCase().includes(q);
          const matchCountry = club.country.toLowerCase().includes(q);
          const matchAddress = club.address ? club.address.toLowerCase().includes(q) : false;
          const matchPostal = club.postalCode ? club.postalCode.includes(q) : false;
          if (!matchName && !matchCity && !matchCountry && !matchAddress && !matchPostal) {
            return false;
          }
        }

        // Country
        if (selectedCountry !== 'all' && club.country.toLowerCase() !== selectedCountry.toLowerCase()) {
          return false;
        }

        // City
        if (selectedCity !== 'all' && club.city.toLowerCase() !== selectedCity.toLowerCase()) {
          return false;
        }

        // Activity
        if (selectedActivity !== 'all' && !(club.activities || []).includes(selectedActivity)) {
          return false;
        }

        // Baby Age
        if (typeof selectedAgeMonths === 'number') {
          const minAge = typeof club.minAgeMonths === 'number' ? club.minAgeMonths : 0;
          const maxAge = typeof club.maxAgeMonths === 'number' ? club.maxAgeMonths : 36;
          if (selectedAgeMonths < minAge || selectedAgeMonths > maxAge) {
            return false;
          }
        }

        // Language
        if (selectedLanguage !== 'all' && !(club.languages || []).includes(selectedLanguage)) {
          return false;
        }

        // Group type
        if (selectedGroupType !== 'all' && club.groupType && club.groupType !== selectedGroupType && club.groupType !== 'mixte') {
          return false;
        }

        // PMR
        if (filterPmrOnly && !club.accessibility) {
          return false;
        }

        // Recommended only
        if (filterRecommendedOnly && !club.isRecommended) {
          return false;
        }

        // Distance radius filter
        if (userLocation && typeof club.distanceKm === 'number' && radiusKm > 0) {
          if (club.distanceKm > radiusKm) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // If viewing pending suggestions in admin mode, show newest first
        if (isAdminModeActive && adminTab === 'pending') {
          return (b.submittedAt || b.createdAt || '').localeCompare(a.submittedAt || a.createdAt || '');
        }
        // 1. Distance if user location enabled
        if (userLocation && typeof a.distanceKm === 'number' && typeof b.distanceKm === 'number') {
          return a.distanceKm - b.distanceKm;
        }
        // 2. Recommended first
        if (a.isRecommended && !b.isRecommended) return -1;
        if (!a.isRecommended && b.isRecommended) return 1;
        // 3. Alphabetical
        return a.name.localeCompare(b.name);
      });
  }, [
    clubs,
    isAdminModeActive,
    adminTab,
    searchQuery,
    selectedCountry,
    selectedCity,
    selectedActivity,
    selectedAgeMonths,
    selectedLanguage,
    selectedGroupType,
    filterPmrOnly,
    filterRecommendedOnly,
    userLocation,
    radiusKm,
  ]);

  const activeFiltersCount = [
    selectedCountry !== 'all',
    selectedCity !== 'all',
    selectedActivity !== 'all',
    selectedAgeMonths !== 'all',
    selectedLanguage !== 'all',
    selectedGroupType !== 'all',
    filterPmrOnly,
    filterRecommendedOnly,
    Boolean(userLocation),
  ].filter(Boolean).length;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCountry('all');
    setSelectedCity('all');
    setSelectedActivity('all');
    setSelectedAgeMonths('all');
    setSelectedLanguage('all');
    setSelectedGroupType('all');
    setFilterPmrOnly(false);
    setFilterRecommendedOnly(false);
    setUserLocation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50/50 via-white to-slate-50 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Admin Toast Notification */}
        {adminToast && (
          <div className="p-4 rounded-2xl bg-emerald-600 text-white font-bold text-xs sm:text-sm shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{adminToast}</span>
            </div>
            <button
              onClick={() => setAdminToast(null)}
              className="text-white/80 hover:text-white cursor-pointer px-2 py-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Hero Header */}
        <div className="bg-gradient-to-tr from-slate-900 via-sky-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
          {/* Decorative water background elements */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 -top-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold tracking-wide uppercase">
                <span>{t('clubs.badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                {t('clubs.title')}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {t('clubs.subtitle')}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="shrink-0 w-full sm:w-auto flex flex-col sm:flex-row gap-3">
              {isAdminModeActive && (
                <button
                  type="button"
                  onClick={() => {
                    setAdminManagerInitialTab('create');
                    setIsAdminManagerOpen(true);
                  }}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-103 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus className="w-5 h-5" />
                  <span>Ajouter une structure (Admin)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsSubmitModalOpen(true)}
                className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-sky-500/25 transition-all hover:scale-103 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span>{t('clubs.submitClubBtn')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Administrator Persistence & Control Bar (when Admin Mode is on) */}
        {isAdminModeActive && (
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-amber-400/40 shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-amber-400" />
                    Mode Administrateur Actif
                  </span>
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    Sauvegarde permanente active
                  </span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  Gestion de l'Annuaire & Approbation des Clubs
                </h2>
                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                  Validez les suggestions en attente, ajoutez vos propres structures et effectuez vos suppressions. Toutes vos modifications sont conservées de façon permanente et ne sont jamais écrasées par les mises à jour.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAdminManagerInitialTab('create');
                    setIsAdminManagerOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md shadow-sky-500/20 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une structure</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAdminManagerInitialTab('pending');
                    setIsAdminManagerOpen(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-white/10 cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                  <span>Gestionnaire complet</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-white/10 cursor-pointer"
                  title="Télécharger une copie JSON de secours"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>Sauvegarder</span>
                </button>

                <label
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white font-bold text-xs transition-colors flex items-center gap-1.5 border border-white/10 cursor-pointer"
                  title="Restaurer une sauvegarde JSON"
                >
                  <UploadCloud className="w-4 h-4 text-amber-300" />
                  <span>Restaurer</span>
                  <input
                    type="file"
                    accept=".json,application/json"
                    className="hidden"
                    onChange={handleImportBackup}
                  />
                </label>
              </div>
            </div>

            {/* Admin Filter Tabs & Pending Counter */}
            <div className="pt-3 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Vue admin :</span>
                <button
                  type="button"
                  onClick={() => setAdminTab('validated')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adminTab === 'validated'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Publiés ({adminCounts.validated})
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    adminTab === 'pending'
                      ? 'bg-amber-500 text-slate-950 shadow-md ring-2 ring-amber-400/40'
                      : adminCounts.pending > 0
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 hover:bg-amber-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {adminCounts.pending > 0 && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>}
                  <span>Suggestions en attente ({adminCounts.pending})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    adminTab === 'all'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  Toutes les structures ({adminCounts.total})
                </button>
              </div>

              {adminCounts.pending > 0 && adminTab !== 'pending' && (
                <button
                  type="button"
                  onClick={() => setAdminTab('pending')}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer underline underline-offset-4"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{adminCounts.pending} suggestion(s) à traiter</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Search & Location Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Text Search Field */}
            <div className="md:col-span-8 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('clubs.searchPlaceholder')}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Geolocation Button */}
            <div className="md:col-span-4 flex items-center gap-2">
              {userLocation ? (
                <div className="flex-1 flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-bold">
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="truncate">{t('clubs.aroundYou', { radius: radiusKm.toString() })}</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetLocation}
                    className="text-sky-700 hover:text-sky-900 ml-2"
                    title={t('clubs.resetLocation')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={isLocating}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Compass className={`w-4 h-4 text-sky-400 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>
                    {isLocating
                      ? t('clubs.locating') !== 'clubs.locating'
                        ? t('clubs.locating')
                        : 'Localisation...'
                      : t('clubs.aroundMe') !== 'clubs.aroundMe'
                      ? t('clubs.aroundMe')
                      : t('clubs.geolocateMe') !== 'clubs.geolocateMe'
                      ? t('clubs.geolocateMe')
                      : 'Autour de moi'}
                  </span>
                </button>
              )}

              {/* Toggle Advanced Filters Button */}
              <button
                type="button"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`p-3 rounded-xl border transition-colors flex items-center justify-center cursor-pointer ${
                  showAdvancedFilters || activeFiltersCount > 0
                    ? 'bg-sky-50 border-sky-300 text-sky-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title={t('clubs.advancedFilters')}
              >
                <Filter className="w-4 h-4" />
                {activeFiltersCount > 0 && (
                  <span className="ml-1.5 w-5 h-5 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Location Error Message */}
          {locationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
              <span>{locationError}</span>
              <button onClick={() => setLocationError(null)} className="text-rose-500 hover:text-rose-700">
                ✕
              </button>
            </div>
          )}

          {/* Collapsible Advanced Filters Bar */}
          {showAdvancedFilters && (
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Country Select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  {t('clubs.filterCountry')}
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setSelectedCity('all');
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="all">{t('clubs.allCountries')}</option>
                  {availableCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* City Select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  {t('clubs.filterCity')}
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="all">{t('clubs.allCities')}</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Activity Category Select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  {t('clubs.filterActivity')}
                </label>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="all">{t('clubs.allActivities')}</option>
                  {CLUB_ACTIVITY_CATEGORIES.map((act) => (
                    <option key={act.id} value={act.id}>
                      {act.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Age Range Select */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                  {t('clubs.filterAge')}
                </label>
                <select
                  value={selectedAgeMonths}
                  onChange={(e) =>
                    setSelectedAgeMonths(e.target.value === 'all' ? 'all' : Number(e.target.value))
                  }
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                >
                  <option value="all">{t('clubs.allAges')}</option>
                  <option value="4">4 mois</option>
                  <option value="6">6 mois</option>
                  <option value="9">9 mois</option>
                  <option value="12">12 mois (1 an)</option>
                  <option value="18">18 mois</option>
                  <option value="24">24 mois (2 ans)</option>
                  <option value="36">36 mois (3 ans)</option>
                </select>
              </div>

              {/* Quick checkboxes: PMR and Recommended */}
              <div className="sm:col-span-2 lg:col-span-4 flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex flex-wrap items-center gap-4">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={filterRecommendedOnly}
                      onChange={(e) => setFilterRecommendedOnly(e.target.checked)}
                      className="w-4 h-4 text-amber-500 rounded border-slate-300 focus:ring-amber-400"
                    />
                    <span>⭐ {t('clubs.recommendedOnly')}</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={filterPmrOnly}
                      onChange={(e) => setFilterPmrOnly(e.target.checked)}
                      className="w-4 h-4 text-teal-600 rounded border-slate-300 focus:ring-teal-500"
                    />
                    <span>♿ {t('clubs.pmrAccessibleOnly')}</span>
                  </label>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{t('clubs.resetFilters')}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* View Switcher & Result Count Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-slate-900">
              {filteredClubs.length} {filteredClubs.length > 1 ? t('clubs.countPlural') : t('clubs.countSingular')}
            </span>
            {isAdminModeActive && adminTab === 'pending' && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">
                Suggestions soumises à approuver
              </span>
            )}
            {selectedCountry !== 'all' && (
              <span className="text-xs font-medium text-slate-500">
                · {selectedCountry} {selectedCity !== 'all' ? `(${selectedCity})` : ''}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'cards'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{t('clubs.viewCards')}</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                viewMode === 'map'
                  ? 'bg-sky-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Map className="w-4 h-4" />
              <span>{t('clubs.viewMap')}</span>
            </button>
          </div>
        </div>

        {/* Main Content: Cards or Interactive Map */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-12 h-12 rounded-full border-4 border-sky-200 border-t-sky-600 animate-spin" />
            <p className="text-sm font-semibold text-slate-500">
              {t('clubs.loading')}
            </p>
          </div>
        ) : filteredClubs.length === 0 ? (
          <div className="py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-300 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-sky-50 text-sky-600 mx-auto flex items-center justify-center text-2xl">
              🏊
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {isAdminModeActive && adminTab === 'pending'
                  ? 'Aucune suggestion en attente'
                  : t('clubs.noResultsTitle')}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {isAdminModeActive && adminTab === 'pending'
                  ? 'Toutes les suggestions ont été validées ou traitées. L\'annuaire est parfaitement à jour !'
                  : t('clubs.noResultsDesc')}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {isAdminModeActive && adminTab === 'pending' ? (
                <>
                  <button
                    type="button"
                    onClick={() => setAdminTab('validated')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Voir les structures publiées
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminManagerInitialTab('create');
                      setIsAdminManagerOpen(true);
                    }}
                    className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    ➕ Ajouter une structure
                  </button>
                </>
              ) : (
                <>
                  {activeFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {t('clubs.resetFilters')}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setIsSubmitModalOpen(true)}
                    className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    ➕ {t('clubs.submitClubBtn')}
                  </button>
                </>
              )}
            </div>
          </div>
        ) : viewMode === 'map' ? (
          <div className="space-y-6">
            <ClubMapView
              clubs={filteredClubs}
              selectedClub={selectedClubForDetail}
              onSelectClub={(club) => setSelectedClubForDetail(club)}
              userLocation={userLocation}
              radiusKm={radiusKm}
            />

            {/* Quick Cards Grid below Map */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">
                Structures affichées sur la carte ({filteredClubs.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClubs.map((club) => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    onSelect={(c) => setSelectedClubForDetail(c)}
                    isAdmin={isAdminModeActive}
                    onValidate={handleQuickValidate}
                    onReject={(c) => setRejectingClub(c)}
                    onEdit={(c) => {
                      setSelectedClubForDetail(c);
                    }}
                    onDelete={(c) => setDeletingClub(c)}
                    onToggleRecommend={handleQuickToggleRecommend}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClubs.map((club) => (
              <ClubCard
                key={club.id}
                club={club}
                onSelect={(c) => setSelectedClubForDetail(c)}
                isAdmin={isAdminModeActive}
                onValidate={handleQuickValidate}
                onReject={(c) => setRejectingClub(c)}
                onEdit={(c) => {
                  setSelectedClubForDetail(c);
                }}
                onDelete={(c) => setDeletingClub(c)}
                onToggleRecommend={handleQuickToggleRecommend}
              />
            ))}
          </div>
        )}
      </div>

      {/* Admin Full Management Modal */}
      {isAdminManagerOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white rounded-3xl p-4 sm:p-8 max-w-5xl w-full shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <AdminClubsManager
              initialTab={adminManagerInitialTab}
              onClose={() => {
                setIsAdminManagerOpen(false);
                fetchClubs();
              }}
              onClubUpdated={() => {
                fetchClubs();
              }}
            />
          </div>
        </div>
      )}

      {/* Club Detail Modal */}
      <ClubDetailModal
        club={selectedClubForDetail}
        isOpen={Boolean(selectedClubForDetail)}
        onClose={() => setSelectedClubForDetail(null)}
        isAdmin={isAdminModeActive}
        onValidate={(c) => {
          handleQuickValidate(c);
          setSelectedClubForDetail(null);
        }}
        onEdit={(c) => {
          setSelectedClubForDetail(null);
          setAdminManagerInitialTab('validated');
          setIsAdminManagerOpen(true);
        }}
        onDeleted={() => {
          fetchClubs();
        }}
      />

      {/* User Submission Modal */}
      <SubmitClubModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        onSubmitted={() => {
          fetchClubs();
          showToast('Votre suggestion a bien été transmise à notre équipe pour validation !');
        }}
      />

      {/* Rejection Modal Dialog */}
      {rejectingClub && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-amber-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Refuser la suggestion ?
                </h3>
                <p className="text-xs text-amber-700 font-semibold">
                  {rejectingClub.name}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Indiquez la raison du refus pour archive :
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 focus:outline-none"
            />

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingClub(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Confirmer le refus</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingClub && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-rose-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Supprimer définitivement la structure ?
                </h3>
                <p className="text-xs text-rose-600 font-semibold">
                  Cette suppression est permanente et irréversible
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1 text-slate-700">
              <p className="font-bold text-slate-900 text-sm">{deletingClub.name}</p>
              <p className="text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {deletingClub.address ? `${deletingClub.address}, ` : ''}{deletingClub.city}, {deletingClub.country}
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Voulez-vous vraiment supprimer définitivement « {deletingClub.name} » ? Cette structure sera effacée du registre et ne réapparaîtra jamais, même après une mise à jour de l'application.
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
                <span>{isDeleting ? 'Suppression en cours...' : 'Oui, supprimer définitivement'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
