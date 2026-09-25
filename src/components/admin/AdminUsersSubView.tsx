import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  Crown,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Edit2,
  Key,
  X,
} from 'lucide-react';
import { adminManagementService, AdminUserRecord } from '../../services/adminManagementService';

interface AdminUsersSubViewProps {
  onBack: () => void;
  showFeedback: (msg: string) => void;
}

export const AdminUsersSubView: React.FC<AdminUsersSubViewProps> = ({ onBack, showFeedback }) => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'USER_FREE' | 'USER_PREMIUM' | 'ADMIN'>('ALL');
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const loadUsers = async () => {
    setLoading(true);
    const data = await adminManagementService.fetchUsers();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleTogglePremium = async (user: AdminUserRecord) => {
    const isCurrentlyPremium = user.role === 'USER_PREMIUM' || Boolean(user.lifetimeAccess);
    const newRole = isCurrentlyPremium ? 'USER_FREE' : 'USER_PREMIUM';
    const newLifetime = !isCurrentlyPremium;

    setIsUpdating(true);
    const success = await adminManagementService.updateUserRole(user.email, newRole, newLifetime);
    setIsUpdating(false);

    if (success) {
      showFeedback(
        newLifetime
          ? `Accès Premium à vie accordé à ${user.email}`
          : `Accès Premium retiré pour ${user.email}`
      );
      loadUsers();
      if (selectedUser?.email === user.email) {
        setSelectedUser((prev) => (prev ? { ...prev, role: newRole, lifetimeAccess: newLifetime } : null));
      }
    } else {
      alert('Erreur lors de la mise à jour des droits');
    }
  };

  const handleToggleStatus = async (user: AdminUserRecord) => {
    const newStatus = user.status === 'suspended' ? 'active' : 'suspended';
    setIsUpdating(true);
    const success = await adminManagementService.updateUserStatus(user.email, { status: newStatus });
    setIsUpdating(false);

    if (success) {
      showFeedback(newStatus === 'active' ? `Compte réactivé : ${user.email}` : `Compte suspendu : ${user.email}`);
      loadUsers();
      if (selectedUser?.email === user.email) {
        setSelectedUser((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } else {
      alert('Erreur lors de la modification du statut');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (u.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const countTotal = users.length;
  const countPremium = users.filter((u) => u.role === 'USER_PREMIUM' || u.lifetimeAccess).length;
  const countFree = users.filter((u) => u.role === 'USER_FREE' && !u.lifetimeAccess).length;

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
            <span className="text-xs font-semibold text-slate-900">Comptes utilisateurs</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Users className="w-5 h-5 text-sky-600" />
            Comptes utilisateurs ({countTotal})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Gérer les profils enregistrés, leurs droits d’accès et leur statut.
          </p>
        </div>

        <button
          onClick={loadUsers}
          disabled={loading}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Quick stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Total utilisateurs</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{countTotal}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-amber-600">Accès Premium</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{countPremium}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Utilisateurs gratuits</p>
          <p className="text-2xl font-extrabold text-slate-700 mt-1">{countFree}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par email ou nom..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'USER_PREMIUM', 'USER_FREE', 'ADMIN'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                roleFilter === r
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'ALL'
                ? 'Tous'
                : r === 'USER_PREMIUM'
                ? 'Premium'
                : r === 'USER_FREE'
                ? 'Gratuits'
                : 'Admins'}
            </button>
          ))}
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-sky-500" />
            Chargement des comptes utilisateurs...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Aucun utilisateur ne correspond à votre recherche.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-100 font-semibold text-slate-700">
                <tr>
                  <th className="px-5 py-3">Utilisateur</th>
                  <th className="px-4 py-3">Rôle & Accès</th>
                  <th className="px-4 py-3">Statut</th>
                  <th className="px-4 py-3">Inscription</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const isPremium = u.role === 'USER_PREMIUM' || Boolean(u.lifetimeAccess);
                  const isAdmin = u.role === 'ADMIN';
                  const isSuspended = u.status === 'suspended';

                  return (
                    <tr key={u.id || u.email} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          {u.name || u.email.split('@')[0]}
                          {isAdmin && (
                            <span className="px-1.5 py-0.5 rounded-sm text-[10px] font-bold bg-indigo-100 text-indigo-800">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-slate-400 text-[11px] font-mono mt-0.5">{u.email}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        {isAdmin ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                            <Shield className="w-3 h-3" /> Administrateur
                          </span>
                        ) : isPremium ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-bold text-[10px] bg-amber-50 text-amber-700 border border-amber-200">
                            <Crown className="w-3 h-3" /> Premium à vie
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-semibold text-[10px] bg-slate-100 text-slate-600">
                            Gratuit
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        {isSuspended ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600">
                            <AlertCircle className="w-3 h-3" /> Suspendu
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
                            <CheckCircle className="w-3 h-3" /> Actif
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3.5 text-slate-500 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '—'}
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1.5">
                        {!isAdmin && (
                          <>
                            <button
                              onClick={() => handleTogglePremium(u)}
                              disabled={isUpdating}
                              title={isPremium ? 'Retirer Premium' : 'Accorder Premium à vie'}
                              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                isPremium
                                  ? 'border-amber-200 text-amber-700 hover:bg-amber-50'
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                              }`}
                            >
                              <Crown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleStatus(u)}
                              disabled={isUpdating}
                              title={isSuspended ? 'Réactiver le compte' : 'Suspendre le compte'}
                              className={`p-1.5 rounded-lg border text-xs transition-colors ${
                                isSuspended
                                  ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                  : 'border-rose-200 text-rose-700 hover:bg-rose-50'
                              }`}
                            >
                              {isSuspended ? (
                                <UserCheck className="w-3.5 h-3.5" />
                              ) : (
                                <UserX className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                        >
                          Détails
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Fiche Utilisateur</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block font-medium">Nom</span>
                <span className="text-slate-800 font-semibold">{selectedUser.name || 'Non renseigné'}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Email</span>
                <span className="text-slate-800 font-mono">{selectedUser.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Rôle</span>
                <span className="font-semibold capitalize text-slate-800">{selectedUser.role}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Statut d'accès</span>
                <span className="font-semibold text-slate-800">
                  {selectedUser.lifetimeAccess
                    ? 'Premium à vie (Paiement validé)'
                    : selectedUser.subscriptionStatus === 'active'
                    ? 'Actif'
                    : 'Gratuit'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Date d'inscription</span>
                <span className="text-slate-600">
                  {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString('fr-FR') : '—'}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
