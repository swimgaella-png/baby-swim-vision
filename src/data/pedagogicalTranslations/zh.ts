import { LocalizedCategory, LocalizedSituation, LocalizedExercise } from '../pedagogicalDatabase';
import { multiSkillCategories } from './multiLang';

export const zhSkillCategories: Record<string, LocalizedCategory> = multiSkillCategories.zh || {};

export const zhSituations: Record<string, LocalizedSituation> = {
  sit_immersion_verticale_face_adulte: {
    title: "面对面垂直抱姿潜水（标准基准）",
    description: "婴儿初次潜水的核心基准情境：家长与宝宝面对面贴胸垂直平缓下潜（1-2秒），出水后立即给予眼神安抚和温暖拥抱。",
    observationCriteria: [
      "全程保持专注眼神交流与面部微笑",
      "头颈与脊柱呈垂直中轴线平稳入水",
      "出水后立即贴脸拥抱安抚"
    ],
    recommendedAgeRange: "4至18个月"
  },
  sit_immersion_preparee: {
    title: "口令仪式感预备潜水",
    description: "通过温柔的'1, 2, 3，潜水啦！'预备口令与轻柔吹气，建立规律的闭气反射与心理预期。",
    observationCriteria: [
      "听到预备口令时表现出安详期待",
      "入水瞬间自主闭合嘴唇与声门",
      "出水呼吸顺畅，情绪平静愉悦"
    ],
    recommendedAgeRange: "4至18个月"
  },
  sit_portage_ventral: {
    title: "俯卧滑行托抱与肢体伸展",
    description: "腹部水平托水探索：双手轻柔托持宝宝胸骨或骨盆，引导身体在水面呈流线型水平伸展，自主蹬腿。",
    observationCriteria: [
      "身体水平展平，双腿自然轻快打水",
      "头部适度抬起，颈部放松不后仰",
      "对水下浮力产生自如的适应感"
    ],
    recommendedAgeRange: "4至12个月"
  },
  sit_flottaison_dorsale: {
    title: "仰卧仰浮与耳部浸润放松",
    description: "耳朵轻浸入水，后脑勺枕于父母肩窝或手掌，体验重力完全释放与全身肌肉深度放松。",
    observationCriteria: [
      "双耳完全浸入水中，面部向上放松",
      "腹部与骨盆平稳贴近水面不塌陷",
      "呼吸深长均匀，目光平静望向天空或父母"
    ],
    recommendedAgeRange: "0至18个月"
  },
  sit_deplacement_propulsion: {
    title: "自主划水与水上移位",
    description: "在漂浮垫或父母引导下，利用手臂划水与双腿交替蹬夹，主动游向目标玩具或父母怀抱。",
    observationCriteria: [
      "双臂双腿协调自发划动",
      "具有明确的目标前进意图",
      "体态保持平稳不侧倾"
    ],
    recommendedAgeRange: "8至24个月"
  },
  sit_entree_bord: {
    title: "池边自主入水与安全坐立跳水",
    description: "在池边安全坐立，在父母伸手示意和口令引导下，自主蹬地落入家长怀抱，建立入水许可规则。",
    observationCriteria: [
      "必须等待家长许可口令方才入水",
      "双脚主动轻蹬池壁，身体前倾入水",
      "落入家长怀抱时兴奋自信无惊恐"
    ],
    recommendedAgeRange: "10至36个月"
  }
};

export const zhExercises: Record<string, LocalizedExercise> = {
  exo_immersion_verticale_face_face: {
    title: "初次亲子面对面垂直潜水",
    objective: "在极其安全的亲子情感联结中，平稳完成1至2秒的初次水中潜闭气体验。",
    recommendedAge: "4至18个月",
    duration: "1至2分钟（单次）",
    repetition: "每节课分散进行1至2次",
    tags: ["潜水", "情感安全感", "面对面", "闭气反射"],
    steps: [
      "家长站在水深及胸处，将宝宝竖直抱在胸前，保持面对面贴近。",
      "温柔注视宝宝双眼，面带微笑，温和倒数'1, 2, 3... 潜水啦！'。",
      "家长屈膝，与宝宝同步垂直下潜，沉入水下约1秒，始终保持身体竖直。",
      "平稳起身出水，立即贴面拥抱宝宝，用温暖话语给予赞赏和鼓励。"
    ],
    commonMistakes: [
      "家长自己留在水面上，单手将宝宝猛按入水下。",
      "潜水时间过长，或没有提前给出任何温和预备提示。",
      "入水时将宝宝身体猛烈后仰或倾斜。"
    ],
    corrections: [
      "家长始终与宝宝同步下潜，维持紧密的肌肤接触与安全感。",
      "前几个月的初次潜水严格控制在1秒以内。"
    ],
    safetyTips: [
      "宝宝哭泣、身体僵硬或疲倦时，绝不强行进行潜水。",
      "确保水温达到32°C以上，防止婴儿受凉打颤。"
    ]
  },
  exo_petit_plongeon_rituel: {
    title: "池边仪式感小跳水",
    objective: "培养从池边安全入水的自主平衡感与'获得父母许可才入水'的黄金安全法则。",
    recommendedAge: "8至24个月",
    duration: "2至3分钟",
    repetition: "每节课重复2至3次",
    tags: ["池边入水", "安全法则", "平衡协调"],
    steps: [
      "让宝宝安全坐在池边，双脚垂入水中，家长站在水中正面迎接。",
      "家长双手轻握宝宝前臂，倒数'1, 2, 3，跳！'。",
      "引导宝宝身体前倾，轻柔接住落入水中的宝宝，顺势滑入胸前拥抱。"
    ],
    commonMistakes: [
      "生硬拉扯宝宝手臂。",
      "未等待宝宝主动前倾就强行拽入水中。"
    ],
    corrections: [
      "托持在腋下或双手虎口相贴，顺应宝宝的主动蹬地力量。"
    ],
    safetyTips: [
      "池边湿滑，确保孩子坐稳后再开始游戏。"
    ]
  },
  exo_tapis_volant: {
    title: "魔毯水上漂浮探索",
    objective: "利用多孔浮毯建立对水流波动的动态平衡感知与触觉探索乐趣。",
    recommendedAge: "4至18个月",
    duration: "3至5分钟",
    repetition: "每节课1次",
    tags: ["浮毯", "前庭平衡", "本体感觉"],
    steps: [
      "将大尺寸多孔漂浮垫平铺在水面上。",
      "让宝宝俯卧或坐立在垫子中央，家长双手稳定推扶浮垫。",
      "在水面上轻柔推动浮垫缓缓滑行，唱儿歌并观察宝宝身体的平衡微调。"
    ],
    commonMistakes: [
      "大幅度摇晃浮垫导致宝宝重心失控翻落。"
    ],
    corrections: [
      "保持双手稳定推扶，速度缓慢轻柔。"
    ],
    safetyTips: [
      "随时注意宝宝重心，手不离垫。"
    ]
  },
  exo_etoile_dorsale: {
    title: "海星仰卧漂浮与双耳浸润",
    objective: "体验仰卧水面的失重漂浮，彻底放松颈肩肌肉与前庭平衡系统。",
    recommendedAge: "0至18个月",
    duration: "2至3分钟",
    repetition: "每节课1至2次",
    tags: ["仰卧仰浮", "耳部浸水", "肌肉放松"],
    steps: [
      "家长双手分别托在宝宝后脑勺与下背部。",
      "缓缓将宝宝调整为仰卧体位，双耳浸入水中，面朝天花板。",
      "当宝宝放松呼吸后，逐渐将托在背部的手轻轻移开，仅用单手轻托后脑。"
    ],
    commonMistakes: [
      "水灌入耳时动作慌乱，引起宝宝惊吓。",
      "腹部下沉时未给予及时轻托。"
    ],
    corrections: [
      "以平稳舒缓的声音在耳边低声安抚，保持轻托。"
    ],
    safetyTips: [
      "水温必须保持温暖舒适，避免背部受凉紧绷。"
    ]
  },
  exo_chasse_aux_canards: {
    title: "小鸭水上抓捕与蹬腿推进",
    objective: "通过追逐色彩鲜艳的浮水玩具，激发自主蹬腿与手臂划水的协调推进力。",
    recommendedAge: "6至24个月",
    duration: "3至5分钟",
    repetition: "自由探索进行",
    tags: ["抓握玩具", "蹬腿推进", "自主运动"],
    steps: [
      "在宝宝前方半米处水面上放置浮水小黄鸭或彩色小球。",
      "家长俯卧托住宝宝腹部，引导宝宝伸出小手去抓取玩具。",
      "随着宝宝双腿自发蹬动，配合滑行前移，直至成功抓到玩具。"
    ],
    commonMistakes: [
      "玩具放得太远导致宝宝失去兴趣或产生挫败感。"
    ],
    corrections: [
      "保持触手可及的距离，每次抓到后给予热烈掌声。"
    ],
    safetyTips: [
      "选择符合幼儿啃咬安全标准的大尺寸防吞咽水上玩具。"
    ]
  },
  exo_entree_bord_toboggan: {
    title: "池边滑梯与水流冲浪",
    objective: "借助泡沫斜坡滑入水中，增强速度适应感与身体重心掌控力。",
    recommendedAge: "10至36个月",
    duration: "3至5分钟",
    repetition: "每节课重复2至3次",
    tags: ["滑梯", "入水体验", "运动愉悦"],
    steps: [
      "将软质泡沫斜垫架设在池边作为滑道。",
      "宝宝坐在斜垫顶端，家长在水下正前方敞开双臂准备接托。",
      "轻轻扶持宝宝顺着水流滑入水中，稳稳抱入怀中。"
    ],
    commonMistakes: [
      "滑落速度过快引发水花呛鼻。"
    ],
    corrections: [
      "家长手心向上提前在水面半尺处稳稳迎托。"
    ],
    safetyTips: [
      "确保池水深度适合家长站稳接托。"
    ]
  }
};
