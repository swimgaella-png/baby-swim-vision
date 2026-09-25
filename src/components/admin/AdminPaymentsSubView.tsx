import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ArrowDownRight,
  TrendingUp,
  ShieldAlert,
  Receipt,
  Download,
} from 'lucide-react';
import { adminManagementService, AdminPaymentRecord } from '../../services/adminManagementService';

interface AdminPaymentsSubViewProps {
  onBack: () => void;
  showFeedback: (msg: string) => void;
}

export const AdminPaymentsSubView: React.FC<AdminPaymentsSubViewProps> = ({ onBack, showFeedback }) => {
  const [payments, setPayments] = useState<AdminPaymentRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'completed' | 'failed' | 'pending'>('ALL');

  const loadPayments = async () => {
    setLoading(true);
    const data = await adminManagementService.fetchPayments();
    setPayments(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      (p.userEmail || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.receiptNumber || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.orderId || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + (p.amountPaid || 0), 0);

  const totalSuccessful = payments.filter((p) => p.status === 'completed').length;
  const totalFailed = payments.filter((p) => p.status === 'failed').length;

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
            <span className="text-xs font-semibold text-slate-900">Paiements</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            Suivi des Paiements & Transactions
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Historique des achats Baby Swim Vision (paiement unique 24,90 € accès à vie).
          </p>
        </div>

        <button
          onClick={loadPayments}
          disabled={loading}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Chiffre d’affaires total</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {totalRevenue.toFixed(2).replace('.', ',')} €
          </p>
          <span className="text-[11px] text-slate-400">Paiements uniques validés</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Paiements réussis</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalSuccessful}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Accès Premium accordé</span>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Paiements échoués</p>
          <p className="text-2xl font-extrabold text-rose-600 mt-1">{totalFailed}</p>
          <span className="text-[11px] text-slate-400">Refus de banque / annulations</span>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher email, reçu, ID commande..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['ALL', 'completed', 'failed', 'pending'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                statusFilter === st
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL'
                ? 'Tous'
                : st === 'completed'
                ? 'Réussis'
                : st === 'failed'
                ? 'Échoués'
                : 'En attente'}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-500" />
            Chargement des transactions...
          </div>
        ) : filteredPayments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Aucun paiement enregistré pour cette sélection.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">
                <tr>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-4 py-3">Utilisateur</th>
                  <th className="px-4 py-3">Produit</th>
                  <th className="px-4 py-3">Montant</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3 text-right">Réf / Reçu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPayments.map((p) => {
                  const isSuccess = p.status === 'completed';
                  return (
                    <tr key={p.orderId} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">
                        {p.verifiedAt ? new Date(p.verifiedAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        }) : '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold text-slate-900 block">{p.userEmail}</span>
                        {p.promoCode && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-sm bg-sky-50 text-sky-700 border border-sky-100">
                            Code : {p.promoCode}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700">
                        {p.product?.name || 'Baby Swim Vision – Premium à vie'}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {(p.amountPaid || 0).toFixed(2).replace('.', ',')} {p.currency || '€'}
                      </td>
                      <td className="px-4 py-3.5">
                        {isSuccess ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" /> Payé
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] bg-rose-50 text-rose-700 border border-rose-200">
                            <XCircle className="w-3 h-3" /> Échoué
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-right font-mono text-[11px] text-slate-400">
                        {p.receiptNumber || p.orderId.substring(0, 14) + '...'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
