import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Mail,
  Smartphone,
  Facebook,
  Sparkles,
  ThumbsUp,
  Target,
  Waves,
  EyeOff,
  User,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { AnalysisResult, BabyProfile, SessionRecord } from '../types';

interface ShareAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: AnalysisResult;
  activeBaby?: BabyProfile | null;
  sessionDate?: string;
}

export const ShareAnalysisModal: React.FC<ShareAnalysisModalProps> = ({
  isOpen,
  onClose,
  analysis,
  activeBaby,
  sessionDate,
}) => {
  const [copied, setCopied] = useState(false);
  const [hideBabyName, setHideBabyName] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  if (!isOpen) return null;

  const dateStr = sessionDate
    ? new Date(sessionDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const rawBabyName = activeBaby?.name?.trim() || 'Bébé';
  const displayedName = hideBabyName ? 'Mon bébé' : rawBabyName;

  const positivePoint = analysis.positive_points?.[0] || 'Très bonne aisance dans l\'eau et portage rassurant.';
  const priorityPoint = analysis.priority || 'Poursuivre la familiarisation et la détente corporelle.';
  const exoTitle = analysis.recommended_exercise?.title || 'Exploration aquatique en douceur';
  const postureInfo = analysis.posture?.orientation === 'horizontale' || analysis.biomechanics?.orientation === 'horizontale'
    ? 'Position Horizontale'
    : 'Position Verticale / Semi-verticale';
  const movementLabel = analysis.movementAnalysis?.classificationLabel || analysis.situation;
  const sequenceSummary = analysis.movementAnalysis?.structuredSequence || analysis.movementAnalysis?.sequenceSummary || '';

  // Construct sharing text
  const shareTitle = `Séance aquatique de ${displayedName} avec Baby Swim Vision 💦`;
  const shareText = `🌊 Bilan de séance aquatique (${dateStr}) pour ${displayedName} :
✨ Observation du mouvement : ${movementLabel}${sequenceSummary ? `\n🔄 Séquence : ${sequenceSummary}` : ''}
👍 Point fort : ${positivePoint}
🎯 Priorité travaillée : ${priorityPoint}
🏊 Exercice conseillé : ${exoTitle}
🧭 Posture : ${postureInfo}

Analysez vos séances et découvrez les conseils d'experts sur Baby Swim Vision !`;

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://babyswimvision.app';
  const fullSharePayload = `${shareText}\n\n👉 ${appUrl}`;

  // Native Web Share API
  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: appUrl,
        });
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 3000);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyText();
        }
      }
    } else {
      handleCopyText();
    }
  };

  // Copy to clipboard
  const handleCopyText = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullSharePayload);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      // Fallback
    }
  };

  // WhatsApp share
  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(fullSharePayload);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  // Email share
  const handleEmail = () => {
    const subject = encodeURIComponent(`Bilan séance aquatique - ${displayedName} (${dateStr})`);
    const body = encodeURIComponent(fullSharePayload);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // SMS share
  const handleSMS = () => {
    const body = encodeURIComponent(fullSharePayload);
    window.location.href = `sms:?&body=${body}`;
  };

  // Facebook Share
  const handleFacebook = () => {
    const url = encodeURIComponent(appUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${encodeURIComponent(shareText)}`, '_blank', 'noopener,noreferrer');
  };

  const hasNativeShare = typeof navigator !== 'undefined' && !!navigator.share;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative my-auto">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900 px-5 sm:px-6 py-4 sm:py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-300 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-500/20 text-sky-200 border border-sky-400/30 px-2 py-0.5 rounded-full">
                Partage & Transmission
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Partager le résultat de l'analyse
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-7 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Privacy Toggle */}
          <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                {hideBabyName ? <EyeOff className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Anonymiser le prénom pour les réseaux
                </span>
                <span className="text-[11px] text-slate-500">
                  {hideBabyName ? 'Remplacé par « Mon bébé »' : `Affiché : « ${rawBabyName} »`}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setHideBabyName(!hideBabyName)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                hideBabyName
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {hideBabyName ? 'Activé' : 'Masquer'}
            </button>
          </div>

          {/* Share Preview Card */}
          <div className="relative rounded-2xl bg-gradient-to-br from-sky-50 via-indigo-50/50 to-teal-50/40 p-4 sm:p-5 border border-sky-200/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-sky-200/60 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-sky-900 tracking-tight">
                  Baby Swim Vision
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-sky-600 text-white rounded-full">
                  Bilan Séance
                </span>
              </div>
              <span className="text-[11px] font-semibold text-slate-500">
                {dateStr}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="truncate">{displayedName} • {movementLabel}</span>
              </div>

              {sequenceSummary && (
                <div className="px-2.5 py-1.5 bg-sky-100/70 border border-sky-200/80 rounded-xl text-[10px] font-semibold text-sky-900 font-mono tracking-tight line-clamp-1">
                  🔄 {sequenceSummary}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="bg-white/90 p-2.5 rounded-xl border border-sky-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Point fort</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug line-clamp-2">
                    {positivePoint}
                  </p>
                </div>

                <div className="bg-white/90 p-2.5 rounded-xl border border-sky-100 space-y-1">
                  <div className="flex items-center gap-1.5 text-indigo-700 font-bold text-[11px]">
                    <Target className="w-3.5 h-3.5" />
                    <span>Priorité & Exercice</span>
                  </div>
                  <p className="text-[11px] text-slate-700 leading-snug line-clamp-2">
                    {exoTitle}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
              <span>Conseils pédagogiques personnalisés pour bébés nageurs</span>
              <span className="font-semibold text-sky-700">babyswimvision.app</span>
            </div>
          </div>

          {/* Main Action: Native Share Button (if supported) */}
          {hasNativeShare && (
            <button
              onClick={handleNativeShare}
              className="w-full py-3.5 bg-gradient-to-r from-sky-600 via-indigo-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2.5 transition-all hover:scale-101 cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Ouvrir les options de partage (Contacts & Apps)</span>
            </button>
          )}

          {/* Quick Direct Social & Messaging Buttons */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Partager directement avec :
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all hover:scale-102 cursor-pointer shadow-xs"
              >
                <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span>WhatsApp</span>
              </button>

              {/* SMS / Messages */}
              <button
                onClick={handleSMS}
                className="p-3 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all hover:scale-102 cursor-pointer shadow-xs"
              >
                <div className="w-7 h-7 rounded-xl bg-sky-600 text-white flex items-center justify-center">
                  <Smartphone className="w-4 h-4" />
                </div>
                <span>SMS</span>
              </button>

              {/* Email */}
              <button
                onClick={handleEmail}
                className="p-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all hover:scale-102 cursor-pointer shadow-xs"
              >
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Mail className="w-4 h-4" />
                </div>
                <span>E-mail</span>
              </button>

              {/* Facebook */}
              <button
                onClick={handleFacebook}
                className="p-3 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-xs font-bold transition-all hover:scale-102 cursor-pointer shadow-xs"
              >
                <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <Facebook className="w-4 h-4" />
                </div>
                <span>Facebook</span>
              </button>
            </div>
          </div>

          {/* Copy Formatted Text to Clipboard */}
          <div className="pt-1">
            <button
              onClick={handleCopyText}
              className={`w-full py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Bilan copié dans le presse-papier ! Prêt à coller.</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-500" />
                  <span>Copier le texte récapitulatif pour message ou réseau social</span>
                </>
              )}
            </button>
          </div>

          {shareSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Partage effectué avec succès !</span>
            </div>
          )}

          {/* Privacy & Safety Note */}
          <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              Les vidéos originales restent 100% privées. Seul le bilan pédagogique texte est transmis.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3 border-t border-slate-100 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
};
