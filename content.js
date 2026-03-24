/* ═══════════════════════════════════════════════════════════════
   CONTENT.JS — tarik yigit / veretrir.art
   ───────────────────────────────────────────────────────────────
   This is the ONLY file you need to edit.
   All artworks, poems, articles, projects, and site settings live here.
   Save the file and reload the browser — changes appear instantly.
═══════════════════════════════════════════════════════════════ */


/* ────────────────────────────────────────
   SITE SETTINGS
   ──────────────────────────────────────── */
const SITE = {
  name:       'tarik yigit',
  domain:     'veretrir.art',
  instagram:  'https://instagram.com/veretrir',
  email:      'hello@veretrir.art',

  about: {
    en: `Write your biography or artist statement here. Who you are, where you come from, what you make and why.

A second paragraph about your practice — the themes you return to, the tensions that drive your work.`,
    tr: `Biyografinizi buraya yazın. Kim olduğunuzu, nereden geldiğinizi, ne ürettiğinizi ve neden.

Pratiğiniz hakkında ikinci paragraf — döndüğünüz temalar, çalışmalarınızı yönlendiren gerilimler.`
  },

  contact: {
    en: 'Collaborations, exhibitions, publications.',
    tr: 'İşbirlikleri, sergiler, yayınlar.'
  }
};


/* ────────────────────────────────────────
   HERO SLIDESHOW
   ──────────────────────────────────────
   List image paths to show in the full-screen hero.
   Each entry is a path to an image file.

   Example:
     'images/hero/painting1.jpg'

   Leave as empty array [] to show placeholder boxes.
──────────────────────────────────────── */
const HERO_IMAGES = [
  /* 'images/hero/slide1.jpg', */
  /* 'images/hero/slide2.jpg', */
  /* 'images/hero/slide3.jpg', */
];


/* ────────────────────────────────────────
   ARTWORKS
   ──────────────────────────────────────
   To add a new artwork:
     1. Copy one block (from { to the matching }),
     2. Paste it at the top of the list (after the opening [)
     3. Change the fields
     4. Save the file

   IMAGES:
     - mainImage: main large image shown at top of detail page
       Example: 'images/artworks/artwork1/main.jpg'
     - images: additional photos shown below (can be empty [])
       Example: ['images/artworks/artwork1/detail1.jpg', 'images/artworks/artwork1/detail2.jpg']
──────────────────────────────────────── */
const ARTWORKS = [
  {
    title:    { en: 'Untitled I',    tr: 'İsimsiz I'    },
    year:     '2024',
    medium:   { en: 'Mixed Media',  tr: 'Karma Teknik'  },
    desc:     { en: 'Add a description of this artwork — the process, the intent, the materials, the context.',
                tr: 'Bu eserle ilgili açıklama ekleyin — süreç, niyet, malzeme, bağlam.' },
    mainImage: '',   /* e.g. 'images/artworks/artwork1/main.jpg' */
    images:    [],   /* e.g. ['images/artworks/artwork1/detail1.jpg'] */
  },
  {
    title:    { en: 'Untitled II',   tr: 'İsimsiz II'   },
    year:     '2024',
    medium:   { en: 'Digital',       tr: 'Dijital'       },
    desc:     { en: 'Add a description of this artwork.',
                tr: 'Bu eserle ilgili açıklama ekleyin.' },
    mainImage: '',
    images:    [],
  },
  {
    title:    { en: 'Untitled III',  tr: 'İsimsiz III'  },
    year:     '2023',
    medium:   { en: 'Print',         tr: 'Baskı'         },
    desc:     { en: 'Add a description of this artwork.',
                tr: 'Bu eserle ilgili açıklama ekleyin.' },
    mainImage: '',
    images:    [],
  },
  {
    title:    { en: 'Untitled IV',   tr: 'İsimsiz IV'   },
    year:     '2023',
    medium:   { en: 'Oil on Canvas', tr: 'Tuval Üzerine Yağlıboya' },
    desc:     { en: 'Add a description of this artwork.',
                tr: 'Bu eserle ilgili açıklama ekleyin.' },
    mainImage: '',
    images:    [],
  },
];


/* ────────────────────────────────────────
   PROJECTS (Ongoing & Planned)
   ──────────────────────────────────────
   status: 'ongoing'  →  shows red "Ongoing" tag
   status: 'planned'  →  shows grey "Planned" tag
──────────────────────────────────────── */
const PROJECTS = [
  {
    title:  { en: 'Project Title One',   tr: 'Proje Bir'  },
    desc:   { en: 'A short description.', tr: 'Kısa açıklama.' },
    status: 'ongoing',
  },
  {
    title:  { en: 'Project Title Two',   tr: 'Proje İki'  },
    desc:   { en: 'A short description.', tr: 'Kısa açıklama.' },
    status: 'planned',
  },
  {
    title:  { en: 'Project Title Three', tr: 'Proje Üç'   },
    desc:   { en: 'A short description.', tr: 'Kısa açıklama.' },
    status: 'ongoing',
  },
];


/* ────────────────────────────────────────
   POEMS
   ──────────────────────────────────────
   Line breaks in the poem are preserved automatically.
   Use a blank line between stanzas.
──────────────────────────────────────── */
const POEMS = [
  {
    title: { en: 'Poem Title One', tr: 'Şiir Başlık Bir' },
    year:  '2024',
    body: {
      en: `Add your full poem text here.
Each line break is preserved.
This is where your verses go.`,
      tr: `Şiir metninizi buraya ekleyin.
Her satır sonu korunur.
Dizeleriniz burada yer alacak.`
    }
  },
  {
    title: { en: 'Poem Title Two', tr: 'Şiir Başlık İki' },
    year:  '2024',
    body: {
      en: `Second poem goes here.
Add as many lines as you like.`,
      tr: `İkinci şiir buraya gelir.
İstediğiniz kadar satır ekleyebilirsiniz.`
    }
  },
  {
    title: { en: 'Poem Title Three', tr: 'Şiir Başlık Üç' },
    year:  '2023',
    body: {
      en: `Third poem goes here.`,
      tr: `Üçüncü şiir buraya gelir.`
    }
  },
];


/* ────────────────────────────────────────
   ARTICLES
   ──────────────────────────────────────
   type examples: 'Essay', 'Criticism', 'Review', 'Interview'
   Blank lines between paragraphs are preserved.
──────────────────────────────────────── */
const ARTICLES = [
  {
    title: { en: 'Article Title One', tr: 'Makale Başlık Bir' },
    year:  '2024',
    type:  { en: 'Essay',    tr: 'Deneme'   },
    body: {
      en: `Add your full article text here. This is the body of the essay — you can write as much as you need.

A second paragraph of the article continues here.`,
      tr: `Makale metninizi buraya ekleyin. Bu, denemenin gövdesidir.

Makalenin ikinci paragrafı burada devam eder.`
    }
  },
  {
    title: { en: 'Article Title Two', tr: 'Makale Başlık İki' },
    year:  '2023',
    type:  { en: 'Criticism', tr: 'Eleştiri' },
    body: {
      en: `Second article body goes here.`,
      tr: `İkinci makale metni buraya gelir.`
    }
  },
  {
    title: { en: 'Article Title Three', tr: 'Makale Başlık Üç' },
    year:  '2023',
    type:  { en: 'Essay',    tr: 'Deneme'   },
    body: {
      en: `Third article body goes here.`,
      tr: `Üçüncü makale metni buraya gelir.`
    }
  },
];
