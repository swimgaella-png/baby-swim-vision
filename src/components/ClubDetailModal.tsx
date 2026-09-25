import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  Phone,
  Mail,
  Globe,
  ExternalLink,
  Star,
  Users,
  ShieldCheck,
  Thermometer,
  Accessibility,
  CheckCircle2,
  Calendar,
  Award,
  Info,
  ChevronRight,
  Share2,
  Navigation,
  Trash2,
  Edit,
  AlertTriangle,
} from 'lucide-react';
import { Club } from '../types';
import { CLUB_ACTIVITY_CATEGORIES, CLUB_LANGUAGES, clubService, formatClubPhotoUrl } from '../services/clubService';

interface ClubDetailModalProps {
  club: Club | null;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onEdit?: (club: Club) => void;
  onDeleted?: () => void;
  onValidate?: (club: Club) => void;
}

export const ClubDetailModal: React.FC<ClubDetailModalProps> = ({
  club,
  isOpen,
  onClose,
  isAdmin = false,
  onEdit,
  onDeleted,
  onValidate,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  if (!isOpen || !club) return null;

  const handleDeleteClub = async () => {
    setIsDeleting(true);
    const res = await clubService.deleteClub(club.id);
    setIsDeleting(false);
    if (res.success) {
      setShowDeleteConfirm(false);
      onClose();
      onDeleted?.();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${club.name} — Bébés Nageurs`,
        text: `Découvrez la structure ${club.name} sur l'annuaire Baby Swim Vision.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const activityObjects = (club.activities || []).map((actId) => {
    const found = CLUB_ACTIVITY_CATEGORIES.find((c) => c.id === actId);
    return found ? found : { id: actId, label: actId, icon: '🌊' };
  });

  const languageLabels = (club.languages || []).map((code) => {
    const found = CLUB_LANGUAGES.find((l) => l.code === code);
    return found ? found.label : code.toUpperCase();
  });

  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${club.name} ${club.address} ${club.city} ${club.country}`
  )}`;

  const hasCoords =
    typeof club.latitude === 'number' &&
    typeof club.longitude === 'number' &&
    !isNaN(club.latitude) &&
    !isNaN(club.longitude);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div
        id={`club-detail-modal-${club.id}`}
        className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Top Header Bar */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-lg">
              Fiche Structure
            </span>
            {club.isRecommended && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-900">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                Recommandé Baby Swim
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Partager cette structure"
            >
              {copiedLink ? (
                <span className="text-xs font-bold text-emerald-600">Lien copié !</span>
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            {isAdmin && onEdit && (
              <button
                onClick={() => onEdit(club)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Modifier</span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors cursor-pointer"
                title="Supprimer définitivement la structure"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          {/* Main Visual & Title Banner */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Photos carousel / main image */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative h-60 w-full rounded-2xl bg-gradient-to-tr from-sky-100 via-blue-50 to-teal-50 overflow-hidden shadow-inner flex items-center justify-center">
                {club.photos && club.photos.length > 0 ? (
                  <img
                    src={formatClubPhotoUrl(club.photos[selectedPhotoIndex] || club.photos[0])}
                    alt={club.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                    <span className="text-4xl mb-2">🏊‍♂️</span>
                    <span className="text-xs font-medium">Structure vérifiée</span>
                  </div>
                )}
              </div>

              {/* Thumbnails if multiple photos */}
              {club.photos && club.photos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {club.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedPhotoIndex(index)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        selectedPhotoIndex === index ? 'border-sky-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={formatClubPhotoUrl(photo)} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Quick summary */}
            <div className="md:col-span-7 space-y-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-700 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" />
                  <span>
                    {club.city} {club.postalCode && `(${club.postalCode})`} • {club.country}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {club.name}
                </h1>
                {club.address && (
                  <p className="mt-1 text-xs text-slate-500 font-medium">
                    {club.address}, {club.postalCode} {club.city}, {club.country}
                  </p>
                )}
              </div>

              {/* Badges row */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-sky-100/70 text-sky-800">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  {club.minAgeMonths} à {club.maxAgeMonths} mois
                </span>

                {club.poolInformation?.waterTemperatureC && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-cyan-100/70 text-cyan-900 border border-cyan-200/50">
                    <Thermometer className="w-3.5 h-3.5 text-cyan-600" />
                    Eau à {club.poolInformation.waterTemperatureC}°C
                  </span>
                )}

                {club.groupType && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700">
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    Séances {club.groupType === 'collectif' ? 'collectives' : club.groupType === 'individuel' ? 'individuelles' : 'collectives & privées'}
                  </span>
                )}

                {club.accessibility && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl text-xs font-semibold bg-teal-100/70 text-teal-800">
                    <Accessibility className="w-3.5 h-3.5 text-teal-600" />
                    Accès PMR / Adapté
                  </span>
                )}
              </div>

              {/* Direct Action Buttons Bar */}
              <div className="pt-2 flex flex-wrap gap-2.5">
                {club.bookingUrl && (
                  <a
                    href={club.bookingUrl.startsWith('http') ? club.bookingUrl : `https://${club.bookingUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white shadow-md shadow-sky-500/20 transition-all hover:scale-102"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Réserver une séance</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                )}

                {club.website && (
                  <a
                    href={club.website.startsWith('http') ? club.website : `https://${club.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                  >
                    <Globe className="w-4 h-4 text-sky-600" />
                    <span>Site internet</span>
                  </a>
                )}

                {club.phone && (
                  <a
                    href={`tel:${club.phone}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <span>{club.phone}</span>
                  </a>
                )}

                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                  title="Ouvrir dans Google Maps"
                >
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span>Itinéraire</span>
                </a>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border border-slate-200/60">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2.5 flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-600" />
              Présentation de la structure
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {club.description || "Cette structure propose un encadrement adapté aux tout-petits et à leurs parents pour des moments d'éveil aquatique sereins et bienveillants."}
            </p>
          </div>

          {/* Precise Location & Direct GPS Navigation */}
          <div className="bg-gradient-to-br from-sky-50/90 to-teal-50/50 rounded-2xl p-5 sm:p-6 border border-sky-200/70 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                    Localisation & Itinéraire GPS Précis
                  </h3>
                  <p className="text-xs text-slate-600">
                    Point GPS exact calé sur l'entrée ou le bassin aquatique
                  </p>
                </div>
              </div>

              {hasCoords && (
                <div className="flex items-center gap-2 font-mono text-xs bg-white/90 px-3 py-1.5 rounded-xl border border-sky-200 text-slate-800 self-start sm:self-auto shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>
                    {club.latitude?.toFixed(6)}, {club.longitude?.toFixed(6)}
                  </span>
                </div>
              )}
            </div>

            <div className="p-3.5 bg-white rounded-xl border border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-slate-900">
                  {club.address || `${club.city}, ${club.country}`}
                </p>
                <p className="text-xs text-slate-500">
                  {club.postalCode} {club.city} • {club.country}
                </p>
              </div>

              {/* Navigation launcher buttons */}
              {hasCoords && (
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${club.latitude},${club.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>🚗 Google Maps</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>

                  <a
                    href={`https://waze.com/ul?ll=${club.latitude},${club.longitude}&navigate=yes`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>🧭 Waze</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>

                  <a
                    href={`https://www.google.com/maps?q=${club.latitude},${club.longitude}&t=k`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>🛰️ Vue Satellite</span>
                    <ExternalLink className="w-3 h-3 opacity-80" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Grid of Details: Activities & Pool Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activities */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>🏊‍♀️</span>
                Activités & Formats proposés
              </h3>
              <div className="flex flex-wrap gap-2">
                {activityObjects.map((act) => (
                  <span
                    key={act.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-sky-50 text-sky-900 border border-sky-100"
                  >
                    <span>{act.icon}</span>
                    <span>{act.label}</span>
                  </span>
                ))}
              </div>
              <div className="pt-2 text-xs text-slate-500 space-y-1">
                <p>
                  <strong>Tranches d'âge :</strong> De {club.minAgeMonths} mois à {club.maxAgeMonths} mois
                </p>
                <p>
                  <strong>Langues parlées :</strong> {languageLabels.join(', ') || 'Français'}
                </p>
              </div>
            </div>

            {/* Pool & Facility Information */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-cyan-600" />
                Bassin & Conditions d'accueil
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Température de l'eau</span>
                  <span className="font-bold text-cyan-800">
                    {club.poolInformation?.waterTemperatureC ? `${club.poolInformation.waterTemperatureC}°C` : 'Chauffée (> 31°C)'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Type de bassin</span>
                  <span className="font-semibold text-slate-800">
                    {club.poolInformation?.poolType || 'Bassin d\'apprentissage chauffé'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Accessibilité PMR</span>
                  <span className="font-semibold text-slate-800">
                    {club.accessibility ? '✅ Accessible PMR' : 'Non spécifié'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Team & Qualifications */}
          {(club.team || club.qualifications || club.managerName) && (
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50/40 rounded-2xl p-5 sm:p-6 border border-indigo-100/60 space-y-2.5">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                Équipe & Qualifications déclarées
              </h3>
              {club.managerName && (
                <p className="text-xs text-slate-700">
                  <strong>Responsable / Contact :</strong> {club.managerName}
                </p>
              )}
              {club.qualifications && (
                <p className="text-xs text-slate-700">
                  <strong>Qualifications & Diplômes :</strong> {club.qualifications}
                </p>
              )}
              {club.team && (
                <p className="text-xs text-slate-600 leading-relaxed">
                  {club.team}
                </p>
              )}
            </div>
          )}

          {/* Direct Contact Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-base text-white mb-1">
                Contacter directement {club.name}
              </h4>
              <p className="text-xs text-slate-300">
                Renseignez-vous sur les créneaux, les tarifs et les inscriptions auprès de l'équipe du club.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              {club.phone && (
                <a
                  href={`tel:${club.phone}`}
                  className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{club.phone}</span>
                </a>
              )}
              {club.email && (
                <a
                  href={`mailto:${club.email}`}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-slate-700"
                >
                  <Mail className="w-3.5 h-3.5 text-sky-400" />
                  <span>{club.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Admin Management Section */}
          {isAdmin && (
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 uppercase">
                    Espace Administrateur
                  </span>
                  <span className="text-xs text-slate-500 font-mono">ID: {club.id}</span>
                </div>
                <p className="text-xs text-slate-700 font-medium">
                  Gérer ou supprimer définitivement cette structure de l'annuaire Baby Swim Vision.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {club.status === 'pending' && onValidate && (
                  <button
                    type="button"
                    onClick={() => {
                      onValidate(club);
                      onClose();
                    }}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valider & Publier</span>
                  </button>
                )}

                {onEdit && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onEdit(club);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Modifier la fiche</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Supprimer la structure</span>
                </button>
              </div>
            </div>
          )}

          {/* Validation Notice */}
          <div className="text-[11px] text-slate-400 text-center space-y-1">
            <p>
              Structure référencée sur l'annuaire Baby Swim Vision. Les informations sont fournies par les structures et vérifiées par notre équipe avant publication.
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-rose-100 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Supprimer la structure ?
                </h3>
                <p className="text-xs text-rose-600 font-semibold">
                  Cette action supprimera définitivement le club
                </p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-1.5 text-slate-700">
              <p className="font-bold text-slate-900 text-sm">{club.name}</p>
              <p className="text-slate-500 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {club.address ? `${club.address}, ` : ''}{club.city}, {club.country}
              </p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Voulez-vous vraiment supprimer définitivement « {club.name} » ? Cette structure ne sera plus visible sur l'annuaire ni sur la carte.
            </p>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteClub}
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
