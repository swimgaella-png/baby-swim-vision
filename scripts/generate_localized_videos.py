#!/usr/bin/env python3
"""
Baby Swim Vision - Localized Promotional Video Generator
Captures screenshots of the real application in each language:
- Français (fr)
- English (en)
- Español (es)
- Português (pt)
- Deutsch (de)
- 日本語 (ja)
- 中文 (zh)

For each language:
1. Takes the 6 real application screen captures (Landing, Dashboard, Studio, AI Analysis, Library, Club Map) in that language.
2. Composes the promotional video with animated Ken Burns pan/zoom and localized title/subtitle overlays.
3. Outputs high-definition MP4 videos directly accessible for external download.
"""

import os
import shutil
import subprocess
import time

SCENE_DEFS = [
    ('01_accueil_landing', 'landing'),
    ('02_tableau_de_bord', 'dashboard'),
    ('03_studio_video', 'record'),
    ('04_resultat_analyse_ia', 'analysis-result'),
    ('05_videotheque_pedagogique', 'library'),
    ('06_trouver_mon_club', 'find-club'),
]

FONTS = {
    'western': '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',
    'ja': '/usr/share/fonts/opentype/ipafont-gothic/ipagp.ttf',
    'zh': '/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc',
}

LANGUAGES = {
    'fr': {
        'name': 'Français',
        'url_lang': 'fr',
        'font': FONTS['western'],
        'title_size': 36,
        'sub_size': 26,
        'scenes': [
            ("Accompagnez l'éveil aquatique de votre bébé", "L'application bienveillante d'apprentissage dans l'eau"),
            ("Tableau de bord personnalisé & suivi des progrès", "Profil d'aisance motrice et étapes d'évolution"),
            ("Enregistrez ou importez votre séance en bassin", "Studio vidéo ergonomique avec scénarios guidés"),
            ("Débriefing biomécanique par IA experte", "Analyse posturale, décontraction & conseils personnalisés"),
            ("Vidéothèque & fiches d'exercices certifiées", "Guides pédagogiques par tranche d'âge & motricité"),
            ("Trouvez votre club bébé nageur certifié", "Baby Swim Vision - Pratique aquatique en toute confiance"),
        ],
    },
    'en': {
        'name': 'English',
        'url_lang': 'en',
        'font': FONTS['western'],
        'title_size': 36,
        'sub_size': 26,
        'scenes': [
            ("Support your baby's aquatic development", "The caring water learning app"),
            ("Personalized dashboard & progress tracking", "Motor ease profile and developmental milestones"),
            ("Record or import your pool session", "Ergonomic video studio with guided scenarios"),
            ("Expert AI biomechanical debriefing", "Postural analysis, relaxation & personalized advice"),
            ("Video library & certified exercises", "Pedagogical guides by age group & motor skills"),
            ("Find your certified baby swim club", "Baby Swim Vision - Confident aquatic practice"),
        ],
    },
    'es': {
        'name': 'Español',
        'url_lang': 'es',
        'font': FONTS['western'],
        'title_size': 35,
        'sub_size': 25,
        'scenes': [
            ("Acompañe el desarrollo acuático de su bebé", "La aplicación cariñosa de aprendizaje en el agua"),
            ("Panel personalizado y seguimiento del progreso", "Perfil de soltura motriz e hitos de evolución"),
            ("Grabe o importe su sesión en la piscina", "Estudio de video ergonómico con ejercicios guiados"),
            ("Evaluación biomecánica con IA experta", "Análisis postural, relajación y consejos personalizados"),
            ("Videoteca y ejercicios certificados", "Guías pedagógicas por edad y desarrollo motriz"),
            ("Encuentre su club de natación para bebés certificado", "Baby Swim Vision - Práctica acuática con total confianza"),
        ],
    },
    'pt': {
        'name': 'Português',
        'url_lang': 'pt',
        'font': FONTS['western'],
        'title_size': 35,
        'sub_size': 25,
        'scenes': [
            ("Acompanhe o despertar aquático do seu bebê", "O aplicativo acolhedor de aprendizagem na água"),
            ("Painel personalizado e acompanhamento de progresso", "Perfil de facilidade motora e marcos de evolução"),
            ("Grave ou importe sua sessão na piscina", "Estúdio de vídeo ergonômico com cenários guiados"),
            ("Debriefing biomecânico por IA especialista", "Análise postural, relaxamento e orientações personalizadas"),
            ("Videoteca e exercícios certificados", "Guias pedagógicos por faixa etária e motricidade"),
            ("Encontre seu clube de natação para bebês certificado", "Baby Swim Vision - Prática aquática com total confiança"),
        ],
    },
    'de': {
        'name': 'Deutsch',
        'url_lang': 'de',
        'font': FONTS['western'],
        'title_size': 34,
        'sub_size': 25,
        'scenes': [
            ("Begleiten Sie die Wassergewöhnung Ihres Babys", "Die liebevolle App für spielerisches Lernen im Wasser"),
            ("Persönliches Dashboard & Fortschrittsverfolgung", "Motorisches Profil und Entwicklungsmeilensteine"),
            ("Schwimmeinheit im Becken filmen oder importieren", "Ergonomisches Videostudio mit geführten Übungen"),
            ("Biomechanisches Feedback durch Experten-KI", "Haltungsanalyse, Entspannung & persönliche Ratschläge"),
            ("Videothek & zertifizierte Übungen", "Pädagogische Anleitungen nach Altersstufe & Motorik"),
            ("Zertifizierten Babyschwimmclub finden", "Baby Swim Vision - Sicher und vertrauensvoll im Wasser"),
        ],
    },
    'ja': {
        'name': '日本語',
        'url_lang': 'ja',
        'font': FONTS['ja'],
        'title_size': 38,
        'sub_size': 27,
        'scenes': [
            ("赤ちゃんの水への適応と成長をやさしくサポート", "プールでの水慣れと成長を見守る専用アプリ"),
            ("個別ダッシュボードと成長ステップの記録", "水中での運動適応プロファイルと発達指標"),
            ("プールでの練習動画をその場で撮影・アップロード", "ガイド付きシナリオで使いやすいビデオスタジオ"),
            ("専門AIによる水中バイオメカニクス解析", "姿勢バランス・リラックス度分析と個別アドバイス"),
            ("充実の動画ライブラリと公認練習ガイド", "月齢・運動発達段階に応じた安心の教育コンテンツ"),
            ("認定ベビースイミングクラブを地図で検索", "Baby Swim Vision - 親子で安心できる水泳体験"),
        ],
    },
    'zh': {
        'name': '中文',
        'url_lang': 'zh',
        'font': FONTS['zh'],
        'title_size': 38,
        'sub_size': 27,
        'scenes': [
            ("陪伴宝宝开启温馨的水中启蒙之旅", "关爱与科学并重的水中亲子学习应用"),
            ("个性化成长看板与游泳进度追踪", "水中动作协调度与发育里程碑评估"),
            ("便捷拍摄或导入泳池练习视频", "贴心的人体工学视频工作台与指导方案"),
            ("专业AI生物力学解析与智能反馈", "姿态稳定性、放松度评估与专属建议"),
            ("精选教学视频库与专业练习动作", "按月龄与运动能力划分的分级教学指南"),
            ("一键查找认证亲子婴儿游泳俱乐部", "Baby Swim Vision - 让每一次水中探索都充满信心"),
        ],
    },
}

def capture_screens_for_lang(lang_code, url_lang):
    """Takes real screenshots of the app in the specified language."""
    target_dir = f"public/media/captures/{lang_code}"
    os.makedirs(target_dir, exist_ok=True)
    
    print(f"\n--- Capturing screenshots for {lang_code.upper()} ({url_lang}) ---")
    captured_paths = []
    
    for scene_id, view_name in SCENE_DEFS:
        out_png = f"{target_dir}/{scene_id}.png"
        url = f"http://localhost:3000/?lang={url_lang}&view={view_name}"
        
        # Take screenshot via headless chromium
        cmd = [
            "chromium",
            "--no-sandbox",
            "--headless",
            "--disable-gpu",
            "--run-all-compositor-stages-before-draw",
            "--virtual-time-budget=2000",
            "--window-size=1080,1920",
            f"--screenshot={out_png}",
            url
        ]
        res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if res.returncode != 0 or not os.path.exists(out_png) or os.path.getsize(out_png) < 10000:
            print(f"  Warning: failed to capture {scene_id} for {lang_code}, retrying...")
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            
        size_kb = os.path.getsize(out_png) / 1024 if os.path.exists(out_png) else 0
        print(f"  [OK] {scene_id} ({size_kb:.0f} KB)")
        captured_paths.append(out_png)
        
    return captured_paths

def build_video_for_lang(lang_code, config, captures):
    out_video_path = f"public/media/presentation_baby_swim_vision_{lang_code}.mp4"
    
    print(f"\n==================================================")
    print(f"Generating video for {config['name']} ({lang_code})...")
    print(f"==================================================")
    
    t_start = time.time()
    work_dir = f"/tmp/promo_work_{lang_code}"
    os.makedirs(work_dir, exist_ok=True)
    
    font = config['font']
    title_size = config['title_size']
    sub_size = config['sub_size']
    
    # 1. Generate the 6 composite images with localized text and real screenshots
    img_paths = []
    for idx, ((title, sub), src_capture) in enumerate(zip(config['scenes'], captures), 1):
        title_file = os.path.join(work_dir, f"title_{idx}.txt")
        sub_file = os.path.join(work_dir, f"sub_{idx}.txt")
        out_img = os.path.join(work_dir, f"scene_{idx}.png")
        
        with open(title_file, "w", encoding="utf-8") as f:
            f.write(title)
        with open(sub_file, "w", encoding="utf-8") as f:
            f.write(sub)
            
        vf = (
            f"drawbox=x=0:y=1600:w=1080:h=320:color=0x081627@0.92:t=fill,"
            f"drawbox=x=0:y=1598:w=1080:h=2:color=0x38bdf8@0.4:t=fill,"
            f"drawtext=fontfile={font}:textfile={title_file}:fontcolor=white:fontsize={title_size}:x=(w-text_w)/2:y=1665:shadowcolor=black@0.6:shadowx=2:shadowy=2,"
            f"drawtext=fontfile={font}:textfile={sub_file}:fontcolor=0x38bdf8:fontsize={sub_size}:x=(w-text_w)/2:y=1735:shadowcolor=black@0.6:shadowx=1:shadowy=1"
        )
        
        subprocess.run(
            ["ffmpeg", "-y", "-i", src_capture, "-vf", vf, out_img],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL
        )
        img_paths.append(out_img)
        
    print(f"Images prepared in {time.time() - t_start:.2f}s. Assembling video with transitions...")
    
    # 2. Assembling video using ffmpeg filter_complex with crossfades
    inputs = []
    for img in img_paths:
        inputs.extend(["-loop", "1", "-t", "4.8", "-i", img])
    inputs.extend(["-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo"])
    
    filter_parts = []
    for idx in range(6):
        filter_parts.append(
            f"[{idx}:v]scale=1080:1920,zoompan=z='min(zoom+0.0004,1.05)':d=144:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps=30[v{idx}]"
        )
        
    filter_parts.append("[v0][v1]xfade=transition=fade:duration=0.5:offset=4.3[xf1]")
    filter_parts.append("[xf1][v2]xfade=transition=fade:duration=0.5:offset=8.6[xf2]")
    filter_parts.append("[xf2][v3]xfade=transition=fade:duration=0.5:offset=12.9[xf3]")
    filter_parts.append("[xf3][v4]xfade=transition=fade:duration=0.5:offset=17.2[xf4]")
    filter_parts.append("[xf4][v5]xfade=transition=fade:duration=0.5:offset=21.5,format=yuv420p[vout]")
    
    cmd = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", ";".join(filter_parts),
        "-map", "[vout]",
        "-map", "6:a",
        "-c:v", "libx264",
        "-preset", "ultrafast",
        "-crf", "24",
        "-c:a", "aac",
        "-b:a", "128k",
        "-shortest",
        "-t", "26.14",
        "-movflags", "+faststart",
        out_video_path
    ]
    
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    size_mb = os.path.getsize(out_video_path) / (1024 * 1024)
    print(f"Generated {out_video_path} ({size_mb:.1f} MB) in {time.time() - t_start:.2f}s!")
    
    # Also copy to dist if dist/media exists
    dist_dir = "dist/media"
    if os.path.exists(dist_dir):
        dist_out = os.path.join(dist_dir, f"presentation_baby_swim_vision_{lang_code}.mp4")
        shutil.copy2(out_video_path, dist_out)
        print(f"Copied to {dist_out}")

def main():
    os.makedirs("public/media", exist_ok=True)
    os.makedirs("dist/media", exist_ok=True)
    
    for lang_code, config in LANGUAGES.items():
        captures = capture_screens_for_lang(lang_code, config['url_lang'])
        build_video_for_lang(lang_code, config, captures)
        
    # Copy French version as default presentation_baby_swim_vision.mp4
    fr_video = "public/media/presentation_baby_swim_vision_fr.mp4"
    default_video = "public/media/presentation_baby_swim_vision.mp4"
    if os.path.exists(fr_video):
        shutil.copy2(fr_video, default_video)
        if os.path.exists("dist/media"):
            shutil.copy2(fr_video, "dist/media/presentation_baby_swim_vision.mp4")
        print("Set French video as default presentation_baby_swim_vision.mp4")
        
    print("\nAll localized promotional videos with localized real screenshots generated successfully!")

if __name__ == "__main__":
    main()
