import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Clock,
  Thermometer,
  ShieldCheck,
  Users,
  Image,
  Upload,
  Plus,
  Trash2,
  Crosshair,
  Send,
} from 'lucide-react';
import { ClubSubmissionForm, DuplicateCheckResult } from '../types';
import { clubService, CLUB_ACTIVITY_CATEGORIES, CLUB_LANGUAGES } from '../services/clubService';
import { PinpointMapPicker } from './PinpointMapPicker';

interface SubmitClubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export const SubmitClubModal: React.FC<SubmitClubModalProps> = ({
  isOpen,
  onClose,
  onSubmitted,
}) => {
  const [formData, setFormData] = useState<ClubSubmissionForm>({
    name: '',
    managerName: '',
    email: '',
    phone: '',
    website: '',
    bookingUrl: '',
    socialFacebook: '',
    socialInstagram: '',
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
    waterTemperatureC: 32,
    poolType: "Bassin d'apprentissage chauffé",
    accessibility: false,
    accessibilityDetails: '',
    logo: '',
    photos: [],
    consentVerified: false,
    consentPublish: false,
  });

  const [photoUrlInput, setPhotoUrlInput] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isGeocoding, setIsGeocoding] = useState<boolean>(false);
  const [geocodeFeedback, setGeocodeFeedback] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successResult, setSuccessResult] = useState<{
    message: string;
    duplicateCheck?: DuplicateCheckResult;
  } | null>(null);

  if (!isOpen) return null;

  const handleGeocode = async () => {
    if (!formData.city && !formData.address) {
      setGeocodeFeedback('Veuillez renseigner au moins une adresse et la ville.');
      return;
    }
    setIsGeocoding(true);
    setGeocodeFeedback(null);
    const res = await clubService.geocodeAddress(
      formData.address,
      formData.postalCode,
      formData.city,
      formData.country
    );
    setIsGeocoding(false);
    if (res.success && typeof res.lat === 'number' && typeof res.lng === 'number') {
      setFormData((prev) => ({
        ...prev,
        latitude: res.lat,
        longitude: res.lng,
      }));
      setGeocodeFeedback(`📍 Coordonnées exactes localisées : ${res.lat.toFixed(5)}, ${res.lng.toFixed(5)} (${res.precision || 'précis'})`);
    } else {
      setGeocodeFeedback('Localisation automatique approximative. Le serveur affinera les coordonnées lors de la validation.');
    }
  };

  const handleActivityToggle = (actId: string) => {
    setFormData((prev) => {
      const exists = prev.activities.includes(actId);
      return {
        ...prev,
        activities: exists
          ? prev.activities.filter((id) => id !== actId)
          : [...prev.activities, actId],
      };
    });
  };

  const handleLanguageToggle = (langCode: string) => {
    setFormData((prev) => {
      const exists = prev.languages.includes(langCode);
      return {
        ...prev,
        languages: exists
          ? prev.languages.filter((c) => c !== langCode)
          : [...prev.languages, langCode],
      };
    });
  };

  const handleAddPhotoUrl = () => {
    if (!photoUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      photos: [...prev.photos, photoUrlInput.trim()],
    }));
    setPhotoUrlInput('');
  };

  const handleRemovePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormData((prev) => ({
          ...prev,
          photos: [...prev.photos, reader.result as string],
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Form validations
    if (!formData.name.trim()) {
      setErrorMessage('Veuillez renseigner le nom de la structure.');
      return;
    }
    if (!formData.city.trim()) {
      setErrorMessage('Veuillez renseigner la ville.');
      return;
    }
    if (!formData.country.trim()) {
      setErrorMessage('Veuillez renseigner le pays.');
      return;
    }
    if (!formData.email.trim() && !formData.phone.trim()) {
      setErrorMessage('Veuillez fournir au moins un moyen de contact direct (email ou téléphone).');
      return;
    }
    if (!formData.consentVerified || !formData.consentPublish) {
      setErrorMessage('Veuillez cocher les deux cases de consentement obligatoires.');
      return;
    }

    setIsSubmitting(true);
    const res = await clubService.submitClub(formData);
    setIsSubmitting(false);

    if (res.success) {
      setSuccessResult({
        message: res.message,
        duplicateCheck: res.duplicateCheck,
      });
      onSubmitted?.();
    } else {
      setErrorMessage(res.message || 'Une erreur est survenue lors de la soumission.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                Soumettre une structure de bébés nageurs
              </h2>
              <p className="text-xs text-slate-500">
                Formulaire réservé aux professionnels, clubs, piscines et maîtres-nageurs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8">
          {successResult ? (
            <div className="py-8 text-center space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-3 max-w-lg mx-auto">
                <h3 className="text-2xl font-black text-slate-900">
                  Proposition transmise pour approbation !
                </h3>
                <div className="bg-sky-50 border border-sky-200 text-sky-900 rounded-2xl p-4 text-xs space-y-1.5 text-left">
                  <div className="flex items-center gap-2 font-bold text-sky-950">
                    <Mail className="w-4 h-4 text-sky-600" />
                    <span>Notification envoyée à swimgaella@gmail.com</span>
                  </div>
                  <p className="text-slate-600">
                    Un email récapitulatif avec les coordonnées, activités, photos et localisation exacte a été envoyé à l'administratrice pour vérification et validation avant mise en ligne.
                  </p>
                </div>
                <p className="text-xs text-slate-500">
                  Merci de contribuer à la qualité de l'annuaire international Baby Swim Vision !
                </p>
              </div>

              {successResult.duplicateCheck?.hasPotentialDuplicate && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-4 text-xs text-left max-w-lg mx-auto">
                  <div className="flex items-center gap-2 font-bold mb-1">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Structure similaire déjà identifiée :</span>
                  </div>
                  <p>
                    Une structure avec des coordonnées similaires existe déjà dans l'annuaire. L'équipe d'administration vérifiera attentivement votre fiche pour éviter les doublons.
                  </p>
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`mailto:swimgaella@gmail.com?subject=Confirmation soumission structure : ${encodeURIComponent(formData.name)}&body=Bonjour Gaëlla,%0D%0A%0D%0AJe viens de soumettre la structure ${encodeURIComponent(formData.name)} située à ${encodeURIComponent(formData.city)} (${encodeURIComponent(formData.country)}) pour l'annuaire Baby Swim Vision.%0D%0A%0D%0ACordialement`}
                  className="px-5 py-3 rounded-2xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-2 border border-purple-200 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer un mot direct à Gaëlla</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Mandatory Notice Banner */}
              <div className="bg-sky-50 border border-sky-200/80 rounded-2xl p-4.5 flex items-start gap-3.5">
                <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <div className="text-xs text-sky-900 leading-relaxed space-y-1">
                  <p className="font-bold">
                    Engagement qualité & Approbation administrative (swimgaella@gmail.com)
                  </p>
                  <p>
                    La soumission d'une structure transmet automatiquement un dossier d'approbation à Gaëlla Le Gall (Baby Swim Vision) pour vérification des critères de bienveillance et de sécurité avant publication dans l'annuaire.
                  </p>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1. Identification de la structure */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-1 border-b border-slate-100">
                  <Building2 className="w-4 h-4 text-sky-600" />
                  1. Identification de la structure
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nom de la structure / Club / Piscine *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ex: Centre Aquatique Les Petits Dauphins"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nom du responsable / Contact
                    </label>
                    <input
                      type="text"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                      placeholder="Ex: Marie Dupont"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email professionnel de contact *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="contact@lespetitsdauphins.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Téléphone de contact
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ex: 01 23 45 67 89"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Site internet officiel
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://www.lespetitsdauphins.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Lien direct d'inscription ou réservation (optionnel)
                    </label>
                    <input
                      type="url"
                      value={formData.bookingUrl}
                      onChange={(e) => setFormData({ ...formData, bookingUrl: e.target.value })}
                      placeholder="https://booking.lespetitsdauphins.com/bebes-nageurs"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Localisation géographique & Pinpoint GPS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    2. Localisation géographique & Précision GPS exacte
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Adresse complète (numéro et rue) *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Ex: 12 rue des Aquanautes"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Code postal
                    </label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      placeholder="Ex: 75015"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ville *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Ex: Paris"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Région / Province
                    </label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                      placeholder="Ex: Île-de-France"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Pays *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                      placeholder="Ex: France, Belgique, Suisse, Canada..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Interactive High-Precision Map Pinpoint Picker */}
                <div className="pt-2">
                  <PinpointMapPicker
                    latitude={formData.latitude}
                    longitude={formData.longitude}
                    address={formData.address}
                    postalCode={formData.postalCode}
                    city={formData.city}
                    country={formData.country}
                    onChange={(coords) => {
                      setFormData((prev) => ({
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
              </div>

              {/* 3. Activités & Tranches d'âges */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-1 border-b border-slate-100">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  3. Activités, Tranches d'âge & Langues
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Activités proposées (sélectionnez toutes les activités correspondantes) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {CLUB_ACTIVITY_CATEGORIES.map((act) => {
                      const selected = formData.activities.includes(act.id);
                      return (
                        <button
                          type="button"
                          key={act.id}
                          onClick={() => handleActivityToggle(act.id)}
                          className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                            selected
                              ? 'border-sky-500 bg-sky-50/80 text-sky-900'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                          }`}
                        >
                          <span className="text-base">{act.icon}</span>
                          <span>{act.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Âge minimum (en mois)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={72}
                      value={formData.minAgeMonths}
                      onChange={(e) => setFormData({ ...formData, minAgeMonths: parseInt(e.target.value) || 4 })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Âge maximum (en mois)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={120}
                      value={formData.maxAgeMonths}
                      onChange={(e) => setFormData({ ...formData, maxAgeMonths: parseInt(e.target.value) || 36 })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Format des séances
                    </label>
                    <select
                      value={formData.groupType}
                      onChange={(e) => setFormData({ ...formData, groupType: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 bg-white"
                    >
                      <option value="collectif">Séances collectives</option>
                      <option value="individuel">Séances individuelles</option>
                      <option value="mixte">Collectives et individuelles</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Langues parlées par l'équipe
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {CLUB_LANGUAGES.map((lang) => {
                      const selected = formData.languages.includes(lang.code);
                      return (
                        <button
                          type="button"
                          key={lang.code}
                          onClick={() => handleLanguageToggle(lang.code)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                            selected
                              ? 'border-sky-600 bg-sky-600 text-white shadow-xs'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {lang.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 4. Description & Philosophie */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-1 border-b border-slate-100">
                  <HelpCircle className="w-4 h-4 text-sky-600" />
                  4. Description, Pédagogie & Équipe
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Présentation de la structure & approche pédagogique
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Présentez votre cadre, votre projet d'éveil aquatique, la bienveillance de vos séances et les spécificités de votre structure..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Qualifications & Diplômes déclarés
                    </label>
                    <input
                      type="text"
                      value={formData.qualifications}
                      onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                      placeholder="Ex: BPJEPS AAN, BEESAN, Spécialisation Petite Enfance"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Présentation de l'équipe
                    </label>
                    <input
                      type="text"
                      value={formData.team}
                      onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                      placeholder="Ex: 3 maîtres-nageurs diplômés et 1 psychomotricienne"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* 5. Bassin & Installations */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-1 border-b border-slate-100">
                  <Thermometer className="w-4 h-4 text-cyan-600" />
                  5. Bassin & Installations
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Température de l'eau (°C)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      min={28}
                      max={36}
                      value={formData.waterTemperatureC || 32}
                      onChange={(e) => setFormData({ ...formData, waterTemperatureC: parseFloat(e.target.value) || 32 })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Type de bassin
                    </label>
                    <input
                      type="text"
                      value={formData.poolType || ''}
                      onChange={(e) => setFormData({ ...formData, poolType: e.target.value })}
                      placeholder="Ex: Bassin d'apprentissage chauffé"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* Accessibility */}
                <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-200/50 space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.accessibility}
                      onChange={(e) => setFormData({ ...formData, accessibility: e.target.checked })}
                      className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-xs font-bold text-teal-950">
                      Structure adaptée aux personnes à mobilité réduite (PMR) ou besoins spécifiques
                    </span>
                  </label>
                  {formData.accessibility && (
                    <input
                      type="text"
                      value={formData.accessibilityDetails || ''}
                      onChange={(e) => setFormData({ ...formData, accessibilityDetails: e.target.value })}
                      placeholder="Précisez les aménagements (rampe, fauteuil de mise à l'eau, vestiaires adaptés...)"
                      className="w-full px-3 py-1.5 rounded-xl border border-teal-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  )}
                </div>
              </div>

              {/* 6. Photos */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2 pb-1 border-b border-slate-100">
                  <Image className="w-4 h-4 text-sky-600" />
                  6. Photos & Logo
                </h3>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    placeholder="Coller l'URL d'une photo du bassin ou du club..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddPhotoUrl}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Ajouter URL
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <label className="px-3.5 py-2 rounded-xl border border-dashed border-slate-300 hover:border-sky-500 text-slate-600 hover:text-sky-600 text-xs font-bold flex items-center gap-1.5 cursor-pointer bg-slate-50 transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Téléverser une image locale</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>

                {formData.photos.length > 0 && (
                  <div className="flex flex-wrap gap-2.5 pt-2">
                    {formData.photos.map((p, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                        <img src={p} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-md opacity-90 hover:opacity-100 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 7. Consentements obligatoires */}
              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Consentements obligatoires
                </h4>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consentVerified}
                    onChange={(e) => setFormData({ ...formData, consentVerified: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    J'autorise l'équipe Baby Swim Vision à vérifier les informations transmises et à contacter la structure si nécessaire.
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={formData.consentPublish}
                    onChange={(e) => setFormData({ ...formData, consentPublish: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-sky-600 focus:ring-sky-500"
                  />
                  <span className="text-xs text-slate-700 font-medium">
                    J'accepte que les informations de ma structure soient publiées publiquement sur l'annuaire Baby Swim Vision après validation.
                  </span>
                </label>
              </div>

              {/* Submit Action */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-sky-500/20 transition-all hover:scale-102 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Envoi en cours...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Soumettre ma structure pour validation</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
