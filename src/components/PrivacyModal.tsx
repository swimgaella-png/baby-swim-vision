import React from 'react';
import { X, Shield, Lock, Trash2, EyeOff } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface PrivacyModalProps {
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ onClose }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-2 pr-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            {t('privacy.badge')}
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {t('privacy.title')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('privacy.subtitle')}
          </p>
        </div>

        <div className="space-y-3.5 text-xs text-slate-700">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              <EyeOff className="w-4 h-4 text-sky-600" />
              1. {t('privacy.point1Title')}
            </h3>
            <p className="leading-relaxed">
              {t('privacy.point1Desc')}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              <Lock className="w-4 h-4 text-emerald-600" />
              2. {t('privacy.point2Title')}
            </h3>
            <p className="leading-relaxed">
              {t('privacy.point2Desc')}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider">
              <Trash2 className="w-4 h-4 text-rose-600" />
              3. {t('privacy.point3Title')}
            </h3>
            <p className="leading-relaxed">
              {t('privacy.point3Desc')}
            </p>
          </div>

          <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 space-y-1 text-sky-950">
            <h4 className="font-bold text-xs uppercase tracking-wider text-sky-900">
              {t('privacy.point4Title')}
            </h4>
            <p className="leading-relaxed">
              {t('privacy.point4Desc')}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-2xl transition-colors cursor-pointer"
        >
          {t('privacy.understandBtn')}
        </button>
      </div>
    </div>
  );
};
