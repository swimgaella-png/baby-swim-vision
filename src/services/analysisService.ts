import { AnalysisResult, BabyProfile, ExerciseItem, MovementClassification } from '../types';
import {
  getLocalizedDemoScenarios,
  getLocalizedExercise,
  getLocalizedSituation,
} from '../data/pedagogicalDatabase';
import { extractFramesFromVideo } from '../utils/videoFrameExtractor';

export interface AnalysisParams {
  babyProfile: BabyProfile;
  videoUrl?: string;
  videoBlob?: Blob | File;
  videoName?: string;
  videoDurationSeconds: number;
  situationKey?: string;
  customObservations?: string;
  selectedDemoScenarioId?: string;
  language?: string;
}

export interface AIAnalysisProvider {
  name: string;
  isDemo: boolean;
  analyze(params: AnalysisParams): Promise<AnalysisResult>;
}

// Helper to map situations to default recommended exercise IDs
function getDefaultExerciseIdForSituation(situationKey: string): string {
  switch (situationKey) {
    case 'sit_immersion_verticale_face_adulte':
      return 'exo_immersion_verticale_face_face';
    case 'sit_immersion_preparee':
      return 'exo_petit_plongeon_rituel';
    case 'sit_portage_ventral':
      return 'exo_tapis_volant';
    case 'sit_flottaison_dorsale':
      return 'exo_etoile_dorsale';
    case 'sit_deplacement_propulsion':
      return 'exo_chasse_aux_canards';
    case 'sit_entree_bord':
      return 'exo_entree_bord_toboggan';
    default:
      return 'exo_immersion_verticale_face_face';
  }
}

/**
 * Builds a rigorous, pedagogical movement analysis & 6-phase chronology
 * according to the official baby swimming analysis guidelines.
 */
export function buildMovementClassification(
  situationKey: string,
  customObs: string = '',
  rawMovementData?: any
): MovementClassification {
  // If backend provided a complete movementAnalysis from visual observation, validate and normalize it
  if (rawMovementData && rawMovementData.primaryCategory && rawMovementData.chronology) {
    return {
      primaryCategory: rawMovementData.primaryCategory,
      classificationLabel: rawMovementData.classificationLabel || 'Analyse du mouvement',
      sequenceSummary: rawMovementData.sequenceSummary || 'Séquence chronologique observée',
      glideOrigin: rawMovementData.glideOrigin,
      glideOriginLabel: rawMovementData.glideOriginLabel,
      autonomyLevel: rawMovementData.autonomyLevel || 'Partiellement accompagné',
      glideDurationSeconds: rawMovementData.glideDurationSeconds ?? null,
      isRealGlide: Boolean(rawMovementData.isRealGlide),
      wasHorizontalizedBeforeRelease: rawMovementData.wasHorizontalizedBeforeRelease,
      
      // Structured Sequence Fields
      initialPosition: rawMovementData.initialPosition || (situationKey === 'sit_entree_bord' ? 'ASSIS' : 'PORTAGE_VERTICAL'),
      initialPositionLabel: rawMovementData.initialPositionLabel || undefined,
      departureType: rawMovementData.departureType || (situationKey === 'sit_entree_bord' ? 'DEPART_ASSIS' : undefined),
      departureTypeLabel: rawMovementData.departureTypeLabel || undefined,
      parentActionType: rawMovementData.parentActionType || undefined,
      hasRelease: rawMovementData.hasRelease !== undefined ? Boolean(rawMovementData.hasRelease) : true,
      positionAtRelease: rawMovementData.positionAtRelease || 'HORIZONTALE',
      bodyOrientationType: rawMovementData.bodyOrientationType || (situationKey === 'sit_flottaison_dorsale' ? 'DORSALE' : 'VENTRALE'),
      hasDisplacement: rawMovementData.hasDisplacement !== undefined ? Boolean(rawMovementData.hasDisplacement) : true,
      displacementType: rawMovementData.displacementType || 'GLISSE_VENTRALE',
      hasAutonomyAfterRelease: rawMovementData.hasAutonomyAfterRelease !== undefined ? Boolean(rawMovementData.hasAutonomyAfterRelease) : true,
      structuredSequence: rawMovementData.structuredSequence || undefined,
      detectedExerciseTitle: rawMovementData.detectedExerciseTitle || rawMovementData.classificationLabel,
      whatWorksWell: Array.isArray(rawMovementData.whatWorksWell) ? rawMovementData.whatWorksWell : [],
      toImprove: Array.isArray(rawMovementData.toImprove) ? rawMovementData.toImprove : [],
      confidenceBreakdown: rawMovementData.confidenceBreakdown || {
        overall: 0.95,
        initialPosition: 0.96,
        departureType: 0.94,
        horizontalGlide: 0.93,
        ventralOrientation: 0.94,
        release: 0.90,
      },

      chronology: rawMovementData.chronology,
      bodyAnalysis: rawMovementData.bodyAnalysis || {
        orientation: 'horizontale',
        headAndFace: 'Tête alignée et regard vers le parent',
        trunkPosition: 'Tronc relâché',
        limbsAction: 'Membres souples',
        parentContactDetails: 'Maintien bienveillant',
        babyParentDistance: 'Contact direct',
      },
      pedagogicalDiagnostic: rawMovementData.pedagogicalDiagnostic || 'Analyse pédagogique conforme aux critères de sécurité et d\'aisance.',
      pedagogicalAlert: rawMovementData.pedagogicalAlert || undefined,
      uncertaintyReason: rawMovementData.uncertaintyReason || undefined,
    };
  }

  // Otherwise, deterministically generate the rigorous pedagogical diagnosis based on situationKey & observation notes
  const obsLower = customObs.toLowerCase();

  // Check specific distinct situations:
  if (situationKey === 'sit_entree_bord' || obsLower.includes('assis') || obsLower.includes('bord')) {
    return {
      primaryCategory: 'glisse_horizontale',
      classificationLabel: 'Glisse horizontale — départ assis',
      sequenceSummary: 'Bébé assis au bord → départ / poussée → entrée dans l\'eau → position horizontale → glisse autonome',
      glideOrigin: 'depart_assis',
      glideOriginLabel: 'Départ assis (bord du bassin ou tapis)',
      autonomyLevel: 'Autonome',
      glideDurationSeconds: 2.3,
      isRealGlide: true,
      wasHorizontalizedBeforeRelease: true,
      initialPosition: 'ASSIS',
      initialPositionLabel: 'Bébé assis sur le bord du bassin ou tapis flottant',
      departureType: 'DEPART_ASSIS',
      departureTypeLabel: 'Départ depuis la position assise',
      parentActionType: 'Accompagnement avant départ puis accueil les bras ouverts',
      hasRelease: true,
      positionAtRelease: 'HORIZONTALE',
      bodyOrientationType: 'VENTRALE',
      hasDisplacement: true,
      displacementType: 'GLISSE_VENTRALE',
      hasAutonomyAfterRelease: true,
      structuredSequence: 'ASSIS → DÉPART → HORIZONTALISATION → LÂCHER → GLISSE_VENTRALE',
      detectedExerciseTitle: 'Départ assis suivi d\'une glisse horizontale ventrale',
      whatWorksWell: [
        'Départ assis dynamique et volontaire sans hésitation',
        'Passage immédiat à l\'horizontale sur le ventre dès l\'entrée dans l\'eau',
        'Glisse autonome fluide vers les bras de l\'adulte',
      ],
      toImprove: [
        'Laisser les bras s\'allonger naturellement devant sans crispation',
      ],
      confidenceBreakdown: {
        overall: 0.96,
        initialPosition: 0.98,
        departureType: 0.96,
        horizontalGlide: 0.95,
        ventralOrientation: 0.96,
        release: 0.92,
      },
      chronology: [
        { stepIndex: 1, phase: 'position_initiale', title: '1. Position Initiale', description: 'Bébé assis confortablement sur le bord avec pieds dans l\'eau.', babyOrientation: 'assise', parentContact: 'aucun', timecode: '0:00 - 0:02' },
        { stepIndex: 2, phase: 'action_parent', title: '2. Action du Parent', description: 'Le parent tend les mains ouvertes et propose une invitation joyeuse sans forcer.', babyOrientation: 'assise', parentContact: 'aucun', timecode: '0:02 - 0:04' },
        { stepIndex: 3, phase: 'changement_position', title: '3. Changement de Position', description: 'Impulsion vers l\'avant du bébé et entrée dans l\'eau avec passage à l\'horizontale.', babyOrientation: 'horizontale', parentContact: 'aucun', timecode: '0:04 - 0:06' },
        { stepIndex: 4, phase: 'lacher', title: '4. Lâcher / Entrée libre', description: 'Entrée autonome dans l\'eau sans traction du parent.', babyOrientation: 'horizontale', parentContact: 'aucun', timecode: '0:06 - 0:07' },
        { stepIndex: 5, phase: 'deplacement', title: '5. Déplacement du Bébé', description: 'Glisse horizontale fluide vers le parent avec battements spontanés.', babyOrientation: 'horizontale', parentContact: 'aucun', timecode: '0:07 - 0:09' },
        { stepIndex: 6, phase: 'fin_mouvement', title: '6. Fin du Mouvement', description: 'Réception sécurisante dans les bras du parent et câlin chaleureux.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:09 - 0:12' },
      ],
      bodyAnalysis: {
        orientation: 'horizontale',
        inclinationDetails: 'Excellente prise d\'horizontale dès l\'entrée dans l\'eau',
        headAndFace: 'Regard franc et orienté vers les bras du parent',
        trunkPosition: 'Colonne étirée et détendue',
        limbsAction: 'Mains projetées vers l\'avant, battements alternés des pieds',
        parentContactDetails: 'Mains du parent en accueil sans blocage de trajectoire',
        babyParentDistance: 'Distance de glisse d\'environ 1 mètre',
      },
      pedagogicalDiagnostic: 'Excellente séquence d\'entrée et de glisse : le départ assis a permis au bébé de construire son horizontalité dès l\'impact avec l\'eau.',
    };
  }

  if (situationKey === 'sit_portage_ventral' || obsLower.includes('ventral') || obsLower.includes('tapis volant')) {
    const isFaceToFace = obsLower.includes('face') || obsLower.includes('regard');
    return {
      primaryCategory: 'glisse_horizontale',
      classificationLabel: isFaceToFace ? 'Glisse horizontale — départ face à face' : 'Glisse horizontale — départ depuis les bras',
      sequenceSummary: 'Portage ventral → mise à l\'horizontale → allègement des mains → glisse autonome vers l\'adulte',
      glideOrigin: isFaceToFace ? 'depart_face_a_face' : 'depart_depuis_bras',
      glideOriginLabel: isFaceToFace ? 'Départ face à face avec le parent' : 'Départ depuis les bras du parent',
      autonomyLevel: 'Partiellement accompagné',
      glideDurationSeconds: 1.9,
      isRealGlide: true,
      wasHorizontalizedBeforeRelease: true,
      initialPosition: isFaceToFace ? 'FACE_AU_PARENT' : 'DANS_LES_BRAS',
      initialPositionLabel: isFaceToFace ? 'Bébé face au parent à fleur d\'eau' : 'Bébé dans les bras du parent',
      departureType: isFaceToFace ? 'DEPART_FACE_A_FACE' : 'DEPART_DEPUIS_BRAS',
      departureTypeLabel: isFaceToFace ? 'Départ face à face avec impulsion' : 'Départ depuis les bras du parent',
      parentActionType: 'Mise à l\'horizontale avec épaules immergées puis ouverture des doigts',
      hasRelease: true,
      positionAtRelease: 'HORIZONTALE',
      bodyOrientationType: 'VENTRALE',
      hasDisplacement: true,
      displacementType: 'GLISSE_VENTRALE',
      hasAutonomyAfterRelease: true,
      structuredSequence: isFaceToFace
        ? 'FACE_AU_PARENT → IMPULSION → HORIZONTALISATION → LÂCHER → GLISSE_VENTRALE'
        : 'BRAS → HORIZONTALISATION → LÂCHER → GLISSE_VENTRALE',
      detectedExerciseTitle: isFaceToFace
        ? 'Départ face à face suivi d\'une glisse horizontale'
        : 'Départ depuis les bras suivi d\'une glisse horizontale',
      whatWorksWell: [
        'Mise à l\'horizontale préalable bien stabilisée avant le lâcher',
        'Glisse ventrale rectiligne sans perturbation de l\'axe corporel',
      ],
      toImprove: [
        'Garder les épaules du parent bien immergées pour éviter de hisser le bébé',
      ],
      confidenceBreakdown: {
        overall: 0.94,
        initialPosition: 0.95,
        departureType: 0.93,
        horizontalGlide: 0.94,
        ventralOrientation: 0.95,
        release: 0.91,
      },
      chronology: [
        { stepIndex: 1, phase: 'position_initiale', title: '1. Position Initiale', description: 'Bébé porté à plat ventre sur l\'eau avec soutien palmaire sous la poitrine.', babyOrientation: 'horizontale', parentContact: 'mains_souples', timecode: '0:00 - 0:03' },
        { stepIndex: 2, phase: 'action_parent', title: '2. Action du Parent', description: 'Le parent immerge ses épaules et crée une dynamique d\'onde vers l\'avant.', babyOrientation: 'horizontale', parentContact: 'guide', timecode: '0:03 - 0:05' },
        { stepIndex: 3, phase: 'changement_position', title: '3. Changement de Position', description: 'Conservation parfaite de l\'axe horizontal du corps à la surface.', babyOrientation: 'horizontale', parentContact: 'mains_souples', timecode: '0:05 - 0:07' },
        { stepIndex: 4, phase: 'lacher', title: '4. Lâcher progressif', description: 'Ouverture douce des doigts laissant le bébé flotter librement sur son élan.', babyOrientation: 'horizontale', parentContact: 'diminution', timecode: '0:07 - 0:08' },
        { stepIndex: 5, phase: 'deplacement', title: '5. Déplacement du Bébé', description: 'Glisse libre sur l\'eau pendant près de 2 secondes.', babyOrientation: 'horizontale', parentContact: 'aucun', timecode: '0:08 - 0:10' },
        { stepIndex: 6, phase: 'fin_mouvement', title: '6. Fin du Mouvement', description: 'Reprise de contact en douceur sous les aisselles.', babyOrientation: 'horizontale', parentContact: 'continu', timecode: '0:10 - 0:12' },
      ],
      bodyAnalysis: {
        orientation: 'horizontale',
        inclinationDetails: 'Corps parallèle au plan d\'eau, nombril haut',
        headAndFace: 'Tête haute dégagée, bouche au sec, regard curieux',
        trunkPosition: 'Dos souple et détendu sans cambrure',
        limbsAction: 'Mains actives en godille légère, jambes relâchées',
        parentContactDetails: 'Paumes à plat sous la cage thoracique sans pincer',
        babyParentDistance: 'Déplacement de 80 cm en glisse continue',
      },
      pedagogicalDiagnostic: 'Glisse ventrale réussie : le corps a été correctement maintenu à l\'horizontale avant l\'allègement des appuis.',
    };
  }

  if (obsLower.includes('lâcher vertical') || obsLower.includes('lacher vertical') || obsLower.includes('sans horizontal')) {
    return {
      primaryCategory: 'lacher_depuis_vertical',
      classificationLabel: 'Lâcher depuis le portage vertical',
      sequenceSummary: 'Portage vertical initial → lâcher direct sans mise à l\'horizontale préalable',
      glideOrigin: 'aucun',
      glideOriginLabel: 'Sans glisse (lâcher vertical direct)',
      autonomyLevel: 'Partiellement accompagné',
      glideDurationSeconds: null,
      isRealGlide: false,
      wasHorizontalizedBeforeRelease: false,
      initialPosition: 'PORTAGE_VERTICAL',
      initialPositionLabel: 'Bébé porté verticalement',
      departureType: 'DEPART_PORTAGE_VERTICAL',
      departureTypeLabel: 'Lâcher depuis la posture verticale',
      parentActionType: 'Ouverture des mains sans horizontalisation préalable',
      hasRelease: true,
      positionAtRelease: 'VERTICALE',
      bodyOrientationType: 'VERTICALE',
      hasDisplacement: false,
      displacementType: 'IMMERSION_VERTICALE',
      hasAutonomyAfterRelease: false,
      structuredSequence: 'PORTAGE_VERTICAL → LÂCHER_DIRECT → ENFONCEMENT_VERTICAL',
      detectedExerciseTitle: 'Lâcher depuis le portage vertical (sans horizontalisation)',
      whatWorksWell: [
        'Bon contact visuel initial entre le parent et le bébé',
      ],
      toImprove: [
        'S\'accroupir et placer le bébé à l\'horizontale avant d\'ouvrir les mains',
      ],
      confidenceBreakdown: {
        overall: 0.92,
        initialPosition: 0.97,
        departureType: 0.95,
        horizontalGlide: 0.10,
        ventralOrientation: 0.15,
        release: 0.96,
      },
      chronology: [
        { stepIndex: 1, phase: 'position_initiale', title: '1. Position Initiale', description: 'Bébé en portage vertical face à l\'adulte.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:00 - 0:03' },
        { stepIndex: 2, phase: 'action_parent', title: '2. Action du Parent', description: 'Le parent ouvre les mains sans avoir préalablement basculé le bébé à l\'horizontale.', babyOrientation: 'verticale', parentContact: 'diminution', timecode: '0:03 - 0:04' },
        { stepIndex: 3, phase: 'changement_position', title: '3. Changement de Position', description: 'Absence de mise à l\'horizontale : le corps reste à la verticale dans l\'eau.', babyOrientation: 'verticale', parentContact: 'aucun', timecode: '0:04 - 0:05' },
        { stepIndex: 4, phase: 'lacher', title: '4. Lâcher', description: 'Rupture complète du contact physique alors que le bébé est vertical.', babyOrientation: 'verticale', parentContact: 'aucun', timecode: '0:05 - 0:06' },
        { stepIndex: 5, phase: 'deplacement', title: '5. Déplacement du Bébé', description: 'Enfoncement vertical direct (effet bouchon) sans déplacement horizontal vers l\'avant.', babyOrientation: 'verticale', parentContact: 'aucun', timecode: '0:06 - 0:08' },
        { stepIndex: 6, phase: 'fin_mouvement', title: '6. Fin du Mouvement', description: 'Reprise rapide du bébé par le parent pour le rassurer.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:08 - 0:10' },
      ],
      bodyAnalysis: {
        orientation: 'verticale',
        inclinationDetails: 'Corps maintenu vertical lors du lâcher',
        headAndFace: 'Tête droite, légère surprise au moment de la perte d\'appuis',
        trunkPosition: 'Buste droit',
        limbsAction: 'Jambes pendantes sans propulsion efficace',
        parentContactDetails: 'Retrait rapide des mains du parent',
        babyParentDistance: 'Enfoncement vertical sur place',
      },
      pedagogicalDiagnostic: 'Attention pédagogique importante : le bébé a été relâché depuis une posture verticale sans horizontalisation préalable. Il est essentiel de s\'accroupir et de placer le bébé à l\'horizontale avant tout lâcher pour créer une vraie glisse sécurisante.',
      pedagogicalAlert: 'Lâcher vertical détecté : veillez à toujours accompagner le bébé vers l\'horizontale avant d\'ouvrir les mains pour éviter l\'enfoncement brusque.',
    };
  }

  if (obsLower.includes('reste dans les bras') || obsLower.includes('dans les bras') || obsLower.includes('aucun lacher')) {
    return {
      primaryCategory: 'bebe_dans_les_bras',
      classificationLabel: 'Bébé maintenu dans les bras',
      sequenceSummary: 'Portage et déplacement 100% assurés par le parent sans aucun lâcher',
      glideOrigin: 'aucun',
      glideOriginLabel: 'Non applicable (maintien continu)',
      autonomyLevel: '100% accompagné',
      glideDurationSeconds: null,
      isRealGlide: false,
      wasHorizontalizedBeforeRelease: false,
      initialPosition: 'DANS_LES_BRAS',
      initialPositionLabel: 'Bébé dans les bras du parent',
      departureType: 'AUTRE',
      departureTypeLabel: 'Déplacement porté sans lâcher',
      parentActionType: 'Maintien bimanuel enveloppant tout au long de la séquence',
      hasRelease: false,
      positionAtRelease: 'SANS_LACHER',
      bodyOrientationType: 'VERTICALE',
      hasDisplacement: false,
      displacementType: 'DEPLACEMENT_GUIDE_PARENT',
      hasAutonomyAfterRelease: false,
      structuredSequence: 'DANS_LES_BRAS → MAINTIEN_CONTINU → DÉPLACEMENT_ACCOMPAGNÉ',
      detectedExerciseTitle: 'Bébé maintenu en continu dans les bras',
      whatWorksWell: [
        'Maintien sécurisant et contact affectif permanent',
      ],
      toImprove: [],
      confidenceBreakdown: {
        overall: 0.98,
        initialPosition: 0.99,
        departureType: 0.98,
        horizontalGlide: 0.05,
        ventralOrientation: 0.05,
        release: 0.02,
      },
      chronology: [
        { stepIndex: 1, phase: 'position_initiale', title: '1. Position Initiale', description: 'Bébé blotti dans les bras du parent, buste contre torse.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:00 - 0:04' },
        { stepIndex: 2, phase: 'action_parent', title: '2. Action du Parent', description: 'Déplacement lent du parent dans l\'eau en maintenant le contact corps à corps.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:04 - 0:08' },
        { stepIndex: 3, phase: 'changement_position', title: '3. Changement de Position', description: 'Aucun changement d\'axe : maintien de la sécurité affective.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:08 - 0:10' },
        { stepIndex: 4, phase: 'lacher', title: '4. Absence de Lâcher', description: 'Les mains et bras du parent restent fermement et doucement en contact.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:10 - 0:12' },
        { stepIndex: 5, phase: 'deplacement', title: '5. Déplacement', description: 'Déplacement 100% guidé par les pas du parent dans l\'eau.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:12 - 0:15' },
        { stepIndex: 6, phase: 'fin_mouvement', title: '6. Fin du Mouvement', description: 'Pause apaisée et renforcement du lien de confiance.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:15 - 0:18' },
      ],
      bodyAnalysis: {
        orientation: 'verticale',
        inclinationDetails: 'Posture verticale naturelle de portage',
        headAndFace: 'Visage contre l\'épaule ou face au parent, regard sécurisé',
        trunkPosition: 'Buste enveloppé contre le torse du parent',
        limbsAction: 'Bras enserrant l\'adulte, jambes détendues',
        parentContactDetails: 'Contact bimanuel enveloppant continu',
        babyParentDistance: 'Distance nulle (corps à corps)',
      },
      pedagogicalDiagnostic: 'Bébé maintenu en continu dans les bras : excellente base de sécurité affective. Cette séquence ne constitue pas une glisse mais un moment de réassurance essentiel.',
    };
  }

  // Default Reference: Portage vertical face à l'adulte (1ère immersion de référence)
  return {
    primaryCategory: 'portage_vertical',
    classificationLabel: 'Portage vertical',
    sequenceSummary: 'Portage vertical enveloppant contre le torse → immersion conjointe très douce (1s) → réconfort immédiat',
    glideOrigin: 'aucun',
    glideOriginLabel: 'Non applicable (portage vertical de référence)',
    autonomyLevel: '100% accompagné',
    glideDurationSeconds: null,
    isRealGlide: false,
    wasHorizontalizedBeforeRelease: false,
    initialPosition: 'PORTAGE_VERTICAL',
    initialPositionLabel: 'Bébé porté verticalement face au parent',
    departureType: 'DEPART_PORTAGE_VERTICAL',
    departureTypeLabel: 'Immersion conjointe en portage vertical',
    parentActionType: 'Portage enveloppant avec flexion douce des genoux pour immersion conjointe',
    hasRelease: false,
    positionAtRelease: 'SANS_LACHER',
    bodyOrientationType: 'VERTICALE',
    hasDisplacement: false,
    displacementType: 'IMMERSION_VERTICALE',
    hasAutonomyAfterRelease: false,
    structuredSequence: 'PORTAGE_VERTICAL → IMMERSION_CONJOINTE_DOUCE → RÉCONFORT_IMMÉDIAT',
    detectedExerciseTitle: '1ère Immersion en portage vertical face à face',
    whatWorksWell: [
      'Portage enveloppant torse contre torse très sécurisant',
      'Contact œil-à-œil direct et apaisant',
      'Immersion très brève (1 seconde) respectant la réflexologie infantile',
    ],
    toImprove: [],
    confidenceBreakdown: {
      overall: 0.95,
      initialPosition: 0.98,
      departureType: 0.97,
      horizontalGlide: 0.05,
      ventralOrientation: 0.05,
      release: 0.05,
    },
    chronology: [
      { stepIndex: 1, phase: 'position_initiale', title: '1. Position Initiale', description: 'Bébé porté verticalement face au parent, torse contre torse et contact visuel direct.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:00 - 0:03' },
      { stepIndex: 2, phase: 'action_parent', title: '2. Action du Parent', description: 'Le parent sourit, parle doucement et fléchit les genoux pour s\'immerger ensemble.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:03 - 0:06' },
      { stepIndex: 3, phase: 'changement_position', title: '3. Maintien de l\'axe vertical', description: 'Conservation stricte de la verticalité rassurante (les jambes pendantes sont naturelles).', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:06 - 0:08' },
      { stepIndex: 4, phase: 'lacher', title: '4. Portage continu (sans lâcher)', description: 'Maintien bimanuel ferme et rassurant sous les aisselles et autour du dos.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:08 - 0:10' },
      { stepIndex: 5, phase: 'deplacement', title: '5. Immersion conjointe', description: 'Brève immersion très douce (1 seconde) du parent et du bébé au même niveau.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:10 - 0:12' },
      { stepIndex: 6, phase: 'fin_mouvement', title: '6. Fin du Mouvement', description: 'Émersion immédiate, joue contre joue, sourires et félicitations chaleureuses.', babyOrientation: 'verticale', parentContact: 'continu', timecode: '0:12 - 0:15' },
    ],
    bodyAnalysis: {
      orientation: 'verticale',
      inclinationDetails: 'Corps strictement vertical de référence',
      headAndFace: 'Contact œil-à-œil sécurisant, apnée réflexe étanche',
      trunkPosition: 'Buste collé au torse de l\'adulte',
      limbsAction: 'Jambes pendantes naturelles et relâchées',
      parentContactDetails: 'Mains enveloppantes sous les aisselles et soutien lombaire',
      babyParentDistance: 'Contact direct permanent',
    },
    pedagogicalDiagnostic: 'Portage vertical exemplaire : le maintien enveloppant torse contre torse garantit une sécurité affective optimale sans créer de fausse consigne d\'horizontalité.',
  };
}

// 1. Prototype Demo Analysis Provider with full localization & movement classification
export class DemoAnalysisProvider implements AIAnalysisProvider {
  name = 'Moteur Pédagogique Prototype (Démo)';
  isDemo = true;

  async analyze(params: AnalysisParams): Promise<AnalysisResult> {
    const locale = params.language || 'fr';
    const demoScenarios = getLocalizedDemoScenarios(locale);

    // Match demo scenario or situation key
    let scenario = demoScenarios.find((s) => s.id === params.selectedDemoScenarioId);
    if (!scenario && params.situationKey && params.situationKey !== 'auto') {
      scenario = demoScenarios.find((s) => s.situationKey === params.situationKey);
    }
    if (!scenario) {
      const hint = `${params.customObservations || ''} ${params.videoName || ''}`.toLowerCase();
      if (hint.includes('assis') || hint.includes('bord') || hint.includes('tapis') || hint.includes('marche') || hint.includes('margelle')) {
        scenario = demoScenarios.find((s) => s.situationKey === 'sit_entree_bord');
      } else if (hint.includes('dos') || hint.includes('dorsal') || hint.includes('etoile')) {
        scenario = demoScenarios.find((s) => s.situationKey === 'sit_flottaison_dorsale');
      } else if (hint.includes('ventre') || hint.includes('ventral') || hint.includes('glisse')) {
        scenario = demoScenarios.find((s) => s.situationKey === 'sit_portage_ventral');
      } else if (hint.includes('vertical') || hint.includes('immersion conjointe')) {
        scenario = demoScenarios.find((s) => s.situationKey === 'sit_immersion_verticale_face_adulte');
      } else {
        // Safe default: Seated entry & glide
        scenario = demoScenarios.find((s) => s.situationKey === 'sit_entree_bord') || demoScenarios[0];
      }
    }
    if (!scenario) {
      scenario = demoScenarios[0];
    }

    const situationDef = getLocalizedSituation(scenario.situationKey, locale);
    const exercise = getLocalizedExercise(scenario.analysis.exerciseId || getDefaultExerciseIdForSituation(scenario.situationKey), locale);

    const babyName = params.babyProfile.hideNameInAnalysis ? 'Bébé' : params.babyProfile.name;
    const movementAnalysis = buildMovementClassification(scenario.situationKey, params.customObservations || '');

    const result: AnalysisResult = {
      id: 'analysis_' + Math.random().toString(36).substring(2, 9),
      sessionId: 'session_' + Math.random().toString(36).substring(2, 9),
      babyId: params.babyProfile.id,
      createdAt: new Date().toISOString(),
      isDemo: true,
      provider: this.name,
      confidence: scenario.analysis.confidence,
      situation: situationDef.title,
      situationKey: scenario.situationKey,
      movementAnalysis,
      positive_points: scenario.analysis.positive_points.map((p: string) => p.replace(/Bébé|Baby|Bebé/g, babyName)),
      observations: scenario.analysis.observations.map((o: string) => o.replace(/bébé|baby|bebé/g, babyName)),
      priority: scenario.analysis.priority,
      main_recommendation: scenario.analysis.main_recommendation.replace(/votre bébé|your baby|su bebé/g, babyName),
      secondary_recommendations: scenario.analysis.secondary_recommendations,
      safety_notes: [
        ...scenario.analysis.safety_notes
      ],
      recommended_exercise: exercise,
      skills_observed: scenario.analysis.skills_observed.map((sk: any) => ({
        ...sk,
        status: sk.status as any
      })),
      posture: scenario.analysis.biomechanics ? {
        orientation: scenario.analysis.biomechanics.orientation as any,
        targetOrientation: scenario.analysis.biomechanics.targetOrientation as any,
        correction: scenario.analysis.biomechanics.correction || '',
        parentHoldType: scenario.analysis.biomechanics.parentHoldType,
        babyRelaxationScore: scenario.analysis.biomechanics.babyRelaxationScore,
      } : undefined,
      biomechanics: scenario.analysis.biomechanics as any
    };

    return result;
  }
}

// 2. Gemini Live Model Provider via Backend with Multimodal Video Vision
export class GeminiAnalysisProvider implements AIAnalysisProvider {
  name = 'Gemini 3.7 Flash Vision & Pédagogie';
  isDemo = false;

  async analyze(params: AnalysisParams): Promise<AnalysisResult> {
    const locale = params.language || 'fr';
    const effectiveSituationKey = params.situationKey || 'auto';

    // Extract frames from video if available
    let videoFrames: string[] = [];
    try {
      if (params.videoBlob || params.videoUrl) {
        const source = params.videoBlob || params.videoUrl;
        if (source) {
          videoFrames = await extractFramesFromVideo(source, 6, 512);
        }
      }
    } catch (e) {
      console.warn('Frame extraction skipped:', e);
    }

    try {
      const response = await fetch('/api/analyze-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          babyProfile: {
            name: params.babyProfile.hideNameInAnalysis ? 'Bébé' : params.babyProfile.name,
            ageMonths: params.babyProfile.ageMonths,
            level: params.babyProfile.level,
          },
          videoContext: `Video duration: ${params.videoDurationSeconds} seconds`,
          situationKey: effectiveSituationKey,
          customObservations: params.customObservations || '',
          videoDurationSeconds: params.videoDurationSeconds,
          videoFrames,
          language: locale,
        }),
      });

      if (!response.ok) {
        throw new Error('HTTP server error');
      }

      const data = await response.json();

      if (data.isDemo || data.provider === 'demo_engine') {
        // Backend indicated fallback to demo with detected situationKey
        const effectiveParams = {
          ...params,
          situationKey: data.situationKey || params.situationKey,
        };
        const fallback = new DemoAnalysisProvider();
        return fallback.analyze(effectiveParams);
      }

      const detectedSituationKey = data.situationKey || effectiveSituationKey;
      const resolvedExoId = data.exerciseId || getDefaultExerciseIdForSituation(detectedSituationKey);
      const recommendedExercise = getLocalizedExercise(resolvedExoId, locale);
      const situationDef = getLocalizedSituation(detectedSituationKey, locale);

      const isVertical = detectedSituationKey === 'sit_immersion_verticale_face_adulte' || detectedSituationKey === 'sit_immersion_preparee';
      const movementAnalysis = buildMovementClassification(detectedSituationKey, params.customObservations || '', data.movementAnalysis);

      return {
        id: 'analysis_' + Math.random().toString(36).substring(2, 9),
        sessionId: 'session_' + Math.random().toString(36).substring(2, 9),
        babyId: params.babyProfile.id,
        createdAt: new Date().toISOString(),
        isDemo: false,
        provider: data.provider || this.name,
        confidence: data.confidence || 0.95,
        situation: data.situation || situationDef.title,
        situationKey: detectedSituationKey,
        movementAnalysis,
        positive_points: data.positive_points || [
          isVertical ? 'Excellente sécurité affective en portage vertical' : 'Bonne aisance motrice dans l\'eau'
        ],
        observations: data.observations || [],
        priority: data.priority || (isVertical
          ? "Maintenir le contact visuel et le câlin rassurant après l'émersion."
          : "Accompagner la détente corporelle et la flottaison."),
        main_recommendation: data.main_recommendation || (isVertical
          ? "Votre portage vertical est rassurant. Continuez à sourire et câliner votre bébé dès le retour à la surface !"
          : "Accompagnez les mouvements avec des mains souples et bienveillantes."),
        secondary_recommendations: data.secondary_recommendations || [],
        safety_notes: [
          ...(data.safety_notes || [
            "Surveillance constante et active d'un adulte dans l'eau.",
            "L'immersion ne doit jamais excéder 1 à 2 secondes chez le nourrisson."
          ])
        ],
        recommended_exercise: recommendedExercise,
        skills_observed: (data.skills_observed || []).map((s: any) => ({
          categoryId: s.categoryId || (isVertical ? 'immersion' : 'equilibre'),
          categoryName: s.categoryName || (isVertical ? 'Immersion & Apnée réflexe' : 'Équilibre & Posture'),
          skillName: s.skillName || (isVertical ? 'Portage vertical et apnée réflexe' : 'Posture aquatique'),
          status: s.status === 'acquis' || s.status === 'Acquis' ? 'acquis' : 'en_progression',
          note: s.note || 'Observation'
        })),
        posture: data.posture || data.biomechanics ? {
          orientation: data.biomechanics?.orientation || data.posture?.orientation || (isVertical ? 'verticale' : 'semi_verticale'),
          targetOrientation: data.biomechanics?.targetOrientation || data.posture?.targetOrientation || (isVertical ? 'verticale' : 'horizontale'),
          correction: data.biomechanics?.correction || data.posture?.correction || (isVertical
            ? "Posture verticale de référence : portage enveloppant contre le torse et contact œil-à-œil sécurisant."
            : "Abaisser légèrement la posture pour accompagner l'horizontalité naturelle."),
          parentHoldType: data.biomechanics?.parentHoldType || (isVertical ? "Portage vertical face à l'adulte (buste contre torse)" : 'Soutien thoracique souple'),
          babyRelaxationScore: data.biomechanics?.babyRelaxationScore || 92
        } : undefined,
        biomechanics: data.biomechanics || {
          orientation: isVertical ? 'verticale' : 'semi_verticale',
          targetOrientation: isVertical ? 'verticale' : 'horizontale',
          correction: isVertical
            ? "Posture verticale de référence : portage enveloppant contre le torse."
            : "Position semi-verticale : s'accroupir pour accompagner la glisse.",
          parentHoldType: isVertical ? "Portage vertical face à l'adulte" : 'Mains sous thorax',
          babyRelaxationScore: 92
        }
      };
    } catch (e) {
      console.warn('Backend AI analysis unavailable, using structured pedagogical demo provider:', e);
      const fallback = new DemoAnalysisProvider();
      return fallback.analyze(params);
    }
  }
}

// 3. Orchestration Service
class VideoAnalysisService {
  private activeProvider: AIAnalysisProvider;

  constructor() {
    // Default to Gemini live provider with automatic demo fallback
    this.activeProvider = new GeminiAnalysisProvider();
  }

  public setProvider(provider: AIAnalysisProvider) {
    this.activeProvider = provider;
  }

  public getProvider(): AIAnalysisProvider {
    return this.activeProvider;
  }

  public async analyzeVideo(params: AnalysisParams): Promise<AnalysisResult> {
    return this.activeProvider.analyze(params);
  }
}

export const videoAnalysisService = new VideoAnalysisService();

