import React, { useState } from 'react';
import { Globe, Check, Search, Sparkles, AlertCircle, X, ArrowRight, MessageSquareHeart } from 'lucide-react';
import { SUPPORTED_LANGUAGES, LanguageDefinition } from '../i18n/languages';
import { useTranslation } from '../i18n/LanguageContext';

interface LanguageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  isFirstLaunch?: boolean;
}

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen,
  onClose,
  isFirstLaunch = false,
}) => {
  const {
    locale,
    setLocale,
    detectedLanguage,
    t,
  } = useTranslation();

  const [searchQuery, setSearchQuery] = useState('');
  const [otherLanguageModalOpen, setOtherLanguageModalOpen] = useState(false);
  const [requestedLanguageInput, setRequestedLanguageInput] = useState('');
  const [requestedSuccess, setRequestedSuccess] = useState(false);

  if (!isOpen) return null;

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(
    (lang) =>
      lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const readyLanguages = filteredLanguages.filter((l) => l.isReady);
  const upcomingLanguages = filteredLanguages.filter((l) => !l.isReady);

  const handleSelectLanguage = (lang: LanguageDefinition) => {
    setLocale(lang.code, true);
    onClose();
  };

  const handleContinueDetected = () => {
    setLocale(detectedLanguage.code, true);
    onClose();
  };

  const handleSendLanguageRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestedLanguageInput.trim()) return;
    setRequestedSuccess(true);
    setTimeout(() => {
      setOtherLanguageModalOpen(false);
      setRequestedSuccess(false);
      setRequestedLanguageInput('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="relative p-6 sm:p-8 bg-gradient-to-br from-sky-600 via-sky-700 to-teal-700 text-white flex-shrink-0">
          {!isFirstLaunch && (
            <button
              onClick={onClose}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner">
              🌍
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-200">
                Internationalisation • i18n
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t('languageSelector.title')}
              </h2>
            </div>
          </div>

          <p className="text-sm text-sky-100/90 max-w-xl mt-2 leading-relaxed">
            {t('languageSelector.subtitle')}
          </p>

          {/* Automatic Browser Detection Banner */}
          <div className="mt-5 p-4 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{detectedLanguage.flag}</span>
              <div>
                <span className="text-xs text-sky-200 font-medium block">
                  {t('languageSelector.detectedTitle')} :
                </span>
                <span className="text-base font-bold text-white">
                  {detectedLanguage.nativeName} ({detectedLanguage.englishName})
                </span>
              </div>
            </div>

            <button
              onClick={handleContinueDetected}
              className="px-4 py-2.5 bg-white hover:bg-sky-50 text-sky-800 font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>{t('languageSelector.continueInDetected', { language: detectedLanguage.nativeName })}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:px-8 border-b border-slate-100 bg-slate-50/70 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('languageSelector.searchPlaceholder')}
            className="w-full bg-transparent border-none text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 px-1"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Scrollable Language Grid */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* 1. Fully Available Languages */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {t('languageSelector.readyTitle')}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {readyLanguages.map((lang) => {
                const isSelected = locale === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20 shadow-sm'
                        : 'bg-white border-slate-200/80 hover:border-sky-300 hover:bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {lang.flag}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-800 truncate">
                          {lang.nativeName}
                        </div>
                        <div className="text-xs text-slate-500 truncate flex items-center gap-1.5">
                          <span>{lang.englishName}</span>
                          {lang.isRTL && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded-md">
                              RTL
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-sky-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border border-slate-200 group-hover:border-sky-300 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Upcoming Languages */}
          {upcomingLanguages.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {t('languageSelector.upcomingTitle')}
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400">
                  Fallback English certifié
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {upcomingLanguages.map((lang) => {
                  const isSelected = locale === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => handleSelectLanguage(lang)}
                      className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-3 transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20'
                          : 'bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/50 opacity-90'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-2xl flex-shrink-0">{lang.flag}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-700 truncate">
                            {lang.nativeName}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {lang.englishName}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                        {lang.code.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Suggest Another Language Option */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-teal-50 border border-sky-100/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center flex-shrink-0 text-lg">
                🌐
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-800">
                  {t('common.otherLanguage')}
                </h4>
                <p className="text-xs text-slate-600">
                  {t('common.otherLanguagePrompt')}
                </p>
              </div>
            </div>

            <button
              onClick={() => setOtherLanguageModalOpen(true)}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              {t('common.requestLanguage')}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:px-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <span>
              Toutes les traductions de sécurité et d'analyse IA sont adaptées à la langue sélectionnée.
            </span>
          </div>

          {!isFirstLaunch && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              {t('common.close')}
            </button>
          )}
        </div>
      </div>

      {/* Suggest Other Language Dialog */}
      {otherLanguageModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-800 text-base">
                  {t('common.requestLanguage')}
                </h3>
              </div>
              <button
                onClick={() => setOtherLanguageModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {requestedSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-sm font-medium text-center space-y-1">
                <Check className="w-6 h-6 mx-auto text-emerald-600 mb-1" />
                <p className="font-bold">Merci pour votre suggestion !</p>
                <p className="text-xs text-emerald-700">
                  Notre comité pédagogique l'ajoutera dans une prochaine mise à jour.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendLanguageRequest} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Indiquez le nom du pays ou de la langue souhaitée. Nous collaborons avec des maîtres-nageurs natifs pour garantir l'exactitude des consignes.
                </p>
                <input
                  type="text"
                  required
                  value={requestedLanguageInput}
                  onChange={(e) => setRequestedLanguageInput(e.target.value)}
                  placeholder="Ex: Bahasa Indonesia, Tiếng Việt, Català..."
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOtherLanguageModalOpen(false)}
                    className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Envoyer la suggestion
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
