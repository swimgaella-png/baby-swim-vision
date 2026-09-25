import { User, UserRole, SimulatedRole, SubscriptionStatus } from '../types';

const STORAGE_KEY_USER = 'baby_swim_vision_current_user';
const STORAGE_KEY_CONSENT = 'baby_swim_vision_parental_consent';
const STORAGE_KEY_REGISTRY = 'baby_swim_vision_users_registry';
const STORAGE_KEY_ADMIN_AUTH = 'bsv_admin_passcode_authenticated';
const STORAGE_KEY_TOKEN = 'bsv_session_token';

export const ADMIN_MASTER_CODE = 'BabySwimVision2026!';
export const ADMIN_DEFAULT_EMAIL = 'swimgaella@gmail.com';

export const DEFAULT_ADMIN_USER: User = {
  id: 'user_admin_swimgaella',
  email: 'swimgaella@gmail.com',
  name: 'Gaëlla (Admin)',
  role: 'ADMIN',
  subscriptionStatus: 'active',
  simulatedRole: null, // Starts in real ADMIN mode
  createdAt: '2026-01-01T00:00:00.000Z',
  consentAccepted: true,
  lifetimeAccess: true,
};

export const DEFAULT_FREE_USER: User = {
  id: 'user_free_demo',
  email: 'parent.decouverte@exemple.fr',
  name: 'Sarah (Visiteur)',
  role: 'USER_FREE',
  subscriptionStatus: 'free',
  simulatedRole: null,
  createdAt: new Date().toISOString(),
  consentAccepted: true,
  lifetimeAccess: false,
};

class AuthService {
  private currentUser: User | null = null;
  private listeners: Array<(user: User | null) => void> = [];

  constructor() {
    this.loadUser();
  }

  private loadUser() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.role === 'ADMIN') {
          // Verify admin is authenticated with active admin session or passcode
          const isUnlocked = this.isAdminUnlocked();
          if (isUnlocked) {
            this.currentUser = {
              ...DEFAULT_ADMIN_USER,
              ...parsed,
              role: 'ADMIN',
              subscriptionStatus: 'active',
              lifetimeAccess: true,
            };
          } else {
            // Admin session expired or not authenticated
            this.currentUser = null;
            localStorage.removeItem(STORAGE_KEY_USER);
          }
        } else {
          this.currentUser = parsed;
        }
      } else {
        // Visitor default: no automatic admin mode
        this.currentUser = null;
      }
    } catch {
      this.currentUser = null;
    }
  }

  /**
   * Check if a user is a real Administrator
   */
  public isRealAdmin(user?: User | null): boolean {
    const target = user !== undefined ? user : this.currentUser;
    if (!target) return false;
    const cleanEmail = target.email?.toLowerCase().trim() || '';
    const hasAdminRole = target.role === 'ADMIN';
    const isDedicatedAdmin = cleanEmail === 'swimgaella@gmail.com';
    return hasAdminRole && isDedicatedAdmin && this.isAdminUnlocked();
  }

  /**
   * Get JWT session token
   */
  public getAuthToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY_TOKEN);
    } catch {
      return null;
    }
  }

  /**
   * Get authenticated headers for server calls
   */
  public getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    if (this.currentUser?.email) {
      headers['x-user-email'] = this.currentUser.email;
    }
    return headers;
  }

  /**
   * Check if the admin access has been verified on server
   */
  public isAdminUnlocked(): boolean {
    try {
      const isFlagged = localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
      const token = localStorage.getItem(STORAGE_KEY_TOKEN);
      return (isFlagged || Boolean(token)) && this.currentUser?.role === 'ADMIN' && this.currentUser?.email?.toLowerCase().trim() === 'swimgaella@gmail.com';
    } catch {
      return false;
    }
  }

  /**
   * Verify credentials strictly with server and unlock Admin mode
   */
  public async unlockAdmin(passcode: string, email: string = 'swimgaella@gmail.com'): Promise<boolean> {
    const cleanPass = passcode.trim();
    const cleanEmail = email.trim().toLowerCase();
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: cleanPass }),
      });
      const data = await res.json();
      if (res.ok && data.success && data.role === 'ADMIN' && data.token) {
        localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
        localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
        this.ensureAdminMode();
        return true;
      }
    } catch {
      // server check failed
    }
    return false;
  }

  /**
   * Lock admin mode (clears tokens and signs out admin)
   */
  public lockAdmin(): void {
    try {
      localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    } catch {
      // ignore
    }
    if (this.currentUser?.role === 'ADMIN') {
      this.currentUser = null;
      try {
        localStorage.removeItem(STORAGE_KEY_USER);
      } catch {
        // ignore
      }
      this.notify();
    }
  }

  /**
   * Force reset to real Administrator mode
   */
  public ensureAdminMode() {
    this.currentUser = {
      ...DEFAULT_ADMIN_USER,
      role: 'ADMIN',
      subscriptionStatus: 'active',
      lifetimeAccess: true,
      simulatedRole: null,
    };
    try {
      localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
    } catch {}
    this.saveUser(this.currentUser);
  }

  private getRegistry(): Record<string, User> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_REGISTRY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  }

  private saveToRegistry(user: User) {
    try {
      const registry = this.getRegistry();
      const emailKey = user.email.trim().toLowerCase();
      registry[emailKey] = {
        ...registry[emailKey],
        ...user,
      };
      localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(registry));
    } catch {
      // ignore
    }
  }

  public getAllUsers(): User[] {
    const registry = this.getRegistry();
    const list = Object.values(registry);
    if (this.currentUser && !list.some((u) => u.email.toLowerCase() === this.currentUser?.email.toLowerCase())) {
      list.unshift(this.currentUser);
    }
    return list;
  }

  public adminSetUserPremium(email: string, isPremium: boolean): User | null {
    const cleanEmail = email.trim().toLowerCase();
    const registry = this.getRegistry();
    const targetUser = registry[cleanEmail] || (this.currentUser?.email.toLowerCase() === cleanEmail ? this.currentUser : null);
    
    if (!targetUser) return null;

    const updatedUser: User = {
      ...targetUser,
      role: isPremium ? 'USER_PREMIUM' : 'USER_FREE',
      subscriptionStatus: isPremium ? 'active' : 'free',
      lifetimeAccess: isPremium,
      purchasedAt: isPremium ? (targetUser.purchasedAt || new Date().toISOString()) : undefined,
    };

    registry[cleanEmail] = updatedUser;
    try {
      localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(registry));
    } catch {
      // ignore
    }

    if (this.currentUser?.email.toLowerCase() === cleanEmail) {
      this.currentUser = updatedUser;
      try {
        localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
      } catch {
        // ignore
      }
      this.notify();
    }

    return updatedUser;
  }

  public adminDeleteUser(email: string): boolean {
    const cleanEmail = email.trim().toLowerCase();
    const registry = this.getRegistry();
    if (registry[cleanEmail]) {
      delete registry[cleanEmail];
      try {
        localStorage.setItem(STORAGE_KEY_REGISTRY, JSON.stringify(registry));
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  }

  public saveUser(user: User | null) {
    this.currentUser = user;
    if (user) {
      localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
      this.saveToRegistry(user);
    } else {
      localStorage.removeItem(STORAGE_KEY_USER);
    }
    this.notify();
  }

  public updateUser(user: User): User {
    this.saveUser(user);
    return user;
  }

  private notify() {
    this.listeners.forEach((l) => l(this.currentUser));
  }

  public subscribe(listener: (user: User | null) => void) {
    this.listeners.push(listener);
    listener(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getCurrentUser(): User | null {
    return this.currentUser;
  }

  public hasLifetimeAccess(): boolean {
    return Boolean(this.currentUser?.lifetimeAccess);
  }

  public getEffectiveRole(): 'USER_FREE' | 'USER_PREMIUM' | 'ADMIN' {
    if (!this.currentUser) return 'USER_FREE';
    if (this.currentUser.role === 'ADMIN') {
      if (this.currentUser.simulatedRole === 'USER_FREE') return 'USER_FREE';
      if (this.currentUser.simulatedRole === 'USER_PREMIUM') return 'USER_PREMIUM';
      return 'ADMIN';
    }
    if (this.currentUser.subscriptionExpiresAt) {
      const expires = new Date(this.currentUser.subscriptionExpiresAt).getTime();
      if (!isNaN(expires)) {
        if (expires > Date.now()) {
          return 'USER_PREMIUM';
        } else if (!this.currentUser.lifetimeAccess) {
          return 'USER_FREE';
        }
      }
    }
    if (
      this.currentUser.lifetimeAccess ||
      this.currentUser.subscriptionStatus === 'active' ||
      this.currentUser.role === 'USER_PREMIUM'
    ) {
      return 'USER_PREMIUM';
    }
    return 'USER_FREE';
  }

  /**
   * Set simulation mode for ADMIN account
   */
  public setSimulationMode(simulatedRole: SimulatedRole) {
    if (!this.currentUser) return;
    const updated: User = {
      ...this.currentUser,
      simulatedRole,
    };
    this.saveUser(updated);
  }

  public setSimulatedRole(simulatedRole: SimulatedRole) {
    this.setSimulationMode(simulatedRole);
  }

  /**
   * Quick simulation switchers
   */
  public switchToAdminReal() {
    this.setSimulationMode(null);
  }

  public switchToSimulateFree() {
    this.setSimulationMode('USER_FREE');
  }

  public switchToSimulatePremium() {
    this.setSimulationMode('USER_PREMIUM');
  }

  public async signIn(email: string, pass: string, requestedRole?: UserRole): Promise<User> {
    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail || !pass) {
      throw new Error('Veuillez renseigner votre email et mot de passe.');
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password: pass }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Identifiants incorrects.');
      }

      if (data.token) {
        localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
      }

      const isAdmin = data.user.role === 'ADMIN';
      if (isAdmin) {
        localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        subscriptionStatus: data.user.subscriptionStatus || (isAdmin ? 'active' : 'free'),
        lifetimeAccess: Boolean(data.user.lifetimeAccess),
        createdAt: data.user.createdAt || new Date().toISOString(),
        consentAccepted: this.hasParentalConsent(),
        orderId: data.user.orderId,
        purchasedAt: data.user.purchasedAt,
        simulatedRole: null,
      };

      this.saveUser(user);
      return user;
    } catch (err: any) {
      throw err;
    }
  }

  public async signUp(name: string, email: string, pass: string, requestedRole: UserRole = 'USER_FREE'): Promise<User> {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !pass) {
      throw new Error('Veuillez renseigner un email et un mot de passe.');
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email: cleanEmail, password: pass, role: requestedRole }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de la création du compte.');
      }

      if (data.token) {
        localStorage.setItem(STORAGE_KEY_TOKEN, data.token);
      }

      const user: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: data.user.role,
        subscriptionStatus: data.user.subscriptionStatus,
        lifetimeAccess: Boolean(data.user.lifetimeAccess),
        createdAt: data.user.createdAt,
        consentAccepted: this.hasParentalConsent(),
        simulatedRole: null,
      };

      this.saveUser(user);
      return user;
    } catch (err: any) {
      throw err;
    }
  }

  public async signOut(): Promise<void> {
    this.lockAdmin();
    try {
      localStorage.removeItem(STORAGE_KEY_TOKEN);
    } catch {
      // ignore
    }
    this.saveUser(null);
  }

  public setRole(role: UserRole) {
    if (this.currentUser) {
      const updated: User = {
        ...this.currentUser,
        role,
        subscriptionStatus: role === 'ADMIN' || role === 'USER_PREMIUM' ? 'active' : 'free',
      };
      this.saveUser(updated);
    }
  }

  public setSubscriptionStatus(status: SubscriptionStatus) {
    if (this.currentUser) {
      const updated: User = {
        ...this.currentUser,
        subscriptionStatus: status,
        role: status === 'active' || status === 'grace_period' ? 'USER_PREMIUM' : 'USER_FREE',
        lifetimeAccess: status === 'active',
      };
      this.saveUser(updated);
    }
  }

  public setLifetimeAccess(status: boolean, details?: { orderId?: string; receipt?: string; amount?: number }) {
    if (this.currentUser) {
      const updated: User = {
        ...this.currentUser,
        lifetimeAccess: status,
        role: status ? 'USER_PREMIUM' : 'USER_FREE',
        subscriptionStatus: status ? 'active' : 'free',
        purchasedAt: status ? new Date().toISOString() : undefined,
        orderId: details?.orderId,
        paymentReceipt: details?.receipt,
        amountPaidEur: details?.amount || 24.90,
      };
      this.saveUser(updated);
    }
  }

  public activateOneMonthVipPromo(params: {
    email: string;
    name?: string;
    promoCode: string;
    expiresAtIso: string;
    receiptNumber?: string;
    orderId?: string;
  }): User {
    const cleanEmail = params.email.trim().toLowerCase();
    const existing = this.getRegistry()[cleanEmail];
    const now = new Date().toISOString();

    const updatedUser: User = {
      id: existing?.id || this.currentUser?.id || ('user_' + Math.random().toString(36).substring(2, 9)),
      email: cleanEmail,
      name: params.name || existing?.name || this.currentUser?.name || 'Parent Nageur',
      role: 'USER_PREMIUM',
      subscriptionStatus: 'active',
      subscriptionExpiresAt: params.expiresAtIso,
      createdAt: existing?.createdAt || this.currentUser?.createdAt || now,
      consentAccepted: true,
      lifetimeAccess: false,
      purchasedAt: now,
      orderId: params.orderId || ('bsv_vip_' + Date.now()),
      paymentReceipt: params.receiptNumber || ('BSV-VIP-' + Math.floor(100000 + Math.random() * 900000)),
      paymentMethod: 'promo_vip',
      amountPaidEur: 0,
      promoCodeApplied: params.promoCode,
      promoPlan: 'vip_1month_free',
      simulatedRole: null,
    };

    this.saveUser(updatedUser);
    return updatedUser;
  }

  public hasParentalConsent(): boolean {
    return localStorage.getItem(STORAGE_KEY_CONSENT) === 'true';
  }

  public setParentalConsent(accepted: boolean) {
    localStorage.setItem(STORAGE_KEY_CONSENT, accepted ? 'true' : 'false');
    if (this.currentUser) {
      this.saveUser({ ...this.currentUser, consentAccepted: accepted });
    }
  }

  public async resetPassword(email: string): Promise<boolean> {
    console.log(`Email de réinitialisation envoyé à : ${email}`);
    return true;
  }
}

export const authService = new AuthService();
