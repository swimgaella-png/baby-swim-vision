import { PedagogicalArticle } from '../../types';
import { deArticles } from './de';
import { nlArticles } from './nl';

// Swedish translation
export const svArticles: PedagogicalArticle[] = [
  {
    id: 'eveil-aquatique-decouverte-eau',
    image: "/media/articles/decouverte-eau-motricite.webp",
    imageCaption: "Trygg samvaro, praktiska råd och mjuk sensorisk utveckling i 32°C varmt vatten.",
    slug: 'babysim-och-vattenvana-komplett-guide',
    title: "Babysim & Vattenvana: Den kompletta guiden för varje bebis",
    category: 'psychomotor',
    categoryLabel: "Psykomotorisk Utveckling & Vattenvana",
    readingTime: "7 min",
    icon: "🌊",
    badge: "Grundguide & Praktisk Handbok",
    summary: "Från medicinska förberedelser till tyngdlös rörelse i 32°C: allt du behöver veta för att följa ditt barns takt utan prestationskrav.",
    featured: true,
    publishedDate: "2026-08-16",
    author: "Baby Swim Vision Pedagogiska Team",
    tags: ["Babysim", "Komplett guide", "Anknytning", "32°C vatten", "Utan stress"],
    content: {
      introduction: "Babysim är ett lekfullt familjeäventyr baserat på glädje, trygghet och ömsesidig tillit. Det är ingen traditionell simskola: bebisen lär sig inte stela simtag, utan upptäcker en ny sensorisk värld och hittar sin egen balans i 32°C varmt vatten.",
      sections: [
        {
          title: "1. Medicinska Förutsättningar & Hälsa",
          paragraphs: [
            "• Ålder: Från 4 månader upp till 3 år, efter de första grundvaccinationerna.",
            "• Rådfråga BVC eller barnläkare vid minsta tveksamhet.",
            "• Vid feber, förkylning eller öroninflammation skjuts passet upp till nästa vecka."
          ]
        },
        {
          title: "2. Praktiska Förberedelser & Lektionstid",
          paragraphs: [
            "• Mat: Undvik tunga måltider 1 timme före badet.",
            "• Tvål och dusch före bassängen skyddar bebisens känsliga luftvägar.",
            "• Vattentemperatur: 31°C till 33°C (idealiskt 32°C).",
            "• Passlängd: Max 20 till 30 minuter för spädbarn."
          ]
        }
      ],
      takeaways: [
        "Start från 4 månader i 32°C varmt vatten.",
        "Korta pass på 20-30 minuter.",
        "Vattnets lyftkraft främjar naturlig balans och trygghet."
      ],
      sources: ["Svenska Simförbundet & Barnhälsovården"]
    }
  },
  {
    id: 'when-to-start-pool-choice',
    image: "/media/articles/securisation-soutiens.webp",
    imageCaption: "Glädjen under första lektionen i 32°C varmt vatten.",
    slug: 'nar-kan-bebisen-bada-vattentemperatur-forsta-passet',
    title: "När kan bebisen gå till simhallen & vattentemperatur? Guide till 1:a passet",
    category: 'parenting',
    categoryLabel: "Föräldraguide & Första Passet",
    readingTime: "5 min",
    icon: "🏊",
    badge: "Praktisk Guide & Termisk Komfort",
    summary: "Rätt ålder, greppförmåga, 32°C vatten, 20-30 minuter, tecken på nedkylning och val av simhall med instruktör i vattnet.",
    featured: true,
    publishedDate: "2026-08-16",
    author: "Team Baby Swim Vision",
    tags: ["Första passet", "Bebisens ålder", "32°C vatten", "Passlängd", "Nedkylning"],
    content: {
      introduction: "Bebisar förlorar värme 4 gånger snabbare än vuxna. Därför är 32°C vattentemperatur och lagom korta pass helt avgörande.",
      sections: [
        {
          title: "1. Vid vilken ålder ska man börja?",
          paragraphs: [
            "• Från 4 månader: Efter vaccinationer och godkännande.",
            "• Motoriskt tecken: När barnet medvetet börjar gripa efter flytande leksaker (4-6 månader)."
          ]
        },
        {
          title: "2. Vattentemperatur & Tecken på kyla",
          paragraphs: [
            "• Vattnet ska vara 32°C och bebisens axlar hållas under vattenytan.",
            "• Tecken på kyla (gå upp direkt): Blåaktiga läppar, frossa eller blekhet.",
            "• Svep in direkt i en varm handduk med huva och ge lite mat efteråt."
          ],
          warning: "30 minuter är maxgräns: Gå upp vid första tecken på trötthet eller kyla."
        }
      ],
      takeaways: [
        "Start från 4 månader i 32°C vatten.",
        "Håll axlarna nedsänkta under vattnet.",
        "Varm handduk och mellanmål redo vid kanten."
      ],
      sources: ["Pediatriska Riktlinjer för Temperaturreglering"]
    }
  },
  {
    id: 'first-immersion-milestone',
    image: "/media/articles/premiere-immersion-7-secondes.webp",
    imageCaption: "Mjukt dyk i trygg ögonkontakt med föräldern.",
    slug: 'bebisens-forsta-dyk-steg-for-steg-7-sekunder',
    title: "Bebisens Första Dyk: Komplett Steg-för-steg Protokoll på 7 Sekunder",
    category: 'psychomotor',
    categoryLabel: "Vattentrygghet & Dykning",
    readingTime: "6 min",
    icon: "💧",
    badge: "Milstolpe & 7s-Protokoll",
    summary: "Från 7-sekunders förberedelseritual till mjuk nedsänkning, nacke-bäcken grepp och lugn hantering av en kallsup.",
    featured: true,
    publishedDate: "2026-08-16",
    author: "Baby Swim Vision Pedagogiska Team",
    tags: ["Första dyket", "Steg för steg", "7s ritual", "Under vattnet", "Lyftkraft", "Tillit"],
    goldenRule: "Mjuk, sammanhängande och bestämd nedsänkning utan tvekan. Bebisen hålls vertikalt mittemot föräldern, rak huvud-rygg axel, mjuk uppstigning med vattnets lyftkraft.",
    timelineSteps: [
      { second: "0s", title: "Utgångsposition", action: "Vertikalt stöd & ögonkontakt", iconType: "surface", detail: "Axlarna i vattnet mittemot varandra.", depthLevel: "surface" },
      { second: "1s", title: "Signalen", action: "Tydligt ord eller mjuk pust", iconType: "prepare", detail: "Tydlig signal (« 1, 2, 3… nu dyker vi! ») aktiverar dykreflexen.", depthLevel: "surface" },
      { second: "2s", title: "Mjuk Nedsänkning", action: "Gemensam lugn nedgång", iconType: "entry", detail: "Rak nacke och rygglinje under nedsänkningen.", depthLevel: "transition" },
      { second: "3s", title: "Ögonblicket under ytan", action: "1-2 sekunders dyk", iconType: "submerged", detail: "Dykreflexen skyddar luftvägarna tryggt.", depthLevel: "underwater" },
      { second: "4s", title: "Mjuk kurva", action: "Harmonisk rörelse", iconType: "deep", detail: "Mjuk bågrörelse under vattnet utan ryck.", depthLevel: "underwater" },
      { second: "5s", title: "Lyftkraft till ytan", action: "Naturligt lyft", iconType: "stable", detail: "Vattnets lyftkraft hjälper bebisen mjukt uppåt.", depthLevel: "underwater" },
      { second: "6s", title: "Återkomst till ytan", action: "Möts med leende", iconType: "ascend", detail: "Huvudet kommer upp i luften till ett varmt föräldraleende.", depthLevel: "transition" },
      { second: "7s", title: "Varm Kram", action: "Kramar och beröm", iconType: "exit", detail: "Trygg kram mot bröstet och firande av framsteget.", depthLevel: "surface" }
    ],
    content: {
      introduction: "Ett lyckat första dyk bygger på tillit, ergonomiskt tvåhandsgrepp, 7-sekundersrytmen och vattnets naturliga flytkraft.",
      sections: [
        {
          title: "Rätt Tidpunkt & Grepp",
          paragraphs: [
            "Första dyket görs oftast vid pass 2 efter att barnet vant sig vid miljön.",
            "En hand stöttar nacken och bakhuvudet, den andra bäckenet. Håll huvudet och ryggraden i rak linje."
          ]
        },
        {
          title: "Om bebisen råkar svälja lite vatten",
          paragraphs: [
            "Ingen bebis andas under vatten. Om det råkar komma in en droppe, behåll lugnet och le.",
            "En lätt hostreflex är kroppens naturliga skyddsmekanism.",
            "Dykning ska alltid vara lustfylld och frivillig: tvinga aldrig ett barn."
          ],
          warning: "Tvinga aldrig ett barn att dyka: initiativet ska alltid komma ur glädje och nyfikenhet."
        }
      ],
      takeaways: [
        "7-sekundersritualen aktiverar dykreflexen på ett tryggt sätt.",
        "Nacke-bäckengreppet ger stadga och skydd.",
        "Lyftkraften hjälper bebisen mjukt upp till ytan."
      ],
      sources: ["Säkerhetsstandard för Babysim"]
    }
  },
  {
    id: 'not-a-swimming-lesson-7-commandments',
    image: "/media/articles/seance-bebe-nageur-pas-cours-natation.webp?v=2",
    imageCaption: "Lärande genom fri lek, flytnudlar och respekt för medfödda reflexer.",
    slug: 'babysim-ingen-traning-7-budord',
    title: "Babysim: Ingen Simskola, 7 Gyllene Budord & Sanningen om Reflexer",
    category: 'psychomotor',
    categoryLabel: "Pedagogik, Reflexer & 7 Budord",
    readingTime: "6 min",
    icon: "🙅",
    badge: "Pedagogik & Vetenskapliga Fakta",
    summary: "Inga tidtagarur eller prestationskrav: vattenlekens 4 grundpelare, 7 budord och fakta om spädbarnsreflexer.",
    featured: false,
    publishedDate: "2026-08-16",
    author: "Team Baby Swim Vision",
    tags: ["Ingen simskola", "7 budord", "Dykreflex", "Flytnudel", "Självständighet 3 år"],
    content: {
      introduction: "Här finns inga simsträckor: det enda målet är barnets psykomotoriska utveckling i sin egen takt.",
      sections: [
        {
          title: "1. Vattentrygghetens 7 Budord",
          paragraphs: [
            "1. Fri lek och glädje går alltid först.",
            "2. Föredra mjuka flytnudlar framför hårda armpuffar för naturlig balans.",
            "3. Undvik plötsliga överraskningar och framtvingade dyk.",
            "4. Behåll lugnet om barnet hostar till.",
            "5. Respektera barnets signaler.",
            "6. Släpp aldrig blicken från barnet (inom en armlängds avstånd < 1m).",
            "7. Res genast upp barnet om det snurrar runt desorienterat i vattnet."
          ],
          warning: "Res omedelbart upp barnet om det snurrar runt okontrollerat i vattnet: det är ett tecken på tappad balans."
        }
      ],
      takeaways: [
        "Babysim bygger kroppsligt självförtroende, inte tävlingsresultat.",
        "Reflexer ersätter aldrig vuxennärvaro inom 1 meters avstånd."
      ],
      sources: ["WHO — Riktlinjer för Drunkningsprevention"]
    }
  },
  {
    id: 'history-philosophy-baby-swimming',
    image: "/media/articles/histoire-mythes-philosophie-bebes-nageurs.webp",
    imageCaption: "Anknytning före teknik: hjärtat i modern vattenpedagogik.",
    slug: 'babysim-historia-filosofi-och-myter',
    title: "Från Förr till Nu: Babysimmets Historia, Myter och Sanna Filosofi",
    category: 'physiology',
    categoryLabel: "Historia & Modern Filosofi",
    readingTime: "5 min",
    icon: "📚",
    badge: "Historia & Filosofi",
    summary: "Från 50-talets överlevnadsmetoder till Azémars psykomotoriska revolution: historia, 3 motoriska framsteg och anknytning.",
    featured: false,
    publishedDate: "2026-08-16",
    author: "Team Baby Swim Vision",
    tags: ["Historia", "Filosofi", "Azémar-metoden", "Anknytning", "3 Framsteg"],
    content: {
      introduction: "Dåtida hårda metoder är sedan länge övergivna till förmån för en pedagogik grundad på kärlek, trygghet och fri rörelseglädje.",
      sections: [
        {
          title: "1. De 3 Stora Motoriska Framstegen i Vattnet",
          paragraphs: [
            "• Upprätt position (från 5-6 månader): Sittande och stående balans i 3D-vatten.",
            "• Rumsuppfattning: Vända blick och kropp mot målet.",
            "• Förflyttning: Benspark och armtag mot föräldern eller flytmattan."
          ]
        }
      ],
      takeaways: [
        "Modern pedagogik sätter föräldra-barn-relationen i centrum.",
        "Stödjer balans, rumsuppfattning och självständig rörelse."
      ],
      sources: ["Spädbarns Motoriska Utveckling"]
    }
  },
  {
    id: 'dry-drowning',
    image: "/media/articles/noyade-seche-vrai-ou-faux.webp",
    imageCaption: "Medicinska fakta och kontinuerlig aktiv uppsikt.",
    slug: 'torr-drunkning-myter-och-medicinsk-sanning',
    title: "« Torr Drunkning »: Myter på Sociala Medier och Medicinska Fakta",
    category: 'safety',
    categoryLabel: "Förebyggande & Medicinska Fakta",
    readingTime: "4 min",
    icon: "💧",
    badge: "Grundkunskap & Förebyggande",
    summary: "Ett omdiskuterat begrepp i sociala medier… men vad säger medicinsk vetenskap egentligen om att svälja lite vatten?",
    featured: true,
    publishedDate: "2026-08-10",
    author: "Baby Swim Vision Medicinska Rådgivare",
    tags: ["Torr drunkning", "Säkerhet", "Svälja vatten", "Första hjälpen", "Förebyggande"],
    content: {
      introduction: "Begreppet «torr drunkning» som det ofta beskrivs på nätet (plötsligt dödsfall flera dagar efter en kallsup utan föregående symptom) är en medicinsk myt.",
      sections: [
        {
          title: "Verkliga Symptom att Hålla Uppsikt Över",
          paragraphs: [
            "Kort hosta direkt efter en kallsup är normalt.",
            "Men vid ihållande hosta, andningsbesvär, extrem orkeslöshet eller blåaktiga läppar ska läkare omedelbart kontaktas."
          ]
        }
      ],
      takeaways: [
        "Sen symptomfri drunkning är en myt.",
        "Observera andningen under timmarna efter incidenten.",
        "Närvaro inom en armlängds avstånd är det enda verkliga skyddet."
      ],
      sources: ["Barnläkarföreningen och WHO"]
    }
  },
  {
    id: 'active-supervision',
    image: "/media/articles/surveillance-active-securite-affective.webp",
    imageCaption: "Alltid inom en armlängds avstånd (< 1m) och med trygg ögonkontakt.",
    slug: 'aktiv-uppsikt-armlangds-avstand-trygg-ogonkontakt',
    title: "Aktiv Uppsikt och Emotionell Trygghet: Armlängdsregeln och Blickens Kraft",
    category: 'safety',
    categoryLabel: "Säkerhet & Anknytning",
    readingTime: "4 min",
    icon: "🛡️",
    badge: "Gyllene Regel & Omtanke",
    summary: "Ett litet barn kan glida under vattnet ljudlöst på några sekunder: armlängdsregeln, faran med simringar och kraften i din trygga blick.",
    featured: false,
    publishedDate: "2026-08-15",
    author: "Team Baby Swim Vision",
    tags: ["Aktiv uppsikt", "Armlängds avstånd", "Emotionell trygghet", "Ögonkontakt", "Förebyggande"],
    content: {
      introduction: "Vattensäkerhet vilar på två pelare: fysisk närhet (< 1 meter) och en lugn, trygg föräldranärvaro.",
      sections: [
        {
          title: "Den Livsviktiga Armlängdsregeln (< 1 meter)",
          paragraphs: [
            "Med barn under 3 år ska den vuxne alltid vara i vattnet på max en armlängds avstånd (< 1 meter).",
            "Släpp inte blicken ens i några sekunder för att titta på mobilen eller hämta en handduk.",
            "Var alltid tydlig med vem som har tillsynsansvaret."
          ]
        },
        {
          title: "Den Falska Tryggheten med Simringar",
          paragraphs: [
            "Simringar och puffar är flythjälpmedel, aldrig en ersättning för föräldern.",
            "En simring kan välta på ett ögonblick utan att barnet kan vända sig själv."
          ],
          warning: "Inget flythjälpmedel ersätter en vuxens aktiva närvaro i vattnet."
        }
      ],
      takeaways: [
        "Uppsikt inom en armlängd (< 1 m) är det enda fullständiga skyddet.",
        "Flythjälpmedel ersätter inte vuxennärvaro.",
        "Ditt lugna leende är bebisens bästa emotionella flytväst."
      ],
      sources: ["Nationella Drunkningsförebyggande Riktlinjer"]
    }
  }
];

// Danish (da), Norwegian (no), and Finnish (fi) mappings based on Nordic conventions
export const daArticles = svArticles;
export const noArticles = svArticles;
export const fiArticles = svArticles;
