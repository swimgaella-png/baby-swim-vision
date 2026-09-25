export interface InterfaceSettings {
  announcementText: string;
  showAnnouncement: boolean;
  facebookGroupUrl: string;
  facebookGroupName: string;
  supportEmail: string;
  customHeaderTitle: string;
  customTagline: string;
  vipPromoBannerActive: boolean;
  // Hero texts
  heroBadgeText: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroCtaText: string;
  // Features titles
  feature1Title: string;
  feature1Desc: string;
  feature2Title: string;
  feature2Desc: string;
  feature3Title: string;
  feature3Desc: string;
  feature4Title: string;
  feature4Desc: string;
  // Custom hero image
  heroImageUrl?: string;
  // Compatibility aliases
  heroTitle?: string;
  heroSubtitle?: string;
  heroDescription?: string;
  brandName?: string;
}

const STORAGE_KEY_SETTINGS = 'bsv_interface_settings';

export const DEFAULT_SETTINGS: InterfaceSettings = {
  announcementText: 'Offre de lancement : 1 mois offert avec le code VIPGLG25 (réservé aux 25 premiers) !',
  showAnnouncement: true,
  facebookGroupUrl: 'https://www.facebook.com/groups/232584653458212',
  facebookGroupName: 'Groupe d\'entraide Bébés Nageurs',
  supportEmail: 'swimgaella@gmail.com',
  customHeaderTitle: 'Baby Swim Vision',
  customTagline: 'L\'Assistant Pédagogique Aquatique pour Parents & Éducateurs',
  vipPromoBannerActive: true,
  heroBadgeText: "Application Pédagogique d'Analyse Aquatique Bébé",
  heroHeadline: "Accompagnez l'éveil aquatique de votre bébé avec précision et sérénité",
  heroSubheadline: "Baby Swim Vision analyse vos vidéos aquatiques pour perfectionner vos prises, encourager l'autonomie motrice de votre enfant et faire de chaque baignade un moment de complicité sécurisé.",
  heroCtaText: "Obtenir Baby Swim Vision — 24,90 € à vie",
  feature1Title: "Analyse Vidéo Intelligente",
  feature1Desc: "Analyse en quelques secondes l'équilibre, l'horizontalité, les réflexes et la qualité des soutiens des parents (vidéos de 1 min max).",
  feature2Title: "Bibliothèque Pédagogique",
  feature2Desc: "Fiches d'exercices pas-à-pas, erreurs courantes à éviter, infographie détaillée de la 1ère immersion en 7 secondes et articles certifiés.",
  feature3Title: "Grille de Compétences",
  feature3Desc: "Matrice complète des 4 paliers d'autonomie (Découverte, Confiance, Autonomie, Exploration) pour mesurer l'éveil sans compétition.",
  feature4Title: "Journal de Séances Multi-Bébés",
  feature4Desc: "Historique visuel complet des progrès, notes personnalisées et suivi individualisé pour un ou plusieurs enfants.",
};

class InterfaceSettingsService {
  private settings: InterfaceSettings;
  private listeners: Array<(s: InterfaceSettings) => void> = [];

  constructor() {
    this.settings = this.loadSettings();
    this.fetchFromServer();
  }

  private async fetchFromServer(): Promise<void> {
    try {
      const res = await fetch('/api/cms/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          this.settings = { ...this.settings, ...data.settings };
          try {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
          } catch {}
          this.notify();
        }
      }
    } catch {
      // offline fallback
    }
  }

  private loadSettings(): InterfaceSettings {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (stored) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  }

  public getSettings(): InterfaceSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<InterfaceSettings>): InterfaceSettings {
    this.settings = { ...this.settings, ...updates };
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(this.settings));
    } catch (err) {
      console.warn('Could not save settings to localStorage:', err);
    }
    this.notify();

    fetch('/api/cms/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.settings),
    }).catch(() => {});

    return this.settings;
  }

  public resetSettings(): InterfaceSettings {
    this.settings = { ...DEFAULT_SETTINGS };
    try {
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
    } catch {
      // ignore
    }
    this.notify();

    fetch('/api/cms/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(this.settings),
    }).catch(() => {});

    return this.settings;
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.settings));
  }

  public subscribe(listener: (s: InterfaceSettings) => void) {
    this.listeners.push(listener);
    listener(this.settings);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }
}

export const interfaceSettingsService = new InterfaceSettingsService();
