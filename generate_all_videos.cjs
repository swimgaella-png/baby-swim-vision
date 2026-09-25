const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FONTS = {
  LATIN: '/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',
  CHINESE: '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc',
  JAPANESE: '/usr/share/fonts/opentype/ipafont-gothic/ipag.ttf'
};

const SCENE_IMAGES = [
  'src/assets/images/baby_swim_scene1_1789987275687.jpg',
  'src/assets/images/baby_swim_scene2_1789987288901.jpg',
  'src/assets/images/baby_swim_scene3_1789987299785.jpg',
  'src/assets/images/baby_swim_scene4_1789987309426.jpg',
  'src/assets/images/baby_swim_scene5_1789987321232.jpg',
  'src/assets/images/baby_swim_scene6_1789987332109.jpg'
];

const LANGUAGES = [
  {
    code: 'FR',
    name: 'Français',
    font: FONTS.LATIN,
    scenes: [
      {
        text: "Vous filmez votre bébé dans l'eau...\nMais savez-vous vraiment ce que vous devez regarder ?",
        size: 30,
        y: 'h-text_h-180'
      },
      {
        text: "Filmez.\nCapturez chaque instant de découverte",
        size: 36,
        y: 'h-text_h-200'
      },
      {
        text: "Analysez.\nMouvements • Posture • Équilibre",
        size: 34,
        y: 'h-text_h-200'
      },
      {
        text: "Comprenez mieux ses mouvements.\nDécouvrez comment l'accompagner.",
        size: 30,
        y: 'h-text_h-200'
      },
      {
        text: "Des exercices adaptés à chaque étape.\nProgrès en confiance & complicité",
        size: 30,
        y: 'h-text_h-200'
      },
      {
        text: "BABY SWIM VISION\n\nFilmez. Analysez. Accompagnez.\n\n👉 Découvrez Baby Swim Vision",
        size: 34,
        y: '(h-text_h)/2'
      }
    ]
  },
  {
    code: 'EN',
    name: 'English',
    font: FONTS.LATIN,
    scenes: [
      {
        text: "You film your baby in the water...\nBut do you really know what to look for?",
        size: 30,
        y: 'h-text_h-180'
      },
      {
        text: "Record.\nCapture every precious water moment",
        size: 36,
        y: 'h-text_h-200'
      },
      {
        text: "Analyze.\nMovement • Posture • Balance",
        size: 34,
        y: 'h-text_h-200'
      },
      {
        text: "Understand their movements.\nLearn how to guide them.",
        size: 30,
        y: 'h-text_h-200'
      },
      {
        text: "Tailored exercises for every stage.\nGentle progress in loving trust",
        size: 30,
        y: 'h-text_h-200'
      },
      {
        text: "BABY SWIM VISION\n\nRecord. Analyze. Guide.\n\n👉 Discover Baby Swim Vision",
        size: 34,
        y: '(h-text_h)/2'
      }
    ]
  },
  {
    code: 'DE',
    name: 'Deutsch',
    font: FONTS.LATIN,
    scenes: [
      {
        text: "Sie filmen Ihr Baby im Wasser...\nAber wissen Sie wirklich, worauf Sie achten sollten?",
        size: 28,
        y: 'h-text_h-180'
      },
      {
        text: "Filmen.\nJeden schönen Moment festhalten",
        size: 36,
        y: 'h-text_h-200'
      },
      {
        text: "Analysieren.\nBewegung • Haltung • Gleichgewicht",
        size: 32,
        y: 'h-text_h-200'
      },
      {
        text: "Verstehen Sie die Bewegungen besser.\nErfahren Sie, wie Sie Ihr Kind begleiten.",
        size: 28,
        y: 'h-text_h-200'
      },
      {
        text: "Passende Übungen für jede Entwicklungsstufe.\nMit Vertrauen & Freude im Wasser",
        size: 28,
        y: 'h-text_h-200'
      },
      {
        text: "BABY SWIM VISION\n\nFilmen. Analysieren. Begleiten.\n\n👉 Entdecken Sie Baby Swim Vision",
        size: 32,
        y: '(h-text_h)/2'
      }
    ]
  },
  {
    code: 'IT',
    name: 'Italiano',
    font: FONTS.LATIN,
    scenes: [
      {
        text: "Filmi il tuo bambino nell'acqua...\nMa sai davvero cosa osservare?",
        size: 30,
        y: 'h-text_h-180'
      },
      {
        text: "Filma.\nCattura ogni momento in piscina",
        size: 36,
        y: 'h-text_h-200'
      },
      {
        text: "Analizza.\nMovimento • Postura • Equilibrio",
        size: 34,
        y: 'h-text_h-200'
      },
      {
        text: "Comprendi meglio i suoi movimenti.\nScopri come accompagnarlo.",
        size: 30,
        y: 'h-text_h-200'
      },
      {
        text: "Esercizi su misura per ogni fase.\nFiducia e serenità in acqua",
        size: 30,
        y: 'h-text_h-200'
      },
      {
        text: "BABY SWIM VISION\n\nFilma. Analizza. Accompagna.\n\n👉 Scopri Baby Swim Vision",
        size: 34,
        y: '(h-text_h)/2'
      }
    ]
  },
  {
    code: 'ES',
    name: 'Español',
    font: FONTS.LATIN,
    scenes: [
      {
        text: "¿Giras vídeos de tu bebé en el agua?\n¿Sabes realmente qué debes observar?",
        size: 30,
        y: 'h-text_h-180'
      },
      {
        text: "Graba.\nCaptura cada instante acuático",
        size: 36,
        y: 'h-text_h-200'
      },
      {
        text: "Analiza.\nMovimiento • Postura • Equilibrio",
        size: 34,
        y: 'h-text_h-200'
      },
      {
        text: "Comprende mejor sus movimientos.\nDescubre cómo acompañarlo.",
        size: 30,
        y: 'h-text_h-200'
      },
      {
        text: "Ejercicios adaptados a cada etapa.\nSeguridad, juego y complicidad",
        size: 30,
        y: 'h-text_h-200'
      },
      {
        text: "BABY SWIM VISION\n\nGraba. Analiza. Acompaña.\n\n👉 Descubre Baby Swim Vision",
        size: 34,
        y: '(h-text_h)/2'
      }
    ]
  },
  {
    code: 'PT',
    name: 'Português',
    font: FONTS.LATIN,
    scenes: [
      {
        text: "Você filma o seu bebê na água...\nMas sabe realmente o que observar?",
        size: 30,
        y: 'h-text_h-180'
      },
      {
        text: "Filme.\nGuarde cada momento na água",
        size: 36,
        y: 'h-text_h-200'
      },
      {
        text: "Analise.\nMovimento • Postura • Equilíbrio",
        size: 34,
        y: 'h-text_h-200'
      },
      {
        text: "Compreenda melhor os movimentos dele.\nDescubra como acompanhá-lo.",
        size: 30,
        y: 'h-text_h-200'
      },
      {
        text: "Exercícios adaptados para cada etapa.\nConfiança e carinho na piscina",
        size: 30,
        y: 'h-text_h-200'
      },
      {
        text: "BABY SWIM VISION\n\nFilme. Analise. Acompanhe.\n\n👉 Descubra Baby Swim Vision",
        size: 34,
        y: '(h-text_h)/2'
      }
    ]
  },
  {
    code: 'RU',
    name: 'Русский',
    font: FONTS.LATIN,
    scenes: [
      {
        text: "Вы снимаете малыша в воде...\nНо знаете ли вы, на что обращать внимание?",
        size: 28,
        y: 'h-text_h-180'
      },
      {
        text: "Снимайте.\nСохраняйте тёплые водные моменты",
        size: 34,
        y: 'h-text_h-200'
      },
      {
        text: "Анализируйте.\nДвижение • Осанка • Баланс",
        size: 32,
        y: 'h-text_h-200'
      },
      {
        text: "Поймите каждое движение малыша.\nУзнайте, как правильно его поддержать.",
        size: 28,
        y: 'h-text_h-200'
      },
      {
        text: "Упражнения для каждого этапа.\nУверенность, радость и развитие",
        size: 28,
        y: 'h-text_h-200'
      },
      {
        text: "BABY SWIM VISION\n\nСнимайте. Анализируйте. Сопровождайте.\n\n👉 Откройте для себя Baby Swim Vision",
        size: 30,
        y: '(h-text_h)/2'
      }
    ]
  },
  {
    code: 'ZH',
    name: '中文',
    font: FONTS.CHINESE,
    scenes: [
      {
        text: "你在水中为宝宝拍下视频……\n但你真的知道该观察哪些细节吗？",
        size: 32,
        y: 'h-text_h-180'
      },
      {
        text: "拍摄。\n记录每一次珍贵的水中探索",
        size: 36,
        y: 'h-text_h-200'
      },
      {
        text: "分析。\n动作分析 • 姿态评估 • 水中平衡",
        size: 34,
        y: 'h-text_h-200'
      },
      {
        text: "深入理解宝宝的每一个动作。\n掌握科学温和的陪伴方法。",
        size: 32,
        y: 'h-text_h-200'
      },
      {
        text: "专为各成长阶段定制的水中练习。\n在亲子互动中建立水性与自信",
        size: 30,
        y: 'h-text_h-200'
      },
      {
        text: "BABY SWIM VISION\n\n拍摄。分析。陪伴。\n\n👉 立即体验 Baby Swim Vision",
        size: 36,
        y: '(h-text_h)/2'
      }
    ]
  },
  {
    code: 'JA',
    name: '日本語',
    font: FONTS.JAPANESE,
    scenes: [
      {
        text: "水の中で赤ちゃんを撮影していても……\n本当に見るべきポイントをご存知ですか？",
        size: 30,
        y: 'h-text_h-180'
      },
      {
        text: "撮影する。\nプールでの大切な瞬間を記録",
        size: 34,
        y: 'h-text_h-200'
      },
      {
        text: "分析する。\n体の動き • 姿勢 • 水中バランス",
        size: 32,
        y: 'h-text_h-200'
      },
      {
        text: "赤ちゃんの動きをもっと深く理解する。\n最適なサポート方法を見つける。",
        size: 28,
        y: 'h-text_h-200'
      },
      {
        text: "成長段階に合わせた楽しい練習メニュー。\n水への自信と親子のスキンシップ",
        size: 28,
        y: 'h-text_h-200'
      },
      {
        text: "BABY SWIM VISION\n\n撮影。分析。寄り添う。\n\n👉 Baby Swim Vision を体験しよう",
        size: 32,
        y: '(h-text_h)/2'
      }
    ]
  }
];

function buildVideoForLanguage(lang) {
  const code = lang.code;
  const voicePath = `audio_tracks/voice_${code}.wav`;
  const outputPath = `Baby_Swim_Vision_${code}.mp4`;
  const tmpDir = `tmp_${code}`;

  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  console.log(`\n========================================`);
  console.log(`Rendering video for: ${lang.name} (${code})`);
  console.log(`========================================`);

  // 1. Get voice duration
  const durStr = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 ${voicePath}`).toString().trim();
  const totalDuration = parseFloat(durStr) || 28.0;
  console.log(`Voice duration: ${totalDuration.toFixed(2)}s`);

  // 2. Mix voice with background music
  const mixedAudioPath = path.join(tmpDir, 'mixed_audio.wav');
  const mixCmd = `ffmpeg -y -i ${voicePath} -i ambient_track.wav \\
    -filter_complex "[0:a]volume=1.0[a0];[1:a]volume=0.14[a1];[a0][a1]amix=inputs=2:duration=first:dropout_transition=2,afade=t=out:st=${Math.max(0, totalDuration - 2.5)}:d=2.5[aout]" \\
    -map "[aout]" ${mixedAudioPath}`;
  execSync(mixCmd);

  // 3. Compute scene durations proportional to voice length
  // 6 scenes proportions: 18%, 15%, 18%, 17%, 15%, 17%
  const ratios = [0.18, 0.15, 0.18, 0.17, 0.15, 0.17];
  const sceneDurations = ratios.map(r => +(r * totalDuration).toFixed(2));
  // Adjust last scene to perfectly match total duration
  const sumFirst5 = sceneDurations.slice(0, 5).reduce((a, b) => a + b, 0);
  sceneDurations[5] = +(totalDuration - sumFirst5).toFixed(2);

  const segmentFiles = [];

  for (let i = 0; i < 6; i++) {
    const imgPath = SCENE_IMAGES[i];
    const sceneConf = lang.scenes[i];
    const sDur = sceneDurations[i];
    const segPath = path.join(tmpDir, `seg_${i}.mp4`);
    const txtPath = path.join(tmpDir, `text_${i}.txt`);

    fs.writeFileSync(txtPath, sceneConf.text, 'utf8');

    // Create video segment with subtle smooth Ken Burns pan/zoom + text overlay
    // Zoom factor: 1.0 -> 1.08 over the segment
    const fontPath = lang.font;
    const fadeOutSt = Math.max(0, sDur - 0.4);

    const segCmd = `ffmpeg -y -loop 1 -t ${sDur} -i ${imgPath} \\
      -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280,fade=t=in:st=0:d=0.35,fade=t=out:st=${fadeOutSt}:d=0.35,drawtext=fontfile=${fontPath}:textfile=${txtPath}:fontsize=${sceneConf.size}:fontcolor=white:x=(w-text_w)/2:y=${sceneConf.y}:line_spacing=12:box=1:boxcolor=black@0.65:boxborderw=18" \\
      -c:v libx264 -pix_fmt yuv420p -preset ultrafast -r 25 ${segPath}`;

    execSync(segCmd);
    segmentFiles.push(segPath);
    console.log(`Scene ${i + 1}/6 rendered (${sDur}s)`);
  }

  // 4. Concatenate segments
  const concatListPath = path.join(tmpDir, 'concat_list.txt');
  const concatContent = segmentFiles.map(f => `file '${path.resolve(f)}'`).join('\n');
  fs.writeFileSync(concatListPath, concatContent);

  const mergedVideoPath = path.join(tmpDir, 'video_merged.mp4');
  execSync(`ffmpeg -y -f concat -safe 0 -i ${concatListPath} -c copy ${mergedVideoPath}`);

  // 5. Combine with mixed audio into final MP4
  execSync(`ffmpeg -y -i ${mergedVideoPath} -i ${mixedAudioPath} \\
    -c:v copy -c:a aac -b:a 192k -shortest \\
    -movflags +faststart ${outputPath}`);

  console.log(`✅ Finished: ${outputPath} (Size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB)`);

  // Cleanup tmp dir
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

// Execute
(async () => {
  console.log('Starting batch creation of 9 Baby Swim Vision promotional videos...');
  for (const lang of LANGUAGES) {
    buildVideoForLanguage(lang);
  }
  console.log('\n🎉 ALL 9 PROMOTIONAL VIDEOS SUCCESSFULLY CREATED!');
})();
