import { BabyProfile } from '../types';
import { authService } from './authService';

const STORAGE_KEY_BABIES_REAL = 'baby_swim_vision_babies';
const STORAGE_KEY_BABIES_SIM = 'baby_swim_vision_simulation_babies';
const STORAGE_KEY_ACTIVE_BABY = 'baby_swim_vision_active_baby_id';

export function calculateAge(birthDateString: string): { months: number; weeks: number } {
  if (!birthDateString) return { months: 6, weeks: 24 };
  const birth = new Date(birthDateString);
  const now = new Date();
  
  if (isNaN(birth.getTime())) return { months: 6, weeks: 24 };

  const diffTime = Math.max(0, now.getTime() - birth.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(diffDays / 7);
  const months = Math.floor(diffDays / 30.44);

  return { months, weeks };
}

export const DEFAULT_LILOU_ADMIN_BABY: BabyProfile = {
  id: 'baby_lilou_admin',
  userId: 'user_admin_swimgaella',
  name: 'Lilou',
  birthDate: '2025-10-14', // ~11 months (matches the official Lilou demo videos)
  ageMonths: 11,
  ageWeeks: 48,
  level: 'confiance',
  startDate: '2026-01-15',
  goals: ['Flottaison dorsale détendue', 'Immersion douce et acceptée', 'Autonomie et appui bord de bassin'],
  hideNameInAnalysis: false,
  avatarUrl: '👧'
};

const DEFAULT_REAL_BABIES: BabyProfile[] = [
  DEFAULT_LILOU_ADMIN_BABY,
];

const DEFAULT_SIM_BABIES: BabyProfile[] = [
  {
    id: 'baby_sim_test_1',
    userId: 'user_simulation',
    name: 'Tom [Bébé Test Simulation]',
    birthDate: '2025-11-20',
    ageMonths: 9,
    ageWeeks: 38,
    level: 'decouverte',
    startDate: '2026-05-01',
    goals: ['Flottaison dorsale détendue', 'Confiance parent-bébé'],
    hideNameInAnalysis: false,
    avatarUrl: '🐬'
  }
];

class BabyService {
  private babies: BabyProfile[] = [];
  private activeBabyId: string | null = null;
  private listeners: Array<(babies: BabyProfile[], active: BabyProfile | null) => void> = [];

  constructor() {
    this.loadBabies();
    authService.subscribe(() => {
      this.loadBabies();
    });
  }

  public isCurrentUserAdmin(): boolean {
    const user = authService.getCurrentUser();
    if (!user) return false;
    // When an admin is in simulated non-admin role, they should experience the app as non-admin
    if (user.role === 'ADMIN' && user.simulatedRole) {
      return false;
    }
    return authService.isRealAdmin(user);
  }

  public isLilouOrAdminBaby(b: BabyProfile): boolean {
    if (b.userId === 'user_admin_swimgaella') return true;
    if (b.id === 'baby_lilou_admin' || b.id === 'baby_leo_1' || b.id === 'baby_maya_2') return true;
    const lower = (b.name || '').toLowerCase().trim();
    return lower === 'lilou' || lower.startsWith('lilou ') || lower.startsWith('lilou(') || lower === 'léo' || lower.startsWith('léo ') || lower === 'maya' || lower.startsWith('maya ');
  }

  private isSimulation(): boolean {
    const user = authService.getCurrentUser();
    return user?.role === 'ADMIN' && Boolean(user?.simulatedRole);
  }

  private getStorageKey(): string {
    return this.isSimulation() ? STORAGE_KEY_BABIES_SIM : STORAGE_KEY_BABIES_REAL;
  }

  public loadBabies() {
    try {
      const key = this.getStorageKey();
      const stored = localStorage.getItem(key);
      if (stored) {
        this.babies = JSON.parse(stored);
      } else {
        this.babies = this.isSimulation() ? DEFAULT_SIM_BABIES : DEFAULT_REAL_BABIES;
        this.saveBabies();
      }

      // Purge any legacy mock babies (Maya, Léo)
      this.babies = this.babies.filter(b => b.id !== 'baby_maya_2' && b.id !== 'baby_leo_1' && b.name !== 'Maya' && b.name !== 'Léo');

      // Ensure Lilou exists only for the admin
      if (!this.isSimulation()) {
        const hasLilou = this.babies.some(b => b.id === 'baby_lilou_admin' || b.name?.toLowerCase().includes('lilou'));
        if (!hasLilou && this.isCurrentUserAdmin()) {
          this.babies.unshift({ ...DEFAULT_LILOU_ADMIN_BABY });
        }
      }

      // Ensure any Lilou or admin profile is strictly assigned to user_admin_swimgaella
      this.babies = this.babies.map(b => {
        if (b.name?.toLowerCase().includes('lilou') || b.id === 'baby_lilou_admin') {
          return { ...b, userId: 'user_admin_swimgaella' };
        }
        return b;
      });

      // Re-calculate ages on load
      this.babies = this.babies.map(b => {
        const { months, weeks } = calculateAge(b.birthDate);
        return { ...b, ageMonths: months, ageWeeks: weeks };
      });

      const user = authService.getCurrentUser();
      const userBabies = this.getUserBabies(user?.id);
      const storedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_BABY);

      if (storedActiveId && userBabies.some(b => b.id === storedActiveId)) {
        this.activeBabyId = storedActiveId;
      } else if (userBabies.length > 0) {
        this.activeBabyId = userBabies[0].id;
        localStorage.setItem(STORAGE_KEY_ACTIVE_BABY, this.activeBabyId);
      } else {
        this.activeBabyId = null;
        localStorage.removeItem(STORAGE_KEY_ACTIVE_BABY);
      }
    } catch {
      this.babies = this.isSimulation() ? DEFAULT_SIM_BABIES : DEFAULT_REAL_BABIES;
      const user = authService.getCurrentUser();
      const userBabies = this.getUserBabies(user?.id);
      this.activeBabyId = userBabies[0]?.id || null;
    }
    this.notify();
  }

  private saveBabies() {
    const key = this.getStorageKey();
    localStorage.setItem(key, JSON.stringify(this.babies));
    const user = authService.getCurrentUser();
    const userBabies = this.getUserBabies(user?.id);
    if (this.activeBabyId && userBabies.some(b => b.id === this.activeBabyId)) {
      localStorage.setItem(STORAGE_KEY_ACTIVE_BABY, this.activeBabyId);
    } else {
      localStorage.removeItem(STORAGE_KEY_ACTIVE_BABY);
    }
    this.notify();
  }

  public resetSimulationData() {
    localStorage.removeItem(STORAGE_KEY_BABIES_SIM);
    if (this.isSimulation()) {
      this.loadBabies();
    }
  }

  private notify() {
    const user = authService.getCurrentUser();
    const userBabies = this.getUserBabies(user?.id);
    const active = this.getActiveBaby(user?.id);
    this.listeners.forEach(l => l(userBabies, active));
  }

  public subscribe(listener: (babies: BabyProfile[], active: BabyProfile | null) => void) {
    this.listeners.push(listener);
    const user = authService.getCurrentUser();
    listener(this.getUserBabies(user?.id), this.getActiveBaby(user?.id));
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public getBabies(): BabyProfile[] {
    const user = authService.getCurrentUser();
    return this.getUserBabies(user?.id);
  }

  public getUserBabies(userId?: string): BabyProfile[] {
    const isAdmin = this.isCurrentUserAdmin();
    if (isAdmin) {
      // Admin sees the admin baby (Lilou) + any babies created by admin
      return this.babies.filter(b => b.userId === 'user_admin_swimgaella' || !b.userId || b.userId === userId);
    }

    // STRICT NON-ADMIN / NEW ACCOUNTS RULE:
    // Lilou MUST NOT appear on any new or regular account! Only admin can see it.
    // New users see ONLY their own created babies.
    const currentUserId = userId || authService.getCurrentUser()?.id;
    if (!currentUserId) {
      return [];
    }
    return this.babies.filter(b => b.userId === currentUserId && !this.isLilouOrAdminBaby(b));
  }

  public calculateAge(birthDateString: string): { months: number; weeks: number } {
    return calculateAge(birthDateString);
  }

  public saveBaby(baby: BabyProfile): BabyProfile {
    const user = authService.getCurrentUser();
    const isSim = this.isSimulation();
    const isAdmin = this.isCurrentUserAdmin();
    const assignedUserId = baby.userId || (isAdmin ? 'user_admin_swimgaella' : (user?.id || 'user_guest'));

    const taggedBaby: BabyProfile = {
      ...baby,
      userId: assignedUserId,
      name: isSim && !baby.name.includes('[Test]') && !baby.name.includes('[Bébé Test') 
        ? `${baby.name} [Test Sim]` 
        : baby.name
    };

    const existingIndex = this.babies.findIndex(b => b.id === taggedBaby.id);
    if (existingIndex >= 0) {
      this.babies[existingIndex] = taggedBaby;
    } else {
      this.babies.push(taggedBaby);
    }
    this.activeBabyId = taggedBaby.id;
    this.saveBabies();
    return taggedBaby;
  }

  public getActiveBaby(userId?: string): BabyProfile | null {
    const currentUserId = userId || authService.getCurrentUser()?.id;
    const userBabies = this.getUserBabies(currentUserId);

    if (userBabies.length === 0) {
      return null;
    }

    const storedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_BABY);
    if (storedActiveId && userBabies.some(b => b.id === storedActiveId)) {
      this.activeBabyId = storedActiveId;
      return userBabies.find(b => b.id === storedActiveId) || null;
    }

    if (this.activeBabyId && userBabies.some(b => b.id === this.activeBabyId)) {
      return userBabies.find(b => b.id === this.activeBabyId) || null;
    }

    this.activeBabyId = userBabies[0].id;
    return userBabies[0];
  }

  public setActiveBaby(id: string, userId?: string) {
    const currentUserId = userId || authService.getCurrentUser()?.id;
    const userBabies = this.getUserBabies(currentUserId);
    if (userBabies.some(b => b.id === id)) {
      this.activeBabyId = id;
      localStorage.setItem(STORAGE_KEY_ACTIVE_BABY, id);
      this.notify();
    }
  }

  public createBaby(data: Omit<BabyProfile, 'id' | 'ageMonths' | 'ageWeeks'>): BabyProfile {
    const user = authService.getCurrentUser();
    const isAdmin = this.isCurrentUserAdmin();
    const { months, weeks } = calculateAge(data.birthDate);
    const isSim = this.isSimulation();
    const displayName = isSim && !data.name.includes('[Test]') 
      ? `${data.name} [Test Sim]` 
      : data.name;

    const newBaby: BabyProfile = {
      ...data,
      userId: data.userId || (isAdmin ? 'user_admin_swimgaella' : (user?.id || 'user_guest')),
      name: displayName,
      id: (isSim ? 'sim_baby_' : 'baby_') + Math.random().toString(36).substring(2, 9),
      ageMonths: months,
      ageWeeks: weeks,
      avatarUrl: data.avatarUrl || '👶'
    };
    this.babies.push(newBaby);
    this.activeBabyId = newBaby.id;
    this.saveBabies();
    return newBaby;
  }

  public updateBaby(id: string, updates: Partial<BabyProfile>): BabyProfile | null {
    const index = this.babies.findIndex(b => b.id === id);
    if (index === -1) return null;

    let updated = { ...this.babies[index], ...updates };
    if (updates.birthDate) {
      const { months, weeks } = calculateAge(updates.birthDate);
      updated.ageMonths = months;
      updated.ageWeeks = weeks;
    }
    this.babies[index] = updated;
    this.saveBabies();
    return updated;
  }

  public deleteBaby(id: string) {
    this.babies = this.babies.filter(b => b.id !== id);
    if (this.activeBabyId === id) {
      const user = authService.getCurrentUser();
      const userBabies = this.getUserBabies(user?.id);
      this.activeBabyId = userBabies[0]?.id || null;
    }
    this.saveBabies();
  }
}

export const babyService = new BabyService();
