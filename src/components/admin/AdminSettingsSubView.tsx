import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  RotateCcw,
  Image as ImageIcon,
  Upload,
  CheckCircle2,
  Mail,
  Type,
  HelpCircle,
  Sparkles,
  Database,
  Trash2,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { interfaceSettingsService, InterfaceSettings } from '../../services/interfaceSettingsService';
import { persistenceService, CacheSanitizationReport } from '../../services/persistenceService';

interface AdminSettingsSubViewProps {
  onBack: () => void;
  showFeedback: (msg: string) => void;
}

export const AdminSettingsSubView: React.FC<AdminSettingsSubViewProps> = ({ onBack, showFeedback }) => {
  const [settings, setSettings] = useState<InterfaceSettings>(interfaceSettingsService.getSettings());
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [storageUsage, setStorageUsage] = useState<{ kb: number; mb: number }>(() => {
    const u = persistenceService.getStorageUsage();
    return { kb: u.kb, mb: u.mb };
  });
  const [lastSanitizeReport, setLastSanitizeReport] = useState<CacheSanitizationReport | null>(null);

  const refreshStorageUsage = () => {
    const u = persistenceService.getStorageUsage();
    setStorageUsage({ kb: u.kb, mb: u.mb });
  };

  const handleCleanCache = () => {
    const report = persistenceService.cleanCorruptedCache();
    setLastSanitizeReport(report);
    refreshStorageUsage();
    if (report.corruptedKeysRemoved.length > 0 || report.repairedKeys.length > 0) {
      showFeedback(`Cache assaini : ${report.corruptedKeysRemoved.length} clé(s) corrompue(s) supprimée(s), ${report.repairedKeys.length} réparée(s).`);
    } else {
      showFeedback(`Cache local intègre : ${report.totalKeysInspected} clés inspectées, aucune anomalie.`);
    }
  };

  const handlePurgeEphemeralCache = () => {
    if (window.confirm('Vider les caches temporaires (vidéos démo, liste clubs en cache) ? Vos comptes, bébés et réglages seront conservés.')) {
      const res = persistenceService.clearAllCaches({
        preserveAuth: true,
        preservePreferences: true,
        preserveUserData: true,
      });
      refreshStorageUsage();
      showFeedback(`${res.removedCount} élément(s) de cache temporaire nettoyé(s).`);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    interfaceSettingsService.updateSettings(settings);
    setIsSaving(false);
    showFeedback('Paramètres enregistrés avec succès !');
  };

  const handleReset = () => {
    if (window.confirm('Rétablir tous les textes et paramètres par défaut ?')) {
      const reset = interfaceSettingsService.resetSettings();
      setSettings(reset);
      showFeedback('Paramètres réinitialisés aux valeurs par défaut');
    }
  };

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
          setSettings((prev) => ({ ...prev, heroImageUrl: compressed }));
          showFeedback('Image principale mise à jour (pensez à enregistrer)');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

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
            <span className="text-xs font-semibold text-slate-900">Paramètres</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            Paramètres Généraux de l’Application
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Personnaliser les informations de contact, les titres principaux et le visuel d’accueil.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Rétablir défaut
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-5">
        {/* Section 1: Hero Image */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-sky-600" />
            Visuel Principal de la Page d’Accueil
          </h3>

          <div className="flex flex-col sm:flex-row items-start gap-5">
            <div className="w-full sm:w-64 h-36 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative shrink-0">
              {settings.heroImageUrl ? (
                <img
                  src={settings.heroImageUrl}
                  alt="Visuel principal"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-8 h-8" />
                </div>
              )}
            </div>

            <div className="space-y-3 flex-1 text-xs">
              <p className="text-slate-600 leading-relaxed">
                Ce visuel est affiché en tête de la page d’accueil auprès des parents et nouveaux visiteurs.
              </p>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer px-4 py-2 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-xl font-semibold text-xs transition-colors flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  Importer une photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroUpload}
                    className="hidden"
                  />
                </label>
                {settings.heroImageUrl && (
                  <button
                    type="button"
                    onClick={() => setSettings((prev) => ({ ...prev, heroImageUrl: '' }))}
                    className="text-rose-600 hover:underline font-semibold"
                  >
                    Supprimer l'image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: General texts */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Type className="w-4 h-4 text-slate-700" />
            Titres & Textes Principaux
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Titre principal</label>
              <input
                type="text"
                value={settings.heroTitle || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, heroTitle: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-400"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Sous-titre d'accueil</label>
              <input
                type="text"
                value={settings.heroSubtitle || ''}
                onChange={(e) => setSettings((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="font-bold text-slate-700 block mb-1">Message d'engagement bienveillant</label>
            <textarea
              rows={2}
              value={settings.heroDescription || ''}
              onChange={(e) => setSettings((prev) => ({ ...prev, heroDescription: e.target.value }))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-400"
            />
          </div>
        </div>

        {/* Section 3: Contact & Support */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Mail className="w-4 h-4 text-slate-700" />
            Contact & Support
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Email de contact / assistance</label>
              <input
                type="email"
                value={settings.supportEmail || 'swimgaella@gmail.com'}
                onChange={(e) => setSettings((prev) => ({ ...prev, supportEmail: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-400 font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Nom de la structure / marque</label>
              <input
                type="text"
                value={settings.brandName || 'Baby Swim Vision'}
                onChange={(e) => setSettings((prev) => ({ ...prev, brandName: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Cycle de Vie & Maintenance du Cache Local */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-600" />
              Persistance & Cache Local
            </h3>
            <span className="text-[11px] font-mono px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
              Utilisation : {storageUsage.kb} Ko ({storageUsage.mb} Mo)
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Un système d'auto-réparation s'exécute automatiquement au démarrage de l'application pour détecter
            et purger les entrées JSON corrompues ou incomplètes qui pourraient bloquer le chargement.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleCleanCache}
              className="px-4 py-2 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 font-bold text-xs rounded-xl border border-cyan-200 transition-colors flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              Assainir le cache local
            </button>

            <button
              type="button"
              onClick={handlePurgeEphemeralCache}
              className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4 text-amber-600" />
              Vider caches temporaires
            </button>

            <button
              type="button"
              onClick={refreshStorageUsage}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Rafraîchir les statistiques"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {lastSanitizeReport && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Rapport d'intégrité ({new Date(lastSanitizeReport.timestamp).toLocaleTimeString()}) :
              </div>
              <div className="text-slate-600 text-[11px]">
                {lastSanitizeReport.totalKeysInspected} clés inspectées •{' '}
                {lastSanitizeReport.corruptedKeysRemoved.length} supprimée(s) •{' '}
                {lastSanitizeReport.repairedKeys.length} réparée(s)
              </div>
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  );
};
