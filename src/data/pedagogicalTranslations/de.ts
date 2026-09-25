import { LocalizedCategory, LocalizedSituation, LocalizedExercise } from '../pedagogicalDatabase';

export const deSkillCategories: Record<string, LocalizedCategory> = {
  decouverte_eau: {
    title: "Sinnesentdeckung & Wasseranpassung",
    description: "Sanfte Gewöhnung an das Wasser, Hautempfindungen, Akustik, 32°C warmes Wasser und liebevolle Rituale.",
    icon: "🌊",
    badge: "Sensorische Grundlagen",
    ageRange: "0 bis 6 Monate+",
    keyPrinciple: "Warmes Wasser bei 32°C, sanfte Rituale und Respekt für das individuelle Anpassungstempo.",
    skills: [
      {
        id: 'sk_eau_contact',
        name: "Akzeptanz von Wasser im Gesicht",
        description: "Das Baby akzeptiert ein paar Tropfen oder sanftes Wasser auf der Stirn ohne Verspannung oder Weinen.",
        observationChecklist: ["Entspanntes Gesicht und offene Augen", "Kein Schreckweinen", "Natürliches Blinzeln"],
        ageRange: "0 - 6 Monate",
        level: "decouverte",
        keyAdvice: "Beginnen Sie zu Hause in der Badewanne mit sanftem Wasserbeträufeln aus der hohlen Hand.",
        relatedArticleId: "preparation-bain-maison-eveil-aquatique"
      },
      {
        id: 'sk_eau_eclabousse',
        name: "Taktile Erkundung & Planschspiele",
        description: "Patscht neugierig und freudig mit Händen und Füßen ins Wasser, um die Wasserwiderstände zu begreifen.",
        observationChecklist: ["Fokussierter oder lächelnder Blick", "Rhythmische Hand- und Fußbewegungen", "Gezieltes Erzeugen von Wellen"],
        ageRange: "4 - 12 Monate",
        level: "decouverte",
        keyAdvice: "Lassen Sie das Kind frei planschen, um Auftrieb und Wasserwiderstand zu spüren.",
        relatedExerciseId: "exo_tapis_volant"
      },
      {
        id: 'sk_eau_thermique',
        name: "Thermischer Komfort & Wohlbefinden",
        description: "Aufrechterhaltung von lebendigem Muskeltonus und rosiger Haut in 32°C warmem Wasser.",
        observationChecklist: ["Rosige und warme Haut", "Kein Zittern oder blaue Lippen", "Angepasste Einheiten (20-30 Min max)"],
        ageRange: "0 - 12 Monate",
        level: "decouverte",
        keyAdvice: "Verlassen Sie das Becken beim ersten Anzeichen von Frösteln. Wassertemperatur bei mind. 32°C halten.",
        relatedArticleId: "bebe-nageur-guide-pratique-complet"
      }
    ]
  },
  equilibre: {
    title: "Körperbalance & Auftriebskraft",
    description: "Rumpfstabilität, natürliche Bauchlage und harmonische Kopf-Wirbelsäulen-Achse.",
    icon: "⚖️",
    badge: "Motorik & Biomechanik",
    ageRange: "4 bis 18 Monate",
    keyPrinciple: "Natürliche Bauchlage ohne Nackenverspannung durch sanfte Entlastung und Auftrieb.",
    skills: [
      {
        id: 'sk_eq_horizontal_ventral',
        name: "Waagerechte Bauchlage",
        description: "Das Baby streckt seinen Körper an der Wasseroberfläche, statt sich aufzurichten.",
        observationChecklist: ["Hüften nahe der Oberfläche", "Gestreckte und lockere Beine", "Kopf in Verlängerung der Wirbelsäule"],
        ageRange: "4 - 12 Monate",
        level: "decouverte",
        keyAdvice: "Stützen Sie sanft unter Brust oder Becken, um die Streckung zu begleiten.",
        relatedExerciseId: "exo_portage_ventral"
      },
      {
        id: 'sk_eq_relachement',
        name: "Ganzheitliche Muskelentspannung",
        description: "Keine Verkrampfung oder Überstreckung: Das Kind lässt sich vom Wasser tragen.",
        observationChecklist: ["Lockere Gliedmaßen", "Offene Händchen", "Ruhige Atmung"],
        ageRange: "4 - 18 Monate",
        level: "confiance",
        keyAdvice: "Verwenden Sie Poolnudeln anstelle starrer Schwimmflügel für bessere Bewegungsfreiheit.",
        relatedArticleId: "bouees-brassards-materiel-flottaison-securite"
      },
      {
        id: 'sk_eq_rotation',
        name: "Gleichgewicht & Raumorientierung",
        description: "Fähigkeit, den Blick auszurichten und den Rumpf ohne Orientierungsverlust zu stabilisieren.",
        observationChecklist: ["Suche nach festen Blickpunkten", "Kein panisches Drehen", "Kopf-Nacken-Achse gewahrt"],
        ageRange: "6 - 18 Monate",
        level: "confiance",
        keyAdvice: "Wenn das Kind sich dreht, heben Sie es ruhig an, um Blickpunkte zu fixieren.",
        relatedExerciseId: "exo_etoile_dorsale"
      }
    ]
  },
  flottaison_dorsale: {
    title: "Rückenlage & Tiefenentspannung",
    description: "Akzeptanz der Ohren im Wasser, Blick zur Decke, Seestern-Haltung und sanfte Hinterkopfstütze.",
    icon: "⭐",
    badge: "Vertrauen & Schweben",
    ageRange: "4 bis 24 Monate",
    keyPrinciple: "Sichere Nackenstütze, eingetauchte Ohren und das beruhigende Bötchen-Lied.",
    skills: [
      {
        id: 'sk_flot_oreilles',
        name: "Ohren entspannt im Wasser",
        description: "Das Baby lässt die Ohren untertauchen, ohne den Kopf ängstlich hochzureißen.",
        observationChecklist: ["Gehörgänge im Wasser ohne Schreck", "Ruhiger Blick nach oben", "Entspannter Nacken"],
        ageRange: "4 - 12 Monate",
        level: "decouverte",
        keyAdvice: "Singen Sie leise, während Ihre Hand den Nacken stützt und das Wasser die Ohren umspült.",
        relatedArticleId: "flottaison-dorsale-bebe-nageur-jeu-bateau"
      },
      {
        id: 'sk_flot_etoile',
        name: "Seestern-Position auf dem Rücken",
        description: "Ausbreiten von Armen und Beinen in Kreuzform auf dem Rücken.",
        observationChecklist: ["Arme seitlich geöffnet", "Bauch schwimmt oben", "Vollständig entspannter Körper"],
        ageRange: "6 - 18 Monate",
        level: "confiance",
        keyAdvice: "Verringern Sie nach und nach den Druck unter dem Rücken, damit das Baby den Auftrieb spürt.",
        relatedExerciseId: "exo_etoile_dorsale"
      }
    ]
  },
  immersion: {
    title: "Begleitetes Tauchen & Atemschutzreflex",
    description: "Sanftes, zügiges Tauchen (1-2s) von Angesicht zu Angesicht mit sofortigem Kuschelkontakt.",
    icon: "🤿",
    badge: "Tauchen & Sicherheit",
    ageRange: "4 bis 24 Monate",
    keyPrinciple: "Gleichmäßiges, zügiges Abtauchen auf Augenhöhe mit direktem Trostkuscheln.",
    skills: [
      {
        id: 'sk_imm_rituel',
        name: "Verständnis des Vorbereitungsrituals",
        description: "Das Baby antizipiert das Tauchen beim gewohnten Signal ruhig und ohne Angst.",
        observationChecklist: ["Aufmerksamer Blick", "Mundschluss", "Bereiter Körper"],
        ageRange: "4 - 12 Monate",
        level: "decouverte",
        keyAdvice: "Verwenden Sie stets dasselbe Ritual («1, 2, 3... tauchen!») mit ruhiger Stimme.",
        relatedExerciseId: "exo_petit_plongeon_rituel"
      },
      {
        id: 'sk_imm_apnee',
        name: "Larynxverschluss & Tauchreflex",
        description: "Sicherer Verschluss der Atemwege während des Tauchgangs mit offenen Augen.",
        observationChecklist: ["Kein Wasserschlucken", "Ruhiger Blick", "Entspanntes Auftauchen"],
        ageRange: "4 - 18 Monate",
        level: "confiance",
        keyAdvice: "Der Tauchgang darf nur 1 bis 2 Sekunden dauern und endet mit einem liebevollen Lächeln.",
        relatedExerciseId: "exo_immersion_verticale_face_face"
      }
    ]
  },
  deplacements: {
    title: "Fortbewegung & Antrieb",
    description: "Spontane Beinbewegungen, Schwimmen zum Spielzeug, Autonomie und instinktiver Paddelschlag.",
    icon: "🐬",
    badge: "Antrieb & Mobilität",
    ageRange: "6 bis 36 Monate",
    keyPrinciple: "Aktives Beinpaddeln, motiviert durch schwimmendes Spielzeug.",
    skills: [
      {
        id: 'sk_dep_battements',
        name: "Abwechselnder Beinschlag",
        description: "Dynamische Beinbewegungen, die den Körper vorwärts antreiben.",
        observationChecklist: ["Gestreckte und aktive Beine", "Regelmäßiger Rhythmus", "Sichtbarer Vortrieb"],
        ageRange: "6 - 18 Monate",
        level: "confiance",
        keyAdvice: "Platzieren Sie ein Spielzeug 50 cm vor dem Baby, um den Beinschlag anzuregen.",
        relatedExerciseId: "exo_chasse_aux_canards"
      },
      {
        id: 'sk_dep_autonomie',
        name: "Selbstständiges Schwimmen zum Beckenrand",
        description: "Eigenständige Fortbewegung zum Beckenrand oder zu einer Schwimmmatte.",
        observationChecklist: ["Zielgerichtete Ausrichtung", "Koordinierte Arm- und Beinbewegungen", "Sicheres Festhalten"],
        ageRange: "12 - 36 Monate",
        level: "autonomie",
        keyAdvice: "Ermutigen Sie zu kurzen eigenständigen Schwimmstrecken in Ihre Arme.",
        relatedExerciseId: "exo_chasse_aux_canards"
      }
    ]
  },
  respiration: {
    title: "Atmung & Wasserblasen",
    description: "Atemkontrolle, Blasenpusten an der Oberfläche und emotionale Beruhigung.",
    icon: "🌬️",
    badge: "Atmung & Gelassenheit",
    ageRange: "4 bis 36 Monate",
    keyPrinciple: "Spielerisches Ausatmen an der Wasseroberfläche und Gefühlsregulation.",
    skills: [
      {
        id: 'sk_resp_bulles',
        name: "Wasserblasen an der Oberfläche",
        description: "Freiwilliges Ausatmen an der Wasseroberfläche durch spielerische Nachahmung.",
        observationChecklist: ["Lippen an der Oberfläche", "Sichtbare Luftblasen", "Freudiges Wiederholen"],
        ageRange: "6 - 24 Monate",
        level: "confiance",
        keyAdvice: "Pusten Sie selbst Blasen vor, um die Nachahmung Ihres Babys anzuregen.",
        relatedExerciseId: "exo_bocal_poissons"
      },
      {
        id: 'sk_resp_calme',
        name: "Selbstregulation & Beruhigung",
        description: "Schnelle Rückkehr zu einer ruhigen Atmung nach Schreck oder Aufregung.",
        observationChecklist: ["Beruhigung in unter 10 Sekunden", "Gleichmäßige Atmung", "Blickkontakt"],
        ageRange: "0 - 36 Monate",
        level: "decouverte",
        keyAdvice: "Kuscheln Sie das Baby an Ihre Brust: Ihre Herzfrequenz und Stimme beruhigen es sofort.",
        relatedArticleId: "bebe-peur-eau-blocage-deculpabiliser"
      }
    ]
  },
  entree_eau: {
    title: "Wassereintritt, Sprünge & Ausstiege",
    description: "Sitzendes Hineingleiten, geführte Sprünge vom Rand, Mattenrutschen und Hochziehen.",
    icon: "🧗",
    badge: "Mut & Grobmotorik",
    ageRange: "6 bis 36 Monate",
    keyPrinciple: "Schrittweiser Aufbau, sanftes Abfedern und Erlernen sicheren Halts.",
    skills: [
      {
        id: 'sk_ent_assise',
        name: "Sanftes Hereingleiten im Sitzen",
        description: "Hineingleiten in die Arme der Eltern ohne Kopfüberstreckung oder Erschrecken.",
        observationChecklist: ["Hände am Rand", "Kontrolliertes Vorbeugen", "Sanftes Eintauchen"],
        ageRange: "6 - 18 Monate",
        level: "decouverte",
        keyAdvice: "Setzen Sie das Baby an den Rand und fangen Sie es sanft unter den Achseln auf.",
        relatedExerciseId: "exo_plongeon_assis"
      },
      {
        id: 'sk_ent_saut_accompagne',
        name: "Geführter Sprung vom Rand",
        description: "Freiwilliges Abspringen mit den Beinen in die offenen Arme des Elternteils.",
        observationChecklist: ["Aktives Beugen der Knie", "Mutiger Absprung nach vorn", "Freude bei Ankunft"],
        ageRange: "9 - 36 Monate",
        level: "confiance",
        keyAdvice: "Zählen Sie «1, 2, 3... Sprung!» und federn Sie die Landung sanft im Wasser ab.",
        relatedExerciseId: "exo_toboggan_tapis"
      },
      {
        id: 'sk_ent_sortie',
        name: "Aktives Hochziehen & Ausstieg",
        description: "Fähigkeit, Handflächen und Knie aufzusetzen, um auf die Matte oder den Rand zu klettern.",
        observationChecklist: ["Fester Handstütz", "Beinabstoß", "Heben des Oberkörpers"],
        ageRange: "12 - 36 Monate",
        level: "autonomie",
        keyAdvice: "Lassen Sie das Baby die Kraft spüren, die nötig ist, um sich selbst hochzuziehen.",
        relatedExerciseId: "exo_parcours_tapis"
      }
    ]
  },
  autonomie_securite: {
    title: "Autonomie & Selbstrettung",
    description: "Festhalten am Beckenrand, Drehen im Wasser, Haltesuche und Rettungsbewegungen.",
    icon: "🛡️",
    badge: "Sicherheit & Selbstrettung",
    ageRange: "6 bis 36 Monate",
    keyPrinciple: "Sofortiges Festhalten am Rand oder schwimmenden Auftriebshilfen erlernen.",
    skills: [
      {
        id: 'sk_sec_bord',
        name: "Festhaltereflex am Beckenrand",
        description: "Das Kind greift und hält sich selbstständig mit beiden Händen am Rand fest.",
        observationChecklist: ["Fester Griff am Beckenrand", "Sicheres Halten des Körpers", "Blick zum Rand"],
        ageRange: "6 - 24 Monate",
        level: "confiance",
        keyAdvice: "Üben Sie nach jeder Übung das Berühren und Festhalten am Beckenrand.",
        relatedArticleId: "securite-aquatique-surveillance-active-portee-bras"
      },
      {
        id: 'sk_sec_retournement',
        name: "Sicherheitsdrehung zum Erwachsenen",
        description: "Fähigkeit, den Körper im Wasser umzudrehen, um sich dem Elternteil zuzuwenden.",
        observationChecklist: ["Ruhige Drehung", "Steuernde Armbewegung", "Blickkontakt"],
        ageRange: "9 - 36 Monate",
        level: "autonomie",
        keyAdvice: "Üben Sie sanfte Drehungen in Ihre Arme bei ständiger Reichweite von unter 1 Meter.",
        relatedExerciseId: "exo_etoile_dorsale"
      }
    ]
  }
};

export const deSituations: Record<string, LocalizedSituation> = {
  sit_immersion_verticale_face_adulte: {
    title: "Vertikales Tauchen von Angesicht zu Angesicht",
    description: "Referenz-Tauchgang: Sanftes, vertikales Eintauchen auf Augenhöhe mit direktem Trostkuscheln.",
    observationCriteria: ["Ständiger Blickkontakt", "Aufrechte Körperachse", "Sofortiges Beruhigungskuscheln"],
    recommendedAgeRange: "4 bis 18 Monate"
  },
  sit_immersion_preparee: {
    title: "Kleiner Tauchgang mit Ankündigungs-Spritzer",
    description: "Spielerisches Ritual mit Wasserspritzern auf die Stirn vor kurzem Tauchgang.",
    observationCriteria: ["Wiedererkennen des Signals", "Vorbeugender Atemstopp", "Entspannte Mimik"],
    recommendedAgeRange: "6 bis 24 Monate"
  },
  sit_portage_ventral: {
    title: "Bauchlage & Entspanntes Gleiten",
    description: "Waagerechtes Gleiten auf dem Bauch mit sanfter Brustunterstützung.",
    observationCriteria: ["Horizontale Körperlage", "Lockere Beinbewegungen", "Entspannter Nacken"],
    recommendedAgeRange: "4 bis 18 Monate"
  },
  sit_flottaison_dorsale: {
    title: "Rückenschweben als Seestern",
    description: "Entspannte Rückenhaltung mit Ohren im Wasser und sanfter Hinterkopfstütze.",
    observationCriteria: ["Eingetauchte Ohren", "Ruhiger Blick nach oben", "Gelöster Körper"],
    recommendedAgeRange: "4 bis 24 Monate"
  },
  sit_deplacement_propulsion: {
    title: "Fortbewegung & Beinschlag zum Spielzeug",
    description: "Dynamischer Beinschlag und Vorwärtskommen, motiviert durch ein schwimmendes Spielzeug.",
    observationCriteria: ["Koordinierter Beinschlag", "Blick auf das Spielzeug", "Sichtbarer Vortrieb"],
    recommendedAgeRange: "6 bis 36 Monate"
  },
  sit_entree_bord: {
    title: "Sitzender Einstieg & Hineingleiten vom Rand",
    description: "Sanftes Hineingleiten vom Beckenrand in die Arme des Elternteils.",
    observationCriteria: ["Ruhiges Starten", "Abgefederte Landung im Wasser", "Vertrauen und Lächeln"],
    recommendedAgeRange: "6 bis 24 Monate"
  }
};

export const deExercises: Record<string, LocalizedExercise> = {
  exo_immersion_verticale_face_face: {
    title: "1. Vertikales Tauchen von Angesicht zu Angesicht",
    objective: "Einen ersten ruhigen und kurzen Tauchgang (1-2s) in emotionaler Geborgenheit durchführen.",
    recommendedAge: "4 bis 18 Monate",
    duration: "1 bis 2 Minuten (1 Wiederholung)",
    repetition: "1 bis 2 Tauchgänge pro Einheit",
    tags: ["Tauchen", "Geborgenheit", "Augenkontakt", "Tauchreflex"],
    steps: [
      "Stehen Sie im Wasser (schultertief) und halten Sie Ihr Baby aufrecht eng an Ihre Brust geschmiegt.",
      "Schauen Sie Ihrem Baby in die Augen, lächeln Sie und zählen Sie ruhig «1, 2, 3... tauchen!».",
      "Gehen Sie sanft in die Knie, um gemeinsam 1 Sekunde in aufrechter Haltung unterzutauchen.",
      "Kommen Sie sofort wieder hoch, schmiegen Sie Ihre Wange an seine und loben Sie es herzlich."
    ],
    commonMistakes: [
      "Das Baby nach unten drücken, während der Erwachsene oben bleibt.",
      "Zu lange Tauchgänge ohne Ankündigung.",
      "Den Kopf des Babys nach hinten überstrecken."
    ],
    corrections: [
      "Tauchen Sie immer gemeinsam auf gleicher Höhe ab.",
      "Begrenzen Sie die Tauchzeit in den ersten Monaten auf genau 1 Sekunde."
    ],
    safetyTips: [
      "Tauchen Sie niemals mit einem weinenden Baby.",
      "Prüfen Sie, dass das Wasser mindestens 32°C warm ist."
    ]
  },
  exo_petit_plongeon_rituel: {
    title: "Der Kleine Tauchgang mit Ankündigungs-Spritzer",
    objective: "Ein spielerisches Signal etablieren, damit das Baby vor dem Tauchen die Luft anhält.",
    recommendedAge: "6 bis 24 Monate",
    duration: "2 Minuten",
    tags: ["Ritual", "Antizipation", "Wasserspiel"],
    steps: [
      "Halten Sie das Baby vor sich mit beiden Händen unter der Brust.",
      "Beträufeln Sie sanft seine Stirn mit ein paar Tropfen und sprechen Sie das Ritual.",
      "Schaukeln Sie es sanft und begleiten Sie ein kurzes 1-Sekunden-Tauchen.",
      "Heben Sie es mit einem strahlenden Lächeln wieder zu sich hoch."
    ],
    commonMistakes: [
      "Überraschendes Tauchen ohne Signal oder Blickkontakt."
    ],
    corrections: [
      "Verwenden Sie stets dasselbe gesungene Ritual."
    ],
    safetyTips: [
      "Achten Sie darauf, dass das Baby entspannt und aufmerksam ist."
    ]
  },
  exo_tapis_volant: {
    title: "Der Fliegende Teppich: Sanftes Bauchgleiten",
    objective: "Die natürliche waagerechte Bauchlage und Muskelentspannung fördern.",
    recommendedAge: "4 bis 18 Monate",
    duration: "3 bis 5 Minuten",
    tags: ["Waagerecht", "Entspannung", "Auftrieb"],
    steps: [
      "Legen Sie Ihr Baby in Bauchlage ins Wasser, Ihre Hände stützen sanft unter der Brust.",
      "Gehen Sie langsam rückwärts, um einen leichten Wasserstrom unter seinem Körper zu erzeugen.",
      "Lockern Sie Ihre Hände, damit das Baby den Auftrieb des Wassers spürt.",
      "Singen Sie ein beruhigendes Lied und halten Sie liebevollen Blickkontakt."
    ],
    commonMistakes: [
      "Das Baby aufrecht halten, anstatt es waagerecht gleiten zu lassen."
    ],
    corrections: [
      "Gehen Sie im Wasser in die Knie, damit Ihre Arme auf Höhe der Wasseroberfläche sind."
    ],
    safetyTips: [
      "Halten Sie Ihre Hände stets bereit, um den Kopf bei Bedarf sanft zu stützen."
    ]
  },
  exo_etoile_dorsale: {
    title: "Der Seestern auf dem Rücken & das Bötchen",
    objective: "Die Rückenlage mit den Ohren im Wasser in voller Entspannung annehmen.",
    recommendedAge: "4 bis 24 Monate",
    duration: "3 Minuten",
    tags: ["Rückenlage", "Ohren im Wasser", "Seestern", "Schweben"],
    steps: [
      "Legen Sie das Baby auf den Rücken, der Hinterkopf ruht auf Ihrer Schulter oder Handfläche.",
      "Lassen Sie das Wasser sanft die Ohren umspülen und singen Sie ein Lied.",
      "Öffnen Sie Arme und Beinchen kreuzförmig wie ein Seestern.",
      "Gehen Sie langsam vorwärts und wiegen Sie es sanft wie ein Bötchen auf den Wellen."
    ],
    commonMistakes: [
      "Den Kopf gewaltsam aus dem Wasser heben und den Nacken anspannen.",
      "Angst vor Wasser in den Ohren haben (völlig ungefährlich)."
    ],
    corrections: [
      "Lassen Sie die Ohren im Wasser, damit der Körper mühelos und entspannt schwebt."
    ],
    safetyTips: [
      "Stützen Sie stets den Hinterkopf, damit Mund und Nase über Wasser bleiben."
    ]
  },
  exo_chasse_aux_canards: {
    title: "Entenjagd: Beinschlag & Vorwärtsdrang",
    objective: "Den abwechselnden Beinschlag und die Fortbewegung zum Spielzeug anregen.",
    recommendedAge: "6 bis 36 Monate",
    duration: "4 Minuten",
    tags: ["Beinschlag", "Antrieb", "Spielzeug", "Koordination"],
    steps: [
      "Legen Sie ein schwimmendes Spielzeug 40-50 cm vor das Baby.",
      "Stützen Sie es waagerecht unter der Brust und ermuntern Sie es zum Spielzeug.",
      "Spüren Sie die Beinbewegungen und lassen Sie den eigenen Beinschlag das Baby vorwärts tragen.",
      "Freuen und loben Sie sich gemeinsam, wenn es das Spielzeug greift."
    ],
    commonMistakes: [
      "Das Baby zu schnell ziehen, statt es sich selbst antreiben zu lassen."
    ],
    corrections: [
      "Verringern Sie den Zug und pausieren Sie 2 Sekunden, damit es die eigene Wirkung spürt."
    ],
    safetyTips: [
      "Stützen Sie sicher, damit das Gesicht bei Ermüdung nicht ins Wasser sinkt."
    ]
  },
  exo_entree_bord_toboggan: {
    title: "Die Rutsche im Sitzen vom Beckenrand",
    objective: "Einen sanften, sicheren und spaßigen Wassereinstieg vom Beckenrand erlernen.",
    recommendedAge: "6 bis 24 Monate",
    duration: "2 bis 3 Minuten",
    tags: ["Einstieg", "Beckenrand", "Rutsche", "Autonomie"],
    steps: [
      "Setzen Sie das Baby an den Beckenrand, Füßchen baumeln im Wasser.",
      "Stehen Sie vor ihm im Wasser mit offenen Händen an seinen Hüften.",
      "Zählen Sie fröhlich «1, 2, 3... rutschen!» und laden Sie es zum Vorbeugen ein.",
      "Federn Sie das Hineingleiten sanft ab und umarmen Sie es mit einem Lächeln."
    ],
    commonMistakes: [
      "Zu stark am Baby ziehen und es aus dem Gleichgewicht bringen."
    ],
    corrections: [
      "Lassen Sie das Baby die Bewegung durch Vorbeugen selbst einleiten."
    ],
    safetyTips: [
      "Achten Sie auf rutschfesten Halt am Rand und bleiben Sie in unmittelbarer Reichweite."
    ]
  }
};
