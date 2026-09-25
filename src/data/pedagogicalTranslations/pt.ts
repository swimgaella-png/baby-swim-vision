import { LocalizedCategory, LocalizedSituation, LocalizedExercise } from '../pedagogicalDatabase';

export const ptSkillCategories: Record<string, LocalizedCategory> = {
  decouverte_eau: {
    title: "Descoberta & Adaptação Sensorial",
    description: "Familiarização com o meio aquático, sensações na pele, acústica da piscina, água a 32°C e rituais suaves.",
    icon: "🌊",
    badge: "Fundamentos Sensoriais",
    ageRange: "0 a 6 meses+",
    keyPrinciple: "Água morna a 32°C, rituais suaves de rega e respeito pelo ritmo de adaptação individual.",
    skills: [
      {
        id: 'sk_eau_contact',
        name: "Tolerância ao contacto da água no rosto",
        description: "O bebé aceita gotas ou um fio de água na testa sem tensão ou choro reflexo.",
        observationChecklist: ["Rosto relaxado e olhos abertos", "Sem choro reflexo", "Piscadelas naturais"],
        ageRange: "0 - 6 meses",
        level: "decouverte",
        keyAdvice: "Comece no banho de casa com regas suaves na testa com a concha da mão.",
        relatedArticleId: "preparation-bain-maison-eveil-aquatique"
      },
      {
        id: 'sk_eau_eclabousse',
        name: "Exploração táctil & jogos de salpicos",
        description: "Bate na água com as mãos ou pés com entusiasmo e curiosidade para sentir a água.",
        observationChecklist: ["Olhar concentrado ou sorridente", "Movimentos ritmados de mãos e pés", "Produção intencional de ondas"],
        ageRange: "4 - 12 meses",
        level: "decouverte",
        keyAdvice: "Deixe o bebé salpicar livremente para sentir a flutuação e resistência da água.",
        relatedExerciseId: "exo_tapis_volant"
      },
      {
        id: 'sk_eau_thermique',
        name: "Conforto térmico & vigilância sensorial",
        description: "Manutenção do tónus ativo e pele rosada em água aquecida a 32°C.",
        observationChecklist: ["Pele rosada e quente ao toque", "Sem tremores ou lábios azulados", "Sessão adaptada (20-30 min máx)"],
        ageRange: "0 - 12 meses",
        level: "decouverte",
        keyAdvice: "Saia da piscina aos primeiros sinais de frio. Mantenha a água a 32°C no mínimo.",
        relatedArticleId: "bebe-nageur-guide-pratique-complet"
      }
    ]
  },
  equilibre: {
    title: "Equilíbrio Postural & Princípio de Arquimedes",
    description: "Estabilidade do tronco, horizontalidade ventral natural e alinhamento cabeça-coluna sem tensão.",
    icon: "⚖️",
    badge: "Motricidade & Biomecânica",
    ageRange: "4 a 18 meses",
    keyPrinciple: "Horizontalidade natural sem tensão cervical graças ao apoio suave e à flutuabilidade.",
    skills: [
      {
        id: 'sk_eq_horizontal_ventral',
        name: "Horizontalidade em posição ventral",
        description: "O bebé estica o corpo à superfície da água em vez de se sentar ou ficar vertical.",
        observationChecklist: ["Ancas perto da superfície", "Pernas esticadas e soltas", "Cabeça alinhada com o tronco"],
        ageRange: "4 - 12 meses",
        level: "decouverte",
        keyAdvice: "Apoie suavemente sob a bacia ou tórax para guiar o alongamento sem travar o bater de pernas.",
        relatedExerciseId: "exo_portage_ventral"
      },
      {
        id: 'sk_eq_relachement',
        name: "Relaxamento muscular global & sustentação",
        description: "Sem rigidez ou arqueamento dorsal: o bebé deixa a água sustentar o seu corpo.",
        observationChecklist: ["Membros suaves e soltos", "Mãos abertas sem aperto", "Respiração fluida"],
        ageRange: "4 - 18 meses",
        level: "confiance",
        keyAdvice: "Prefira rolos de espuma a braçadeiras rígidas para permitir total liberdade postural.",
        relatedArticleId: "bouees-brassards-materiel-flottaison-securite"
      },
      {
        id: 'sk_eq_rotation',
        name: "Equilíbrio & referências espaciais",
        description: "Capacidade de orientar o olhar e estabilizar o tronco sem desorientação.",
        observationChecklist: ["Procura de pontos visuais fixos", "Sem rotações em pânico", "Alinhamento cabeça-pescoço preservado"],
        ageRange: "6 - 18 meses",
        level: "confiance",
        keyAdvice: "Se o bebé começar a rodar, levante-o calmamente para ajudar a focar o olhar.",
        relatedExerciseId: "exo_etoile_dorsale"
      }
    ]
  },
  flottaison_dorsale: {
    title: "Flutuação Dorsal & Relaxamento Profundo",
    description: "Aceitação das orelhas na água, olhar para o teto, postura de estrela-do-mar e apoio occipital leve.",
    icon: "⭐",
    badge: "Confiança & Flutuação",
    ageRange: "4 a 24 meses",
    keyPrinciple: "Apoio occipital seguro, orelhas na água e a canção suave do barquinho.",
    skills: [
      {
        id: 'sk_flot_oreilles',
        name: "Aceitação das orelhas submersas",
        description: "O bebé deixa as orelhas submergirem na água sem erguer a cabeça com tensão.",
        observationChecklist: ["Orelhas na água sem sobressaltos", "Olhar sereno para cima", "Pescoço relaxado"],
        ageRange: "4 - 12 meses",
        level: "decouverte",
        keyAdvice: "Cante baixinho com a sua mão atrás da nuca, permitindo que a água cubra as orelhas.",
        relatedArticleId: "flottaison-dorsale-bebe-nageur-jeu-bateau"
      },
      {
        id: 'sk_flot_etoile',
        name: "Postura de estrela-do-mar dorsal",
        description: "Abertura em cruz de braços e pernas em decúbito dorsal.",
        observationChecklist: ["Braços abertos de lado", "Barriga a flutuar na superfície", "Corpo totalmente descontraído"],
        ageRange: "6 - 18 meses",
        level: "confiance",
        keyAdvice: "Alivie suavemente o apoio nas costas para que o bebé sinta a força da água.",
        relatedExerciseId: "exo_etoile_dorsale"
      }
    ]
  },
  immersion: {
    title: "Imersão Acompanhada & Apneia Reflexa",
    description: "Descidas verticais suaves e contínuas (1-2s), frente a frente com o progenitor, contacto visual e carinho.",
    icon: "🤿",
    badge: "Apneia & Segurança",
    ageRange: "4 a 24 meses",
    keyPrinciple: "Imersão suave e contínua cara a cara com abraço reconfortante imediato.",
    skills: [
      {
        id: 'sk_imm_rituel',
        name: "Compreensão do ritual preparatório",
        description: "O bebé antecipa a imersão ao ouvir o sinal habitual com tranquilidade.",
        observationChecklist: ["Olhar atento e concentrado", "Fecho de boca preventivo", "Corpo relaxado e pronto"],
        ageRange: "4 - 12 meses",
        level: "decouverte",
        keyAdvice: "Use sempre as mesmas palavras de aviso («1, 2, 3... mergulho!») com voz calma.",
        relatedExerciseId: "exo_petit_plongeon_rituel"
      },
      {
        id: 'sk_imm_apnee',
        name: "Fecho laríngeo reflexo & imersão",
        description: "Bloqueio reflexo e estanque das vias respiratórias durante a imersão com olhos abertos.",
        observationChecklist: ["Sem engolir água", "Olhos abertos ou serenos", "Emersão tranquila"],
        ageRange: "4 - 18 meses",
        level: "confiance",
        keyAdvice: "A imersão deve durar apenas 1 a 2 segundos e terminar num abraço alegre.",
        relatedExerciseId: "exo_immersion_verticale_face_face"
      }
    ]
  },
  deplacements: {
    title: "Deslocamentos & Propulsão",
    description: "Batimentos de pernas alternados, deslocamentos até ao brinquedo, autonomia e nado instintivo de cãozinho.",
    icon: "🐬",
    badge: "Propulsão & Motricidade",
    ageRange: "6 a 36 meses",
    keyPrinciple: "Batimentos ativos motivados por brinquedos flutuantes e liberdade de movimento.",
    skills: [
      {
        id: 'sk_dep_battements',
        name: "Bater de pernas propulsor",
        description: "Movimentos alternados e vigorosos das pernas que impulsionam o corpo para a frente.",
        observationChecklist: ["Pernas esticadas e ativas", "Impulso ritmado", "Força propulsora visível"],
        ageRange: "6 - 18 meses",
        level: "confiance",
        keyAdvice: "Coloque um brinquedo a 50 cm para que o bebé sinta o efeito propulsor das suas pernas.",
        relatedExerciseId: "exo_chasse_aux_canards"
      },
      {
        id: 'sk_dep_autonomie',
        name: "Deslocamento autónomo até à borda",
        description: "Propulsão independente para alcançar a borda da piscina ou um tapete flutuante.",
        observationChecklist: ["Orientação em direção ao objetivo", "Coordenação braços-pernas", "Segurança ao agarrar"],
        ageRange: "12 - 36 meses",
        level: "autonomie",
        keyAdvice: "Encoraje pequenas distâncias autónomas em direção aos seus braços ou à borda.",
        relatedExerciseId: "exo_chasse_aux_canards"
      }
    ]
  },
  respiration: {
    title: "Respiração & Bolhas de Água",
    description: "Controlo respiratório, sopro de bolhas à superfície e calma emocional nos braços do adulto.",
    icon: "🌬️",
    badge: "Respiração & Serenidade",
    ageRange: "4 a 36 meses",
    keyPrinciple: "Expiração lúdica à superfície e regulação emocional serena.",
    skills: [
      {
        id: 'sk_resp_bulles',
        name: "Soprar bolhas à superfície",
        description: "Expiração voluntária à superfície da água através de imitação lúdica.",
        observationChecklist: ["Lábios ao nível da água", "Bolhas de ar visíveis", "Brincadeira repetida"],
        ageRange: "6 - 24 meses",
        level: "confiance",
        keyAdvice: "Faça bolhas primeiro com a sua boca para encorajar a imitação natural do bebé.",
        relatedExerciseId: "exo_bocal_poissons"
      },
      {
        id: 'sk_resp_calme',
        name: "Autorregulação & acalmia emocional",
        description: "Recuperação rápida de respiração calma após surpresa ou agitação na piscina.",
        observationChecklist: ["Acalmia em menos de 10 segundos", "Respiração fluida", "Contacto visual restaurado"],
        ageRange: "0 - 36 meses",
        level: "decouverte",
        keyAdvice: "Abrace o bebé contra o seu peito: o seu ritmo cardíaco e voz calma acalmam-no de imediato.",
        relatedArticleId: "bebe-peur-eau-blocage-deculpabiliser"
      }
    ]
  },
  entree_eau: {
    title: "Entradas na Água, Saltos & Saídas",
    description: "Deslizes sentado, saltos guiados da borda, escorregas de espuma e subida autónoma.",
    icon: "🧗",
    badge: "Audácia & Motricidade Global",
    ageRange: "6 a 36 meses",
    keyPrinciple: "Progressão gradual, amortecimento afetuoso e apoio seguro.",
    skills: [
      {
        id: 'sk_ent_assise',
        name: "Entrada suave sentado a partir da borda",
        description: "Deslize para os braços do progenitor sem sobressaltos nem hiperextensão da cabeça.",
        observationChecklist: ["Mãos na borda", "Deslize controlado para a frente", "Entrada amortecida"],
        ageRange: "6 - 18 meses",
        level: "decouverte",
        keyAdvice: "Sente o bebé na borda à sua frente e acompanhe o deslize segurando-o pelas axilas.",
        relatedExerciseId: "exo_plongeon_assis"
      },
      {
        id: 'sk_ent_saut_accompagne',
        name: "Salto de impulso guiado",
        description: "Impulso voluntário das pernas a partir da borda em direção aos braços abertos do pai.",
        observationChecklist: ["Flexão ativa dos joelhos", "Impulso franco para a frente", "Alegria na chegada"],
        ageRange: "9 - 36 meses",
        level: "confiance",
        keyAdvice: "Conte «1, 2, 3... salta!» e amorteça generosamente a chegada à água.",
        relatedExerciseId: "exo_toboggan_tapis"
      },
      {
        id: 'sk_ent_sortie',
        name: "Subida ativa & saída autónoma",
        description: "Capacidade de apoiar palmas, cotovelos e joelhos para subir para o tapete ou borda.",
        observationChecklist: ["Apoio firme das duas mãos", "Impulso de pernas", "Elevação do tronco"],
        ageRange: "12 - 36 meses",
        level: "autonomie",
        keyAdvice: "Deixe o bebé experimentar a força necessária para subir sozinho para um tapete flutuante.",
        relatedExerciseId: "exo_parcours_tapis"
      }
    ]
  },
  autonomie_securite: {
    title: "Autonomia & Auto-Salvamento",
    description: "Agarrar à borda, rotação na água, procura de apoios e deslocamentos de segurança.",
    icon: "🛡️",
    badge: "Segurança & Auto-Salvamento",
    ageRange: "6 a 36 meses",
    keyPrinciple: "Aprender a agarrar imediatamente à borda ou apoios flutuantes.",
    skills: [
      {
        id: 'sk_sec_bord',
        name: "Reflexo de agarrar à borda",
        description: "O bebé agarra-se espontaneamente com as duas mãos à borda da piscina.",
        observationChecklist: ["Mãos firmes na borda", "Corpo suspenso com segurança", "Olhar orientado para o suporte"],
        ageRange: "6 - 24 meses",
        level: "confiance",
        keyAdvice: "Ensine a tocar e segurar a borda após cada exercício para criar um reflexo de segurança.",
        relatedArticleId: "securite-aquatique-surveillance-active-portee-bras"
      },
      {
        id: 'sk_sec_retournement',
        name: "Rotação de segurança para o adulto",
        description: "Capacidade de rodar o corpo na água para se orientar para o progenitor ou apoio.",
        observationChecklist: ["Rotação sem pânico", "Movimento de braços orientador", "Contacto visual recuperado"],
        ageRange: "9 - 36 meses",
        level: "autonomie",
        keyAdvice: "Pratique voltas suaves em direção aos seus braços com vigilância a menos de 1 metro.",
        relatedExerciseId: "exo_etoile_dorsale"
      }
    ]
  }
};

export const ptSituations: Record<string, LocalizedSituation> = {
  sit_immersion_verticale_face_adulte: {
    title: "Imersão Vertical Cara a Cara",
    description: "Imersão de referência: descida suave e vertical frente a frente com abraço tranquilizador.",
    observationCriteria: ["Contacto visual permanente", "Alinhamento vertical cabeça-tronco", "Abraço reconfortante imediato"],
    recommendedAgeRange: "4 a 18 meses"
  },
  sit_immersion_preparee: {
    title: "Pequeno Mergulho com Salpico de Aviso",
    description: "Ritual lúdico de antecipação com salpicos na testa antes de uma imersão breve.",
    observationCriteria: ["Reconhecimento do sinal", "Bloqueio respiratório prévio", "Expressão facial relaxada"],
    recommendedAgeRange: "6 a 24 meses"
  },
  sit_portage_ventral: {
    title: "Apoio Ventral & Deslize Relaxado",
    description: "Deslize horizontal sobre o ventre com suporte suave no peito.",
    observationCriteria: ["Corpo horizontal na água", "Bater de pernas espontâneo", "Pescoço relaxado"],
    recommendedAgeRange: "4 a 18 meses"
  },
  sit_flottaison_dorsale: {
    title: "Flutuação Dorsal em Estrela-do-Mar",
    description: "Postura dorsal de relaxamento com orelhas na água e apoio suave na nuca.",
    observationCriteria: ["Orelhas na água", "Olhar sereno para cima", "Corpo solto e relaxado"],
    recommendedAgeRange: "4 a 24 meses"
  },
  sit_deplacement_propulsion: {
    title: "Deslocamento & Propulsão Rumo a um Brinquedo",
    description: "Bater de pernas ativo e avanço motivado por um brinquedo flutuante.",
    observationCriteria: ["Bater de pernas coordenado", "Olhar no brinquedo", "Avanço visível"],
    recommendedAgeRange: "6 a 36 meses"
  },
  sit_entree_bord: {
    title: "Entrada Sentado & Deslize da Borda",
    description: "Deslize suave a partir da borda da piscina para os braços do pai.",
    observationCriteria: ["Partida tranquila", "Recepção amortecida na água", "Confiança e sorriso"],
    recommendedAgeRange: "6 a 24 meses"
  }
};

export const ptExercises: Record<string, LocalizedExercise> = {
  exo_immersion_verticale_face_face: {
    title: "1ª Imersão em Suporte Vertical Cara a Cara",
    objective: "Realizar uma primeira imersão serena e curta (1-2s) preservando a segurança afetiva.",
    recommendedAge: "4 a 18 meses",
    duration: "1 a 2 minutos (1 repetição)",
    repetition: "1 a 2 imersões por sessão",
    tags: ["Imersão", "Segurança afetiva", "Cara a cara", "Apneia reflexa"],
    steps: [
      "Fique de pé na piscina com a água pelos ombros e segure o bebé verticalmente colado ao seu peito.",
      "Olhe nos olhos do bebé, sorria e conte calmamente «1, 2, 3... mergulho!».",
      "Flexione suavemente os joelhos para submergirem juntos 1 segundo mantendo a verticalidade.",
      "Suba imediatamente à superfície, encoste a sua bochecha na dele com um abraço e felicite-o calorosamente."
    ],
    commonMistakes: [
      "Empurrar o bebé para baixo enquanto o adulto fica em cima a olhar.",
      "Fazer imersões demasiado longas ou sem aviso prévio."
    ],
    corrections: [
      "Desça sempre ao mesmo nível que o bebé para manter o contacto corpo a corpo.",
      "Mantenha a imersão em 1 segundo exato nos primeiros meses."
    ],
    safetyTips: [
      "Nunca submerja um bebé que esteja a chorar ou com sinais de desconforto.",
      "Certifique-se de que a água está a 32°C para evitar arrepios."
    ]
  },
  exo_petit_plongeon_rituel: {
    title: "O Pequeno Mergulho com Salpico de Aviso",
    objective: "Estabelecer um sinal lúdico para que o bebé prepare a respiração antes de submergir.",
    recommendedAge: "6 a 24 meses",
    duration: "2 minutos",
    tags: ["Ritual", "Antecipação", "Jogo aquático"],
    steps: [
      "Segure o bebé à sua frente com as duas mãos sob o peito.",
      "Salpique suavemente algumas gotas na sua testa recitando o ritual habitual.",
      "Balance-o suavemente e acompanhe uma breve imersão de 1 segundo.",
      "Eleve-o até si com um grande sorriso e palavras de encorajamento."
    ],
    commonMistakes: [
      "Surpreender o bebé sem aviso ou sem contacto visual."
    ],
    corrections: [
      "Mantenha sempre o mesmo ritual cantado para criar uma rotina de confiança."
    ],
    safetyTips: [
      "Verifique que o bebé está atento e relaxado antes da imersão."
    ]
  },
  exo_tapis_volant: {
    title: "O Tapete Voador: Deslize Ventral",
    objective: "Desenvolver a horizontalidade natural do corpo e o relaxamento muscular.",
    recommendedAge: "4 a 18 meses",
    duration: "3 a 5 minutos",
    tags: ["Horizontalidade", "Relaxamento", "Flutuabilidade"],
    steps: [
      "Coloque o bebé de barriga para baixo na água, com as mãos sob o seu peito.",
      "Caminhe devagar para trás para criar um suave fluxo de água sob o corpo.",
      "Alivie a pressão das mãos para que sinta a sustentação da água.",
      "Cante uma canção suave enquanto mantém um contacto visual sereno."
    ],
    commonMistakes: [
      "Segurar o bebé na vertical em vez de o deixar na horizontal."
    ],
    corrections: [
      "Agache-se na água para que os seus braços fiquem ao nível da superfície."
    ],
    safetyTips: [
      "Mantenha sempre as mãos prontas para apoiar a cabeça se necessário."
    ]
  },
  exo_etoile_dorsale: {
    title: "A Estrela-do-Mar Dorsal & o Barquinho",
    objective: "Aceitar a posição de barriga para cima com as orelhas na água em total relaxamento.",
    recommendedAge: "4 a 24 meses",
    duration: "3 minutos",
    tags: ["Dorsal", "Orelhas na água", "Estrela-do-mar", "Relaxamento"],
    steps: [
      "Deite o bebé de costas apoiando a nuca no seu ombro ou na palma da mão.",
      "Deixe a água cobrir suavemente as orelhas enquanto lhe canta uma cantiga.",
      "Abra os bracinhos e perninhas em cruz como uma estrela-do-mar.",
      "Caminhe devagar para a frente para o embalar como um barquinho nas ondas."
    ],
    commonMistakes: [
      "Manter a cabeça do bebé fora de água forçando o pescoço.",
      "Ter receio de água nas orelhas (é perfeitamente seguro e inofensivo)."
    ],
    corrections: [
      "Mantenha as orelhas na água para que o corpo flutue com facilidade e sem esforço."
    ],
    safetyTips: [
      "Apoie sempre a base da cabeça para manter a boca e nariz fora de água."
    ]
  },
  exo_chasse_aux_canards: {
    title: "Caça aos Patinhos: Bater de Pernas & Propulsão",
    objective: "Estimular o bater de pernas alternado e a propulsão rumo a um objeto flutuante.",
    recommendedAge: "6 a 36 meses",
    duration: "4 minutos",
    tags: ["Pernas", "Propulsão", "Brinquedos", "Coordenação"],
    steps: [
      "Coloque um brinquedo flutuante a cerca de 40-50 cm à frente do bebé.",
      "Segure-o sob o peito na horizontal e encoraje-o a alcançar o brinquedo.",
      "Sinta as perninhas a bater e deixe que o seu próprio impulso o faça avançar.",
      "Celebre e elogie com entusiasmo quando ele agarrar o brinquedo."
    ],
    commonMistakes: [
      "Puxar rapidamente o bebé em vez de o deixar propulsionar-se."
    ],
    corrections: [
      "Reduza a tração e pause 2 segundos para que perceba que o avanço vem das pernas."
    ],
    safetyTips: [
      "Mantenha o suporte necessário para que a cara não caia na água por cansaço."
    ]
  },
  exo_entree_bord_toboggan: {
    title: "O Escorrega Sentado a Partir da Borda",
    objective: "Aprender uma entrada na água suave, segura e divertida a partir da borda.",
    recommendedAge: "6 a 24 meses",
    duration: "2 a 3 minutos",
    tags: ["Entrada", "Borda", "Escorrega", "Autonomia"],
    steps: [
      "Sente o bebé na borda da piscina com os pés a balouçar na água.",
      "Fique na água à frente dele com as mãos abertas junto às suas ancas.",
      "Conte alegremente «1, 2, 3... escorrega!» e convide-o a deslizar para si.",
      "Amorteça suavemente a sua entrada na água e acolha-o num abraço caloroso."
    ],
    commonMistakes: [
      "Puxar o bebé com força desestabilizando o seu equilíbrio."
    ],
    corrections: [
      "Deixe o bebé iniciar o movimento inclinando o corpinho para a frente."
    ],
    safetyTips: [
      "Verifique que a borda não escorrega e permaneça à distância de um braço."
    ]
  }
};
