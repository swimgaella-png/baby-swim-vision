import React from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Globe,
  Star,
  Thermometer,
  ChevronRight,
  Accessibility,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Lock,
} from 'lucide-react';
import { Club } from '../types';
import { CLUB_ACTIVITY_CATEGORIES, formatClubPhotoUrl } from '../services/clubService';
import { useTranslation } from '../i18n/LanguageContext';

interface ClubCardProps {
  club: Club;
  onSelect: (club: Club) => void;
  isAdmin?: boolean;
  onEdit?: (club: Club) => void;
  onDelete?: (club: Club) => void;
  onValidate?: (club: Club) => void;
  onReject?: (club: Club) => void;
  onToggleRecommend?: (club: Club) => void;
}

export const ClubCard: React.FC<ClubCardProps> = ({
  club,
  onSelect,
  isAdmin = false,
  onEdit,
  onDelete,
  onValidate,
  onReject,
  onToggleRecommend,
}) => {
  const { t } = useTranslation();

  const activityLabels = (club.activities || []).map((actId) => {
    const found = CLUB_ACTIVITY_CATEGORIES.find((c) => c.id === actId);
    return found ? found.label : actId;
  });

  const isPending = club.status === 'pending';

  return (
    <div
      id={`club-card-${club.id}`}
      className={`group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg flex flex-col justify-between overflow-hidden ${
        isPending
          ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md shadow-amber-500/10'
          : club.isRecommended
          ? 'border-amber-300 ring-2 ring-amber-400/20 shadow-md shadow-amber-500/5'
          : 'border-slate-200/80 hover:border-sky-300'
      }`}
    >
      {/* Top Banner Alert for Pending Suggestions */}
      {isPending && (
        <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 flex items-center justify-between z-20">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Suggestion reçue — En attente d'approbation
          </span>
          {isAdmin && (
            <span className="bg-amber-700/60 text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-mono">
              Action requise
            </span>
          )}
        </div>
      )}

      {/* Top Banner / Photo */}
      <div className="relative h-44 w-full bg-gradient-to-tr from-sky-100 via-teal-50 to-blue-50 overflow-hidden flex items-center justify-center">
        {club.photos && club.photos.length > 0 ? (
          <img
            src={formatClubPhotoUrl(club.photos[0])}
            alt={club.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-sky-600/70 p-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/80 shadow-xs flex items-center justify-center text-2xl mb-2">
              🏊
            </div>
            <span className="text-xs font-semibold text-slate-500">Structure Bébés Nageurs</span>
          </div>
        )}

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {club.isRecommended && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/20">
              <Star className="w-3 h-3 fill-white" />
              Recommandé Baby Swim
            </span>
          )}
          {club.accessibility && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-semibold bg-white/90 text-teal-700 backdrop-blur-xs shadow-xs">
              <Accessibility className="w-3 h-3" />
              PMR
            </span>
          )}
          {isAdmin && (club.createdByAdmin || club.isLockedByAdmin) && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs shadow-xs">
              <Lock className="w-2.5 h-2.5 text-amber-400" />
              Protégé Admin
            </span>
          )}
        </div>

        {/* Distance Pill if available */}
        {typeof club.distanceKm === 'number' && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-900/80 text-white backdrop-blur-md shadow-xs">
              <MapPin className="w-3 h-3 text-sky-400" />
              à {club.distanceKm < 1 ? '< 1' : club.distanceKm} km
            </span>
          </div>
        )}

        {/* Admin status pill */}
        {isAdmin && (
          <div className="absolute bottom-3 left-3 z-10">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                club.status === 'validated'
                  ? 'bg-emerald-600 text-white'
                  : club.status === 'pending'
                  ? 'bg-amber-600 text-white'
                  : club.status === 'rejected'
                  ? 'bg-rose-600 text-white'
                  : 'bg-slate-600 text-white'
              }`}
            >
              {club.status === 'validated'
                ? 'Visible / Publié'
                : club.status === 'pending'
                ? 'En attente'
                : club.status === 'rejected'
                ? 'Refusé'
                : 'Inactif'}
            </span>
          </div>
        )}
      </div>

      {/* Main Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* City / Country */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 text-sky-700">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              {club.city}, {club.country}
            </span>
            {club.poolInformation?.waterTemperatureC && (
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                {club.poolInformation.waterTemperatureC}°C
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-sky-600 transition-colors">
            {club.name}
          </h3>

          {/* Description */}
          <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {club.description || "Séances d'éveil aquatique et bébés nageurs encadrées par des professionnels certifiés."}
          </p>

          {/* Meta Info: Ages & Group */}
          <div className="mt-3.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              {club.minAgeMonths ?? 4} à {club.maxAgeMonths ?? 36} mois
            </span>
          </div>

          {/* Activities Badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {activityLabels.slice(0, 3).map((act, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold text-sky-800 bg-sky-50 border border-sky-100"
              >
                {act}
              </span>
            ))}
            {activityLabels.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold text-slate-400 bg-slate-100">
                +{activityLabels.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Admin Action Bar (if suggestion or admin mode) */}
        {isAdmin && (
          <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/80 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl flex flex-col gap-2">
            {/* Quick validation bar for pending clubs */}
            {isPending && (
              <div className="flex items-center gap-2">
                {onValidate && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onValidate(club);
                    }}
                    className="flex-1 py-1.5 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    title="Valider et rendre visible aux utilisateurs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Valider & Publier</span>
                  </button>
                )}
                {onReject && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject(club);
                    }}
                    className="py-1.5 px-2.5 rounded-xl bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title="Refuser cette suggestion"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Refuser</span>
                  </button>
                )}
              </div>
            )}

            {/* General admin actions: edit, recommend, delete */}
            <div className="flex items-center justify-between gap-1.5 text-xs">
              <div className="flex items-center gap-1">
                {onToggleRecommend && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleRecommend(club);
                    }}
                    className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                      club.isRecommended
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-white text-slate-500 border-slate-200 hover:text-amber-600 hover:bg-amber-50'
                    }`}
                    title={club.isRecommended ? 'Retirer la recommandation' : 'Marquer comme recommandé'}
                  >
                    <Star className={`w-3.5 h-3.5 ${club.isRecommended ? 'fill-amber-500' : ''}`} />
                  </button>
                )}

                {onEdit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(club);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 text-slate-700 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                    title="Modifier les informations"
                  >
                    <Edit className="w-3 h-3 text-sky-600" />
                    <span>Modifier</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(club);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors cursor-pointer"
                    title="Supprimer définitivement la structure"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => onSelect(club)}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Détails</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Regular User Footer (when not in admin mode) */}
        {!isAdmin && (
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {club.phone && (
                <a
                  href={`tel:${club.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sky-100 hover:text-sky-700 text-slate-600 flex items-center justify-center transition-colors text-xs"
                  title="Appeler la structure"
                >
                  <Phone className="w-3.5 h-3.5" />
                </a>
              )}
              {club.website && (
                <a
                  href={club.website.startsWith('http') ? club.website : `https://${club.website}`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-sky-100 hover:text-sky-700 text-slate-600 flex items-center justify-center transition-colors text-xs"
                  title="Visiter le site officiel"
                >
                  <Globe className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={() => onSelect(club)}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-xs hover:shadow-md flex items-center gap-1 cursor-pointer group-hover:bg-sky-500"
            >
              <span>Voir la fiche</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
