import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { useTranslation } from '../i18n/LanguageContext';

interface SafetyBannerProps {
  compact?: boolean;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ compact = false }) => {
  const { t } = useTranslation();

  if (compact) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-2 rounded-xl text-xs flex items-center gap-2">
        <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>{t('safety.compactTitle')}</strong> {t('safety.compactText')}
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-4 text-amber-950 shadow-xs">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-amber-100/80 text-amber-700 rounded-xl shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-sm text-amber-900 flex items-center gap-2">
            {t('safety.title')}
          </h4>
          <p className="text-xs text-amber-800/90 leading-relaxed">
            {t('safety.fullText')}
          </p>
        </div>
      </div>
    </div>
  );
};
