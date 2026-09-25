export type SkillStatus = 'non_observe' | 'en_decouverte' | 'en_progression' | 'acquis';

export type MovementPrimaryCategory =
  | 'portage_vertical'
  | 'bebe_dans_les_bras'
  | 'lacher_apres_horizontal'
  | 'lacher_depuis_vertical'
  | 'glisse_horizontale'
  | 'situation_indeterminee';

export type GlideOriginType =
  | 'depart_assis'
  | 'depart_face_a_face'
  | 'depart_depuis_bras'
  | 'aucun';

export type AutonomyLevel =
  | '100% accompagné'
  | 'Partiellement accompagné'
  | 'Autonome'
  | 'Non déterminé';

export type InitialPositionType =
  | 'ASSIS'
  | 'DANS_LES_BRAS'
  | 'PORTAGE_VERTICAL'
  | 'PORTAGE_HORIZONTAL'
  | 'SUR_LE_VENTRE'
  | 'SUR_LE_DOS'
  | 'FACE_AU_PARENT'
  | 'DOS_AU_PARENT'
  | 'AUTRE'
  | 'INDETERMINE';

export type DepartureType =
  | 'DEPART_ASSIS'
  | 'DEPART_FACE_A_FACE'
  | 'DEPART_DEPUIS_BRAS'
  | 'DEPART_PORTAGE_VERTICAL'
  | 'AUTRE'
  | 'INDETERMINE';

export interface ChronologyStep {
  stepIndex: number;
  phase: 'position_initiale' | 'action_parent' | 'changement_position' | 'lacher' | 'deplacement' | 'fin_mouvement';
  title: string;
  description: string;
  babyOrientation?: 'verticale' | 'horizontale' | 'semi_verticale' | 'assise' | 'dorsale' | 'inclinee';
  parentContact?: 'continu' | 'diminution' | 'aucun' | 'maintien_ferme' | 'mains_souples' | 'guide';
  timecode?: string;
}

export interface MovementClassification {
  primaryCategory: MovementPrimaryCategory;
  classificationLabel: string;
  sequenceSummary: string;
  glideOrigin?: GlideOriginType;
  glideOriginLabel?: string;
  autonomyLevel: AutonomyLevel;
  glideDurationSeconds?: number | null;
  isRealGlide: boolean;
  wasHorizontalizedBeforeRelease?: boolean;
  
  // Strict Video Observation Fields (Step-by-step sequence reconstruction)
  initialPosition?: InitialPositionType;
  initialPositionLabel?: string;
  departureType?: DepartureType;
  departureTypeLabel?: string;
  parentActionType?: string;
  hasRelease?: boolean;
  positionAtRelease?: 'HORIZONTALE' | 'VERTICALE' | 'OBLIQUE' | 'SANS_LACHER' | 'INDETERMINE';
  bodyOrientationType?: 'VENTRALE' | 'DORSALE' | 'VERTICALE' | 'OBLIQUE' | 'INDETERMINE';
  hasDisplacement?: boolean;
  displacementType?: 'GLISSE_HORIZONTALE' | 'GLISSE_VENTRALE' | 'GLISSE_DORSALE' | 'IMMERSION_VERTICALE' | 'DEPLACEMENT_GUIDE_PARENT' | 'AUCUN' | 'INDETERMINE';
  hasAutonomyAfterRelease?: boolean;
  structuredSequence?: string; // e.g. "ASSIS → DÉPART → HORIZONTALISATION → LÂCHER → GLISSE_VENTRALE"
  detectedExerciseTitle?: string; // e.g. "Départ assis suivi d'une glisse horizontale ventrale"
  whatWorksWell?: string[]; // Strictly observed positive facts
  toImprove?: string[]; // Strictly observed corrections
  confidenceBreakdown?: {
    overall?: number;
    initialPosition?: number;
    departureType?: number;
    horizontalGlide?: number;
    ventralOrientation?: number;
    release?: number;
  };

  chronology: ChronologyStep[];
  bodyAnalysis: {
    orientation: 'verticale' | 'horizontale' | 'semi_verticale' | 'assise' | 'dorsale' | 'inclinee';
    inclinationDetails?: string;
    headAndFace: string;
    trunkPosition: string;
    limbsAction: string;
    parentContactDetails: string;
    babyParentDistance: string;
  };
  pedagogicalDiagnostic: string;
  pedagogicalAlert?: string;
  uncertaintyReason?: string;
}

export type UserRole = 'USER_FREE' | 'USER_PREMIUM' | 'ADMIN' | 'parent' | 'professional';

export type SubscriptionStatus = 'free' | 'active' | 'expired' | 'cancelled' | 'grace_period' | 'pending' | 'vip_trial';

export type SimulatedRole = 'USER_FREE' | 'USER_PREMIUM' | null;

export type FeatureKey =
  | 'FEATURE_ARTICLE_READ'
  | 'FEATURE_EXERCISE_DETAIL'
  | 'FEATURE_BABY_CREATE'
  | 'FEATURE_BABY_EDIT'
  | 'FEATURE_BABY_DELETE'
  | 'FEATURE_VIDEO_ANALYSIS'
  | 'FEATURE_SESSION_HISTORY_DETAIL'
  | 'FEATURE_SKILLS_MATRIX_DETAIL'
  | 'FEATURE_DRY_DROWNING_FACTSHEET'
  | 'FEATURE_ADMIN_TOOLS';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  subscriptionStatus?: SubscriptionStatus;
  subscriptionExpiresAt?: string;
  simulatedRole?: SimulatedRole;
  createdAt: string;
  consentAccepted?: boolean;
  lifetimeAccess?: boolean;
  purchasedAt?: string;
  orderId?: string;
  paymentReceipt?: string;
  paymentMethod?: string;
  amountPaidEur?: number;
  promoCodeApplied?: string;
  promoPlan?: 'vip_1month_free' | 'discount_5eur' | string;
}

export type UserProfile = User;

export interface BabyProfile {
  id: string;
  userId: string;
  name: string;
  birthDate: string; // YYYY-MM-DD
  ageMonths: number;
  ageWeeks: number;
  level: 'decouverte' | 'confiance' | 'autonomie' | 'exploration';
  startDate: string; // YYYY-MM-DD
  goals: string[];
  hideNameInAnalysis: boolean;
  avatarUrl?: string; // Emoji avatar or icon
  avatarType?: 'avatar' | 'photo';
  photoUrl?: string; // Data URL or Image URL
  weightKg?: number;
  heightCm?: number;
  waterComfortLevel?: 'tres_a_l_aise' | 'curieux_calme' | 'prudent_hesitant' | 'apprehensif';
  thermalComfort?: 'tres_frileux' | 'standard_32c' | 'tres_a_l_aise';
  specialNotes?: string;
  favoriteToyOrCue?: string;
}

export interface SituationDefinition {
  id: string;
  category: 'equilibre' | 'portage' | 'immersion' | 'deplacements' | 'respiration' | 'entree_eau' | 'interaction' | 'flottaison' | 'decouverte_eau';
  title: string;
  description: string;
  iconName: string;
  observationCriteria: string[];
  recommendedAgeRange: string;
}

export interface ExerciseItem {
  id: string;
  title: string;
  objective: string;
  level: 'decouverte' | 'confiance' | 'autonomie' | 'exploration';
  recommendedAge: string;
  situationCategory: string;

  // 🔒 Admin Image Locking & Distinction System
  image?: string;
  imageDefault?: string;
  imageAdmin?: string;
  imageSource?: 'default' | 'admin';
  mediaId?: string;
  storagePath?: string;
  downloadUrl?: string;
  imageAdminUpdatedAt?: string;
  imageAdminUpdatedBy?: string;
  isLockedByAdmin?: boolean;

  imageCaption?: string;
  steps: string[];
  commonMistakes: string[];
  corrections: string[];
  safetyTips: string[];
  duration: string;
  repetition?: string;
  tags: string[];
  evolutionGuide?: {
    title: string;
    whyRefusalAt7Months: string;
    howToMakeActive: string;
    eyeContactTip: string;
    developmentalStages: string[];
    quotes?: string[];
  };
  boatGame?: {
    title: string;
    phrases: string[];
  };
}

export interface CorrectionItem {
  id: string;
  situationId: string;
  observedIssue: string;
  possibleCauses: string[];
  pedagogicalCorrection: string;
  suggestedExerciseId: string;
  biomechanicalTips: {
    parentHands: string;
    babySpineAlignment: string;
    waterDepth: string;
    headPosition: string;
  };
}

export interface ImmersionTimelineStep {
  second: string;
  title: string;
  action: string;
  iconType: 'surface' | 'prepare' | 'entry' | 'submerged' | 'deep' | 'stable' | 'ascend' | 'exit';
  detail: string;
  depthLevel?: 'surface' | 'transition' | 'underwater';
}

export interface AdminLockedMediaRecord {
  mediaId: string;
  targetType: 'article' | 'exercise' | 'settings' | 'hero';
  targetId: string;
  storagePath: string;
  downloadUrl: string;
  source: 'admin';
  updatedAt: string;
  updatedBy: string;
  imageCaption?: string;
}

export interface PedagogicalArticle {
  id: string;
  slug: string;
  title: string;
  category: 'safety' | 'psychomotor' | 'physiology' | 'parenting';
  categoryLabel: string;
  readingTime: string;
  icon: string;
  badge: string;
  summary: string;
  featured?: boolean;
  publishedDate?: string;
  author?: string;
  tags: string[];

  // 🔒 Admin Image Locking & Distinction System
  image?: string;
  imageDefault?: string;
  imageAdmin?: string;
  imageSource?: 'default' | 'admin';
  mediaId?: string;
  storagePath?: string;
  downloadUrl?: string;
  imageAdminUpdatedAt?: string;
  imageAdminUpdatedBy?: string;
  isLockedByAdmin?: boolean;

  imageCaption?: string;
  goldenRule?: string;
  timelineSteps?: ImmersionTimelineStep[];
  content?: {
    introduction: string;
    sections: {
      title: string;
      icon?: string;
      paragraphs: string[];
      keyPoints?: string[];
      warning?: string;
    }[];
    takeaways: string[];
    sources?: string[];
  };
}

export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  icon?: string;
  badge?: string;
  ageRange?: string;
  keyPrinciple?: string;
  skills: SkillItem[];
}

export interface SkillItem {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  observationChecklist: string[];
  ageRange?: string;
  level?: 'decouverte' | 'confiance' | 'autonomie' | 'exploration';
  keyAdvice?: string;
  relatedExerciseId?: string;
  relatedArticleId?: string;
}

export interface ObservedSkill {
  categoryId: string;
  categoryName: string;
  skillName: string;
  status: SkillStatus;
  note: string;
}

export interface AnalysisResult {
  id: string;
  sessionId: string;
  babyId: string;
  createdAt: string;
  isDemo: boolean;
  provider: string;
  confidence: number;
  situation: string;
  situationKey: string;
  positive_points: string[];
  observations: string[];
  priority: string;
  main_recommendation: string;
  secondary_recommendations?: string[];
  safety_notes: string[];
  recommended_exercise: ExerciseItem;
  skills_observed: ObservedSkill[];
  movementAnalysis?: MovementClassification;
  posture?: {
    orientation: 'verticale' | 'horizontale' | 'semi_verticale';
    targetOrientation: 'verticale' | 'horizontale';
    correction: string;
    parentHoldType?: string;
    babyRelaxationScore?: number;
  };
  biomechanics?: {
    orientation?: 'verticale' | 'horizontale' | 'semi_verticale';
    targetOrientation?: 'verticale' | 'horizontale';
    correction?: string;
    parentHoldType?: string;
    babyRelaxationScore?: number;
    observedAngle?: number;
    targetAngle?: number;
  };
}

export interface SessionRecord {
  id: string;
  userId: string;
  babyId: string;
  date: string;
  title: string;
  videoUrl?: string;
  videoThumbnail?: string;
  videoDurationSeconds: number;
  videoSizeMB: number;
  situationKey: string;
  situationTitle: string;
  analysis: AnalysisResult;
  notes?: string;
}

export interface BabyProgressSummary {
  babyId: string;
  totalSessions: number;
  lastSessionDate?: string;
  skillsStatus: Record<string, SkillStatus>; // skillId or categoryId -> status
  categoryProgress: Record<string, {
    total: number;
    acquis: number;
    en_progression: number;
    en_decouverte: number;
    non_observe: number;
  }>;
}

export type ClubStatus = 'pending' | 'validated' | 'rejected' | 'inactive';

export interface ClubPoolInfo {
  waterTemperatureC?: number;
  poolType?: string; // ex: 'Bassin d'apprentissage chauffé', 'Piscine municipale', 'Bassin privé'
  hygieneNotes?: string;
}

export interface Club {
  id: string;
  name: string;
  managerName?: string;
  description: string;
  country: string;
  region?: string;
  city: string;
  postalCode?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  bookingUrl?: string;
  socialNetworks?: {
    facebook?: string;
    instagram?: string;
  };
  languages: string[];
  activities: string[];
  minAgeMonths: number;
  maxAgeMonths: number;
  groupType?: 'collectif' | 'individuel' | 'mixte';
  accessibility?: boolean;
  accessibilityDetails?: string;
  team?: string;
  qualifications?: string;
  poolInformation?: ClubPoolInfo;
  logo?: string;
  photos?: string[];
  status: ClubStatus;
  isRecommended?: boolean;
  isAnchored?: boolean;
  createdByAdmin?: boolean;
  adminModified?: boolean;
  isLockedByAdmin?: boolean;
  rejectionReason?: string;
  submittedAt: string;
  createdAt?: string;
  validatedAt?: string;
  updatedAt: string;
  consentVerified?: boolean;
  consentPublish?: boolean;
  distanceKm?: number; // Calculated on client for location-based search
}

export interface ClubSubmissionForm {
  name: string;
  managerName: string;
  email: string;
  phone: string;
  website: string;
  bookingUrl?: string;
  socialFacebook?: string;
  socialInstagram?: string;
  address: string;
  postalCode: string;
  city: string;
  region: string;
  country: string;
  latitude?: number;
  longitude?: number;
  description: string;
  activities: string[];
  minAgeMonths: number;
  maxAgeMonths: number;
  languages: string[];
  groupType: 'collectif' | 'individuel' | 'mixte';
  team: string;
  qualifications: string;
  waterTemperatureC?: number;
  poolType?: string;
  accessibility: boolean;
  accessibilityDetails?: string;
  logo?: string;
  photos: string[];
  consentVerified: boolean;
  consentPublish: boolean;
}

export interface DuplicateCheckResult {
  hasPotentialDuplicate: boolean;
  matchedClubs: Array<{
    id: string;
    name: string;
    city: string;
    address: string;
    similarityReason: string;
    status: ClubStatus;
  }>;
}

export interface ClubSubmissionNotification {
  id: string;
  clubId: string;
  clubName: string;
  managerName?: string;
  city: string;
  country: string;
  email?: string;
  phone?: string;
  submittedAt: string;
  sentTo: string;
  status: 'sent' | 'logged' | 'pending';
  detailsSummary?: string;
}

export interface VideoMetadata {
  format: string; // e.g. "MP4", "MOV", "MKV", "AVI", "WMV", "WebM", "3GP", "MPEG", "M4V", etc.
  codec: string; // e.g. "H.264 / AVC", "HEVC / H.265", "VP9", "VP8", "AV1", "MPEG-4", "WMV2", etc.
  width: number;
  height: number;
  aspectRatio: string;
  orientation: 'portrait' | 'landscape' | 'square';
  fps: number;
  durationSeconds: number;
  sizeMB: number;
  wasConverted: boolean;
  originalFormat?: string;
  originalCodec?: string;
}

export interface DemoVideoItem {
  id: string;
  title: string;
  description: string;
  pedagogicalExplanation: string;
  category: string; // IMMERSION, PORTAGE, FLOTTAISON, PROPULSION, ÉQUILIBRE, DÉCOUVERTE, etc.
  videoFileName: string; // e.g. "immersion-01.mp4"
  videoUrl: string; // e.g. "/media/videos/immersion-01.mp4"
  recommendedAge?: string; // e.g. "4-12 mois"
  skills?: string[]; // e.g. ["Immersion progressive", "Position stable"]
  order: number;
  visible: boolean;
  videoDuration?: number; // seconds
  videoSizeMB?: number;
  situationKey?: string;
  exerciseId?: string;
  thumbnailUrl?: string;
  fileExists?: boolean; // Evaluated server-side or in runtime
  isPermanentAdminVideo?: boolean; // True for permanent administrator videos
  source?: 'admin' | 'system'; // 'admin' takes absolute priority over 'system'
  createdAt?: string;
  updatedAt?: string;
}

export interface VideoIngestionResult {
  videoBlob: Blob | File;
  videoUrl: string;
  metadata: VideoMetadata;
  name: string;
  thumbnailUrl?: string;
  situationKey?: string;
  demoScenarioId?: string;
  demoVideo?: DemoVideoItem;
}

