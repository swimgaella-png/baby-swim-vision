import React, { useState, useEffect } from 'react';
import {
  Bell,
  Send,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Users,
  AlertTriangle,
  Info,
  RefreshCw,
  Sparkles,
  X,
} from 'lucide-react';
import { adminManagementService, AdminNotificationRecord } from '../../services/adminManagementService';

interface AdminNotificationsSubViewProps {
  onBack: () => void;
  showFeedback: (msg: string) => void;
}

export const AdminNotificationsSubView: React.FC<AdminNotificationsSubViewProps> = ({ onBack, showFeedback }) => {
  const [notifications, setNotifications] = useState<AdminNotificationRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingNotif, setEditingNotif] = useState<AdminNotificationRecord | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formType, setFormType] = useState<'info' | 'advice' | 'alert' | 'update'>('info');
  const [formTarget, setFormTarget] = useState<'all' | 'free' | 'premium'>('all');
  const [isSending, setIsSending] = useState(false);

  const loadNotifications = async () => {
    setLoading(true);
    const data = await adminManagementService.fetchNotifications();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const openCreateModal = () => {
    setEditingNotif(null);
    setFormTitle('');
    setFormMessage('');
    setFormType('info');
    setFormTarget('all');
    setIsModalOpen(true);
  };

  const openEditModal = (notif: AdminNotificationRecord) => {
    setEditingNotif(notif);
    setFormTitle(notif.title);
    setFormMessage(notif.message);
    setFormType(notif.type);
    setFormTarget(notif.targetAudience);
    setIsModalOpen(true);
  };

  const handleSave = async (sendNow: boolean) => {
    if (!formTitle.trim() || !formMessage.trim()) {
      alert('Veuillez renseigner un titre et un message.');
      return;
    }

    setIsSending(true);
    if (editingNotif) {
      const ok = await adminManagementService.updateNotification(editingNotif.id, {
        title: formTitle.trim(),
        message: formMessage.trim(),
        type: formType,
        targetAudience: formTarget,
        status: sendNow ? 'sent' : editingNotif.status,
        sentAt: sendNow ? new Date().toISOString() : editingNotif.sentAt,
      });
      if (ok) {
        showFeedback(sendNow ? 'Notification mise à jour et envoyée !' : 'Notification mise à jour');
        setIsModalOpen(false);
        loadNotifications();
      } else {
        alert('Erreur lors de la mise à jour');
      }
    } else {
      const created = await adminManagementService.createNotification({
        title: formTitle.trim(),
        message: formMessage.trim(),
        type: formType,
        targetAudience: formTarget,
        sendNow,
      });
      if (created) {
        showFeedback(sendNow ? 'Notification diffusée aux utilisateurs !' : 'Brouillon enregistré');
        setIsModalOpen(false);
        loadNotifications();
      } else {
        alert('Erreur lors de la création');
      }
    }
    setIsSending(false);
  };

  const handleSendNow = async (notif: AdminNotificationRecord) => {
    if (window.confirm(`Diffuser immédiatement la notification "${notif.title}" à tous les utilisateurs ?`)) {
      const ok = await adminManagementService.sendNotification(notif.id);
      if (ok) {
        showFeedback('Notification diffusée avec succès');
        loadNotifications();
      } else {
        alert('Erreur lors de l’envoi');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Supprimer définitivement cette notification ?')) {
      const ok = await adminManagementService.deleteNotification(id);
      if (ok) {
        showFeedback('Notification supprimée');
        loadNotifications();
      } else {
        alert('Erreur lors de la suppression');
      }
    }
  };

  const sentCount = notifications.filter((n) => n.status === 'sent').length;
  const draftCount = notifications.filter((n) => n.status === 'draft').length;

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
            <span className="text-xs font-semibold text-slate-900">Notifications</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            Notifications & Communications Parents
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Créer et diffuser des notifications, alertes ou conseils aux utilisateurs de l’application.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadNotifications}
            disabled={loading}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Nouvelle notification
          </button>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-slate-500">Total notifications</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{notifications.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-emerald-600">Notifications diffusées</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">{sentCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <p className="text-xs font-medium text-amber-600">Brouillons en attente</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-1">{draftCount}</p>
        </div>
      </div>

      {/* Notifications list */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs divide-y divide-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-indigo-500" />
            Chargement des notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Aucune notification pour le moment. Cliquez sur « Nouvelle notification » pour en rédiger une.
          </div>
        ) : (
          notifications.map((n) => {
            const isSent = n.status === 'sent';
            return (
              <div key={n.id} className="p-5 hover:bg-slate-50/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        n.type === 'alert'
                          ? 'bg-rose-100 text-rose-800'
                          : n.type === 'advice'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {n.type === 'alert' ? 'Alerte' : n.type === 'advice' ? 'Conseil' : 'Information'}
                    </span>

                    {isSent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3 h-3" /> Diffusée
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600">
                        <Clock className="w-3 h-3" /> Brouillon
                      </span>
                    )}

                    <span className="text-slate-300">•</span>
                    <span className="text-[11px] text-slate-400">
                      Cible : {n.targetAudience === 'premium' ? 'Membres Premium' : n.targetAudience === 'free' ? 'Comptes Gratuits' : 'Tous'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-sm">{n.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">{n.message}</p>

                  <div className="text-[11px] text-slate-400 pt-1">
                    {n.sentAt
                      ? `Envoyée le ${new Date(n.sentAt).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}`
                      : `Créée le ${new Date(n.createdAt).toLocaleDateString('fr-FR')}`}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {!isSent && (
                    <button
                      onClick={() => handleSendNow(n)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Send className="w-3 h-3" />
                      Diffuser
                    </button>
                  )}
                  <button
                    onClick={() => openEditModal(n)}
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
                    title="Modifier"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(n.id)}
                    className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal create / edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">
                {editingNotif ? 'Modifier la notification' : 'Nouvelle notification'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Titre</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Rappel : immersion en douceur"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Rédigez votre message pour les parents..."
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Type de message</label>
                  <select
                    value={formType}
                    onChange={(e: any) => setFormType(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="info">Information</option>
                    <option value="advice">Conseil pédiatrique</option>
                    <option value="alert">Alerte sécurité</option>
                    <option value="update">Mise à jour</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Destinataires</label>
                  <select
                    value={formTarget}
                    onChange={(e: any) => setFormTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="all">Tous les utilisateurs</option>
                    <option value="free">Comptes gratuits</option>
                    <option value="premium">Membres Premium</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={isSending}
                onClick={() => handleSave(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300"
              >
                Enregistrer brouillon
              </button>
              <button
                type="button"
                disabled={isSending}
                onClick={() => handleSave(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                Envoyer maintenant
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
