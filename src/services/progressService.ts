import { SessionRecord, SkillStatus, BabyProgressSummary } from '../types';
import { SKILL_CATEGORIES, EXERCISES_CATALOG } from '../data/pedagogicalDatabase';
import { authService } from './authService';

const STORAGE_KEY_SESSIONS_REAL = 'baby_swim_vision_sessions';
const STORAGE_KEY_SESSIONS_SIM = 'baby_swim_vision_simulation_sessions';

// Initial seed sessions: empty for real production users
const INITIAL_REAL_SESSIONS: SessionRecord[] = [];

const INITIAL_SIM_SESSIONS: SessionRecord[] = [
  {
    id: 'session_sim_test_1',
    userId: 'user_simulation',
    babyId: 'baby_sim_test_1',
    date: '2026-08-10',
    title: '[TEST SIMULATION] Flottaison & Détente',
    videoDurationSeconds: 15,
    videoSizeMB: 8.2,
    situationKey: 'sit_flottaison_dorsale',
    situationTitle: 'Flottaison dorsale avec soutien délicat',
    analysis: {
      id: 'analysis_sim_1',
      sessionId: 'session_sim_test_1',
      babyId: 'baby_sim_test_1',
      createdAt: '2026-08-10T14:00:00Z',
      isDemo: true,
      provider: 'Moteur IA (Mode Simulation)',
      confidence: 0.92,
      situation: 'Flottaison dorsale test',
      situationKey: 'sit_flottaison_dorsale',
      positive_points: [
        '[Test] Bébé détendu en flottaison',
        '[Test] Oreilles bien immergées en douceur'
      ],
      observations: [
        'Donnée de test générée en simulation.'
      ],
      priority: 'Observation bienveillante du tonus.',
      main_recommendation: 'Conseil de test en simulation.',
      safety_notes: [
        '⚠️ Toujours maintenir la vigilance aquatique active.'
      ],
      recommended_exercise: EXERCISES_CATALOG[0],
      skills_observed: [
        { categoryId: 'flottaison', categoryName: 'Flottaison & Détente', skillName: 'Flottaison dorsale relâchée', status: 'en_progression', note: 'Simulation' }
      ]
    },
    notes: 'Séance de test créée dans le bac à sable de simulation.'
  }
];

class ProgressService {
  private sessions: SessionRecord[] = [];
  private listeners: Array<() => void> = [];

  constructor() {
    this.loadSessions();
    authService.subscribe(() => {
      this.loadSessions();
    });
  }

  private isSimulation(): boolean {
    const user = authService.getCurrentUser();
    return user?.role === 'ADMIN' && Boolean(user?.simulatedRole);
  }

  private getStorageKey(): string {
    return this.isSimulation() ? STORAGE_KEY_SESSIONS_SIM : STORAGE_KEY_SESSIONS_REAL;
  }

  public loadSessions() {
    try {
      const key = this.getStorageKey();
      const stored = localStorage.getItem(key);
      if (stored) {
        this.sessions = JSON.parse(stored);
      } else {
        this.sessions = this.isSimulation() ? INITIAL_SIM_SESSIONS : INITIAL_REAL_SESSIONS;
        this.saveSessions();
      }

      // Purge any legacy demo sessions for Léo or Maya
      this.sessions = this.sessions.filter(
        (s) => s.babyId !== 'baby_leo_1' && s.babyId !== 'baby_maya_2' && !s.title?.includes('Léo')
      );
    } catch {
      this.sessions = this.isSimulation() ? INITIAL_SIM_SESSIONS : INITIAL_REAL_SESSIONS;
    }
    this.notify();
  }

  private saveSessions() {
    const key = this.getStorageKey();
    localStorage.setItem(key, JSON.stringify(this.sessions));
    this.notify();
  }

  public resetSimulationData() {
    localStorage.removeItem(STORAGE_KEY_SESSIONS_SIM);
    if (this.isSimulation()) {
      this.loadSessions();
    }
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getSessions(babyId?: string): SessionRecord[] {
    if (!babyId) return [...this.sessions];
    return this.sessions.filter((s) => s.babyId === babyId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  public getSessionById(sessionId: string): SessionRecord | undefined {
    return this.sessions.find((s) => s.id === sessionId);
  }

  public saveSession(session: SessionRecord): SessionRecord {
    const isSim = this.isSimulation();
    const taggedSession: SessionRecord = {
      ...session,
      title: isSim && !session.title.includes('[TEST') ? `[TEST SIM] ${session.title}` : session.title,
    };

    const existingIndex = this.sessions.findIndex((s) => s.id === taggedSession.id);
    if (existingIndex >= 0) {
      this.sessions[existingIndex] = taggedSession;
    } else {
      this.sessions.unshift(taggedSession);
    }
    this.saveSessions();
    return taggedSession;
  }

  public deleteSession(sessionId: string) {
    this.sessions = this.sessions.filter((s) => s.id !== sessionId);
    this.saveSessions();
  }

  public getProgressSummary(babyId: string): BabyProgressSummary {
    const babySessions = this.getSessions(babyId);

    // Count observations per category across sessions
    const categoryObservations: Record<string, { [status in SkillStatus]: number }> = {};

    SKILL_CATEGORIES.forEach((cat) => {
      categoryObservations[cat.id] = {
        non_observe: 0,
        en_decouverte: 0,
        en_progression: 0,
        acquis: 0,
      };
    });

    // Track skills status
    const skillsStatusMap: Record<string, SkillStatus> = {};

    // Initial status defaults
    SKILL_CATEGORIES.forEach((cat) => {
      cat.skills.forEach((sk) => {
        skillsStatusMap[sk.id] = 'non_observe';
      });
    });

    // Tally from sessions
    babySessions.forEach((s) => {
      s.analysis.skills_observed?.forEach((obs) => {
        const catId = obs.categoryId;
        if (categoryObservations[catId]) {
          categoryObservations[catId][obs.status] = (categoryObservations[catId][obs.status] || 0) + 1;
        }
      });
    });

    // Derive balanced pedagogical status for each category:
    const categoryProgress: BabyProgressSummary['categoryProgress'] = {};

    SKILL_CATEGORIES.forEach((cat) => {
      const counts = categoryObservations[cat.id] || { non_observe: 0, en_decouverte: 0, en_progression: 0, acquis: 0 };
      const totalObs = counts.en_decouverte + counts.en_progression + counts.acquis;

      categoryProgress[cat.id] = {
        total: cat.skills.length,
        acquis: counts.acquis >= 2 ? 1 : 0, // Requires at least 2 sessions to confirm 'acquis'
        en_progression: counts.en_progression > 0 || (counts.acquis === 1) ? 1 : 0,
        en_decouverte: counts.en_decouverte > 0 ? 1 : 0,
        non_observe: totalObs === 0 ? cat.skills.length : Math.max(0, cat.skills.length - 1),
      };
    });

    return {
      babyId,
      totalSessions: babySessions.length,
      lastSessionDate: babySessions[0]?.date,
      skillsStatus: skillsStatusMap,
      categoryProgress,
    };
  }

  public getProgressionSummary(babyId: string, sessions?: SessionRecord[]): BabyProgressSummary {
    return this.getProgressSummary(babyId);
  }
}

export const progressService = new ProgressService();
