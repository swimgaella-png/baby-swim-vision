import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ChevronRight,
  User,
  Crown,
  Shield,
  BookOpen,
  Video,
  MapPin,
  Building2,
  Clock,
  Database,
  Bell,
  Users,
  CreditCard,
  Settings,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { authService } from '../../services/authService';
import { clubService } from '../../services/clubService';
import { adminManagementService } from '../../services/adminManagementService';
import { User as UserType } from '../../types';

// Sub-views
import { AdminContentSubView } from './AdminContentSubView';
import { AdminDemoVideosSubView } from './AdminDemoVideosSubView';
import { AdminClubsManager } from '../AdminClubsManager';
import { AdminKnowledgeSubView } from './AdminKnowledgeSubView';
import { AdminNotificationsSubView } from './AdminNotificationsSubView';
import { AdminUsersSubView } from './AdminUsersSubView';
import { AdminPremiumSubView } from './AdminPremiumSubView';
import { AdminPaymentsSubView } from './AdminPaymentsSubView';
import { AdminSettingsSubView } from './AdminSettingsSubView';

export type AdminSubSection =
  | 'home'
  | 'content'
  | 'demo_videos'
  | 'clubs_validated'
  | 'clubs_pending'
  | 'knowledge_base'
  | 'notifications'
  | 'users'
  | 'premium'
  | 'payments'
  | 'settings';

interface AdminViewProps {
  currentUser: UserType | null;
  onExitAdmin: () => void;
  onUserUpdated?: () => void;
  initialSubSection?: AdminSubSection;
}

export const AdminView: React.FC<AdminViewProps> = ({
  currentUser,
  onExitAdmin,
  onUserUpdated,
  initialSubSection = 'home',
}) => {
  const [activeSubSection, setActiveSubSection] = useState<AdminSubSection>(initialSubSection);
  const [pendingClubsCount, setPendingClubsCount] = useState<number>(0);
  const [activeNotifsCount, setActiveNotifsCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  // Load summary badges
  useEffect(() => {
    const loadBadges = async () => {
      try {
        const clubs = await clubService.getClubs();
        const pending = clubs.filter((c) => c.status === 'pending').length;
        setPendingClubsCount(pending);

        const notifs = await adminManagementService.fetchNotifications();
        setActiveNotifsCount(notifs.filter((n) => n.status === 'sent').length);

        const users = await adminManagementService.fetchUsers();
        setUsersCount(users.length);
      } catch (err) {
        console.warn('Error loading admin summary badges', err);
      }
    };
    loadBadges();
  }, []);

  // Determine current simulation state
  const currentSim = currentUser?.simulatedRole; // null = Admin, 'USER_FREE' = Free, 'USER_PREMIUM' = Premium

  const handleSetSimulation = (role: 'USER_FREE' | 'USER_PREMIUM' | null) => {
    authService.setSimulationMode(role);
    onUserUpdated?.();
    if (role === 'USER_FREE') {
      showFeedback('Mode activé : Parent / Utilisateur gratuit (Limitations réelles appliquées)');
    } else if (role === 'USER_PREMIUM') {
      showFeedback('Mode activé : Parent / Premium (Accès illimité intégral appliqué)');
    } else {
      showFeedback('Mode restauré : Administrateur (Tous droits administrateur actifs)');
    }
  };

  const handleLockSession = () => {
    if (window.confirm('Verrouiller la session administrateur et revenir à l’application ?')) {
      authService.lockAdmin();
      onUserUpdated?.();
      onExitAdmin();
    }
  };

  // Render Sub-Views
  if (activeSubSection === 'content') {
    return (
      <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn">
        {feedback && (
          <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {feedback}
          </div>
        )}
        <AdminContentSubView onBack={() => setActiveSubSection('home')} showFeedback={showFeedback} />
      </div>
    );
  }

  if (activeSubSection === 'demo_videos') {
    return (
      <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn">
        {feedback && (
          <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {feedback}
          </div>
        )}
        <AdminDemoVideosSubView onBack={() => setActiveSubSection('home')} showFeedback={showFeedback} />
      </div>
    );
  }

  if (activeSubSection === 'clubs_validated') {
    return (
      <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubSection('home')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
          >
            ← Administration
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold text-slate-900">Trouver mon club</span>
        </div>
        <AdminClubsManager initialTab="validated" onClose={() => setActiveSubSection('home')} />
      </div>
    );
  }

  if (activeSubSection === 'clubs_pending') {
    return (
      <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn space-y-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSubSection('home')}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1"
          >
            ← Administration
          </button>
          <span className="text-slate-300">/</span>
          <span className="text-xs font-semibold text-slate-900">Clubs proposés</span>
        </div>
        <AdminClubsManager initialTab="pending" onClose={() => setActiveSubSection('home')} />
      </div>
    );
  }

  if (activeSubSection === 'knowledge_base') {
    return (
      <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn">
        {feedback && (
          <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {feedback}
          </div>
        )}
        <AdminKnowledgeSubView onBack={() => setActiveSubSection('home')} showFeedback={showFeedback} />
      </div>
    );
  }

  if (activeSubSection === 'notifications') {
    return (
      <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn">
        {feedback && (
          <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {feedback}
          </div>
        )}
        <AdminNotificationsSubView onBack={() => setActiveSubSection('home')} showFeedback={showFeedback} />
      </div>
    );
  }

  if (activeSubSection === 'users') {
    return (
      <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn">
        {feedback && (
          <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {feedback}
          </div>
        )}
        <AdminUsersSubView onBack={() => setActiveSubSection('home')} showFeedback={showFeedback} />
      </div>
    );
  }

  if (activeSubSection === 'premium') {
    return (
      <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn">
        {feedback && (
          <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {feedback}
          </div>
        )}
        <AdminPremiumSubView onBack={() => setActiveSubSection('home')} showFeedback={showFeedback} />
      </div>
    );
  }

  if (activeSubSection === 'payments') {
    return (
      <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn">
        {feedback && (
          <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {feedback}
          </div>
        )}
        <AdminPaymentsSubView onBack={() => setActiveSubSection('home')} showFeedback={showFeedback} />
      </div>
    );
  }

  if (activeSubSection === 'settings') {
    return (
      <div className="min-h-screen bg-slate-50/70 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto animate-fadeIn">
        {feedback && (
          <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {feedback}
          </div>
        )}
        <AdminSettingsSubView onBack={() => setActiveSubSection('home')} showFeedback={showFeedback} />
      </div>
    );
  }

  // ==========================================
  // 🏛️ MAIN ADMIN DASHBOARD (SWIM VISION COACH STYLE)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 pb-16">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-slate-700 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {feedback}
        </div>
      )}

      {/* Top Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Retour à l'application</span>
            </button>
            <div className="h-5 w-px bg-slate-200 hidden sm:block" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">Administration</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Sécurisé
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                swimgaella@gmail.com
              </p>
            </div>
          </div>

          <button
            onClick={handleLockSession}
            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
            title="Verrouiller l'accès"
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Verrouiller</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-8">
        {/* ================================================== */}
        {/* SECTION 1: TESTER L’APPLICATION EN TANT QUE        */}
        {/* ================================================== */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-bold tracking-wider uppercase text-slate-400 px-1">
            Tester l’application en tant que
          </h2>

          <div className="space-y-2.5">
            {/* 1. Parent / Utilisateur gratuit */}
            <div
              onClick={() => handleSetSimulation('USER_FREE')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                currentSim === 'USER_FREE'
                  ? 'bg-sky-50/70 border-sky-500 shadow-xs ring-2 ring-sky-500/20'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-100/70 text-sky-700 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Parent / Utilisateur gratuit</h3>
                    {currentSim === 'USER_FREE' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-200/80 text-sky-900">
                        Actif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tester l’application avec les limitations du compte gratuit.
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`w-5 h-5 shrink-0 ${
                  currentSim === 'USER_FREE' ? 'text-sky-600' : 'text-slate-300'
                }`}
              />
            </div>

            {/* 2. Parent / Premium */}
            <div
              onClick={() => handleSetSimulation('USER_PREMIUM')}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                currentSim === 'USER_PREMIUM'
                  ? 'bg-amber-50/70 border-amber-500 shadow-xs ring-2 ring-amber-500/20'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Parent / Premium</h3>
                    {currentSim === 'USER_PREMIUM' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200/80 text-amber-900">
                        Actif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tester l’application comme un utilisateur ayant acheté l’accès Premium.
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`w-5 h-5 shrink-0 ${
                  currentSim === 'USER_PREMIUM' ? 'text-amber-600' : 'text-slate-300'
                }`}
              />
            </div>

            {/* 3. Administrateur */}
            <div
              onClick={() => handleSetSimulation(null)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                currentSim === null
                  ? 'bg-indigo-50/70 border-indigo-500 shadow-xs ring-2 ring-indigo-500/20'
                  : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-100/70 text-indigo-700 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Administrateur</h3>
                    {currentSim === null && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-200/80 text-indigo-900">
                        Actif
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tester l’application avec les droits administrateur.
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`w-5 h-5 shrink-0 ${
                  currentSim === null ? 'text-indigo-600' : 'text-slate-300'
                }`}
              />
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* SECTION 2: GESTION DE L’APPLICATION               */}
        {/* ================================================== */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-bold tracking-wider uppercase text-slate-400 px-1">
            Gestion de l’application
          </h2>

          <div className="space-y-2.5">
            {/* Contenus */}
            <div
              onClick={() => setActiveSubSection('content')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Contenus</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gérer les articles, exercices, séances, conseils et contenus pédagogiques.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
            </div>

            {/* Vidéos de démonstration */}
            <div
              onClick={() => setActiveSubSection('demo_videos')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-100 transition-colors">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Vidéos de démonstration</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gérer les vidéos pédagogiques et leur affichage dans l'application.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
            </div>

            {/* Trouver mon club */}
            <div
              onClick={() => setActiveSubSection('clubs_validated')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:bg-sky-100 transition-colors">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Trouver mon club</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gérer les clubs et structures aquatiques référencés.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
            </div>

            {/* Clubs proposés */}
            <div
              onClick={() => setActiveSubSection('clubs_pending')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Clubs proposés</h3>
                    {pendingClubsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                        {pendingClubsCount} en attente
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Vérifier et valider les clubs proposés par les utilisateurs.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
            </div>

            {/* Base de connaissances */}
            <div
              onClick={() => setActiveSubSection('knowledge_base')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Base de connaissances</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gérer les connaissances utilisées par les analyses et les contenus pédagogiques.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
            </div>

            {/* Notifications */}
            <div
              onClick={() => setActiveSubSection('notifications')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
                    {activeNotifsCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200">
                        {activeNotifsCount} active(s)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gérer et envoyer les notifications aux utilisateurs.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* SECTION 3: COMPTES UTILISATEURS                   */}
        {/* ================================================== */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-bold tracking-wider uppercase text-slate-400 px-1">
            Comptes utilisateurs
          </h2>

          <div className="space-y-2.5">
            <div
              onClick={() => setActiveSubSection('users')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">Comptes utilisateurs</h3>
                    {usersCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {usersCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gérer les utilisateurs et leurs droits d’accès.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* SECTION 4: ACCÈS ET PAIEMENTS                     */}
        {/* ================================================== */}
        <section className="space-y-3">
          <h2 className="text-[11px] font-bold tracking-wider uppercase text-slate-400 px-1">
            Accès et paiements
          </h2>

          <div className="space-y-2.5">
            {/* Accès Premium */}
            <div
              onClick={() => setActiveSubSection('premium')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Accès Premium</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gérer et vérifier les droits d’accès Premium.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
            </div>

            {/* Paiements */}
            <div
              onClick={() => setActiveSubSection('payments')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:bg-emerald-100 transition-colors">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Paiements</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Consulter l’état des paiements et des accès Premium.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
            </div>
          </div>
        </section>

        {/* ================================================== */}
        {/* SECTION 5: PARAMÈTRES                             */}
        {/* ================================================== */}
        <section className="space-y-3">
          <div className="space-y-2.5">
            <div
              onClick={() => setActiveSubSection('settings')}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-slate-300 shadow-xs transition-all cursor-pointer flex items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 group-hover:bg-slate-200 transition-colors">
                  <Settings className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Paramètres</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Gérer les paramètres généraux de l’application.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 shrink-0 transition-colors" />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
