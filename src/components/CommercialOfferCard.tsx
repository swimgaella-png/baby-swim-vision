import React from 'react';
import {
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Infinity,
  Zap,
  Lock,
  Heart,
  Video,
  BookOpen,
  Award,
  Gift,
  Calendar,
  Users
} from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';
import { paymentService } from '../services/paymentService';
import { authService } from '../services/authService';

interface CommercialOfferCardProps {
  onSelectBuy: () => void;
  compact?: boolean;
  hasLifetimeAccess?: boolean;
}

export const CommercialOfferCard: React.FC<CommercialOfferCardProps> = ({
  onSelectBuy,
  compact = false,
  hasLifetimeAccess = false,
}) => {
  const { t } = useTranslation();
  const currentUser = authService.getCurrentUser();
  const remainingVipSpots = paymentService.getVipRemainingSpots();

  // Check if current user is an active VIP trial subscriber
  const isVipActive = currentUser?.promoPlan === 'vip_1month_free' && currentUser?.subscriptionExpiresAt && new Date(currentUser.subscriptionExpiresAt).getTime() > Date.now();

  if (hasLifetimeAccess) {
    return (
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/30 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-300/30 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t('commercial.lifetimeBadge')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {t('commercial.lifetimeTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              {t('commercial.lifetimeDesc')}
            </p>
          </div>
          <div className="shrink-0">
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center">
              <span className="text-xs font-bold text-emerald-300 block mb-0.5">{t('commercial.accountStatus')}</span>
              <div className="flex items-center justify-center gap-1.5 text-base sm:text-lg font-black text-white">
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                <span>{t('commercial.lifetimeStatusActive', { defaultValue: 'Accès permanent actif' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isVipActive && currentUser?.subscriptionExpiresAt) {
    const expiresDate = new Date(currentUser.subscriptionExpiresAt);
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const formattedExpires = expiresDate.toLocaleDateString(undefined, options);
    const msRemaining = expiresDate.getTime() - Date.now();
    const daysRemaining = Math.max(1, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));

    return (
      <div className="bg-gradient-to-br from-indigo-950 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-emerald-500/40 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-300/30 text-xs font-bold">
              <Gift className="w-3.5 h-3.5" />
              <span>{t('commercial.vipActiveBadge')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              {t('commercial.vipActiveTitle')}
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              {t('commercial.vipActiveDesc', { date: formattedExpires, days: daysRemaining.toString() })}
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-3">
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-center">
              <span className="text-xs font-bold text-emerald-300 block">{t('commercial.vipFreeEnd')}</span>
              <span className="text-base font-black text-white">{formattedExpires}</span>
            </div>
            <button
              onClick={onSelectBuy}
              className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-black rounded-2xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Infinity className="w-4 h-4" />
              <span>{t('commercial.upgradeToLifetime')}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-white via-sky-50/40 to-indigo-50/50 border-2 border-sky-200 shadow-2xl p-6 sm:p-10">
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Ribbon / Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs font-black uppercase tracking-wider shadow-sm">
          <Infinity className="w-4 h-4" />
          <span>{t('commercial.oneTimePayment')}</span>
        </div>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t('commercial.noSubscription')}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left column: Offer presentation */}
        <div className="lg:col-span-7 space-y-4 text-left">
          <div className="space-y-1">
            <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              {t('commercial.cardTitle')}
            </h3>
            <p className="text-base sm:text-lg font-bold text-sky-700">
              {t('commercial.cardSubtitle')}
            </p>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t('landing.heroSubtitle')}
          </p>

          {/* Checklist of commitments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('commercial.feature1')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('commercial.feature2')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('commercial.feature3')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('commercial.feature4')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('commercial.feature5')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('commercial.feature6')}</span>
            </div>
          </div>
        </div>

        {/* Right column: Big Price Callout & CTA Button */}
        <div className="lg:col-span-5 bg-white/90 backdrop-blur-md rounded-2xl p-6 border border-sky-100 shadow-lg text-center space-y-4">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 block">
              {t('commercial.oneTimePayment')}
            </span>
            <div className="flex items-baseline justify-center gap-1.5">
              <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                24,90 €
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-extrabold mt-1">
              <span>{t('commercial.noSubscription')}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            {t('commercial.cardSubtitle')}
          </p>

          <button
            onClick={onSelectBuy}
            className="w-full py-4 px-6 bg-gradient-to-r from-sky-600 via-teal-600 to-indigo-600 hover:from-sky-700 hover:via-teal-700 hover:to-indigo-700 text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-sky-600/30 flex items-center justify-center gap-2 transition-all hover:scale-102 cursor-pointer uppercase tracking-wider"
          >
            <span>{t('commercial.unlockLifetimeBtn', { price: '24,90 €' })}</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium pt-1">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t('commercial.secureCheckout')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
