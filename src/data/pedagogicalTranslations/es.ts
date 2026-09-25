import { LocalizedCategory, LocalizedSituation, LocalizedExercise, LocalizedDemoScenario } from '../pedagogicalDatabase';

export const esSkillCategories: Record<string, LocalizedCategory> = {
  decouverte_eau: {
    title: "Descubrimiento y Adaptación Sensorial",
    description: "Familiarizarse con el medio acuático, sensaciones en la piel, ruidos, agua a 32°C y rituales suaves.",
    icon: "🌊",
    badge: "Bases Sensoriales",
    ageRange: "0 a 6 meses+",
    keyPrinciple: "Agua tibia a 32°C, rituales suaves de salpicaduras y respeto del ritmo de adaptación individual.",
    skills: [
      {
        id: 'sk_eau_contact',
        name: "Tolerancia al contacto del agua en la cara",
        description: "El bebé acepta unas gotas o un chorro de agua en la frente sin tensión ni llanto reflejo.",
        observationChecklist: ["Rostro relajado y ojos abiertos", "Sin llanto reflejo", "Parpadeo natural"],
        ageRange: "0 - 6 meses",
        level: "decouverte",
        keyAdvice: "Comience en el baño de casa con suaves vertidos en la frente con la palma de la mano.",
        relatedArticleId: "preparation-bain-maison-eveil-aquatique"
      },
      {
        id: 'sk_eau_eclabousse',
        name: "Exploración táctil y juegos de salpicaduras",
        description: "Golpea el agua con las manos o los pies con entusiasmo y curiosidad para comprender el agua.",
        observationChecklist: ["Mirada concentrada o sonriente", "Movimientos rítmicos de manos y pies", "Creación intencional de ondas"],
        ageRange: "4 - 12 meses",
        level: "decouverte",
        keyAdvice: "Deje que el niño cree sus propias salpicaduras para percibir la flotabilidad y resistencia.",
        relatedExerciseId: "exo_tapis_volant"
      },
      {
        id: 'sk_eau_thermique',
        name: "Confort térmico y vigilancia sensorial",
        description: "Mantenimiento de tono activo y tez rosada en agua calentada a 32°C.",
        observationChecklist: ["Piel rosada y cálida", "Sin temblores ni labios azulados", "Sesión adaptada (20-30 min máx)"],
        ageRange: "0 - 12 meses",
        level: "decouverte",
        keyAdvice: "Salga de la piscina ante el primer escalofrío. Mantenga el agua a 32°C mínimo.",
        relatedArticleId: "bebe-nageur-guide-pratique-complet"
      }
    ]
  },
  equilibre: {
    title: "Equilibrio Postural y Principio de Arquímedes",
    description: "Estabilidad del tronco, horizontalidad ventral natural y alineación cabeza-columna sin arqueo.",
    icon: "⚖️",
    badge: "Motricidad y Biomecánica",
    ageRange: "4 a 18 meses",
    keyPrinciple: "Horizontalidad natural sin tensión cervical gracias al apoyo ligero y a la flotabilidad.",
    skills: [
      {
        id: 'sk_eq_horizontal_ventral',
        name: "Horizontalidad en posición ventral",
        description: "El bebé extiende su cuerpo sobre la superficie del agua en lugar de sentarse o verticalizarse.",
        observationChecklist: ["Caderas cerca de la superficie", "Piernas extendidas y flexibles", "Cabeza alineada con el tronco"],
        ageRange: "4 - 12 meses",
        level: "decouverte",
        keyAdvice: "Sostenga suavemente bajo la pelvis o el tórax para guiar la extensión sin frenar el pateo.",
        relatedExerciseId: "exo_portage_ventral"
      },
      {
        id: 'sk_eq_relachement',
        name: "Relajación muscular global y sustentación",
        description: "Ausencia de rigidez o arqueo dorsal: el niño deja que el agua sostenga su cuerpo.",
        observationChecklist: ["Extremidades suaves y sueltas", "Puños abiertos sin crispación", "Respiración fluida"],
        ageRange: "4 - 18 meses",
        level: "confiance",
        keyAdvice: "Prefiera el churro de espuma a los manguitos rígidos para favorecer la libertad postural.",
        relatedArticleId: "bouees-brassards-materiel-flottaison-securite"
      },
      {
        id: 'sk_eq_rotation',
        name: "Equilibrio y referencias espaciales",
        description: "Capacidad para orientar la mirada y estabilizar el tronco sin desorientación.",
        observationChecklist: ["Búsqueda de referencias visuales", "Ausencia de giros con pánico", "Alineación cabeza-cuello"],
        ageRange: "6 - 18 meses",
        level: "confiance",
        keyAdvice: "Si el niño gira sobre sí mismo, elévelo con calma para ayudarle a fijar referencias visuales.",
        relatedExerciseId: "exo_etoile_dorsale"
      }
    ]
  },
  flottaison_dorsale: {
    title: "Flotación Dorsal y Abandono Corporal",
    description: "Aceptación de las orejas en el agua, mirada al techo, postura de estrella de mar y apoyo occipital ligero.",
    icon: "⭐",
    badge: "Confianza y Flotación",
    ageRange: "4 a 24 meses",
    keyPrinciple: "Apoyo occipital seguro, orejas sumergidas y canción relajante del barquito.",
    skills: [
      {
        id: 'sk_flot_oreilles',
        name: "Aceptación de las orejas sumergidas",
        description: "El bebé deja que sus orejas se sumerjan en el agua sin levantar la cabeza con tensión.",
        observationChecklist: ["Canal auditivo en el agua sin sobresaltos", "Mirada tranquila hacia arriba", "Cuello relajado"],
        ageRange: "4 - 12 meses",
        level: "decouverte",
        keyAdvice: "Cante suavemente manteniendo su mano detrás de la nuca para que el agua llegue gradualmente a las orejas.",
        relatedArticleId: "flottaison-dorsale-bebe-nageur-jeu-bateau"
      },
      {
        id: 'sk_flot_etoile',
        name: "Postura de estrella de mar dorsal",
        description: "Apertura en cruz de brazos y piernas en posición dorsal.",
        observationChecklist: ["Brazos abiertos a los lados", "Vientre flotando en la superficie", "Cuerpo relajado"],
        ageRange: "6 - 18 meses",
        level: "confiance",
        keyAdvice: "Aligere gradualmente el apoyo bajo la espalda para que sienta la fuerza de empuje del agua.",
        relatedExerciseId: "exo_etoile_dorsale"
      }
    ]
  },
  immersion: {
    title: "Inmersión Acompañada y Apnea Refleja",
    description: "Descensos verticales continuos (1-2s), cara a cara con el padre, respeto de los signos y contacto visual.",
    icon: "🤿",
    badge: "Apnea y Seguridad",
    ageRange: "4 a 24 meses",
    keyPrinciple: "Inmersión suave y continua cara a cara con abrazo tranquilizador inmediato.",
    skills: [
      {
        id: 'sk_imm_rituel',
        name: "Comprensión del ritual preparatorio",
        description: "El bebé anticipa la inmersión al escuchar la señal habitual sin temor.",
        observationChecklist: ["Mirada atenta y concentrada", "Cierre voluntario o reflejo de la boca", "Cuerpo preparado"],
        ageRange: "4 - 12 meses",
        level: "decouverte",
        keyAdvice: "Use siempre las mismas palabras de anticipación («1, 2, 3... ¡al agua!») de forma alegre y tranquila.",
        relatedExerciseId: "exo_petit_plongeon_rituel"
      },
      {
        id: 'sk_imm_apnee',
        name: "Bloqueo laríngeo reflejo e inmersión",
        description: "Cierre hermético de las vías respiratorias durante la inmersión con mirada abierta bajo el agua.",
        observationChecklist: ["Sin tragar agua", "Ojos abiertos o cerrados con serenidad", "Emersión tranquila"],
        ageRange: "4 - 18 meses",
        level: "confiance",
        keyAdvice: "La inmersión debe ser breve (máximo 1 a 2 segundos) y continuada con un abrazo sonriente.",
        relatedExerciseId: "exo_immersion_verticale_face_face"
      }
    ]
  },
  deplacements: {
    title: "Desplazamientos y Propulsión",
    description: "Pateo espontáneo alterno, desplazamientos hacia un juguete, autonomía y nado instintivo del perrito.",
    icon: "🐬",
    badge: "Propulsión y Motricidad",
    ageRange: "6 a 36 meses",
    keyPrinciple: "Pateo activo motivado por juguetes flotantes y libertad de movimiento.",
    skills: [
      {
        id: 'sk_dep_battements',
        name: "Pateo propulsor alternado",
        description: "Movimientos alternados y dinámicos de las piernas que impulsan el cuerpo hacia adelante.",
        observationChecklist: ["Piernas extendidas y activas", "Impulso regular", "Fuerza propulsora visible"],
        ageRange: "6 - 18 meses",
        level: "confiance",
        keyAdvice: "Coloque un juguete flotante a 50 cm para que el bebé experimente la eficacia de su pateo.",
        relatedExerciseId: "exo_chasse_aux_canards"
      },
      {
        id: 'sk_dep_autonomie',
        name: "Desplazamiento autónomo hacia el borde",
        description: "Propulsión independiente para alcanzar el bordillo de la piscina o una colchoneta.",
        observationChecklist: ["Orientación directa hacia el objetivo", "Uso coordinado de brazos y piernas", "Agarre seguro"],
        ageRange: "12 - 36 meses",
        level: "autonomie",
        keyAdvice: "Anime al niño a nadar cortas distancias hasta sus brazos o hacia el bordillo.",
        relatedExerciseId: "exo_chasse_aux_canards"
      }
    ]
  },
  respiration: {
    title: "Respiración y Burbujas",
    description: "Control respiratorio, soplar burbujas en la superficie y calma emocional en brazos del adulto.",
    icon: "🌬️",
    badge: "Respiración y Calma",
    ageRange: "4 a 36 meses",
    keyPrinciple: "Espiración lúdica en la superficie y regulación de las emociones.",
    skills: [
      {
        id: 'sk_resp_bulles',
        name: "Soplado de burbujas en superficie",
        description: "Espiración voluntaria al ras del agua mediante imitación lúdica.",
        observationChecklist: ["Labios en la superficie", "Burbujas de aire visibles", "Juego repetido"],
        ageRange: "6 - 24 meses",
        level: "confiance",
        keyAdvice: "Haga burbujas usted mismo primero para que su bebé le imite de forma espontánea.",
        relatedExerciseId: "exo_bocal_poissons"
      },
      {
        id: 'sk_resp_calme',
        name: "Autorregulación y calma emocional",
        description: "Recuperación rápida de una respiración tranquila tras una emoción o salpicadura.",
        observationChecklist: ["Calma en menos de 10 segundos", "Respiración pausada", "Contacto visual recuperado"],
        ageRange: "0 - 36 meses",
        level: "decouverte",
        keyAdvice: "Abrace a su bebé contra su pecho: su voz tranquila y latidos le tranquilizan al instante.",
        relatedArticleId: "bebe-peur-eau-blocage-deculpabiliser"
      }
    ]
  },
  entree_eau: {
    title: "Entradas al Agua, Saltos y Salidas",
    description: "Deslizamientos sentados, saltos guiados desde el borde, toboganes y trepar a colchonetas.",
    icon: "🧗",
    badge: "Audacia y Destreza",
    ageRange: "6 a 36 meses",
    keyPrinciple: "Progresión gradual, amortiguación cariñosa y agarre sólido.",
    skills: [
      {
        id: 'sk_ent_assise',
        name: "Entrada suave sentado desde el bordillo",
        description: "Deslizamiento hacia los brazos del padre sin sobresaltos ni hiperextensión del cuello.",
        observationChecklist: ["Manos en el borde", "Deslizamiento controlado", "Llegada amortiguada"],
        ageRange: "6 - 18 meses",
        level: "decouverte",
        keyAdvice: "Siente al bebé en el borde frente a usted y acompáñelo sujetándolo bajo las axilas.",
        relatedExerciseId: "exo_plongeon_assis"
      },
      {
        id: 'sk_ent_saut_accompagne',
        name: "Salto de impulso guiado",
        description: "Impulso voluntario de piernas desde el borde hacia los brazos abiertos del padre.",
        observationChecklist: ["Flexión activa de rodillas", "Impulso hacia adelante", "Sonrisa al llegar"],
        ageRange: "9 - 36 meses",
        level: "confiance",
        keyAdvice: "Cuente «1, 2, 3... ¡salta!» y amortigüe ampliamente su entrada al agua.",
        relatedExerciseId: "exo_toboggan_tapis"
      },
      {
        id: 'sk_ent_sortie',
        name: "Subida activa y salida autónoma",
        description: "Capacidad para colocar palmas, codos y rodillas para salir a la colchoneta o al borde.",
        observationChecklist: ["Apoyo firme de manos", "Empuje de piernas", "Elevación del torso"],
        ageRange: "12 - 36 meses",
        level: "autonomie",
        keyAdvice: "Permita que experimente el esfuerzo de trepar por sí mismo sobre una colchoneta flotante.",
        relatedExerciseId: "exo_parcours_tapis"
      }
    ]
  },
  autonomie_securite: {
    title: "Autonomía y Auto-Salvamento",
    description: "Agarrarse al borde, cambiar de orientación, buscar apoyos y desplazamientos de seguridad.",
    icon: "🛡️",
    badge: "Seguridad y Supervivencia",
    ageRange: "6 a 36 meses",
    keyPrinciple: "Aprender a agarrarse inmediatamente al borde o a un punto de apoyo flotante.",
    skills: [
      {
        id: 'sk_sec_bord',
        name: "Reflejo de agarre al bordillo",
        description: "El niño busca y se aferra espontáneamente con las dos manos al borde de la piscina.",
        observationChecklist: ["Manos bien colocadas en el borde", "Cuerpo suspendido con seguridad", "Mirada orientada al soporte"],
        ageRange: "6 - 24 meses",
        level: "confiance",
        keyAdvice: "Enséñele a tocar el borde después de cada ejercicio para convertirlo en un reflejo de seguridad.",
        relatedArticleId: "securite-aquatique-surveillance-active-portee-bras"
      },
      {
        id: 'sk_sec_retournement',
        name: "Giro de seguridad hacia el adulto",
        description: "Capacidad para girar el cuerpo en el agua para orientarse hacia el padre o el apoyo.",
        observationChecklist: ["Giro sin pánico", "Movimiento de brazos orientador", "Reencuentro de la mirada"],
        ageRange: "9 - 36 meses",
        level: "autonomie",
        keyAdvice: "Practique suaves giros hacia sus brazos manteniendo una presencia atenta a menos de 1 metro.",
        relatedExerciseId: "exo_etoile_dorsale"
      }
    ]
  }
};

export const esSituations: Record<string, LocalizedSituation> = {
  sit_immersion_verticale_face_adulte: {
    title: "Inmersión Vertical Frente al Adulto",
    description: "Inmersión de referencia: descenso suave y vertical frente al padre con abrazo reconfortante.",
    observationCriteria: ["Contacto visual permanente", "Alineación vertical cabeza-tronco", "Abrazo reconfortante inmediato"],
    recommendedAgeRange: "4 a 18 meses"
  },
  sit_immersion_preparee: {
    title: "Pequeño Clavado con Salpicadura Previa",
    description: "Ritual lúdico de anticipación con salpicaduras en la frente antes de una inmersión breve.",
    observationCriteria: ["Reconocimiento de la señal", "Bloqueo respiratorio preventivo", "Expresión facial relajada"],
    recommendedAgeRange: "6 a 24 meses"
  },
  sit_portage_ventral: {
    title: "Sujeción Ventral y Deslizamiento Relajado",
    description: "Deslizamiento en horizontal sobre el vientre con soporte suave en el pecho.",
    observationCriteria: ["Cuerpo horizontal sobre el agua", "Pateo espontáneo relajado", "Alineación cervical neutra"],
    recommendedAgeRange: "4 a 18 meses"
  },
  sit_flottaison_dorsale: {
    title: "Flotación Dorsal en Estrella de Mar",
    description: "Postura dorsal de relajación con las orejas en el agua y apoyo occipital suave.",
    observationCriteria: ["Orejas sumergidas", "Mirada tranquila al techo", "Cuerpo suelto y relajado"],
    recommendedAgeRange: "4 a 24 meses"
  },
  sit_deplacement_propulsion: {
    title: "Desplazamiento y Propulsión Hacia un Juguete",
    description: "Pateo dinámico y avance activo motivado por un juguete flotante.",
    observationCriteria: ["Pateo coordinado", "Mirada fija en el juguete", "Avance propulsado visible"],
    recommendedAgeRange: "6 a 36 meses"
  },
  sit_entree_bord: {
    title: "Entrada Sentada y Deslizamiento Desde el Borde",
    description: "Deslizamiento suave desde el bordillo hacia los brazos del padre.",
    observationCriteria: ["Salida tranquila", "Recepción amortiguada en el agua", "Confianza y sonrisa"],
    recommendedAgeRange: "6 a 24 meses"
  }
};

export const esExercises: Record<string, LocalizedExercise> = {
  exo_immersion_verticale_face_face: {
    title: "1ª Inmersión en Sujeción Vertical Cara a Cara",
    objective: "Realizar una primera inmersión serena y breve (1-2s) preservando la seguridad afectiva.",
    recommendedAge: "4 a 18 meses",
    duration: "1 a 2 minutos (1 repetición)",
    repetition: "1 a 2 inmersiones espaciadas por sesión",
    tags: ["Inmersión", "Seguridad afectiva", "Cara a cara", "Apnea refleja"],
    steps: [
      "Colóquese en la piscina con el agua a la altura de sus hombros y sostenga a su bebé verticalmente pegado a su pecho.",
      "Mire a los ojos a su bebé, sonría y cuente con calma «1, 2, 3... ¡al agua!».",
      "Flexione suavemente las rodillas para sumergirse juntos 1 segundo manteniendo el eje vertical.",
      "Salga de inmediato a la superficie, pegue su mejilla a la suya con un abrazo y felicítelo calurosamente."
    ],
    commonMistakes: [
      "Empujar al bebé hacia abajo mientras el padre se queda arriba mirando.",
      "Hacer inmersiones demasiado largas o sin aviso previo.",
      "Arquear al bebé hacia atrás o inclinarlo bruscamente."
    ],
    corrections: [
      "Baje siempre con su bebé al mismo nivel para mantener el contacto piel con piel.",
      "Mantenga la inmersión en 1 segundo exacto en los primeros meses."
    ],
    safetyTips: [
      "No sumerja nunca a un bebé que esté llorando o mostrando signos de malestar.",
      "Compruebe que el agua esté a 32°C para evitar escalofríos."
    ]
  },
  exo_petit_plongeon_rituel: {
    title: "El Pequeño Clavado con Salpicadura Previa",
    objective: "Establecer una señal lúdica para que el bebé prepare su respiración antes de sumergirse.",
    recommendedAge: "6 a 24 meses",
    duration: "2 minutos",
    tags: ["Ritual", "Anticipación", "Juego acuático"],
    steps: [
      "Sostenga al bebé frente a usted con ambas manos bajo el pecho.",
      "Salpique suavemente unas gotas en su frente diciendo el ritual habitual.",
      "Realice un suave movimiento de balanceo y acompáñelo en una breve inmersión de 1 segundo.",
      "Elévelo hacia usted con una gran sonrisa y palabras de ánimo."
    ],
    commonMistakes: [
      "Sorprender al bebé sin previo aviso ni contacto visual.",
      "Sostenerlo con excesiva rigidez."
    ],
    corrections: [
      "Mantenga siempre el mismo ritual cantado para crear una rutina de confianza."
    ],
    safetyTips: [
      "Vigile que el bebé esté completamente receptivo y tranquilo antes de sumergirlo."
    ]
  },
  exo_tapis_volant: {
    title: "La Alfombra Voladora: Deslizamiento Ventral",
    objective: "Desarrollar la horizontalidad natural del cuerpo y la relajación muscular.",
    recommendedAge: "4 a 18 meses",
    duration: "3 a 5 minutos",
    tags: ["Horizontalidad", "Relajación", "Flotabilidad"],
    steps: [
      "Coloque a su bebé boca abajo sobre el agua, con sus manos apoyadas suavemente bajo su pecho.",
      "Camine despacio hacia atrás para crear un suave flujo de agua bajo su cuerpo.",
      "Aligere la presión de sus manos para que sienta el empuje del agua sosteniéndole.",
      "Cante una canción suave mientras observa su mirada tranquila."
    ],
    commonMistakes: [
      "Sostener al bebé verticalmente pensando que está en posición horizontal.",
      "Tirar de los brazos del bebé hacia adelante."
    ],
    corrections: [
      "Agáchese en el agua para que sus brazos queden al ras de la superficie."
    ],
    safetyTips: [
      "Mantenga siempre las manos preparadas para sostener la cabecita en caso de desequilibrio."
    ]
  },
  exo_etoile_dorsale: {
    title: "La Estrella de Mar Dorsal y el Barquito",
    objective: "Aceptar la posición boca arriba con las orejas sumergidas en total relajación.",
    recommendedAge: "4 a 24 meses",
    duration: "3 minutos",
    tags: ["Dorsal", "Orejas en el agua", "Estrella de mar", "Relajación"],
    steps: [
      "Recueste a su bebé boca arriba apoyando la nuca en su hombro o en la palma de su mano.",
      "Deje que el agua cubra suavemente sus orejas mientras le canta una nana.",
      "Abra sus bracitos y piernecitas en cruz en forma de estrella de mar.",
      "Camine despacio hacia adelante para mecerlo como un barquito sobre las olas."
    ],
    commonMistakes: [
      "Mantener la cabeza del bebé fuera del agua forzando el cuello.",
      "Preocuparse porque entre agua en las orejas (es completamente seguro e inofensivo)."
    ],
    corrections: [
      "Mantenga las orejas sumergidas para que el cuerpo flote de manera natural y sin tensión."
    ],
    safetyTips: [
      "Sostenga la base de la cabeza en todo momento para evitar que la nariz se sumerja."
    ]
  },
  exo_chasse_aux_canards: {
    title: "La Caza de Patitos: Pateo y Propulsión",
    objective: "Estimular el pateo alternado y la propulsión hacia un objetivo flotante.",
    recommendedAge: "6 a 36 meses",
    duration: "4 minutos",
    tags: ["Pateo", "Propulsión", "Juguetes", "Coordinación"],
    steps: [
      "Coloque un juguete flotante a unos 40-50 cm por delante de su bebé.",
      "Sosténgalo bajo el pecho en posición horizontal y anímelo a alcanzar el juguete.",
      "Sienta cómo mueve sus piernecitas y deje que su propio pateo le haga avanzar.",
      "Felicítelo con entusiasmo cuando atrape el juguete con sus manitas."
    ],
    commonMistakes: [
      "Tirar rápidamente del bebé en lugar de dejarle propulsarse.",
      "Poner el juguete demasiado lejos provocando frustración."
    ],
    corrections: [
      "Reduzca la tracción y pause 2 segundos para que sienta que su avance proviene de sus piernas."
    ],
    safetyTips: [
      "Mantenga siempre el soporte necesario para que la cara no caiga en el agua por cansancio."
    ]
  },
  exo_entree_bord_toboggan: {
    title: "El Tobogán Sentado Desde el Borde",
    objective: "Aprender una entrada al agua suave, segura y divertida desde el bordillo.",
    recommendedAge: "6 a 24 meses",
    duration: "2 a 3 minutos",
    tags: ["Entrada", "Borde", "Tobogán", "Autonomía"],
    steps: [
      "Siente a su bebé en el bordillo de la piscina con los pies colgando en el agua.",
      "Póngase en el agua frente a él con las manos abiertas a la altura de sus caderas.",
      "Cuente alegremente «1, 2, 3... ¡al agua!» e invítele a deslizarse hacia usted.",
      "Amortigüe suavemente su entrada al agua y abrácelo con una sonrisa."
    ],
    commonMistakes: [
      "Tirar del bebé con fuerza desestabilizándole.",
      "No amortiguar su llegada al agua provocando un sobresalto."
    ],
    corrections: [
      "Deje que el bebé inicie el movimiento inclinando su cuerpecito hacia adelante."
    ],
    safetyTips: [
      "Verifique que el bordillo no resbale y mantenga una distancia cercana de seguridad."
    ]
  }
};
