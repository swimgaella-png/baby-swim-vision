import { LocalizedCategory, LocalizedSituation, LocalizedExercise } from '../pedagogicalDatabase';

// Multilingual catalog for NL, RU, TR, AR, ZH, JA, KO, HI, EL, UK, SV, DA, NO, FI, PL, CS, SK, HU, RO, HE
export const multiSkillCategories: Record<string, Record<string, LocalizedCategory>> = {
  nl: {
    decouverte_eau: {
      title: "Ontdekking & Sensorische Gewenning",
      description: "Zachte gewenning aan het water, gevoel op de huid, geluiden, water van 32°C en rustige rituelen.",
      icon: "🌊",
      badge: "Sensorische Basis",
      ageRange: "0 tot 6 maanden+",
      keyPrinciple: "Warm water van 32°C, zachte rituelen en respect voor het eigen tempo.",
      skills: []
    },
    equilibre: {
      title: "Houdingsevenwicht & Drijfvermogen",
      description: "Rompstabiliteit, natuurlijke buikligging en uitlijning van hoofd en ruggengraat.",
      icon: "⚖️",
      badge: "Motoriek & Balans",
      ageRange: "4 tot 18 maanden",
      keyPrinciple: "Natuurlijke buikligging zonder nekspanning dankzij lichte ondersteuning.",
      skills: []
    },
    flottaison_dorsale: {
      title: "Rugligging & Totale Ontspanning",
      description: "Oortjes in het water, blik naar het plafond, zeesterhouding en zachte neksteun.",
      icon: "⭐",
      badge: "Vertrouwen & Drijven",
      ageRange: "4 tot 24 maanden",
      keyPrinciple: "Veilige ondersteuning van de nek en het rustgevende bootjesliedje.",
      skills: []
    },
    immersion: {
      title: "Begeleid Duiken & Ademreflex",
      description: "Zacht en verticaal onder water gaan (1-2s), oogcontact met de ouder en direct knuffelen.",
      icon: "🤿",
      badge: "Duiken & Veiligheid",
      ageRange: "4 tot 24 maanden",
      keyPrinciple: "Kort en kalm onder water gaan op gelijke ooghoogte met een warme omhelzing.",
      skills: []
    },
    deplacements: {
      title: "Verplaatsing & Beenslag",
      description: "Actieve beenslag, zwemmen naar een speeltje en natuurlijk peddelen.",
      icon: "🐬",
      badge: "Voortstuwing",
      ageRange: "6 tot 36 maanden",
      keyPrinciple: "Actieve beenslag gestimuleerd door drijvend speelgoed.",
      skills: []
    },
    respiration: {
      title: "Ademhaling & Bubbels Blazen",
      description: "Adembeheersing, bellen blazen aan het oppervlak en emotionele rust.",
      icon: "🌬️",
      badge: "Adem & Rust",
      ageRange: "4 tot 36 maanden",
      keyPrinciple: "Speels uitblazen aan het wateroppervlak.",
      skills: []
    },
    entree_eau: {
      title: "Te Water Gaan, Sprongen & Uitstappen",
      description: "Zittend het water in glijden, begeleide sprongetjes vanaf de rand en zelfstandig opklimmen.",
      icon: "🧗",
      badge: "Zelfvertrouwen & Durf",
      ageRange: "6 tot 36 maanden",
      keyPrinciple: "Geleidelijke opbouw en zachte opvang in het water.",
      skills: []
    },
    autonomie_securite: {
      title: "Zelfredzaamheid & Veiligheid",
      description: "Vastpakken van de rand, omdraaien in het water en steunpunten zoeken.",
      icon: "🛡️",
      badge: "Zelfredzaamheid",
      ageRange: "6 tot 36 maanden",
      keyPrinciple: "Direct de rand of een drijvend voorwerp leren vastgrijpen.",
      skills: []
    }
  },
  ru: {
    decouverte_eau: {
      title: "Сенсорная адаптация и первое знакомство",
      description: "Мягкое привыкание к воде 32°C, тактильные ощущения, акустика и нежные ритуалы.",
      icon: "🌊",
      badge: "Сенсорная основа",
      ageRange: "0 - 6+ месяцев",
      keyPrinciple: "Теплая вода 32°C, мягкие ритуалы поливания и уважение к темпу ребенка.",
      skills: []
    },
    equilibre: {
      title: "Постуральный баланс и плавучесть",
      description: "Стабильность корпуса, естественное горизонтальное положение на животе.",
      icon: "⚖️",
      badge: "Моторика и биомеханика",
      ageRange: "4 - 18 месяцев",
      keyPrinciple: "Естественная горизонталь без напряжения шеи при поддержке взрослого.",
      skills: []
    },
    flottaison_dorsale: {
      title: "Плавание на спине и расслабление",
      description: "Ушки в воде, взгляд вверх, поза «морской звездочки» и мягкая поддержка затылка.",
      icon: "⭐",
      badge: "Доверие и плавучесть",
      ageRange: "4 - 24 месяца",
      keyPrinciple: "Надежная поддержка затылка, погруженные ушки и колыбельная.",
      skills: []
    },
    immersion: {
      title: "Мягкое погружение и нырятельный рефлекс",
      description: "Кратковременное погружение (1-2 сек) лицом к лицу со взрослым и нежные объятия.",
      icon: "🤿",
      badge: "Ныряние и безопасность",
      ageRange: "4 - 24 месяца",
      keyPrinciple: "Плавное вертикальное погружение на одном уровне со взрослым.",
      skills: []
    },
    deplacements: {
      title: "Движение в воде и работа ножек",
      description: "Попеременные удары ножками, движение к игрушке и естественное продвижение.",
      icon: "🐬",
      badge: "Движение и моторика",
      ageRange: "6 - 36 месяцев",
      keyPrinciple: "Активная работа ножек, мотивированная плавающими игрушками.",
      skills: []
    },
    respiration: {
      title: "Дыхание и пускание пузырей",
      description: "Контроль дыхания, выдувание пузырей на поверхности и эмоциональный комфорт.",
      icon: "🌬️",
      badge: "Дыхание и спокойствие",
      ageRange: "4 - 36 месяцев",
      keyPrinciple: "Игровой выдох на поверхности воды и эмоциональная саморегуляция.",
      skills: []
    },
    entree_eau: {
      title: "Вход в воду, прыжки и выход",
      description: "Скольжение из положения сидя с бортика, мягкие прыжки в руки взрослого.",
      icon: "🧗",
      badge: "Смелость и координация",
      ageRange: "6 - 36 месяцев",
      keyPrinciple: "Постепенное усложнение и мягкая амортизация при входе в воду.",
      skills: []
    },
    autonomie_securite: {
      title: "Самоспасение и безопасность",
      description: "Захват бортика руками, разворот в воде и поиск надежной опоры.",
      icon: "🛡️",
      badge: "Безопасность",
      ageRange: "6 - 36 месяцев",
      keyPrinciple: "Умение немедленно ухватиться за бортик бассейна или коврик.",
      skills: []
    }
  },
  zh: {
    decouverte_eau: {
      title: "水感启蒙与感官适应",
      description: "温水适应（32°C）、触觉感知、水花互动与温和的入水仪式。",
      icon: "🌊",
      badge: "感官基础",
      ageRange: "0至6个月以上",
      keyPrinciple: "32°C水温、温和仪式感与尊重婴儿节奏。",
      skills: []
    },
    equilibre: {
      title: "体态平衡与阿基米德浮力",
      description: "核心稳定、自然俯卧水平姿态与头颈协调。",
      icon: "⚖️",
      badge: "动作与生物力学",
      ageRange: "4至18个月",
      keyPrinciple: "在轻柔托举下实现无颈部紧张的自然水平体位。",
      skills: []
    },
    flottaison_dorsale: {
      title: "仰卧漂浮与深度放松",
      description: "双耳入水、仰望上方、海星姿态与轻柔枕骨支撑。",
      icon: "⭐",
      badge: "信任与漂浮",
      ageRange: "4至24个月",
      keyPrinciple: "托住后脑、双耳浸入水中并配合轻柔儿歌。",
      skills: []
    },
    immersion: {
      title: "陪伴潜水与闭气反射",
      description: "面对面垂直下潜（1-2秒）、眼神互动与即时拥抱抚慰。",
      icon: "🤿",
      badge: "潜水与安全",
      ageRange: "4至24个月",
      keyPrinciple: "平稳快速下潜、眼神注视并立刻出水拥抱。",
      skills: []
    },
    deplacements: {
      title: "水中移动与踢水推进",
      description: "双腿交替踢水、追逐玩具与自主游动。",
      icon: "🐬",
      badge: "推进与运动",
      ageRange: "6至36个月",
      keyPrinciple: "借助漂浮玩具激发双腿自主踢水推进。",
      skills: []
    },
    respiration: {
      title: "呼吸控制与水面吐泡泡",
      description: "水面呼气模仿、吹泡泡与情绪安抚平静。",
      icon: "🌬️",
      badge: "呼吸与宁静",
      ageRange: "4至36个月",
      keyPrinciple: "在水面以游戏方式呼气并获得安全感。",
      skills: []
    },
    entree_eau: {
      title: "入水、跳水与出水攀爬",
      description: "池边坐姿滑入、指导跳跃与自主攀爬浮垫。",
      icon: "🧗",
      badge: "勇气与大运动",
      ageRange: "6至36个月",
      keyPrinciple: "循序渐进、温柔缓冲入水与牢固抓握。",
      skills: []
    },
    autonomie_securite: {
      title: "水中自主与自救意识",
      description: "抓住池边、水中转向大人与寻找支撑点。",
      icon: "🛡️",
      badge: "安全自救",
      ageRange: "6至36个月",
      keyPrinciple: "练习入水后迅速抓稳池边或浮板。",
      skills: []
    }
  },
  ja: {
    decouverte_eau: {
      title: "水への親しみと感覚適応",
      description: "温水（32°C）、肌への感覚、プールの音、優しい入水ルーティン。",
      icon: "🌊",
      badge: "感覚の基礎",
      ageRange: "0〜6ヶ月以上",
      keyPrinciple: "32°Cの温水、優しい声かけ、赤ちゃんのペース尊重。",
      skills: []
    },
    equilibre: {
      title: "姿勢バランスと浮力体験",
      description: "体幹の安定、うつ伏せでの水平姿勢、首や背中のリラックス。",
      icon: "⚖️",
      badge: "運動とバランス",
      ageRange: "4〜18ヶ月",
      keyPrinciple: "首に負担をかけない自然な水平姿勢と優しいサポート。",
      skills: []
    },
    flottaison_dorsale: {
      title: "背浮きとリラックス",
      description: "耳を水につけることへの適応、天井を見上げる姿勢、ヒトデのポーズ。",
      icon: "⭐",
      badge: "信頼と浮遊",
      ageRange: "4〜24ヶ月",
      keyPrinciple: "後頭部を優しく支え、耳を水につけて小舟のように揺らします。",
      skills: []
    },
    immersion: {
      title: "潜水と息止め反射",
      description: "保護者と向かい合っての短い潜水（1〜2秒）とすぐの抱っこ。",
      icon: "🤿",
      badge: "潜水と安心",
      ageRange: "4〜24ヶ月",
      keyPrinciple: "目と目を合わせながら静かに潜り、上がったら笑顔で抱きしめます。",
      skills: []
    },
    deplacements: {
      title: "キックと水中移動",
      description: "足を交互に動かすバタ足、おもちゃへ向かっての移動。",
      icon: "🐬",
      badge: "推進力と運動",
      ageRange: "6〜36ヶ月",
      keyPrinciple: "浮いているおもちゃを目標にした楽しいバタ足運動。",
      skills: []
    },
    respiration: {
      title: "呼吸コントロールとブクブク遊び",
      description: "水面での息吐き、泡立て、興奮した後の気持ちの落ち着き。",
      icon: "🌬️",
      badge: "呼吸とリラックス",
      ageRange: "4〜36ヶ月",
      keyPrinciple: "水面で楽しくブクブクと息を吐く練習。",
      skills: []
    },
    entree_eau: {
      title: "プールへの出入り・ジャンプ",
      description: "座った状態からの滑り込み、プールサイドからのジャンプとよじ登り。",
      icon: "🧗",
      badge: "勇気と全身運動",
      ageRange: "6〜36ヶ月",
      keyPrinciple: "無理のない段階的な入水と優しいキャッチ。",
      skills: []
    },
    autonomie_securite: {
      title: "水中自立とセルフレスキュー",
      description: "プールサイドにつかまる反射、水中での方向転換、支えの確保。",
      icon: "🛡️",
      badge: "安全と自立",
      ageRange: "6〜36ヶ月",
      keyPrinciple: "水に入ったらすぐにプールサイドをつかむ習慣づけ。",
      skills: []
    }
  },
  ar: {
    decouverte_eau: {
      title: "الاكتشاف والتكيف الحسي في الماء",
      description: "التعود اللطيف على الماء الدافئ 32 درجة مئوية والطقوس الهادئة.",
      icon: "🌊",
      badge: "الأسس الحسية",
      ageRange: "من 0 إلى 6 أشهر+",
      keyPrinciple: "ماء دافئ 32°م وطقوس رقيقة مع احترام وتيرة الرضيع.",
      skills: []
    },
    equilibre: {
      title: "التوازن الجسدي وقوة الطفو",
      description: "استقرار الجذع والوضعية الأفقية الطبيعية على البطن دون شد في الرقبة.",
      icon: "⚖️",
      badge: "الحركة والتوازن",
      ageRange: "4 إلى 18 شهراً",
      keyPrinciple: "وضعية أفقية مريحة مع دعم خفيف من الوالدين.",
      skills: []
    },
    flottaison_dorsale: {
      title: "الطفو على الظهر والاسترخاء",
      description: "غمر الأذنين في الماء، النظر للأعلى، ووضعية نجم البحر مع دعم الرأس.",
      icon: "⭐",
      badge: "الثقة والطفو",
      ageRange: "4 إلى 24 شهراً",
      keyPrinciple: "دعم مريح للرأس مع غمر الأذنين وأغنية هادئة.",
      skills: []
    },
    immersion: {
      title: "الغوص المصحوب ورد الفعل التنفسي",
      description: "غوص عمودي قصير (1-2 ثانية) وجهاً لوجه مع الوالد وعناق فوري مطمئن.",
      icon: "🤿",
      badge: "الغوص والأمان",
      ageRange: "4 إلى 24 شهراً",
      keyPrinciple: "غوص سلس وهادئ مع تواصل بصري مستمر واحتضان دافئ.",
      skills: []
    },
    deplacements: {
      title: "الحركة والدفع بالركل",
      description: "ركلات أرجل متناوبة والسباحة نحو الألعاب العائمة.",
      icon: "🐬",
      badge: "الحركة والدفع",
      ageRange: "6 إلى 36 شهراً",
      keyPrinciple: "تحفيز ركل الأرجل من خلال الألعاب العائمة الملونة.",
      skills: []
    },
    respiration: {
      title: "التحكم في التنفس والفقاعات",
      description: "الزفير عند سطح الماء وصنع الفقاعات والهدوء النفسي.",
      icon: "🌬️",
      badge: "التنفس والهدوء",
      ageRange: "4 إلى 36 شهراً",
      keyPrinciple: "إخراج الهواء بمرح على سطح الماء وتنظيم التنفس.",
      skills: []
    },
    entree_eau: {
      title: "دخول الماء والقفز والخروج",
      description: "الانزلاق جلوساً من الحافة والقفزات الخفيفة والتسلق الذاتي.",
      icon: "🧗",
      badge: "الشجاعة والمهارة",
      ageRange: "6 إلى 36 شهراً",
      keyPrinciple: "تدرج آمن وامتصاص سلس للدخول في الماء.",
      skills: []
    },
    autonomie_securite: {
      title: "الاستقلالية والإنقاذ الذاتي",
      description: "الإمساك بحافة المسبح والاستدارة نحو الوالد في الماء.",
      icon: "🛡️",
      badge: "الأمان والسلامة",
      ageRange: "6 إلى 36 شهراً",
      keyPrinciple: "التعود على الإمساك الفوري بحافة الحوض أو السجادة العائمة.",
      skills: []
    }
  }
};
