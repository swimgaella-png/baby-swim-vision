import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  CheckCircle2,
  Sparkles,
  CreditCard,
  X,
  Clock,
  Infinity,
  HelpCircle,
  FileText,
  Download,
  AlertCircle,
  Gift,
  Users,
  Calendar,
  Check,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { paymentService, PaymentVerificationResult, PromoCodeDetails, calculateOneMonthEndDate } from '../services/paymentService';
import { User } from '../types';
import { useTranslation } from '../i18n/LanguageContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  initialEmail?: string;
  initialPromoCode?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialEmail = '',
  initialPromoCode = '',
}) => {
  const { t } = useTranslation();

  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'apple_pay' | 'google_pay' | 'paypal' | 'promo_vip'>('card');
  
  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState<string>(initialPromoCode || '');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(initialPromoCode ? initialPromoCode.trim().toUpperCase() : null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoSuccessMessage, setPromoSuccessMessage] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState<boolean>(false);

  // Form fields
  const [email, setEmail] = useState<string>(initialEmail || '');
  const [fullName, setFullName] = useState<string>('');
  const [acceptedTerms, setAcceptedTerms] = useState<boolean>(true);

  // States
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationResult, setVerificationResult] = useState<PaymentVerificationResult | null>(null);

  // Computed Pricing & Promo Details
  const promoDetails: PromoCodeDetails = paymentService.getPromoDetails(appliedPromo || undefined, email);
  const isFreeVip = promoDetails.type === 'vip_1month_free' && promoDetails.isValid;
  const isDiscount5 = promoDetails.type === 'discount_5eur' && promoDetails.isValid;
  const isDiscount50 = promoDetails.type === 'discount_percent_50' && promoDetails.isValid;
  const remainingVipSpots = paymentService.getVipRemainingSpots();

  useEffect(() => {
    if (initialPromoCode) {
      const details = paymentService.getPromoDetails(initialPromoCode, email);
      if (details.isValid) {
        setAppliedPromo(initialPromoCode.trim().toUpperCase());
      }
    }
  }, [initialPromoCode]);

  useEffect(() => {
    if (isFreeVip) {
      setPaymentMethod('promo_vip');
    } else if (paymentMethod === 'promo_vip') {
      setPaymentMethod('card');
    }
  }, [isFreeVip]);

  if (!isOpen) return null;

  const handleApplyPromo = async (codeToApply?: string) => {
    setPromoError(null);
    setPromoSuccessMessage(null);
    const targetCode = (codeToApply || promoCodeInput).trim().toUpperCase();
    
    if (!targetCode) {
      setAppliedPromo(null);
      return;
    }

    setIsApplyingPromo(true);
    try {
      const details = await paymentService.validatePromoCode(targetCode, email);
      
      if (details.isValid) {
        setAppliedPromo(targetCode);
        setPromoCodeInput(targetCode);
        setPromoError(null);
        if (details.type === 'vip_1month_free' || targetCode === 'VIPGLG25') {
          setPromoSuccessMessage(`🎉 Code ${targetCode} activé : 1 mois d'accès VIP offert (${details.formattedDateRange || 'de date à date'}) !`);
        } else if (details.type === 'discount_percent_50' || targetCode === 'AQUAFORME2026') {
          setPromoSuccessMessage(`🎉 Code ${targetCode} appliqué : -50% de remise immédiate (${details.priceFormatted || '12,45 €'} au lieu de 24,90 €) !`);
        } else if (details.type === 'discount_5eur' || targetCode === 'GLGPROMO5') {
          setPromoSuccessMessage(`🎉 Code ${targetCode} appliqué : -5,00 € de remise immédiate (${details.priceFormatted || '19,90 €'} au lieu de 24,90 €) !`);
        } else {
          setPromoSuccessMessage(details.message || `Code ${targetCode} appliqué : ${details.priceFormatted} !`);
        }
      } else {
        setPromoError(details.errorMessage || 'Code promo invalide, expiré ou quota de 25 places atteint.');
      }
    } catch (err: any) {
      setPromoError(err?.message || 'Délai dépassé lors de la vérification du code promo. Réessayez.');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCodeInput('');
    setPromoError(null);
    setPromoSuccessMessage(null);
  };

  const handleStripeCheckout = async () => {
    setErrorMessage(null);

    if (!email || !email.includes('@')) {
      setErrorMessage('Veuillez saisir une adresse email valide pour lier votre compte avant de procéder au paiement Stripe.');
      return;
    }

    if (!acceptedTerms) {
      setErrorMessage('Veuillez accepter les conditions générales.');
      return;
    }

    setLoading(true);
    try {
      const session = await paymentService.createStripeCheckoutSession({
        email,
        customerName: fullName || undefined,
        promoCode: appliedPromo || undefined,
      });

      if (session?.url) {
        window.location.href = session.url;
      } else {
        throw new Error('URL de paiement Stripe non reçue.');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Erreur lors de la redirection vers Stripe. Vérifiez votre connexion.');
      setLoading(false);
    }
  };

  const handlePayOrActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleStripeCheckout();
  };

  const handleFinishAndEnter = () => {
    onClose();
    // Force refresh application state
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative my-auto">
        
        {/* Header Bar */}
        <div className={`px-5 sm:px-6 py-4 sm:py-5 text-white flex items-center justify-between transition-colors ${
          isFreeVip
            ? 'bg-gradient-to-r from-emerald-900 via-teal-900 to-indigo-950'
            : 'bg-gradient-to-r from-sky-900 via-indigo-900 to-slate-900'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
              isFreeVip
                ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-300'
                : 'bg-sky-500/20 border-sky-400/30 text-sky-300'
            }`}>
              {isFreeVip ? <Gift className="w-5 h-5" /> : <Infinity className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isFreeVip
                    ? 'bg-emerald-500/30 text-emerald-200 border-emerald-400/50 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                }`}>
                  {isFreeVip ? 'Offre VIP 25 Premiers' : 'Accès Complet'}
                </span>
                <span className="text-xs text-sky-200 font-medium hidden sm:inline">
                  {isFreeVip ? '1 Mois Offert de date à date' : 'Paiement 100% sécurisé'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {isFreeVip ? 'Baby Swim Vision — 1 Mois VIP Gratuit' : 'Baby Swim Vision – Premium à vie'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-8">
          {step === 'details' && (
            <form onSubmit={handlePayOrActivate} className="space-y-5 sm:space-y-6">
              
              {/* Promo Code Input Section FIRST */}
              <div className={`p-4 rounded-2xl border transition-all ${
                isFreeVip
                  ? 'bg-emerald-50/90 border-emerald-300 ring-2 ring-emerald-400/30'
                  : 'bg-slate-50 border-slate-200/90'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Vous avez un code promotionnel ?</span>
                  </label>
                  {appliedPromo && (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                    >
                      Retirer le code
                    </button>
                  )}
                </div>

                {!appliedPromo ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCodeInput}
                      disabled={isApplyingPromo}
                      onChange={(e) => {
                        setPromoCodeInput(e.target.value);
                        setPromoError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleApplyPromo();
                        }
                      }}
                      placeholder="Saisissez votre code promo..."
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs sm:text-sm uppercase font-mono font-bold tracking-wider placeholder:normal-case placeholder:font-normal placeholder:tracking-normal text-slate-900 disabled:opacity-60"
                    />
                    <button
                      type="button"
                      disabled={isApplyingPromo || !promoCodeInput.trim()}
                      onClick={() => handleApplyPromo()}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-colors cursor-pointer shrink-0 shadow-xs flex items-center gap-1.5 min-w-[90px] justify-center"
                    >
                      {isApplyingPromo ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Vérif...</span>
                        </>
                      ) : (
                        <span>Appliquer</span>
                      )}
                    </button>
                  </div>
                ) : (
                  <div>
                    {isFreeVip ? (
                      <div className="p-3 bg-emerald-100/90 border border-emerald-300 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="p-1 bg-emerald-600 text-white rounded-lg">
                              <Gift className="w-4 h-4" />
                            </span>
                            <div>
                              <div className="font-extrabold text-emerald-950 text-xs sm:text-sm flex items-center gap-1.5">
                                <span>Code VIP Validé</span>
                                <span className="px-2 py-0.5 bg-emerald-700 text-white text-[10px] uppercase font-black rounded-full">
                                  1 Mois Gratuit
                                </span>
                              </div>
                              <div className="text-[11px] text-emerald-800 font-medium">
                                Accès Premium débloqué de date à date
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="pt-1 border-t border-emerald-200/80 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900 font-bold">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Période : {promoDetails.formattedDateRange}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{remainingVipSpots} / 25 places restantes</span>
                          </div>
                        </div>
                      </div>
                    ) : isDiscount50 ? (
                      <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Code <strong>{appliedPromo}</strong> appliqué : <strong>12,45 € au lieu de 24,90 €</strong> (-50% immédiat)</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Code <strong>{appliedPromo}</strong> appliqué : <strong>19,90 € au lieu de 24,90 €</strong> (-5,00 €)</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {promoError && (
                  <div className="text-[11px] text-rose-600 font-medium flex items-center gap-1.5 pt-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{promoError}</span>
                  </div>
                )}
              </div>

              {/* Pricing Box Summary */}
              <div className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border shadow-xs transition-all ${
                isFreeVip
                  ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 border-emerald-300'
                  : 'bg-gradient-to-r from-sky-50/90 via-sky-50/60 to-indigo-50/80 border-sky-200/80'
              }`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      isFreeVip
                        ? 'text-emerald-900 bg-emerald-200 border border-emerald-300'
                        : 'text-sky-800 bg-sky-100/80'
                    }`}>
                      {isFreeVip ? 'Accès Premium 1 Mois Offert' : 'Accès Permanent à Vie'}
                    </span>
                    {isFreeVip && (
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-300 animate-pulse">
                        100% Gratuit (0,00 €)
                      </span>
                    )}
                    {isDiscount50 && (
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 animate-pulse">
                        Promo -50% active
                      </span>
                    )}
                    {isDiscount5 && (
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md border border-emerald-200 animate-pulse">
                        Promo -5,00 € active
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {isFreeVip ? 'Formule VIP — Découverte Complète' : 'Formule Complète Sans Abonnement'}
                  </h3>
                  <p className="text-xs text-slate-600">
                    {isFreeVip
                      ? `Accès illimité de date à date (${promoDetails.formattedDateRange}) • Sans engagement`
                      : 'Un seul paiement • Aucun renouvellement automatique • Mises à jour incluses'}
                  </p>
                </div>

                <div className="sm:text-right shrink-0 flex sm:flex-col items-baseline sm:items-end justify-between border-t sm:border-t-0 pt-2 sm:pt-0 border-sky-100">
                  <div className="flex items-baseline gap-2">
                    {(isFreeVip || isDiscount5 || isDiscount50) && (
                      <span className="text-sm sm:text-base font-bold text-slate-400 line-through">
                        24,90 €
                      </span>
                    )}
                    <span className={`text-2xl sm:text-3xl font-black tracking-tight ${
                      isFreeVip ? 'text-emerald-700' : 'text-sky-800'
                    }`}>
                      {promoDetails.priceFormatted}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    {isFreeVip ? '1 Mois Offert' : 'Paiement unique'}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3.5 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Payment Method Selector (Only shown if NOT free) */}
              {!isFreeVip ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Moyen de paiement sécurisé
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`p-2.5 sm:p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'card'
                          ? 'border-sky-600 bg-sky-50/50 text-sky-900 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-sky-600" />
                      <span>Carte Bancaire</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`p-2.5 sm:p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'apple_pay'
                          ? 'border-sky-600 bg-sky-50/50 text-sky-900 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-black"> Pay</span>
                      <span>Apple / Google</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('paypal')}
                      className={`p-2.5 sm:p-3 rounded-xl border text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'paypal'
                          ? 'border-sky-600 bg-sky-50/50 text-sky-900 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <span className="text-xs sm:text-sm font-extrabold text-blue-700 italic">PayPal</span>
                      <span>Express</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-900">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-extrabold block">Activation 100% Gratuite</span>
                    <span className="text-slate-600 text-[11px]">Aucun moyen de paiement ni carte bancaire requis pour cette offre spéciale.</span>
                  </div>
                </div>
              )}

              {/* Email & Details */}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Adresse Email (pour recevoir votre accès et confirmation) *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre.email@exemple.fr"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-slate-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Nom complet du parent ou de l'éducateur
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ex: Sarah Martin"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-sm text-slate-900"
                  />
                </div>
              </div>

              {/* Guarantees List */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {isFreeVip
                      ? '1 Mois complet d\'accès Premium offert (limité aux 25 premiers acquéreurs)'
                      : isDiscount50
                      ? 'Paiement UNIQUE de 12,45 € (code AQUAFORME2026 -50%) • Aucun abonnement • Aucun renouvellement automatique'
                      : isDiscount5
                      ? 'Paiement UNIQUE de 19,90 € (code GLGpromo5 -5 €) • Aucun abonnement • Aucun renouvellement automatique'
                      : 'Paiement UNIQUE de 24,90 € • Aucun abonnement • Aucun renouvellement automatique'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Accès complet aux analyses vidéo, bibliothèque pédagogique et matrice</span>
                </div>
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Paiement 100% sécurisé géré par la plateforme officielle Stripe</span>
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start gap-2.5 text-xs text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                />
                <span>
                  {isFreeVip
                    ? `J'accepte les conditions d'utilisation et je confirme l'activation de mon mois gratuit VIP (${promoDetails.formattedDateRange}) à Baby Swim Vision.`
                    : `J'accepte les conditions d'utilisation et je confirme mon achat unique de ${promoDetails.priceFormatted} pour l'accès Premium à vie.`}
                </span>
              </label>

              {/* Submit CTA */}
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-[#635BFF] via-[#5851ea] to-[#4943cd] hover:from-[#5851ea] hover:to-[#3e38b9] text-white font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-[#635BFF]/30 flex items-center justify-center gap-2.5 transition-all hover:scale-101 cursor-pointer disabled:opacity-50"
                >
                  <CreditCard className="w-5 h-5 text-white" />
                  <span>Continuer vers Stripe Checkout</span>
                  <ExternalLink className="w-4 h-4 ml-0.5 opacity-90" />
                </button>

                <div className="flex items-center justify-center gap-2 text-xs text-indigo-900 font-semibold bg-indigo-50/90 py-2 px-3 rounded-xl border border-indigo-200 text-center">
                  <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Vos codes de réduction Stripe (AQUAFORME2026, GLGpromo5, VIPGLG25) sont appliqués directement sur Stripe</span>
                </div>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center space-y-6">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center animate-pulse ${
                isFreeVip ? 'bg-emerald-100 text-emerald-600' : 'bg-sky-100 text-sky-600'
              }`}>
                {isFreeVip ? <Gift className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">
                  {isFreeVip ? 'Activation de votre accès VIP en cours...' : 'Validation sécurisée en cours...'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                  {isFreeVip
                    ? 'Attribution de votre accès 1 mois offert pour les 25 premiers acquéreurs.'
                    : `Communication avec la passerelle bancaire chiffrée et vérification du règlement de ${promoDetails.priceFormatted}.`}
                </p>
              </div>
              <div className="w-48 h-1.5 bg-slate-100 rounded-full mx-auto overflow-hidden">
                <div className={`h-full rounded-full animate-[progress_1.5s_ease-in-out_infinite] ${
                  isFreeVip ? 'bg-emerald-600' : 'bg-sky-600'
                }`} />
              </div>
            </div>
          )}

          {step === 'success' && verificationResult && (
            <div className="py-4 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider rounded-full">
                  {verificationResult.isVipMonthFree
                    ? 'Offre VIP Activée • Accès Premium'
                    : 'Paiement Confirmé • Accès à vie actif'}
                </span>
                <h3 className="text-2xl font-black text-slate-900">
                  Bienvenue dans Baby Swim Vision !
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  {verificationResult.isVipMonthFree
                    ? `Votre mois d'accès Premium offert (de date à date) est immédiatement actif.`
                    : 'Votre accès à vie est désormais activé de manière permanente sur votre compte.'}
                </p>
              </div>

              {/* Receipt Summary Card */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-left space-y-2.5 text-xs text-slate-700">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900">Référence de l'offre</span>
                  <span className="font-mono text-sky-700 font-bold">{verificationResult.receiptNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Montant :</span>
                  <span className="font-bold text-slate-900">
                    {verificationResult.isVipMonthFree ? '0,00 € (100% Offert)' : `${verificationResult.amountPaid?.toFixed(2).replace('.', ',')} €`}
                  </span>
                </div>
                {appliedPromo && (
                  <div className="flex items-center justify-between text-emerald-700">
                    <span>Code promo appliqué :</span>
                    <span className="font-bold">
                      {appliedPromo} {isFreeVip ? '(Offre VIP 25 premiers)' : '(-5,00 €)'}
                    </span>
                  </div>
                )}
                {verificationResult.isVipMonthFree && (
                  <div className="flex items-center justify-between text-indigo-900 font-bold">
                    <span>Validité (de date à date) :</span>
                    <span>{promoDetails.formattedDateRange}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>Compte associé :</span>
                  <span className="font-medium text-slate-900">{email}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinishAndEnter}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-base rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-101 cursor-pointer"
              >
                <Sparkles className="w-5 h-5" />
                <span>Accéder à mon espace complet</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-5 sm:px-6 py-3 border-t border-slate-100 text-center text-[11px] text-slate-400 flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span className="truncate">Support pédagogique et technique : swimgaella@gmail.com</span>
        </div>
      </div>
    </div>
  );
};
