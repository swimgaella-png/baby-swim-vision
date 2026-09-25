import React, { useState, useEffect } from 'react';
import {
  Crown,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Plus,
  RefreshCw,
  Gift,
  AlertTriangle,
  UserPlus,
  Mail,
} from 'lucide-react';
import { adminManagementService, AdminUserRecord } from '../../services/adminManagementService';
import { paymentService } from '../../services/paymentService';

interface AdminPremiumSubViewProps {
  onBack: () => void;
  showFeedback: (msg: string) => void;
}

export const AdminPremiumSubView: React.FC<AdminPremiumSubViewProps> = ({ onBack, showFeedback }) => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [manualEmail, setManualEmail] = useState<string>('');
  const [isGranting, setIsGranting] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    const data = await adminManagementService.fetchUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleGrantPremium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualEmail.trim()) return;

    setIsGranting(true);
    const success = await adminManagementService.updateUserRole(manualEmail.trim(), 'USER_PREMIUM', true);
    setIsGranting(false);

    if (success) {
      showFeedback(`Accès Premium à vie validé pour : ${manualEmail.trim()}`);
      setManualEmail('');
      loadData();
    } else {
      alert('Impossible d’accorder l’accès Premium. Vérifiez l’adresse email.');
    }
  };

  const handleRevokePremium = async (email: string) => {
    if (window.confirm(`Retirer définitivement les droits Premium pour ${email} ?`)) {
      const success = await adminManagementService.updateUserRole(email, 'USER_FREE', false);
      if (success) {
        showFeedback(`Droits Premium révoqués pour ${email}`);
        loadData();
      } else {
        alert('Erreur lors de la révocation');
      }
    }
  };

  const premiumUsers = users.filter((u) => u.role === 'USER_PREMIUM' || u.lifetimeAccess);
  const freeUsers = users.filter((u) => u.role === 'USER_FREE' && !u.lifetimeAccess);

  const filteredPremium = premiumUsers.filter((u) =>
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.name || '').toLowerCase().includes(search.toLowerCase())
  );

  const vipSpotsRemaining = paymentService.getVipRemainingSpots();
  const vipRedemptions = paymentService.getVipRedemptions();

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
            <span className="text-xs font-semibold text-slate-900">Accès Premium</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Crown className="w-5 h-5 text-amber-500" />
            Gestion des Droits d’Accès Premium
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Vérification de l’accès à vie serveur, attribution manuelle et suivi des offres VIP.
          </p>
        </div>

        <button
          onClick={loadData}
          disabled={loading}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Membres Premium</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{premiumUsers.length}</p>
          <span className="text-[11px] text-slate-400">Accès intégral débloqué</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Comptes Gratuits</p>
          <p className="text-2xl font-extrabold text-slate-700 mt-1">{freeUsers.length}</p>
          <span className="text-[11px] text-slate-400">Accès limité (1 analyse/mois)</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Modèle Économique</p>
          <p className="text-lg font-bold text-slate-900 mt-1">Paiement unique</p>
          <span className="text-[11px] text-emerald-600 font-medium">24,90 € à vie (aucun abonnement)</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Codes VIP Aquatiques</p>
          <p className="text-lg font-bold text-indigo-600 mt-1">
            {vipSpotsRemaining} places rest.
          </p>
          <span className="text-[11px] text-slate-400">{vipRedemptions.length} code(s) activé(s)</span>
        </div>
      </div>

      {/* Grant Access Form */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 p-5 rounded-2xl shadow-xs">
        <h3 className="text-sm font-bold text-amber-950 flex items-center gap-2">
          <UserPlus className="w-4 h-4 text-amber-600" />
          Attribuer manuellement un accès Premium à vie
        </h3>
        <p className="text-xs text-amber-800 mt-1">
          Renseignez l’adresse email d’un utilisateur ou d’un partenaire pour lui octroyer l’accès Premium illimité immédiat.
        </p>

        <form onSubmit={handleGrantPremium} className="mt-3 flex flex-col sm:flex-row gap-2 max-w-xl">
          <div className="relative flex-1">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              required
              placeholder="ex: parent@famille.fr"
              value={manualEmail}
              onChange={(e) => setManualEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-amber-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            disabled={isGranting}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            {isGranting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Crown className="w-3.5 h-3.5" />}
            Accorder l’accès à vie
          </button>
        </form>
      </div>

      {/* Search & List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filtrer les membres Premium..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500"
            />
          </div>
          <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
            {filteredPremium.length} membre(s)
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
            Chargement...
          </div>
        ) : filteredPremium.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Aucun membre Premium trouvé.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">
                <tr>
                  <th className="px-5 py-3">Utilisateur</th>
                  <th className="px-4 py-3">Type d'accès</th>
                  <th className="px-4 py-3">Paiement</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPremium.map((u) => (
                  <tr key={u.id || u.email} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-900 block">{u.name || u.email.split('@')[0]}</span>
                      <span className="text-slate-400 font-mono text-[11px]">{u.email}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                        <Crown className="w-3 h-3" /> Accès Permanent
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Validé serveur
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—'}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleRevokePremium(u.email)}
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-800 hover:underline"
                        >
                          Révoquer
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
