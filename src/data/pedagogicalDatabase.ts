import { SituationDefinition, ExerciseItem, SkillCategory, CorrectionItem } from '../types';
import {
  getTranslatedCategoryByLocale,
  getTranslatedSituationByLocale,
  getTranslatedExerciseByLocale,
} from './pedagogicalTranslations';
import { zhDemoScenarios, jaDemoScenarios } from './pedagogicalTranslations/demoScenarios';

export interface LocalizedCategory {
  title: string;
  description: string;
  icon?: string;
  badge?: string;
  ageRange?: string;
  keyPrinciple?: string;
  skills: {
    id: string;
    name: string;
    description: string;
    observationChecklist: string[];
    ageRange?: string;
    level?: 'decouverte' | 'confiance' | 'autonomie' | 'exploration';
    keyAdvice?: string;
    relatedExerciseId?: string;
    relatedArticleId?: string;
  }[];
}

export interface LocalizedSituation {
  title: string;
  description: string;
  observationCriteria: string[];
  recommendedAgeRange: string;
}

export interface LocalizedExercise {
  title: string;
  objective: string;
  recommendedAge: string;
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

export interface LocalizedDemoScenario {
  title: string;
  analysis: {
    situation: string;
    positive_points: string[];
    observations: string[];
    priority: string;
    main_recommendation: string;
    secondary_recommendations: string[];
    safety_notes: string[];
    skills_observed: {
      categoryId: string;
      categoryName: string;
      skillName: string;
      status: string;
      note: string;
    }[];
  };
}

// 1. Skill Categories with Multilingual Translations
export const SKILL_CATEGORIES_DATA: Record<string, { id: string; translations: Record<string, LocalizedCategory> }> = {
  decouverte_eau: {
    id: 'decouverte_eau',
    translations: {
      fr: {
        title: "Découverte & Adaptation Sensorielle",
        description: "Apprivoiser l'élément aquatique, sensations sur la peau, bruits, eau à 32°C et rituels doux.",
        icon: "🌊",
        badge: "Fondations Sensorielles",
        ageRange: "0 à 6 mois+",
        keyPrinciple: "Bain tiède à 32°C, rituels d'arrosage doux et respect du rythme d'adaptation individuel.",
        skills: [
          {
            id: 'sk_eau_contact',
            name: "Tolérance au contact de l'eau sur le visage",
            description: "Le bébé accepte quelques gouttes ou un filet d'eau sur le front sans crispation ni pleurs réflexes.",
            observationChecklist: ["Visage détendu et yeux ouverts", "Pas de pleurs réflexes", "Clignements de paupières naturels"],
            ageRange: "0 - 6 mois",
            level: "decouverte",
            keyAdvice: "Commencez dès le bain à la maison par de doux arrosages du front avec le creux de la main sans jamais surprendre bébé.",
            relatedArticleId: "preparation-bain-maison-eveil-aquatique"
          },
          {
            id: 'sk_eau_eclabousse',
            name: "Exploration tactile & jeux d'éclaboussures",
            description: "Frappe l'eau avec ses mains ou ses pieds avec enthousiasme et curiosité pour comprendre la matière.",
            observationChecklist: ["Regard concentré ou souriant", "Mouvements rythmés des mains et des pieds", "Production intentionnelle de remous"],
            ageRange: "4 - 12 mois",
            level: "decouverte",
            keyAdvice: "Laissez l'enfant créer ses propres éclaboussures pour qu'il appréhende la densité et la résistance du milieu aquatique.",
            relatedExerciseId: "exo_tapis_volant"
          },
          {
            id: 'sk_eau_thermique',
            name: "Confort thermique et vigilance sensorielle",
            description: "Maintien d'un tonus alerte et d'un teint rosé dans une eau chauffée à 32°C.",
            observationChecklist: ["Peau rose et chaude au toucher", "Absence de grelottement ou de lèvre bleutée", "Séance adaptée (20-30 min max)"],
            ageRange: "0 - 12 mois",
            level: "decouverte",
            keyAdvice: "Sortez immédiatement du bassin dès les premiers frissons. Privilégiez toujours une eau à 32°C minimum.",
            relatedArticleId: "bebe-nageur-guide-pratique-complet"
          }
        ]
      },
      en: {
        title: "Sensory Discovery & Adaptation",
        description: "Taming the aquatic environment, skin sensations, pool acoustics, 32°C water, and gentle rituals.",
        icon: "🌊",
        badge: "Sensory Foundations",
        ageRange: "0 to 6 months+",
        keyPrinciple: "Warm 32°C water, gentle trickling rituals, and respecting individual adjustment pacing.",
        skills: [
          {
            id: 'sk_eau_contact',
            name: "Face Water Contact Tolerance",
            description: "Baby accepts gentle water trickles on the forehead with calm facial expression and open eyes.",
            observationChecklist: ["Relaxed facial cues", "No reflex crying", "Natural eye blinks"],
            ageRange: "0 - 6 months",
            level: "decouverte",
            keyAdvice: "Start during home bath time with gentle cupped hand trickles over the forehead without sudden surprises.",
            relatedArticleId: "preparation-bain-maison-eveil-aquatique"
          },
          {
            id: 'sk_eau_eclabousse',
            name: "Tactile Exploration & Water Splashing",
            description: "Joyful exploration hitting water with hands or feet to understand water density and ripples.",
            observationChecklist: ["Attentive smiling eyes", "Rhythmic hand taps", "Intentional ripple production"],
            ageRange: "4 - 12 months",
            level: "decouverte",
            keyAdvice: "Allow baby to splash freely to feel buoyancy and water resistance.",
            relatedExerciseId: "exo_tapis_volant"
          },
          {
            id: 'sk_eau_thermique',
            name: "Thermal Comfort & Sensory Vigilance",
            description: "Maintaining pink skin tone and active engagement in water heated to 32°C (90°F).",
            observationChecklist: ["Warm pink skin", "Absence of shivering or blue lips", "Proper session length (20-30 min)"],
            ageRange: "0 - 12 months",
            level: "decouverte",
            keyAdvice: "Exit the pool at the first sign of shivering. Maintain water temperature at 32°C.",
            relatedArticleId: "bebe-nageur-guide-pratique-complet"
          }
        ]
      }
    }
  },
  equilibre: {
    id: 'equilibre',
    translations: {
      fr: {
        title: "Équilibre Postural & Poussée d'Archimède",
        description: "Stabilité du tronc, horizontalité ventrale naturelle et alignement strict tête-colonne sans cambrure.",
        icon: "⚖️",
        badge: "Motricité & Biomécanique",
        ageRange: "4 à 18 mois",
        keyPrinciple: "Horizontalité naturelle sans tension cervicale grâce au soutien allégé et à la flottabilité.",
        skills: [
          {
            id: 'sk_eq_horizontal_ventral',
            name: "Horizontalité en position ventrale",
            description: "Le bébé allonge son corps à la surface de l'eau plutôt que de s'asseoir ou se verticaliser prématurément.",
            observationChecklist: ["Hanches et fesses proches de la surface", "Jambes allongées et souples", "Tête dans le prolongement naturel du tronc"],
            ageRange: "4 - 12 mois",
            level: "decouverte",
            keyAdvice: "Soutenez délicatement sous le bassin ou le thorax pour guider l'allongement à plat sans entraver le pédalage.",
            relatedExerciseId: "exo_portage_ventral"
          },
          {
            id: 'sk_eq_relachement',
            name: "Relâchement musculaire global & portance",
            description: "Absence de raideur ou de cambrure dorsale : l'enfant laisse la poussée d'Archimède soutenir sa masse.",
            observationChecklist: ["Membres souples et déliés", "Poings ouverts sans crispation", "Respiration fluide et posée"],
            ageRange: "4 - 18 mois",
            level: "confiance",
            keyAdvice: "Préférez la frite souple aux brassards rigides pour préserver la liberté de posture axiale de l'enfant.",
            relatedArticleId: "bouees-brassards-materiel-flottaison-securite"
          },
          {
            id: 'sk_eq_rotation',
            name: "Équilibration et repères spatiaux",
            description: "Capacité à orienter son regard et stabiliser son tronc sans perte de repères.",
            observationChecklist: ["Recherche de repères visuels fixes", "Absence de tournoiement paniqué", "Alignement tête-cou préservé"],
            ageRange: "6 - 18 mois",
            level: "confiance",
            keyAdvice: "Si votre enfant commence à tourner sur lui-même, remontez-le calmement pour l'aider à refixer ses repères visuels.",
            relatedArticleId: "bebes-nageurs-pas-un-cours-7-commandements"
          }
        ]
      },
      en: {
        title: "Postural Balance & Archimedes Buoyancy",
        description: "Core stability, natural prone horizontality, and strict head-spine alignment without spinal arching.",
        icon: "⚖️",
        badge: "Biomechanics & Posture",
        ageRange: "4 to 18 months",
        keyPrinciple: "Natural prone horizontality without neck tension through lightened parental hold and buoyancy.",
        skills: [
          {
            id: 'sk_eq_horizontal_ventral',
            name: "Prone Horizontality",
            description: "Baby stretches body along the surface instead of prematurely sinking into a seated posture.",
            observationChecklist: ["Hips close to water surface", "Extended supple legs", "Natural head-spine alignment"],
            ageRange: "4 - 12 months",
            level: "decouverte",
            keyAdvice: "Gently support pelvis or chest to encourage a horizontal bodyline without hindering leg kicks.",
            relatedExerciseId: "exo_portage_ventral"
          },
          {
            id: 'sk_eq_relachement',
            name: "Overall Muscular Relaxation",
            description: "Absence of excessive stiffness or back arching as baby trusts the buoyant force of water.",
            observationChecklist: ["Supple relaxed limbs", "Open hands", "Smooth regular breathing"],
            ageRange: "4 - 18 months",
            level: "confiance",
            keyAdvice: "Prefer flexible foam noodles over bulky armbands to maintain posture freedom.",
            relatedArticleId: "bouees-brassards-materiel-flottaison-securite"
          }
        ]
      }
    }
  },
  flottaison: {
    id: 'flottaison',
    translations: {
      fr: {
        title: "Flottaison & Étoile de Mer",
        description: "Capacité à se laisser porter en décubitus dorsal, oreilles immergées et portance naturelle.",
        icon: "⭐",
        badge: "Aisance & Lâcher-prise",
        ageRange: "4 à 24 mois",
        keyPrinciple: "Oreilles dans l'eau, regard vers le ciel/parent et confiance absolue dans la poussée d'Archimède.",
        skills: [
          {
            id: 'sk_flot_dorsale',
            name: "Étoile de mer dorsale accompagnée",
            description: "Acceptation sereine de la position sur le dos avec les oreilles immergées et le bassin haut.",
            observationChecklist: ["Oreilles reposant dans l'eau", "Bassin maintenu proche de la surface", "Regard serein vers le haut", "Respiration ventrale libre"],
            ageRange: "4 - 18 mois",
            level: "confiance",
            keyAdvice: "Calibrez votre main sous la nuque et l'autre sous le sacrum. Chantez doucement pour maintenir le regard connecté.",
            relatedExerciseId: "exo_etoile_mer_dorsale",
            relatedArticleId: "etoile-de-mer-dorsale-flottaison-confiance"
          },
          {
            id: 'sk_flot_allegement',
            name: "Allègement du soutien parental (quelques doigts)",
            description: "Le parent réduit son appui à 2 ou 3 doigts sans que l'enfant ne coule ni ne panique.",
            observationChecklist: ["Corps flottant 3 à 5 secondes", "Bébé détendu et confiant", "Absence de bascule brusque"],
            ageRange: "6 - 24 mois",
            level: "confiance",
            keyAdvice: "Allégez progressivement votre prise sans retirer vos mains brusquement pour faire ressentir la portance de l'eau.",
            relatedExerciseId: "exo_etoile_mer_dorsale"
          }
        ]
      },
      en: {
        title: "Buoyancy & Starfish Float",
        description: "Resting peacefully in dorsal back float with submerged ears and natural buoyancy support.",
        icon: "⭐",
        badge: "Comfort & Relaxation",
        ageRange: "4 to 24 months",
        keyPrinciple: "Ears submerged, eyes upward toward parent, and complete trust in buoyant lift.",
        skills: [
          {
            id: 'sk_flot_dorsale',
            name: "Supported Starfish Back Float",
            description: "Peaceful acceptance of dorsal position with ears resting in water and elevated hips.",
            observationChecklist: ["Ears resting in water", "Elevated hips near surface", "Calm upward gaze", "Free diaphragmatic breathing"],
            ageRange: "4 - 18 months",
            level: "confiance",
            keyAdvice: "Cradle nape and sacrum with soft hands while maintaining soothing vocal contact.",
            relatedExerciseId: "exo_etoile_mer_dorsale",
            relatedArticleId: "etoile-de-mer-dorsale-flottaison-confiance"
          },
          {
            id: 'sk_flot_allegement',
            name: "Lightened Fingertip Support",
            description: "Parent reduces contact to a few fingertips while baby remains naturally afloat.",
            observationChecklist: ["Body floating for 3 to 5 seconds", "Baby confident and calm", "No sudden tipping"],
            ageRange: "6 - 24 months",
            level: "confiance",
            keyAdvice: "Lighten contact gently without abrupt withdrawal so baby feels the water cradling them.",
            relatedExerciseId: "exo_etoile_mer_dorsale"
          }
        ]
      }
    }
  },
  immersion: {
    id: 'immersion',
    translations: {
      fr: {
        title: "Immersion & Réflexe d'Apnée",
        description: "Descente tonique, remontée passive, prise tête-bassin, dédramatisation de la tasse et bébé acteur.",
        icon: "💧",
        badge: "Geste Clé & Sécurité",
        ageRange: "4 à 20 mois+",
        keyPrinciple: "Descente franche en courbe continue (~5s), remontée passive par flottaison, zéro immersion forcée.",
        skills: [
          {
            id: 'sk_im_signal',
            name: "Prise bimanuelle et rituel d'annonce",
            description: "Prise sécurisante tête-bassin maintenant l'axe droit (protège le nez) et rituel d'annonce anticipé.",
            observationChecklist: ["Prise occiput + bas du dos", "Alignement strict tête-cou-rachis", "Fermeture réflexe de la bouche"],
            ageRange: "4 - 18 mois",
            level: "confiance",
            keyAdvice: "Veillez à maintenir la tête bien droite dans l'axe du tronc pour empêcher l'eau de refluer dans les fosses nasales.",
            relatedArticleId: "le-grand-plongeon-premiere-immersion-mode-d-emploi"
          },
          {
            id: 'sk_im_descente_remontee',
            name: "Descente tonique et remontée passive",
            description: "Entrée franche en courbe continue déclenchant l'apnée, puis remontée portée par la poussée d'Archimède.",
            observationChecklist: ["Trajectoire fluide continue (environ 5s)", "Remontée portée par l'eau sans traction brusque", "Réflexe d'apnée net"],
            ageRange: "4 - 20 mois",
            level: "confiance",
            keyAdvice: "Pendant la remontée, ne lâchez jamais l'enfant mais allégez votre traction pour qu'il ressente la portance naturelle de l'eau.",
            relatedArticleId: "le-grand-plongeon-premiere-immersion-mode-d-emploi"
          },
          {
            id: 'sk_im_retour_surface',
            name: "Retour souriant & dédramatisation de la tasse",
            description: "Accueil chaleureux en surface par le regard et le sourire (« tchin-tchin ! ») en cas de gorgée avalée.",
            observationChecklist: ["Contact visuel immédiat avec le parent", "Apaisement rapide sans panique", "Dédramatisation de la petite gorgée"],
            ageRange: "4 - 24 mois",
            level: "confiance",
            keyAdvice: "Aucun bébé ne respire sous l'eau : une petite gorgée est anodine si vous gardez le sourire et un chaleureux « tchin-tchin ! ».",
            relatedArticleId: "noyade-seche-mythe-ou-realite-prevention"
          },
          {
            id: 'sk_im_initiative',
            name: "Immersion autonome initiée par l'enfant",
            description: "Bébé choisit de lui-même d'immerger son visage pour attraper un jouet coulant ou regarder sous l'eau.",
            observationChecklist: ["Volonté propre d'aller sous l'eau", "Ouverture des yeux sous l'eau", "Sourire et fierté en réapparaissant"],
            ageRange: "9 - 36 mois",
            level: "autonomie",
            keyAdvice: "Ne forcez jamais une immersion. L'enfant doit toujours rester le moteur et l'acteur principal de ses explorations.",
            relatedExerciseId: "exo_fusee_sous_marine",
            relatedArticleId: "bebes-nageurs-pas-un-cours-7-commandements"
          }
        ]
      },
      en: {
        title: "Submersion & Dive Reflex",
        description: "Dynamic descent, passive buoyancy ascent, nape-pelvis hold, normalizing swallowed water, baby-led curiosity.",
        icon: "💧",
        badge: "Core Technique & Trust",
        ageRange: "4 to 20 months+",
        keyPrinciple: "Smooth 5-second continuous descent, buoyant passive ascent, never forced.",
        skills: [
          {
            id: 'sk_im_signal',
            name: "Two-Hand Hold & Ritual Cue",
            description: "Secure head-to-pelvis support maintaining spine alignment to protect nasal passages with ritual cue.",
            observationChecklist: ["Nape and lower spine support", "Strict head-spine alignment", "Natural mouth closure reflex"],
            ageRange: "4 - 18 months",
            level: "confiance",
            keyAdvice: "Keep head aligned with the spine to protect nasal passages during water entry.",
            relatedArticleId: "the-big-dip-first-submersion-complete-practical-guide"
          },
          {
            id: 'sk_im_descente_remontee',
            name: "Dynamic Descent & Passive Ascent",
            description: "Confident continuous 5s descent triggering clean dive reflex, followed by buoyancy-driven ascent.",
            observationChecklist: ["Fluid continuous curve", "Buoyancy-powered ascent without jerking", "Clean dive reflex"],
            ageRange: "4 - 20 months",
            level: "confiance",
            keyAdvice: "During ascent, soften your upward pull so baby feels Archimedes' buoyancy lifting them.",
            relatedArticleId: "the-big-dip-first-submersion-complete-practical-guide"
          },
          {
            id: 'sk_im_retour_surface',
            name: "Calm Surface Return & Swallowed Water Normalization",
            description: "Reassuring eye contact and lighthearted smile if a small splash was swallowed.",
            observationChecklist: ["Immediate eye contact", "Rapid settling without caregiver alarm", "Lighthearted normalization"],
            ageRange: "4 - 24 months",
            level: "confiance",
            keyAdvice: "Normalize a swallowed splash with smiles and cuddles.",
            relatedArticleId: "noyade-seche-mythe-ou-realite-prevention"
          }
        ]
      }
    }
  },
  deplacements: {
    id: 'deplacements',
    translations: {
      fr: {
        title: "Propulsion & Nage du « Petit Chien »",
        description: "Mouvements propulsifs spontanés, battements partant des hanches et autonomie de déplacement vers le bord.",
        icon: "🏊",
        badge: "Autonomie Motrice",
        ageRange: "6 à 36 mois+",
        keyPrinciple: "Pédalage spontané issu des réflexes archaïques, nage instinctive du petit chien et autonomie vers 3 ans.",
        skills: [
          {
            id: 'sk_dep_battements',
            name: "Battements alternés fluides des jambes",
            description: "Mouvements propulsifs souples partant des hanches (précurseur de la marche terrestre).",
            observationChecklist: ["Genoux souples sans raideur", "Mouvement propulsif continu", "Remous visibles vers l'arrière"],
            ageRange: "6 - 18 mois",
            level: "confiance",
            keyAdvice: "Encouragez le pédalage spontané sans contraindre les jambes : ce travail renforce la motricité terrestre.",
            relatedExerciseId: "exo_fusee_ventrale"
          },
          {
            id: 'sk_dep_petit_chien',
            name: "Nage spontanée du « petit chien »",
            description: "Première coordination motrice instinctive bras-jambes pour se déplacer vers un tapis ou le parent.",
            observationChecklist: ["Pédalage coordonné bras et jambes", "Maintien de la tête pour s'orienter", "Déplacement volontaire ciblé"],
            ageRange: "12 - 36 mois",
            level: "autonomie",
            keyAdvice: "La première nage spontanée de bébé est le petit chien : valorisez cette étape clé sans chercher la brasse précoce.",
            relatedArticleId: "chaque-bebe-est-unique-dans-l-eau"
          },
          {
            id: 'sk_dep_autonomie_bord',
            name: "Propulsion autonome et rattrapage du bord",
            description: "Capacité à se déplacer sur 2 à 3 mètres, reprendre son souffle et s'agripper solidement au rebord.",
            observationChecklist: ["Déplacement autonome sur quelques mètres", "Préhension solide du rebord ou tapis", "Attente ou hissage sécurisé"],
            ageRange: "18 - 36 mois",
            level: "autonomie",
            keyAdvice: "Vers 3 ans, l'autonomie se manifeste par la capacité à flotter, respirer et rejoindre le bord du bassin en sécurité.",
            relatedExerciseId: "exo_parcours_tapis"
          }
        ]
      },
      en: {
        title: "Propulsion & 'Doggy Paddle' Kicks",
        description: "Spontaneous propulsive kicks, hip-driven leg coordination, and self-rescue displacement toward poolside.",
        icon: "🏊",
        badge: "Motor Autonomy",
        ageRange: "6 to 36 months+",
        keyPrinciple: "Spontaneous kicking, instinctive doggy paddle, and displacement autonomy around age 3.",
        skills: [
          {
            id: 'sk_dep_battements',
            name: "Alternating Fluid Leg Kicks",
            description: "Fluid propulsive motion originating from the hips (precursor to land walking).",
            observationChecklist: ["Supple knees", "Continuous propulsive kicking", "Visible backward ripples"],
            ageRange: "6 - 18 months",
            level: "confiance",
            keyAdvice: "Encourage spontaneous kicks without locking knees to boost overall coordination.",
            relatedExerciseId: "exo_fusee_ventrale"
          },
          {
            id: 'sk_dep_petit_chien',
            name: "Instinctive 'Doggy Paddle' Swim",
            description: "First instinctive whole-body coordination to travel toward floating mats or caregivers.",
            observationChecklist: ["Coordinated arm-leg paddling", "Oriented movement trajectory", "Head alignment for breath"],
            ageRange: "12 - 36 months",
            level: "autonomie",
            keyAdvice: "Baby's first natural stroke is the doggy paddle: celebrate this milestone without forcing formal strokes.",
            relatedArticleId: "chaque-bebe-est-unique-dans-l-eau"
          }
        ]
      }
    }
  },
  respiration: {
    id: 'respiration',
    translations: {
      fr: {
        title: "Respiration, Souffle & Émotion",
        description: "Contrôle respiratoire, soufflage de bulles dans l'eau et capacité d'apaisement rapide après stimulation.",
        icon: "🌬️",
        badge: "Contrôle & Sérénité",
        ageRange: "4 à 36 mois",
        keyPrinciple: "Expiration ludique à la surface et régulation émotionnelle apaisée dans les bras du parent.",
        skills: [
          {
            id: 'sk_resp_bulles',
            name: "Création de bulles avec la bouche",
            description: "Expiration volontaire à la surface de l'eau par jeu d'imitation.",
            observationChecklist: ["Lèvres au contact de l'eau", "Émission visible de bulles d'air", "Jeu rieur et répété"],
            ageRange: "6 - 24 mois",
            level: "confiance",
            keyAdvice: "Faites chanter l'eau en soufflant vous-même des bulles devant bébé pour susciter son imitation naturelle.",
            relatedExerciseId: "exo_bocal_poissons"
          },
          {
            id: 'sk_resp_calme',
            name: "Régulation émotionnelle et apaisement",
            description: "Capacité à retrouver un rythme respiratoire doux et posé après une surprise ou une émotion vive.",
            observationChecklist: ["Apaisement en moins de 10 secondes", "Rythme respiratoire régulier", "Restauration du contact visuel"],
            ageRange: "0 - 36 mois",
            level: "decouverte",
            keyAdvice: "Accueillez toute émotion avec calme et câlin : votre rythme cardiaque et votre voix posée calment immédiatement bébé.",
            relatedArticleId: "bebe-peur-eau-blocage-deculpabiliser"
          }
        ]
      },
      en: {
        title: "Breath Control & Bubble Blowing",
        description: "Respiratory rhythm, blowing surface bubbles, and quick emotional settling after pool play.",
        icon: "🌬️",
        badge: "Breath & Serenity",
        ageRange: "4 to 36 months",
        keyPrinciple: "Playful surface exhalation and calm emotional regulation in caregiver arms.",
        skills: [
          {
            id: 'sk_resp_bulles',
            name: "Surface Bubble Blowing",
            description: "Voluntary exhalation at water surface level through playful mimicry.",
            observationChecklist: ["Lips at water level", "Visible air bubbles", "Playful repeated game"],
            ageRange: "6 - 24 months",
            level: "confiance",
            keyAdvice: "Model bubble blowing playfully with your own mouth to spark natural mimicry.",
            relatedExerciseId: "exo_bocal_poissons"
          },
          {
            id: 'sk_resp_calme',
            name: "Emotional & Respiratory Self-Regulation",
            description: "Smooth recovery of relaxed breathing and calm demeanor after surprise or excitement.",
            observationChecklist: ["Fast settling within 10s", "Even breathing pattern", "Eye contact restored"],
            ageRange: "0 - 36 months",
            level: "decouverte",
            keyAdvice: "Welcome all emotions with a gentle chest cuddle : parental calm immediately soothes baby.",
            relatedArticleId: "bebe-peur-eau-blocage-deculpabiliser"
          }
        ]
      }
    }
  },
  entree_eau: {
    id: 'entree_eau',
    translations: {
      fr: {
        title: "Entrées dans l'eau, Sauts & Sorties",
        description: "Glissades assises, sauts guidés depuis le bord, toboggans et hissage autonome.",
        icon: "🧗",
        badge: "Audace & Motricité Globale",
        ageRange: "6 à 36 mois",
        keyPrinciple: "Franchissements progressifs, amortis bienveillants et apprentissage de la prise d'appui solide.",
        skills: [
          {
            id: 'sk_ent_assise',
            name: "Entrée douce assise depuis le bord",
            description: "Glisse dans les bras du parent sans bascule brutale de la tête ni choc.",
            observationChecklist: ["Mains stables sur le rebord ou cuisses", "Bascule contrôlée vers le parent", "Arrivée amortie dans l'eau"],
            ageRange: "6 - 18 mois",
            level: "decouverte",
            keyAdvice: "Positionnez bébé assis au bord face à vous et accompagnez sa glissade avec vos mains sous ses aisselles.",
            relatedExerciseId: "exo_plongeon_assis"
          },
          {
            id: 'sk_ent_saut_accompagne',
            name: "Saut d'élan guidé par le parent",
            description: "Impulsion volontaire des jambes depuis le bord ou un tapis flottant vers les bras ouverts du parent.",
            observationChecklist: ["Flexion active des genoux", "Impulsion franche vers l'avant", "Sourire ou concentration à l'arrivée"],
            ageRange: "9 - 36 mois",
            level: "confiance",
            keyAdvice: "Encouragez l'élan par un mot rituel (« 1, 2, 3... saute ! ») et amortissez largement la réception dans l'eau.",
            relatedExerciseId: "exo_toboggan_tapis"
          },
          {
            id: 'sk_ent_sortie',
            name: "Hissage actif et sortie autonome",
            description: "Capacité à poser ses paumes, ses coudes puis ses genoux pour grimper sur le tapis ou le bord.",
            observationChecklist: ["Prise d'appui ferme des deux mains", "Poussée des pieds et des jambes", "Hissage du buste hors de l'eau"],
            ageRange: "12 - 36 mois",
            level: "autonomie",
            keyAdvice: "Laissez bébé expérimenter la force nécessaire pour se hisser seul sur un tapis flottant.",
            relatedExerciseId: "exo_parcours_tapis"
          }
        ]
      },
      en: {
        title: "Entries, Jumps & Poolside Exits",
        description: "Seated slides, guided jumps from poolside, foam slides, and climbing onto mats.",
        icon: "🧗",
        badge: "Confidence & Exploration",
        ageRange: "6 to 36 months",
        keyPrinciple: "Progressive entries, cushioned landings, and learning firm handgrip support.",
        skills: [
          {
            id: 'sk_ent_assise',
            name: "Seated Poolside Slide Entry",
            description: "Gentle slide into parent's arms without head hyperextension or startle.",
            observationChecklist: ["Hands on poolside", "Controlled forward slide", "Cushioned arrival in water"],
            ageRange: "6 - 18 months",
            level: "decouverte",
            keyAdvice: "Place baby seated facing you and guide their gentle slide into your waiting hands.",
            relatedExerciseId: "exo_plongeon_assis"
          },
          {
            id: 'sk_ent_saut_accompagne',
            name: "Guided Poolside Jump",
            description: "Voluntary little leg jump into parent's open welcoming arms.",
            observationChecklist: ["Bent knees", "Positive forward leap", "Smiling proud landing"],
            ageRange: "9 - 36 months",
            level: "confiance",
            keyAdvice: "Use a cheerful countdown rhythm ('1, 2, 3... jump!') and cushion the entry deeply.",
            relatedExerciseId: "exo_toboggan_tapis"
          }
        ]
      }
    }
  },
  interaction: {
    id: 'interaction',
    translations: {
      fr: {
        title: "Sécurisation Affective & Regard Permanent",
        description: "Surveillance active à portée de main, regard affectif ininterrompu, rituels et respect du rythme.",
        icon: "❤️",
        badge: "Lien Parent-Bébé",
        ageRange: "Tous âges (0 - 36 mois)",
        keyPrinciple: "La règle d'or : regard permanent, zéro distraction, bienveillance et accueil des étapes d'hésitation.",
        skills: [
          {
            id: 'sk_int_regard',
            name: "Regard affectif permanent & ancre de sécurité",
            description: "Le bébé s'ancre dans le regard du parent pour valider sa sécurité et oser explorer.",
            observationChecklist: ["Contact visuel ininterrompu", "Sourires et mimiques partagés", "Surveillance active à portée de main immédiate"],
            ageRange: "Tous âges",
            level: "decouverte",
            keyAdvice: "La sécurité active est avant tout une présence attentive : vos yeux et votre sourire sont la première bouée de votre enfant.",
            relatedArticleId: "prevention-noyades-surveillance-active-regard-affectif"
          },
          {
            id: 'sk_int_phase_recul',
            name: "Accueil de la phase de recul vers 1 an",
            description: "Compréhension sans jugement de la peur normale liée à la verticalisation et à l'acquisition de la marche.",
            observationChecklist: ["Respect du refus sans culpabiliser", "Retour aux câlins et jeux de surface", "Poursuite du plaisir partagé"],
            ageRange: "10 - 18 mois",
            level: "confiance",
            keyAdvice: "Vers 1 an, l'acquisition de la marche terrestre crée souvent une phase d'hésitation dans l'eau : c'est un signe d'intelligence motrice, ne forcez jamais.",
            relatedArticleId: "bebe-peur-eau-blocage-deculpabiliser"
          },
          {
            id: 'sk_int_inclusion',
            name: "Motricité libre & écoute bienveillante",
            description: "Adaptation au rythme propre de chaque enfant (prématurité, handicap, timidité) dans la joie.",
            observationChecklist: ["Écoute des signaux corporels", "Rythme personnalisé respecté", "Complicité et plaisir de l'eau"],
            ageRange: "Tous âges",
            level: "decouverte",
            keyAdvice: "Chaque enfant est unique. L'eau libère le corps et offre une égalité sensorielle magique.",
            relatedArticleId: "bebe-handicap-eau-liberte-motrice-inclusion"
          }
        ]
      },
      en: {
        title: "Emotional Bonding & Active Supervision",
        description: "Active supervision within arm's reach, unbroken reassuring eye contact, and respecting developmental phases.",
        icon: "❤️",
        badge: "Parent-Child Connection",
        ageRange: "All Ages (0 - 36 months)",
        keyPrinciple: "The golden rule : unbroken visual connection, zero distraction, and gentle pace respect.",
        skills: [
          {
            id: 'sk_int_regard',
            name: "Reassuring Eye Contact & Active Supervision",
            description: "Baby anchors in caregiver's gaze to validate security before daring to explore.",
            observationChecklist: ["Unbroken eye contact", "Shared reassuring smiles", "Constant supervision within arm's reach"],
            ageRange: "All Ages",
            level: "decouverte",
            keyAdvice: "Active supervision is loving presence : your eyes and smiles are baby's primary emotional safety float.",
            relatedArticleId: "prevention-noyades-surveillance-active-regard-affectif"
          },
          {
            id: 'sk_int_phase_recul',
            name: "Embracing the 1-Year Hesitation Phase",
            description: "Understanding without pressure the normal aquatic hesitation linked to upright walking milestones.",
            observationChecklist: ["Respecting refusals without guilt", "Returning to surface cuddles and gentle play", "Maintaining aquatic joy"],
            ageRange: "10 - 18 months",
            level: "confiance",
            keyAdvice: "Around age 1, learning to walk on land often triggers aquatic hesitation : this is motor intelligence, never force.",
            relatedArticleId: "bebe-peur-eau-blocage-deculpabiliser"
          }
        ]
      }
    }
  }
};

// 2. Situations Catalog with Translations
export const SITUATIONS_DATA: Record<string, {
  id: string;
  category: any;
  iconName: string;
  translations: Record<string, LocalizedSituation>;
}> = {
  sit_immersion_verticale_face_adulte: {
    id: 'sit_immersion_verticale_face_adulte',
    category: 'immersion',
    iconName: 'Droplets',
    translations: {
      fr: {
        title: "1ère Immersion : Portage vertical face à l'adulte (Base de référence)",
        description: "Situation fondamentale pour les premières immersions de bébé. Portage vertical sécurisé contre le torse du parent, immersion conjointe très douce (1-2s) et accueil immédiat par le regard et le câlin.",
        observationCriteria: [
          "Portage vertical sécurisant poitrine contre torse / soutien souple sous les aisselles",
          "Immersion conjointe accompagnée : le parent descend dans l'eau avec le bébé",
          "Fermeture réflexe de la bouche et durée brève (1 à 2 secondes max)",
          "Émersion chaleureuse : contact visuel rassurant, sourires et câlin immédiat"
        ],
        recommendedAgeRange: "4 mois à 18 mois"
      },
      en: {
        title: "1st Submersion: Vertical Chest Hold Face-to-Face (Gold Standard)",
        description: "Foundational baseline for baby's very first submersions. Secure vertical chest-to-chest hold, gentle joint submersion (1-2s), and immediate warm eye contact and cuddle upon surfacing.",
        observationCriteria: [
          "Secure vertical hold against parent chest with supple armpit support",
          "Joint submersion: parent goes underwater alongside baby",
          "Natural dive reflex with clean mouth closure and brief duration (1-2s)",
          "Warm surfacing: reassuring eye contact, smiles, and immediate soothing cuddle"
        ],
        recommendedAgeRange: "4 months to 18 months"
      },
      es: {
        title: "1ª Inmersión: Sostén vertical cara a cara (Base de referencia)",
        description: "Situación fundamental para las primeras inmersiones. Sostén vertical contra el pecho del adulto, inmersión conjunta suave (1-2s) y abrazo inmediato al salir.",
        observationCriteria: [
          "Sostén vertical seguro pecho contra pecho",
          "Inmersión conjunta: el adulto baja al agua junto al bebé",
          "Reflejo de inmersión y cierre de boca sin tensión",
          "Salida afectuosa con mirada tranquilizadora y abrazo"
        ],
        recommendedAgeRange: "4 meses a 18 meses"
      },
      pt: {
        title: "1ª Imersão: Porte vertical face a face (Base de referência)",
        description: "Situação de referência para as primeiras imersões. Porte vertical seguro contra o peito do adulto, imersão suave em conjunto (1-2s) e abraço ao regressar à tona.",
        observationCriteria: [
          "Porte vertical seguro peito contra peito",
          "Imersão conjunta acompanhada com o adulto",
          "Reflexo de mergulho natural e fecho da boca",
          "Regresso com contacto visual, sorrisos e carinho imediato"
        ],
        recommendedAgeRange: "4 meses a 18 meses"
      },
      de: {
        title: "1. Tauchgang: Vertikaler Halt von Angesicht zu Angesicht (Referenz)",
        description: "Grundlegende Referenz für die ersten Taucherfahrungen des Babys. Sicherer vertikaler Halt an der Brust der Eltern, sanftes gemeinsames Eintauchen (1-2s) und sofortiges Kuscheln beim Auftauchen.",
        observationCriteria: [
          "Sicherer vertikaler Halt Brust an Brust / unter den Achseln",
          "Gemeinsames sanftes Eintauchen von Elternteil und Baby",
          "Natürlicher Atemschutzreflex bei kurzer Dauer (1-2s)",
          "Herzliches Auftauchen: liebevoller Blickkontakt, Lächeln und Geborgenheit"
        ],
        recommendedAgeRange: "4 Monate bis 18 Monate"
      },
      it: {
        title: "1ª Immersione: Sostegno verticale faccia a faccia (Standard di riferimento)",
        description: "Situazione fondamentale per le prime immersioni. Sostegno verticale contro il petto del genitore, immersione congiunta dolce (1-2s) e abbraccio immediato al riemergere.",
        observationCriteria: [
          "Sostegno verticale sicuro petto contro petto",
          "Immersione congiunta: il genitore scende sott'acqua con il bambino",
          "Riflesso di apnea e chiusura della bocca spontanea (1-2s)",
          "Ritorno alla superficie caloroso con contatto visivo e coccola"
        ],
        recommendedAgeRange: "4 mesi a 18 mesi"
      }
    }
  },
  sit_portage_ventral: {
    id: 'sit_portage_ventral',
    category: 'portage',
    iconName: 'Waves',
    translations: {
      fr: {
        title: "Portage ventral & Glisse horizontale",
        description: "Le parent tient le bébé face vers l'avant ou vers lui, en favorisant une position horizontale de nage.",
        observationCriteria: [
          "Positionnement des mains sous la cage thoracique ou les aisselles",
          "Inclinaison du corps du bébé (horizontal vs vertical)",
          "Liberté de mouvement des jambes et des bras",
          "Relâchement du regard et des trapèzes"
        ],
        recommendedAgeRange: "4 mois à 3 ans"
      },
      en: {
        title: "Supported Prone Hold & Horizontal Glide",
        description: "Parent holds baby facing forward or inward, encouraging a horizontal swimming posture.",
        observationCriteria: [
          "Hands cupping gently under ribcage or axillae",
          "Body inclination angle (horizontal vs vertical)",
          "Free kicking motion in legs and arms",
          "Relaxed eye contact and shoulders"
        ],
        recommendedAgeRange: "4 months to 3 years"
      },
      es: {
        title: "Sostén ventral y deslizamiento horizontal",
        description: "El adulto sostiene al bebé favoreciendo una posición horizontal de nado.",
        observationCriteria: [
          "Manos bajo el tórax o axilas",
          "Inclinación del cuerpo del bebé (horizontal vs vertical)",
          "Libertad de pataleo y braceo",
          "Mirada y hombros relajados"
        ],
        recommendedAgeRange: "4 meses a 3 años"
      },
      pt: {
        title: "Porte ventral e deslize horizontal",
        description: "O adulto segura o bebé incentivando uma postura horizontal na água.",
        observationCriteria: [
          "Posição das mãos sob o tórax ou axilas",
          "Inclinação do corpo (horizontal vs vertical)",
          "Liberdade de movimento de pernas e braços",
          "Relaxamento do olhar e ombros"
        ],
        recommendedAgeRange: "4 meses a 3 anos"
      },
      de: {
        title: "Bauchlage-Halt & Horizontales Gleiten",
        description: "Die Bezugsperson hält das Baby in horizontaler Schwimmlage im Wasser.",
        observationCriteria: [
          "Handposition unter dem Brustkorb oder den Achseln",
          "Körperneigung des Babys (horizontal vs. vertikal)",
          "Freie Beweglichkeit von Beinen und Armen",
          "Entspannter Blick und Schultern"
        ],
        recommendedAgeRange: "4 Monate bis 3 Jahre"
      },
      it: {
        title: "Sostegno ventrale e scivolamento orizzontale",
        description: "Il genitore sostiene il bambino favorendo una postura orizzontale di nuoto.",
        observationCriteria: [
          "Mani posizionate sotto il torace o le ascelle",
          "Inclinazione del corpo (orizzontale vs verticale)",
          "Libertà di movimento di gambe e braccia",
          "Sguardo e spalle rilassati"
        ],
        recommendedAgeRange: "4 mesi a 3 anni"
      }
    }
  },
  sit_flottaison_dorsale: {
    id: 'sit_flottaison_dorsale',
    category: 'flottaison',
    iconName: 'Smile',
    translations: {
      fr: {
        title: "Flottaison dorsale avec soutien délicat",
        description: "Bébé allongé sur le dos, la nuque reposant délicatement sur le bras ou la paume du parent.",
        observationCriteria: [
          "Oreilles immergées dans l'eau",
          "Pression légère et sécurisante sous l'occiput / haut du dos",
          "Ventre et nombril montant vers la surface",
          "Regard tourné vers le haut en confiance"
        ],
        recommendedAgeRange: "3 mois à 4 ans"
      },
      en: {
        title: "Back Float with Gentle Neck Support",
        description: "Baby resting on back, neck gently supported by parent's palm or soft forearm.",
        observationCriteria: [
          "Ears gently submerged in pool water",
          "Light secure support under occiput / upper back",
          "Tummy and navel floating near surface",
          "Confident upward gaze"
        ],
        recommendedAgeRange: "3 months to 4 years"
      },
      es: {
        title: "Flotación dorsal con apoyo delicado",
        description: "Bebé sobre la espalda con la nuca apoyada en la palma del adulto.",
        observationCriteria: [
          "Orejas sumergidas en el agua",
          "Apoyo suave bajo la nuca",
          "Ombligo cerca de la superficie",
          "Mirada hacia arriba con serenidad"
        ],
        recommendedAgeRange: "3 meses a 4 años"
      },
      pt: {
        title: "Flutuação dorsal com apoio suave",
        description: "Bebé de costas com a nuca suavemente apoiada na palma do adulto.",
        observationCriteria: [
          "Orelhas na água",
          "Apoio suave sob a nuca",
          "Barriguinha à superfície",
          "Olhar para cima com confiança"
        ],
        recommendedAgeRange: "3 meses a 4 anos"
      },
      de: {
        title: "Rückenlage mit feinfühliger Nackenstütze",
        description: "Baby liegt auf dem Rücken, der Nacken ruht auf der Handfläche der Eltern.",
        observationCriteria: [
          "Ohren sanft im Wasser",
          "Leichte Stütze am Hinterkopf",
          "Bauch nah an der Wasseroberfläche",
          "Ruhiger Blick nach oben"
        ],
        recommendedAgeRange: "3 Monate bis 4 Jahre"
      },
      it: {
        title: "Galleggiamento dorsale con sostegno delicato",
        description: "Bambino sul dorso con la nuca poggiata sul palmo del genitore.",
        observationCriteria: [
          "Orecchie immerse nell'acqua",
          "Sostegno leggero sotto la nuca",
          "Pancia e ombelico vicini alla superficie",
          "Sguardo fiducioso verso l'alto"
        ],
        recommendedAgeRange: "3 mesi a 4 anni"
      }
    }
  },
  sit_immersion_preparee: {
    id: 'sit_immersion_preparee',
    category: 'immersion',
    iconName: 'Droplets',
    translations: {
      fr: {
        title: "Immersion préparée avec rituel verbal",
        description: "Passage sous l'eau très court (1 à 2 secondes) précédé d'un signal clair (\"1, 2, 3... sous l'eau !\").",
        observationCriteria: [
          "Clarté du signal verbal ou du souffle rituel sur le front",
          "Fermeture volontaire de la bouche et blocage réflexe",
          "Trajectoire douce en arc de cercle dans l'eau",
          "Accueil chaleureux et félicitations au retour"
        ],
        recommendedAgeRange: "6 mois à 3 ans"
      },
      en: {
        title: "Prepared Submersion with Verbal Cue",
        description: "Short 1 to 2-second gentle immersion preceded by a clear rhythmic cue (\"1, 2, 3... Under we go!\").",
        observationCriteria: [
          "Clear vocal cue or gentle forehead breath",
          "Voluntary mouth closure and dive reflex",
          "Smooth arc trajectory through water",
          "Warm embrace and praise upon surfacing"
        ],
        recommendedAgeRange: "6 months to 3 years"
      },
      es: {
        title: "Inmersión preparada con señal verbal",
        description: "Paso breve bajo el agua (1 a 2 segundos) precedido por una señal clara (\"1, 2, 3... ¡al agua!\").",
        observationCriteria: [
          "Claridad de la señal verbal",
          "Cierre voluntario de la boca",
          "Trayectoria suave en arco",
          "Abrazo y felicitación al salir"
        ],
        recommendedAgeRange: "6 meses a 3 años"
      },
      pt: {
        title: "Imersão preparada com sinal verbal",
        description: "Passagem curta debaixo de água (1 a 2 segundos) com sinal prévio.",
        observationCriteria: [
          "Sinal verbal claro",
          "Fecho voluntário da boca",
          "Trajetória suave em arco",
          "Abraço caloroso ao regressar"
        ],
        recommendedAgeRange: "6 meses a 3 anos"
      },
      de: {
        title: "Vorbereitetes Tauchen mit Signalwort",
        description: "Kurzes 1-2 Sekunden langes Eintauchen mit vorangestelltem Signal ('1, 2, 3... untertauchen!').",
        observationCriteria: [
          "Klares akustisches Signal oder Pusten auf die Stirn",
          "Reflexartiger Mundschluss",
          "Flüssige Bogenbewegung im Wasser",
          "Herzliches Loben beim Auftauchen"
        ],
        recommendedAgeRange: "6 Monate bis 3 Jahre"
      },
      it: {
        title: "Immersione preparata con rituale verbale",
        description: "Breve passaggio sott'acqua (1-2 secondi) preceduto da segnale chiaro.",
        observationCriteria: [
          "Chiarezza del segnale verbale",
          "Chiusura volontaria della bocca",
          "Traiettoria fluida ad arco",
          "Abbraccio caloroso al riemergere"
        ],
        recommendedAgeRange: "6 mesi a 3 anni"
      }
    }
  },
  sit_deplacement_propulsion: {
    id: 'sit_deplacement_propulsion',
    category: 'deplacements',
    iconName: 'Compass',
    translations: {
      fr: {
        title: "Propulsion spontanée vers un objet flottant",
        description: "Stimulation du déplacement par un jouet flottant placé à 50 cm du bébé.",
        observationCriteria: [
          "Dynamisme des battements de jambes",
          "Action des bras en rame ou en préhension",
          "Alignement tête-tronc lors de l'effort",
          "Plaisir du jeu et de l'atteinte de la cible"
        ],
        recommendedAgeRange: "8 mois à 3 ans"
      },
      en: {
        title: "Spontaneous Kicking towards Floating Toy",
        description: "Movement stimulated by a colorful floating toy placed 50 cm ahead of baby.",
        observationCriteria: [
          "Dynamic alternating leg kicks",
          "Paddling or reaching arm motions",
          "Head-spine alignment during movement",
          "Joy upon reaching the toy"
        ],
        recommendedAgeRange: "8 months to 3 years"
      },
      es: {
        title: "Propulsión espontánea hacia un objeto flotante",
        description: "Estimulación del desplazamiento con un juguete flotante a 50 cm.",
        observationCriteria: [
          "Dinamismo en el pataleo",
          "Movimiento de brazos hacia el juguete",
          "Alineación cabeza-tronco",
          "Alegría al alcanzar el objetivo"
        ],
        recommendedAgeRange: "8 meses a 3 años"
      },
      pt: {
        title: "Propulsão espontânea para objeto flutuante",
        description: "Estímulo do deslocamento com brinquedo flutuante a 50 cm.",
        observationCriteria: [
          "Dinamismo no bater de pernas",
          "Braços estendidos para alcançar",
          "Alinhamento corporal",
          "Alegria ao tocar no brinquedo"
        ],
        recommendedAgeRange: "8 meses a 3 anos"
      },
      de: {
        title: "Spontane Fortbewegung zum Schwimmspielzeug",
        description: "Anreiz zur Vorwärtsbewegung durch ein schwimmendes Spielzeug in 50 cm Entfernung.",
        observationCriteria: [
          "Dynamischer Beinschlag",
          "Ausgestreckte Paddelarme",
          "Körperausrichtung",
          "Freude beim Erreichen des Ziels"
        ],
        recommendedAgeRange: "8 Monate bis 3 Jahre"
      },
      it: {
        title: "Propulsione spontanea verso un gioco galleggiante",
        description: "Stimolazione dello spostamento con un giocattolo a 50 cm.",
        observationCriteria: [
          "Dinamismo dei battiti di gambe",
          "Braccia protese in avanti",
          "Allineamento testa-tronco",
          "Gioia al raggiungimento dell'oggetto"
        ],
        recommendedAgeRange: "8 mesi a 3 anni"
      }
    }
  },
  sit_entree_bord: {
    id: 'sit_entree_bord',
    category: 'entree_eau',
    iconName: 'ArrowDownCircle',
    translations: {
      fr: {
        title: "Entrée dans l'eau depuis le bord assis",
        description: "Le bébé est assis sur le rebord de la piscine et glisse dans les bras du parent situé dans l'eau.",
        observationCriteria: [
          "Stabilité assise au bord de l'eau",
          "Présence des mains du parent ouvertes et proches",
          "Bascule volontaire avec appui plantaire",
          "Réception douce sans choc"
        ],
        recommendedAgeRange: "9 mois à 3 ans"
      },
      en: {
        title: "Seated Poolside Entry",
        description: "Baby sits on pool edge and glides smoothly into parent's waiting arms.",
        observationCriteria: [
          "Seated balance at pool edge",
          "Open supportive parent hands",
          "Voluntary forward lean with foot push",
          "Soft cushioned catch in water"
        ],
        recommendedAgeRange: "9 months to 3 years"
      },
      es: {
        title: "Entrada al agua desde el bordillo sentado",
        description: "El bebé sentado en el borde se desliza hacia los brazos del adulto.",
        observationCriteria: [
          "Estabilidad sentado",
          "Manos abiertas del adulto",
          "Inclinación voluntaria",
          "Recepción suave en el agua"
        ],
        recommendedAgeRange: "9 meses a 3 años"
      },
      pt: {
        title: "Entrada na água a partir da borda sentado",
        description: "O bebé sentado na borda desliza para os braços do adulto na água.",
        observationCriteria: [
          "Equilíbrio sentado",
          "Mãos de apoio abertas",
          "Inclinação voluntária",
          "Recepção amortecida"
        ],
        recommendedAgeRange: "9 meses a 3 anos"
      },
      de: {
        title: "Wassereinstieg im Sitzen vom Beckenrand",
        description: "Baby sitzt am Beckenrand und gleitet in die Arme der Eltern im Wasser.",
        observationCriteria: [
          "Sitzstabilität am Rand",
          "Bereitstehende Hände der Eltern",
          "Freiwilliges Vorneigen",
          "Sanftes Auffangen"
        ],
        recommendedAgeRange: "9 Monate bis 3 Jahre"
      },
      it: {
        title: "Entrata in acqua da seduti dal bordo",
        description: "Il bambino seduto sul bordo scivola tra le braccia del genitore.",
        observationCriteria: [
          "Stabilità da seduti",
          "Mani aperte del genitore",
          "Inclinazione volontaria",
          "Ricezione morbida"
        ],
        recommendedAgeRange: "9 mesi a 3 anni"
      }
    }
  }
};

// 3. Exercises Catalog with Multilingual Translations
export const EXERCISES_DATA: Record<string, {
  id: string;
  image?: string;
  imageCaption?: string;
  level: any;
  situationCategory: string;
  translations: Record<string, LocalizedExercise>;
}> = {
  exo_immersion_verticale_face_face: {
    id: 'exo_immersion_verticale_face_face',
    image: "/media/articles/premiere-immersion-7-secondes.webp",
    level: 'decouverte',
    situationCategory: 'immersion',
    translations: {
      fr: {
        title: "L'Immersion Complice en Portage Vertical (1ère immersion de référence)",
        objective: "Initier en toute sécurité la toute première immersion de bébé en position verticale, enveloppé contre le torse du parent avec immersion conjointe et câlin rassurant.",
        recommendedAge: "4 à 18 mois",
        steps: [
          "Placez votre bébé à la verticale contre votre poitrine, maintenu fermement mais avec douceur sous les aisselles et le bas du dos.",
          "Établissez un contact visuel direct, souriez et annoncez doucement l'action (ex: 'Attention... on va sous l'eau ensemble !').",
          "Fléchissez vos jambes et descendez sous l'eau ensemble (immersion conjointe) pendant 1 à 1,5 seconde maximum.",
          "Remontez immédiatement à la surface dans un mouvement fluide, collez votre joue contre la sienne, félicitez-le chaleureusement et offrez-lui un grand câlin rassurant."
        ],
        commonMistakes: [
          "Pousser le bébé seul sous l'eau à distance ou à bout de bras.",
          "Secouer le bébé ou essuyer frénétiquement son visage à l'émersion.",
          "Montrer un visage inquiet ou anxieux qui transmet du stress au bébé."
        ],
        corrections: [
          "Restez au contact physique direct : la proximité de votre buste et votre voix apaisent instantanément.",
          "Laissez les gouttelettes s'écouler naturellement tout en souriant et en l'embrassant.",
          "Gardez un rythme respiratoire posé et calme avant et après l'immersion."
        ],
        safetyTips: [
          "L'immersion ne doit jamais excéder 1 à 2 secondes chez le nourrisson.",
          "Toujours s'assurer d'avoir un appui plantaire stable au sol de la piscine.",
          "Observer l'apaisement du bébé : espacer de 3 à 5 minutes de jeux calmes avant une autre immersion (max 2 à 3 par séance)."
        ],
        duration: "1 à 2 secondes d'immersion",
        repetition: "2 à 3 fois maximum par séance",
        tags: ["1ère immersion", "Portage vertical", "Face-à-face", "Sécurité affective", "Immersion conjointe"]
      },
      en: {
        title: "The Vertical Chest-to-Chest First Submersion (Baseline Reference)",
        objective: "Safely introduce baby's very first underwater experience in a secure vertical chest hold with joint submersion and loving post-dive embrace.",
        recommendedAge: "4 to 18 months",
        steps: [
          "Hold baby vertically against your chest, gently yet firmly cradled under armpits and lower back.",
          "Anchor in warm eye contact, smile, and whisper a gentle prompt (e.g. 'Ready... let's go underwater together!').",
          "Crouch and submerge smoothly together (joint submersion) for 1 to 1.5 seconds maximum.",
          "Surface smoothly, bring your cheek against baby's, cheer warmly, and wrap them in a soothing cuddle."
        ],
        commonMistakes: [
          "Pushing baby underwater alone at arm's length.",
          "Shaking baby or frantically wiping their face upon surfacing.",
          "Looking alarmed or anxious, which triggers distress in baby."
        ],
        corrections: [
          "Keep close skin-to-skin / chest contact: your warmth and presence create absolute security.",
          "Let water run off naturally while smiling and kissing baby's cheek.",
          "Breathe slowly and deeply to transmit soothing calm."
        ],
        safetyTips: [
          "Submersion must never exceed 1 to 2 seconds for infants.",
          "Always ensure secure footing on the pool floor.",
          "Space out submersions with 3 to 5 minutes of gentle playful floating (maximum 2 to 3 submersions per session)."
        ],
        duration: "1 to 2 seconds submersion",
        repetition: "2 to 3 times max per session",
        tags: ["1st Submersion", "Vertical Hold", "Chest-to-Chest", "Emotional Safety", "Joint Dive"]
      },
      es: {
        title: "Inmersión en Sostén Vertical Cara a Cara (Base de referencia)",
        objective: "Iniciar con total seguridad la primera inmersión del bebé en postura vertical contra el pecho del adulto.",
        recommendedAge: "4 a 18 meses",
        steps: [
          "Sostén al bebé en vertical contra tu pecho, con manos seguras bajo las axilas y espalda.",
          "Mira a sus ojos con una sonrisa y dale una señal tranquila.",
          "Baja al agua juntos suavemente durante 1 a 1,5 segundos.",
          "Sal a la superficie, junta tu mejilla con la suya, sonríe y dale un abrazo cálido."
        ],
        commonMistakes: [
          "Sumergir al bebé a distancia con los brazos extendidos.",
          "Sacudir al bebé o frotarle la cara con prisa.",
          "Mostrar angustia o tensión."
        ],
        corrections: [
          "Mantén el contacto pecho con pecho para máxima seguridad.",
          "Deja que el agua resbale de forma natural con besos y sonrisas.",
          "Respira con calma."
        ],
        safetyTips: [
          "Duración máxima de 1 a 2 segundos.",
          "Pies bien apoyados en el suelo de la piscina.",
          "Máximo 2 a 3 inmersiones por sesión con pausas largas."
        ],
        duration: "1 a 2 segundos",
        repetition: "2 a 3 repeticiones",
        tags: ["1ª Inmersión", "Sostén vertical", "Cara a cara", "Seguridad"]
      },
      pt: {
        title: "A 1ª Imersão em Porte Vertical Face a Face (Referência)",
        objective: "Iniciar com total segurança a primeira imersão do bebé em posição vertical encostado ao peito do adulto.",
        recommendedAge: "4 a 18 meses",
        steps: [
          "Segure o bebé na vertical contra o seu peito, com apoio suave sob as axilas e costas.",
          "Mantenha contacto visual e fale com carinho.",
          "Desça na água em conjunto por 1 a 1,5 segundos.",
          "Regresse à superfície, encoste a sua bochecha na dele e abrace com ternura."
        ],
        commonMistakes: [
          "Mergulhar o bebé sozinho à distância dos braços.",
          "Sacudir ou limpar a cara do bebé bruscamente.",
          "Expressão facial tensa."
        ],
        corrections: [
          "Mantenha o contacto corpo a corpo para transmitir segurança.",
          "Sorria e deixe a água escorrer naturalmente.",
          "Respire calmamente."
        ],
        safetyTips: [
          "Máximo de 1 a 2 segundos debaixo de água.",
          "Pés bem assentes no chão da piscina.",
          "Intervalos de 3 a 5 minutos entre imersões."
        ],
        duration: "1 a 2 segundos",
        repetition: "2 a 3 vezes por sessão",
        tags: ["1ª Imersão", "Porte vertical", "Face a face", "Segurança"]
      },
      de: {
        title: "Der vertikale Kuschel-Tauchgang von Angesicht zu Angesicht",
        objective: "Sichere Einführung des ersten Tauchens in aufrechter Haltung an der Brust der Eltern mit liebevoller Begleitung.",
        recommendedAge: "4 bis 18 Monate",
        steps: [
          "Baby aufrecht an die eigene Brust schmiegen, sicher unter den Achseln gestützt.",
          "Blickkontakt aufnehmen, fröhlich lächeln und sanft ankündigen.",
          "Gemeinsam für 1 bis 1,5 Sekunden sanft unter Wasser tauchen.",
          "Sofort auftauchen, Wange an Wange schmiegen, herzlich loben und tröstend kuscheln."
        ],
        commonMistakes: [
          "Das Baby mit ausgestreckten Armen allein untertauchen.",
          "Das Gesicht nach dem Auftauchen hektisch abwischen.",
          "Ein ängstliches Gesicht machen."
        ],
        corrections: [
          "Körperkontakt halten: Ihre Körperwärme gibt absolute Sicherheit.",
          "Tropfen natürlich abfließen lassen und liebevoll anlächeln.",
          "Ruhig und entspannt atmen."
        ],
        safetyTips: [
          "Tauchdauer maximal 1 bis 2 Sekunden.",
          "Stets sicheren Stand im Wasser gewährleisten.",
          "Pausen von 3-5 Minuten zwischen Tauchgängen einhalten."
        ],
        duration: "1 bis 2 Sekunden",
        repetition: "2 bis 3 Mal pro Einheit",
        tags: ["1. Tauchgang", "Vertikaler Halt", "Brustkontakt", "Geborgenheit"]
      },
      it: {
        title: "L'Immersione d'Intesa in Sostegno Verticale (Base di riferimento)",
        objective: "Avviare in piena sicurezza la prima immersione del bambino in postura verticale contro il petto del genitore.",
        recommendedAge: "4 a 18 mesi",
        steps: [
          "Posizionate il bambino in verticale contro il vostro petto, sostenuto con cura sotto le ascelle.",
          "Cercate lo sguardo, sorridete e annunciate dolcemente l'azione.",
          "Scendete sott'acqua insieme per 1-1,5 secondi al massimo.",
          "Risalite con dolcezza, guancia a guancia, con sorrisi e un grande abbraccio rassicurante."
        ],
        commonMistakes: [
          "Spingere il bambino sott'acqua da solo a braccia tese.",
          "Scuotere il bambino o asciugare bruscamente il viso.",
          "Mostrare un'espressione tesa."
        ],
        corrections: [
          "Rimanete a stretto contatto: la vicinanza del vostro petto dissipa ogni paura.",
          "Lasciate scorrere le gocce sorridendo e baciando la guancia.",
          "Respirate profondamente e con calma."
        ],
        safetyTips: [
          "Immersione breve (1-2 secondi massimo).",
          "Piedi ben saldi sul fondo della vasca.",
          "Massimo 2-3 immersioni per seduta intervallate da giochi rilassanti."
        ],
        duration: "1 a 2 secondi",
        repetition: "2 a 3 volte per sessione",
        tags: ["1ª Immersione", "Sostegno verticale", "Faccia a faccia", "Sicurezza"]
      }
    }
  },
  exo_tapis_volant: {
    id: 'exo_tapis_volant',
    image: "/media/articles/seance-bebe-nageur-pas-cours-natation.webp?v=2",
    level: 'decouverte',
    situationCategory: 'portage',
    translations: {
      fr: {
        title: "Le Petit Bateau / La Glisse Horizontale",
        objective: "Favoriser l'alignement horizontal du corps et détendre les hanches pour une meilleure flottaison.",
        recommendedAge: "4 à 18 mois",
        steps: [
          "Placez vos mains sous la poitrine et la cage thoracique de bébé (pouces en haut, doigts sous le thorax).",
          "Abaissez-vous dans l'eau jusqu'à avoir vos propres épaules au niveau de la surface.",
          "Faites glisser doucement bébé vers l'avant à vitesse constante : l'eau va naturellement soulever ses jambes.",
          "Chantez une comptine douce en avançant de 2 à 3 mètres."
        ],
        commonMistakes: [
          "Garder les épaules hors de l'eau, ce qui force bébé à se redresser à la verticale.",
          "Serrer trop fort la cage thoracique ou tirer sur les bras.",
          "Avancer par à-coups saccadés."
        ],
        corrections: [
          "Fléchissez vos jambes pour descendre à hauteur de bébé.",
          "Ouvrez vos paumes : le bébé doit reposer sur vos mains comme sur un coussin.",
          "Créez un mouvement de vague doux et continu."
        ],
        safetyTips: [
          "Gardez le menton et la bouche de bébé toujours dégagés de l'eau.",
          "Ne lâchez jamais le contact tactile.",
          "Maintenez un regard complice et souriant."
        ],
        duration: "2 à 3 minutes par séquence",
        repetition: "3 passages de glisse",
        tags: ["Horizontalité", "Glisse", "Détente"]
      },
      en: {
        title: "The Little Sailboat / Horizontal Glide",
        objective: "Encourage natural horizontal body alignment and hip relaxation for effortless buoyancy.",
        recommendedAge: "4 to 18 months",
        steps: [
          "Cup hands gently under baby's chest and ribcage (thumbs up, fingers soft beneath).",
          "Lower yourself in the pool until your own shoulders are at water surface level.",
          "Glide baby gently forward at steady speed: water pressure will naturally lift their legs.",
          "Sing a sweet lullaby as you glide across 2 to 3 meters."
        ],
        commonMistakes: [
          "Keeping your shoulders out of water, which forces baby into an upright vertical posture.",
          "Squeezing ribcage too tightly or pulling on tiny arms.",
          "Moving forward in jerky motions."
        ],
        corrections: [
          "Bend your knees to lower your body to baby's eye level in the water.",
          "Open your palms: baby should rest on your hands like a floating pillow.",
          "Create a smooth continuous gliding wave."
        ],
        safetyTips: [
          "Always keep baby's chin and mouth well clear of the waterline.",
          "Never release physical contact.",
          "Maintain loving eye contact and smiles."
        ],
        duration: "2 to 3 minutes per sequence",
        repetition: "3 gliding passes",
        tags: ["Horizontality", "Gliding", "Relaxation"]
      },
      es: {
        title: "El Barquito / Deslizamiento Horizontal",
        objective: "Favorecer la alineación horizontal y relajar la cadera para una flotación natural.",
        recommendedAge: "4 a 18 meses",
        steps: [
          "Coloca las manos bajo el tórax del bebé con dedos suaves.",
          "Agáchate en el agua hasta que tus hombros queden al nivel de la superficie.",
          "Haz deslizar al bebé hacia adelante a velocidad constante.",
          "Canta una melodía suave mientras avanzas 2 o 3 metros."
        ],
        commonMistakes: [
          "Mantener los hombros fuera del agua, lo que verticaliza al bebé.",
          "Presionar demasiado el pecho del bebé.",
          "Avanzar a tirones."
        ],
        corrections: [
          "Flexiona las piernas para estar a la altura del bebé.",
          "Abre las palmas como un cojín de agua.",
          "Genera un avance continuo y suave."
        ],
        safetyTips: [
          "Mantén boca y barbilla del bebé siempre despejadas.",
          "No sueltes nunca el contacto táctil.",
          "Mantén contacto visual cariñoso."
        ],
        duration: "2 a 3 minutos",
        repetition: "3 pasadas",
        tags: ["Horizontalidad", "Deslizamiento", "Relajación"]
      },
      pt: {
        title: "O Barquinho / Deslize Horizontal",
        objective: "Promover o alinhamento horizontal do corpo e relaxamento das ancas na água.",
        recommendedAge: "4 a 18 meses",
        steps: [
          "Posicione as mãos suavemente sob o tórax do bebé.",
          "Baixe-se na água até os seus ombros estarem ao nível da superfície.",
          "Faça o bebé deslizar suavemente para a frente a velocidade constante.",
          "Cante uma canção suave enquanto avança 2 a 3 metros."
        ],
        commonMistakes: [
          "Manter os ombros fora de água, forçando o bebé a ficar vertical.",
          "Apertar o peito com força excessiva.",
          "Avançar aos solavancos."
        ],
        corrections: [
          "Flicta os joelhos para ficar à altura dos olhos do bebé.",
          "Abra as palmas das mãos como almofadas de apoio.",
          "Crie um movimento fluído e sereno."
        ],
        safetyTips: [
          "Mantenha a boca e o queixo sempre fora de água.",
          "Nunca perca o contacto físico.",
          "Mantenha o olhar carinhoso e confiante."
        ],
        duration: "2 a 3 minutos",
        repetition: "3 passagens",
        tags: ["Horizontalidade", "Deslize", "Relaxamento"]
      },
      de: {
        title: "Das kleine Segelboot / Horizontales Gleiten",
        objective: "Förderung der horizontalen Wasserlage und Entlastung der Hüften für müheloses Schweben.",
        recommendedAge: "4 bis 18 Monate",
        steps: [
          "Hände sanft unter den Brustkorb des Babys legen (Daumen oben, Finger locker darunter).",
          "Im Wasser in die Hocke gehen, bis die eigenen Schultern auf Wasserebene sind.",
          "Baby sanft und gleichmäßig nach vorne gleiten lassen: Der Wasserauftrieb hebt die Beinchen an.",
          "Ein ruhiges Liedchen singen und 2-3 Meter gleiten."
        ],
        commonMistakes: [
          "Schultern ragen aus dem Wasser, wodurch sich das Baby aufrichtet.",
          "Zu festes Halten des Brustkorbs.",
          "Ruckartige Vorwärtsbewegungen."
        ],
        corrections: [
          "In die Knie gehen, um auf Augenhöhe des Babys zu sein.",
          "Handflächen wie ein sanftes Wasserkissen öffnen.",
          "Eine gleichmäßige, weiche Gleitbewegung erzeugen."
        ],
        safetyTips: [
          "Kinn und Mund stets über der Wasserlinie halten.",
          "Niemals den physischen Kontakt lösen.",
          "Blickkontakt und Lächeln halten."
        ],
        duration: "2 bis 3 Minuten",
        repetition: "3 Gleitdurchgänge",
        tags: ["Wasserlage", "Gleiten", "Entspannung"]
      },
      it: {
        title: "La Barchetta / Scivolamento Orizzontale",
        objective: "Favorire l'allineamento orizzontale e il rilassamento del corpo in acqua.",
        recommendedAge: "4 a 18 mesi",
        steps: [
          "Posizionate le mani sotto il torace del bambino con presa morbida.",
          "Abbassatevi in acqua fino a portare le spalle a filo della superficie.",
          "Fate scivolare dolcemente il bambino in avanti a velocità costante.",
          "Cantate una canzoncina dolce avanzando di 2-3 metri."
        ],
        commonMistakes: [
          "Tenere le spalle fuori dall'acqua, inducendo una postura verticale.",
          "Stringere troppo il torace.",
          "Avanzare a scatti."
        ],
        corrections: [
          "Flettete le ginocchia per essere all'altezza del bambino.",
          "Aprite i palmi come un cuscinetto d'acqua.",
          "Create un movimento fluido e continuo."
        ],
        safetyTips: [
          "Mantenere mento e bocca sempre sopra la superficie.",
          "Non interrompere mai il contatto fisico.",
          "Mantenere contatto visivo rassicurante."
        ],
        duration: "2 a 3 minuti",
        repetition: "3 passaggi",
        tags: ["Orizzontalità", "Scivolamento", "Rilassamento"]
      }
    }
  },
  exo_etoile_dorsale: {
    id: 'exo_etoile_dorsale',
    image: "/media/articles/decouverte-eau-motricite.webp",
    level: 'confiance',
    situationCategory: 'flottaison',
    translations: {
      fr: {
        title: "L'Étoile de Mer Dorsale & Flottaison Active",
        objective: "Familiariser avec la flottaison dorsale, accepter l'immersion des oreilles et dynamiser la posture selon l'âge par des déplacements doux.",
        recommendedAge: "3 à 24 mois (évolution vers 7-8 mois)",
        steps: [
          "Pour les plus petits (3-6 mois) : Soutenez la tête sur votre avant-bras ou épaule, une main sous les fesses. Laissez bébé découvrir la sensation passive d'être porté par l'eau.",
          "Immerger doucement les oreilles dans l'eau chaude : l'eau dans les oreilles ne fait pas mal et permet une découverte sensorielle auditive nouvelle.",
          "Cap des 7-8 mois (refus du dos passif) : Tenez bébé sous les aisselles et au niveau des omoplates de manière sécurisante. Ne cherchez pas à le maintenir immobile s'il veut bouger.",
          "Dynamiser la position selon l'âge : déplacez bébé dans l'eau — avancez doucement, ralentissez, faites un virage souple, une accélération douce, puis demi-tour !",
          "Animez avec la voix et le regard complice : encouragez votre enfant avec un sourire constant et des intonations chaleureuses pour le sécuriser et le stimuler.",
          "Le regard comme point de repère : Placez-vous pour qu'il cherche vos yeux, ce qui incline naturellement sa tête dans une position optimale, l'arrière posé dans l'eau."
        ],
        commonMistakes: [
          "Interpréter le refus du dos vers 7-8 mois comme une peur de l'eau (c'est simplement son besoin d'exploration et d'action motrice, comme sur la table à langer).",
          "Vouloir forcer le bébé à rester immobile sur le dos alors qu'il a besoin de mouvement.",
          "Maintenir la tête trop haute hors de l'eau, ce qui cambre la nuque et fait couler le bassin.",
          "Forcer la tête dans l'eau si le bébé montre de l'inconfort."
        ],
        corrections: [
          "Rendre la position dorsale dynamique et ludique dès 7 mois avec des déplacements continus et des changements de trajectoire.",
          "Utiliser le regard et la voix expressive comme boussole pour garder la tête bien alignée.",
          "Laisser l'eau entourer doucement la tête et les oreilles sans forcer.",
          "Adapter immédiatement si bébé relève la tête ou détourne le regard."
        ],
        safetyTips: [
          "Toujours garder le nez et la bouche parfaitement dégagés au-dessus de la ligne d'eau.",
          "Adapter la situation sans jamais forcer : si bébé s'agite ou s'arc-boute, revenez à un portage vertical sécurisant.",
          "Soutien bimanuel ferme et doux sous les aisselles et les omoplates."
        ],
        duration: "2 à 4 minutes par séquence",
        repetition: "3 à 4 parcours de glisse avec pauses câlins",
        tags: ["Étoile dorsale", "Flottaison active", "7-8 mois", "Oreilles immergées", "Équilibre dorsal"],
        evolutionGuide: {
          title: "La position dorsale : une étape essentielle… qui évolue avec l'âge",
          whyRefusalAt7Months: "Vers 7-8 mois, le bébé devient beaucoup plus mobile et actif (il se retourne, attrape, change de position). La position dorsale passive lui semble trop monotone, exactement comme sur la table à langer lorsqu'il se tortille et pousse sur ses jambes. Ce n'est pas une peur de l'eau, il vous dit simplement : « Je veux bouger ! »",
          howToMakeActive: "En soutenant le bébé sous les aisselles et les omoplates, transformez la flottaison en jeu de déplacement dynamique : avancer, ralentir, virer doucement, changer d'axe, faire demi-tour. Le bébé devient pleinement acteur de son mouvement !",
          eyeContactTip: "Votre visage est son point de repère absolu. En cherchant votre regard au-dessus de lui, il conserve naturellement l'arrière de la tête posé dans l'eau et les oreilles immergées sans appréhension.",
          developmentalStages: [
            "Étape 1 (3-6 mois) : « L'eau me porte » (découverte de la flottabilité et de l'abandon confiant)",
            "Étape 2 (7-12 mois) : « Je peux bouger dans cette position » (dynamisation, glisse et déplacements continus)",
            "Étape 3 (> 12 mois) : « Je peux agir sur mon environnement » (propulsion active et autonomie motrice)"
          ],
          quotes: [
            "« Plus le bébé devient acteur sur la terre ferme, plus nous devons lui permettre de devenir acteur dans l'eau. »"
          ]
        }
      },
      en: {
        title: "Dorsal Starfish Float & Active Buoyancy",
        objective: "Familiarize with back floating, comfortably accept ear immersion, and dynamically evolve the posture with age using gentle gliding movement.",
        recommendedAge: "3 to 24 months (evolves at 7-8 months)",
        steps: [
          "For younger infants (3-6 months): Cradle head in forearm/shoulder with a gentle hand under bottom. Let baby discover passive buoyancy.",
          "Submerge ears gently in warm water: pool water in ears is safe and brings a novel soothing auditory sensation.",
          "7-8 Months Milestone (resisting passive back float): Hold baby securely under axillae and shoulder blades. Do not force them to remain motionless.",
          "Make movement dynamic: move baby through water—glide forward, slow down, curve, gentle acceleration, and turnaround!",
          "Use voice and warm eye contact: reassure your baby with a gentle smile and positive voice tones.",
          "Eye contact as guiding compass: Position yourself so baby looks into your eyes, naturally keeping the back of the head submerged."
        ],
        commonMistakes: [
          "Interpreting 7-8 month back resistance as fear of water (it is simply their growing developmental drive to move and explore, like on the changing table).",
          "Attempting to force an active older infant to remain rigid and still.",
          "Lifting head out of water which causes hips to sink."
        ],
        corrections: [
          "Make back float active and playful from 7 months with continuous gentle glides and directional changes.",
          "Use eye contact and playful reassurance to keep spine and head in optimal alignment.",
          "Adapt instantly if baby shows discomfort."
        ],
        safetyTips: [
          "Keep nose and mouth dry and clear of the waterline at all times.",
          "Return to vertical chest embrace if baby resists or arches back."
        ],
        duration: "2 to 4 minutes per sequence",
        repetition: "3 to 4 gliding runs with cuddles",
        tags: ["Back float", "Active buoyancy", "7-8 months", "Ears submerged", "Buoyancy"],
        evolutionGuide: {
          title: "The Back Float: A Crucial Milestone That Evolves With Age",
          whyRefusalAt7Months: "Around 7-8 months, babies become highly mobile and active. Passive floating feels too restrictive, just like on the diaper changing table. It is not fear; baby is telling you: 'I want to move!'",
          howToMakeActive: "Support under axillae and shoulder blades, turning the posture into a dynamic gliding journey: forward, turn, slow down, reverse!",
          eyeContactTip: "Your loving eyes guide baby's head alignment, allowing ears and back of skull to rest comfortably in water.",
          developmentalStages: [
            "Stage 1 (3-6 mo): 'Water carries me' (passive buoyancy)",
            "Stage 2 (7-12 mo): 'I can move in this posture' (active gliding and continuous movement)",
            "Stage 3 (> 12 mo): 'I can act upon my environment' (propulsion & self-direction)"
          ],
          quotes: [
            "« As baby becomes an active explorer on land, we must empower them to be an active explorer in the water. »"
          ]
        }
      },
      es: {
        title: "La Estrella de Mar Dorsal y Flotación Activa",
        objective: "Desarrollar la flotación de espalda, aceptar las orejas en el agua y dinamizar la postura según la edad con desplazamientos suaves.",
        recommendedAge: "3 a 24 meses",
        steps: [
          "De 3 a 6 meses: Apoyar la cabecita en el antebrazo y dejar sentir el agua.",
          "Dejar que las orejas se sumerjan suavemente en el agua tibia.",
          "Hacia los 7-8 meses: Sostener bajo axilas y omóplatos y dinamizar la posición con movimientos suaves.",
          "Animar con la voz: '¡Avanzamos suavemente! ¡Giro suave! ¡Media vuelta!'",
          "Mantener contacto visual para que la cabeza repose de forma natural en el agua."
        ],
        commonMistakes: [
          "Creer que el rechazo a los 7-8 meses es miedo al agua (es simplemente su necesidad motriz de moverse).",
          "Forzar la inmovilidad."
        ],
        corrections: [
          "Transformar la flotación en desplazamientos dinámicos y juegos con la voz."
        ],
        safetyTips: [
          "Boca y nariz siempre fuera del agua.",
          "Abrazar si hay tensión."
        ],
        duration: "2 a 4 minutos",
        repetition: "3 a 4 pasadas",
        tags: ["Espalda", "Flotación activa", "7-8 meses", "Equilibrio dorsal"]
      },
      pt: {
        title: "Estrela do Mar Dorsal e Flutuação Ativa",
        objective: "Desenvolver a flutuação dorsal, submergir orelhas com serenidade e dinamizar a postura a partir dos 7-8 meses com deslocamentos suaves.",
        recommendedAge: "3 a 24 meses",
        steps: [
          "3 a 6 meses: Apoiar cabeça e bacia e deixar a água embalar o bebé.",
          "Deixar as orelhas ficarem na água morna sem medo.",
          "Aos 7-8 meses: Segurar sob as axilas e omoplatas e deslocar suavemente na água.",
          "Usar a voz e o olhar como bússola de segurança.",
          "Avançar, virar, abrandar e fazer meia-volta de forma lúdica."
        ],
        commonMistakes: [
          "Confundir a agitação dos 7-8 meses com medo (o bebé quer apenas explorar e mover-se).",
          "Obrigar a ficar imóvel de costas."
        ],
        corrections: [
          "Tornar o exercício dinâmico com movimentos fluidos e canções."
        ],
        safetyTips: [
          "Manter vias respiratórias desimpedidas.",
          "Contacto visual constante."
        ],
        duration: "2 a 4 minutos",
        repetition: "3 a 4 vezes",
        tags: ["Costas", "Flutuação ativa", "7-8 meses", "Equilíbrio dorsal"]
      },
      de: {
        title: "Der Seestern in Rückenlage & Aktive Wasserlage",
        objective: "Förderung der Rückenwasserlage, Eintauchen der Ohren und spielerische Dynamisierung mit sanften Gleitbewegungen ab 7-8 Monaten.",
        recommendedAge: "3 bis 24 Monate",
        steps: [
          "3-6 Monate: Sanfte Rückenlage im Armbett, sanftes Schwebenlassen.",
          "Ohren entspannt ins warme Wasser gleiten lassen.",
          "Ab 7-8 Monaten: Unter den Achseln und Schulterblättern halten und dynamisch durchs Wasser gleiten.",
          "Vorwärts gleiten, sanfte Kurven, Wenden und spielerisch mit der Stimme begleiten.",
          "Blickkontakt als Anker nutzen, damit der Kopf entspannt im Wasser ruht."
        ],
        commonMistakes: [
          "Den Bewegungsdrang mit 7-8 Monaten fälschlich als Wasserangst deuten.",
          "Das Baby starr in Rückenlage zwingen wollen."
        ],
        corrections: [
          "Die Rückenlage durch Gleitbewegungen aktiv und spannend gestalten."
        ],
        safetyTips: [
          "Nase und Mund stets über Wasser halten.",
          "Liebevoll abbrechen bei Unruhe."
        ],
        duration: "2 bis 4 Minuten",
        repetition: "3-4 Durchgänge",
        tags: ["Rückenlage", "Aktive Wasserlage", "7-8 Monate", "Gleiten"]
      },
      it: {
        title: "La Stella Marina Dorsale & Galleggiamento Attivo",
        objective: "Favorire il galleggiamento dorsale, immergere le orecchie in serenità e rendere attiva la posizione dai 7-8 mesi con scivolamenti morbidi.",
        recommendedAge: "3 a 24 mesi",
        steps: [
          "3-6 mesi: Sostegno morbido alla nuca e al bacino per scoprire il galleggiamento.",
          "Lasciare le orecchie immerse nell'acqua tiepida.",
          "A 7-8 mesi: Sostenere sotto le ascelle e le scapole e guidare scivolamenti morbidi.",
          "Avanzare, curvare, accelerare dolcemente e fare inversione con la voce e il sorriso.",
          "Usare lo sguardo genitoriale per mantenere la testa rilassata nell'acqua."
        ],
        commonMistakes: [
          "Interpretare il rifiuto della schiena a 7-8 mesi come paura (è solo il bisogno di muoversi).",
          "Imporre l'immobilità."
        ],
        corrections: [
          "Rendere il dorso una dinamica attiva in movimento."
        ],
        safetyTips: [
          "Bocca e naso sempre all'asciutto.",
          "Sostegno sicuro e dolce."
        ],
        duration: "2 a 4 minuti",
        repetition: "3-4 passaggi",
        tags: ["Dorso", "Galleggiamento attivo", "7-8 mesi", "Equilibrio"]
      }
    }
  },
  exo_petit_plongeon_rituel: {
    id: 'exo_petit_plongeon_rituel',
    image: "/media/articles/securisation-soutiens.webp",
    level: 'confiance',
    situationCategory: 'immersion',
    translations: {
      fr: {
        title: "Le Rituel des 3 Petites Gouttes",
        objective: "Préparer en douceur l'apnée réflexe et sécuriser le passage de la tête sous l'eau.",
        recommendedAge: "6 à 24 mois",
        steps: [
          "Placez-vous face à votre bébé, à sa hauteur, avec un large sourire.",
          "Prenez un peu d'eau dans le creux de votre main et dites distinctement : \"Attention... 1, 2, 3... Plouf !\"",
          "Au mot \"Plouf\", soufflez doucement sur son front pour déclencher le réflexe de fermeture des yeux et de la bouche.",
          "Versez un mince filet d'eau sur le sommet de sa tête, puis félicitez-le immédiatement avec un grand câlin."
        ],
        commonMistakes: [
          "Immerger bébé par surprise sans aucun signal sonore ou visuel.",
          "Projeter de l'eau violemment dans les yeux ou les narines.",
          "Avoir un visage inquiet ou anxieux qui alerte le bébé."
        ],
        corrections: [
          "Répétez toujours exactement la même formule mélodieuse.",
          "Faites d'abord l'exercice sur vous-même devant lui en riant.",
          "Restez toujours joyeux et ultra-positif après l'action."
        ],
        safetyTips: [
          "Une immersion ne doit jamais dépasser 1 à 2 secondes chez le nourrisson.",
          "Ne forcez jamais un enfant qui pleure ou manifeste un refus clair."
        ],
        duration: "3 à 4 répétitions espacées",
        repetition: "Séances courtes",
        tags: ["Immersion", "Rituel", "Apnée réflexe"]
      },
      en: {
        title: "The 3 Little Drops Ritual",
        objective: "Gently prepare the natural dive reflex and build serene confidence with head immersion.",
        recommendedAge: "6 to 24 months",
        steps: [
          "Position yourself right in front of baby at eye level with a warm, beaming smile.",
          "Scoop a little warm water in your hand and say clearly: \"Ready... 1, 2, 3... Splash!\"",
          "At the word \"Splash\", blow gently on baby's forehead to trigger reflexive eye and mouth closing.",
          "Pour a gentle trickle of water over the top of the head, followed immediately by big cheers and hugs."
        ],
        commonMistakes: [
          "Submerging baby by surprise with no preparatory cue.",
          "Splashing water forcefully into eyes or nose.",
          "Showing an anxious facial expression that alerts baby."
        ],
        corrections: [
          "Always repeat the exact same melodic wording.",
          "Demonstrate cheerfully on yourself first while smiling.",
          "Always celebrate enthusiastically after the moment."
        ],
        safetyTips: [
          "Submersion should never exceed 1 to 2 seconds for infants.",
          "Never force a child who is crying or expressing clear reluctance."
        ],
        duration: "3 to 4 spaced repetitions",
        repetition: "Short sessions",
        tags: ["Submersion", "Ritual", "Dive Reflex"]
      },
      es: {
        title: "El Ritual de las 3 Gotas",
        objective: "Preparar con suavidad el reflejo de apnea e inmersión de la cabeza.",
        recommendedAge: "6 a 24 meses",
        steps: [
          "Colócate frente al bebé a la altura de sus ojos con una sonrisa.",
          "Toma agua en tu mano y di: \"Atención... 1, 2, 3... ¡Al agua!\"",
          "Sopla suavemente en su frente para inducir el cierre de ojos y boca.",
          "Vierte un chorrito suave de agua en la coronilla y dale un gran abrazo."
        ],
        commonMistakes: [
          "Sumergir por sorpresa sin previo aviso.",
          "Arrojar agua con brusquedad.",
          "Mostrar cara de angustia."
        ],
        corrections: [
          "Repite siempre la misma frase melódica.",
          "Hazlo primero sobre ti mismo riendo.",
          "Felicita con alegría y abrazos."
        ],
        safetyTips: [
          "La inmersión nunca debe superar 1 a 2 segundos en bebés.",
          "No forzar jamás ante el llanto."
        ],
        duration: "3 a 4 repeticiones",
        tags: ["Inmersión", "Ritual", "Apnea"]
      },
      pt: {
        title: "O Ritual das 3 Gotas",
        objective: "Preparar com carinho o reflexo de mergulho e passagem da cabeça pela água.",
        recommendedAge: "6 a 24 meses",
        steps: [
          "Coloque-se em frente ao bebé ao nível dos olhos com um sorriso.",
          "Coloque água na palma da mão e diga: \"Atenção... 1, 2, 3... Splash!\"",
          "Sopre suavemente na testa para fechar olhos e boca.",
          "Verta um fio suave de água no topo da cabeça e celebre com um abraço."
        ],
        commonMistakes: [
          "Mergulhar de surpresa sem sinal sonoro.",
          "Lançar água com força nos olhos.",
          "Mostrar expressão facial de ansiedade."
        ],
        corrections: [
          "Repita sempre a mesma entoação alegre.",
          "Demonstre primeiro em si mesmo a rir.",
          "Abrace com entusiasmo após a ação."
        ],
        safetyTips: [
          "A imersão nunca deve durar mais de 1 a 2 segundos.",
          "Nunca forçar se o bebé recusar."
        ],
        duration: "3 a 4 repetições",
        tags: ["Imersão", "Ritual", "Apneia"]
      },
      de: {
        title: "Das 3-Tröpfchen-Ritual",
        objective: "Sanfte Vorbereitung des Tauchreflexes und sicheres Benetzen des Kopfes.",
        recommendedAge: "6 bis 24 Monate",
        steps: [
          "Auf Augenhöhe mit dem Baby gehen und freundlich lächeln.",
          "Etwas Wasser in die Hand nehmen und deutlich sagen: 'Achtung... 1, 2, 3... Platsch!'",
          "Beim Wort 'Platsch' sanft auf die Stirn pusten (löst Mundschluss-Reflex aus).",
          "Ein wenig Wasser sanft über den Kopf träufeln und sofort mit einer Umarmung belohnen."
        ],
        commonMistakes: [
          "Baby überraschend ohne Signal ins Wasser tauchen.",
          "Wasser grob ins Gesicht spritzen.",
          "Ein ängstlicher Gesichtsausdruck der Eltern."
        ],
        corrections: [
          "Stets die gleiche melodische Formulierung nutzen.",
          "Die Übung zuerst lachend an sich selbst vormachen.",
          "Sofort freudig loben und herzen."
        ],
        safetyTips: [
          "Tauchen beim Säugling darf maximal 1 bis 2 Sekunden dauern.",
          "Niemals gegen den Willen des Kindes handeln."
        ],
        duration: "3 bis 4 Wiederholungen",
        tags: ["Eintauchen", "Ritual", "Tauchreflex"]
      },
      it: {
        title: "Il Rituale delle 3 Gocce",
        objective: "Preparare dolcemente il riflesso di immersione e l'apnea protettiva.",
        recommendedAge: "6 a 24 mesi",
        steps: [
          "Mettetevi di fronte al bambino alla sua altezza con un sorriso.",
          "Prendete un po' d'acqua nella mano e dite: 'Attenzione... 1, 2, 3... Splash!'",
          "Soffiate dolcemente sulla fronte per attivare la chiusura di occhi e bocca.",
          "Versate un filo d'acqua sulla testa e congratulatevi con un abbraccio."
        ],
        commonMistakes: [
          "Immergere a sorpresa senza segnale.",
          "Schizzare acqua bruscamente sul viso.",
          "Mostrare ansia o preoccupazione."
        ],
        corrections: [
          "Ripetere sempre la stessa formula melodiosa.",
          "Fare prima l'esercizio su di sé ridendo.",
          "Festeggiare con gioia subito dopo."
        ],
        safetyTips: [
          "L'immersione non deve mai superare 1-2 secondi nei neonati.",
          "Non forzare mai se il bambino manifesta rifiuto."
        ],
        duration: "3-4 ripetizioni",
        tags: ["Immersione", "Rituale", "Apnea"]
      }
    }
  },
  exo_chasse_aux_canards: {
    id: 'exo_chasse_aux_canards',
    image: "/media/articles/brassards-pour-ou-contre.webp",
    level: 'autonomie',
    situationCategory: 'deplacements',
    translations: {
      fr: {
        title: "Le Canoë des Petits Pieds",
        objective: "Stimuler la motricité propulsive spontanée des jambes par le jeu visuel.",
        recommendedAge: "8 mois à 3 ans",
        steps: [
          "Positionnez bébé à l'horizontale dans l'eau, soutenu sous les aisselles.",
          "Disposez un canard flottant coloré à 40 cm devant ses yeux.",
          "Encouragez-le d'une voix enjouée : \"Va chercher le canard !\"",
          "Accompagnez sa glisse dès qu'il esquisse un mouvement de pieds ou de bras pour qu'il ressente la propulsion."
        ],
        commonMistakes: [
          "Placer le jouet trop loin, ce qui décourage le bébé.",
          "Freiner son élan en le retenant trop fermement par la taille."
        ],
        corrections: [
          "Rapprochez le jouet pour garantir un succès immédiat en 3 secondes.",
          "Allégez votre prise dès qu'il donne un coup de pied pour qu'il voie l'effet direct sur son avancée."
        ],
        safetyTips: [
          "Vérifiez la température de l'eau (doit être entre 31°C et 33°C pour éviter les frissons moteurs)."
        ],
        duration: "3 à 5 minutes",
        repetition: "4 allers-retours vers le jouet",
        tags: ["Propulsion", "Battements", "Jeu"]
      },
      en: {
        title: "The Little Canoe / Floating Duck Chase",
        objective: "Stimulate spontaneous leg propulsion through playful visual rewards.",
        recommendedAge: "8 months to 3 years",
        steps: [
          "Hold baby horizontally in water, gently supported under the armpits.",
          "Place a bright floating duck 40 cm ahead of baby's eyes.",
          "Cheer with an upbeat voice: \"Go get the duckie!\"",
          "Glide baby forward as soon as they kick or paddle so they feel their own propulsion."
        ],
        commonMistakes: [
          "Placing the toy too far away, causing frustration.",
          "Holding too rigidly around the waist, restricting hip movement."
        ],
        corrections: [
          "Keep toy close to ensure quick success within 3 seconds.",
          "Lighten your grip when baby kicks so they see the direct effect of their effort."
        ],
        safetyTips: [
          "Ensure pool temperature is at least 32°C to prevent muscle shivering."
        ],
        duration: "3 to 5 minutes",
        repetition: "4 back-and-forth passes",
        tags: ["Propulsion", "Kicks", "Play"]
      },
      es: {
        title: "La Canoa de los Pequeños Pies",
        objective: "Estimular la propulsión espontánea de las piernas mediante el juego.",
        recommendedAge: "8 meses a 3 años",
        steps: [
          "Sostén al bebé horizontal bajo las axilas.",
          "Coloca un patito flotante a 40 cm de sus ojos.",
          "Anímalo con voz alegre: \"¡A por el patito!\"",
          "Acompaña el avance en cuanto empiece a patalear."
        ],
        commonMistakes: [
          "Colocar el juguete demasiado lejos.",
          "Sujetar con demasiada rigidez la cintura."
        ],
        corrections: [
          "Acerca el juguete para garantizar éxito rápido.",
          "Aligera el sostén cuando patalee."
        ],
        safetyTips: [
          "Temperatura del agua a 32°C como mínimo."
        ],
        duration: "3 a 5 minutos",
        tags: ["Propulsión", "Pataleo", "Juego"]
      },
      pt: {
        title: "A Canoa dos Pequenos Pés",
        objective: "Estimular o bater de pernas propulsivo através da brincadeira.",
        recommendedAge: "8 meses a 3 anos",
        steps: [
          "Segure o bebé na horizontal sob as axilas.",
          "Coloque um patinho flutuante a 40 cm à sua frente.",
          "Incentive com alegria: \"Vai apanhar o patinho!\"",
          "Acompanhe o deslize assim que começar a bater os pés."
        ],
        commonMistakes: [
          "Colocar o brinquedo muito longe.",
          "Segurar a cintura com demasiada rigidez."
        ],
        corrections: [
          "Aproxime o brinquedo para um sucesso rápido.",
          "Alivie a pressão quando o bebé der pontapés na água."
        ],
        safetyTips: [
          "Água a 32°C no mínimo."
        ],
        duration: "3 a 5 minutos",
        tags: ["Propulsão", "Pernas", "Brincadeira"]
      },
      de: {
        title: "Das Paddelboot der kleinen Füße",
        objective: "Förderung des Beinschlags und der Vorwärtsbewegung durch visuelle Spielanreize.",
        recommendedAge: "8 Monate bis 3 Jahre",
        steps: [
          "Baby in horizontaler Bauchlage unter den Achseln sanft stützen.",
          "Ein buntes Schwimm-Entchen ca. 40 cm vor die Augen setzen.",
          "Mit fröhlicher Stimme motivieren: 'Hol dir das Entchen!'",
          "Das Gleiten begleiten, sobald das Baby mit den Beinen strampelt."
        ],
        commonMistakes: [
          "Spielzeug zu weit entfernt platzieren.",
          "Das Baby zu fest an der Taille festhalten."
        ],
        corrections: [
          "Das Spielzeug nah halten, um schnellen Erfolg nach 3 Sekunden zu sichern.",
          "Den Halt lockern, sobald Beinschläge einsetzen."
        ],
        safetyTips: [
          "Wassertemperatur auf mindestens 32°C kontrollieren."
        ],
        duration: "3 bis 5 Minuten",
        tags: ["Antrieb", "Beinschlag", "Spiel"]
      },
      it: {
        title: "La Canoa dei Piedini",
        objective: "Stimolare la battuta di gambe e la propulsione attraverso il gioco.",
        recommendedAge: "8 mesi a 3 anni",
        steps: [
          "Posizionate il bambino in orizzontale sostenuto sotto le ascelle.",
          "Mettete una paperella galleggiante a 40 cm davanti ai suoi occhi.",
          "Incoraggiate con voce allegra: 'Prendi la paperella!'",
          "Accompagnate lo scivolamento appena muove i piedini."
        ],
        commonMistakes: [
          "Mettere il gioco troppo lontano.",
          "Trattenere il bacino con troppa forza."
        ],
        corrections: [
          "Avvicinare il giocattolo per garantire il successo rapido.",
          "Alleggerire la presa durante la battuta di gambe."
        ],
        safetyTips: [
          "Temperatura dell'acqua a 32°C minimo."
        ],
        duration: "3 a 5 minuti",
        tags: ["Propulsione", "Gambe", "Gioco"]
      }
    }
  }
};

// 4. Demo Scenarios with Localized Analysis
export const DEMO_SCENARIOS_DATA = [
  {
    id: 'demo_immersion_verticale_parent',
    situationKey: 'sit_immersion_verticale_face_adulte',
    exerciseId: 'exo_immersion_verticale_face_face',
    videoDuration: 16,
    videoSizeMB: 10.8,
    videoUrl: '/media/demo-videos/glenn%20immersion%20verticale.mp4',
    thumbnailType: 'immersion_rituel',
    confidence: 0.98,
    biomechanics: {
      orientation: 'verticale',
      targetOrientation: 'verticale',
      correction: "Posture verticale sécurisante de référence : portage enveloppant contre le torse et contact œil-à-œil.",
      parentHoldType: 'Portage vertical face à l\'adulte (buste contre torse)',
      babyRelaxationScore: 96
    },
    translations: {
      fr: {
        title: "1ère immersion de référence — Portage vertical face à l'adulte",
        analysis: {
          situation: "1ère Immersion : Portage vertical face à l'adulte (Base de référence)",
          positive_points: [
            "Portage vertical enveloppant et sécurisant contre le torse du parent",
            "Immersion conjointe fluide de 1.5s parfaitement coordonnée",
            "Accueil chaleureux à l'émersion : regard complice, sourires et câlin immédiat",
            "Fermeture buccale réflexe nette sans déglutition d'eau"
          ],
          observations: [
            "Le parent maintient bébé à hauteur de regard et s'immerge avec lui sous l'eau.",
            "À la sortie de l'eau, le bébé cligne sereinement des yeux, cherche le contact et sourit.",
            "Aucune secousse ni geste brusque à l'émersion : la transition est idéale."
          ],
          priority: "Poursuivre ce modèle de portage vertical et d'immersion conjointe comme base de référence pour toutes les premières immersions.",
          main_recommendation: "Votre technique est la référence absolue ! Ce portage vertical face à vous, associé à l'immersion conjointe et au câlin immédiat à l'émersion, constitue le standard d'or pour sécuriser le réflexe d'apnée dans la joie et la sécurité affective.",
          secondary_recommendations: [
            "Maintenir 2 à 3 minutes de jeux flottants calmes entre chaque immersion.",
            "Conserver toujours ce rituel d'accueil et de félicitations chaleureuses après chaque passage sous l'eau."
          ],
          safety_notes: [
            "Limiter à 2 ou 3 immersions très courtes (1 à 2 secondes max) par séance chez le nourrisson.",
            "Conserver un appui stable des pieds de l'adulte dans une eau à 32°C minimum."
          ],
          skills_observed: [
            { categoryId: 'immersion', categoryName: 'Immersion & Apnée réflexe', skillName: 'Portage vertical et apnée réflexe', status: 'acquis', note: 'Synchronisation conjointe remarquable' },
            { categoryId: 'decouverte_eau', categoryName: "Découverte de l'eau", skillName: "Tolérance au passage sous l'eau", status: 'acquis', note: 'Bébé très calme et souriant' },
            { categoryId: 'interaction', categoryName: 'Interactions avec le parent', skillName: 'Sécurité affective et confiance partagée', status: 'acquis', note: 'Merveilleuse complicité' }
          ]
        }
      },
      en: {
        title: "Baseline 1st Submersion — Vertical Chest Hold Face-to-Face",
        analysis: {
          situation: "1st Submersion: Vertical Chest Hold Face-to-Face (Gold Standard)",
          positive_points: [
            "Secure, enveloping vertical chest hold against parent torso",
            "Smooth joint submersion of 1.5s in perfect synchronization",
            "Warm post-dive recovery: eye-to-eye smile, praise, and immediate cuddle",
            "Clear reflex mouth closure with zero water swallowing"
          ],
          observations: [
            "Parent maintains eye-level connection and submerges underwater alongside baby.",
            "Upon surfacing, baby blinks peacefully, seeks parental eye contact, and smiles.",
            "No shaking or abrupt wiping upon surfacing: seamless, calming transition."
          ],
          priority: "Maintain this vertical face-to-face joint submersion model as the gold standard for all first infant submersions.",
          main_recommendation: "Your technique represents the gold standard! This vertical chest hold combined with joint submersion and immediate affectionate recovery ensures a peaceful dive reflex within optimal emotional security.",
          secondary_recommendations: [
            "Keep 2 to 3 minutes of relaxing floating play between submersions.",
            "Always preserve this warm celebration and embrace after each underwater moment."
          ],
          safety_notes: [
            "Limit to 2 or 3 short submersions (1 to 2 seconds max) per session for infants.",
            "Ensure stable adult footing in warm water (minimum 32°C)."
          ],
          skills_observed: [
            { categoryId: 'immersion', categoryName: 'Immersion & Dive Reflex', skillName: 'Vertical Submersion & Dive Reflex', status: 'acquis', note: 'Remarkable joint synchronization' },
            { categoryId: 'decouverte_eau', categoryName: 'Water Discovery', skillName: 'Underwater Transition Tolerance', status: 'acquis', note: 'Baby completely serene and joyful' },
            { categoryId: 'interaction', categoryName: 'Parent-Baby Bonding', skillName: 'Emotional Security & Mutual Trust', status: 'acquis', note: 'Wonderful parent-baby bond' }
          ]
        }
      },
      es: {
        title: "1ª Inmersión de referencia — Sostén vertical cara a cara",
        analysis: {
          situation: "1ª Inmersión: Sostén vertical cara a cara (Base de referencia)",
          positive_points: [
            "Sostén vertical seguro y envolvente contra el pecho del adulto",
            "Inmersión conjunta fluida de 1.5s perfectamente coordinada",
            "Salida cariñosa con mirada cómplice, sonrisas y abrazo inmediato",
            "Cierre reflejo de la boca sin tragar agua"
          ],
          observations: [
            "El adulto baja al agua junto al bebé manteniendo el contacto visual.",
            "Al salir, el bebé parpadea tranquilo y sonríe.",
            "Transición suave sin sacudidas ni gestos bruscos."
          ],
          priority: "Mantener este modelo de sostén vertical e inmersión conjunta como estándar de referencia.",
          main_recommendation: "¡Tu técnica es el estándar de oro! El sostén vertical cara a cara con inmersión conjunta y abrazo inmediato garantiza un reflejo de inmersión sereno y feliz.",
          secondary_recommendations: [
            "Mantener 2 a 3 minutos de juegos tranquilos entre inmersiones."
          ],
          safety_notes: [
            "Máximo 2 o 3 inmersiones breves (1-2s) por sesión.",
            "Pies bien apoyados en agua a 32°C mínimo."
          ],
          skills_observed: [
            { categoryId: 'immersion', categoryName: 'Inmersión y Reflejo', skillName: 'Sostén vertical y apnea refleja', status: 'acquis', note: 'Sincronización impecable' }
          ]
        }
      },
      pt: {
        title: "1ª Imersão de referência — Porte vertical face a face",
        analysis: {
          situation: "1ª Imersão: Porte vertical face a face (Base de referência)",
          positive_points: [
            "Porte vertical acolhedor contra o peito do adulto",
            "Imersão conjunta de 1.5s em harmonia perfeita",
            "Regresso caloroso à tona com sorriso e abraço imediato",
            "Fecho da boca por reflexo natural sem engolir água"
          ],
          observations: [
            "O adulto desce na água com o bebé mantendo o contacto visual.",
            "Ao regressar à superfície, o bebé pisca os olhos com calma e sorri.",
            "Transição suave e tranquila sem pressa."
          ],
          priority: "Manter o porte vertical e a imersão conjunta como padrão de ouro.",
          main_recommendation: "A sua técnica é exemplar! O porte vertical com imersão conjunta e carinho imediato na saída assegura uma experiência aquática segura e alegre.",
          secondary_recommendations: [
            "Intervalos de 2 a 3 minutos de jogos calmos entre mergulhos."
          ],
          safety_notes: [
            "2 a 3 imersões curtas (1 a 2s) por sessão no máximo."
          ],
          skills_observed: [
            { categoryId: 'immersion', categoryName: 'Imersão e Reflexo', skillName: 'Porte vertical e reflexo', status: 'acquis', note: 'Excelente ligação' }
          ]
        }
      },
      de: {
        title: "Referenz 1. Tauchen — Vertikaler Halt von Angesicht zu Angesicht",
        analysis: {
          situation: "1. Tauchgang: Vertikaler Halt von Angesicht zu Angesicht (Referenz)",
          positive_points: [
            "Geborgener vertikaler Halt eng an der Brust des Elternteils",
            "Gemeinsames sanftes Eintauchen von 1,5s in perfekter Synchronisation",
            "Herzlicher Empfang beim Auftauchen mit Blickkontakt und Kuscheln",
            "Klarer Schließreflex des Mundes ohne Wasserschlucken"
          ],
          observations: [
            "Elternteil taucht auf Augenhöhe gemeinsam mit dem Baby ein.",
            "Beim Auftauchen blinzelt das Baby ruhig und lächelt.",
            "Sanfter, stressfreier Übergang ohne Hektik."
          ],
          priority: "Diesen vertikalen Halt mit gemeinsamem Eintauchen als Goldstandard für alle ersten Tauchversuche beibehalten.",
          main_recommendation: "Ihre Technik ist vorbildlich! Der vertikale Halt von Angesicht zu Angesicht mit gemeinsamem Eintauchen bietet die beste emotionale Sicherheit.",
          secondary_recommendations: [
            "2 bis 3 Minuten Entspannungspausen zwischen den Tauchgängen einhalten."
          ],
          safety_notes: [
            "Maximal 2 bis 3 kurze Tauchgänge (1-2 Sekunden) pro Einheit."
          ],
          skills_observed: [
            { categoryId: 'immersion', categoryName: 'Tauchen & Atemschutzreflex', skillName: 'Vertikales Tauchen & Reflex', status: 'acquis', note: 'Perfekt abgestimmt' }
          ]
        }
      },
      it: {
        title: "1ª Immersione di riferimento — Sostegno verticale faccia a faccia",
        analysis: {
          situation: "1ª Imersione: Sostegno verticale faccia a faccia (Standard di riferimento)",
          positive_points: [
            "Sostegno verticale avvolgente e sicuro contro il petto del genitore",
            "Immersione congiunta fluida di 1.5s perfettamente coordinata",
            "Accoglienza affettuosa alla risalita: sguardi complici, sorrisi e coccola",
            "Chiusura riflessa della bocca senza deglutizione d'acqua"
          ],
          observations: [
            "Il genitore scende in acqua insieme al bambino mantenendo il contatto.",
            "Alla risalita il bambino batte gli occhi serenamente e sorride.",
            "Nessuno scatto brusco: transizione rilassante."
          ],
          priority: "Mantenere questo sostegno verticale con immersione congiunta come standard per le prime immersioni.",
          main_recommendation: "La vostra tecnica è il punto di riferimento assoluto! Il sostegno verticale faccia a faccia con immersione congiunta garantisce sicurezza e serenità.",
          secondary_recommendations: [
            "Rispettare 2-3 minuti di pausa gioco tra un'immersione e l'altra."
          ],
          safety_notes: [
            "Massimo 2 o 3 immersioni brevi (1-2s) per seduta nei neonati."
          ],
          skills_observed: [
            { categoryId: 'immersion', categoryName: 'Immersione e Riflesso', skillName: 'Sostegno verticale e apnea', status: 'acquis', note: 'Sincronizzazione magnifica' }
          ]
        }
      }
    }
  },
  {
    id: 'demo_portage_ventral_vertical',
    situationKey: 'sit_portage_ventral',
    exerciseId: 'exo_tapis_volant',
    videoDuration: 18,
    videoSizeMB: 12.4,
    videoUrl: '/media/demo-videos/glenn%20immersion%20l%C3%A2ch%C3%A9e.mp4',
    thumbnailType: 'portage_ventral',
    confidence: 0.94,
    biomechanics: {
      orientation: 'semi_verticale',
      targetOrientation: 'horizontale',
      correction: "Position semi-verticale observée : s'accroupir dans l'eau pour amener doucement le corps de bébé vers une position horizontale allongée de glisse.",
      parentHoldType: 'Sous-thoracique souple',
      babyRelaxationScore: 88
    },
    translations: {
      fr: {
        title: "Portage ventral — Ajustement vers l'horizontalité",
        analysis: {
          situation: "Portage ventral & glisse",
          positive_points: [
            "Bébé très calme et détendu dans le regard",
            "Mains du parent bienveillantes sous la cage thoracique",
            "Bonne tolérance à l'eau et sourires partagés"
          ],
          observations: [
            "Le parent se tient un peu haut hors de l'eau (épaules émergées), ce qui maintient bébé dans une position inclinée semi-verticale plutôt qu'horizontale.",
            "La posture globale est stable et le tonus bien relâché dans l'eau.",
            "La tête est bien tenue dans l'axe."
          ],
          priority: "Abaisser votre propre posture pour favoriser l'horizontalité du corps de bébé.",
          main_recommendation: "Vous pouvez vous accroupir davantage dans l'eau jusqu'à avoir vos épaules immergées. Cela offrira un plan d'eau parfait pour accompagner le relâchement et la glisse de votre bébé !",
          secondary_recommendations: [
            "Ouvrez vos doigts pour offrir un appui plus large et moins serré sous son thorax."
          ],
          safety_notes: [
            "Toujours maintenir un soutien tactile constant sans lâcher prise.",
            "Garder les voies respiratoires (nez et bouche) bien au-dessus de la ligne de glisse."
          ],
          skills_observed: [
            { categoryId: 'equilibre', categoryName: 'Équilibre & Posture', skillName: 'Horizontalité en position ventrale', status: 'en_progression', note: 'Transition vers la glisse horizontale' },
            { categoryId: 'decouverte_eau', categoryName: "Découverte de l'eau", skillName: "Tolérance au contact de l'eau", status: 'acquis', note: 'Bébé parfaitement serein' },
            { categoryId: 'interaction', categoryName: 'Interactions avec le parent', skillName: 'Maintien du contact visuel rassurant', status: 'acquis', note: 'Magnifique complicité' }
          ]
        }
      },
      en: {
        title: "Supported Prone Hold — Transition to Horizontal Glide",
        analysis: {
          situation: "Supported prone glide",
          positive_points: [
            "Baby is peaceful with calm facial cues",
            "Gentle parent hand placement beneath ribcage",
            "Warm smiles and connection in the water"
          ],
          observations: [
            "Parent is standing relatively high out of water (shoulders emerged), maintaining baby in a tilted semi-vertical posture.",
            "Baby displays calm muscle tone and solid posture in the water.",
            "Head and neck are well aligned."
          ],
          priority: "Lower your own posture to allow baby's body to rest horizontally on the water.",
          main_recommendation: "Crouch deeper in the pool until your shoulders are submerged. This creates a gentle water plane to support smooth gliding and deep relaxation!",
          secondary_recommendations: [
            "Open your palms to provide a wider, softer cradle under the chest."
          ],
          safety_notes: [
            "Maintain continuous tactile support without releasing.",
            "Keep airway (mouth and nose) well above the glide waterline."
          ],
          skills_observed: [
            { categoryId: 'equilibre', categoryName: 'Balance & Posture', skillName: 'Prone Horizontality', status: 'en_progression', note: 'Transition toward horizontal glide' },
            { categoryId: 'decouverte_eau', categoryName: 'Water Discovery', skillName: 'Face Water Contact Tolerance', status: 'acquis', note: 'Baby completely serene' },
            { categoryId: 'interaction', categoryName: 'Bonding & Confidence', skillName: 'Reassuring Eye Contact', status: 'acquis', note: 'Wonderful shared connection' }
          ]
        }
      },
      es: {
        title: "Sostén ventral — Postura semi-vertical hacia horizontal",
        analysis: {
          situation: "Sostén ventral y deslizamiento",
          positive_points: [
            "Bébé muy tranquilo con mirada relajada",
            "Manos del adulto colocadas con cariño bajo el pecho",
            "Sonrisas compartidas en el agua"
          ],
          observations: [
            "El adulto tiene los hombros fuera del agua, lo que mantiene al bebé en postura semi-vertical.",
            "La postura general es estable y el tono muscular está relajado.",
            "La cabeza está bien alineada."
          ],
          priority: "Bajar tu propia postura para favorecer la horizontalidad del cuerpo del bebé.",
          main_recommendation: "Agáchate en el agua hasta sumergir tus hombros. ¡Esto creará una superficie de agua ideal para acompañar el deslizamiento y la relajación del bebé!",
          secondary_recommendations: [
            "Abre las palmas para ofrecer un apoyo más suave bajo el tórax."
          ],
          safety_notes: [
            "Mantener siempre el contacto físico sin soltar.",
            "Vías respiratorias siempre por encima del agua."
          ],
          skills_observed: [
            { categoryId: 'equilibre', categoryName: 'Equilibrio y Postura', skillName: 'Horizontalidad en posición ventral', status: 'en_progression', note: 'Transición hacia la horizontalidad' },
            { categoryId: 'decouverte_eau', categoryName: 'Descubrimiento del agua', skillName: 'Tolerancia al agua en la cara', status: 'acquis', note: 'Bebé muy sereno' }
          ]
        }
      },
      pt: {
        title: "Porte ventral — Ajuste para a horizontalidade",
        analysis: {
          situation: "Porte ventral e deslize",
          positive_points: [
            "Bebé muito calmo e descontraído",
            "Mãos do adulto posicionadas com carinho",
            "Cumplicidade e sorrisos na água"
          ],
          observations: [
            "O adulto tem os ombros fora de água, mantendo o bebé numa postura semi-vertical.",
            "A postura geral é estável e o tónus muscular está relaxado.",
            "A cabeça está bem alinhada."
          ],
          priority: "Baixar a sua própria postura para facilitar a horizontalidade do bebé.",
          main_recommendation: "Baixe-se na água até submergir os ombros. Isso proporcionará um plano de água ideal para acompanhar o deslize e o relaxamento do bebé!",
          secondary_recommendations: [
            "Abra as mãos para um suporte mais macio."
          ],
          safety_notes: [
            "Manter contacto tátil constante.",
            "Boca e nariz sempre fora da água."
          ],
          skills_observed: [
            { categoryId: 'equilibre', categoryName: 'Equilíbrio e Postura', skillName: 'Horizontalidade em posição ventral', status: 'en_progression', note: 'Em evolução para o deslize horizontal' }
          ]
        }
      },
      de: {
        title: "Bauchlage — Übergang zur horizontalen Wasserlage",
        analysis: {
          situation: "Bauchlage und Gleiten",
          positive_points: [
            "Baby ist sehr ruhig und entspannt",
            "Sanfte Handhaltung unter dem Brustkorb",
            "Schöner Blickkontakt und Freude im Wasser"
          ],
          observations: [
            "Eltern stehen etwas zu hoch im Wasser, wodurch das Baby in einer geneigten semi-vertikalen Haltung liegt.",
            "Die Gesamthaltung ist stabil und der Muskeltonus angenehm entspannt.",
            "Kopf und Nacken sind gut ausgerichtet."
          ],
          priority: "Die eigene Körperhaltung senken, um die horizontale Wasserlage des Babys zu unterstützen.",
          main_recommendation: "Gehen Sie tiefer ins Wasser, bis die Schultern eingetaucht sind. Dies schafft eine sanfte Wasserfläche, die das Gleiten und Entspannen optimal fördert!",
          secondary_recommendations: [
            "Handflächen weich öffnen für sanftere Unterstützung."
          ],
          safety_notes: [
            "Stets ununterbrochenen Körperkontakt halten.",
            "Mund und Nase über der Wasserlinie halten."
          ],
          skills_observed: [
            { categoryId: 'equilibre', categoryName: 'Gleichgewicht & Haltung', skillName: 'Horizontale Bauchlage', status: 'en_progression', note: 'Auf dem Weg zur Waagerechten' }
          ]
        }
      },
      it: {
        title: "Sostegno ventrale — Verso la posizione orizzontale",
        analysis: {
          situation: "Sostegno ventrale e scivolamento",
          positive_points: [
            "Bambino calmo e disteso",
            "Mani del genitore posizionate con cura sotto il torace",
            "Bel contatto visivo"
          ],
          observations: [
            "Il genitore ha le spalle fuori dall'acqua, mantenendo il bambino in postura semi-verticale anziché orizzontale.",
            "La postura generale è stabile e il tono muscolare è rilassato.",
            "La testa è ben allineata."
          ],
          priority: "Abbassare la propria postura per favorire l'orizzontalità del bambino.",
          main_recommendation: "Abbassatevi in acqua fino a immergere le spalle. Questo creerà un piano d'acqua ideale per accompagnare lo scivolamento e il rilassamento del bambino!",
          secondary_recommendations: [
            "Aprite i palmi per una presa più morbida."
          ],
          safety_notes: [
            "Mantenere sempre il contatto fisico.",
            "Bocca e naso sempre all'asciutto."
          ],
          skills_observed: [
            { categoryId: 'equilibre', categoryName: 'Equilibrio e Postura', skillName: 'Orizzontalità in posizione ventrale', status: 'en_progression', note: 'Verso la posizione orizzontale' }
          ]
        }
      }
    }
  },
  {
    id: 'demo_flottaison_dorsale_nuque',
    situationKey: 'sit_flottaison_dorsale',
    exerciseId: 'exo_etoile_dorsale',
    videoDuration: 24,
    videoSizeMB: 15.8,
    videoUrl: '/media/demo-videos/lilou%20dos%20brassards.mp4',
    thumbnailType: 'flottaison_dorsale',
    confidence: 0.91,
    biomechanics: {
      orientation: 'horizontale',
      targetOrientation: 'horizontale',
      correction: "Position horizontale dorsale optimale : alignement fluide sur la surface de l'eau avec soutien sous la nuque.",
      parentHoldType: 'Berceau palmaire sous nuque',
      babyRelaxationScore: 92
    },
    translations: {
      fr: {
        title: "Flottaison dorsale — Soutien et oreilles immergées",
        analysis: {
          situation: "Flottaison dorsale avec soutien délicat",
          positive_points: [
            "Bassin bien haut et nombril affleurant la surface",
            "Excellente acceptation des oreilles immergées sans pleurs",
            "Respiration lente et apaisée"
          ],
          observations: [
            "Le soutien sous la nuque est très doux avec 3 doigts.",
            "Léger réflexe d'écartement des bras au début, vite compensé par la voix douce du parent.",
            "Relâchement quasi complet des membres inférieurs."
          ],
          priority: "Maintenir ce rythme doux et alléger encore subtilement l'appui sous l'occiput.",
          main_recommendation: "Votre geste est très sécurisant ! Vous pouvez continuer à murmurer à son oreille et tester un allègement de 2 secondes en ne gardant que l'extrémité des doigts sous sa nuque.",
          secondary_recommendations: [
            "Poursuivre les séances courtes (1 à 2 minutes sur le dos) pour préserver le plaisir."
          ],
          safety_notes: [
            "Ne jamais lâcher complètement la nuque d'un nourrisson sans maître-nageur à vos côtés.",
            "Surveiller que le nez reste orienté à la verticale vers le haut."
          ],
          skills_observed: [
            { categoryId: 'flottaison', categoryName: 'Flottaison', skillName: 'Flottaison dorsale accompagnée', status: 'en_progression', note: 'Très bon relâchement dorsal' },
            { categoryId: 'respiration', categoryName: 'Respiration & Souffle', skillName: 'Régulation émotionnelle et respiratoire', status: 'acquis', note: 'Respiration calme et régulière' }
          ]
        }
      },
      en: {
        title: "Dorsal Float — Gentle Cradle & Ears Submerged",
        analysis: {
          situation: "Gentle supported back float",
          positive_points: [
            "High hips with navel kissing the water surface",
            "Peaceful acceptance of submerged ears with zero crying",
            "Smooth and restful breathing"
          ],
          observations: [
            "Neck support is very tender with soft fingertips.",
            "Full relaxation in lower limbs.",
            "Reassuring whispers from parent maintained serene calm."
          ],
          priority: "Maintain this gentle pace and subtly lighten the support under the neck.",
          main_recommendation: "Your posture is wonderful and deeply secure. Continue whispering near baby's ear and try a 2-second fingertip lightening to let water buoyancy do the work!",
          secondary_recommendations: [
            "Keep back-float moments short (1 to 2 minutes) to preserve comfort."
          ],
          safety_notes: [
            "Never release neck support completely without a certified instructor nearby.",
            "Keep nose pointing straight up to the ceiling/sky."
          ],
          skills_observed: [
            { categoryId: 'flottaison', categoryName: 'Buoyancy & Floating', skillName: 'Supported Back Float', status: 'en_progression', note: 'Great dorsal relaxation' },
            { categoryId: 'respiration', categoryName: 'Breath Control', skillName: 'Calm Breath Regulation', status: 'acquis', note: 'Smooth regular breathing' }
          ]
        }
      }
    }
  },
  {
    id: 'demo_immersion_rituel',
    situationKey: 'sit_immersion_preparee',
    exerciseId: 'exo_petit_plongeon_rituel',
    videoDuration: 15,
    videoSizeMB: 9.6,
    videoUrl: '/media/demo-videos/glenn%20taper%20eau.mp4',
    thumbnailType: 'immersion_rituel',
    confidence: 0.96,
    biomechanics: {
      orientation: 'verticale',
      targetOrientation: 'verticale',
      correction: "Position verticale dynamique : transition en arc souple avec retour sécurisant contre le torse.",
      parentHoldType: 'Soutien bimanuel sous aisselles',
      babyRelaxationScore: 85
    },
    translations: {
      fr: {
        title: "Immersion préparée — Réaction et apnée réflexe",
        analysis: {
          situation: "Immersion préparée avec rituel verbal",
          positive_points: [
            "Signal verbal clair et comptine rythmée avant l'action",
            "Bébé ferme hermétiquement la bouche avant le contact",
            "Sortie de l'eau immédiate suivie d'un contact œil-à-œil chaleureux"
          ],
          observations: [
            "Le passage sous l'eau a duré exactement 1.2 seconde, durée idéale.",
            "Au retour à la surface, le bébé cligne des yeux 2 fois puis sourit au parent.",
            "La trajectoire en arc de cercle était fluide."
          ],
          priority: "Continuer le renforcement positif immédiat après chaque immersion.",
          main_recommendation: "Votre rituel est parfaitement acquis par votre bébé. Félicitez-le toujours immédiatement en serrant son corps contre votre poitrine après l'émersion.",
          secondary_recommendations: [
            "Limiter à 3 ou 4 immersions maximum par séance de 30 minutes."
          ],
          safety_notes: [
            "L'immersion d'un bébé doit toujours être consentie : ne jamais forcer si le bébé refuse le signal rituel.",
            "La surveillance active par un adulte qualifié est indispensable."
          ],
          skills_observed: [
            { categoryId: 'immersion', categoryName: 'Immersion & Apnée réflexe', skillName: 'Compréhension du signal rituel', status: 'acquis', note: 'Anticipation motrice remarquable' },
            { categoryId: 'immersion', categoryName: 'Immersion & Apnée réflexe', skillName: 'Retour souriant à la surface', status: 'en_progression', note: 'Excellente reprise sans panique' }
          ]
        }
      },
      en: {
        title: "Prepared Submersion — Dive Reflex & Surface Smile",
        analysis: {
          situation: "Prepared submersion with verbal cue",
          positive_points: [
            "Crystal clear verbal countdown before immersion",
            "Baby closes mouth securely prior to water entry",
            "Immediate warm eye-to-eye connection upon surfacing"
          ],
          observations: [
            "Underwater pass lasted exactly 1.2 seconds (ideal duration).",
            "Upon surfacing, baby blinked twice and smiled at the parent.",
            "Arc trajectory was smooth and gentle."
          ],
          priority: "Continue immediate positive reinforcement after each immersion.",
          main_recommendation: "Your ritual is beautifully mastered. Always celebrate immediately with hugs and praises to reinforce confidence!",
          secondary_recommendations: [
            "Limit to 3 or 4 immersions maximum per 30-minute pool visit."
          ],
          safety_notes: [
            "Submersion must always be consensual: never force if baby hesitates at the cue.",
            "Active supervision is indispensable."
          ],
          skills_observed: [
            { categoryId: 'immersion', categoryName: 'Immersion & Submersion', skillName: 'Ritual Signal Comprehension', status: 'acquis', note: 'Great motor anticipation' },
            { categoryId: 'immersion', categoryName: 'Immersion & Submersion', skillName: 'Calm Surface Recovery', status: 'en_progression', note: 'Calm post-dive recovery' }
          ]
        }
      }
    }
  },
  {
    id: 'demo_deplacement_battements',
    situationKey: 'sit_deplacement_propulsion',
    exerciseId: 'exo_chasse_aux_canards',
    videoDuration: 22,
    videoSizeMB: 14.1,
    videoUrl: '/media/demo-videos/lilou%20d%C3%A9part%20escalier.mp4',
    thumbnailType: 'deplacement_propulsion',
    confidence: 0.93,
    biomechanics: {
      orientation: 'horizontale',
      targetOrientation: 'horizontale',
      correction: "Position horizontale ventrale : glisse naturelle portée par les battements spontanés.",
      parentHoldType: 'Guidage léger sous le thorax',
      babyRelaxationScore: 90
    },
    translations: {
      fr: {
        title: "Déplacement spontané — Propulsion vers le jouet",
        analysis: {
          situation: "Propulsion spontanée vers un objet flottant",
          positive_points: [
            "Forte motivation visuelle avec le canard flottant",
            "Battements alternés des deux jambes vigoureux",
            "Bras tendus en avant cherchant la préhension"
          ],
          observations: [
            "La coordination des jambes s'enclenche dès que le jouet bouge.",
            "Le parent a tendance à tirer un peu vite le bébé au lieu de le laisser ressentir sa propre poussée.",
            "Bébé rayonne de joie lorsqu'il attrape l'objet."
          ],
          priority: "Laisser le bébé ressentir l'effet de sa propre propulsion en allégeant votre traction.",
          main_recommendation: "Placez le jouet plus près (à 30 cm) et laissez votre bébé faire l'effort de propulsion pendant 2 secondes sans le tirer : il comprendra le lien direct entre ses battements et son avancée !",
          secondary_recommendations: [
            "Variez les couleurs et les textures des jouets flottants."
          ],
          safety_notes: [
            "Garder les mains prêtes à le rattraper en cas de bascule avant.",
            "Ne jamais laisser de jouets au milieu de la piscine sans adulte dans l'eau."
          ],
          skills_observed: [
            { categoryId: 'deplacements', categoryName: 'Déplacements & Propulsion', skillName: 'Battements spontanés alternés', status: 'en_progression', note: 'Belle impulsion motrice' },
            { categoryId: 'deplacements', categoryName: 'Déplacements & Propulsion', skillName: 'Déplacement orienté vers un jouet', status: 'en_progression', note: 'Intentionnalité claire' }
          ]
        }
      },
      en: {
        title: "Spontaneous Kicking — Toy Propulsion Chase",
        analysis: {
          situation: "Spontaneous propulsion towards floating toy",
          positive_points: [
            "High visual motivation targeting the floating duck",
            "Energetic alternating leg kicks",
            "Forward reaching arms"
          ],
          observations: [
            "Kicking engages spontaneously as the toy moves.",
            "Parent tends to pull slightly fast rather than letting baby feel self-propulsion.",
            "Baby is glowing with joy upon reaching the toy."
          ],
          priority: "Let baby feel the direct effect of their own leg propulsion by loosening forward traction.",
          main_recommendation: "Place the toy 30 cm ahead and pause for 2 seconds without pulling: baby will clearly understand that their leg kicks are what make them move forward!",
          secondary_recommendations: [
            "Vary textures and colors of floating toys."
          ],
          safety_notes: [
            "Keep hands ready to support in case of sudden forward tilt.",
            "Never leave toys in the pool without adult presence."
          ],
          skills_observed: [
            { categoryId: 'deplacements', categoryName: 'Propulsion & Kicks', skillName: 'Alternating Leg Kicks', status: 'en_progression', note: 'Great motor impulse' },
            { categoryId: 'deplacements', categoryName: 'Propulsion & Kicks', skillName: 'Goal-Oriented Movement', status: 'en_progression', note: 'Clear intentionality' }
          ]
        }
      }
    }
  }
];

// Helper functions to get localized pedagogical structures
export function getLocalizedSkillCategories(locale: string = 'fr'): SkillCategory[] {
  const code = (locale || 'fr').toLowerCase().split('-')[0];

  return Object.values(SKILL_CATEGORIES_DATA).map((cat) => {
    // 1. Check external translations (ES, DE, PT, IT, NL, RU, ZH, JA, AR, etc.)
    const extTrans = getTranslatedCategoryByLocale(cat.id, locale);
    if (extTrans) {
      return {
        id: cat.id,
        title: extTrans.title,
        description: extTrans.description,
        icon: extTrans.icon || cat.translations['fr']?.icon || '🌊',
        badge: extTrans.badge,
        ageRange: extTrans.ageRange,
        keyPrinciple: extTrans.keyPrinciple,
        skills: (extTrans.skills && extTrans.skills.length > 0 ? extTrans.skills : (cat.translations['en']?.skills || cat.translations['fr'].skills)).map((s) => ({
          id: s.id,
          name: s.name,
          categoryId: cat.id,
          description: s.description,
          observationChecklist: s.observationChecklist,
          ageRange: s.ageRange,
          level: s.level,
          keyAdvice: s.keyAdvice,
          relatedExerciseId: s.relatedExerciseId,
          relatedArticleId: s.relatedArticleId
        }))
      };
    }

    // 2. Check embedded translations
    const trans = cat.translations[locale] || cat.translations[code] || (locale.startsWith('fr') ? cat.translations['fr'] : (cat.translations['en'] || cat.translations['fr']));
    return {
      id: cat.id,
      title: trans.title,
      description: trans.description,
      icon: trans.icon,
      badge: trans.badge,
      ageRange: trans.ageRange,
      keyPrinciple: trans.keyPrinciple,
      skills: trans.skills.map((s) => ({
        id: s.id,
        name: s.name,
        categoryId: cat.id,
        description: s.description,
        observationChecklist: s.observationChecklist,
        ageRange: s.ageRange,
        level: s.level,
        keyAdvice: s.keyAdvice,
        relatedExerciseId: s.relatedExerciseId,
        relatedArticleId: s.relatedArticleId
      }))
    };
  });
}

export function getLocalizedSituations(locale: string = 'fr'): SituationDefinition[] {
  const code = (locale || 'fr').toLowerCase().split('-')[0];

  return Object.values(SITUATIONS_DATA).map((sit) => {
    // 1. Check external translations
    const extTrans = getTranslatedSituationByLocale(sit.id, locale);
    if (extTrans) {
      return {
        id: sit.id,
        category: sit.category,
        title: extTrans.title,
        description: extTrans.description,
        iconName: sit.iconName,
        observationCriteria: extTrans.observationCriteria,
        recommendedAgeRange: extTrans.recommendedAgeRange
      };
    }

    // 2. Check embedded translations
    const trans = sit.translations[locale] || sit.translations[code] || (locale.startsWith('fr') ? sit.translations['fr'] : (sit.translations['en'] || sit.translations['fr']));
    return {
      id: sit.id,
      category: sit.category,
      title: trans.title,
      description: trans.description,
      iconName: sit.iconName,
      observationCriteria: trans.observationCriteria,
      recommendedAgeRange: trans.recommendedAgeRange
    };
  });
}

export function getLocalizedSituation(id: string, locale: string = 'fr'): SituationDefinition {
  const all = getLocalizedSituations(locale);
  return all.find((s) => s.id === id) || all[0];
}

export function getLocalizedExercises(locale: string = 'fr'): ExerciseItem[] {
  const code = (locale || 'fr').toLowerCase().split('-')[0];

  return Object.values(EXERCISES_DATA).map((exo) => {
    // 1. Check external translations
    const extTrans = getTranslatedExerciseByLocale(exo.id, locale);
    if (extTrans) {
      return {
        id: exo.id,
        title: extTrans.title,
        objective: extTrans.objective,
        level: exo.level,
        recommendedAge: extTrans.recommendedAge,
        situationCategory: exo.situationCategory,
        image: (exo as any).image,
        imageCaption: (exo as any).imageCaption,
        steps: extTrans.steps,
        commonMistakes: extTrans.commonMistakes,
        corrections: extTrans.corrections,
        safetyTips: extTrans.safetyTips,
        duration: extTrans.duration,
        repetition: extTrans.repetition,
        tags: extTrans.tags,
        evolutionGuide: extTrans.evolutionGuide,
        boatGame: extTrans.boatGame
      };
    }

    // 2. Check embedded translations
    const trans = exo.translations[locale] || exo.translations[code] || (locale.startsWith('fr') ? exo.translations['fr'] : (exo.translations['en'] || exo.translations['fr']));
    return {
      id: exo.id,
      title: trans.title,
      objective: trans.objective,
      level: exo.level,
      recommendedAge: trans.recommendedAge,
      situationCategory: exo.situationCategory,
      image: (exo as any).image,
      imageCaption: (exo as any).imageCaption,
      steps: trans.steps,
      commonMistakes: trans.commonMistakes,
      corrections: trans.corrections,
      safetyTips: trans.safetyTips,
      duration: trans.duration,
      repetition: trans.repetition,
      tags: trans.tags,
      evolutionGuide: trans.evolutionGuide,
      boatGame: trans.boatGame
    };
  });
}

export function getLocalizedExercise(id: string, locale: string = 'fr'): ExerciseItem {
  const all = getLocalizedExercises(locale);
  return all.find((e) => e.id === id) || all[0];
}

export function getLocalizedDemoScenarios(locale: string = 'fr') {
  const code = (locale || 'fr').toLowerCase().split('-')[0];

  return DEMO_SCENARIOS_DATA.map((scenario) => {
    const translationsMap = scenario.translations as Record<string, any>;
    let trans = translationsMap[locale] || translationsMap[code];
    if (!trans) {
      if (code === 'zh' && zhDemoScenarios[scenario.id]) {
        trans = zhDemoScenarios[scenario.id];
      } else if (code === 'ja' && jaDemoScenarios[scenario.id]) {
        trans = jaDemoScenarios[scenario.id];
      }
    }
    if (!trans) {
      trans = translationsMap['en'] || translationsMap['fr'];
    }
    return {
      id: scenario.id,
      title: trans.title,
      situationKey: scenario.situationKey,
      videoDuration: scenario.videoDuration,
      videoSizeMB: scenario.videoSizeMB,
      videoUrl: scenario.videoUrl,
      thumbnailType: scenario.thumbnailType,
      analysis: {
        situation: trans.analysis.situation,
        confidence: scenario.confidence,
        positive_points: trans.analysis.positive_points,
        observations: trans.analysis.observations,
        priority: trans.analysis.priority,
        main_recommendation: trans.analysis.main_recommendation,
        secondary_recommendations: trans.analysis.secondary_recommendations,
        safety_notes: trans.analysis.safety_notes,
        exerciseId: scenario.exerciseId,
        skills_observed: trans.analysis.skills_observed,
        biomechanics: scenario.biomechanics
      }
    };
  });
}

// Fallback direct exports for backward compatibility
export const SKILL_CATEGORIES = getLocalizedSkillCategories('fr');
export const SITUATIONS_CATALOG = getLocalizedSituations('fr');
export const EXERCISES_CATALOG = getLocalizedExercises('fr');
export const DEMO_SCENARIOS = getLocalizedDemoScenarios('fr');
