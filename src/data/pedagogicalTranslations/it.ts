import { LocalizedCategory, LocalizedSituation, LocalizedExercise } from '../pedagogicalDatabase';

export const itSkillCategories: Record<string, LocalizedCategory> = {
  decouverte_eau: {
    title: "Scoperta & Adattamento Sensoriale",
    description: "Familiarizzazione con l'elemento acquatico, sensazioni sulla pelle, rumori, acqua a 32°C e rituali dolci.",
    icon: "🌊",
    badge: "Basi Sensoriali",
    ageRange: "0 a 6 mesi+",
    keyPrinciple: "Acqua calda a 32°C, rituali delicati con la mano e rispetto del ritmo di adattamento.",
    skills: [
      {
        id: 'sk_eau_contact',
        name: "Tolleranza al contatto dell'acqua sul viso",
        description: "Il bebè accetta gocce d'acqua sulla fronte senza rigidità né pianto riflesso.",
        observationChecklist: ["Viso rilassato e occhi aperti", "Nessun pianto riflesso", "Battito naturale delle ciglia"],
        ageRange: "0 - 6 mesi",
        level: "decouverte",
        keyAdvice: "Iniziate a casa nel bagnetto versando dolcemente acqua sulla fronte con il palmo della mano.",
        relatedArticleId: "preparation-bain-maison-eveil-aquatique"
      },
      {
        id: 'sk_eau_eclabousse',
        name: "Esplorazione tattile e giochi di schizzi",
        description: "Batte l'acqua con mani o piedi con gioia e curiosità per percepire la materia.",
        observationChecklist: ["Sguardo attento o sorridente", "Movimenti ritmici di mani e piedi", "Creazione intenzionale di onde"],
        ageRange: "4 - 12 mesi",
        level: "decouverte",
        keyAdvice: "Lasciate che il bambino crei i propri schizzi per comprendere densità e resistenza dell'acqua.",
        relatedExerciseId: "exo_tapis_volant"
      },
      {
        id: 'sk_eau_thermique',
        name: "Comfort termico e vigilanza sensoriale",
        description: "Mantenimento del tono attivo e della pelle rosea in acqua riscaldata a 32°C.",
        observationChecklist: ["Pelle calda e rosea", "Assenza di brividi o labbra bluastre", "Sessione calibrata (20-30 min max)"],
        ageRange: "0 - 12 mesi",
        level: "decouverte",
        keyAdvice: "Uscite dalla vasca ai primi cenni di brivido. Mantenete l'acqua ad almeno 32°C.",
        relatedArticleId: "bebe-nageur-guide-pratique-complet"
      }
    ]
  },
  equilibre: {
    title: "Equilibrio Posturale & Spinta di Archimede",
    description: "Stabilità del tronco, orizzontalità ventrale naturale e allineamento testa-colonna senza inarcamenti.",
    icon: "⚖️",
    badge: "Motricità & Biomeccanica",
    ageRange: "4 a 18 mesi",
    keyPrinciple: "Orizzontalità naturale senza tensione al collo grazie al sostegno leggero e al galleggiamento.",
    skills: [
      {
        id: 'sk_eq_horizontal_ventral',
        name: "Orizzontalità in posizione ventrale",
        description: "Il bebè distende il corpo sulla superficie dell'acqua anziché sedersi.",
        observationChecklist: ["Bacino vicino alla superficie", "Gambe distese e morbide", "Testa allineata con il tronco"],
        ageRange: "4 - 12 mesi",
        level: "decouverte",
        keyAdvice: "Sostenete dolcemente sotto il bacino o il torace per guidare la distensione senza bloccare le gambe.",
        relatedExerciseId: "exo_portage_ventral"
      },
      {
        id: 'sk_eq_relachement',
        name: "Rilassamento muscolare globale & galleggiamento",
        description: "Assenza di rigidità: il bambino lascia che la spinta dell'acqua sostenga il suo peso.",
        observationChecklist: ["Arti morbidi e sciolti", "Pugni aperti senza tensione", "Respiro regolare"],
        ageRange: "4 - 18 mesi",
        level: "confiance",
        keyAdvice: "Preferite i tubi galleggianti ai braccioli rigidi per preservare la libertà di postura.",
        relatedArticleId: "bouees-brassards-materiel-flottaison-securite"
      },
      {
        id: 'sk_eq_rotation',
        name: "Equilibrio e punti di riferimento visivi",
        description: "Capacità di orientare lo sguardo e stabilizzare il tronco senza disorientamento.",
        observationChecklist: ["Ricerca di punti visivi fissi", "Assenza di rotazioni nel panico", "Allineamento capo-collo"],
        ageRange: "6 - 18 mesi",
        level: "confiance",
        keyAdvice: "Se il bambino ruota su se stesso, sollevatelo con calma per aiutarlo a fissare lo sguardo.",
        relatedExerciseId: "exo_etoile_dorsale"
      }
    ]
  },
  flottaison_dorsale: {
    title: "Galleggiamento Dorsale & Abbandono Corporeo",
    description: "Accettazione delle orecchie nell'acqua, sguardo verso l'alto, stella marina e leggero supporto nucale.",
    icon: "⭐",
    badge: "Fiducia & Galleggiamento",
    ageRange: "4 a 24 mesi",
    keyPrinciple: "Supporto nucale sicuro, orecchie immerse e la dolce canzone della barchetta.",
    skills: [
      {
        id: 'sk_flot_oreilles',
        name: "Accettazione delle orecchie immerse",
        description: "Il bebè lascia immergere le orecchie nell'acqua senza sollevare la testa con tensione.",
        observationChecklist: ["Orecchie nell'acqua senza sussulti", "Sguardo sereno verso l'alto", "Collo disteso"],
        ageRange: "4 - 12 mesi",
        level: "decouverte",
        keyAdvice: "Cantate dolcemente tenendo la mano dietro la nuca, lasciando che l'acqua sfiori le orecchie.",
        relatedArticleId: "flottaison-dorsale-bebe-nageur-jeu-bateau"
      },
      {
        id: 'sk_flot_etoile',
        name: "Posizione a stella marina dorsale",
        description: "Apertura a croce di braccia e gambe in posizione dorsale.",
        observationChecklist: ["Braccia aperte lateralmente", "Pancia galleggiante in superficie", "Corpo rilassato"],
        ageRange: "6 - 18 mesi",
        level: "confiance",
        keyAdvice: "Alleggerite progressivamente il sostegno sotto la schiena per fargli percepire la spinta dell'acqua.",
        relatedExerciseId: "exo_etoile_dorsale"
      }
    ]
  },
  immersion: {
    title: "Immersione Accompagnata & Apnea Riflessa",
    description: "Discese verticali dolci e continue (1-2s), faccia a faccia con il genitore, sguardo sereno e coccole.",
    icon: "🤿",
    badge: "Apnea & Sicurezza",
    ageRange: "4 a 24 mesi",
    keyPrinciple: "Immersione dolce e continua faccia a faccia con abbraccio rassicurante immediato.",
    skills: [
      {
        id: 'sk_imm_rituel',
        name: "Comprensione del rituale preparatorio",
        description: "Il bebè anticipa l'immersione al segnale abituale con serenità.",
        observationChecklist: ["Sguardo attento", "Chiusura preventiva della bocca", "Corpo pronto"],
        ageRange: "4 - 12 mesi",
        level: "decouverte",
        keyAdvice: "Utilizzate sempre le stesse parole di avviso («1, 2, 3... splash!») con voce calma.",
        relatedExerciseId: "exo_petit_plongeon_rituel"
      },
      {
        id: 'sk_imm_apnee',
        name: "Chiusura laringea riflessa & immersione",
        description: "Blocco riflesso e a tenuta delle vie aeree durante l'immersione con occhi sereni.",
        observationChecklist: ["Senza bere acqua", "Occhi aperti o sereni", "Emersione tranquilla"],
        ageRange: "4 - 18 mesi",
        level: "confiance",
        keyAdvice: "L'immersione deve durare solo 1 o 2 secondi e terminare con un caloroso sorriso.",
        relatedExerciseId: "exo_immersion_verticale_face_face"
      }
    ]
  },
  deplacements: {
    title: "Spostamenti & Propulsione",
    description: "Gambata alternata vigorosa, nuotata verso il giocattolo, autonomia e nuoto istintivo a cagnolino.",
    icon: "🐬",
    badge: "Propulsione & Motricità",
    ageRange: "6 a 36 mesi",
    keyPrinciple: "Gambata attiva stimolata da giochi galleggianti e libertà di movimento.",
    skills: [
      {
        id: 'sk_dep_battements',
        name: "Gambata propulsiva alternata",
        description: "Movimenti alternati e dinamici delle gambe che spingono il corpo in avanti.",
        observationChecklist: ["Gambe distese e attive", "Spinta ritmica", "Avanzamento visibile"],
        ageRange: "6 - 18 meses",
        level: "confiance",
        keyAdvice: "Posizionate un giocattolo a 50 cm per fargli sperimentare l'effetto della propria gambata.",
        relatedExerciseId: "exo_chasse_aux_canards"
      },
      {
        id: 'sk_dep_autonomie',
        name: "Spostamento autonomo verso il bordo",
        description: "Propulsione autonoma per raggiungere il bordo piscina o un tappetino.",
        observationChecklist: ["Direzione mirata all'obiettivo", "Coordinazione braccia-gambe", "Presa solida"],
        ageRange: "12 - 36 mesi",
        level: "autonomie",
        keyAdvice: "Incoraggiate brevi tragitti autonomi verso le vostre braccia o verso il bordo.",
        relatedExerciseId: "exo_chasse_aux_canards"
      }
    ]
  },
  respiration: {
    title: "Respirazione & Bolle d'Acqua",
    description: "Controllo respiratorio, soffiare bolle in superficie e calma emotiva tra le braccia del genitore.",
    icon: "🌬️",
    badge: "Respirazione & Serenità",
    ageRange: "4 a 36 mesi",
    keyPrinciple: "Espirazione ludica a filo d'acqua e regolazione emotiva dolce.",
    skills: [
      {
        id: 'sk_resp_bulles',
        name: "Soffiare bolle in superficie",
        description: "Espirazione volontaria a pelo d'acqua per imitazione giocosa.",
        observationChecklist: ["Labbra a livello dell'acqua", "Bolle d'aria visibili", "Gioco ripetuto"],
        ageRange: "6 - 24 mesi",
        level: "confiance",
        keyAdvice: "Soffiate prima voi le bolle con la bocca per innescare l'imitazione naturale del bebè.",
        relatedExerciseId: "exo_bocal_poissons"
      },
      {
        id: 'sk_resp_calme',
        name: "Autoregolazione e quiete emotiva",
        description: "Recupero rapido di un respiro regolare dopo una sorpresa o agitazione.",
        observationChecklist: ["Calma in meno di 10 secondi", "Respiro regolare", "Contatto visivo ristabilito"],
        ageRange: "0 - 36 mesi",
        level: "decouverte",
        keyAdvice: "Stringete il bebè al petto: il vostro battito cardiaco e la voce calma lo rassicurano subito.",
        relatedArticleId: "bebe-peur-eau-blocage-deculpabiliser"
      }
    ]
  },
  entree_eau: {
    title: "Entrate in Acqua, Salti & Uscite",
    description: "Scivolate da seduti, salti guidati dal bordo, scivoli e risalita autonoma sui tappeti.",
    icon: "🧗",
    badge: "Audacia & Motricità Globale",
    ageRange: "6 a 36 mesi",
    keyPrinciple: "Progressione graduale, ammortizzazione affettuosa e presa solida.",
    skills: [
      {
        id: 'sk_ent_assise',
        name: "Entrata dolce da seduti dal bordo",
        description: "Scivolata nelle braccia del genitore senza scossoni né iperestensione del collo.",
        observationChecklist: ["Mani sul bordo", "Scivolata controllata in avanti", "Arrivo ammortizzato"],
        ageRange: "6 - 18 mesi",
        level: "decouverte",
        keyAdvice: "Sedete il bebè a bordo vasca di fronte a voi e accompagnatelo tenendolo sotto le ascelle.",
        relatedExerciseId: "exo_plongeon_assis"
      },
      {
        id: 'sk_ent_saut_accompagne',
        name: "Salto di slancio guidato",
        description: "Spinta volontaria con le gambe dal bordo verso le braccia aperte del genitore.",
        observationChecklist: ["Flessione attiva delle ginocchia", "Slancio in avanti", "Sorriso all'arrivo"],
        ageRange: "9 - 36 mesi",
        level: "confiance",
        keyAdvice: "Contate «1, 2, 3... salta!» e ammortizzate dolcemente l'ingresso in acqua.",
        relatedExerciseId: "exo_toboggan_tapis"
      },
      {
        id: 'sk_ent_sortie',
        name: "Arrampicata attiva & uscita autonoma",
        description: "Capacità di poggiare palmi, gomiti e ginocchia per issarsi sul tappeto o a bordo vasca.",
        observationChecklist: ["Presa solida con entrambe le mani", "Spinta delle gambe", "Sollevamento del busto"],
        ageRange: "12 - 36 mesi",
        level: "autonomie",
        keyAdvice: "Lasciate che il bambino sperimenti la forza necessaria per issarsi da solo.",
        relatedExerciseId: "exo_parcours_tapis"
      }
    ]
  },
  autonomie_securite: {
    title: "Autonomia & Auto-Salvataggio",
    description: "Aggrapparsi al bordo, ruotare in acqua, cercare appigli e spostamenti di sicurezza.",
    icon: "🛡️",
    badge: "Sicurezza & Auto-Salvataggio",
    ageRange: "6 a 36 mesi",
    keyPrinciple: "Imparare ad aggrapparsi subito al bordo o a supporti galleggianti.",
    skills: [
      {
        id: 'sk_sec_bord',
        name: "Riflesso di presa al bordo vasca",
        description: "Il bambino cerca e afferra spontaneamente con entrambe le mani il bordo piscina.",
        observationChecklist: ["Mani ben salde sul bordo", "Corpo sospeso in sicurezza", "Sguardo al bordo"],
        ageRange: "6 - 24 mesi",
        level: "confiance",
        keyAdvice: "Insegnategli a toccare il bordo dopo ogni esercizio per creare un riflesso automatico.",
        relatedArticleId: "securite-aquatique-surveillance-active-portee-bras"
      },
      {
        id: 'sk_sec_retournement',
        name: "Rotazione di sicurezza verso il genitore",
        description: "Capacità di ruotare il corpo in acqua per orientarsi verso il genitore o l'appiglio.",
        observationChecklist: ["Rotazione senza panico", "Movimento orientatore delle braccia", "Contatto visivo"],
        ageRange: "9 - 36 mesi",
        level: "autonomie",
        keyAdvice: "Esercitate rotazioni dolci verso le vostre braccia a meno di 1 metro di distanza.",
        relatedExerciseId: "exo_etoile_dorsale"
      }
    ]
  }
};

export const itSituations: Record<string, LocalizedSituation> = {
  sit_immersion_verticale_face_adulte: {
    title: "Immersione Verticale Faccia a Faccia",
    description: "Immersione di riferimento: discesa dolce e verticale faccia a faccia con abbraccio rassicurante.",
    observationCriteria: ["Contatto visivo continuo", "Allineamento verticale testa-tronco", "Abbraccio rassicurante immediato"],
    recommendedAgeRange: "4 a 18 mesi"
  },
  sit_immersion_preparee: {
    title: "Piccolo Tuffo con Schizzo di Avviso",
    description: "Rituale giocoso di anticipazione con gocce sulla fronte prima dell'immersione breve.",
    observationCriteria: ["Riconoscimento del segnale", "Blocco respiratorio preventivo", "Espressione rilassata"],
    recommendedAgeRange: "6 a 24 mesi"
  },
  sit_portage_ventral: {
    title: "Sostegno Ventrale & Scivolamento Rilassato",
    description: "Scivolamento orizzontale sulla pancia con supporto leggero sul torace.",
    observationCriteria: ["Corpo orizzontale sull'acqua", "Gambata rilassata", "Collo neutro"],
    recommendedAgeRange: "4 a 18 mesi"
  },
  sit_flottaison_dorsale: {
    title: "Galleggiamento Dorsale a Stella Marina",
    description: "Postura dorsale di rilassamento con orecchie nell'acqua e supporto leggero alla nuca.",
    observationCriteria: ["Orecchie immerse", "Sguardo sereno in alto", "Corpo rilassato"],
    recommendedAgeRange: "4 a 24 mesi"
  },
  sit_deplacement_propulsion: {
    title: "Spostamento & Propulsione Verso il Giocattolo",
    description: "Gambata attiva e avanzamento stimolato da un gioco galleggiante.",
    observationCriteria: ["Gambata coordinata", "Sguardo sul gioco", "Avanzamento visibile"],
    recommendedAgeRange: "6 a 36 mesi"
  },
  sit_entree_bord: {
    title: "Entrata da Seduti & Scivolata dal Bordo",
    description: "Scivolata dolce dal bordo vasca tra le braccia del genitore.",
    observationCriteria: ["Partenza tranquilla", "Ricezione ammortizzata in acqua", "Fiducia e sorriso"],
    recommendedAgeRange: "6 a 24 mesi"
  }
};

export const itExercises: Record<string, LocalizedExercise> = {
  exo_immersion_verticale_face_face: {
    title: "1ª Immersione in Sostegno Verticale Faccia a Faccia",
    objective: "Realizzare una prima immersione serena e breve (1-2s) preservando la sicurezza affettiva.",
    recommendedAge: "4 a 18 mesi",
    duration: "1 a 2 minuti (1 ripetizione)",
    repetition: "1 a 2 immersioni per sessione",
    tags: ["Immersione", "Sicurezza affettiva", "Faccia a faccia", "Apnea riflessa"],
    steps: [
      "Posizionatevi in piscina con l'acqua alle spalle e tenete il bebè in verticale stretto al petto.",
      "Guardate il bebè negli occhi, sorridete e contate con calma «1, 2, 3... splash!».",
      "Piegate dolcemente le ginocchia per immergervi insieme per 1 secondo mantenendo l'asse verticale.",
      "Riemergete subito, guancia contro guancia, abbracciatelo e lodatelo con calore."
    ],
    commonMistakes: [
      "Spingere il bebè in basso mentre il genitore resta su a guardare.",
      "Immersioni prolungate senza preavviso."
    ],
    corrections: [
      "Scendete sempre insieme al bebè allo stesso livello.",
      "Mantenete l'immersione a esattamente 1 secondo nei primi mesi."
    ],
    safetyTips: [
      "Non immergete mai un bambino che piange o mostra disagio.",
      "Verificate che l'acqua sia a 32°C per evitare brividi."
    ]
  },
  exo_petit_plongeon_rituel: {
    title: "Il Piccolo Tuffo con Schizzo di Avviso",
    objective: "Stabilire un segnale giocoso per consentire al bebè di preparare il respiro prima di immergersi.",
    recommendedAge: "6 a 24 mesi",
    duration: "2 minuti",
    tags: ["Rituale", "Anticipazione", "Gioco acquatico"],
    steps: [
      "Tenete il bebè di fronte a voi con le mani sotto il torace.",
      "Versate dolcemente alcune gocce sulla fronte pronunciando il rituale.",
      "Dondolatelo dolcemente e accompagnate una breve immersione di 1 secondo.",
      "Sollevatelo con un grande sorriso e parole di incoraggiamento."
    ],
    commonMistakes: [
      "Sorprendere il bebè senza preavviso."
    ],
    corrections: [
      "Utilizzate sempre lo stesso rituale cantato."
    ],
    safetyTips: [
      "Accertatevi che il bebè sia sereno e pronto prima dell'immersione."
    ]
  },
  exo_tapis_volant: {
    title: "Il Tappeto Volante: Scivolamento Ventrale",
    objective: "Sviluppare la naturale orizzontalità del corpo e il rilassamento muscolare.",
    recommendedAge: "4 a 18 mesi",
    duration: "3 a 5 minuti",
    tags: ["Orizzontalità", "Rilassamento", "Galleggiamento"],
    steps: [
      "Posizionate il bebè a pancia in giù sull'acqua con le mani leggere sotto il torace.",
      "Camminate all'indietro per creare un dolce flusso d'acqua sotto il corpo.",
      "Allentate il sostegno per fargli percepire la spinta galleggiante dell'acqua.",
      "Cantate una melodia dolce mantenendo un contatto visivo rassicurante."
    ],
    commonMistakes: [
      "Tenere il bebè in verticale invece di lasciarlo disteso in orizzontale."
    ],
    corrections: [
      "Abbassatevi in acqua in modo che le vostre braccia siano a pelo d'acqua."
    ],
    safetyTips: [
      "Tenete sempre le mani pronte a sostenere il capo se necessario."
    ]
  },
  exo_etoile_dorsale: {
    title: "La Stella Marina Dorsale & la Barchetta",
    objective: "Accettare la posizione a pancia in su con le orecchie nell'acqua in totale relax.",
    recommendedAge: "4 a 24 mesi",
    duration: "3 minuti",
    tags: ["Dorsale", "Orecchie nell'acqua", "Stella marina", "Rilassamento"],
    steps: [
      "Adagiate il bebè sulla schiena con la nuca sulla vostra spalla o palmo della mano.",
      "Lasciate che l'acqua sfiori le orecchie mentre canticchiate una canzoncina.",
      "Aprite braccia e gambine a stella marina.",
      "Camminate dolcemente in avanti cullandolo come una barchetta sulle onde."
    ],
    commonMistakes: [
      "Tenere la testa fuori dall'acqua forzando il collo.",
      "Temere l'acqua nelle orecchie (è del tutto sicura e innocua)."
    ],
    corrections: [
      "Lasciate le orecchie nell'acqua per un galleggiamento facile e naturale."
    ],
    safetyTips: [
      "Sostenete sempre la base della testa per mantenere naso e bocca all'asciutto."
    ]
  },
  exo_chasse_aux_canards: {
    title: "Caccia alle Paperelle: Gambata & Propulsione",
    objective: "Stimolare la gambata alternata e la propulsione verso un oggetto galleggiante.",
    recommendedAge: "6 a 36 mesi",
    duration: "4 minuti",
    tags: ["Gambata", "Propulsione", "Giocattoli", "Coordinazione"],
    steps: [
      "Posizionate un gioco galleggiante a 40-50 cm davanti al bebè.",
      "Sostenetelo sotto il petto in orizzontale e incoraggiatelo a raggiungere il gioco.",
      "Sentite le gambette muoversi e lasciate che la sua spinta lo faccia avanzare.",
      "Festeggiate con calore quando afferra il gioco."
    ],
    commonMistakes: [
      "Tirare velocemente il bambino invece di lasciarlo avanzare con le proprie gambe."
    ],
    corrections: [
      "Riducete la trazione e fermatevi 2 secondi per fargli capire che avanza grazie alle gambe."
    ],
    safetyTips: [
      "Sostenete adeguatamente per evitare che il viso cada in acqua per stanchezza."
    ]
  },
  exo_entree_bord_toboggan: {
    title: "Lo Scivolo da Seduti dal Bordo",
    objective: "Imparare un'entrata in acqua dolce, sicura e divertente dal bordo vasca.",
    recommendedAge: "6 a 24 mesi",
    duration: "2 a 3 minuti",
    tags: ["Entrata", "Bordo", "Scivolo", "Autonomia"],
    steps: [
      "Sedete il bebè sul bordo vasca con i piedini a penzoloni nell'acqua.",
      "State in acqua di fronte a lui con le mani aperte all'altezza dei suoi fianchi.",
      "Contate allegramente «1, 2, 3... scivola!» e invitatelo a inclinarsi verso di voi.",
      "Ammortizzate dolcemente il suo ingresso in acqua e accoglietelo con un abbraccio."
    ],
    commonMistakes: [
      "Tirare il bebè con forza sbilanciandolo."
    ],
    corrections: [
      "Lasciate che il bambino avvii il movimento inclinandosi in avanti."
    ],
    safetyTips: [
      "Controllate che il bordo non sia scivoloso e restate a distanza di un braccio."
    ]
  }
};
