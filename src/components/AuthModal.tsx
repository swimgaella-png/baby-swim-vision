import React, { useState } from 'react';
import { X, Mail, Lock, User as UserIcon, ArrowRight } from 'lucide-react';
import { authService } from '../services/authService';
import { UserRole } from '../types';
import { useTranslation } from '../i18n/LanguageContext';
import { OfficialLogo } from './OfficialLogo';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user?: any) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('parent');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);

    try {
      if (tab === 'signin') {
        const authed = await authService.signIn(email, password, role);
        onSuccess(authed);
        onClose();
      } else if (tab === 'signup') {
        if (!email) {
          setMessage({ type: 'error', text: 'Email requis' });
          return;
        }
        const authed = await authService.signUp(name || 'Parent Nageur', email, password, role);
        onSuccess(authed);
        onClose();
      } else if (tab === 'forgot') {
        if (!email) {
          setMessage({ type: 'error', text: 'Email requis' });
          return;
        }
        await authService.resetPassword(email);
        setMessage({
          type: 'success',
          text: 'Lien de réinitialisation envoyé.',
        });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Une erreur est survenue.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo & Title */}
        <div className="text-center space-y-1">
          <div className="flex justify-center pb-2">
            <OfficialLogo className="h-12 w-auto max-w-[220px] object-contain" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {tab === 'signin' && t('auth.loginTitle')}
            {tab === 'signup' && t('auth.signupTitle')}
            {tab === 'forgot' && t('auth.resetPasswordTitle')}
          </h2>
          <p className="text-xs text-slate-500">
            {tab === 'signin' && t('auth.loginSubtitle')}
            {tab === 'signup' && t('auth.signupSubtitle')}
            {tab === 'forgot' && t('auth.resetPasswordSubtitle')}
          </p>
        </div>

        {/* Tabs for switching between signin and signup */}
        {tab !== 'forgot' && (
          <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTab('signin')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                tab === 'signin' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              {t('auth.loginBtn')}
            </button>
            <button
              onClick={() => setTab('signup')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer ${
                tab === 'signup' ? 'bg-white text-sky-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              {t('auth.signupBtn')}
            </button>
          </div>
        )}

        {message && (
          <div
            className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">{t('babyProfile.nameLabel')}</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Sarah"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-sky-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 block">{t('auth.emailLabel')}</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                placeholder="parent@baby-swim.io"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-sky-500 focus:bg-white"
              />
            </div>
          </div>

          {tab !== 'forgot' && (
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-slate-700">{t('auth.passwordLabel')}</label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => setTab('forgot')}
                    className="text-[11px] text-sky-600 hover:underline cursor-pointer"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-sky-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {tab === 'signup' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">{t('auth.roleLabel')}</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('parent')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    role === 'parent'
                      ? 'bg-sky-50 text-sky-800 border-sky-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  👶 {t('auth.roleParent')}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('professional')}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    role === 'professional'
                      ? 'bg-purple-50 text-purple-800 border-purple-300'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  🏊 {t('auth.rolePro')}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>
              {loading ? 'Connexion en cours...' : (
                tab === 'signin' ? t('auth.loginBtn') :
                tab === 'signup' ? t('auth.signupBtn') :
                t('auth.sendResetLink')
              )}
            </span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {tab === 'forgot' && (
          <div className="text-center">
            <button
              onClick={() => setTab('signin')}
              className="text-xs text-sky-600 font-semibold hover:underline cursor-pointer"
            >
              ← {t('auth.backToLogin')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
