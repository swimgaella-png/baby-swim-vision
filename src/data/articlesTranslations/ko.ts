import { PedagogicalArticle } from '../../types';

export const koArticles: PedagogicalArticle[] = [
  {
    id: 'eveil-aquatique-decouverte-eau',
    image: "/media/articles/decouverte-eau-motricite.webp",
    imageCaption: "32°C 따뜻한 물에서 나누는 깊은 교감과 부드러운 감각 발달.",
    slug: 'baby-swimming-complete-guide-korean',
    title: "아기 수영 & 물 적응 놀이: 모든 아기를 위한 완벽 가이드",
    category: 'psychomotor',
    categoryLabel: "심리운동 발달 & 감각 적응",
    readingTime: "7분",
    icon: "🌊",
    badge: "기본 가이드 & 실전 지침",
    summary: "건강 준비부터 32°C 따뜻한 물에서의 무중력 움직임 발견까지: 부담 없이 아기의 페이스에 맞춰 함께하는 수영의 모든 것.",
    featured: true,
    publishedDate: "2026-08-16",
    author: "Baby Swim Vision 전문 교육 및 의료팀",
    tags: ["아기 수영", "완벽 가이드", "애착 형성", "32°C 수온", "스트레스 없는 교육"],
    content: {
      introduction: "영유아 물놀이는 놀이와 애착, 신뢰를 기반으로 하는 따뜻한 가족 활동입니다. 정형화된 영법을 가르치는 것이 아니라, 물의 부력을 느끼며 자유롭게 몸을 움직이고 물에 대한 자신감을 키우는 과정입니다.",
      sections: [
        {
          title: "1. 시작 시기 및 건강 관리",
          paragraphs: [
            "• 시작 연령: 생후 4개월~3세 (기본 예방접종 완료 후).",
            "• 소아과 확인: 아기 건강 상태 점검 권장.",
            "• 열이나 감기 기운이 있을 때는 무리하지 않고 다음 주로 연기합니다."
          ]
        },
        {
          title: "2. 사전 준비 및 수업 시간",
          paragraphs: [
            "• 수유/식사: 물에 들어가기 1시간 전에는 과식을 피합니다.",
            "• 비누 샤워: 입수 전 샤워는 소독물로부터 아기의 연약한 호흡기와 피부를 지켜줍니다.",
            "• 적정 수온: 31°C~33°C (가장 이상적인 온도는 32°C).",
            "• 시간: 생후 4~18개월 아기는 1회 20~30분이 적당합니다."
          ]
        },
        {
          title: "3. 정서적 안정감과 애착 형성",
          paragraphs: [
            "부모의 품에서 아기는 어른의 편안한 호흡과 미소를 그대로 받아들입니다.",
            "부모가 어깨를 물에 담그고 편안하게 미소 지으면 아기는 금세 안정감을 찾습니다."
          ]
        }
      ],
      takeaways: [
        "생후 4개월부터 32°C 수온에서 시작.",
        "1회 20~30분의 짧고 즐거운 시간.",
        "부력을 통해 스스로 균형을 잡으며 성장합니다."
      ],
      sources: ["소아 건강 및 영유아 수영 표준 지침"]
    }
  },
  {
    id: 'when-to-start-pool-choice',
    image: "/media/articles/securisation-soutiens.webp",
    imageCaption: "32°C 따뜻한 수영장에서의 설레는 첫 수업.",
    slug: 'baby-pool-first-session-guide-korean',
    title: "아기는 언제부터 수영장에 갈 수 있을까 & 적정 수온? 첫 수업 가이드",
    category: 'parenting',
    categoryLabel: "부모 가이드 & 첫 수업",
    readingTime: "5분",
    icon: "🏊",
    badge: "실전 가이드 & 체온 관리",
    summary: "권장 월령, 장난감 잡기 반응, 32°C 수온, 20~30분 시간, 체온 저하 신호 및 안전한 수영장 선택법.",
    featured: true,
    publishedDate: "2026-08-16",
    author: "Baby Swim Vision 팀",
    tags: ["첫 수업", "아기 월령", "32°C 수온", "권장 시간", "체온 신호"],
    content: {
      introduction: "아기는 성인보다 체온을 4배 빠르게 빼앗깁니다. 따라서 32°C 수온과 적절한 시간 조절이 무엇보다 중요합니다.",
      sections: [
        {
          title: "1. 시작 월령과 발달 징후",
          paragraphs: [
            "• 생후 4개월 이후: 목을 가누고 예방접종을 마친 후 시작 가능합니다.",
            "• 발달 신호: 4~6개월경 물에 뜬 장난감을 손으로 잡으려는 호기심."
          ]
        },
        {
          title: "2. 수온과 체온 저하 신호",
          paragraphs: [
            "• 수온 32°C를 유지하며 아기의 어깨를 물속에 담가 따뜻하게 유지합니다.",
            "• 추위 신호 (즉시 물 밖으로 나올 것): 입술 파래짐, 떨림, 창백함.",
            "• 물 밖으로 나오면 즉시 따뜻한 모자 달린 타월로 감싸고 간식을 제공합니다."
          ],
          warning: "30분이 최대 제한 시간입니다: 떨림이나 피로 징후가 보이면 즉시 물 밖으로 나오세요."
        }
      ],
      takeaways: [
        "생후 4개월부터 32°C 수온에서 20~30분 진행.",
        "어깨를 물속에 충분히 담그기.",
        "나온 후 즉시 보온할 수 있도록 타월 준비."
      ],
      sources: ["소아 체온 조절 가이드라인"]
    }
  },
  {
    id: 'first-immersion-milestone',
    image: "/media/articles/premiere-immersion-7-secondes.webp",
    imageCaption: "따뜻한 눈빛 교환 속에서 이루어지는 부드러운 잠수.",
    slug: 'baby-first-immersion-7-seconds-korean',
    title: "아기의 첫 잠수: 7초 단계별 완벽 실전 프로토콜",
    category: 'psychomotor',
    categoryLabel: "물에 대한 자신감 & 잠수",
    readingTime: "6분",
    icon: "💧",
    badge: "핵심 이정표 & 7초 프로토콜",
    summary: "7초 준비 신호부터 매끄러운 입수, 목덜미-골반 지지법, 물을 조금 삼켰을 때의 차분한 대처법까지.",
    featured: true,
    publishedDate: "2026-08-16",
    author: "Baby Swim Vision 교육팀",
    tags: ["첫 잠수", "단계별 가이드", "7초 리듬", "수중 경험", "부력 활용", "신뢰"],
    goldenRule: "망설임 없이 부드럽고 매끄럽게 입수. 아기와 마주 보고 머리와 척추를 일직선으로 유지하며 물의 부력으로 자연스럽게 떠오릅니다.",
    timelineSteps: [
      { second: "0초", title: "시작 자세", action: "수직 안기 & 눈맞춤", iconType: "surface", detail: "어깨를 물속에 넣고 아기와 마주 봅니다.", depthLevel: "surface" },
      { second: "1초", title: "알림 신호", action: "구호 또는 볼에 입바람", iconType: "prepare", detail: "« 하나, 둘, 셋… 잠수! » 신호로 반사 작용을 유도합니다.", depthLevel: "surface" },
      { second: "2초", title: "부드러운 입수", action: "함께 유연하게 하강", iconType: "entry", detail: "머리와 척추 라인을 곧게 유지하며 입수합니다.", depthLevel: "transition" },
      { second: "3초", title: "물속에서의 순간", action: "1~2초간의 잠수", iconType: "submerged", detail: "잠수 반사가 자연스럽게 기도를 보호합니다.", depthLevel: "underwater" },
      { second: "4초", title: "부드러운 곡선", action: "무리 없는 궤적", iconType: "deep", detail: "물속에서 부드럽게 곡선을 그리며 이동합니다.", depthLevel: "underwater" },
      { second: "5초", title: "부력으로 상승", action: "자연스러운 떠오름", iconType: "stable", detail: "물의 부력이 아기를 위로 부드럽게 밀어 올립니다.", depthLevel: "underwater" },
      { second: "6초", title: "수면으로 복귀", action: "환한 미소로 맞이", iconType: "ascend", detail: "머리가 나오자마자 부모가 밝게 미소 지어줍니다.", depthLevel: "transition" },
      { second: "7초", title: "따뜻한 포옹", action: "안아주고 칭찬하기", iconType: "exit", detail: "가슴에 꼭 안아주며 성취를 축하합니다.", depthLevel: "surface" }
    ],
    content: {
      introduction: "성공적인 첫 잠수는 억지로 시키는 것이 아니라 신뢰, 양손의 바른 지지, 7초의 리듬, 그리고 물의 부력을 조화롭게 활용할 때 이루어집니다.",
      sections: [
        {
          title: "적절한 타이밍과 올바른 손 위치",
          paragraphs: [
            "첫 잠수는 물에 적응한 2번째 수업 이후에 시도하는 것이 좋습니다.",
            "한 손은 목덜미와 후두부를, 다른 한 손은 골반을 받쳐줍니다. 머리와 척추를 항상 곧게 유지하세요."
          ]
        },
        {
          title: "물을 조금 삼켰을 때의 대처",
          paragraphs: [
            "아기는 물속에서 숨을 쉬지 않습니다. 실수로 물을 조금 삼키더라도 부모는 당황하지 말고 미소를 유지하세요.",
            "가벼운 기침은 정상적인 신체 보호 반사입니다.",
            "잠수는 언제나 즐거운 놀이여야 하며 절대 강요해서는 안 됩니다."
          ],
          warning: "절대로 억지로 잠수시키지 마세요: 아기의 호기심과 즐거움이 우선입니다."
        }
      ],
      takeaways: [
        "7초 리듬이 잠수 반사를 안전하게 유도합니다.",
        "목덜미-골반 지지로 기도를 안전하게 보호합니다.",
        "물의 부력으로 부드럽게 수면 위로 떠오릅니다."
      ],
      sources: ["영유아 수상 안전 지침"]
    }
  },
  {
    id: 'not-a-swimming-lesson-7-commandments',
    image: "/media/articles/seance-bebe-nageur-pas-cours-natation.webp?v=2",
    imageCaption: "자유로운 놀이와 폼 누들, 원시 반사에 대한 존중.",
    slug: 'baby-swimming-not-a-lesson-7-rules-korean',
    title: "아기 수영: 훈련이 아닌 즐거움, 7가지 황금 수칙과 반사의 진실",
    category: 'psychomotor',
    categoryLabel: "교육 철학 & 7가지 수칙",
    readingTime: "6분",
    icon: "🙅",
    badge: "교육 철학 & 과학적 사실",
    summary: "기록 경쟁이 아닙니다: 물놀이의 4대 기둥, 7가지 수칙, 0~3세 발달과 원시 반사의 과학적 진실.",
    featured: false,
    publishedDate: "2026-08-16",
    author: "Baby Swim Vision 팀",
    tags: ["강습이 아님", "7가지 수칙", "잠수 반사", "원시 반사", "3세 자율성"],
    content: {
      introduction: "경쟁이나 속도를 재는 곳이 아닙니다: 유일한 목표는 아기 자신의 속도에 맞춘 신체 및 정서 발달입니다.",
      sections: [
        {
          title: "1. 물속 안심 7가지 수칙",
          paragraphs: [
            "1. 자유로운 놀이와 즐거움을 최우선으로 둘 것.",
            "2. 딱딱한 암링 대신 부드러운 폼 누들을 사용하여 자연스러운 균형을 익히게 할 것.",
            "3. 갑작스러운 놀래킴이나 억지 잠수를 피할 것.",
            "4. 사레가 들려도 부모가 평정심을 유지할 것.",
            "5. 아기의 감정과 신호를 존중할 것.",
            "6. 단 1초도 눈을 떼지 말 것 (팔 닿는 1m 이내).",
            "7. 아기가 물속에서 방향을 잃고 회전하면 즉시 바로 세워줄 것."
          ],
          warning: "아기가 물속에서 균형을 잃고 뱅글뱅글 돌기 시작하면 즉시 몸을 똑바로 세워주세요."
        }
      ],
      takeaways: [
        "영유아 수영은 경쟁이 아닌 몸에 대한 자신감을 길러줍니다.",
        "원시 반사는 1m 이내 부모의 적극적인 보호를 대신할 수 없습니다."
      ],
      sources: ["세계보건기구(WHO) 익사 예방 가이드라인"]
    }
  },
  {
    id: 'history-philosophy-baby-swimming',
    image: "/media/articles/histoire-mythes-philosophie-bebes-nageurs.webp",
    imageCaption: "기술보다 애착이 우선: 현대 영유아 수영의 핵심 철학.",
    slug: 'baby-swimming-history-philosophy-korean',
    title: "과거부터 현재까지: 아기 수영의 역사, 오해와 진정한 철학",
    category: 'physiology',
    categoryLabel: "역사 & 현대 철학",
    readingTime: "5분",
    icon: "📚",
    badge: "역사 & 철학",
    summary: "1950년대 생존 훈련에서 아제마르(Azémar)의 심리운동 혁명까지: 역사, 3대 운동 성취 및 애착 관계.",
    featured: false,
    publishedDate: "2026-08-16",
    author: "Baby Swim Vision 팀",
    tags: ["역사", "철학", "아제마르 이론", "애착 형성", "3대 성취"],
    content: {
      introduction: "과거의 강압적인 생존 수영 방식은 현대에 완전히 사라졌으며, 이제는 사랑과 자유로운 움직임 중심의 교육으로 발전했습니다.",
      sections: [
        {
          title: "1. 물속에서의 3대 운동 성취",
          paragraphs: [
            "• 직립 자세 (생후 5~6개월부터): 3차원 물속에서 앉고 서는 균형감.",
            "• 공간 지각: 시선과 몸을 목표 방향으로 돌리기.",
            "• 이동: 부모나 부유 매트를 향해 손발을 움직여 나아가기."
          ]
        }
      ],
      takeaways: [
        "현대 수영 교육은 강요를 배제하고 애착을 중심에 둡니다.",
        "직립, 지각, 이동의 3대 요소를 자연스럽게 키워줍니다."
      ],
      sources: ["영유아 심리운동 발달 연구"]
    }
  },
  {
    id: 'dry-drowning',
    image: "/media/articles/noyade-seche-vrai-ou-faux.webp",
    imageCaption: "의학적 근거에 기반한 지식과 지속적인 관찰.",
    slug: 'dry-drowning-myths-medical-truth-korean',
    title: "« 마른 익사 »: SNS의 오해와 소아과 의학의 진실",
    category: 'safety',
    categoryLabel: "예방 & 의학적 진실",
    readingTime: "4분",
    icon: "💧",
    badge: "기본 지식 & 안전 예방",
    summary: "온라인에서 화제가 되는 '마른 익사' 소문과 아기가 물을 조금 삼켰을 때의 정확한 의학적 대처법.",
    featured: true,
    publishedDate: "2026-08-10",
    author: "Baby Swim Vision 의료 자문팀",
    tags: ["마른 익사", "안전", "물 삼킴", "응급 처치", "예방"],
    content: {
      introduction: "SNS에 떠도는 '물을 삼킨 후 며칠 뒤 아무 증상 없이 사망한다'는 이야기는 과학적 근거가 없는 의학적 오해입니다.",
      sections: [
        {
          title: "실제로 주의해야 할 호흡기 증상",
          paragraphs: [
            "물을 조금 마신 직후의 가벼운 기침은 정상적인 방어 작용입니다.",
            "그러나 기침이 멈추지 않거나 호흡 곤란, 극심한 무기력, 입술 청색증이 나타나면 즉시 진료를 받아야 합니다."
          ]
        }
      ],
      takeaways: [
        "전조 증상 없는 지연성 익사는 근거 없는 소문입니다.",
        "사고 후 수 시간 동안의 호흡 상태를 잘 관찰하세요.",
        "팔 닿는 거리(1m 이내)에서의 적극적인 관찰이 최선의 예방책입니다."
      ],
      sources: ["소아과학회 및 세계보건기구"]
    }
  },
  {
    id: 'active-supervision',
    image: "/media/articles/surveillance-active-securite-affective.webp",
    imageCaption: "항상 팔이 닿는 1m 이내에서 안심의 눈맞춤을 유지하세요.",
    slug: 'active-supervision-arm-length-rule-korean',
    title: "적극적인 관찰과 정서적 안전: 한 팔 거리 규칙과 눈빛의 힘",
    category: 'safety',
    categoryLabel: "안전 & 애착 연결",
    readingTime: "4분",
    icon: "🛡️",
    badge: "황금률 & 세심한 돌봄",
    summary: "영유아는 단 몇 초 만에 소리 없이 물속으로 가라앉을 수 있습니다: 한 팔 거리 규칙, 튜브의 함정, 그리고 눈맞춤의 힘.",
    featured: false,
    publishedDate: "2026-08-15",
    author: "Baby Swim Vision 팀",
    tags: ["적극적 관찰", "한 팔 거리", "정서적 안전", "눈맞춤", "사고 예방"],
    content: {
      introduction: "물놀이 안전은 '1m 이내의 물리적 밀착'과 '따뜻하고 차분한 눈맞춤'이라는 두 가지 기둥으로 지켜집니다.",
      sections: [
        {
          title: "생명을 지키는 한 팔 거리 규칙 (< 1미터)",
          paragraphs: [
            "3세 미만 영유아와 함께할 때 어른은 항상 물속에서 팔이 닿는 거리(1m 이내)에 있어야 합니다.",
            "스마트폰을 보거나 수건을 가지러 가느라 단 몇 초라도 시선을 돌리지 마세요.",
            "누가 아이를 보고 있는지 항상 명확히 정해두세요."
          ]
        },
        {
          title: "튜브와 보조 기구의 거짓 안전감",
          paragraphs: [
            "튜브는 보조 기구일 뿐 부모의 관찰을 대신할 수 없습니다.",
            "튜브는 순식간에 뒤집힐 수 있으며 아기 스스로 일어날 수 없습니다."
          ],
          warning: "그 어떤 물놀이 기구도 물속 부모의 직접적인 관찰을 대체할 수 없습니다."
        }
      ],
      takeaways: [
        "팔 닿는 1m 이내의 관찰이 유일한 완벽한 보호막입니다.",
        "물놀이 보조 기구에만 의존하지 마세요.",
        "부모의 편안한 미소가 아기에게 가장 훌륭한 구명조끼입니다."
      ],
      sources: ["국가 수상 안전 가이드라인"]
    }
  }
];
