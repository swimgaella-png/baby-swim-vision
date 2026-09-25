import React from 'react';
import { Sliders, Plus, Settings, Sparkles, Image as ImageIcon, Check, Lock, FileText, BookOpen, CreditCard } from 'lucide-react';
import { useAdminMode } from '../context/AdminModeContext';

interface AdminBarProps {
  onOpenSettingsModal?: () => void;
  onOpenPaymentControl?: () => void;
}

export const AdminBar: React.FC<AdminBarProps> = ({ onOpenSettingsModal, onOpenPaymentControl }) => {
  const {
    isAdminModeActive,
    toggleAdminMode,
    lockAdminMode,
    setIsCreatingArticle,
    setIsCreatingExercise,
  } = useAdminMode();

  if (!isAdminModeActive) return null;

  return (
    <aside aria-label="Barre d'administration" className="sticky top-0 z-50 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 text-white px-4 py-2.5 shadow-xl border-b border-indigo-500/30 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Status indicator */}
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <div className="flex items-center gap-1.5 font-black text-xs uppercase tracking-wider text-amber-300">
            <Sliders className="w-3.5 h-3.5" />
            <span>Mode Administrateur Actif</span>
          </div>
          <span className="text-slate-500 text-xs hidden sm:inline">•</span>
          <span className="text-slate-300 text-xs font-medium hidden md:inline">
            Cliquez sur <strong className="text-amber-200">✏️ Modifier</strong> ou <strong className="text-amber-200">📷 Modifier l'image</strong> directement sur les éléments de l'application
          </span>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCreatingArticle(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600/90 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border border-indigo-400/30 hover:scale-102"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Article</span>
          </button>

          <button
            onClick={() => setIsCreatingExercise(true)}
            className="flex items-center gap-1.5 px-3 py-1 bg-sky-600/90 hover:bg-sky-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border border-sky-400/30 hover:scale-102"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Exercice</span>
          </button>

          {onOpenPaymentControl && (
            <button
              onClick={onOpenPaymentControl}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-700/90 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border border-emerald-400/30 hover:scale-102"
              title="Vérifier le système de paiement Stripe et tester le parcours Premium"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-300" />
              <span>Contrôle Paiement & Sandbox</span>
            </button>
          )}

          {onOpenSettingsModal && (
            <button
              onClick={onOpenSettingsModal}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-700 cursor-pointer shadow-xs"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Console CMS & Gestion</span>
            </button>
          )}

          <button
            onClick={lockAdminMode}
            className="flex items-center gap-1 px-3 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded-xl text-xs font-bold transition-all border border-rose-500/30 cursor-pointer"
            title="Verrouiller et quitter le mode administrateur (nécessitera le code)"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Verrouiller</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
