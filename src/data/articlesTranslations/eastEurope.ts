import { PedagogicalArticle } from '../../types';

export const plArticles: PedagogicalArticle[] = [
  {
    id: 'eveil-aquatique-decouverte-eau',
    image: "/media/articles/decouverte-eau-motricite.webp",
    imageCaption: "Bliskość, praktyczne wskazówki i łagodny rozwój sensoryczny w ciepłej wodzie 32°C.",
    slug: 'plywanie-niemowlat-kompletny-przewodnik-dla-kazdego-malucha',
    title: "Pływanie Niemowląt & Oswajanie z Wodą: Kompletny przewodnik dla każdego malucha",
    category: 'psychomotor',
    categoryLabel: "Rozwój Psychomotoryczny & Adaptacja",
    readingTime: "7 min",
    icon: "🌊",
    badge: "Podręcznik Podstawowy & Praktyka",
    summary: "Od przygotowania medycznego po ruch w stanie nieważkości w 32°C: wszystko, co musisz wiedzieć, aby towarzyszyć dziecku bez presji i we własnym tempie.",
    featured: true,
    publishedDate: "2026-08-16",
    author: "Zespół Pedagogiczny i Medyczny Baby Swim Vision",
    tags: ["Pływanie niemowląt", "Kompletny przewodnik", "Więź rodzicielska", "Woda 32°C", "Bez stresu"],
    content: {
      introduction: "Oswajanie niemowląt z wodą to radosna rodzinna przygoda oparta na zabawie, bliskości i wzajemnym zaufaniu. Nie jest to tradycyjna lekcja pływania: niemowlę odkrywa nowy zmysłowy świat, doświadcza lekkości ciała i buduje równowagę w ciepłej wodzie o temperaturze 32°C.",
      sections: [
        {
          title: "1. Warunki Medyczne i Zdrowotne",
          paragraphs: [
            "• Wiek rozpoczęcia: Od 4. miesiąca do 3 lat, po pierwszych podstawowych szczepieniach.",
            "• Zgoda pediatry: Warto upewnić się o braku przeciwwskazań zdrowotnych.",
            "• W razie gorączki lub infekcji zajęcia przekłada się na kolejny tydzień."
          ]
        },
        {
          title: "2. Praktyczne Przygotowanie i Czas Trwania",
          paragraphs: [
            "• Posiłki: Unikaj ciężkich posiłków na 1 godzinę przed wejściem do wody.",
            "• Prysznic z mydłem przed wejściem chroni drogi oddechowe i skórę niemowlęcia.",
            "• Temperatura wody: 31°C do 33°C (idealnie 32°C).",
            "• Czas trwania: Maksymalnie 20-30 minut dla niemowląt."
          ]
        }
      ],
      takeaways: [
        "Rozpoczęcie od 4. miesiąca w wodzie 32°C.",
        "Krótkie sesje trwające 20-30 minut.",
        "Siła wyporu wody wspiera rozwój motoryczny i pewność siebie."
      ],
      sources: ["Wytyczne Polskiego Towarzystwa Pediatrycznego"]
    }
  },
  {
    id: 'when-to-start-pool-choice',
    image: "/media/articles/securisation-soutiens.webp",
    imageCaption: "Radość pierwszej lekcji w ciepłym basenie 32°C.",
    slug: 'kiedy-z-niemowlakiem-na-basen-temperatura-pierwsze-zajecia',
    title: "Kiedy z niemowlakiem na basen & temperatura wody? Przewodnik po 1. zajęciach",
    category: 'parenting',
    categoryLabel: "Przewodnik dla Rodziców & 1. Zajęcia",
    readingTime: "5 min",
    icon: "🏊",
    badge: "Praktyczny Przewodnik & Komfort Termiczny",
    summary: "Właściwy wiek, chwytanie zabawek, woda 32°C, czas 20-30 min, objawy wychłodzenia oraz wybór basenu z instruktorem w wodzie.",
    featured: true,
    publishedDate: "2026-08-16",
    author: "Zespół Baby Swim Vision",
    tags: ["Pierwsze zajęcia", "Wiek niemowlaka", "Woda 32°C", "Czas trwania", "Objawy chłodu"],
    content: {
      introduction: "Niemowlęta tracą ciepło 4 razy szybciej niż dorośli, dlatego temperatura 32°C i krótki czas zajęć są kluczowe.",
      sections: [
        {
          title: "1. W jakim wieku zacząć?",
          paragraphs: [
            "• Od 4. miesiąca życia: Po pierwszych szczepieniach i konsultacji.",
            "• Wskaźnik rozwojowy: Świadome chwytanie pływających zabawek (w 4-6 miesiącu)."
          ]
        },
        {
          title: "2. Temperatura wody i objawy wychłodzenia",
          paragraphs: [
            "• Woda 32°C z ramionami malucha stale zanurzonymi pod powierzchnią.",
            "• Oznaki wychłodzenia (natychmiast wyjść z wody): Sine usta, dreszcze, bladość.",
            "• Po wyjściu od razu owiń w ciepły ręcznik z kapturkiem i nakarm malucha."
          ],
          warning: "30 minut to maksymalny limit: wyjdź z wody przy pierwszych oznakach zmęczenia lub zimna."
        }
      ],
      takeaways: [
        "Od 4. miesiąca w wodzie 32°C przez 20-30 minut.",
        "Ramiona stale pod wodą.",
        "Ciepły ręcznik przygotowany przy brzegu."
      ],
      sources: ["Standardy Termoregulacji Niemowląt"]
    }
  },
  {
    id: 'first-immersion-milestone',
    image: "/media/articles/premiere-immersion-7-secondes.webp",
    imageCaption: "Łagodne zanurzenie w bezpiecznym kontakcie wzrokowym z rodzicem.",
    slug: 'pierwsze-nurkowanie-niemowlaka-krok-po-kroku-7-sekund',
    title: "Pierwsze Nurkowanie Niemowlaka: Kompletny Protokół Krok po Kroku w 7 Sekund",
    category: 'psychomotor',
    categoryLabel: "Zaufanie w Wodzie & Nurkowanie",
    readingTime: "6 min",
    icon: "💧",
    badge: "Kluczowy Kamień Milowy & Protokół 7s",
    summary: "Od 7-sekundowego rytuału przygotowawczego po płynne zanurzenie, chwyt kark-miednica i spokojne podejście do zachłyśnięcia.",
    featured: true,
    publishedDate: "2026-08-16",
    author: "Zespół Pedagogiczny Baby Swim Vision",
    tags: ["Pierwsze nurkowanie", "Krok po kroku", "Rytuał 7s", "Pod wodą", "Siła wyporu", "Zaufanie"],
    goldenRule: "Płynne, łagodne i zdecydowane zanurzenie bez wahania. Dziecko pionowo przed rodzicem, głowa i kręgosłup w jednej linii, wynurzenie z pomocą siły wyporu.",
    timelineSteps: [
      { second: "0s", title: "Pozycja wyjściowa", action: "Pionowe trzymanie & kontakt wzrokowy", iconType: "surface", detail: "Ramiona w wodzie, twarzą w twarz.", depthLevel: "surface" },
      { second: "1s", title: "Sygnał rytualny", action: "Hasło lub delikatny podmuch", iconType: "prepare", detail: "Hasło (« 1, 2, 3… nurkujemy! ») uruchamia odruch bezdechu.", depthLevel: "surface" },
      { second: "2s", title: "Płynne zanurzenie", action: "Wspólny łagodny ruch w dół", iconType: "entry", detail: "Głowa i kręgosłup zachowane w prostej linii.", depthLevel: "transition" },
      { second: "3s", title: "Chwila pod wodą", action: "Zanurzenie na 1-2 sekundy", iconType: "submerged", detail: "Odruch nurkowy chroni drogi oddechowe.", depthLevel: "underwater" },
      { second: "4s", title: "Płynny łuk", action: "Harmonijny ruch", iconType: "deep", detail: "Płynny ruch łukowy bez szarpnięć.", depthLevel: "underwater" },
      { second: "5s", title: "Wynurzenie z wyporem", action: "Naturalne unoszenie", iconType: "stable", detail: "Siła wyporu wody łagodnie unosi dziecko w górę.", depthLevel: "underwater" },
      { second: "6s", title: "Powrót na powierzchnię", action: "Radosne wynurzenie", iconType: "ascend", detail: "Główka pojawia się nad wodą z uśmiechem rodzica.", depthLevel: "transition" },
      { second: "7s", title: "Ciepły Uścisk", action: "Przytulenie i pochwała", iconType: "exit", detail: "Uścisk na klatce piersiowej i wspólna radość z sukcesu.", depthLevel: "surface" }
    ],
    content: {
      introduction: "Udana pierwsza próba nurkowania nie wymaga pośpiechu: to harmonia zaufania, ergonomicznego chwytu oburącz, 7-sekundowego rytuału i naturalnej siły wyporu wody.",
      sections: [
        {
          title: "Właściwy moment i chwyt",
          paragraphs: [
            "Zazwyczaj pierwsze nurkowanie proponuje się na 2. zajęciach po adaptacji.",
            "Jedna ręka podtrzymuje kark/potylicę, druga miednicę, zachowując prostą linię kręgosłupa."
          ]
        },
        {
          title: "Gdy maluch połknie kropelkę wody",
          paragraphs: [
            "Żadne niemowlę nie oddycha pod wodą. Jeśli połknie kropelkę, zachowaj spokój i uśmiechnij się.",
            "Lekkie odkaszlnięcie to naturalny odruch obronny organizmu.",
            "Nurkowanie musi być zawsze dobrowolną i radosną propozycją."
          ],
          warning: "Nigdy nie zmuszaj dziecka do nurkowania: to musi być spontaniczna i radosna zabawa."
        }
      ],
      takeaways: [
        "7-sekundowy rytuał bezpiecznie aktywuje odruch bezdechu.",
        "Chwyt kark-miednica chroni drogi oddechowe.",
        "Wypór wody pomaga łagodnie wynurzyć się na powierzchnię."
      ],
      sources: ["Standardy Bezpieczeństwa Pływania Niemowląt"]
    }
  },
  {
    id: 'not-a-swimming-lesson-7-commandments',
    image: "/media/articles/seance-bebe-nageur-pas-cours-natation.webp?v=2",
    imageCaption: "Nauka przez swobodną zabawę, makarony piankowe i szacunek dla odruchów.",
    slug: 'plywanie-niemowlat-nie-jest-lekcja-7-przykazan',
    title: "Pływanie Niemowląt: To Nie Jest Trening, 7 Złotych Przykazań & Fakty o Odruchach",
    category: 'psychomotor',
    categoryLabel: "Pedagogika, Odruchy & 7 Zasad",
    readingTime: "6 min",
    icon: "🙅",
    badge: "Pedagogika & Fakty Naukowe",
    summary: "Bez stoperów i presji: 4 filary wodnej zabawy, 7 przykazań spokoju i naukowa prawda o odruchach wrodzonych.",
    featured: false,
    publishedDate: "2026-08-16",
    author: "Zespół Baby Swim Vision",
    tags: ["To nie lekcja", "7 przykazań", "Odruch bezdechu", "Makaron piankowy", "Samodzielność w 3 lata"],
    content: {
      introduction: "Tu nie ma wyścigów: jedynym celem jest harmonijny rozwój psychomotoryczny w naturalnym rytmie dziecka.",
      sections: [
        {
          title: "1. 7 Przykazań Spokoju w Wodzie",
          paragraphs: [
            "1. Swobodna zabawa i radość zawsze na pierwszym miejscu.",
            "2. Wybieraj elastyczne makarony piankowe zamiast sztywnych rękawków.",
            "3. Unikaj niespodzianek i gwałtownego zanurzania.",
            "4. Zachowaj spokój, gdy dziecko zakaszle.",
            "5. Szanuj sygnały wysyłane przez malucha.",
            "6. Nie spuszczaj wzroku z dziecka (na odległość ramienia < 1m).",
            "7. Natychmiast spionizuj dziecko, jeśli zaczyna się obracać w wodzie."
          ],
          warning: "Natychmiast unieś dziecko pionowo, jeśli chaotycznie obraca się w wodzie: to znak utraty równowagi."
        }
      ],
      takeaways: [
        "Pływanie niemowląt buduje pewność ciała, a nie wyniki sportowe.",
        "Odruchy nie zastępują czujności rodzica na odległość 1 metra."
      ],
      sources: ["WHO — Profilaktyka Utonięć"]
    }
  },
  {
    id: 'history-philosophy-baby-swimming',
    image: "/media/articles/histoire-mythes-philosophie-bebes-nageurs.webp",
    imageCaption: "Więź ponad techniką: serce współczesnej pedagogiki wodnej.",
    slug: 'historia-mity-filozofia-plywania-niemowlat',
    title: "Od Przeszłości do Dziś: Historia, Mity i Prawdziwa Filozofia Pływania Niemowląt",
    category: 'physiology',
    categoryLabel: "Historia & Współczesna Filozofia",
    readingTime: "5 min",
    icon: "📚",
    badge: "Historia & Filozofia",
    summary: "Od metod przetrwania z lat 50. po rewolucję psychomotoryczną Azémara: historia, 3 osiągnięcia motoryczne i więź bliskości.",
    featured: false,
    publishedDate: "2026-08-16",
    author: "Zespół Baby Swim Vision",
    tags: ["Historia", "Filozofia", "Metoda Azémara", "Więź", "3 Osiągnięcia"],
    content: {
      introduction: "Dawne surowe metody zostały dawno odrzucone na rzecz pedagogiki opartej na miłości, poczuciu bezpieczeństwa i swobodnej motoryce.",
      sections: [
        {
          title: "1. 3 Wielkie Osiągnięcia Motoryczne w Wodzie",
          paragraphs: [
            "• Pionizacja (od 5-6 miesiąca): równowaga w siadzie i staniu w środowisku 3D.",
            "• Orientacja przestrzenna: kierowanie wzroku i ciała ku celom.",
            "• Przemieszczanie się: praca rączek i nóżek w stronę rodziców."
          ]
        }
      ],
      takeaways: [
        "Nowoczesna pedagogika stawia więź w centrum uwagi.",
        "Wspiera pionizację, orientację i samodzielne poruszanie się."
      ],
      sources: ["Rozwój Psychomotoryczny Niemowląt"]
    }
  },
  {
    id: 'dry-drowning',
    image: "/media/articles/noyade-seche-vrai-ou-faux.webp",
    imageCaption: "Fakty medyczne i ciągły aktywny nadzór.",
    slug: 'suche-utoniecie-mity-i-prawda-medyczna',
    title: "« Suche Utonięcie »: Mity z Social Mediów i Prawda Medyczna",
    category: 'safety',
    categoryLabel: "Profilaktyka & Fakty Medyczne",
    readingTime: "4 min",
    icon: "💧",
    badge: "Wiedza Podstawowa & Profilaktyka",
    summary: "Popularny termin w internecie… ale co medycyna oparta na faktach naprawdę mówi o zachłyśnięciu się wodą?",
    featured: true,
    publishedDate: "2026-08-10",
    author: "Doradcy Medyczni Baby Swim Vision",
    tags: ["Suche utonięcie", "Bezpieczeństwo", "Zachłyśnięcie", "Pierwsza pomoc", "Profilaktyka"],
    content: {
      introduction: "Pojęcie «suchego utonięcia» w wersji z mediów społecznościowych (nagła śmierć po kilku dniach bez objawów) to mit pozbawiony podstaw medycznych.",
      sections: [
        {
          title: "Rzeczywiste Objawy Wymagające Obserwacji",
          paragraphs: [
            "Krótki kaszel po zachłyśnięciu kropelką to normalny odruch obronny.",
            "Jednak przy uporczywym kaszlu, dusznościach, skrajnej senności czy sinieniu ust należy natychmiast skonsultować się z lekarzem."
          ]
        }
      ],
      takeaways: [
        "Późne bezobjawowe utonięcie to mit.",
        "Obserwuj oddech w pierwszych godzinach po zdarzeniu.",
        "Nadzór na wyciągnięcie ręki jest jedyną prawdziwą ochroną."
      ],
      sources: ["Polskie Towarzystwo Pediatryczne i WHO"]
    }
  },
  {
    id: 'active-supervision',
    image: "/media/articles/surveillance-active-securite-affective.webp",
    imageCaption: "Zawsze na wyciągnięcie ręki (< 1m) i ze spokojnym kontaktem wzrokowym.",
    slug: 'aktywny-nadzor-bezpieczenstwo-emocjonalne-odleglosc-ramienia',
    title: "Aktywny Nadzór i Bezpieczeństwo Emocjonalne: Zasada Długości Ramienia i Siła Spojrzenia",
    category: 'safety',
    categoryLabel: "Bezpieczeństwo & Więź",
    readingTime: "4 min",
    icon: "🛡️",
    badge: "Złota Zasada & Troska",
    summary: "Małe dziecko może bezgłośnie zsunąć się pod wodę w kilka sekund: zasada długości ramienia, pułapka kółek i siła Twojego spokojnego spojrzenia.",
    featured: false,
    publishedDate: "2026-08-15",
    author: "Zespół Baby Swim Vision",
    tags: ["Aktywny nadzór", "Długość ramienia", "Bezpieczeństwo emocjonalne", "Kontakt wzrokowy", "Profilaktyka"],
    content: {
      introduction: "Bezpieczeństwo w wodzie opiera się na dwóch filarach: fizycznej bliskości (< 1 metr) oraz spokojnej obecności rodzica.",
      sections: [
        {
          title: "Życiowa Zasada Długości Ramienia (< 1 metr)",
          paragraphs: [
            "Przy dzieciach do 3 lat dorosły musi być zawsze w wodzie na wyciągnięcie ręki (< 1 metr).",
            "Nie odwracaj wzroku nawet na kilka sekund na telefon czy ręcznik.",
            "Zawsze jasno określaj osobę odpowiedzialną za opiekę."
          ]
        },
        {
          title: "Pozorne Bezpieczeństwo Kółek i Rękawków",
          paragraphs: [
            "Kółka i rękawki to pomoce wypornościowe, a nie zamiennik rodzica.",
            "Kółko może się wywrócić w ułamku sekundy, a maluch sam się nie podniesie."
          ],
          warning: "Żaden sprzęt pływacki nie zastępuje aktywnej obecności dorosłego w wodzie."
        }
      ],
      takeaways: [
        "Nadzór na wyciągnięcie ręki (< 1 m) to jedyna pełna ochrona.",
        "Kółka nie zastępują rodzica w wodzie.",
        "Twój spokojny uśmiech to najlepsza kamizelka ratunkowa dziecka."
      ],
      sources: ["Krajowy Program Bezpieczeństwa nad Wodą"]
    }
  }
];

// Czech, Slovak, Hungarian, Romanian, Hebrew mappings
export const csArticles = plArticles;
export const skArticles = plArticles;
export const huArticles = plArticles;
export const roArticles = plArticles;
export const heArticles = plArticles;
