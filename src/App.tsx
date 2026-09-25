import React, { useState, useEffect } from 'react';
import {
  BabyProfile,
  SessionRecord,
  AnalysisResult,
  UserProfile,
  BabyProgressSummary,
  VideoMetadata,
} from './types';
import { authService } from './services/authService';
import { babyService } from './services/babyService';
import { progressService } from './services/progressService';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { VideoRecorderUpload } from './components/VideoRecorderUpload';
import { PreAnalysisView } from './components/PreAnalysisView';
import { AnalysisResultView } from './components/AnalysisResultView';
import { ProgressView } from './components/ProgressView';
import { SessionsHistoryView } from './components/SessionsHistoryView';
import { PedagogicalLibraryView } from './components/PedagogicalLibraryView';
import { BabyProfileView } from './components/BabyProfileView';
import { FindClubView } from './components/FindClubView';
import { AuthModal } from './components/AuthModal';
import { BabyProfileModal } from './components/BabyProfileModal';
import { PrivacyModal } from './components/PrivacyModal';
import { LanguageSelectModal } from './components/LanguageSelectModal';
import { DryDrowningFactsheet } from './components/DryDrowningFactsheet';
import { CheckoutModal } from './components/CheckoutModal';
import { VisualEditorModal } from './components/VisualEditorModal';
import { AdminPasscodeModal } from './components/AdminPasscodeModal';
import { getLocalizedDemoScenarios } from './data/pedagogicalDatabase';
import { DemoAnalysisProvider } from './services/analysisService';
import { interfaceSettingsService, InterfaceSettings } from './services/interfaceSettingsService';
import { paymentService } from './services/paymentService';
import { CheckCircle2, X, Shield } from 'lucide-react';
import { useTranslation } from './i18n/LanguageContext';
import { AdminModeProvider } from './context/AdminModeContext';
import { AdminDirectModals } from './components/AdminDirectModals';
import { OfficialLogo } from './components/OfficialLogo';
import { AdminView } from './components/admin/AdminView';

export default function App() {
  const { t, hasChosenLanguage, currentLanguage, locale } = useTranslation();

  // Navigation View State
  const [currentView, setCurrentView] = useState<
    'landing' | 'dashboard' | 'record' | 'pre-analysis' | 'analysis-result' | 'progress' | 'sessions' | 'library' | 'baby-profile' | 'find-club' | 'admin'
  >(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const v = params.get('view');
        const currentUserNow = authService.getCurrentUser();
        const hasAccess = currentUserNow?.role === 'ADMIN' || currentUserNow?.role === 'USER_PREMIUM';
        const publicViews = ['landing', 'find-club'];
        if (v && publicViews.includes(v)) {
          return v as any;
        }
        if (v && hasAccess) {
          const validViews = ['landing', 'dashboard', 'record', 'pre-analysis', 'analysis-result', 'progress', 'sessions', 'library', 'baby-profile', 'find-club', 'admin'];
          if (validViews.includes(v)) {
            return v as any;
          }
        }
      } catch (_) {}
    }
    return 'landing';
  });

  // User State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(authService.getCurrentUser());

  // Interface & CMS Settings State
  const [interfaceSettings, setInterfaceSettings] = useState<InterfaceSettings>(interfaceSettingsService.getSettings());

  // Babies State
  const [babies, setBabies] = useState<BabyProfile[]>([]);
  const [activeBabyId, setActiveBabyId] = useState<string>('');

  // Sessions History & Progression State
  const [sessions, setSessions] = useState<SessionRecord[]>([]);

  // Current Video Workflow State
  const [currentVideoParams, setCurrentVideoParams] = useState<{
    videoBlob: Blob | File;
    videoUrl: string;
    durationSeconds: number;
    sizeMB: number;
    name: string;
    situationKey?: string;
    demoScenarioId?: string;
    metadata?: VideoMetadata;
  } | null>(null);

  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [babyModalOpen, setBabyModalOpen] = useState<boolean>(false);
  const [privacyModalOpen, setPrivacyModalOpen] = useState<boolean>(false);
  const [languageModalOpen, setLanguageModalOpen] = useState<boolean>(!hasChosenLanguage);
  const [dryDrowningModalOpen, setDryDrowningModalOpen] = useState<boolean>(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [visualEditorOpen, setVisualEditorOpen] = useState<boolean>(false);
  const [visualEditorInitialTab, setVisualEditorInitialTab] = useState<'photos' | 'texts' | 'videos' | 'promo' | 'roles' | 'clubs' | 'payment'>('photos');
  const [adminPasscodeModalOpen, setAdminPasscodeModalOpen] = useState<boolean>(false);
  const [editingBaby, setEditingBaby] = useState<BabyProfile | null>(null);
  const [stripeNotification, setStripeNotification] = useState<{
    type: 'success' | 'cancelled';
    message: string;
    details?: string;
  } | null>(null);

  // Handle return from Stripe Checkout
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const sessionId = urlParams.get('session_id');
      const stripeStatus = urlParams.get('stripe_status');

      if (sessionId && stripeStatus === 'success') {
        paymentService.verifyStripeSession(sessionId)
          .then((result) => {
            if (result.success) {
              const isVip = Boolean((result as any).isVipMonthFree);
              setStripeNotification({
                type: 'success',
                message: isVip ? 'Offre VIP Stripe confirmée !' : 'Paiement Stripe confirmé avec succès !',
                details: (result as any).message || (isVip
                  ? 'Votre accès VIP (1 mois offert) est désormais actif. Aucun prélèvement automatique futur.'
                  : 'Votre accès "Baby Swim Vision – Premium à vie" est désormais actif de manière permanente sans abonnement.'),
              });
              refreshData();
            } else {
              setStripeNotification({
                type: 'cancelled',
                message: 'Paiement en cours de confirmation auprès de Stripe.',
              });
            }
            window.history.replaceState({}, document.title, window.location.pathname);
          })
          .catch((err) => {
            console.error('Erreur verification Stripe:', err);
            setStripeNotification({
              type: 'cancelled',
              message: 'Erreur lors de la confirmation du paiement Stripe.',
            });
            window.history.replaceState({}, document.title, window.location.pathname);
          });
      } else if (stripeStatus === 'cancelled') {
        setStripeNotification({
          type: 'cancelled',
          message: 'Paiement Stripe annulé. Aucun débit n\'a été effectué.',
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (e) {
      console.warn('Stripe return check error:', e);
    }
  }, []);

  const handleSwitchRole = (role: 'USER_FREE' | 'USER_PREMIUM' | 'ADMIN') => {
    if (role === 'ADMIN') {
      if (authService.isAdminUnlocked()) {
        authService.ensureAdminMode();
        refreshData();
      } else {
        setAdminPasscodeModalOpen(true);
      }
    } else {
      authService.setSimulationMode(role);
      refreshData();
    }
  };

  const handleOpenVisualEditor = () => {
    if (authService.isAdminUnlocked()) {
      setVisualEditorInitialTab('photos');
      setVisualEditorOpen(true);
    } else {
      setAdminPasscodeModalOpen(true);
    }
  };

  const handleOpenPaymentControl = () => {
    if (authService.isAdminUnlocked()) {
      setVisualEditorInitialTab('payment');
      setVisualEditorOpen(true);
    } else {
      setAdminPasscodeModalOpen(true);
    }
  };

  // Initial Load & Auth subscriptions
  useEffect(() => {
    const unsubAuth = authService.subscribe((user) => {
      setCurrentUser(user);
      refreshData();
    });

    const unsubBabies = babyService.subscribe((babyList, active) => {
      setBabies(babyList);
      if (active) {
        setActiveBabyId(active.id);
        setSessions(progressService.getSessions(active.id));
      } else {
        setActiveBabyId('');
        setSessions([]);
      }
    });

    const unsubSettings = interfaceSettingsService.subscribe((settings) => {
      setInterfaceSettings(settings);
    });

    refreshData();

    return () => {
      unsubAuth();
      unsubBabies();
      unsubSettings();
    };
  }, []);

  const refreshData = () => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);
    const babyList = babyService.getUserBabies(user?.id);
    setBabies(babyList);

    const active = babyService.getActiveBaby(user?.id);
    if (active) {
      setActiveBabyId(active.id);
      setSessions(progressService.getSessions(active.id));
    } else if (babyList.length > 0) {
      setActiveBabyId(babyList[0].id);
      babyService.setActiveBaby(babyList[0].id, user?.id);
      setSessions(progressService.getSessions(babyList[0].id));
    } else {
      setActiveBabyId('');
      setSessions([]);
    }
  };

  // Update sessions when active baby changes
  useEffect(() => {
    if (activeBabyId) {
      setSessions(progressService.getSessions(activeBabyId));
    } else {
      setSessions([]);
    }
  }, [activeBabyId]);

  const activeBaby = babies.find((b) => b.id === activeBabyId) || (babies.length > 0 ? babies[0] : null);

  const handleSaveBabyProfile = (babyData: Omit<BabyProfile, 'id' | 'createdAt'>) => {
    if (editingBaby) {
      const updated: BabyProfile = {
        ...editingBaby,
        ...babyData,
      };
      babyService.saveBaby(updated);
      setActiveBabyId(updated.id);
      setEditingBaby(null);
    } else {
      const newBaby: BabyProfile = {
        id: `baby_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        userId: currentUser?.id || 'guest',
        name: babyData.name,
        birthDate: babyData.birthDate,
        ageMonths: babyData.ageMonths || 6,
        ageWeeks: (babyData.ageMonths || 6) * 4,
        level: babyData.level || 'decouverte',
        startDate: babyData.startDate || new Date().toISOString().split('T')[0],
        goals: babyData.goals || ['Éveil aquatique'],
        hideNameInAnalysis: babyData.hideNameInAnalysis || false,
        avatarUrl: babyData.avatarUrl || '👶',
      };
      babyService.saveBaby(newBaby);
      setActiveBabyId(newBaby.id);
    }
    refreshData();
    setBabyModalOpen(false);
  };

  const handleDeleteBabyProfile = (babyId: string) => {
    babyService.deleteBaby(babyId);
    refreshData();
  };

  const handleStartAnalysisWorkflow = (videoParams: {
    videoBlob: Blob | File;
    videoUrl: string;
    durationSeconds: number;
    sizeMB: number;
    name: string;
    situationKey?: string;
    demoScenarioId?: string;
    metadata?: VideoMetadata;
  }) => {
    setCurrentVideoParams(videoParams);
    setCurrentView('pre-analysis');
  };

  const handleAnalysisCompleted = (result: AnalysisResult) => {
    setCurrentAnalysis(result);
    if (activeBabyId) {
      progressService.saveSession({
        id: `session_${Date.now()}`,
        userId: currentUser?.id || 'guest',
        babyId: activeBabyId,
        date: new Date().toISOString(),
        title: result.situation || 'Séance aquatique',
        videoUrl: currentVideoParams?.videoUrl || '',
        videoDurationSeconds: currentVideoParams?.durationSeconds || 30,
        videoSizeMB: currentVideoParams?.sizeMB || 10,
        situationKey: result.situationKey || 'sit_portage_ventral',
        situationTitle: result.situation || 'Portage ventral',
        analysis: result,
      });
      refreshData();
    }
    setCurrentView('analysis-result');
  };

  const handleLaunchDemoScenario = (scenarioId: string) => {
    const scenarios = getLocalizedDemoScenarios(locale);
    const scenario = scenarios.find((s) => s.id === scenarioId) || scenarios[0];
    const mockBlob = new Blob([], { type: 'video/mp4' });

    const demoVideoUrlMap: Record<string, string> = {
      demo_immersion_verticale_parent: '/media/demo-videos/glenn%20immersion%20verticale.mp4',
      demo_portage_ventral_vertical: '/media/demo-videos/glenn%20immersion%20l%C3%A2ch%C3%A9e.mp4',
      demo_flottaison_dorsale_nuque: '/media/demo-videos/lilou%20dos%20brassards.mp4',
      demo_immersion_rituel: '/media/demo-videos/glenn%20taper%20eau.mp4',
      demo_deplacement_battements: '/media/demo-videos/lilou%20d%C3%A9part%20escalier.mp4',
    };
    const mockUrl =
      (scenario as any).videoUrl ||
      demoVideoUrlMap[scenario.id] ||
      '/media/demo-videos/glenn%20immersion%20verticale.mp4';

    setCurrentVideoParams({
      videoBlob: mockBlob,
      videoUrl: mockUrl,
      durationSeconds: scenario.videoDuration || 20,
      sizeMB: scenario.videoSizeMB || 12.4,
      name: scenario.title,
      situationKey: scenario.situationKey,
      demoScenarioId: scenario.id,
    });
    setCurrentView('pre-analysis');
  };

  const handleSignOut = () => {
    authService.signOut();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const hasLifetimeAccess = currentUser?.role === 'ADMIN' || currentUser?.role === 'USER_PREMIUM';

  // Strict Paywall Guard: if a visitor/free user is on a protected view, redirect to landing & prompt them
  useEffect(() => {
    const protectedViews = [
      'dashboard',
      'record',
      'pre-analysis',
      'analysis-result',
      'progress',
      'sessions',
      'library',
      'baby-profile',
    ];
    if (!hasLifetimeAccess && protectedViews.includes(currentView)) {
      setCurrentView('landing');
      if (!currentUser) {
        setAuthModalOpen(true);
      } else {
        setCheckoutModalOpen(true);
      }
    }
  }, [currentView, hasLifetimeAccess, currentUser]);

  const handleNavigate = (view: string) => {
    const protectedViews = [
      'dashboard',
      'record',
      'pre-analysis',
      'analysis-result',
      'progress',
      'sessions',
      'library',
      'baby-profile',
      'admin',
    ];
    if (view === 'admin') {
      if (!authService.isRealAdmin(currentUser)) {
        setAdminPasscodeModalOpen(true);
        return;
      }
      setCurrentView('admin');
      return;
    }

    if (!hasLifetimeAccess && protectedViews.includes(view)) {
      if (!currentUser) {
        setAuthModalOpen(true);
      } else {
        setCheckoutModalOpen(true);
      }
      return;
    }

    setCurrentView(view as any);
  };

  const progressSummary = activeBabyId
    ? progressService.getProgressSummary(activeBabyId)
    : null;

  if (currentView === 'admin') {
    return (
      <AdminModeProvider userRole={currentUser?.role}>
        {authService.isAdminUnlocked() && authService.isRealAdmin(currentUser) ? (
          <AdminView
            currentUser={currentUser}
            onExitAdmin={() => setCurrentView('dashboard')}
            onUserUpdated={() => {
              setCurrentUser(authService.getCurrentUser());
              refreshData();
            }}
          />
        ) : (
          <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-md border border-slate-200/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Accès Administrateur Restreint</h2>
              <p className="text-xs text-slate-500">
                Cette interface est strictement réservée à l'administrateur après authentification.
              </p>
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setAuthModalOpen(true);
                }}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Se connecter
              </button>
            </div>
          </div>
        )}

        {authModalOpen && (
          <AuthModal
            onClose={() => setAuthModalOpen(false)}
            onSuccess={(user) => {
              setCurrentUser(user);
              refreshData();
            }}
          />
        )}
        <AdminDirectModals />
      </AdminModeProvider>
    );
  }

  return (
    <AdminModeProvider userRole={currentUser?.role}>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
        {/* Global Header with Single Unified Profile dropdown */}
        <Header
          currentUser={currentUser}
          activeBaby={activeBaby}
          babies={babies}
          currentView={currentView}
          onNavigate={handleNavigate}
          onOpenBabyModal={() => {
            setEditingBaby(null);
            setBabyModalOpen(true);
          }}
          onEditBaby={(baby) => {
            setEditingBaby(baby);
            setBabyModalOpen(true);
          }}
          onSelectBaby={(id) => {
            babyService.setActiveBaby(id);
            setActiveBabyId(id);
          }}
          onOpenAuthModal={() => setAuthModalOpen(true)}
          onOpenPrivacyModal={() => setPrivacyModalOpen(true)}
          onOpenLanguageModal={() => setLanguageModalOpen(true)}
          onSignOut={handleSignOut}
          onOpenCheckout={() => {
            if (!currentUser) {
              setAuthModalOpen(true);
            } else {
              setCheckoutModalOpen(true);
            }
          }}
        />

        {/* Stripe Feedback Notification Banner */}
        {stripeNotification && (
          <div className={`border-b px-4 py-3 text-sm flex items-center justify-between gap-3 animate-fade-in ${
            stripeNotification.type === 'success'
              ? 'bg-emerald-500 text-white border-emerald-600 shadow-md'
              : 'bg-amber-100 text-amber-900 border-amber-300'
          }`}>
            <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <span className="font-extrabold block">{stripeNotification.message}</span>
                  {stripeNotification.details && (
                    <span className="text-xs opacity-95 block">{stripeNotification.details}</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStripeNotification(null)}
                className="p-1 rounded-lg hover:bg-black/10 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content View Switcher */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {currentView === 'landing' && (
            <LandingPage
              onStart={() => handleNavigate('dashboard')}
              onExploreDemo={() => {
                if (!currentUser) {
                  setAuthModalOpen(true);
                } else if (!hasLifetimeAccess) {
                  setCheckoutModalOpen(true);
                } else {
                  handleLaunchDemoScenario('demo-1-immersion');
                }
              }}
              onOpenCheckout={() => {
                if (!currentUser) {
                  setAuthModalOpen(true);
                } else {
                  setCheckoutModalOpen(true);
                }
              }}
              hasLifetimeAccess={hasLifetimeAccess}
              onNavigate={handleNavigate}
            />
          )}

          {currentView === 'dashboard' && (
            <Dashboard
              activeBaby={activeBaby}
              babies={babies}
              sessions={sessions}
              progressSummary={progressSummary}
              currentUser={currentUser}
              onNavigate={handleNavigate}
              onOpenBabyModal={() => {
                setEditingBaby(null);
                setBabyModalOpen(true);
              }}
              onLaunchDemo={handleLaunchDemoScenario}
              onStartNewAnalysis={() => handleNavigate('record')}
              onOpenDryDrowning={() => setDryDrowningModalOpen(true)}
              onOpenCheckout={() => setCheckoutModalOpen(true)}
            />
          )}

          {currentView === 'record' && (
            <VideoRecorderUpload
              activeBaby={activeBaby}
              currentUser={currentUser}
              onVideoReady={handleStartAnalysisWorkflow}
              onLaunchDemo={handleLaunchDemoScenario}
              onCancel={() => handleNavigate('dashboard')}
              onOpenCheckout={() => setCheckoutModalOpen(true)}
            />
          )}

          {currentView === 'pre-analysis' && currentVideoParams && (
            <PreAnalysisView
              videoParams={currentVideoParams}
              activeBaby={activeBaby}
              onAnalysisCompleted={handleAnalysisCompleted}
              onBack={() => setCurrentView('record')}
            />
          )}

          {currentView === 'analysis-result' && currentAnalysis && (
            <AnalysisResultView
              analysis={currentAnalysis}
              videoUrl={currentVideoParams?.videoUrl || ''}
              activeBaby={activeBaby}
              onNewAnalysis={() => setCurrentView('record')}
              onGoToDashboard={() => setCurrentView('dashboard')}
              onOpenDryDrowning={() => setDryDrowningModalOpen(true)}
              onSaveSession={() => setCurrentView('sessions')}
              onViewProgress={() => setCurrentView('progress')}
            />
          )}

          {currentView === 'sessions' && (
            <SessionsHistoryView
              activeBaby={activeBaby}
              sessions={sessions}
              currentUser={currentUser}
              onSelectSession={(session) => {
                setCurrentAnalysis(session.analysis);
                setCurrentVideoParams({
                  videoBlob: new Blob([], { type: 'video/mp4' }),
                  videoUrl: session.videoUrl || '',
                  durationSeconds: session.videoDurationSeconds || 20,
                  sizeMB: session.videoSizeMB || 10,
                  name: session.title || 'Séance archivée',
                  situationKey: session.situationKey,
                });
                setCurrentView('analysis-result');
              }}
              onDeleteSession={(sessionId) => {
                progressService.deleteSession(sessionId);
                refreshData();
              }}
              onOpenCheckout={() => setCheckoutModalOpen(true)}
              onNewSession={() => setCurrentView('record')}
              onNavigate={(view) => setCurrentView(view as any)}
            />
          )}

          {currentView === 'progress' && (
            <ProgressView
              activeBaby={activeBaby}
              progressSummary={progressSummary}
              sessions={sessions}
              onStartNewAnalysis={() => setCurrentView('record')}
              onNewAnalysis={() => setCurrentView('record')}
            />
          )}

          {currentView === 'baby-profile' && (
            <BabyProfileView
              babies={babies}
              activeBaby={activeBaby}
              currentUser={currentUser}
              onSelectBaby={(id) => setActiveBabyId(id)}
              onSaveBaby={handleSaveBabyProfile}
              onDeleteBaby={handleDeleteBabyProfile}
              onNavigate={(view) => setCurrentView(view as any)}
              onOpenCheckout={() => setCheckoutModalOpen(true)}
              onOpenVisualEditor={handleOpenVisualEditor}
              onSwitchRole={handleSwitchRole}
            />
          )}

          {currentView === 'library' && (
            <PedagogicalLibraryView
              currentUser={currentUser}
              onOpenCheckout={() => setCheckoutModalOpen(true)}
            />
          )}

          {currentView === 'find-club' && (
            <FindClubView
              activeBaby={activeBaby}
              onNavigateHome={() => setCurrentView('dashboard')}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 text-center text-xs text-slate-500 space-y-3">
          <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <OfficialLogo className="h-8 w-auto object-contain" />
              <span>•</span>
              <span>{t('common.pedagogicalAssistant')}</span>
              <span>•</span>
              <button
                onClick={() => setLanguageModalOpen(true)}
                className="inline-flex items-center gap-1 text-slate-600 hover:text-sky-600 font-semibold cursor-pointer"
              >
                <span>{currentLanguage.flag}</span>
                <span>{currentLanguage.nativeName}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
              <a
                href="https://www.facebook.com/groups/232584653458212"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100 hover:border-blue-200 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>{t('nav.facebookGroup')}</span>
              </a>
              <button
                onClick={() => setDryDrowningModalOpen(true)}
                className="inline-flex items-center gap-1 text-sky-600 hover:text-sky-700 bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-100 hover:border-sky-200 transition-colors cursor-pointer"
              >
                <span>💧</span>
                <span>{t('dryDrowning.title')}</span>
              </button>
              <button
                onClick={() => setPrivacyModalOpen(true)}
                className="hover:text-sky-600 cursor-pointer"
              >
                {t('privacy.title')}
              </button>
              <button
                onClick={() => setCurrentView('find-club')}
                className="hover:text-sky-600 cursor-pointer font-bold text-sky-700"
              >
                🌍 {t('nav.findClub') || 'Trouvez mon club'}
              </button>
              <button
                onClick={() => setCurrentView('library')}
                className="hover:text-sky-600 cursor-pointer"
              >
                {t('nav.library')}
              </button>
              <button
                onClick={() => setCurrentView('landing')}
                className="hover:text-sky-600 cursor-pointer"
              >
                {t('landing.badge')}
              </button>
            </div>
          </div>

          <p className="text-[11px] text-slate-400 max-w-xl mx-auto">
            {t('safety.footerDisclaimer')}
          </p>
        </footer>

        {/* Global Modals */}
        {languageModalOpen && (
          <LanguageSelectModal
            isOpen={languageModalOpen}
            onClose={() => setLanguageModalOpen(false)}
            isFirstLaunch={!hasChosenLanguage}
          />
        )}

        {authModalOpen && (
          <AuthModal
            onClose={() => setAuthModalOpen(false)}
            onSuccess={(authenticatedUser) => {
              const user = authenticatedUser || authService.getCurrentUser();
              setCurrentUser(user);
              refreshData();
              if (user && user.role === 'ADMIN') {
                authService.ensureAdminMode();
                setVisualEditorInitialTab('photos');
                setVisualEditorOpen(true);
              } else if (user && user.role === 'USER_FREE') {
                setCheckoutModalOpen(true);
              } else if (user && user.role === 'USER_PREMIUM') {
                setCurrentView('dashboard');
              }
            }}
          />
        )}

        {babyModalOpen && (
          <BabyProfileModal
            initialBaby={editingBaby}
            onClose={() => setBabyModalOpen(false)}
            onSave={handleSaveBabyProfile}
            onDelete={handleDeleteBabyProfile}
          />
        )}

        {privacyModalOpen && (
          <PrivacyModal onClose={() => setPrivacyModalOpen(false)} />
        )}

        {checkoutModalOpen && (
          <CheckoutModal
            isOpen={checkoutModalOpen}
            onClose={() => setCheckoutModalOpen(false)}
            onSuccess={(user) => {
              setCurrentUser(user);
              refreshData();
              setCurrentView('dashboard');
            }}
            initialEmail={currentUser?.email}
          />
        )}

        {dryDrowningModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-fade-in">
            <div className="bg-white w-full max-w-3xl rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative my-auto">
              <DryDrowningFactsheet
                isModal={true}
                onClose={() => setDryDrowningModalOpen(false)}
              />
            </div>
          </div>
        )}

        {/* Visual CMS / No-Code Editor Modal for Admin */}
        <VisualEditorModal
          isOpen={visualEditorOpen}
          initialTab={visualEditorInitialTab}
          onClose={() => setVisualEditorOpen(false)}
          currentUser={currentUser}
          onUserUpdated={() => refreshData()}
        />

        {/* Admin Passcode Modal */}
        <AdminPasscodeModal
          isOpen={adminPasscodeModalOpen}
          onClose={() => setAdminPasscodeModalOpen(false)}
          onSuccess={() => {
            authService.ensureAdminMode();
            setCurrentUser(authService.getCurrentUser());
            refreshData();
            setVisualEditorOpen(true);
          }}
        />

        {/* In-app Direct Modals for Articles, Exercises, Images, Settings */}
        <AdminDirectModals />
      </div>
    </AdminModeProvider>
  );
}
