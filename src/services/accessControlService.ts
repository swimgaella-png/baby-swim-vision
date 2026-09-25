import { User, FeatureKey, SimulatedRole, UserRole, SubscriptionStatus } from '../types';

export interface AccessDecision {
  allowed: boolean;
  effectiveRole: 'USER_FREE' | 'USER_PREMIUM' | 'ADMIN';
  isSimulation: boolean;
  reason?: 'subscription_required' | 'admin_only' | 'granted';
  paywallTitle?: string;
  paywallMessage?: string;
  ctaText?: string;
}

class AccessControlService {
  /**
   * Determine the effective role for access checks.
   * If the real user is ADMIN and has set a simulation mode, the effective role matches the simulation.
   */
  public getEffectiveRole(user: User | null): 'USER_FREE' | 'USER_PREMIUM' | 'ADMIN' {
    if (!user) return 'USER_FREE';

    // If user is Admin, check for simulation mode
    if (user.role === 'ADMIN') {
      if (user.simulatedRole === 'USER_FREE') return 'USER_FREE';
      if (user.simulatedRole === 'USER_PREMIUM') return 'USER_PREMIUM';
      return 'ADMIN';
    }

    // Check if user has a time-limited access (e.g. 1 month VIP trial)
    if (user.subscriptionExpiresAt) {
      const expiresTimestamp = new Date(user.subscriptionExpiresAt).getTime();
      if (!isNaN(expiresTimestamp)) {
        if (expiresTimestamp > Date.now()) {
          return 'USER_PREMIUM';
        } else if (!user.lifetimeAccess) {
          return 'USER_FREE';
        }
      }
    }

    if (
      user.lifetimeAccess === true ||
      user.subscriptionStatus === 'active' ||
      user.subscriptionStatus === 'grace_period' ||
      user.role === 'USER_PREMIUM'
    ) {
      return 'USER_PREMIUM';
    }

    return 'USER_FREE';
  }

  /**
   * Check whether the user is currently in an active simulation mode.
   */
  public isSimulationActive(user: User | null): boolean {
    if (!user) return false;
    return user.role === 'ADMIN' && Boolean(user.simulatedRole);
  }

  /**
   * Get current simulation role
   */
  public getSimulatedRole(user: User | null): SimulatedRole {
    if (!user || user.role !== 'ADMIN') return null;
    return user.simulatedRole || null;
  }

  /**
   * Central authorization engine
   */
  public canAccess(feature: FeatureKey, user: User | null): AccessDecision {
    const effectiveRole = this.getEffectiveRole(user);
    const isSim = this.isSimulationActive(user);

    // 1. Admin in real mode has access to everything
    if (effectiveRole === 'ADMIN') {
      return {
        allowed: true,
        effectiveRole: 'ADMIN',
        isSimulation: isSim,
        reason: 'granted',
      };
    }

    // 2. Admin tools are restricted to real ADMIN
    if (feature === 'FEATURE_ADMIN_TOOLS') {
      return {
        allowed: false,
        effectiveRole,
        isSimulation: isSim,
        reason: 'admin_only',
        paywallTitle: 'Espace Administrateur',
        paywallMessage: 'Cette section est strictement réservée à l\'équipe de conception.',
      };
    }

    // 3. Premium Users have full access to all features
    if (effectiveRole === 'USER_PREMIUM') {
      return {
        allowed: true,
        effectiveRole: 'USER_PREMIUM',
        isSimulation: isSim,
        reason: 'granted',
      };
    }

    // 4. Free Users: Baby Profile creation & edition is ALLOWED for free!
    if (
      feature === 'FEATURE_BABY_CREATE' ||
      feature === 'FEATURE_BABY_EDIT' ||
      feature === 'FEATURE_BABY_DELETE'
    ) {
      return {
        allowed: true,
        effectiveRole: 'USER_FREE',
        isSimulation: isSim,
        reason: 'granted',
      };
    }

    // All other features (Articles, Analyses, Tabs, Exercises, Session History) are LOCKED for Free users!
    const paywallInfo = this.getFeaturePaywallInfo(feature);

    return {
      allowed: false,
      effectiveRole: 'USER_FREE',
      isSimulation: isSim,
      reason: 'subscription_required',
      paywallTitle: paywallInfo.title,
      paywallMessage: paywallInfo.message,
      ctaText: paywallInfo.ctaText,
    };
  }

  /**
   * Contextual paywall messages for each feature
   */
  public getFeaturePaywallInfo(feature: FeatureKey): { title: string; message: string; ctaText: string } {
    switch (feature) {
      case 'FEATURE_ARTICLE_READ':
        return {
          title: 'Article réservé aux membres payants',
          message: 'Les articles pédagogiques et fiches conseils spécialisées sont réservés aux membres ayant débloqué l\'accès complet (24,90 € à vie).',
          ctaText: 'Débloquer l\'accès complet (24,90 €)',
        };
      case 'FEATURE_EXERCISE_DETAIL':
        return {
          title: 'Exercice réservé aux membres payants',
          message: 'Les fiches d\'exercices détaillées, les repères biomécaniques et les guides d\'évolution par âge sont réservés aux membres ayant payé l\'accès à vie.',
          ctaText: 'Débloquer tous les exercices',
        };
      case 'FEATURE_VIDEO_ANALYSIS':
        return {
          title: 'Analyse IA réservée aux membres payants',
          message: 'L\'enregistrement, le téléversement et l\'analyse biomécanique par intelligence artificielle sont réservés aux membres ayant payé leur accès complet (24,90 € à vie).',
          ctaText: 'Débloquer les analyses illimitées (24,90 €)',
        };
      case 'FEATURE_SESSION_HISTORY_DETAIL':
        return {
          title: 'Historique des séances réservé',
          message: 'L\'historique complet des séances et les bilans d\'évolution séance après séance nécessitent l\'accès payant (24,90 € à vie).',
          ctaText: 'Débloquer l\'accès complet (24,90 €)',
        };
      case 'FEATURE_SKILLS_MATRIX_DETAIL':
        return {
          title: 'Matrice des compétences réservée',
          message: 'La grille complète d\'évaluation des 8 domaines aquatiques et le suivi des paliers sont réservés aux profils ayant payé.',
          ctaText: 'Débloquer l\'accès complet (24,90 €)',
        };
      case 'FEATURE_DRY_DROWNING_FACTSHEET':
        return {
          title: 'Fiche médicale & prévention réservée',
          message: 'Le dossier complet de prévention sur la fausse route (« noyade sèche ») et les réflexes d\'urgence est réservé aux membres ayant payé.',
          ctaText: 'Débloquer l\'accès complet (24,90 €)',
        };
      default:
        return {
          title: 'Contenu réservé aux membres payants',
          message: 'Débloquez l\'accès complet à vie à Baby Swim Vision pour 24,90 € pour accéder à l\'ensemble des contenus et fonctionnalités.',
          ctaText: 'Débloquer l\'accès complet (24,90 €)',
        };
    }
  }
}

export const accessControlService = new AccessControlService();
