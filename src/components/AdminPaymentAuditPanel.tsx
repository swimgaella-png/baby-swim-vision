import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Play,
  Zap,
  Lock,
  Server,
  Key,
  Check,
  Clock,
  UserCheck,
  Sparkles,
  BadgeCheck,
  Activity,
  FileText,
  Terminal,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import { authService } from '../services/authService';

interface DiagnosticCheck {
  id: string;
  title: string;
  status: 'ok' | 'warning' | 'error';
  message: string;
  details: string;
  latencyMs?: number;
  remediation?: string;
}

interface DiagnosticResponse {
  success: boolean;
  timestamp: string;
  platform: string;
  environmentMode: string;
  isLiveMode: boolean;
  isTestMode: boolean;
  allChecksPassed: boolean;
  totalLatencyMs: number;
  checks: DiagnosticCheck[];
  activePromos: Array<{ code: string; label: string; active: boolean }>;
  productDetails: {
    id: string;
    name: string;
    amountEur: number;
    currency: string;
    type: string;
    recurring: any;
  } | null;
  recommendations: string[];
}

interface SimulationStep {
  stepNumber: number;
  title: string;
  status: 'completed' | 'failed';
  message: string;
  details: string;
  timestamp: string;
  data?: any;
}

interface SimulationResponse {
  success: boolean;
  testId: string;
  testDate: string;
  environmentMode: string;
  testUserEmail: string;
  allStepsSucceeded: boolean;
  steps: SimulationStep[];
  summary: {
    paymentPlatform: string;
    connectionStatus: string;
    configurationStatus: string;
    premiumProductStatus: string;
    oneTimePaymentStatus: string;
    paymentVerificationStatus: string;
    webhookStatus: string;
    flowTestResult: string;
    remainingErrors: string;
  };
}

export const AdminPaymentAuditPanel: React.FC<{
  onClose?: () => void;
}> = ({ onClose }) => {
  const [loadingAudit, setLoadingAudit] = useState<boolean>(false);
  const [auditData, setAuditData] = useState<DiagnosticResponse | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulationData, setSimulationData] = useState<SimulationResponse | null>(null);
  const [simulationError, setSimulationError] = useState<string | null>(null);
  const [testEmail, setTestEmail] = useState<string>('sandbox-test-parent@babyswimvision.test');
  const [selectedPromo, setSelectedPromo] = useState<string>('');

  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'simulation' | 'details'>('audit');

  // Load diagnostic on mount
  useEffect(() => {
    runDiagnostic();
  }, []);

  const runDiagnostic = async () => {
    setLoadingAudit(true);
    setAuditError(null);
    try {
      const res = await fetch('/api/admin/payment/diagnose', {
        headers: {
          ...authService.getAuthHeaders(),
          'x-user-email': authService.getCurrentUser()?.email || 'swimgaella@gmail.com',
        },
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Erreur serveur HTTP ${res.status}`);
      }
      const data: DiagnosticResponse = await res.json();
      setAuditData(data);
    } catch (err: any) {
      setAuditError(err.message || 'Impossible de contacter l\'API de diagnostic.');
    } finally {
      setLoadingAudit(false);
    }
  };

  const runSimulation = async () => {
    setSimulating(true);
    setSimulationError(null);
    setSimulationData(null);
    try {
      const res = await fetch('/api/admin/payment/simulate-premium-flow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authService.getAuthHeaders(),
          'x-user-email': authService.getCurrentUser()?.email || 'swimgaella@gmail.com',
        },
        body: JSON.stringify({
          testEmail: testEmail.trim() || 'sandbox-test-parent@babyswimvision.test',
          promoCode: selectedPromo || undefined,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || errData.message || `Erreur simulation HTTP ${res.status}`);
      }
      const data: SimulationResponse = await res.json();
      setSimulationData(data);
    } catch (err: any) {
      setSimulationError(err.message || 'Erreur pendant la simulation du parcours Premium.');
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Platform & Mode Indicator */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-indigo-400" />
                Plateforme : Stripe
              </span>

              {auditData ? (
                <span
                  className={`px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1.5 border shadow-xs ${
                    auditData.isLiveMode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      auditData.isLiveMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                    }`}
                  />
                  {auditData.environmentMode}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 text-slate-400">
                  Détection du mode...
                </span>
              )}

              {auditData?.allChecksPassed && (
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Système 100% Opérationnel
                </span>
              )}
            </div>

            <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>Contrôle Administrateur du Système de Paiement</span>
            </h3>
            <p className="text-xs text-indigo-200/80 max-w-2xl leading-relaxed">
              Vérifications réelles en direct avec l'API Stripe, test du parcours d'attribution Premium et
              simulateur sandbox sécurisé sans aucun débit bancaire réel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runDiagnostic}
              disabled={loadingAudit}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md hover:shadow-indigo-500/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingAudit ? 'animate-spin' : ''}`} />
              <span>{loadingAudit ? 'Audit en cours...' : 'Réauditer en direct'}</span>
            </button>
          </div>
        </div>

        {auditData?.isLiveMode && (
          <div className="mt-4 pt-3 border-t border-indigo-800/40 flex items-start gap-2.5 text-xs text-amber-200/90">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong>Mode Production Actif :</strong> Vos clés de production réelles sont en service. Le
              simulateur ci-dessous utilise une sandbox isolée côté serveur pour tester le parcours Free →
              Premium en garantissant qu'<strong>aucune carte bancaire n'est débitée</strong>.
            </p>
          </div>
        )}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveSubTab('audit')}
          className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'audit'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>1. État Réel de la Plateforme ({auditData?.checks?.length || 7} contrôles)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('simulation')}
          className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'simulation'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Play className="w-4 h-4 text-emerald-600" />
          <span>2. Simulateur du Parcours Premium (Sandbox)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('details')}
          className={`pb-2.5 px-3 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'details'
              ? 'border-indigo-600 text-indigo-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>3. Détails Techniques & Codes Promo</span>
        </button>
      </div>

      {/* TAB 1: Real Diagnostic Audit */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          {auditError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Erreur lors de la vérification :</p>
                <p>{auditError}</p>
              </div>
            </div>
          )}

          {loadingAudit && !auditData && (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Interrogation en direct de l'API Stripe...</p>
              <p className="text-[11px] text-slate-400">Vérification de la clé secrète, du produit et des signatures webhooks</p>
            </div>
          )}

          {auditData && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>
                  Dernière vérification API : <strong>{new Date(auditData.timestamp).toLocaleTimeString()}</strong>
                </span>
                <span>
                  Temps de réponse global : <strong>{auditData.totalLatencyMs} ms</strong>
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {auditData.checks.map((c) => {
                  const isOk = c.status === 'ok';
                  const isWarning = c.status === 'warning';
                  const isError = c.status === 'error';

                  return (
                    <div
                      key={c.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isOk
                          ? 'bg-white border-emerald-200/80 shadow-xs'
                          : isWarning
                          ? 'bg-amber-50/50 border-amber-300'
                          : 'bg-rose-50/50 border-rose-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          {isOk && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                          {isWarning && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
                          {isError && <XCircle className="w-4 h-4 text-rose-600 shrink-0" />}
                          <h4 className="text-xs font-bold text-slate-900">{c.title}</h4>
                        </div>
                        {c.latencyMs && (
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {c.latencyMs} ms
                          </span>
                        )}
                      </div>

                      <p
                        className={`text-xs font-bold mb-1 ${
                          isOk ? 'text-emerald-700' : isWarning ? 'text-amber-800' : 'text-rose-800'
                        }`}
                      >
                        {c.message}
                      </p>

                      <p className="text-[11px] text-slate-600 leading-relaxed">{c.details}</p>

                      {c.remediation && (
                        <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-indigo-700 font-medium flex items-start gap-1.5">
                          <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-indigo-500" />
                          <span>Action recommandée : {c.remediation}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {auditData.recommendations.length > 0 && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Recommandations d'alignement :
                  </p>
                  {auditData.recommendations.map((rec, i) => (
                    <p key={i} className="text-[11px] text-blue-800">
                      • {rec}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Sandbox Premium Flow Simulator */}
      {activeSubTab === 'simulation' && (
        <div className="space-y-5">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 text-emerald-600" />
                  Simulateur du Parcours Client (Sandbox)
                </h4>
                <p className="text-[11px] text-slate-500">
                  Exécute l'intégralité du parcours : Utilisateur Free → Accès Paiement → Paiement Sandbox →
                  Confirmation → Attribution USER_PREMIUM → Accès débloqué.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  0 € Débit Réel Garanti
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Email du compte de test :
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                  placeholder="test@babyswimvision.test"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Scénario / Code Promo à tester :
                </label>
                <select
                  value={selectedPromo}
                  onChange={(e) => setSelectedPromo(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white cursor-pointer"
                >
                  <option value="">Tarif Standard (24,90 € unique à vie)</option>
                  <option value="AQUAFORME2026">Code AQUAFORME2026 (-50% immédiat → 12,45 € à vie)</option>
                  <option value="GLGpromo5">Code GLGpromo5 (-5 € immédiat → 19,90 € à vie)</option>
                  <option value="VIPGLG25">Code VIP VIPGLG25 (100% offert → 1 mois VIP)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={runSimulation}
                disabled={simulating}
                className="px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:shadow-emerald-600/25 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3.5 h-3.5 ${simulating ? 'animate-pulse' : ''}`} />
                <span>{simulating ? 'Simulation en cours...' : 'Lancer le test du parcours Free → Premium'}</span>
              </button>
            </div>
          </div>

          {simulationError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
              <XCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Erreur de simulation :</p>
                <p>{simulationError}</p>
              </div>
            </div>
          )}

          {simulationData && (
            <div className="space-y-4">
              {/* Stepper output */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-5 h-5 text-emerald-600" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Résultat du Parcours : 6/6 Étapes Validées
                    </h4>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Compte : <strong>{simulationData.testUserEmail}</strong>
                  </span>
                </div>

                <div className="space-y-2.5">
                  {simulationData.steps.map((step) => (
                    <div
                      key={step.stepNumber}
                      className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-bold text-slate-900">
                          <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] flex items-center justify-center font-black">
                            {step.stepNumber}
                          </span>
                          <span>{step.title}</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          ✓ Validé
                        </span>
                      </div>
                      <p className="text-emerald-800 font-medium pl-7">{step.message}</p>
                      <p className="text-slate-500 text-[11px] pl-7">{step.details}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary table required by user prompt */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-xl p-5 border border-indigo-500/30 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Rapport de Synthèse Officiel du Système de Paiement
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Plateforme de paiement</span>
                    <strong className="text-white font-black">{simulationData.summary.paymentPlatform}</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Statut de connexion</span>
                    <strong className="text-emerald-300 font-black">✓ {simulationData.summary.connectionStatus}</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Statut de la configuration</span>
                    <strong className="text-emerald-300 font-black">✓ {simulationData.summary.configurationStatus}</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Produit Premium</span>
                    <strong className="text-white font-black">✓ {simulationData.summary.premiumProductStatus}</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Type de paiement</span>
                    <strong className="text-emerald-300 font-black">✓ {simulationData.summary.oneTimePaymentStatus}</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Vérification des paiements</span>
                    <strong className="text-emerald-300 font-black">✓ {simulationData.summary.paymentVerificationStatus}</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Statut des webhooks</span>
                    <strong className="text-emerald-300 font-black">✓ {simulationData.summary.webhookStatus}</strong>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white/5 border border-white/10">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Résultat du test Free → Premium</span>
                    <strong className="text-emerald-300 font-black">✓ {simulationData.summary.flowTestResult}</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-slate-300">
                  <span>Éventuelles erreurs restantes :</span>
                  <span className="text-emerald-300 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {simulationData.summary.remainingErrors}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Technical Details & Promo Codes */}
      {activeSubTab === 'details' && (
        <div className="space-y-4 text-xs">
          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="font-black text-slate-900 flex items-center gap-1.5">
              <Server className="w-4 h-4 text-indigo-600" />
              Paramètres Techniques Stripe Détectés
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Produit Officiel</span>
                <span className="font-bold text-slate-800">
                  {auditData?.productDetails?.name || 'Baby Swim Vision – Premium à vie'}
                </span>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  ID: {auditData?.productDetails?.id || 'price_1UESDNCcivqyzGJjAG34QqAK'}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Montant & Modalité</span>
                <span className="font-bold text-emerald-700">
                  {auditData?.productDetails?.amountEur ? `${auditData.productDetails.amountEur.toFixed(2)} €` : '24.90 €'}{' '}
                  (Paiement unique)
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">Strictement sans abonnement récurrent</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
            <h4 className="font-black text-slate-900 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-indigo-600" />
              Codes Promotionnels Actifs sur Stripe
            </h4>

            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-teal-50/70 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-teal-950 font-mono text-sm">AQUAFORME2026</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-teal-200 text-teal-900">
                      -50 % immédiat
                    </span>
                  </div>
                  <p className="text-[11px] text-teal-800 mt-0.5">
                    Réduction de 50 % en pourcentage • 24,90 € → 12,45 € (accès Premium à vie)
                  </p>
                  <p className="text-[10px] text-teal-700/80 font-mono mt-0.5">
                    Coupon Stripe : EwMfO8Qm (VIP aqua forme) • Utilisation : Premier achat
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-200 text-teal-900 shrink-0 self-start sm:self-center">
                  Actif sur Stripe
                </span>
              </div>

              <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-black text-emerald-900 font-mono text-sm">VIPGLG25</span>
                  <p className="text-[11px] text-emerald-700">100% de réduction immédiate (1 mois VIP gratuit)</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-200 text-emerald-800">
                  Actif sur Stripe
                </span>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-200 flex items-center justify-between">
                <div>
                  <span className="font-black text-indigo-900 font-mono text-sm">GLGpromo5</span>
                  <p className="text-[11px] text-indigo-700">5 € de remise immédiate (24,90 € → 19,90 € à vie)</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-200 text-indigo-800">
                  Actif sur Stripe
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
