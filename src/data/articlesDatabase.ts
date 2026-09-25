import { PedagogicalArticle } from '../types';
import { getTranslatedArticlesByLocale } from './articlesTranslations';

export const PEDAGOGICAL_ARTICLES: Record<string, PedagogicalArticle[]> = {
  fr: [
    {
      id: 'eveil-aquatique-decouverte-eau',
      image: "/media/articles/decouverte-eau-motricite.webp",
      imageCaption: "Complicité, repères pratiques et éveil sensoriel tout en douceur dans l'eau chaude.",
      slug: 'l-eveil-aquatique-bien-plus-qu-une-decouverte-de-l-eau',
      title: "L’éveil aquatique & bébé mode d'emploi : le guide complet de chaque tout-petit",
      category: 'psychomotor',
      categoryLabel: "Développement Psychomoteur & Éveil",
      readingTime: "7 min",
      icon: "🌊",
      badge: "Guide Fondateur & Mode d'Emploi",
      summary: "De la préparation médicale et pratique à la découverte sensorielle et motrice dans l'eau chaude : tout ce qu'il faut savoir pour accompagner son enfant pas à pas, dans le respect absolu de sa singularité et sans jamais forcer.",
      featured: true,
      publishedDate: "2026-08-16",
      author: "Équipe Pédagogique & Médicale Baby Swim Vision",
      tags: ["Éveil aquatique", "Mode d'emploi", "Bébé unique", "Relation parent-bébé", "Vaccins & Certificat", "Psychomotricité", "Autonomie", "Température 32°C", "Sans performance"],
      content: {
        introduction: "L’éveil aquatique est une aventure familiale basée sur le jeu, la relation et la confiance partagée. Ce n’est pas un cours de natation au sens traditionnel du terme : le tout-petit n’est pas là pour exécuter des mouvements codifiés, mais pour apprivoiser un nouvel environnement, ressentir son corps libéré de la pesanteur et construire ses propres repères dans l’eau.\n\nPour vivre pleinement cette expérience, de la préparation pratique et médicale aux secrets de l'autonomie progressive, voici le mode d'emploi essentiel pour accompagner chaque enfant au rythme de sa propre singularité.",
        sections: [
          {
            title: "1. Conditions médicales et démarches : pour bien commencer",
            paragraphs: [
              "• Âge de début : Dès 4 mois et jusqu'à 3 ans, après les deux premières séries d'injections vaccinales obligatoires (2 et 4 mois).",
              "• Certificat médical : Un certificat médical de non-contre-indication délivré par le pédiatre ou médecin traitant est requis.",
              "• Contre-indications absolues : Certaines cardiopathies congénitales, affections respiratoires sévères, déficits immunitaires majeurs, troubles de la déglutition ou otite avec tympan perforé (les aérateurs transtympaniques/yoyos autorisent la baignade douce de surface mais interdisent les immersions).",
              "• Contre-indications relatives (sur accord médical) : Asthme du nourrisson, antécédents convulsifs.",
              "• Contre-indications temporaires : Fièvre, gastro-entérite/diarrhée, otite aiguë ou maladie cutanée contagieuse. Dans ce cas, reportez simplement la séance à la semaine suivante."
            ],
            keyPoints: [
              "Début dès 4 mois après les vaccins des 2 et 4 mois",
              "Certificat médical de non-contre-indication pédiatrique",
              "Report systématique en cas de fièvre, diarrhée ou poussée infectieuse"
            ]
          },
          {
            title: "2. Préparation pratique & rituel d'une séance réussie",
            paragraphs: [
              "• Nutrition : Aucun gros repas ni biberon dans l'heure qui précède la séance pour prévenir les régurgitations.",
              "• Hygiène et douche savonnée : Passage aux toilettes (ou couche de bain étanche adaptée), mouchage, démaquillage des parents et douche savonnée intégrale obligatoire. Une bonne douche élimine les résidus de sueur et de cosmétiques, ce qui réduit drastiquement les chloramines irritantes pour les yeux et les voies respiratoires des bébés.",
              "• Température du bassin : L'eau doit être chauffée entre 31°C et 33°C (idéalement 32°C). La thermorégulation du nourrisson étant immature, une eau suffisamment chaude est essentielle à sa détente.",
              "• Durée de la séance : De 20 à 30 minutes maximum pour les 4-18 mois, et jusqu'à 45 minutes pour les 18 mois-4 ans. Prévoyez toujours une tétée ou un encas réconfortant à la sortie."
            ],
            keyPoints: [
              "Estomac léger (1h sans repas lourd avant le bain)",
              "Douche savonnée obligatoire pour un air et une eau purs",
              "Bassin chauffé à 32°C et durée calibrée (20 à 30 min max chez les petits)"
            ]
          },
          {
            title: "3. Une activité avant tout basée sur la relation et la sécurité affective",
            paragraphs: [
              "L’éveil aquatique est avant tout une expérience émotionnelle partagée.",
              "Le bébé découvre l’eau dans les bras de son parent : il ressent son contact rassurant, cherche son regard, écoute sa voix et s'imprègne de ses réactions.",
              "La qualité de présence de l’adulte est essentielle : le parent ne doit pas simplement « tenir » son enfant, mais l'accompagner, l'observer, lui parler, jouer avec lui et lui offrir un socle de sécurité inconditionnel.",
              "Votre calme et votre enthousiasme sont communicatifs : un parent détendu, qui s'immerge les épaules et joue à « faire coucou » ou souffler des bulles, transmet immédiatement une confiance sereine à son bébé."
            ],
            keyPoints: [
              "Le parent est un repère sécurisant et un partenaire de découverte",
              "Sensation d'enveloppement aquatique et de complicité affective",
              "Un bébé écouté et rassuré est un enfant libre d'explorer"
            ]
          },
          {
            title: "4. L'eau libère le corps de la pesanteur : l'éveil global en 5 dimensions",
            paragraphs: [
              "Sur la terre ferme, le bébé lutte constamment contre la gravité pour contrôler ses membres. Dans l’eau, son corps s'allège grâce à la poussée d'Archimède.",
              "L'eau lui offre une liberté motrice incomparable : il ose des mouvements inaccessibles au sol, découvre ses appuis, expérimente la flottaison et ressent les résistances du liquide.",
              "L’éveil aquatique nourrit ainsi le développement global de l'enfant dans 5 dimensions majeures :",
              "• Dimension affective : renforcement du lien d'attachement et complicité parent-bébé.",
              "• Dimension psychique : apaisement sensoriel, confiance en soi et sentiment de sécurité.",
              "• Dimension motrice : découverte du schéma corporel, dissociation des mouvements et équilibration tridimensionnelle.",
              "• Dimension cognitive : curiosité, compréhension spatiale et apprentissage par essais et erreurs.",
              "• Dimension sociale : découverte des autres enfants, observation bienveillante et partage du bassin."
            ],
            keyPoints: [
              "Allègement corporel et liberté motrice tridimensionnelle",
              "Enrichissement profond du schéma corporel et de la proprioception",
              "Développement harmonieux des 5 sphères de la petite enfance"
            ]
          },
          {
            title: "5. Apprendre par essais-erreurs : construire des appuis sûrs",
            paragraphs: [
              "Dans l’eau, l’enfant apprend en expérimentant : il observe, tente un geste, rate parfois, réajuste sa posture et trouve sa propre solution.",
              "Un jouet qui lui échappe, une éclaboussure inattendue ou un mouvement qui ne le fait pas avancer sont autant d'opportunités d'ajustement moteur.",
              "L’échec temporaire n'est pas le contraire de la réussite : il est l'étape indispensable qui permet au cerveau et aux muscles de construire des appuis aquatiques solides.",
              "Le rôle du parent est d'encourager chaque tentative sans devancer systématiquement l'enfant, en le laissant acteur de ses réussites."
            ],
            keyPoints: [
              "L'expérimentation active développe l'adaptabilité psychomotrice",
              "L'ajustement postural découle de la répétition ludique et bienveillante",
              "Valoriser l'effort et l'exploration plutôt que le résultat immédiat"
            ]
          },
          {
            title: "6. Chaque bébé est unique : singularité, autonomie et patience d'or",
            paragraphs: [
              "Tapis flottants, tunnels, toboggans... chaque enfant aborde l'eau avec son tempérament propre : certains sont de calmes observateurs qui ont besoin de temps, d'autres sont de petits aventuriers intrépides.",
              "L'autonomie dans l'eau s'installe pas à pas, par paliers de quelques secondes, un peu comme l'apprentissage d'une langue.",
              "Repère indicatif : si votre enfant marche vers 18 mois, comptez environ le double de temps pour qu'il soit véritablement autonome dans l'eau.",
              "Sa première coordination motrice spontanée ? Le fameux « petit chien », une propulsion instinctive, naturelle et efficace.",
              "Règle d'or de la patience : plus vous forcez un enfant, moins il coopère. Laissez venir le déclic à son rythme : c'est chez les enfants respectés dans leur tempo que l'on observe les progrès les plus radieux et durables."
            ],
            keyPoints: [
              "Respecter la personnalité et le rythme singulier de chaque enfant",
              "Autonomie aquatique progressive (environ le double de l'âge de la marche)",
              "Première nage instinctive : le 'petit chien'",
              "La patience et l'absence de pression garantissent le déclic naturel"
            ]
          },
          {
            title: "7. Pas de compétition : aimer l'eau avant de savoir nager",
            paragraphs: [
              "Il ne s'agit en aucun cas de fabriquer de futurs champions ou d'enseigner des nages codifiées (brasse ou crawl, qui s'apprennent vers 5-6 ans).",
              "L'unique finalité est de permettre à l'enfant de se sentir bien dans l'eau, en totale confiance et en sécurité.",
              "Règle de sécurité vitale à enseigner dès le plus jeune âge : « Si je suis dans l'eau, tu peux venir ; sinon, tu restes sur le bord. »",
              "L'enfant doit toujours évoluer sous la surveillance active et continue de son parent, à portée de bras immédiate."
            ],
            warning: "Règle d'or absolue : 'Si papa/maman est dans l'eau avec toi, tu peux entrer ; sinon, tu restes assis sur le bord.' Surveillance active à portée de main en permanence."
          }
        ],
        takeaways: [
          "Démarrage dès 4 mois avec certificat médical et vaccins à jour, dans un bassin chauffé à 32°C.",
          "Préparation sereine : douche savonnée intégrale, estomac léger et séances de 20 à 30 min.",
          "L'eau allège le corps et développe l'enfant sur 5 plans : affectif, psychique, moteur, cognitif et social.",
          "Chaque bébé avance à son rythme : l'apprentissage se fait par essais-erreurs, sans forcer ni comparer.",
          "Patience et bienveillance priment : avant de savoir nager, le tout-petit apprend d'abord à aimer et respecter l'eau !"
        ],
        sources: [
          "Fédération Française de Natation (FFN) — Éveil aquatique et familiarisation",
          "Société Française de Pédiatrie (SFP) — Recommandations pour les nourrissons en milieu aquatique",
          "Psychomotricité et schémas moteurs du jeune enfant"
        ]
      }
    },
    {
      id: 'when-to-start-pool-choice',
      image: "/media/articles/securisation-soutiens.webp",
      imageCaption: "Le plaisir d'une première séance réussie dans un bassin adapté à 32°C.",
      slug: 'quand-emmener-bebe-piscine-choisir-premiere-seance',
      title: "Quand emmener son bébé à la piscine & température de l'eau : guide complet de la 1ère séance",
      category: 'parenting',
      categoryLabel: "Guide Parents & Première Séance",
      readingTime: "5 min",
      icon: "🏊",
      badge: "Guide Pratique & Confort Thermique",
      summary: "Âge idéal, préhension volontaire, eau à 32°C, durée de 20-30 min, signes de refroidissement à surveiller et choix d'un bassin avec maître-nageur dans l'eau.",
      featured: true,
      publishedDate: "2026-08-16",
      author: "Équipe Pédagogique & Médicale Baby Swim Vision",
      tags: ["Première séance", "Âge bébé nageur", "Température 32°C", "Durée séance", "Refroidissement", "Choix piscine", "Maître-nageur dans l'eau"],
      content: {
        introduction: "La première séance de piscine avec un bébé est une magnifique aventure sensorielle pour l'enfant comme pour ses parents. Cependant, le corps du tout-petit se refroidit beaucoup plus vite que celui d'un adulte et ses sens sont très vite sollicités. Pour réussir cette découverte, l'âge de départ, la température du bassin (32°C), la durée de la baignade et la qualité de l'encadrement sont les piliers essentiels.",
        sections: [
          {
            title: "1. À quel âge commencer ? Le repère de la préhension",
            paragraphs: [
              "• Dès 4 mois : après les deux premières injections vaccinales obligatoires et avec un certificat médical de non-contre-indication.",
              "• Le signe du développement moteur : l'apparition de la préhension volontaire (vers 4-6 mois). Lorsque le bébé tend la main, attrape un objet flottant et suit du regard son environnement, il est prêt à participer activement à ses découvertes aquatiques plutôt que de simplement subir le bain.",
              "• Pas de pression d'âge : chaque enfant peut débuter plus tard en toute sérénité selon son confort et ses envies."
            ],
            keyPoints: [
              "Accessible dès 4 mois après les vaccins obligatoires",
              "La préhension volontaire marque le début de l'exploration active",
              "Respecter le rythme et la disponibilité de l'enfant"
            ]
          },
          {
            title: "2. La température de l'eau : pourquoi 32°C est indispensable",
            paragraphs: [
              "La thermorégulation du nourrisson est encore très immature et le corps perd sa chaleur 4 fois plus rapidement dans l'eau que dans l'air. Une eau trop froide crispe le bébé et bloque son envie d'explorer.",
              "• Moins de 12 à 18 mois : eau chauffée entre 31°C et 33°C (idéalement 32°C).",
              "• À partir de 18 mois : 30°C à 31°C restent confortables pour des enfants plus actifs.",
              "• Règle thermique du portage : gardez toujours les épaules de votre bébé sous l'eau. Les épaules et le thorax mouillés à l'air libre sont la principale source de déperdition thermique."
            ],
            keyPoints: [
              "Bassin chauffé à 32°C (minimum 31°C) avant 18 mois",
              "Maintenir les épaules de bébé immergées pour éviter qu'il ne se refroidisse",
              "La chaleur favorise le relâchement musculaire et la confiance"
            ]
          },
          {
            title: "3. Durée de la séance et signes de refroidissement à surveiller",
            paragraphs: [
              "• Durée recommandée : 20 à 30 minutes maximum pour les moins de 18 mois (jusqu'à 40-45 min pour les 18 mois - 3 ans). Mieux vaut une séance courte, chaleureuse et joyeuse qu'une séance trop longue où s'installe l'inconfort.",
              "• Signes de refroidissement (sortie immédiate requise) : lèvres bleuies ou violacées, frissons, petits claquements de la mâchoire, marbrures ou pâleur cutanée.",
              "• Signes de fatigue sensorielle : bébé qui baille, se frotte les yeux, détourne le regard, devient grognon ou s'agrippe sans vouloir jouer.",
              "• À la sortie : enroulez immédiatement l'enfant dans une grande serviette sèche et chaude en couvrant bien la tête et la nuque. Prévoyez une tétée ou un encas réconfortant (l'eau creuse l'appétit !)."
            ],
            warning: "30 minutes est un plafond, pas un objectif : sortez de l'eau dès les premiers signes de frissons ou de fatigue pour garder un souvenir 100% positif."
          },
          {
            title: "4. Bien choisir sa piscine : les critères essentiels",
            paragraphs: [
              "Les bassins sportifs municipaux (souvent à 27-28°C avec de fortes résonances sonores) ne conviennent pas aux bébés.",
              "Privilégiez une structure d'éveil aquatique offrant :",
              "• Un bassin chauffé à 32°C avec un niveau sonore et une luminosité apaisants.",
              "• Un maître-nageur physiquement présent dans l'eau avec les familles pour conseiller les prises de portage, sécuriser et guider les parents.",
              "• Une pédagogie libre et ludique sans exercices imposés ni esprit de performance."
            ],
            keyPoints: [
              "Bassin dédié à l'éveil aquatique (chaleur et calme)",
              "Présence active du maître-nageur dans le bassin",
              "Pédagogie bienveillante centrée sur le jeu"
            ]
          },
          {
            title: "5. L'éveil des 5 sens : savourer sans compétition",
            paragraphs: [
              "La première séance est une formidable explosion sensorielle : le toucher (pression douce et flottaison), la vue (reflets et couleurs), l'ouïe (clapotis réconfortants), l'odorat et le goût (lèvres effleurées).",
              "Il n'y a aucun résultat à atteindre : poser les pieds dans l'eau, toucher un jouet flottant ou sourire dans les bras de son parent constituent déjà de magnifiques réussites."
            ]
          }
        ],
        takeaways: [
          "Démarrage dès 4 mois avec vaccins à jour et préhension volontaire.",
          "Température impérative : 32°C avec épaules de bébé immergées dans l'eau.",
          "Séance courte de 20 à 30 min max : sortir au premier signe de lèvre bleutée ou de fatigue.",
          "Choisir un bassin adapté avec un maître-nageur présent dans l'eau avec les parents.",
          "Serviette chaude et tétée/goûter prêts dès la sortie du bassin !"
        ],
        sources: [
          "Société Française de Pédiatrie (SFP) — Thermorégulation et activités aquatiques du nourrisson",
          "Fédération Française de Natation (FFN) — Guide de l'éveil aquatique"
        ]
      }
    },
    {
      id: 'first-immersion-milestone',
      image: "/media/articles/premiere-immersion-7-secondes.webp",
      imageCaption: "Immersion douce et conjointe : le regard complice parent-bébé.",
      slug: 'le-grand-plongeon-premiere-immersion-mode-d-emploi',
      title: "Le grand plongeon & 1ère immersion : le guide complet en 7 secondes",
      category: 'psychomotor',
      categoryLabel: "Aisance Aquatique & Immersion",
      readingTime: "6 min",
      icon: "💧",
      badge: "Étape Clé & Protocole 7s",
      summary: "« A-t-il déjà été baptisé ? » Du rituel de préparation en 7 secondes à la descente tonique, en passant par le maintien nuque-bassin et la dédramatisation de la tasse : le guide complet pour une immersion sereine où bébé reste l'acteur principal.",
      featured: true,
      publishedDate: "2026-08-16",
      author: "Équipe Pédagogique Baby Swim Vision",
      tags: ["Première immersion", "Le grand plongeon", "Mode d'emploi", "Chronologie 7s", "Sous l'eau", "Boire la tasse", "Remontée passive", "Axe tête-tronc", "Confiance"],
      goldenRule: "Descente douce, continue et franche sans saccade. Le bébé est maintenu à la verticale face au parent, axe tête-tronc aligné, remontée portée par la poussée d'Archimède.",
      timelineSteps: [
        {
          second: "0s",
          title: "Position de départ en surface",
          action: "Maintien vertical et contact visuel",
          iconType: "surface",
          detail: "Le bébé est à la verticale face au parent, épaules immergées. Une main sous la nuque/l'occiput, l'autre soutenant le bas du dos et le bassin.",
          depthLevel: "surface"
        },
        {
          second: "1s",
          title: "Rituel d'annonce et signal",
          action: "Repère verbal ou souffle doux",
          iconType: "prepare",
          detail: "Signal rituel (« 1, 2, 3… on plonge ! » ou souffle doux sur les joues). L'enfant ferme réflexement les yeux et la bouche sans surprise.",
          depthLevel: "surface"
        },
        {
          second: "2s",
          title: "Entrée progressive dans l'eau",
          action: "Descente conjointe douce et franche",
          iconType: "entry",
          detail: "Début de la descente continue avec le parent. La tête entre dans l'eau avec l'axe tête-tronc parfaitement maintenu droit.",
          depthLevel: "transition"
        },
        {
          second: "3s",
          title: "Immersion complète sous l'eau",
          action: "Passage bref sous l'eau (1-2s)",
          iconType: "submerged",
          detail: "Le bébé est sous l'eau. Le réflexe d'apnée joue son rôle protecteur. Sérénité et calme total du parent.",
          depthLevel: "underwater"
        },
        {
          second: "4s",
          title: "Continuité de la trajectoire",
          action: "Courbe fluide sans à-coups",
          iconType: "deep",
          detail: "Trajectoire fluide et continue sous l'eau sans hésitation ni à-coups saccadés.",
          depthLevel: "underwater"
        },
        {
          second: "5s",
          title: "Remontée portée par Archimède",
          action: "Flottaison naturelle et allègement",
          iconType: "stable",
          detail: "La poussée d'Archimède porte l'enfant vers le haut. Le parent allège sa traction pour laisser l'eau hisser le bébé.",
          depthLevel: "underwater"
        },
        {
          second: "6s",
          title: "Sortie d'eau et retour en surface",
          action: "Réapparition souriante de la tête",
          iconType: "ascend",
          detail: "La tête réapparaît à l'air libre. Le parent sourit avec fierté et réconfort.",
          depthLevel: "transition"
        },
        {
          second: "7s",
          title: "Accueil, câlin et célébration",
          action: "Félicitations et sécurité affective",
          iconType: "exit",
          detail: "Câlin chaleureux contre le torse, félicitations et mots doux pour ancrer la réussite motrice.",
          depthLevel: "surface"
        }
      ],
      content: {
        introduction: "« A-t-il déjà été baptisé ? » C'est la question fondatrice que pose tout maître-nageur attentif avant d'aborder le grand bassin — car la réponse rythme toute l'approche de la séance et l'histoire aquatique de votre enfant.\n\nLoin des gestes brusques, des surprises ou des immersions forcées d'autrefois, une première immersion réussie repose sur une harmonie précise : une relation de confiance partagée, une prise ergonomique sécurisante, un rituel bienveillant en 7 secondes et une compréhension intime de la poussée d'Archimède.",
        sections: [
          {
            title: "Le bon moment et la confiance partagée",
            paragraphs: [
              "Le moment idéal pour la première immersion dépend de l'âge et de l'autonomie motrice de l'enfant : avant qu'il ne tienne assis, on l'aide à se positionner au bord, généralement dès la deuxième séance une fois les repères sonores et visuels du bassin bien apprivoisés.",
              "Chaque éducateur est profondément ému par la confiance que lui accordent les parents à ce moment charnière.",
              "Le professionnel tient l'enfant par les mains en parfaite synchronie avec le parent, prêt à l'accompagner sous l'eau puis à le faire remonter immédiatement vers des bras chaleureux et sécurisants."
            ],
            keyPoints: [
              "Première immersion idéale dès la 2ème séance après familiarisation globale",
              "Accompagnement bienveillant et synchronisé avec le maître-nageur",
              "Accueil de toutes les émotions : rires, surprise ou câlins d'apaisement"
            ]
          },
          {
            title: "La prise de main sécurisante et l'axe tête-tronc",
            paragraphs: [
              "Pour sécuriser bébé et lui offrir une lecture spatiale limpide, la prise recommandée est bimanuelle : bébé placé face à vous, épaules bien immergées, une main soutenant délicatement la nuque et la base de la tête, l'autre paume calée dans le bas du dos ou sous le bassin.",
              "Veillez à maintenir la tête bien droite dans l'axe naturel du tronc : cet alignement strict empêche l'eau de refluer dans les fosses nasales lors de l'entrée dans l'élément liquide.",
              "Ce positionnement face à face garantit un contact visuel ininterrompu, véritable pilier de la réassurance affective."
            ],
            keyPoints: [
              "Maintien bimanuel : soutien nuque/occiput + bas du dos/bassin",
              "Alignement strict axe tête-cou-rachis pour protéger le nez et la glotte",
              "Contact visuel face à face continu"
            ]
          },
          {
            title: "La chronologie précise de l'immersion (Le rituel des 7 secondes)",
            paragraphs: [
              "Pour que l'expérience soit vécue comme un jeu prévisible sans aucun effet de surprise, découpez le geste selon ce timing fluide :",
              "• Seconde 0 (Connexion) : Épaules de bébé dans l'eau, regard ancré dans le vôtre, vous souriez calmement.",
              "• Seconde 1 (L'annonce claire) : Vous prévenez avec un repère verbal rituel (« 1, 2, 3… on plonge ! » ou un souffle doux sur ses joues pour déclencher la fermeture réflexe des yeux et de la bouche).",
              "• Seconde 2 (Entrée progressive) : Vous descendez ensemble dans l'eau d'un mouvement franc et continu.",
              "• Secondes 3 & 4 (Le passage sous l'eau) : Bébé est immergé brièvement (1 à 2 secondes maximum). Le réflexe d'apnée joue son rôle protecteur.",
              "• Seconde 5 (Remontée portée) : La poussée d'Archimède guide la remontée vers la surface pendant que vous allégez vos mains.",
              "• Seconde 6 (La sortie et l'accueil) : La tête réapparaît à l'air libre. Vous souriez avec fierté.",
              "• Seconde 7 (La célébration) : Câlin chaleureux, mots doux et félicitations joyeuses pour valider cette belle victoire motrice."
            ],
            keyPoints: [
              "Rituel verbal ou souffle d'annonce pour bannir tout effet de surprise",
              "Immersion brève de 1 à 2 secondes sous l'eau",
              "Accueil chaleureux immédiat à la sortie"
            ]
          },
          {
            title: "Le geste biomécanique juste : descente tonique et poussée d'Archimède",
            paragraphs: [
              "Plus on descend de manière franche et continue, plus la poussée d'Archimède propulse naturellement l'enfant vers la surface.",
              "Le secret technique ? Montrez d'abord le geste avec votre propre visage et votre souffle, puis immergez-vous ensemble dans une courbe fluide d'environ 5 secondes sans à-coups ni saccades.",
              "Une immersion trop hésitante ou saccadée brouille le réflexe d'apnée — c'est dans ce flottement qu'un bébé risque d'avaler de l'eau.",
              "Pendant la remontée, ne lâchez jamais l'enfant, mais allégez votre traction : laissez-le sentir que c'est la portance naturelle de l'eau qui le hisse vers l'air libre. L'eau devient alors une alliée rassurante qui le porte."
            ],
            keyPoints: [
              "Descente franche et continue sans à-coups hésitants",
              "Remontée passive portée par la poussée d'Archimède",
              "L'adulte sécurise sans tirer violemment vers le haut"
            ]
          },
          {
            title: "Dédramatiser la petite tasse & faire de bébé l'acteur",
            paragraphs: [
              "Rappelons une évidence biologique : aucun bébé ne respire sous l'eau. S'il avale une petite gorgée lors d'un mouvement surpris, gardez le sourire : un chaleureux « tchin-tchin ! » dédramatise immédiatement l'épisode.",
              "Avaler un peu d'eau, tousser brièvement pour dégager les voies aériennes, avoir une vessie bien pleine ou une selle plus molle après la séance sont des réactions physiologiques courantes et sans gravité.",
              "Une fois le premier passage célébré, les immersions suivantes ne se répètent que lorsque l'enfant montre de lui-même l'envie d'aller sous l'eau pour attraper un jouet ou contempler le fond.",
              "L'interdiction absolue : ne jamais forcer un enfant ni le pousser sous l'eau. L'objectif demeure un bébé actif, volontaire et fier de ses explorations."
            ],
            warning: "Ne jamais forcer une immersion : elle doit toujours être initiée ou accueillie dans le respect de l'élan spontané de l'enfant."
          },
          {
            title: "Bénéfices majeurs sur la motricité globale et l'équilibre",
            paragraphs: [
              "Dans l'eau, un tout-petit encore discret sur le tapis d'éveil révèle souvent une vivacité surprenante. Il pédale (réflexe précurseur de la marche) et esquisse la motricité autonome du « petit chien » tout en modulant sa respiration.",
              "Ces ajustements posturaux tridimensionnels renforcent considérablement les réflexes d'équilibration utiles sur terre face aux chutes accidentelles, tout en préservant le corps sans cambrure ni torsion du cou."
            ]
          }
        ],
        takeaways: [
          "Une descente franche et continue en 7 secondes déclenche nettement le réflexe d'apnée.",
          "La prise bimanuelle tête-bassin et l'axe tête-tronc protègent le nez et rassurent l'enfant.",
          "La remontée passive laisse la poussée d'Archimède faire son œuvre sous votre bienveillance.",
          "Dédramatisez la petite gorgée avalée (« tchin-tchin ! ») et laissez toujours bébé guider ses prochaines immersions.",
          "L'immersion est toujours consentie et ludique : jamais de surprise ni de geste forcé."
        ],
        sources: [
          "Fédération Française de Natation — Éveil aquatique",
          "Biomécanique et motricité aquatique du nourrisson",
          "Société Française de Pédiatrie"
        ]
      }
    },
    {
      id: 'not-a-swimming-lesson-7-commandments',
      image: "/media/articles/seance-bebe-nageur-pas-cours-natation.webp?v=2",
      imageCaption: "Apprendre par le jeu libre, les tapis, les frites aquatiques et le respect des réflexes naturels.",
      slug: 'une-seance-bebe-nageur-n-est-pas-un-cours-de-natation',
      title: "Bébé nageur : pas un cours de natation, 7 commandements & vérités sur les réflexes",
      category: 'psychomotor',
      categoryLabel: "Pédagogie, Réflexes & 7 Commandements",
      readingTime: "6 min",
      icon: "🙅",
      badge: "Pédagogie & Vérités Scientifiques",
      summary: "Ici, pas de longueurs ni de chronomètre : découvrez les 4 piliers de l'exploration aquatique, les 7 commandements, les étapes de 0 à 3 ans et la vérité scientifique sur le réflexe d'apnée et de nage.",
      featured: false,
      publishedDate: "2026-08-16",
      author: "Équipe Pédagogique & Conseil Médical Baby Swim Vision",
      tags: ["Pas un cours", "7 commandements", "Réflexe d'apnée", "Réflexe natatoire", "Jeu", "Frite", "Idées reçues", "4 piliers", "Autonomie 3 ans", "Sécurité"],
      content: {
        introduction: "Ici, pas de longueurs à enchaîner, de chronomètre ni d'entraînement précoce : l'objectif unique est l'épanouissement psychomoteur et affectif de votre enfant, à son rythme.\n\nFlotter, se propulser, sauter, s'immerger : le tout-petit explore librement ces 4 piliers du milieu aquatique. Mais attention aux idées reçues : les réflexes archaïques avec lesquels naît le bébé (fermeture réflexe de la glotte, pédalage automatique) ne constituent en aucun cas un « gilet de sauvetage » ni un savoir nager inné. Comprendre cette distinction est la clé d'un accompagnement bienveillant et 100% sécurisant.",
        sections: [
          {
            title: "1. Les 7 commandements du bébé nageur",
            paragraphs: [
              "1. Privilégiez le jeu libre et le plaisir partagé (jouets flottants, arrosoirs, balles colorées).",
              "2. Préférez la frite en mousse aux brassards rigides : elle respecte la motricité libre et laisse l'enfant gérer son propre équilibre postural.",
              "3. Évitez absolument les effets de surprise et les immersions forcées.",
              "4. Restez calme, souriant et réconfortant s'il boit une petite tasse (« tchin-tchin ! »).",
              "5. Respectez l'initiative de l'enfant : le réflexe d'apnée est naturel les premiers mois mais ne doit jamais être provoqué par surprise.",
              "6. Ne quittez jamais votre enfant des yeux : surveillance active continue à portée immédiate de bras (< 1 mètre).",
              "7. Remontez-le immédiatement s'il commence à tourner sur lui-même (signe clair de perte de repère spatial ou de désorientation)."
            ],
            warning: "Remontez immédiatement votre enfant s'il commence à tourner sur lui-même dans l'eau : c'est le signal d'une perte d'équilibre ou d'une panique naissante."
          },
          {
            title: "2. Réflexe d'apnée & réflexe natatoire : démêler le vrai du faux",
            paragraphs: [
              "• Le réflexe d'apnée (réflexe laryngé) : immergé, le nouveau-né bloque automatiquement sa respiration en fermant sa glotte. Présent dès la naissance, ce réflexe protecteur s'estompe naturellement vers 4-5 mois (et jusqu'à 18 mois selon la maturation). Il ne protège pas contre la fatigue et ne garantit pas la sécurité.",
              "• Le réflexe natatoire (pédalage automatique) : mouvements réflexes alternés des bras et des jambes rappelant la nage du « petit chien ». Très spectaculaire, ce n'est pourtant pas de la nage volontaire : le bébé ne contrôle ni sa trajectoire ni son retour en surface.",
              "• L'équation fondamentale à retenir : Réflexes archaïques ≠ Savoir nager ≠ Savoir se sauver."
            ],
            keyPoints: [
              "Réflexe d'apnée : fermeture réflexe temporaire de la glotte",
              "Réflexe natatoire : pédalage automatique involontaire",
              "Ces réflexes archaïques s'estompent pour laisser place à la motricité volontaire"
            ],
            warning: "Ne testez jamais les réflexes d'un bébé par une immersion brutale ou en le lâchant dans l'eau. Un réflexe inné n'est jamais une garantie de survie."
          },
          {
            title: "3. Les 3 étapes de maturation et progression (0 à 3 ans)",
            paragraphs: [
              "• De 0 à 4 mois (L'automatisme réflexe) : découverte sensorielle douce dans le bain, réactions motrices archaïques, détente corporelle dans les bras du parent.",
              "• De 4 mois à 1 an (La transition & l'exploration) : les réflexes s'estompent au profit des mouvements conscients. Porté dos à soi, sur tapis et frites — les déséquilibres s'accompagnent avec bienveillance. Une phase normale d'hésitation ou de recul peut survenir vers 1 an lors de l'apprentissage de la marche terrestre : à respecter sans brusquer.",
              "• De 1 à 3 ans (La motricité volontaire & l'autonomie) : sauts du bord, toboggans, propulsion active et déplacements pour rejoindre le bord. Vers 3 ans, l'enfant ne pratique pas encore les nages codifiées mais maîtrise son équilibre, sait souffler dans l'eau et regagner le bord en sécurité."
            ],
            keyPoints: [
              "0-4 mois : familiarisation sensorielle et réflexes protecteurs",
              "4-12 mois : motricité exploratoire et respect de la phase d'hésitation vers 1 an",
              "1-3 ans : motricité volontaire, sauts et autonomie de sauvetage vers 3 ans"
            ]
          },
          {
            title: "4. Contre-indications médicales et inclusion",
            paragraphs: [
              "• Contre-indications absolues : cardiopathies congénitales sévères, insuffisance respiratoire majeure, déficit immunitaire, troubles sévères de la déglutition.",
              "• Contre-indications temporaires : fièvre, diarrhée, conjonctivite, otite aiguë (restez à la maison).",
              "• L'eau comme formidable espace d'inclusion : l'activité est particulièrement bénéfique pour les enfants en situation de handicap, leur offrant une liberté de mouvement libérée de la pesanteur.",
              "• La règle d'or d'autorisation : « Si maman ou papa est dans l'eau avec toi, tu peux venir ; sinon tu attends assis sur le bord. »"
            ]
          }
        ],
        takeaways: [
          "L'éveil aquatique vise l'épanouissement et l'aisance psychomotrice, jamais la performance sportive précoce.",
          "Les réflexes innés (apnée, pédalage) sont involontaires et s'estompent : ils ne remplacent jamais la surveillance active à portée de bras.",
          "Respectez les 7 commandements : privilégier le jeu, la frite souple, zéro surprise, et accueillir les phases d'hésitation vers 1 an.",
          "Vers 3 ans, l'enfant acquiert une réelle autonomie de déplacement et de sécurité sans avoir besoin de nages formelles."
        ],
        sources: [
          "Société Française de Pédiatrie (SFP)",
          "Fédération Française de Natation (FFN) — Éveil aquatique du jeune enfant",
          "Organisation Mondiale de la Santé (OMS) — Prévention des risques aquatiques",
          "Dr Guy Azémar & Psychomotricité du jeune enfant"
        ]
      }
    },
    {
      id: 'history-philosophy-baby-swimming',
      image: "/media/articles/histoire-mythes-philosophie-bebes-nageurs.webp",
      imageCaption: "La relation affective avant toute technique : le cœur de l'éveil aquatique moderne.",
      slug: 'd-hier-a-aujourd-hui-histoire-mythes-philosophie-bebes-nageurs',
      title: "D'hier à aujourd'hui : histoire, mythes et véritable philosophie des bébés nageurs",
      category: 'physiology',
      categoryLabel: "Histoire & Pédagogie Bienveillante",
      readingTime: "5 min",
      icon: "📚",
      badge: "Histoire & Philosophie Moderne",
      summary: "Des méthodes de survie des années 50 aux mythes des années 70, jusqu'à la révolution psychomotrice d'Azémar : l'histoire complète, les 3 conquêtes motrices, le lien d'attachement et la règle d'or d'autorisation.",
      featured: false,
      publishedDate: "2026-08-16",
      author: "Équipe Pédagogique & Conseil Médical Baby Swim Vision",
      tags: ["Histoire bébés nageurs", "Philosophie", "Méthode Azémar", "Depelseneer", "Lien d'attachement", "3 Conquêtes", "Règle d'or"],
      content: {
        introduction: "Née dans les années 1950-1970, l'activité des bébés nageurs a d'abord été pensée pour des raisons de survie, de détection précoce de champions de natation ou pour vérifier une mystérieuse « mémoire aquatique » fœtale. Ces idées ont toutes été abandonnées !\n\nAujourd'hui, l'éveil aquatique (de 4 mois à 6 ans) repose sur une approche psychomotrice bienveillante : épanouissement global, motricité libre, sécurité affective et lien d'attachement parent-bébé.",
        sections: [
          {
            title: "1. L'évolution historique : des méthodes de survie à la révolution bienveillante",
            paragraphs: [
              "• Années 1950 (méthode Depelseneer) : axée sur le réflexe de survie, l'enfant était séparé de ses parents et soumis à des immersions forcées et répétées (une approche traumatisante aujourd'hui totalement bannie).",
              "• Années 1970 (méthode Vallet & vague américaine) : pré-apprentissage technique de la natation et mythes de l'enfant champion ou de la mémoire utérine.",
              "• Années 1980 (révolution Azémar) : tournant fondamental impulsé par le Dr Guy Azémar. Fin des tests de survie : la motricité libre, le jeu et la relation affective parent-enfant deviennent le cœur battant de la séance.",
              "• Aujourd'hui : le principe absolu est le respect du consentement de l'enfant. Le parent rassure par le regard et le contact, l'éducateur guide et sécurise."
            ],
            keyPoints: [
              "Années 50 : immersion forcée axée sur la survie (strictement abandonnée)",
              "Années 70 : pré-apprentissage technique et mythes de la mémoire aquatique",
              "Depuis les années 80 : primauté de la relation affective, du jeu libre et du respect du rythme"
            ]
          },
          {
            title: "2. Les véritables bénéfices : les 3 grandes conquêtes motrices",
            paragraphs: [
              "Dans l'eau chaude, le tout-petit est libéré de la pesanteur et accomplit 3 conquêtes psychomotrices majeures :",
              "• Se verticaliser (dès 5-6 mois) : découvrir l'équilibre assis, redressé puis debout dans la 3D aquatique.",
              "• S'orienter dans l'espace : diriger son regard, tourner la tête et mobiliser tout son corps vers des repères visuels et sonores.",
              "• Se déplacer : coordonner le pédalage spontané et les mouvements de bras pour rejoindre le parent ou un tapis flottant.",
              "Ces ajustements tridimensionnels développent une motricité fine et un schéma corporel extrêmement solide sur terre."
            ],
            keyPoints: [
              "1. Verticalisation et équilibration dans l'espace tridimensionnel",
              "2. Orientation active de la tête et du regard",
              "3. Propulsion et coordination motrice spontanée"
            ]
          },
          {
            title: "3. Le lien d'attachement parent-bébé et le rôle du maître-nageur",
            paragraphs: [
              "Chaque séance est avant tout une bulle d'intimité et de confiance réciproque : peau à peau, regards complices et rires partagés.",
              "C'est la sécurité affective apportée par le parent qui donne au bébé le courage d'explorer et d'oser de nouveaux équilibres.",
              "Le rôle du maître-nageur dans l'eau ? Rassurer, guider et outiller les parents plutôt que de 'dresser' l'enfant, car dans l'eau : « celui qui sait, c'est le bébé ».",
              "Le matériel (tapis perforés, frites en mousse souples, petits arrosoirs) favorise une posture active et l'autonomie, à l'opposé des bouées rigides qui maintiennent l'enfant passif."
            ]
          },
          {
            title: "4. Le programme selon l'âge (de 4 mois à 6 ans)",
            paragraphs: [
              "• 4 à 18 mois : familiarisation sensorielle, appuis doux, tapis et frites, gestion accompagnée des déséquilibres.",
              "• 18 mois à 3 ans : entrées seul dans l'eau, sauts depuis le bord, toboggan, premiers déplacements autonomes (vigilance parentale permanente à portée de bras car la conscience du danger n'est pas encore acquise).",
              "• 3 à 6 ans : immersions volontaires, plongeons, traversées et jeux collectifs (la conscience du danger s'installe progressivement)."
            ]
          },
          {
            title: "5. Sauront-ils nager plus tôt ? La règle d'or vitale de sécurité",
            paragraphs: [
              "Vos bébés nageurs sauront-ils nager les 4 nages plus tôt que les autres enfants ? Non — les nages codifiées s'apprennent vers 5-6 ans. En revanche, ils acquièrent une aisance corporelle remarquable, une absence de panique et une motricité de sauvetage spontanée.",
              "D'où une règle d'or de sécurité à enseigner et répéter dès les premiers mois : « Si maman ou papa est dans l'eau avec toi, tu peux venir ; sinon tu restes assis sur le bord. »",
              "L'avis des spécialistes (Dr Jean-Jacques Chorrin, psychologue clinicien Daniel Zylberberg, Société Française de Pédiatrie) : c'est une conquête fondamentale aussi structurante que la parole ou la marche, qui fortifie la respiration, l'estime de soi et la complicité familiale."
            ],
            warning: "Règle d'or de sécurité vitale à répéter : 'Si papa ou maman est dans l'eau avec toi, tu peux venir ; sinon tu attends assis sur le bord.'"
          }
        ],
        takeaways: [
          "L'approche contemporaine refuse toute immersion forcée et place le lien parent-bébé au cœur de l'éveil.",
          "La pratique accompagne 3 conquêtes : verticalisation, orientation spatiale et déplacement autonome.",
          "Le bébé ne cherche pas la performance technique, mais construit une aisance corporelle et une confiance durables.",
          "Enseignez dès le premier jour la règle d'or d'autorisation avant d'entrer dans l'eau."
        ],
        sources: [
          "Dr Jean-Jacques Chorrin (Médecine sportive & FFN)",
          "Méthode Azémar & Psychomotricité du jeune enfant",
          "Daniel Zylberberg, Psychologue clinicien de l'éveil aquatique",
          "Société Française de Pédiatrie"
        ]
      }
    },
    {
      id: 'armbands-pros-cons-pedagogy',
      image: "/media/articles/brassards-pour-ou-contre.webp",
      imageCaption: "Utiliser les brassards comme passerelle d'autonomie sous surveillance rapprochée.",
      slug: 'brassards-pour-ou-contre',
      title: "Brassards : pour ou contre ?",
      category: 'safety',
      categoryLabel: "Matériel & Équilibre",
      readingTime: "4 min",
      icon: "🛟",
      badge: "Débat & Analyse",
      summary: "Le brassard a mauvaise réputation, mais bien utilisé, c'est un vrai outil pédagogique d'autonomie. Comment bien l'utiliser sans fausse sécurité.",
      featured: false,
      publishedDate: "2026-08-16",
      author: "Équipe Pédagogique Baby Swim Vision",
      tags: ["Brassards", "Pour ou contre", "Autonomie", "Fausse sécurité", "Propulsion", "Matériel"],
      content: {
        introduction: "Le brassard a mauvaise réputation. Pourtant, bien utilisé, c'est un vrai outil pédagogique — à une condition essentielle.",
        sections: [
          {
            title: "Règle n°1 : Le brassard n'est pas une assurance-vie",
            paragraphs: [
              "Règle n°1 : le brassard n'est pas une assurance-vie. Il ne remplace jamais votre surveillance.",
              "Mais il peut créer une situation précieuse : vous lâchez progressivement votre enfant, qui découvre alors ses propres mouvements.",
              "Car dans les bras d'un parent, l'enfant découvre surtout... les capacités du parent ! Le brassard l'aide à passer de « je suis porté » à « je suis capable de me déplacer seul ».",
              "Il bouge les jambes → il avance. Il tourne la tête → son équilibre change. C'est exactement ce type d'expérience qui construit sa compréhension de l'eau."
            ],
            keyPoints: [
              "Aide au passage de la dépendance passive à l'action motrice autonome",
              "Permet de comprendre la relation de cause à effet dans l'eau",
              "Exige une surveillance permanente et rapprochée de l'adulte"
            ]
          },
          {
            title: "Dès 6 mois, comment essayer ?",
            paragraphs: [
              "Dès 6 mois, pourquoi ne pas essayer ? Pas besoin de 30 minutes : 5 minutes suffisent pour une première découverte.",
              "Observez simplement : est-il à l'aise ? Cherche-t-il à avancer ?",
              "Et s'il n'aime pas ? On ne force jamais. On retire, on réessaie une autre fois, on le laisse observer d'autres enfants les utiliser.",
              "Le plus dur, c'est souvent pour les parents ! Résister à l'envie de rattraper son enfant dès qu'il s'éloigne, à condition qu'il soit sous surveillance rapprochée : la sécurité doit permettre l'exploration, pas l'empêcher.",
              "Les bouées de cou fonctionnent sur le même principe : un bon outil pédagogique d'appoint, jamais un dispositif de surveillance."
            ]
          },
          {
            title: "Pour ou Contre : le bilan",
            paragraphs: [
              "• Pour, si utilisés intelligemment : autonomie, détachement progressif du parent, découverte de la propulsion, de l'orientation, des rotations.",
              "• Contre, s'ils deviennent une fausse sécurité : laisser l'enfant sans surveillance, croire qu'ils préviennent la noyade, forcer un enfant qui les refuse, ou au contraire garder l'enfant en permanence dans les bras par peur."
            ],
            warning: "Ne laissez jamais un enfant en brassards hors de portée immédiate de bras."
          }
        ],
        takeaways: [
          "Le vrai objectif n'est pas le brassard, mais le chemin qu'il permet : de 'papa/maman me fait bouger' à 'je découvre comment bouger tout seul !'",
          "5 minutes suffisent pour une première découverte dès 6 mois.",
          "Apprendre à faire confiance à son enfant tout en garantissant une vigilance totale."
        ],
        sources: [
          "Pédagogie du matériel aquatique chez le jeune enfant",
          "Sécurité et autonomie en milieu aquatique"
        ]
      }
    },
    {
      id: 'twins-siblings-pool-management',
      image: "/media/articles/jumeaux-fratrie-piscine.webp",
      imageCaption: "Organisation sereine en famille : une attention individualisée pour chaque enfant.",
      slug: 'jumeaux-frere-soeur-rapproches-gerer-la-piscine-sereinement',
      title: "Jumeaux ou frère et sœur rapprochés : gérer la piscine sereinement",
      category: 'parenting',
      categoryLabel: "Organisation & Famille",
      readingTime: "4 min",
      icon: "👯",
      badge: "Organisation Familiale",
      summary: "Deux enfants dans l'eau, ce n'est pas deux fois le même bébé ! Comment s'organiser, observer chacun individuellement et terminer la séance avec deux enfants heureux.",
      featured: false,
      publishedDate: "2026-08-16",
      author: "Équipe Pédagogique Baby Swim Vision",
      tags: ["Jumeaux", "Frères et sœurs", "Organisation", "Sécurité", "Piscine", "Fatigue"],
      content: {
        introduction: "Deux enfants dans l'eau, ce n'est pas deux fois le même bébé. L'organisation change tout !",
        sections: [
          {
            title: "Règle d'or : une observation individuelle",
            paragraphs: [
              "Règle d'or : chaque enfant doit être observé individuellement, jamais comme un « duo indissociable ». Même jumeaux, ils peuvent réagir très différemment dans l'eau.",
              "L'idéal : un adulte par enfant. Papa avec l'un, maman avec l'autre — chacun peut alors observer, ajuster, et réagir immédiatement.",
              "Seul avec les deux ? Ne portez jamais deux enfants si cela vous empêche de bien les surveiller. La présence d'un maître-nageur dans l'eau devient alors précieuse, sans jamais remplacer votre vigilance."
            ],
            keyPoints: [
              "Chaque enfant est unique dans son aisance aquatique",
              "Configuration idéale : 1 adulte accompagnateur par enfant",
              "Préparation matérielle complète avant d'entrer dans l'eau"
            ]
          },
          {
            title: "Organisation pratique et alternance",
            paragraphs: [
              "Avant d'entrer dans l'eau, préparez tout à portée de main — serviettes, couches, vêtements de rechange, tétine, goûter — pour éviter d'avoir à quitter un enfant.",
              "Choisissez aussi une zone du bassin avec une bonne visibilité et un accès facile au bord.",
              "Pas besoin de synchroniser les deux enfants. Alternez plutôt : l'un explore pendant que l'autre observe (ce qui est déjà une forme d'apprentissage !), puis on inverse, et on termine si possible par un moment commun.",
              "Pour la sortie de l'eau en fin de séance, la meilleure stratégie à deux est de vous relayer : l'un des deux parents peut rester tranquillement au bord ou sur les marches avec les jumeaux (enveloppés dans leur peignoir ou occupés avec un petit jeu d'eau), pendant que l'autre parent part en avance aux vestiaires pour tout préparer (serviettes dépliées, couches propres ouvertes, bodies prêts). Dès que tout est en place, la transition se fait sans stress, au chaud et sans précipitation."
            ],
            keyPoints: [
              "Alternance fluide entre découverte active et observation",
              "Sortie d'eau sereine en relais : un parent au bord avec les jumeaux, l'autre aux vestiaires",
              "Organisation millimétrée pour éviter les coups de froid en fin de séance"
            ]
          },
          {
            title: "Fatigue, pleurs et pièges à éviter",
            paragraphs: [
              "Surveillez la fatigue de chacun séparément — elle ne se manifeste pas forcément en même temps ni de la même façon.",
              "Et si l'un a froid pendant que l'autre va bien, on arrête : mieux vaut une séance courte et agréable qu'une séance longue et forcée.",
              "Le piège à éviter : vouloir absolument faire « pareil » avec des jumeaux — deux enfants du même âge peuvent avoir des niveaux d'aisance très différents, et c'est normal.",
              "Avec un écart d'âge plus important, donnez au plus grand de petites responsabilités ludiques (« choisis le jouet ! »), mais jamais celle de surveiller son cadet.",
              "Si l'un pleure, priorisez le besoin le plus urgent tout en gardant l'autre en sécurité."
            ],
            warning: "Ne donnez jamais à un enfant plus âgé la responsabilité de surveiller son frère ou sa sœur dans l'eau."
          }
        ],
        takeaways: [
          "Considérez chaque enfant comme un individu avec son rythme propre.",
          "Alternez les phases d'exploration et d'observation.",
          "En fin de séance, relayez-vous : un parent veille au bord avec les jumeaux pendant que l'autre prépare le vestiaire.",
          "L'objectif n'est pas de rentabiliser chaque minute, mais de ressortir avec deux enfants heureux et rassurés."
        ],
        sources: [
          "Guide d'organisation des séances aquatiques familiales",
          "Psychologie de la gémellité et éveil moteur"
        ]
      }
    },
    {
      id: 'baby-swimming-disability-inclusion',
      image: "/media/articles/bebes-nageurs-handicap-inclusion.webp",
      imageCaption: "La liberté de mouvement et l'épanouissement sensoriel dans l'eau.",
      slug: 'bebes-nageurs-et-handicap-un-espace-de-liberte',
      title: "Bébés nageurs et handicap : un espace de liberté",
      category: 'physiology',
      categoryLabel: "Inclusion & Épanouissement",
      readingTime: "5 min",
      icon: "💙",
      badge: "Inclusion & Liberté",
      summary: "Dans l'eau, le corps se libère de la pesanteur. Un espace d'éveil sensoriel, relationnel et moteur précieux pour les enfants en situation de handicap.",
      featured: true,
      publishedDate: "2026-08-16",
      author: "Équipe Pédagogique & Références Médicales",
      tags: ["Handicap", "Inclusion", "Liberté de mouvement", "TSA", "Trisomie 21", "Moteur", "Sensoriel"],
      content: {
        introduction: "Dans l'eau, le corps ne fonctionne plus tout à fait comme sur terre — et pour certains enfants, cela ouvre des possibilités précieuses.\n\nGrâce à la poussée d'Archimède, le poids du corps diminue et les mouvements sont ralentis : un enfant qui a du mal à se retourner au sol peut parfois y arriver plus facilement dans l'eau. Mais l'intérêt va bien au-delà du mouvement — l'eau est aussi un espace sensoriel, relationnel et émotionnel.",
        sections: [
          {
            title: "Une exploration à son rythme",
            paragraphs: [
              "Avant tout, un enfant reste un enfant.",
              "L'objectif n'est jamais de « corriger » son handicap, mais de lui offrir un environnement où il peut explorer ses propres possibilités, à son rythme."
            ],
            keyPoints: [
              "Allègement corporel et libération de la pesanteur",
              "Ralentissement des mouvements favorisant la coordination",
              "Espace d'expression sensorielle, affective et joyeuse"
            ]
          },
          {
            title: "Selon le handicap, on adapte",
            paragraphs: [
              "• Moteur : équilibre, rotations, appuis, coordination — toujours en complément d'une prise en charge thérapeutique, jamais à sa place.",
              "• Sensoriel : pour un enfant malvoyant, le toucher, la voix et les sons deviennent des repères essentiels (« on avance », « on tourne »...) ; pour un enfant malentendant, le regard, les gestes et le contact corporel prennent le relais.",
              "• Trouble du spectre de l'autisme (TSA) : certains enfants adorent l'eau, d'autres sont gênés par le bruit, la lumière ou les éclaboussures — la HAS recommande d'adapter chaque séance aux particularités sensorielles et communicationnelles de l'enfant : expliquer à l'avance, garder un rituel identique, limiter les stimulations.",
              "• Trisomie 21 : l'activité aquatique est bénéfique, mais certaines précautions médicales s'imposent — la HAS signale notamment le risque en cas d'instabilité atloïdo-axoïdienne, et une épilepsie non équilibrée peut contre-indiquer la natation. En cas de doute : avis médical indispensable."
            ],
            warning: "Un avis médical préalable spécialisé est nécessaire pour adapter au mieux la pratique à chaque situation."
          },
          {
            title: "Le mot d'ordre et l'accueil inclusif",
            paragraphs: [
              "Le mot d'ordre : on ne force jamais. Si l'enfant ne veut pas entrer dans l'eau aujourd'hui, s'asseoir au bord et tremper les pieds peut déjà être une séance réussie.",
              "Le rôle du parent est encore plus central ici : il connaît les habitudes de son enfant, ses signes d'inconfort, ses moyens de communication. La séance devient un vrai travail d'équipe entre l'enfant, le parent et le professionnel.",
              "Une piscine vraiment inclusive, ce n'est pas juste « accepter » les enfants différents — c'est adapter réellement l'accueil : professionnel formé, parent autorisé à rester dans l'eau, environnement calme si besoin, temps respecté pour l'entrée dans l'eau.",
              "Le vrai bénéfice ? Que votre enfant découvre que son corps est capable de choses qu'il ne pensait pas possibles — et ressente, peut-être pour la première fois, cette sensation extraordinaire : « je peux agir sur mon environnement. »"
            ]
          }
        ],
        takeaways: [
          "L'eau offre un terrain d'expression motrice et sensorielle libéré de la gravité.",
          "Chaque séance s'adapte sur-mesure aux particularités de l'enfant.",
          "Le sentiment extraordinaire pour l'enfant : 'Je peux agir sur mon environnement.'"
        ],
        sources: [
          "Haute Autorité de Santé (HAS) — Recommandations TSA et Trisomie 21",
          "Fédération Française Handisport & Activités Aquatiques Adaptées"
        ]
      }
    },
    {
      id: 'dry-drowning',
      image: "/media/articles/noyade-seche-vrai-ou-faux.webp",
      imageCaption: "Prévention médicale et surveillance active continue.",
      slug: 'la-noyade-seche-vrai-ou-faux',
      title: "La « noyade sèche » : vrai ou faux ?",
      category: 'safety',
      categoryLabel: "Prévention & Vérités médicales",
      readingTime: "4 min",
      icon: "💧",
      badge: "Fiche Essentielle & Prévention",
      summary: "Une idée très répandue sur les réseaux sociaux… mais que dit réellement la science médicale sur le fait de boire la tasse ?",
      featured: true,
      publishedDate: "2026-08-10",
      author: "Équipe Pédagogique & Références Médicales",
      tags: ["Noyade sèche", "Sécurité", "Bébé nageur", "Urgences", "Boire la tasse", "Prévention"],
      content: {
        introduction: "La « noyade sèche » telle qu'elle est décrite sur les réseaux sociaux (un enfant qui boirait la tasse et mourrait subitement sans signe plusieurs jours plus tard) est un mythe médical.",
        sections: [
          {
            title: "Éclairage anatomique : La position du larynx chez le nourrisson",
            paragraphs: [
              "L'enfant humain semble conserver cette position haute du larynx dans le cou jusqu'à peu près l'âge de 6 mois. Ensuite et à partir de cet âge, le larynx commence à descendre progressivement pour s'achever au moment où l'enfant commence à parler et à marcher ; il devrait atteindre sa position finale vers l'âge de 4 ans.",
              "Cette position haute initiale confère une protection spécifique aux voies aériennes du tout-petit lors de la déglutition, avant que la maturation anatomique ne permette l'acquisition progressive de la parole et de la marche."
            ],
            keyPoints: [
              "0 à 6 mois : Position haute du larynx dans le cou (protection réflexe)",
              "Dès 6 mois : Descente progressive en lien avec la parole et la marche",
              "Vers 4 ans : Position anatomique finale stabilisée"
            ]
          },
          {
            title: "Ne pas banaliser le fait de boire la tasse",
            paragraphs: [
              "Une petite toux brève après avoir avalé un peu d'eau est une réaction réflexe classique.",
              "Toutefois, en cas de toux persistante, de difficultés respiratoires, de somnolence anormale ou de lèvres bleutées après un incident, une prise en charge médicale rapide est indispensable."
            ]
          }
        ],
        takeaways: [
          "La « noyade sèche » tardive asymptomatique est un mythe.",
          "Surveillez les signes respiratoires réels dans les heures suivant un incident.",
          "La surveillance humaine active et permanente reste la seule prévention absolue."
        ],
        sources: [
          "Santé publique France — Prévention des noyades chez l'enfant",
          "Société Française de Pédiatrie (SFP)",
          "Organisation Mondiale de la Santé (OMS)"
        ]
      }
    },
    {
      id: 'active-supervision',
      image: "/media/articles/surveillance-active-securite-affective.webp",
      imageCaption: "Toujours à portée de bras (< 1m) avec un contact visuel rassurant.",
      slug: 'surveillance-active-et-securite-affective-portee-de-bras-regard',
      title: "Surveillance active et sécurité affective : la règle de la portée de bras et le pouvoir du regard",
      category: 'safety',
      categoryLabel: "Sécurité & Sécurité Affective",
      readingTime: "4 min",
      icon: "🛡️",
      badge: "Règle d'Or & Bienveillance",
      summary: "Un jeune enfant peut couler silencieusement en quelques secondes : découvrez la règle absolue de la portée de bras, le piège des bouées et comment le regard du parent constitue le premier gilet de sauvetage émotionnel.",
      featured: false,
      publishedDate: "2026-08-15",
      author: "Équipe Pédagogique Baby Swim Vision",
      tags: ["Surveillance active", "Portée de bras", "Sécurité affective", "Regard rassurant", "Prévention", "Lien parent-bébé"],
      content: {
        introduction: "La sécurité d'un tout-petit dans l'eau repose sur deux piliers indissociables : une vigilance physique absolue et continue de l'adulte (la règle de la portée de bras) et une présence affective sécurisante. Contrairement aux idées reçues, la noyade d'un jeune enfant est un événement silencieux et très rapide, tandis que son sentiment de confiance dépend directement de la détente et du regard du parent qui le porte.",
        sections: [
          {
            title: "La règle vitale de la portée de bras (< 1 mètre)",
            paragraphs: [
              "Avec un nourrisson ou un enfant de moins de 3 ans, l'adulte responsable doit toujours se situer à portée immédiate de bras dans l'eau (moins d'un mètre).",
              "Dans le bain comme en piscine, ne quittez jamais l'enfant des yeux, même pour 'quelques secondes' pour attraper une serviette, répondre au téléphone ou consulter un écran.",
              "Désignez toujours clairement l'adulte en charge de la surveillance : lorsque tout le monde surveille, personne ne surveille réellement."
            ],
            keyPoints: [
              "1 adulte désigné et 100% disponible",
              "Zéro distraction (smartphone, conversation prolongée, lecture)",
              "Présence active dans le même bassin à portée de main immédiate"
            ]
          },
          {
            title: "Le piège des bouées, brassards et flotteurs",
            paragraphs: [
              "Les brassards, bouées sièges ou gilets de flottaison sont des aides temporaires à la flottabilité, mais ne remplacent en aucun cas la présence attentive d'un adulte.",
              "Une bouée peut basculer ou glisser en une fraction de seconde sans que l'enfant ne puisse redresser sa tête de lui-même."
            ],
            warning: "Aucun matériel de flottaison ne peut se substituer à la vigilance active et bienveillante d'un parent dans l'eau."
          },
          {
            title: "Le regard et le visage du parent : le premier gilet de sauvetage émotionnel",
            paragraphs: [
              "L'eau amplifie les sensations et les émotions. Un parent crispé ou anxieux transmet involontairement ses tensions à travers ses mains et sa posture.",
              "Tenez votre bébé avec fermeté mais sans serrement : des prises souples, enveloppantes et adaptatives permettent au corps de ressentir la portance de l'eau.",
              "Maintenez un contact visuel régulier, calme et souriant. Le visage du parent est le miroir absolu dans lequel le tout-petit vérifie qu'il est en totale sécurité."
            ],
            keyPoints: [
              "Des prises de mains douces, souples et enveloppantes",
              "Le contact visuel constant et le sourire désamorcent immédiatement l'inquiétude",
              "Votre voix posée et vos encouragements guident l'exploration en douceur"
            ]
          },
          {
            title: "La sécurité affective comme moteur d'apprentissage",
            paragraphs: [
              "Un bébé qui se sent physiquement protégé et émotionnellement rassuré est un bébé disponible pour apprendre, jouer et expérimenter.",
              "La sécurité n'est pas seulement l'absence de danger : c'est aussi un climat de confiance partagée qui permet à l'enfant de construire ses repères aquatiques avec joie."
            ]
          }
        ],
        takeaways: [
          "La surveillance humaine active à portée de bras (< 1 m) est la seule protection absolue.",
          "Les bouées et flotteurs ne remplacent jamais la présence et le contact d'un adulte.",
          "Votre calme, vos sourires et votre regard sont le premier gilet de sauvetage émotionnel de votre bébé.",
          "Parlez doucement et valorisez chaque petite initiative dans l'eau."
        ],
        sources: [
          "Santé publique France — Campagne nationale de prévention des noyades chez le jeune enfant",
          "Société Française de Pédiatrie (SFP) — Sécurité aquatique et bienveillance",
          "Psychomotricité infantile & attachement sécure en milieu aquatique"
        ]
      }
    },
    {
      id: 'les-5-sens-bebe-eau',
      image: "/media/articles/5sens. 2026, 12_15_32.png",
      imageDefault: "/media/articles/5sens. 2026, 12_15_32.png",
      imageCaption: "Les 5 sens du bébé dans l’eau : une découverte et exploration multisensorielle avec tout son corps.",
      slug: 'les-5-sens-du-bebe-dans-l-eau-une-decouverte-multisensorielle',
      title: "Les 5 sens du bébé dans l’eau : une découverte multisensorielle",
      category: 'psychomotor',
      categoryLabel: "Développement Psychomoteur & Éveil Sensoriel",
      readingTime: "6 min",
      icon: "🖐️",
      badge: "Découverte Multisensorielle",
      summary: "Dans la piscine, le bébé ne découvre pas seulement l’eau : il la ressent, l’écoute, la regarde, la goûte et l’explore avec tout son corps. Une aventure multisensorielle guidée par la complicité et la sécurité affective.",
      featured: false,
      publishedDate: "2026-09-13",
      author: "Équipe Pédagogique & Conseil Médical Baby Swim Vision",
      tags: ["5 sens", "Éveil sensoriel", "Multisensoriel", "Toucher", "Goût", "Odorat", "Audition", "Vision", "Corps dans l'espace", "Relation parent-bébé"],
      content: {
        introduction: "Dans la piscine, le bébé ne découvre pas seulement l’eau : il la ressent, l’écoute, la regarde, la goûte et l’explore avec tout son corps.\n\nPour un bébé de moins d’un an, le monde est une immense expérience sensorielle. Ses sens sont déjà actifs très tôt, mais ils continuent à se développer et à se préciser au fil des mois.\n\nDans l’eau, cette exploration prend une dimension particulière : plusieurs sens sont sollicités en même temps. Le bébé reçoit ainsi une multitude d'informations sur son corps, son environnement, le parent qui l'accompagne et les sensations nouvelles que procure le milieu aquatique.",
        sections: [
          {
            title: "1. Le toucher : sentir l’eau avec tout son corps",
            icon: "👋",
            paragraphs: [
              "Le toucher est particulièrement important chez le jeune bébé.",
              "La peau lui permet de découvrir les contacts, les pressions, les mouvements, la température et les différentes textures. Dans l’eau, le corps entier devient une véritable surface sensorielle.",
              "Le bébé ressent :\n• la température de l’eau sur sa peau ;\n• la pression et les mouvements de l’eau autour de son corps ;\n• les déplacements lorsqu’il est porté ou déplacé ;\n• le contact des mains du parent ;\n• les différences entre être immergé, soutenu ou progressivement libéré.",
              "Cette richesse de sensations lui permet progressivement de mieux percevoir son propre corps dans l’espace.",
              "Le contact du parent reste également essentiel. Les mains qui soutiennent, accompagnent ou modifient légèrement la position du bébé lui donnent des informations tactiles et proprioceptives."
            ],
            keyPoints: [
              "La peau : une immense surface sensorielle en immersion tridimensionnelle",
              "Perception fine des pressions, des températures et de la flottabilité",
              "Perception de son propre corps dans l’espace et proprioception",
              "Les mains du parent apportent des repères tactiles sécurisants"
            ]
          },
          {
            title: "2. Le goût : la bouche comme outil d’exploration",
            icon: "👅",
            paragraphs: [
              "Chez le bébé, la bouche ne sert pas uniquement à se nourrir.",
              "Elle constitue également un formidable outil d’exploration. Le bébé porte naturellement de nombreux objets à la bouche afin d'en découvrir la forme, la texture, la température et, lorsqu'il y en a, les caractéristiques gustatives.",
              "Il faut donc distinguer deux informations essentielles :\n• Le goût renseigne sur les saveurs.\n• Le toucher dans la bouche renseigne notamment sur la texture, la pression, la température et la forme.",
              "Ces deux types d'informations sont donc différents, mais ils peuvent être recueillis simultanément.",
              "C’est pourquoi on peut dire que, chez le bébé, le toucher et le goût sont particulièrement associés lors de l’exploration orale, sans pour autant être le même sens.",
              "Et dans la piscine ? La bouche et les lèvres peuvent participer à la découverte du milieu aquatique. Le bébé peut notamment ressentir le contact de l’eau autour des lèvres et de la bouche.",
              "Cela ne signifie pas qu'il doit boire ou avaler de l'eau. Au contraire, l'exploration aquatique doit rester encadrée et adaptée à son âge et à ses capacités."
            ],
            keyPoints: [
              "La bouche : formidable outil d'exploration tactile et gustative",
              "Association étroite du toucher oral et du goût chez le nourrisson",
              "Contact doux de l'eau autour des lèvres et de la bouche"
            ],
            warning: "L'exploration avec les lèvres ne signifie jamais boire ou avaler l'eau du bassin. L'accompagnement doit rester vigilant, bienveillant et adapté à son âge."
          },
          {
            title: "3. L’odorat : reconnaître ce qui est familier",
            icon: "👃",
            paragraphs: [
              "L’odorat est un sens très précoce chez le bébé.",
              "Les odeurs familières peuvent jouer un rôle important dans son environnement affectif. Dans une séance en piscine, le bébé retrouve notamment l'odeur et la proximité de son parent.",
              "Dans un environnement nouveau, les odeurs peuvent également participer à la construction de ses repères.",
              "Le bébé ne découvre donc pas uniquement un nouveau lieu avec ses yeux : son cerveau reçoit également des informations olfactives qui participent à l'identification de son environnement."
            ],
            keyPoints: [
              "L'odorat est fonctionnel dès la naissance et très précoce",
              "L'odeur du parent crée un cocon de réassurance affective immédiate",
              "Construction de repères spatiaux et émotionnels durables"
            ]
          },
          {
            title: "4. L’audition : écouter un monde différent",
            icon: "👂",
            paragraphs: [
              "Le bébé entend déjà avant sa naissance et l'audition est fonctionnelle dès les premiers jours de vie.",
              "À la piscine, l'environnement sonore est particulier.",
              "Les voix, les éclaboussures, les mouvements de l'eau et les sons produits autour de lui créent un univers auditif différent de celui auquel il est habitué.",
              "Lorsque le bébé est immergé, les conditions de transmission des sons changent également. Il peut ainsi expérimenter une perception sonore différente, notamment lorsque sa tête ou ses oreilles sont dans l'eau.",
              "La voix du parent conserve cependant une importance particulière : elle constitue un repère familier et rassurant au sein de cet environnement nouveau."
            ],
            keyPoints: [
              "Audition fœtale et précoce opérationnelle dès le premier jour",
              "Perception sonore transformée sous l'eau ou oreilles immergées",
              "La voix douce du parent est le premier repère rassurant dans le bruit ambiant"
            ]
          },
          {
            title: "5. La vue : observer, suivre et anticiper",
            icon: "👀",
            paragraphs: [
              "La vision est le sens qui se développe particulièrement au cours des premiers mois.",
              "À la naissance, la vision est encore immature et la précision visuelle augmente progressivement.",
              "Dans l'eau, le bébé peut observer :\n• le visage de son parent ;\n• les mouvements de l'eau ;\n• les contrastes entre l'eau et l'environnement ;\n• les objets qui se déplacent ;\n• les mouvements des autres personnes ;\n• les changements de position de son propre corps.",
              "Progressivement, il apprend à regarder, suivre, anticiper et orienter son attention vers ce qui l'intéresse.",
              "Le regard du parent est particulièrement important : un visage connu dans un environnement inhabituel peut constituer un repère sécurisant."
            ],
            keyPoints: [
              "Vision en pleine maturation : capture des reflets, contrastes et mouvements",
              "Capacité grandissante à fixer, suivre du regard et anticiper",
              "Le regard bienveillant du parent : phare de sécurité émotionnelle"
            ]
          },
          {
            title: "6. L'intégration sensorielle : les sens ne travaillent jamais seuls",
            icon: "🧠",
            paragraphs: [
              "C'est probablement l'un des aspects les plus intéressants de l'expérience aquatique du bébé : les cinq sens ne fonctionnent pas comme cinq systèmes totalement séparés.",
              "Le cerveau reçoit simultanément des informations provenant de différents sens et les combine.",
              "Prenons un exemple simple : le bébé est porté dans les bras de son parent et doucement déplacé dans l'eau. Il peut simultanément :\n• 👀 regarder le visage de son parent ;\n• 👂 entendre sa voix ;\n• 👋 sentir l'eau sur sa peau et les mains qui le soutiennent ;\n• 🧠 percevoir les mouvements de son corps dans l'espace ;\n• 👃 retrouver une odeur familière.",
              "Ce n'est donc pas un seul sens qui découvre l'eau, mais tout un ensemble d'informations qui permettent au bébé de construire progressivement son expérience du milieu aquatique.",
              "Pourquoi cette exploration est-elle différente de celle de l'adulte ? Chez l'adulte, les systèmes sensoriels sont davantage spécialisés dans leurs fonctions, mais ils continuent à travailler ensemble (par exemple lorsqu'on mange, associant goût, texture, température et odeur). Chez le bébé, cette intégration sensorielle est particulièrement visible parce que l'exploration constitue encore une grande partie de son apprentissage : en regardant, touchant, écoutant, sentant et explorant par la bouche, le bébé agit comme un véritable explorateur multisensoriel."
            ],
            keyPoints: [
              "Intégration multisensorielle continue dans le cerveau du nourrisson",
              "Combinaison instantanée de la vue, de l'ouïe, du toucher, de l'odorat et de la proprioception",
              "L'exploration globale est le moteur premier de tous ses apprentissages"
            ]
          },
          {
            title: "7. La piscine : un environnement sensoriel exceptionnel",
            icon: "🏊‍♀️",
            paragraphs: [
              "L'eau offre au bébé une expérience très différente de celle qu'il connaît sur la terre ferme.",
              "Elle enveloppe son corps, modifie ses déplacements, exerce des pressions sur sa peau et transforme ses possibilités de mouvement.",
              "Chaque changement de position produit de nouvelles sensations : être porté sur le ventre, sur le dos, près du parent, légèrement immergé ou progressivement accompagné vers une position plus autonome ne procure pas exactement les mêmes informations sensorielles.",
              "La séance peut ainsi devenir une succession de petites expériences :\nje regarde → je ressens → j'écoute → je bouge → je découvre → je m'adapte.",
              "L'objectif n'est pas de rechercher systématiquement une réaction spectaculaire : il s'agit avant tout de laisser le bébé découvrir progressivement le milieu, à son rythme, dans un cadre sécurisant et accompagné."
            ],
            keyPoints: [
              "L'eau enveloppe et allège : une motricité tridimensionnelle libérée",
              "Boucle d'apprentissage : regarder → ressentir → écouter → bouger → s'adapter",
              "Priorité à la douceur et au rythme de l'enfant sans quête de performance"
            ]
          },
          {
            title: "8. Le parent : le repère au cœur de l'expérience",
            icon: "❤️",
            paragraphs: [
              "Au milieu de toutes ces nouvelles sensations, le parent joue un rôle essentiel.",
              "Sa voix, son regard, son toucher et sa manière de porter le bébé constituent des repères familiers.",
              "L'eau peut être nouvelle. Les sensations peuvent être nouvelles. Les sons peuvent être nouveaux. Mais le bébé retrouve une personne connue et rassurante.",
              "Cette sécurité permet au bébé de consacrer davantage d'attention à ce qu'il découvre.",
              "C'est pourquoi une séance bébé dans l'eau ne consiste pas seulement à apprendre des mouvements : c'est aussi une expérience de relation, d'exploration et de découverte sensorielle partagée."
            ],
            keyPoints: [
              "La présence sécurisante du parent est le socle de toute exploration",
              "Voix, regard et contact corporel : les repères indispensables du tout-petit",
              "L'éveil aquatique est avant tout une aventure affective partagée"
            ]
          }
        ],
        takeaways: [
          "Chez le bébé de moins d'un an, les cinq sens sont déjà actifs et continuent à mûrir au fil des mois.",
          "Le toucher permet de ressentir l'eau, les contacts, la température, la pression et les mouvements.",
          "Le goût et le toucher oral participent activement à l'exploration par la bouche, en toute sécurité.",
          "L'odorat et l'audition reconnaissent les repères familiers et la voix réconfortante du parent.",
          "La vision apprend progressivement à observer, suivre et anticiper.",
          "Ces sens travaillent ensemble : découvrir l'eau, c'est découvrir avec tout son corps !"
        ],
        sources: [
          "Société Française de Pédiatrie — Développement sensoriel et psychomoteur du nourrisson",
          "Revue Médicale Suisse — Intégration sensorielle et éveil chez le jeune enfant",
          "Approche psychomotrice de l'éveil aquatique et théorie de l'attachement"
        ]
      }
    }
  ],
  en: [
    {
      id: 'eveil-aquatique-decouverte-eau',
      image: "/media/articles/decouverte-eau-motricite.webp",
      imageCaption: "Gentle sensory exploration, practical guidance, and connection in warm water.",
      slug: 'aquatic-awakening-more-than-discovering-water',
      title: "Aquatic Awakening & Infant Guide: The Complete Handbook for Every Unique Baby",
      category: 'psychomotor',
      categoryLabel: "Psychomotor Development & Awakening",
      readingTime: "7 min",
      icon: "🌊",
      badge: "Foundational Handbook",
      summary: "Medical prerequisites, session routine, gravity-free motor discovery, and honoring each infant's unique pace: all foundational essentials combined for a serene, joyful family journey without performance pressure.",
      featured: true,
      publishedDate: "2026-08-16",
      author: "Baby Swim Vision Medical & Pedagogical Advisory",
      tags: ["Aquatic Awakening", "Complete Guide", "Unique Baby", "Parent-Baby Bond", "Health Prerequisites", "Psychomotricity", "Autonomy", "32°C Water", "Non-Competitive"],
      content: {
        introduction: "Aquatic awakening is a playful family adventure grounded in shared joy, security, and connection. It is not a traditional swim lesson: babies are not here to perform codified swimming strokes, but to discover a sensory world, experience body weightlessness, and construct their own balance and movement answers in warm water.\n\nTo make every moment delightful, from practical health prerequisites to fostering independent exploration, here is the complete guide tailored to every unique infant.",
        sections: [
          {
            title: "1. Medical Prerequisites & Health Guidelines",
            paragraphs: [
              "• Starting Age: From 4 months up to 3 years old, after the first two rounds of mandatory immunizations (2 and 4 months).",
              "• Medical Clearance: A non-contraindication certificate from your pediatrician or family physician is required.",
              "• Absolute Contraindications: Severe congenital heart conditions, severe respiratory failure, major immunodeficiency, swallowing disorders, or perforated eardrum (tympanostomy tubes permit gentle surface swimming but prohibit submersions).",
              "• Relative Contraindications (requires medical approval): Infant asthma, controlled convulsive history.",
              "• Temporary Contraindications: Fever, acute otitis, gastroenteritis/diarrhea, or contagious skin conditions. In these cases, simply postpone the session by a week."
            ],
            keyPoints: [
              "Begin from 4 months post-vaccination",
              "Pediatric clearance certificate required",
              "Systematically postpone in case of fever, diarrhea, or acute infection"
            ]
          },
          {
            title: "2. Practical Preparation & Session Routine",
            paragraphs: [
              "• Nutrition: No heavy feeding or large milk bottle in the hour preceding the session to prevent spitting up.",
              "• Hygiene & Soapy Shower: Use the restroom (or equip a snug swim diaper), blow noses, remove makeup, and take a full soapy shower together. Showering removes sweat and cosmetic residues, which drastically cuts down chloramines (irritants for baby's sensitive eyes and airways).",
              "• Pool Temperature: Water must be comfortably heated between 31°C and 33°C (ideally 32°C / 89.6°F) to ensure thermal relaxation.",
              "• Session Duration: 20 to 30 minutes maximum for 4-18 months, and up to 45 minutes for 18 months-4 years. Always provide a warm cuddle and snack upon exiting."
            ],
            keyPoints: [
              "Light stomach (1 hour without heavy feeding)",
              "Mandatory soapy shower for pure air and water quality",
              "Heated pool (32°C) with calibrated duration (20-30 min for infants)"
            ]
          },
          {
            title: "3. A Relationship-First Activity Built on Emotional Safety",
            paragraphs: [
              "Aquatic awakening is primarily a shared emotional connection between baby and parent.",
              "Held in caregiver arms, baby feels skin-to-skin reassurance, seeks your gaze, listens to soothing vocal tones, and mirrors your emotional state.",
              "The adult's quality of presence is paramount: rather than just 'holding' the child, you accompany, observe, converse, and play together.",
              "Parent calmness is contagious: when you submerge your own shoulders, smile, and blow bubbles or play peekaboo, your child naturally absorbs your confidence."
            ],
            keyPoints: [
              "Parent acts as a secure anchor and discovery partner",
              "Water provides comforting containment and affective bonding",
              "A reassured, respected infant feels empowered to explore"
            ]
          },
          {
            title: "4. Discovering the Body Free from Gravity: 5-Dimensional Growth",
            paragraphs: [
              "On dry land, infants constantly work against gravity. In the pool, Archimedes' buoyant force lightens their body weight.",
              "Water unlocks rich motor freedoms: baby attempts movements not yet possible on land, discovers buoyancy, and feels water resistances.",
              "Aquatic discovery nurtures all 5 core developmental dimensions:",
              "• Affective Dimension: deepens parent-infant attachment and reciprocal trust.",
              "• Psychological Dimension: sensory soothing, self-confidence, and feeling secure.",
              "• Motor Dimension: body schema awareness, limb dissociation, and 3D balance.",
              "• Cognitive Dimension: curiosity, spatial navigation, and learning through trial-and-error.",
              "• Social Dimension: observing other children, peer mimicry, and sharing the pool environment."
            ],
            keyPoints: [
              "Weightlessness and 3D movement freedom",
              "Deep enrichment of proprioception and body schema",
              "Harmonious stimulation across all 5 early childhood spheres"
            ]
          },
          {
            title: "5. Learning Through Trial and Error: Building Solid Aquatic Support",
            paragraphs: [
              "In water, children learn by experimenting: observing, attempting, missing occasionally, rebalancing, and finding their own physical answer.",
              "A floating toy just out of reach or an unexpected splash is not a failure, but a valuable motor adjustment opportunity.",
              "Temporary failure is the very engine that builds resilient neural pathways and strong aquatic balance.",
              "The parent's role is to encourage attempts without taking over, letting the child take genuine pride in their achievements."
            ],
            keyPoints: [
              "Active exploration stimulates psychomotor adaptability",
              "Postural adjustments emerge through playful, positive repetition",
              "Value the effort and joy of exploration over immediate results"
            ]
          },
          {
            title: "6. Every Baby Is Unique: Individuality, Autonomy & Golden Patience",
            paragraphs: [
              "Floating mats, tunnels, slides... every child approaches water with their distinct temperament: calm observers take time to watch, while bold explorers dive into action.",
              "Aquatic autonomy is built progressively in increments of a few seconds, much like learning a language.",
              "Rule of thumb: if your child walks around 18 months, anticipate roughly double that timeframe for full aquatic autonomy.",
              "Their first spontaneous propulsion? The intuitive 'doggy paddle', a natural, efficient, and joyful coordination.",
              "Patience always wins: the more you push a child, the less they cooperate. Let the natural breakthrough emerge at their pace."
            ],
            keyPoints: [
              "Respect each baby's unique personality and timing",
              "Aquatic autonomy develops progressively (approx. double the walking age)",
              "First natural swimming stroke: the 'doggy paddle'",
              "Patience and zero pressure unlock the brightest breakthroughs"
            ]
          },
          {
            title: "7. No Performance Pressure: Love the Water First",
            paragraphs: [
              "We are not training competitive swimmers or teaching codified strokes (freestyle and breaststroke belong to age 5-6).",
              "The sole objective is for your child to feel completely at home, safe, and happy in the water.",
              "Vital safety rule to teach from day one: « If mommy/daddy is in the water with you, you can come in; otherwise, you wait safely on the ledge. »",
              "Always maintain active, within-arm's-reach supervision at all times."
            ],
            warning: "Absolute Golden Rule: 'If mom or dad is in the pool with you, you may enter; otherwise, you sit safely on the edge.' Constant active supervision within arm's reach."
          }
        ],
        takeaways: [
          "Start from 4 months post-vaccination with medical clearance in 32°C (90°F) water.",
          "Calm preparation: full soapy shower, light stomach, and 20-30 min sessions.",
          "Buoyancy lightens the body and promotes 5-dimensional developmental growth.",
          "Every baby has their own rhythm: respect trial-and-error learning without pressure.",
          "Patience and warmth come first: before learning how to swim, baby learns to love the water!"
        ],
        sources: [
          "French Swimming Federation (FFN) — Family Aquatic Awakening",
          "Pediatric Guidelines for Infant Aquatic Familiarization",
          "Early Childhood Psychomotricity and Motor Learning"
        ]
      }
    },
    {
      id: 'when-to-start-pool-choice',
      image: "/media/articles/securisation-soutiens.webp",
      imageCaption: "The joy of a successful first session in a warm 32°C pool.",
      slug: 'when-to-take-baby-swimming-choose-pool-first-session',
      title: "When to Take Baby to the Pool & Water Temperature: Complete 1st Session Guide",
      category: 'parenting',
      categoryLabel: "Parent Guide & First Session",
      readingTime: "5 min",
      icon: "🏊",
      badge: "Practical Guide & Thermal Comfort",
      summary: "Ideal age, voluntary grasping, 32°C (89.6°F) water, 20-30 min duration, cooling signs to monitor, and choosing a pool with an in-water instructor.",
      featured: true,
      publishedDate: "2026-08-16",
      author: "Baby Swim Vision Medical & Pedagogical Advisory",
      tags: ["First Session", "Infant Age", "32°C Water", "Session Duration", "Hypothermia Signs", "Pool Selection", "Instructor In Water"],
      content: {
        introduction: "A baby's first pool session is a wonderful sensory journey for both child and parents. However, an infant loses body heat four times faster than an adult in water, and their senses are quickly stimulated. To ensure a joyful start, the right timing, 32°C (90°F) water temperature, calibrated session length, and supportive in-water coaching are vital pillars.",
        sections: [
          {
            title: "1. At What Age Can You Start? The Grasping Indicator",
            paragraphs: [
              "• From 4 months: after the first two mandatory immunization rounds, with pediatric clearance.",
              "• Motor development indicator: the emergence of voluntary reaching and grasping (around 4-6 months). When baby tracks objects, reaches out, and grasps a floating toy, they are ready to actively engage in aquatic discovery rather than passively floating.",
              "• Zero age pressure: starting later is just as wonderful—every baby progresses when they feel emotionally and physically ready."
            ],
            keyPoints: [
              "Accessible from 4 months post-vaccination",
              "Voluntary grasping marks the beginning of active exploration",
              "Honor your baby's individual pace and emotional comfort"
            ]
          },
          {
            title: "2. Pool Temperature: Why 32°C (90°F) Is Essential",
            paragraphs: [
              "Infant thermoregulation is still immature, and water conducts body heat away rapidly. Cold water triggers muscle tension and inhibits curiosity.",
              "• Under 12 to 18 months: water must be heated between 31°C and 33°C (ideally 32°C / 89.6°F).",
              "• From 18 months+: 30°C to 31°C remains comfortable for active toddlers.",
              "• Critical holding rule: keep baby's shoulders submerged. Wet shoulders and chest exposed to ambient pool air are the primary cause of rapid heat loss."
            ],
            keyPoints: [
              "Pool heated to 32°C (minimum 31°C) before 18 months",
              "Keep shoulders submerged to maintain core body warmth",
              "Warmth fosters muscle relaxation, smiles, and confidence"
            ]
          },
          {
            title: "3. Session Duration and Spotting Signs of Chilling",
            paragraphs: [
              "• Recommended duration: 20 to 30 minutes maximum for infants under 18 months (up to 40-45 minutes for toddlers 18 months - 3 years). A short, warm, and happy session is infinitely better than an extended one where baby gets chilled.",
              "• Signs of chilling (exit the pool immediately): purplish or blueish lips, persistent goosebumps, jaw shivering, mottling, or skin pallor.",
              "• Signs of sensory fatigue: frequent yawning, rubbing eyes, turning head away, fussiness, or clinging without wanting to play.",
              "• Post-swim routine: wrap baby immediately in a warm, dry hooded towel, dry hair and neck thoroughly, and offer a milk bottle or snack (swimming burns significant energy!)."
            ],
            warning: "30 minutes is an upper limit, never a requirement: exit the water serenely at the earliest sign of chilling or tiredness to keep the memory 100% positive."
          },
          {
            title: "4. Choosing the Right Pool Facility: Key Criteria",
            paragraphs: [
              "Standard public athletic lap pools (typically 27-28°C with intense acoustic echoes) are unsuitable for infants.",
              "Look for an aquatic awakening center that offers:",
              "• A warm pool heated to 32°C with soft lighting and controlled noise levels.",
              "• An instructor physically inside the water with families to demonstrate holds, reassure caregivers, and guide progression.",
              "• A child-led, play-centered approach free from rigid drills or performance expectations."
            ],
            keyPoints: [
              "Dedicated warm, calm aquatic awakening pool",
              "Instructor actively in the pool with families",
              "Gentle, play-focused pedagogy"
            ]
          },
          {
            title: "5. Awakening the 5 Senses: Pure Joy Without Competition",
            paragraphs: [
              "The first session is a rich sensory celebration: touch (buoyancy and hydrostatic pressure), sight (reflections and bright floating toys), hearing (gentle water ripples and soothing echoes), smell, and taste (lips touching water drops).",
              "There is nothing to prove: dipping little feet, touching a duck, or smiling in a caregiver's arms are major developmental triumphs."
            ]
          }
        ],
        takeaways: [
          "Start from 4 months post-vaccination with voluntary grasping cues.",
          "Essential temperature: 32°C with baby's shoulders submerged.",
          "Short 20-30 min sessions: exit at the first sign of blueish lips or fatigue.",
          "Choose a baby-friendly facility with an in-water instructor.",
          "Warm hooded towel and feeding/snack ready immediately at the poolside!"
        ],
        sources: [
          "Pediatric Society & Preventive Health Standards for Infant Swimming",
          "French Swimming Federation (FFN) — Early Childhood Water Familiarization"
        ]
      }
    },
    {
      id: 'first-immersion-milestone',
      image: "/media/articles/premiere-immersion-7-secondes.webp",
      imageCaption: "Gentle joint immersion: the reassuring parent-baby gaze.",
      slug: 'the-big-dip-first-submersion-complete-practical-guide',
      title: "The Big Dip & First Submersion: Step-by-Step 7-Second Complete Guide",
      category: 'psychomotor',
      categoryLabel: "Water Confidence & Immersion",
      readingTime: "6 min",
      icon: "💧",
      badge: "Key Milestone & 7s Protocol",
      summary: "\"Has your baby been baptized in the water?\" From the 7-second preparation ritual to the dynamic descent, nape-to-pelvis support, and demystifying swallowing water: the complete guide for a serene first submersion where baby is the leader.",
      featured: true,
      publishedDate: "2026-08-16",
      author: "Baby Swim Vision Pedagogical Team",
      tags: ["First Immersion", "The Big Dip", "How To", "7s Ritual", "Submersion", "Swallowing Water", "Passive Ascent", "Head-Spine Alignment", "Confidence"],
      goldenRule: "Smooth, continuous and decisive descent without hesitation. Baby is supported vertically facing caregiver, head-spine aligned, ascent powered by natural Archimedes buoyancy.",
      timelineSteps: [
        {
          second: "0s",
          title: "Starting Position on Surface",
          action: "Vertical chest support & eye contact",
          iconType: "surface",
          detail: "Baby is held vertically facing the parent with submerged shoulders. One hand cradles the nape/skull, the other supports lower back and pelvis.",
          depthLevel: "surface"
        },
        {
          second: "1s",
          title: "Predictable Cue & Signal",
          action: "Verbal cue or soft gentle breath",
          iconType: "prepare",
          detail: "Ritual announcement (« 1, 2, 3… dip! » or soft breath on cheeks) triggering reflexive closure of eyes and mouth without startling.",
          depthLevel: "surface"
        },
        {
          second: "2s",
          title: "Smooth Water Entry",
          action: "Decisive continuous partner descent",
          iconType: "entry",
          detail: "Descent begins smoothly together. Head enters water with strict head-to-spine alignment to protect nasal passages.",
          depthLevel: "transition"
        },
        {
          second: "3s",
          title: "Complete Underwater Passage",
          action: "Brief 1-2 second submersion",
          iconType: "submerged",
          detail: "Baby is fully immersed. The natural diving reflex protects the airways in absolute calm.",
          depthLevel: "underwater"
        },
        {
          second: "4s",
          title: "Continuous Fluid Curve",
          action: "Steady motion without jerks",
          iconType: "deep",
          detail: "Descent continues in a harmonious curve without hesitant stops or jerky bounces.",
          depthLevel: "underwater"
        },
        {
          second: "5s",
          title: "Buoyancy-Assisted Ascent",
          action: "Archimedes lift & softened pull",
          iconType: "stable",
          detail: "Archimedes' buoyant lift propels baby upward. Caregiver softens upward traction so baby feels water as a supportive ally.",
          depthLevel: "underwater"
        },
        {
          second: "6s",
          title: "Surface Emergence",
          action: "Smiling emergence in open air",
          iconType: "ascend",
          detail: "Head emerges into open air. Parent beams with pride, providing instant visual reassurance.",
          depthLevel: "transition"
        },
        {
          second: "7s",
          title: "Warm Embrace & Celebration",
          action: "Comforting praise and connection",
          iconType: "exit",
          detail: "Warm hug against the chest, soothing words, and cheerful praise to celebrate this motor triumph.",
          depthLevel: "surface"
        }
      ],
      content: {
        introduction: "\"Has your baby been baptized yet in the water?\" That is the foundational question every attentive swim instructor asks before approaching the main pool — because the answer shapes the pacing and emotional comfort of your baby's journey.\n\nFar from abrupt movements or forced drills, a successful first submersion rests on a harmonious partnership: mutual trust, an ergonomic two-handed hold, a 7-second predictable ritual, and an understanding of Archimedes' buoyant force.",
        sections: [
          {
            title: "The Right Timing and Shared Confidence",
            paragraphs: [
              "The ideal moment for the first submersion depends on age and motor readiness: before baby sits unsupported, we assist them at the pool ledge, usually during the second session once the facility, sounds, and echoes are familiar.",
              "Instructors are continually moved by the trust parents place in them at this pivotal threshold.",
              "The professional holds the infant's hands in synchronized harmony with the caregiver, ready to guide them smoothly underwater and immediately back up into reassuring arms."
            ],
            keyPoints: [
              "First submersion ideally during the 2nd session after familiarization",
              "Gentle, synchronized partnership with the instructor",
              "Welcoming all emotions: smiles, wonder, or quick cuddles for brief tears"
            ]
          },
          {
            title: "Proper Handhold and Head-Spine Alignment",
            paragraphs: [
              "To keep baby fully secure and provide clear spatial orientation, the recommended hold is two-handed: baby facing you with shoulders submerged, one hand cradling the nape and base of the skull, the other supporting the lower back or pelvis.",
              "Keep the head straight and naturally aligned with the spine: this strict axial alignment prevents water from rushing into the nasal passages during water entry.",
              "This face-to-face posture preserves unbroken eye contact, which is the cornerstone of emotional safety."
            ],
            keyPoints: [
              "Dual-hand support: nape/upper head + lower spine/pelvis",
              "Strict head-neck-spine axial alignment to protect the nose and airways",
              "Unbroken face-to-face eye contact"
            ]
          },
          {
            title: "The Precise 7-Second Chronology (Submersion Ritual)",
            paragraphs: [
              "To make the experience predictable and playful without startling surprises, follow this smooth 7-second timing:",
              "• Second 0 (Connection): Baby's shoulders submerged, eyes locked with yours, smiling calmly.",
              "• Second 1 (Clear Announcement): Give a gentle cue (« 1, 2, 3… dip! » or a soft breath on their cheeks to trigger reflexive eye and mouth closure).",
              "• Second 2 (Smooth Entry): Descend together into the water in a confident, continuous movement.",
              "• Seconds 3 & 4 (Underwater Passage): Baby is submerged briefly (1 to 2 seconds maximum). The natural diving reflex provides gentle airway protection.",
              "• Second 5 (Buoyant Ascent): Archimedes' buoyant lift assists the return to the surface as you soften your upward pull.",
              "• Second 6 (Surface Emergence): Head emerges into the open air. Beam with pride and smile.",
              "• Second 7 (Celebration): Warm hug, reassuring words, and high-fives to celebrate this motor victory."
            ],
            keyPoints: [
              "Verbal cue or soft breath to banish unexpected startling",
              "Brief 1-2 second underwater passage",
              "Immediate warm embrace upon surface emergence"
            ]
          },
          {
            title: "The Exact Technique: Dynamic Descent & Passive Ascent",
            paragraphs: [
              "The more decisively and smoothly you descend, the more water buoyancy naturally propels your baby back toward the surface.",
              "The technique: first model the movement with your own face and breath, then submerge together in a continuous, confident 5-second curve without jerky stops.",
              "An overly hesitant or startled entry disrupts the diving reflex — that is precisely when an infant may accidentally swallow water.",
              "During the ascent, never release your child, but soften your upward pull: let them feel that it is Archimedes' buoyant force, not your hands yanking them, that brings them up into the air. Water becomes a supportive ally that cradles them."
            ],
            keyPoints: [
              "Decisive, continuous descent without hesitations (approx. 5 seconds)",
              "Passive ascent powered by natural Archimedes buoyancy",
              "Caregiver maintains steady supportive contact without yanked pulling"
            ]
          },
          {
            title: "Demystifying Swallowing Water & Making Baby the Leader",
            paragraphs: [
              "Remember the biological fact: no baby breathes underwater. If they swallow a small splash during an unexpected moment, keep your composure: a warm smile or lighthearted 'cheers!' quickly normalizes the situation.",
              "Swallowing a little water, a brief cough to clear airways, a full bladder, or softer stool after pool time are standard physiological responses.",
              "Once the initial milestone is celebrated, subsequent submersions are only proposed when the child initiates interest on their own, reaching for underwater toys or gazing beneath the surface.",
              "Absolute rule: never force an infant underwater. The ultimate goal is an active, curious baby who takes joyful pride in their aquatic discoveries."
            ],
            warning: "Never force an infant underwater: submersions must always be invited and led by the baby's own curiosity."
          },
          {
            title: "Surprising Bonus for Land Motor Skills & Balance",
            paragraphs: [
              "In the water, infants who appear calm or quiet on land before 4-5 months frequently reveal vibrant energy. They pedal (a reflex precursor to walking) and coordinate 'doggy paddle' kicks while managing breath.",
              "This 3D conditioning strengthens land motor coordination and balance responses for unexpected trips, while respecting joint health without spinal strain."
            ]
          }
        ],
        takeaways: [
          "A decisive, smooth 7-second descent cleanly triggers the infant diving reflex.",
          "The two-handed nape-and-pelvis hold with straight head alignment protects the nose and reassures baby.",
          "Allow Archimedes' buoyant force to power the ascent while maintaining supportive contact.",
          "Normalize a swallowed splash with smiles and let your child lead future underwater explorations.",
          "Submersion is always consensual and playful: never forced or unexpected."
        ],
        sources: [
          "Pediatric Aquatic Safety and Submersion Standards",
          "Infant Aquatic Biomechanics and Motor Development",
          "French Swimming Federation Guidelines"
        ]
      }
    },
    {
      id: 'not-a-swimming-lesson-7-commandments',
      image: "/media/articles/seance-bebe-nageur-pas-cours-natation.webp?v=2",
      imageCaption: "Learning through joyful free play, floating mats, foam noodles, and respecting natural reflexes.",
      slug: 'infant-pool-session-is-not-a-swim-lesson',
      title: "Infant Swimming: Not a Swimming Lesson, 7 Commandments & Reflex Realities",
      category: 'psychomotor',
      categoryLabel: "Pedagogy, Reflexes & 7 Commandments",
      readingTime: "6 min",
      icon: "🙅",
      badge: "Pedagogy & Scientific Facts",
      summary: "No lap drills or stopwatches: explore the 4 pillars of aquatic play, the 7 commandments, milestones from 0 to 3 years, and scientific facts on diving and swimming reflexes.",
      featured: false,
      publishedDate: "2026-08-16",
      author: "Baby Swim Vision Medical & Pedagogical Team",
      tags: ["Not A Lesson", "7 Commandments", "Diving Reflex", "Swimming Reflex", "Playful", "Foam Noodle", "Myths vs Facts", "4 Pillars", "3 Year Autonomy", "Safety"],
      content: {
        introduction: "Here, there are no timed laps, rigid drills, or competitive pressure: the sole focus is your child's holistic psychomotor blossoming at their natural pace.\n\nFloating, propelling, jumping, submersing: baby explores these 4 pillars of the aquatic world freely. But beware of common misconceptions: primitive reflexes (diving reflex glottis closure, automated kicking) are not a built-in lifejacket nor proof that a baby instinctively knows how to swim. Understanding this distinction is essential for gentle, safe, and respectful aquatic discovery.",
        sections: [
          {
            title: "1. The 7 Commandments of Infant Aquatic Comfort",
            paragraphs: [
              "1. Prioritize play above all (bright floating toys, buckets, soft balls).",
              "2. Favor flexible foam noodles over rigid arm floaties — noodles nurture natural posture and balance regulation.",
              "3. Strictly avoid startling surprises or forced submersions.",
              "4. Remain calm, cheerful, and reassuring if baby swallows a splash of water.",
              "5. Respect baby's consent: the diving reflex is natural in early months but must never be triggered unexpectedly.",
              "6. Never take your eyes off your child (active touch supervision within arm's reach < 1m).",
              "7. Lift baby upright immediately if they start spinning uncontrollably (a clear sign of disorientation or emerging panic)."
            ],
            warning: "Immediately support your baby upright if they start spinning disorientedly in the water: it signals a loss of spatial equilibrium."
          },
          {
            title: "2. Diving Reflex & Swimming Reflex: Scientific Facts vs. Myths",
            paragraphs: [
              "• The diving reflex (laryngeal reflex): when submerged, a newborn automatically pauses respiration by closing the glottis. Present at birth, this protective reflex naturally fades around 4-5 months (and up to 18 months). It does not prevent fatigue and never guarantees drowning safety.",
              "• The swimming reflex (automated paddling): alternating leg kicks and arm paddling resembling a 'doggy paddle'. While impressive, this is an involuntary reflex: the baby does not consciously steer or surface.",
              "• The fundamental equation: Primitive Reflexes ≠ Knowing How to Swim ≠ Self-Rescue Ability."
            ],
            keyPoints: [
              "Diving reflex: involuntary closure of vocal cords and glottis",
              "Swimming reflex: automated primitive leg and arm paddling",
              "These primitive reflexes naturally fade to make way for conscious motor control"
            ],
            warning: "Never test an infant's reflexes through sudden or unsupported submersions. An innate reflex is never a guarantee of survival."
          },
          {
            title: "3. 3 Maturation Stages & Developmental Milestones (0 to 3 Years)",
            paragraphs: [
              "• 0 to 4 Months (Reflexive Automation): gentle sensory discovery in the home bath, calming body contact in parent's arms.",
              "• 4 Months to 1 Year (Transition & Exploration): primitive reflexes fade as conscious movements take over. Held facing outward on mats and noodles — minor spills are guided calmly. A normal hesitation phase may appear around age 1 when learning to walk upright: respect it gently.",
              "• 1 to 3 Years (Voluntary Propulsion & Autonomy): jumping from the pool ledge, water slides, purposeful paddling, and turning back to the wall. Around age 3, the child doesn't swim formal strokes yet, but knows how to breathe, float, and self-rescue to the safety ledge."
            ],
            keyPoints: [
              "0-4 months: sensory familiarization and protective reflexes",
              "4-12 months: active exploration and embracing the normal 1-year hesitation phase",
              "1-3 years: voluntary propulsion, jumps, and self-rescue autonomy around age 3"
            ]
          },
          {
            title: "4. Contraindications and Inclusivity",
            paragraphs: [
              "• Absolute contraindications: severe congenital heart disease, severe respiratory illness, major immune deficiency, severe swallowing disorders.",
              "• Temporary contraindications: fever, diarrhea, conjunctivitis, acute ear infections (stay home and rest).",
              "• Water as a wonderful inclusive space: aquatic sessions offer extraordinary motor freedom for children with special needs.",
              "• Golden safety rule: 'If Mommy or Daddy is in the water with you, you can come in; otherwise you sit and wait on the pool edge.'"
            ]
          }
        ],
        takeaways: [
          "Infant aquatic sessions foster water confidence and psychomotor ease, never competitive sports drills.",
          "Primitive reflexes (apnea, paddling) are involuntary and temporary: they never replace active adult supervision within arm's reach.",
          "Follow the 7 commandments: play, flexible foam noodles, zero surprises, and gentle patience with the 1-year hesitation phase.",
          "By age 3, children build genuine displacement autonomy and self-rescue skills naturally without rigid swim strokes."
        ],
        sources: [
          "French Pediatric Society (SFP)",
          "French Swimming Federation (FFN) — Early Childhood Aquatic Awakening",
          "World Health Organization (WHO) — Drowning Prevention Guidelines",
          "Dr. Guy Azémar & Psychomotor Child Development"
        ]
      }
    },
    {
      id: 'armbands-pros-cons-pedagogy',
      image: "/media/articles/brassards-pour-ou-contre.webp",
      imageCaption: "Using armbands as a progressive autonomy bridge under close watch.",
      slug: 'armbands-and-floaties-pros-and-cons',
      title: "Floaties and Armbands: Pros and Cons",
      category: 'safety',
      categoryLabel: "Equipment & Balance",
      readingTime: "4 min",
      icon: "🛟",
      badge: "Expert Debate & Analysis",
      summary: "Armbands often face criticism, but used purposefully, they can serve as valuable stepping stones toward self-propulsion and autonomy without creating false security.",
      featured: false,
      publishedDate: "2026-08-16",
      author: "Baby Swim Vision Pedagogical Team",
      tags: ["Armbands", "Floaties", "Pros & Cons", "Autonomy", "False Security", "Propulsion"],
      content: {
        introduction: "Armbands often get a bad reputation among swim educators. Yet when used thoughtfully, they represent a wonderful transitional learning tool — on one non-negotiable condition: never lowering adult supervision.",
        sections: [
          {
            title: "Rule #1: Floaties Are Not a Life Insurance Policy",
            paragraphs: [
              "Rule #1: arm floaties are not an insurance policy and never replace watchful adult eyes.",
              "However, they create a valuable learning moment: you gradually loosen your hold, allowing your child to experience their own independent propulsion.",
              "Held constantly in caregiver arms, a child mostly experiences the parent's physical abilities! Floaties bridge the gap from 'I am being carried' to 'I can propel myself'.",
              "They kick their legs → they move forward. They turn their head → their balance shifts. This cause-and-effect feedback loop builds genuine water understanding."
            ],
            keyPoints: [
              "Helps shift from passive carrying to active, self-driven motor exploration",
              "Enables direct understanding of cause and effect in water",
              "Demands unbroken close-proximity adult supervision"
            ]
          },
          {
            title: "Introducing Floaties from 6 Months Onward",
            paragraphs: [
              "From 6 months onward, why not give it a gentle try? No need for long sessions: 5 minutes is plenty for an initial discovery.",
              "Simply observe: are they relaxed? Are they trying to reach and kick?",
              "If they dislike the feeling, never insist. Remove the aids, try again another day, or let them watch peers using them cheerfully.",
              "The hardest part is often for caregivers! Resisting the reflex to grab the child the instant they drift slightly away, provided they remain under close supervision: safety must empower exploration, not stifle it.",
              "Neck float rings follow the same logic: an occasional sensory curiosity tool, never an unsupervised baby holder."
            ]
          },
          {
            title: "Pros and Cons: The Objective Summary",
            paragraphs: [
              "• PROS (when used smartly): sense of self-efficacy, progressive physical detachment from parent's body, discovery of active propulsion, steering, and body rotations.",
              "• CONS (if used as false security): leaving the child unattended, falsely assuming floaties prevent drowning, forcing an unwilling child, or clinging to the child out of anxiety."
            ],
            warning: "Never allow a child wearing armbands or floaties to move beyond immediate arm's reach."
          }
        ],
        takeaways: [
          "The true objective is not the gear, but the developmental shift: from 'mom/dad moves me' to 'I discover how to move myself!'",
          "5 minutes of discovery is plenty to gauge baby's comfort from 6 months onward.",
          "Learn to trust your child's emerging abilities while maintaining unbroken vigilance."
        ],
        sources: [
          "Pedagogy of Aquatic Aids in Early Childhood",
          "Childhood Water Safety and Autonomy Consensus"
        ]
      }
    },
    {
      id: 'twins-siblings-pool-management',
      image: "/media/articles/jumeaux-fratrie-piscine.webp",
      imageCaption: "Serene family pool sessions with individualized care for every child.",
      slug: 'twins-and-close-age-siblings-swimming-serenely',
      title: "Twins or Close-Age Siblings: Managing the Pool Serenely",
      category: 'parenting',
      categoryLabel: "Family Organization & Safety",
      readingTime: "4 min",
      icon: "👯",
      badge: "Family Organization",
      summary: "Two children in the pool are not two identical babies! How to organize logistics, observe each child individually, and finish the session with two happy kids.",
      featured: false,
      publishedDate: "2026-08-16",
      author: "Baby Swim Vision Pedagogical Team",
      tags: ["Twins", "Siblings", "Organization", "Water Safety", "Pool Logistics", "Fatigue"],
      content: {
        introduction: "Two little ones in the pool are never the same baby twice! Each has their own disposition, comfort level, and pace: smart organization makes all the difference.",
        sections: [
          {
            title: "Golden Rule: Individual Observation",
            paragraphs: [
              "Golden rule: each child must be observed individually, never as an inseparable pair. Even identical twins can have completely opposite water comfort reactions.",
              "The ideal setup: one adult per child. Dad with one, Mom with the other — each caregiver can observe micro-cues, tailor holds, and react instantly.",
              "Solo with two? Never carry two infants simultaneously if it hampers your balance or ability to react. An instructor's presence in the water is a huge help, though it never replaces your direct watchfulness."
            ],
            keyPoints: [
              "Every child is unique in their aquatic comfort",
              "Ideal setup: 1 adult caregiver per child in the water",
              "Complete gear preparation before stepping onto the pool deck"
            ]
          },
          {
            title: "Practical Logistics and Alternating Activities",
            paragraphs: [
              "Before entering the water, organize all essentials within arm's reach in the locker room and deck bench: fluffy towels, swim diapers, quick-change clothing, pacifiers, and snacks.",
              "Select a pool area with clear visibility, shallow entry, and easy ledge access.",
              "No need to force both children to do the exact same exercise simultaneously. Alternate instead: one explores in your arms while the other observes from the deck bench (observation is a powerful form of learning!), then switch!",
              "For leaving the pool at the end of the session, tag-teaming makes all the difference: one parent can stay comfortably at the water's edge or on the pool steps with the twins (bundled in cozy towels or playing with a pool toy), while the other parent heads to the locker room a few minutes early to set everything up (unfolded towels, open diapers, and ready clothes). Once the changing area is prepared, the transition is warm, seamless, and completely calm."
            ],
            keyPoints: [
              "Fluid alternation: one child explores while the other observes",
              "Smooth pool exit relay: one parent watches by the ledge, the other readies the locker room",
              "Prevent chills with pre-staged changing stations"
            ]
          },
          {
            title: "Managing Fatigue, Tears, and Sibling Dynamics",
            paragraphs: [
              "Monitor each child's fatigue independently — tiredness does not appear at the exact same moment or in the same way.",
              "If one child gets chilly while the other is thriving, wrap up the water time for both: a short, joyful session is always better than pushing until both end up in tears.",
              "The trap to avoid: expecting twins to progress identically — children of the exact same age have different comfort thresholds.",
              "With an older sibling, assign small, fun responsibilities ('pick the rubber duck we throw!'), but NEVER task an older child with supervising their younger sibling."
            ],
            warning: "Never delegate water supervision of an infant to an older child or sibling."
          }
        ],
        takeaways: [
          "Treat each child as a unique individual with their own comfort timeline.",
          "Alternate between active in-water exploration and relaxed observation.",
          "At session end, tag-team: one parent watches poolside with the twins while the other prepares the locker room.",
          "The goal is not maximizing pool minutes, but ending the session with two happy, confident children."
        ],
        sources: [
          "Family Aquatic Education Logistics Guidelines",
          "Twin Psychology and Early Childhood Psychomotricity"
        ]
      }
    },
    {
      id: 'baby-swimming-disability-inclusion',
      image: "/media/articles/bebes-nageurs-handicap-inclusion.webp",
      imageCaption: "Freedom of movement and sensory empowerment in the water.",
      slug: 'infant-swimming-and-disability-a-space-of-freedom',
      title: "Baby Swimming and Disability: A Space of Freedom",
      category: 'physiology',
      categoryLabel: "Inclusion & Empowerment",
      readingTime: "5 min",
      icon: "💙",
      badge: "Inclusion & Freedom",
      summary: "In water, gravity lightens and movements slow down, opening empowering sensory, motor, and emotional possibilities for children with motor, sensory, or neurodivergent needs.",
      featured: true,
      publishedDate: "2026-08-16",
      author: "Baby Swim Vision Medical & Pedagogical Advisory",
      tags: ["Disability", "Inclusion", "Freedom of Movement", "Autism ASD", "Down Syndrome", "Motor", "Sensory"],
      content: {
        introduction: "In water, the body functions differently than on land — and for children with disabilities, this opens extraordinary avenues of motor and sensory empowerment.\n\nThanks to Archimedes' buoyancy, apparent body weight decreases and movements decelerate: a child who struggles to roll over on land may achieve it with joyful ease in the pool. Water is an enriching sensory, relational, and emotional realm.",
        sections: [
          {
            title: "Child-Centered Exploration at Their Own Pace",
            paragraphs: [
              "First and foremost, a child is a child.",
              "The goal is never to 'correct' a disability, but to offer an environment where they can discover their own capabilities and joy in movement at their natural pace."
            ],
            keyPoints: [
              "Body weightlessness and increased freedom of joint motion",
              "Decelerated movement speeds aiding motor coordination",
              "A joyful, empowering sensory and relational space"
            ]
          },
          {
            title: "Adapting to Specific Needs",
            paragraphs: [
              "• Motor differences: gentle work on balance, rolling, trunk support, and coordination — always complementing formal physical therapy.",
              "• Sensory differences: for visually impaired children, voice, tactile cues, and water echoes become vital navigation anchors ('we are gliding forward', 'turning gently'). For deaf or hard-of-hearing infants, warm eye contact, expressive gestures, and skin-to-skin touch lead the way.",
              "• Autism Spectrum (ASD): some children adore water while others find echoing acoustics, bright reflections, or splashing overwhelming. Best practice guidelines recommend predictable rituals, advance preparation, dimming harsh stimuli, and respecting sensory thresholds.",
              "• Down Syndrome (Trisomy 21): water play is wonderful, but medical clearance is essential to screen for atlantoaxial instability and monitor associated cardiac or seizure conditions."
            ],
            warning: "Specialized pediatric clearance is essential to tailor aquatic activities safely to each child's individual medical background."
          },
          {
            title: "Caregiver Partnership and True Inclusive Welcome",
            paragraphs: [
              "The parent's role is central: you know your child's communication cues, comfort signals, and soothing preferences best. Sessions become a genuine team partnership between child, parent, and instructor.",
              "A truly inclusive pool goes beyond mere admission — it adapts its welcome: trained staff, parent in the water, calm off-peak hours, and unhurried entry time.",
              "The ultimate reward? When your child discovers their body is capable of wonders and feels that extraordinary sensation: 'I have the power to act on my world!'"
            ]
          }
        ],
        takeaways: [
          "Water offers a gravity-free playground for physical and sensory expression.",
          "Every session is customized to the child's sensory and motor comfort.",
          "The transformative milestone for the child: 'I can act on my environment!'"
        ],
        sources: [
          "French National Health Authority (HAS) — ASD & Trisomy 21 Guidelines",
          "Adapted Physical Activity & Parasport Aquatic Standards"
        ]
      }
    },
    {
      id: 'dry-drowning',
      image: "/media/articles/noyade-seche-vrai-ou-faux.webp",
      imageCaption: "Medical prevention facts and continuous active supervision.",
      slug: 'dry-drowning-true-or-false',
      title: "« Dry Drowning »: True or False?",
      category: 'safety',
      categoryLabel: "Prevention & Medical Facts",
      readingTime: "4 min",
      icon: "💧",
      badge: "Essential Factsheet & Prevention",
      summary: "A viral social media misconception… what does pediatric science actually say about swallowing pool water?",
      featured: true,
      publishedDate: "2026-08-10",
      author: "Pedagogical Team & Medical Consensus",
      tags: ["Dry Drowning", "Water Safety", "Infant Swimming", "Emergencies", "Prevention"],
    },
    {
      id: 'active-supervision',
      image: "/media/articles/surveillance-active-securite-affective.webp",
      imageCaption: "Always within arm's reach (< 1m) with reassuring eye contact.",
      slug: 'active-supervision-and-emotional-safety-arms-reach-eye-contact',
      title: "Active Supervision & Emotional Safety: The Arm's Reach Rule and the Power of Eye Contact",
      category: 'safety',
      categoryLabel: "Safety & Emotional Security",
      readingTime: "4 min",
      icon: "🛡️",
      badge: "Golden Rule & Trust",
      summary: "Young children can slip underwater silently in seconds: discover the non-negotiable touch-supervision rule, the pitfalls of floaties, and how parental eye contact forms the ultimate emotional lifejacket.",
      featured: false,
      publishedDate: "2026-08-15",
      author: "Baby Swim Vision Pedagogical Team",
      tags: ["Active Supervision", "Arm's Reach", "Emotional Safety", "Eye Contact", "Prevention", "Parent-Baby Bond"],
      content: {
        introduction: "An infant's safety in water rests upon two inseparable pillars: unbroken physical vigilance (the arm's reach rule) and an emotionally reassuring connection. Drowning in early childhood is silent and rapid, while a baby's confidence and willingness to explore depend directly on the relaxed touch and encouraging gaze of their caregiver.",
        sections: [
          {
            title: "The Arm's Reach Principle (< 1 Meter / Touch Supervision)",
            paragraphs: [
              "With infants and children under 3, a designated adult caregiver must always remain within immediate arm's reach in the water (less than 1 meter).",
              "Never look away, even for 'just a few seconds' to reach for a towel, check a phone, or answer a door.",
              "Always clearly designate which adult is supervising: when everyone thinks someone is watching, no one is truly watching."
            ],
            keyPoints: [
              "1 designated adult with 100% undivided attention",
              "Zero distractions (no phones, extended chats, or reading)",
              "Physical presence directly in the pool within arm's reach"
            ]
          },
          {
            title: "The Pitfall of Floaties, Armbands, and Inflatable Seats",
            paragraphs: [
              "Armbands, swim rings, and puddle jumpers are temporary buoyancy aids, not life-saving devices, and can never replace attentive adult presence.",
              "An inflatable aid can tip or slip in a fraction of a second, leaving the child unable to right their head independently."
            ],
            warning: "No buoyancy equipment can substitute for the active, attentive presence of a parent in the water."
          },
          {
            title: "The Caregiver's Gaze: Baby's Primary Emotional Lifejacket",
            paragraphs: [
              "Water magnifies sensations and emotions. A tense caregiver unintentionally transmits anxiety through rigid hands and posture.",
              "Support baby with soft, flexible, and adaptive holds that allow their body to feel water buoyancy safely.",
              "Maintain frequent, smiling eye contact: your face is the visual mirror in which baby verifies safety and calmness."
            ],
            keyPoints: [
              "Gentle, flexible, and enveloping hand holds",
              "Constant eye contact and smiles instantly defuse tension",
              "Calm voice and praise encourage joyful exploration"
            ]
          }
        ],
        takeaways: [
          "Active human supervision within arm's reach (< 1m) is the only 100% effective safeguard.",
          "Floaties and inflatable rings never replace adult hands-on presence.",
          "Your calm smiles and eye contact are your baby's primary emotional lifejacket.",
          "Celebrate every small initiative in the water with warm encouragement."
        ],
        sources: [
          "National Pediatric Drowning Prevention Guidelines",
          "Early Childhood Aquatic Psychomotricity & Attachment Security"
        ]
      }
    },
    {
      id: 'les-5-sens-bebe-eau',
      image: "/media/articles/5sens. 2026, 12_15_32.png",
      imageDefault: "/media/articles/5sens. 2026, 12_15_32.png",
      imageCaption: "Baby's 5 senses in the water: a multisensory discovery with their entire body.",
      slug: 'the-baby-5-senses-in-water-a-multisensory-discovery',
      title: "Baby's 5 Senses in the Water: A Multisensory Discovery",
      category: 'psychomotor',
      categoryLabel: "Psychomotor Development & Sensory Awakening",
      readingTime: "6 min",
      icon: "🖐️",
      badge: "Multisensory Discovery",
      summary: "In the pool, babies don't just discover water: they feel, listen to, look at, taste, and explore it with their whole body. A multisensory journey guided by parent-child bonding and emotional security.",
      featured: false,
      publishedDate: "2026-09-13",
      author: "Baby Swim Vision Pedagogical & Medical Team",
      tags: ["5 senses", "Sensory Awakening", "Multisensory", "Touch", "Taste", "Smell", "Hearing", "Vision", "Body in Space", "Parent-Baby Bond"],
      content: {
        introduction: "In the pool, a baby does not just discover water: they feel it, listen to it, watch it, taste it, and explore it with their entire body.\n\nFor an infant under one year of age, the world is a vast sensory experience. Their senses are active very early, continuing to develop and refine month after month.\n\nIn the aquatic environment, this exploration takes on a unique dimension: multiple senses are stimulated simultaneously. The baby receives a wealth of information about their body, environment, accompanying parent, and the novel sensations provided by water.",
        sections: [
          {
            title: "1. Touch: Feeling Water with the Whole Body",
            icon: "👋",
            paragraphs: [
              "Touch is particularly vital for the young infant.",
              "The skin allows them to experience contacts, pressures, movements, temperature, and varying textures. In water, the entire body becomes an expansive sensory surface.",
              "The baby perceives:\n• water temperature across their skin;\n• water pressure and currents moving around them;\n• shifts in momentum when carried or guided;\n• the reassuring contact of the parent's hands;\n• the subtle differences between being submerged, supported, or gently released.",
              "This rich tactile input progressively enhances the baby's spatial body awareness and proprioception.",
              "Parental touch remains indispensable. Hands that support, guide, or adjust posture provide foundational tactile and proprioceptive security."
            ],
            keyPoints: [
              "Skin as an expansive sensory organ in 3D immersion",
              "Perception of gentle pressure, temperature, and buoyancy",
              "Gradual awakening of proprioception and body awareness",
              "Parental hands provide reassuring tactile cues"
            ]
          },
          {
            title: "2. Taste: The Mouth as an Exploratory Tool",
            icon: "👅",
            paragraphs: [
              "For a baby, the mouth serves far more than just feeding.",
              "It is an extraordinary tool for sensory discovery. Babies instinctively bring objects to their mouth to explore shape, texture, temperature, and taste.",
              "Two distinct types of information are gathered simultaneously:\n• Taste informs about flavors.\n• Oral touch informs about texture, pressure, temperature, and form.",
              "In infants, touch and taste are closely linked during oral exploration, although they remain distinct senses.",
              "And in the pool? The mouth and lips naturally participate in discovering the aquatic realm. The baby feels the water gently touching their lips.",
              "This does not mean drinking or swallowing pool water. Aquatic exploration must always remain safe, supervised, and adapted to the baby's developmental age."
            ],
            keyPoints: [
              "The mouth: primary organ for tactile and gustatory exploration",
              "Close synergy between oral touch and taste in infancy",
              "Gentle contact of water around lips without swallowing"
            ],
            warning: "Exploring with the lips must never involve drinking or swallowing pool water. Supervision must remain vigilant and age-appropriate."
          },
          {
            title: "3. Smell: Recognizing Familiar Scents",
            icon: "👃",
            paragraphs: [
              "Smell is one of the earliest developing senses in infants.",
              "Familiar odors play a crucial role in affective comfort. During a pool session, the baby immediately recognizes the scent and warmth of their parent.",
              "In a novel environment, scents help anchor spatial and emotional landmarks.",
              "Babies do not explore a new space with their eyes alone: the olfactory cortex processes scents that help identify and accept their surroundings."
            ],
            keyPoints: [
              "Precocious sense active from birth",
              "The parent's natural scent provides an immediate emotional anchor",
              "Helps establish lasting comfort in unfamiliar environments"
            ]
          },
          {
            title: "4. Hearing: Listening to a Different Acoustic Realm",
            icon: "👂",
            paragraphs: [
              "Babies hear before birth, and auditory processing is fully operational from day one.",
              "At the pool, the acoustic environment is unique: voices, splashing, water echoes, and bubbling create an auditory landscape vastly different from home.",
              "When submerged, sound transmission changes dramatically. The infant experiences muffled acoustics, especially when their ears are underwater.",
              "The caregiver's gentle voice remains paramount: it serves as a steady, comforting compass amidst the ambient acoustics."
            ],
            keyPoints: [
              "Acoustic landscape unique to aquatic facilities",
              "Sound transmission shifts when ears touch the surface",
              "The parent's soothing voice is the ultimate comforting guide"
            ]
          },
          {
            title: "5. Vision: Observing, Tracking, and Anticipating",
            icon: "👀",
            paragraphs: [
              "Vision matures rapidly during the first months of life. While vision is immature at birth, acuity and tracking develop quickly.",
              "In water, baby observes:\n• their parent's facial expressions;\n• ripples and shimmering reflections;\n• contrasts between water and the surrounding space;\n• floating toys and movement of others;\n• changes in their own body orientation.",
              "Gradually, the baby learns to gaze, track, anticipate, and focus on points of interest.",
              "The parent's reassuring gaze is fundamental: a familiar, smiling face in a novel setting provides profound emotional safety."
            ],
            keyPoints: [
              "Visual maturation: tracking reflections, contrasts, and ripples",
              "Learning to anticipate movements and guide attention",
              "Parental smile and eye contact act as a beacon of security"
            ]
          },
          {
            title: "6. Sensory Integration: Senses Never Work in Isolation",
            icon: "🧠",
            paragraphs: [
              "This is one of the most fascinating aspects of aquatic exploration: the five senses do not function as isolated silos.",
              "The infant's brain processes sensory input simultaneously and weaves it into a coherent experience.",
              "For example: cradled gently in parental arms in the water, the baby can simultaneously:\n• 👀 look at their parent's smiling face;\n• 👂 hear their comforting voice;\n• 👋 feel warm water and supportive hands on their skin;\n• 🧠 sense their weightlessness and spatial orientation;\n• 👃 breathe in a familiar, loving scent.",
              "It is not a single sense exploring water, but a harmonious symphony of inputs that shapes their aquatic confidence.",
              "Unlike adults whose sensory systems are specialized, babies are holistic explorers: by touching, looking, listening, smelling, and mouthing, they learn through multisensory synthesis."
            ],
            keyPoints: [
              "Holistic sensory integration within the infant brain",
              "Real-time interplay of sight, sound, touch, smell, and balance",
              "Babies are natural multisensory explorers"
            ]
          },
          {
            title: "7. The Pool: An Exceptional Sensory Playground",
            icon: "🏊‍♀️",
            paragraphs: [
              "Water provides babies with an experience fundamentally different from dry land. It cradles the body, lightens movement, exerts hydrostatic pressure, and enables new motor freedom.",
              "Every position creates fresh sensations: being carried on the tummy, on the back, close to the chest, or floating gently with support offers distinct sensory feedback.",
              "A pool session becomes a rhythmic loop:\nI look → I feel → I listen → I move → I discover → I adapt.",
              "The goal is never performance or spectacle: it is about letting the child explore at their own unhurried pace, in a loving and secure embrace."
            ],
            keyPoints: [
              "Buoyancy and hydrodynamics liberate baby's natural motor skills",
              "Exploration loop: look → feel → listen → move → adapt",
              "Patience and gentleness over performance"
            ]
          },
          {
            title: "8. The Parent: The Anchor at the Heart of the Journey",
            icon: "❤️",
            paragraphs: [
              "Amidst this influx of novel sensations, the parent is the essential emotional anchor.",
              "Your voice, gaze, touch, and gentle hold provide the known safety baby needs.",
              "The water may be new, the sounds may be unusual, the feelings unfamiliar—yet baby rests in trusted arms.",
              "This emotional security frees the baby's cognitive energy to explore with joy and curiosity.",
              "Baby swimming is never just about physical movements: it is an intimate experience of connection, trust, and shared multisensory wonder."
            ],
            keyPoints: [
              "Caregiver presence is the foundation of confident exploration",
              "Voice, eye contact, and touch are essential emotional anchors",
              "An intimate journey of connection and shared discovery"
            ]
          }
        ],
        takeaways: [
          "For babies under one year, all five senses are actively developing and refining.",
          "Touch and proprioception help perceive the body in three-dimensional space.",
          "The mouth explores textures and contacts gently, without swallowing water.",
          "Smell and hearing anchor emotional security through parental presence and voice.",
          "Vision learns to fixate, track, and anticipate aquatic movements.",
          "All senses integrate together: discovering water is discovering with the whole body!"
        ],
        sources: [
          "Swiss Medical Review — Sensory & Motor Development in Infancy",
          "Multisensory Integration and Neurodevelopment in Early Childhood",
          "Aquatic Psychomotricity and Attachment Theory"
        ]
      }
    }
  ]
};

export function getLocalizedArticles(locale: string = 'fr'): PedagogicalArticle[] {
  if (locale && !locale.startsWith('fr')) {
    const translated = getTranslatedArticlesByLocale(locale);
    const baseList = PEDAGOGICAL_ARTICLES['en'] || PEDAGOGICAL_ARTICLES['fr'];
    if (translated && translated.length > 0) {
      const translatedMap = new Map<string, PedagogicalArticle>();
      translated.forEach((a) => {
        if (a && a.id) translatedMap.set(a.id, a);
      });
      return baseList.map((baseArt) => translatedMap.get(baseArt.id) || baseArt);
    }
  }

  const langKey = locale in PEDAGOGICAL_ARTICLES
    ? locale
    : locale.split('-')[0] in PEDAGOGICAL_ARTICLES
    ? locale.split('-')[0]
    : 'fr';

  return PEDAGOGICAL_ARTICLES[langKey] || PEDAGOGICAL_ARTICLES['fr'];
}

export function getLocalizedArticle(id: string, locale: string = 'fr'): PedagogicalArticle | undefined {
  const articles = getLocalizedArticles(locale);
  const found = articles.find((a) => a.id === id || a.slug === id);
  if (found) return found;

  const enArticles = PEDAGOGICAL_ARTICLES['en'] || [];
  const enFound = enArticles.find((a) => a.id === id || a.slug === id);
  if (enFound) return enFound;

  const frArticles = PEDAGOGICAL_ARTICLES['fr'] || [];
  return frArticles.find((a) => a.id === id || a.slug === id);
}
