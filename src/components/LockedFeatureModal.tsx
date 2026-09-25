import React from 'react';
import { Lock, Sparkles, CheckCircle2, X, Shield, ArrowRight, Star } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface LockedFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenCheckout?: () => void;
  onUnlock?: () => void;
  title?: string;
  message?: string;
  ctaText?: string;
}

export const LockedFeatureModal: React.FC<LockedFeatureModalProps> = ({
  isOpen,
  onClose,
  onOpenCheckout,
  onUnlock,
  title,
  message,
  ctaText,
}) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  const defaultTitle = t('locked.defaultTitle');
  const defaultMessage = t('locked.defaultMessage');
  const defaultCta = t('locked.defaultCta');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label={t('common.close')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Lock Icon Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-16 h-16 bg-gradient-to-tr from-amber-500 to-amber-400 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-amber-500/25 ring-4 ring-amber-100">
            <Lock className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-extrabold uppercase tracking-wider">
            {t('locked.badgeProtected')}
          </span>

          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
            {title || defaultTitle}
          </h3>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            {message || defaultMessage}
          </p>
        </div>

        {/* What's included in full subscription */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs sm:text-sm text-slate-700">
          <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            {t('locked.includedTitle')}
          </div>
          <ul className="space-y-1.5">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('commercial.feature4')}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('commercial.feature1')}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('commercial.feature2')}</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{t('commercial.feature3')}</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-1">
          <button
            onClick={() => {
              onClose();
              if (onUnlock) {
                onUnlock();
              } else if (onOpenCheckout) {
                onOpenCheckout();
              }
            }}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-extrabold rounded-2xl shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer text-sm sm:text-base"
          >
            <span>{ctaText || defaultCta}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-800 font-semibold transition-colors cursor-pointer"
          >
            {t('common.continue')}
          </button>
        </div>

        {/* Trust badge */}
        <div className="flex items-center justify-center gap-3 text-xs text-slate-600 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            {t('commercial.secureCheckout')}
          </div>
          <span>•</span>
          <div className="flex items-center gap-1 font-semibold text-slate-700">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            {t('commercial.noSubscription')}
          </div>
        </div>
      </div>
    </div>
  );
};
