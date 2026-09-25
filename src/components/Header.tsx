import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  Sparkles,
  BookOpen,
  Calendar,
  TrendingUp,
  Shield,
  Video,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Globe,
  Sliders,
  ChevronRight,
  Lock,
} from 'lucide-react';
import { User, BabyProfile } from '../types';
import { accessControlService } from '../services/accessControlService';
import { authService } from '../services/authService';
import { BabyAvatar } from './BabyAvatar';
import { OfficialLogo } from './OfficialLogo';
import { useTranslation } from '../i18n/LanguageContext';
import { useAdminMode } from '../context/AdminModeContext';

interface HeaderProps {
  currentUser: User | null;
  activeBaby: BabyProfile | null;
  babies: BabyProfile[];
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenBabyModal: () => void;
  onEditBaby?: (baby: BabyProfile) => void;
  onSelectBaby: (id: string) => void;
  onOpenAuthModal: () => void;
  onOpenPrivacyModal: () => void;
  onOpenLanguageModal: () => void;
  onSignOut: () => void;
  onOpenCheckout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  activeBaby,
  babies,
  currentView,
  onNavigate,
  onOpenBabyModal,
  onSelectBaby,
  onOpenAuthModal,
  onOpenPrivacyModal,
  onOpenLanguageModal,
  onSignOut,
  onOpenCheckout,
}) => {
  const { t, currentLanguage } = useTranslation();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isAdminModeActive, requestAdminMode } = useAdminMode();

  const effectiveRole = accessControlService.getEffectiveRole(currentUser);
  const isRealAdmin = authService.isRealAdmin(currentUser);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isPaidUser = Boolean(currentUser && (effectiveRole === 'USER_PREMIUM' || effectiveRole === 'ADMIN'));

  // Strict Navigation Items: ONLY core modules, NO Profil, NO Admin in the navigation links
  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: TrendingUp, lockedForFree: true },
    { id: 'find-club', label: t('nav.findClub') || 'Trouvez mon club', icon: Globe, lockedForFree: false },
    { id: 'record', label: t('nav.newAnalysis'), icon: Video, highlight: true, lockedForFree: true },
    { id: 'sessions', label: t('nav.sessions'), icon: Calendar, lockedForFree: true },
    { id: 'library', label: t('nav.library'), icon: BookOpen, lockedForFree: true },
  ];

  const handleNavClick = (itemId: string, lockedForFree: boolean) => {
    if (lockedForFree && !isPaidUser) {
      if (!currentUser) {
        onOpenAuthModal();
      } else {
        onOpenCheckout?.();
      }
      return;
    }
    onNavigate(itemId);
  };

  const profileDisplayName = activeBaby?.name || (currentUser?.name && currentUser.name !== 'Parent Nageur' ? currentUser.name : (currentUser?.name || t('profile.myAccount') || 'Mon Compte'));
  const profileDisplayAge = activeBaby ? `${activeBaby.ageMonths} mois` : (currentUser?.email || 'Profil parent');

  const otherBabies = babies.filter((b) => !activeBaby || b.id !== activeBaby.id);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* 1. Logo & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('landing')}
              className="flex items-center text-left group focus:outline-none cursor-pointer"
              title="Baby Swim Vision"
            >
              <OfficialLogo className="h-10 sm:h-12 w-auto max-w-[190px] sm:max-w-[240px] object-contain group-hover:opacity-95 transition-opacity" />
            </button>
          </div>

          {/* 2. Desktop Navigation (Tableau de bord | Analyser une vidéo | Mes séances | Bibliothèque) */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isLocked = item.lockedForFree && !isPaidUser;

              if (item.highlight) {
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id, item.lockedForFree)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                        : isLocked
                        ? 'bg-amber-50/80 text-amber-800 hover:bg-amber-100/90 border border-amber-200/60'
                        : 'bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isLocked && <Lock className="w-3 h-3 text-amber-600 ml-0.5" />}
                  </button>
                );
              }
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id, item.lockedForFree)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 font-semibold'
                      : isLocked
                      ? 'text-slate-500 hover:text-slate-800 hover:bg-amber-50/50'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {isLocked && <Lock className="w-3 h-3 text-amber-500 ml-0.5" />}
                </button>
              );
            })}
          </nav>

          {/* 3. Right Side Controls: Single Unified Profile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3" ref={dropdownRef}>
            {/* Language Switcher Button */}
            <button
              onClick={onOpenLanguageModal}
              title={t('languageSelector.title')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-sky-300 bg-white hover:bg-sky-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer shadow-2xs"
            >
              <span className="text-base">{currentLanguage.flag}</span>
              <span className="hidden sm:inline font-bold uppercase text-[11px] text-slate-800">
                {currentLanguage.code.split('-')[0].toUpperCase()}
              </span>
              <Globe className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
            </button>

            {/* THE ONLY PROFILE & ACCOUNT ENTRY POINT */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  id="user-profile-menu-button"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 rounded-2xl text-xs sm:text-sm font-semibold text-slate-800 transition-all cursor-pointer shadow-2xs group"
                >
                  {activeBaby ? (
                    <BabyAvatar baby={activeBaby} size="sm" shape="circle" />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '👤'}
                    </div>
                  )}

                  <div className="text-left flex items-center gap-1.5">
                    <span className="font-extrabold text-slate-800 block leading-tight group-hover:text-sky-700 transition-colors">
                      {profileDisplayName}
                    </span>
                  </div>

                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${profileDropdownOpen ? 'rotate-180 text-sky-600' : ''}`} />
                </button>

                {/* EXACT ULTRA-CLEAN USER MENU AS REQUESTED */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-3xl shadow-2xl border border-slate-200/90 py-3 z-50 animate-scale-up divide-y divide-slate-100">
                    
                    {/* Top Identity: Active baby or Parent account */}
                    <div className="px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onNavigate('profile');
                        }}
                        className="w-full text-left flex items-center gap-3 group/item hover:opacity-90 cursor-pointer"
                      >
                        {activeBaby ? (
                          <BabyAvatar baby={activeBaby} size="md" shape="circle" />
                        ) : (
                          <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
                            {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '👤'}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-black text-slate-900 leading-tight truncate group-hover/item:text-sky-600 transition-colors">
                            {profileDisplayName}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">{profileDisplayAge}</p>
                        </div>
                      </button>
                    </div>

                    {/* NEW USER PROMPT: CREATE BABY PROFILE */}
                    {!activeBaby && (
                      <div className="p-2">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenBabyModal();
                          }}
                          className="w-full text-left p-3 rounded-2xl text-xs font-bold bg-gradient-to-r from-sky-50 to-teal-50 hover:from-sky-100 hover:to-teal-100 border border-sky-200 text-sky-900 flex items-center gap-2.5 transition-all cursor-pointer shadow-2xs"
                        >
                          <div className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                            +
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-extrabold text-sky-950 truncate">Créer mon profil bébé</div>
                            <div className="text-[10px] text-sky-700 font-normal">Prénom, âge, niveau & objectifs</div>
                          </div>
                        </button>
                      </div>
                    )}

                    {/* UPGRADE CTA ONLY IF FREE USER */}
                    {effectiveRole === 'USER_FREE' && (
                      <div className="p-2">
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenCheckout?.();
                          }}
                          className="w-full text-left p-3 rounded-2xl text-xs font-black bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white flex items-center justify-between shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                            <div>
                              <div>Passer Premium (24,90 €)</div>
                              <div className="text-[10px] font-normal text-sky-100">Accès illimité à vie</div>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase bg-white/20 px-2 py-0.5 rounded font-black">Débloquer</span>
                        </button>
                      </div>
                    )}

                    {/* Child profiles list */}
                    {(otherBabies.length > 0 || activeBaby) && (
                      <div className="p-2 space-y-1">
                        {otherBabies.map((b) => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              onSelectBaby(b.id);
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between text-slate-700 hover:bg-slate-50 font-medium transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <BabyAvatar baby={b} size="sm" shape="circle" />
                              <span className="truncate font-semibold">{b.name}</span>
                            </div>
                            <span className="text-[10px] text-slate-400">{b.ageMonths} mois</span>
                          </button>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onOpenBabyModal();
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-sky-600 hover:bg-sky-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Ajouter un profil enfant</span>
                        </button>
                      </div>
                    )}

                    {/* Footer Settings & Sign out */}
                    <div className="p-2 space-y-0.5">
                      {authService.isAdminUnlocked() && authService.isRealAdmin(currentUser) && (
                        <button
                          type="button"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            onNavigate('admin');
                          }}
                          className="w-full text-left px-3 py-2 text-xs text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 rounded-xl flex items-center justify-between font-bold cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Shield className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Administration</span>
                          </div>
                          <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full font-extrabold">Espace</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenLanguageModal();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="w-3.5 h-3.5 text-slate-400" />
                          <span>{t('nav.language')}</span>
                        </div>
                        <span className="font-semibold text-[11px] text-sky-600">
                          {currentLanguage.flag} {currentLanguage.nativeName}
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onOpenPrivacyModal();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5 text-slate-400" />
                        <span>{t('nav.privacy')}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          onSignOut();
                        }}
                        className="w-full text-left px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 cursor-pointer font-bold transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onOpenAuthModal}
                  className="px-3 py-1.5 border border-slate-200 hover:border-sky-300 hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold rounded-xl transition-colors cursor-pointer shadow-2xs"
                >
                  {t('authModal.titleLogin')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenCheckout) {
                      onOpenCheckout();
                    } else {
                      onOpenAuthModal();
                    }
                  }}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-md shadow-sky-600/20 cursor-pointer"
                >
                  <span>24,90 € à vie</span>
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            const isLocked = item.lockedForFree && !isPaidUser;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleNavClick(item.id, item.lockedForFree);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-sky-50 text-sky-700 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {isLocked && (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                    <Lock className="w-3 h-3" />
                    <span>24,90 €</span>
                  </span>
                )}
              </button>
            );
          })}

          {effectiveRole === 'USER_FREE' && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCheckout?.();
              }}
              className="w-full mt-2 flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-black bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Passer en Premium (24,90 €)</span>
              </div>
              <span className="text-xs font-bold uppercase bg-white/20 px-2 py-0.5 rounded">À vie</span>
            </button>
          )}

          <div className="pt-2 border-t border-slate-100 space-y-1">
            {authService.isAdminUnlocked() && authService.isRealAdmin(currentUser) && (
              <button
                onClick={() => {
                  onNavigate('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-between px-3 py-2 text-xs text-indigo-700 bg-indigo-50/70 hover:bg-indigo-100 rounded-xl font-bold"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-indigo-600" />
                  <span>Espace Administration</span>
                </div>
                <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full">Accès</span>
              </button>
            )}

            <button
              onClick={() => {
                onNavigate('profile');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl font-medium"
            >
              <span>Mon Profil & Enfants</span>
              <span className="text-xs text-slate-400 font-semibold">{profileDisplayName}</span>
            </button>

            <button
              onClick={() => {
                onOpenLanguageModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 rounded-xl"
            >
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-600" />
                <span>{t('nav.language')}</span>
              </div>
              <span className="font-bold text-sky-700">
                {currentLanguage.flag} {currentLanguage.nativeName}
              </span>
            </button>

            <button
              onClick={() => {
                onSignOut();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl font-bold"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
