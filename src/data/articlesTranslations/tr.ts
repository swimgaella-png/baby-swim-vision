import { PedagogicalArticle } from '../../types';

export const trArticles: PedagogicalArticle[] = [
  {
    id: 'eveil-aquatique-decouverte-eau',
    image: "/media/articles/decouverte-eau-motricite.webp",
    imageCaption: "Sıcak suda güvenli bağ, pratik öneriler ve yumuşak duyusal gelişim.",
    slug: 'bebek-yuzme-ve-suya-alistirma-tam-rehber',
    title: "Bebek Yüzme & Suya Alıştırma: Her Bebek İçin Kapsamlı Rehber",
    category: 'psychomotor',
    categoryLabel: "Psikomotor Gelişim & Suya Alıştırma",
    readingTime: "7 dk",
    icon: "🌊",
    badge: "Temel Kılavuz & Uygulama",
    summary: "Sağlık şartlarından pratik hazırlığa ve 32°C suda yerçekimsiz hareket keşfine: Çocuğunuzu baskı olmadan, kendi hızında suya alıştırmak için bilmeniz gereken her şey.",
    featured: true,
    publishedDate: "2026-08-16",
    author: "Baby Swim Vision Pedagoji ve Tıp Ekibi",
    tags: ["Bebek yüzme", "Kapsamlı rehber", "Güvenli bağ", "32°C su sıcaklığı", "Baskısız eğitim"],
    content: {
      introduction: "Bebekler için suya alıştırma, oyun ve karşılıklı güvene dayalı neşeli bir aile deneyimidir. Geleneksel bir yüzme dersi değildir: bebekler teknik stilleri öğrenmek için değil, duyusal bir dünya keşfetmek ve sıcak suda kendi dengelerini bulmak için oradadırlar.",
      sections: [
        {
          title: "1. Sağlık Koşulları ve Başlangıç",
          paragraphs: [
            "• Başlangıç Yaşı: İlk temel aşıların ardından (2 ve 4 ay) 4. aydan itibaren 3 yaşına kadar.",
            "• Doktor Onayı: Çocuk doktorundan suya girmesinde sakınca olmadığına dair onay alınması önerilir.",
            "• Ateş veya enfeksiyon durumunda seans bir sonraki haftaya ertelenmelidir."
          ]
        },
        {
          title: "2. Pratik Hazırlık ve Seans Düzeni",
          paragraphs: [
            "• Beslenme: Dersten önceki 1 saat içinde ağır mama veya yemek verilmemelidir.",
            "• Sabunlu Duş: Havuz öncesi sabunlu duş, kloraminleri azaltarak bebeğin hassas solunum yollarını korur.",
            "• Su Sıcaklığı: 31°C - 33°C (ideal olarak 32°C) olmalıdır.",
            "• Seans Süresi: 4-18 aylık bebekler için maksimum 20-30 dakikadır."
          ]
        },
        {
          title: "3. Duygusal Güvenlik ve Bağ Kurma",
          paragraphs: [
            "Anne babanın kollarında bebek güven hisseder ve yetişkinin sakinliğini aynalar.",
            "Kendi rahatlığınız bulaşıcıdır: omuzlarınızı suya daldırıp gülümsediğinizde bebeğiniz hemen rahatlar."
          ]
        }
      ],
      takeaways: [
        "4. aydan itibaren 32°C sıcaklıktaki suda başlayın.",
        "20-30 dakikalık kısa ve keyifli seanslar yapın.",
        "Suyun kaldırma kuvveti psikomotor gelişimi hızlandırır.",
        "Önce suyu sevmeyi öğrenir, ardından yüzmeyi keşfeder!"
      ],
      sources: [
        "Çocuk Sağlığı ve Yüzme Federasyonu İlkeleri"
      ]
    }
  },
  {
    id: 'when-to-start-pool-choice',
    image: "/media/articles/securisation-soutiens.webp",
    imageCaption: "32°C sıcak havuzda ilk dersin huzuru.",
    slug: 'bebek-ne-zaman-havuza-gider-su-sicakligi-ilk-ders',
    title: "Bebek Ne Zaman Havuza Girmeli & Su Sıcaklığı? 1. Ders Rehberi",
    category: 'parenting',
    categoryLabel: "Ebeveyn Rehberi & İlk Ders",
    readingTime: "5 dk",
    icon: "🏊",
    badge: "Pratik Rehber & Isı Konforu",
    summary: "İdeal yaş, kavrama becerisi, 32°C su, 20-30 dk süre, üşüme belirtileri ve eğitmenin suda olduğu doğru havuz seçimi.",
    featured: true,
    publishedDate: "2026-08-16",
    author: "Baby Swim Vision Ekibi",
    tags: ["İlk ders", "Bebek yaşı", "32°C su", "Seans süresi", "Üşüme işaretleri"],
    content: {
      introduction: "Bebekler yetişkinlere göre 4 kat daha hızlı ısı kaybeder. Bu nedenle 32°C su sıcaklığı ve doğru süre hayati önem taşır.",
      sections: [
        {
          title: "1. Kaç Aylıkken Başlanmalı?",
          paragraphs: [
            "• 4. aydan itibaren: Aşıların ardından başlanabilir.",
            "• Gelişimsel işaret: 4-6 aylarda yüzen oyuncakları bilinçli olarak yakalamaya başlaması."
          ]
        },
        {
          title: "2. Su Sıcaklığı ve Üşüme Belirtileri",
          paragraphs: [
            "• Sıcaklık: 32°C olmalıdır. Bebeğin omuzlarını suyun içinde tutun.",
            "• Üşüme belirtileri (derhal sudan çıkın): Dudaklarda morarma, titreme veya solgunluk.",
            "• Sudan çıkınca hemen sıcak kapüşonlu havluya sarın ve besleyin."
          ],
          warning: "30 dakika üst sınırdır: İlk üşüme veya yorulma işaretinde sudan çıkın."
        }
      ],
      takeaways: [
        "32°C su sıcaklığı ve 20-30 dakikalık süre.",
        "Omuzlar daima suyun altında tutulmalıdır.",
        "Çıkışta sıcak havlu ve mama hazır olmalıdır."
      ],
      sources: ["Pediatri Termoregülasyon Kılavuzları"]
    }
  },
  {
    id: 'first-immersion-milestone',
    image: "/media/articles/premiere-immersion-7-secondes.webp",
    imageCaption: "Göz teması ve güven içinde nazik ilk dalış.",
    slug: 'ilk-dalis-adim-adim-7-saniye-rehberi',
    title: "İlk Suya Dalış: 7 Saniyelik Adım Adım Tam Protokol",
    category: 'psychomotor',
    categoryLabel: "Su Güveni & Dalış",
    readingTime: "6 dk",
    icon: "💧",
    badge: "Önemli Kilometre Taşı & 7sn Protokolü",
    summary: "7 saniyelik hazırlık ritüelinden ense-pelvis tutuşuna ve su yutmayı sakin karşılamaya kadar eksiksiz dalış rehberi.",
    featured: true,
    publishedDate: "2026-08-16",
    author: "Baby Swim Vision Pedagoji Ekibi",
    tags: ["İlk dalış", "Adım adım", "7sn Ritüel", "Su altı", "Arşimet", "Güven"],
    goldenRule: "Tereddüt etmeden yumuşak ve akıcı dalış. Baş ve omurga hizalı, suyun kaldırma kuvvetiyle yukarı çıkış.",
    timelineSteps: [
      { second: "0s", title: "Başlangıç Pozisyonu", action: "Dik tutuş & göz teması", iconType: "surface", detail: "Omuzlar su altında, yüz yüze duruş.", depthLevel: "surface" },
      { second: "1s", title: "İşaret Sinyali", action: "Sözlü uyarı veya hafif üfleme", iconType: "prepare", detail: "« 1, 2, 3… dalıyoruz! » sinyali dalış refleksini tetikler.", depthLevel: "surface" },
      { second: "2s", title: "Suya Giriş", action: "Akıcı ortak iniş", iconType: "entry", detail: "Baş-omurga ekseni düz tutularak suya iniş.", depthLevel: "transition" },
      { second: "3s", title: "Su Altı Geçişi", action: "1-2 saniye su altında kalış", iconType: "submerged", detail: "Apne refleksi hava yollarını korur.", depthLevel: "underwater" },
      { second: "4s", title: "Akıcı Kavis", action: "Sarsıntısız hareket", iconType: "deep", detail: "Su altında yumuşak kavisli hareket.", depthLevel: "underwater" },
      { second: "5s", title: "Kaldırma Kuvveti", action: "Doğal yükseliş", iconType: "stable", detail: "Suyun kaldırma kuvveti bebeği yüzeye iter.", depthLevel: "underwater" },
      { second: "6s", title: "Yüzeye Çıkış", action: "Gülümseyerek çıkış", iconType: "ascend", detail: "Baş suyun üzerine çıkar ve ebeveyn gülümser.", depthLevel: "transition" },
      { second: "7s", title: "Kucaklaşma & Tebrik", action: "Sarılma ve övgü", iconType: "exit", detail: "Göğse sarılma ve başarıyı kutlama.", depthLevel: "surface" }
    ],
    content: {
      introduction: "Başarılı bir ilk dalış ani hareketlerle değil, güven, iki elle ergonomik tutuş, 7 saniye kuralı ve suyun kaldırma kuvvetiyle gerçekleşir.",
      sections: [
        {
          title: "Doğru Tutuş ve Zamanlama",
          paragraphs: [
            "İlk dalış genellikle ortama alışılan 2. derste denenir.",
            "Bir el ense ve baş tabanını, diğer el kalçayı destekler. Baş ve omurga daima düz tutulmalıdır."
          ]
        },
        {
          title: "Su Yutmayı Doğal Karşılamak",
          paragraphs: [
            "Bebekler su altında nefes almaz. Yanlışlıkla birkaç damla yutarsa gülümseyip sakinliğinizi koruyun.",
            "Hafifçe öksürmek doğal bir korunma refleksidir.",
            "Dalış asla zorla yaptırılmamalı, oyun havasında sunulmalıdır."
          ],
          warning: "Asla bebeği dalmaya zorlamayın: İstek daima bebekten gelmelidir."
        }
      ],
      takeaways: [
        "7 saniyelik akıcı iniş dalış refleksini devreye sokar.",
        "Ense-pelvis tutuşu hava yolunu korur.",
        "Kaldırma kuvveti yumuşakça yüzeye çıkmayı sağlar.",
        "Dalış daima güvenli ve neşeli olmalıdır."
      ],
      sources: ["Bebek Yüzme Güvenlik Standartları"]
    }
  },
  {
    id: 'not-a-swimming-lesson-7-commandments',
    image: "/media/articles/seance-bebe-nageur-pas-cours-natation.webp?v=2",
    imageCaption: "Serbest oyun, sünger makarnalar ve doğal reflekslere saygı.",
    slug: 'bebek-yuzme-ders-degildir-7-emir-refleksler',
    title: "Bebek Yüzme: Ders Değildir, 7 Altın Kural & Refleks Gerçekleri",
    category: 'psychomotor',
    categoryLabel: "Pedagoji, Refleksler & 7 Kural",
    readingTime: "6 dk",
    icon: "🙅",
    badge: "Pedagoji & Bilimsel Gerçekler",
    summary: "Kronometre ve zorlama yok: Su oyununun 4 temeli, 7 kural, 0-3 yaş gelişimi ve refleksler hakkında bilimsel gerçekler.",
    featured: false,
    publishedDate: "2026-08-16",
    author: "Baby Swim Vision Ekibi",
    tags: ["Ders değil", "7 altın kural", "Dalış refleksi", "Yüzme refleksi", "3 yaş özerklik"],
    content: {
      introduction: "Burada yarış yok: tek hedef bebeğinizin kendi hızında psikomotor gelişimidir. İlkel refleksler can yeleği değildir ve bebeğin yüzme bildiği anlamına gelmez.",
      sections: [
        {
          title: "1. Sudaki 7 Altın Kural",
          paragraphs: [
            "1. Serbest oyun ve eğlenceyi ön planda tutun.",
            "2. Sert kolluklar yerine esnek sünger makarnaları tercih edin.",
            "3. Ani sürprizlerden ve zorla daldırmaktan kaçının.",
            "4. Su yutarsa sakinliğinizi koruyun.",
            "5. Bebeğin onayına ve hazır oluşuna saygı gösterin.",
            "6. Gözünüzü bir saniye bile ayırmayın (kol mesafesinde < 1m).",
            "7. Suda yönünü şaşırıp dönmeye başlarsa hemen dik konuma getirin."
          ],
          warning: "Bebek suda kontrolsüzce dönmeye başlarsa hemen dik konuma getirin: Bu denge kaybı işaretidir."
        }
      ],
      takeaways: [
        "Bebek yüzme spor performansı değil, özgüven kazandırır.",
        "Refleksler 1 metre kol mesafesindeki gözetimin yerini tutamaz.",
        "7 kuralı uygulayın: oyun, esnek makarna, sıfır baskı ve sabır."
      ],
      sources: ["Pediatri Derneği Güvenlik İlkeleri"]
    }
  },
  {
    id: 'history-philosophy-baby-swimming',
    image: "/media/articles/histoire-mythes-philosophie-bebes-nageurs.webp",
    imageCaption: "Teknikten önce duygusal bağ: modern su pedagojisinin temeli.",
    slug: 'tarihce-mitler-bebek-yuzme-felsefesi',
    title: "Geçmişten Bugüne: Bebek Yüzmenin Tarihçesi, Mitler ve Gerçek Felsefesi",
    category: 'physiology',
    categoryLabel: "Tarihçe & Modern Felsefe",
    readingTime: "5 dk",
    icon: "📚",
    badge: "Tarihçe & Felsefe",
    summary: "50'lerin hayatta kalma metotlarından Azémar'ın psikomotor devrimine: tarihçe, 3 motor kazanım ve bağlanma bağı.",
    featured: false,
    publishedDate: "2026-08-16",
    author: "Baby Swim Vision Ekibi",
    tags: ["Tarihçe", "Felsefe", "Azémar Metodu", "Bağlanma", "3 Kazanım"],
    content: {
      introduction: "50-70'li yıllarda bebek yüzme hayatta kalma veya şampiyon yetiştirme amacıyla yapılıyordu. Bu yaklaşımlar tamamen terk edilmiştir. Bugün sevgi dolu bağ ve serbest hareket ön plandadır.",
      sections: [
        {
          title: "1. Tarihsel Gelişim",
          paragraphs: [
            "• 50'ler: Hayatta kalma odaklı zorlamalı dalışlar (artık tamamen yasak).",
            "• 70'ler: Erken teknik eğitim denemeleri.",
            "• 80'lerden bugüne: Psikomotor devrim, oyun ve güvenli bağlanma."
          ]
        },
        {
          title: "2. Sudaki 3 Büyük Motor Kazanım",
          paragraphs: [
            "• Dik durma (5-6 aydan itibaren): 3 boyutlu su ortamında oturma ve ayakta durma dengesi.",
            "• Yön bulma: Başını ve bakışlarını yönlendirme.",
            "• İlerleme: Ebeveynine veya minderlere doğru ayak çırpma."
          ]
        }
      ],
      takeaways: [
        "Modern pedagoji baskıyı reddeder ve ebeveyn-bebek bağını merkeze alır.",
        "3 kazanımı destekler: dikleşme, yönlenme ve ilerleme."
      ],
      sources: ["Erken Çocukluk Psikomotor Gelişimi"]
    }
  },
  {
    id: 'dry-drowning',
    image: "/media/articles/noyade-seche-vrai-ou-faux.webp",
    imageCaption: "Tıbbi gerçekler ve kesintisiz aktif gözetim.",
    slug: 'kuru-bogulma-mitler-ve-tibbi-gercekler',
    title: "« Kuru Boğulma »: Sosyal Medya Mitleri ve Tıbbi Gerçekler",
    category: 'safety',
    categoryLabel: "Önlem & Tıbbi Gerçekler",
    readingTime: "4 dk",
    icon: "💧",
    badge: "Temel Bilgi & Önlem",
    summary: "Sosyal medyada sıkça bahsedilen 'kuru boğulma' efsanesine dair bilimsel gerçekler ve su yutma durumu.",
    featured: true,
    publishedDate: "2026-08-10",
    author: "Baby Swim Vision Sağlık Kurulu",
    tags: ["Kuru boğulma", "Güvenlik", "Su yutma", "İlk yardım", "Önlem"],
    content: {
      introduction: "Sosyal medyada yayılan « kuru boğulma » (birkaç gün sonra belirtisiz ani ölüm) tıbbi olarak bir mittir.",
      sections: [
        {
          title: "Anatomi: Bebeklerde Gırtlak Konumu",
          paragraphs: [
            "Yaklaşık 6 aya kadar gırtlak boyunda yüksek konumdadır ve yutma sırasında hava yollarını refleks olarak korur.",
            "Sonrasında 4 yaşına kadar kademeli olarak normal yetişkin konumuna iner."
          ]
        },
        {
          title: "Gerçek Takip Edilmesi Gereken Belirtiler",
          paragraphs: [
            "Su yutunca kısa öksürük normaldir.",
            "Ancak sürekli öksürük, nefes darlığı, halsizlik veya dudaklarda morarma olursa derhal doktora başvurulmalıdır."
          ]
        }
      ],
      takeaways: [
        "Belirtisiz geç boğulma bir mittir.",
        "İlk saatlerdeki gerçek solunum belirtilerini takip edin.",
        "1 metre mesafeden kesintisiz göz teması tek gerçek korumadır."
      ],
      sources: ["Pediatri Derneği", "Dünya Sağlık Örgütü (WHO)"]
    }
  },
  {
    id: 'active-supervision',
    image: "/media/articles/surveillance-active-securite-affective.webp",
    imageCaption: "Daima kol mesafesinde (< 1m) ve güven veren bakışlarla.",
    slug: 'aktif-gozetim-duygusal-guvenlik-kol-mesafesi-bakis',
    title: "Aktif Gözetim ve Duygusal Güvenlik: Kol Mesafesi Kuralı ve Bakışın Gücü",
    category: 'safety',
    categoryLabel: "Güvenlik & Duygusal Bağ",
    readingTime: "4 dk",
    icon: "🛡️",
    badge: "Altın Kural & Şefkat",
    summary: "Küçük bir çocuk saniyeler içinde sessizce su altına inebilir: Kol mesafesi kuralı, simitlerin tuzakları ve bakışınızın gücü.",
    featured: false,
    publishedDate: "2026-08-15",
    author: "Baby Swim Vision Ekibi",
    tags: ["Aktif gözetim", "Kol mesafesi", "Duygusal güvenlik", "Bakışın gücü"],
    content: {
      introduction: "Sudaki güvenlik iki sütuna dayanır: Sürekli fiziksel yakınlık (< 1 metre) ve güven veren sakin ebeveyn varlığı.",
      sections: [
        {
          title: "Hayati Kol Mesafesi Kuralı (< 1 Metre)",
          paragraphs: [
            "3 yaşından küçük çocuklarda yetişkin daima suyun içinde ve kol mesafesinde (< 1 metre) bulunmalıdır.",
            "Gözünüzü bir an bile telefona veya havluya çevirmeyin.",
            "Gözetim sorumlusunu daima netleştirin."
          ]
        },
        {
          title: "Simit ve Kollukların Yanıltıcı Güvenliği",
          paragraphs: [
            "Simit ve kolluklar yardım amaçlıdır, ebeveynin yerini asla tutamaz.",
            "Bir simit saniyeler içinde devrilebilir ve bebek tek başına doğrulamaz."
          ],
          warning: "Hiçbir yüzme yardımcısı ebeveynin su içindeki aktif gözetiminin yerini alamaz."
        }
      ],
      takeaways: [
        "Kol mesafesinde gözetim (< 1m) tek güvenli yoldur.",
        "Yüzme yardımcıları ebeveynin yerini tutmaz.",
        "Sakin bakışınız bebeğin en büyük can yeleğidir."
      ],
      sources: ["Boğulmayı Önleme Ulusal Kılavuzu"]
    }
  }
];
