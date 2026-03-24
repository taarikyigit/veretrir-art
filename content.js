/* ═══════════════════════════════════════════════════════════════════
   CONTENT.JS — tarik yigit / veretrir.art
   ───────────────────────────────────────────────────────────────────
   THE ONLY FILE YOU NEED TO EDIT.
   Save and reload the browser — changes appear instantly.
═══════════════════════════════════════════════════════════════════ */


/* ─────────────────────────────────────────
   SITE SETTINGS
───────────────────────────────────────── */
const SITE = {
  name:       'tarik yigit',
  domain:     'veretrir.art',
  instagram:  'https://instagram.com/veretrir',
  email:      'hello@veretrir.art',

  about: {
    en: `Write your biography or artist statement here. Who you are, where you come from, what you make and why.

A second paragraph about your practice — the themes you return to, the tensions that drive your work.

A third paragraph if needed.`,
    tr: `Biyografinizi veya sanatçı beyanınızı buraya yazın. Kim olduğunuzu, nereden geldiğinizi, ne ürettiğinizi ve neden.

Pratiğiniz hakkında ikinci paragraf — döndüğünüz temalar, çalışmalarınızı yönlendiren gerilimler.

Gerekirse üçüncü paragraf.`
  },

  contact: {
    note: {
      en: 'Collaborations, exhibitions, publications.',
      tr: 'İşbirlikleri, sergiler, yayınlar.'
    }
  }
};


/* ─────────────────────────────────────────
   HERO IMAGES (home page slideshow)
   Leave empty [] for dark placeholder slides.
───────────────────────────────────────── */
const HERO_IMAGES = [
  /* 'images/hero/slide1.jpg', */
  /* 'images/hero/slide2.jpg', */
];


/* ─────────────────────────────────────────
   ARTWORKS
   ─────────────────────────────────────
   type options:
     'sculpture' | 'installation' | 'drawing' |
     'painting'  | 'print'        | 'photography' |
     'video'     | 'digital'      | 'mixed'
───────────────────────────────────────── */
const ARTWORKS = [
  {
    id:         'untitled-1',
    title:      { en: 'Untitled I',    tr: 'İsimsiz I'    },
    year:       2024,
    type:       'sculpture',
    medium:     { en: 'Mixed media',   tr: 'Karma teknik'  },
    dimensions: '42 × 28 × 15 cm',
    series:     'stain',
    mainImage:  '',
    images:     [],
    model3d:    '',
    description: {
      en: 'Add a description of this artwork — the process, the intent, the materials, the context.',
      tr: 'Bu eserle ilgili açıklama ekleyin — süreç, niyet, malzeme, bağlam.'
    }
  },
  {
    id:         'untitled-2',
    title:      { en: 'Untitled II',   tr: 'İsimsiz II'   },
    year:       2024,
    type:       'installation',
    medium:     { en: 'Steel, fabric', tr: 'Çelik, kumaş' },
    dimensions: '200 × 300 × 80 cm',
    series:     'stain',
    mainImage:  '',
    images:     [],
    model3d:    '',
    description: {
      en: 'Add a description of this artwork.',
      tr: 'Bu eserle ilgili açıklama ekleyin.'
    }
  },
  {
    id:         'untitled-3',
    title:      { en: 'Untitled III',  tr: 'İsimsiz III'  },
    year:       2023,
    type:       'drawing',
    medium:     { en: 'Ink on paper',  tr: 'Kağıt üzerine mürekkep' },
    dimensions: '30 × 40 cm',
    series:     '',
    mainImage:  '',
    images:     [],
    model3d:    '',
    description: {
      en: 'Add a description of this artwork.',
      tr: 'Bu eserle ilgili açıklama ekleyin.'
    }
  },
  {
    id:         'untitled-4',
    title:      { en: 'Untitled IV',   tr: 'İsimsiz IV'   },
    year:       2023,
    type:       'painting',
    medium:     { en: 'Oil on canvas', tr: 'Tuval üzerine yağlıboya' },
    dimensions: '100 × 120 cm',
    series:     'field',
    mainImage:  '',
    images:     [],
    model3d:    '',
    description: {
      en: 'Add a description of this artwork.',
      tr: 'Bu eserle ilgili açıklama ekleyin.'
    }
  },
  {
    id:         'untitled-5',
    title:      { en: 'Untitled V',    tr: 'İsimsiz V'    },
    year:       2022,
    type:       'print',
    medium:     { en: 'Silkscreen',    tr: 'Serigrafi'    },
    dimensions: '50 × 70 cm',
    series:     'field',
    mainImage:  '',
    images:     [],
    model3d:    '',
    description: {
      en: 'Add a description of this artwork.',
      tr: 'Bu eserle ilgili açıklama ekleyin.'
    }
  },
];


/* ─────────────────────────────────────────
   WRITINGS — three categories
───────────────────────────────────────── */
const WRITINGS = {

  poems: [
    {
      id:    'poem-1',
      title: { en: 'Poem Title One', tr: 'Şiir Başlık Bir' },
      year:  2024,
      body: {
        en: `Add your full poem text here.
Each line break is preserved exactly.
This is where your verses go.

A new stanza begins after a blank line.`,
        tr: `Şiir metninizi buraya ekleyin.
Her satır sonu korunur.

Boş satırdan sonra yeni kıta başlar.`
      }
    },
    {
      id:    'poem-2',
      title: { en: 'Poem Title Two', tr: 'Şiir Başlık İki' },
      year:  2024,
      body: {
        en: `Second poem goes here.
Add as many lines as you like.`,
        tr: `İkinci şiir buraya gelir.
İstediğiniz kadar satır ekleyebilirsiniz.`
      }
    },
    {
      id:    'poem-3',
      title: { en: 'Poem Title Three', tr: 'Şiir Başlık Üç' },
      year:  2023,
      body: {
        en: `Third poem goes here.`,
        tr: `Üçüncü şiir buraya gelir.`
      }
    },
  ],

  articles: [
    {
      id:    'article-1',
      title: { en: 'Article Title One', tr: 'Makale Başlık Bir' },
      year:  2024,
      type:  { en: 'Essay',     tr: 'Deneme'   },
      body: {
        en: `Add your full article text here. This is the body of the essay — you can write as much as you need.

A second paragraph continues here.

A third paragraph if needed.`,
        tr: `Makale metninizi buraya ekleyin. Bu, denemenin gövdesidir.

İkinci paragraf burada devam eder.

Gerekirse üçüncü paragraf.`
      }
    },
    {
      id:    'article-2',
      title: { en: 'Article Title Two', tr: 'Makale Başlık İki' },
      year:  2023,
      type:  { en: 'Criticism', tr: 'Eleştiri' },
      body: {
        en: `Second article body goes here.`,
        tr: `İkinci makale metni buraya gelir.`
      }
    },
  ],

  /* Each page = one page of the book flip viewer */
  books: [
    {
      id:    'book-1',
      title: { en: 'Book Title One', tr: 'Kitap Başlık Bir' },
      year:  2025,
      cover: '',
      pages: [
        {
          en: `This is the first page of the book.

Write your text here. Each entry in this array becomes one page. Use blank lines between paragraphs.`,
          tr: `Bu kitabın ilk sayfasıdır.

Metninizi buraya yazın.`
        },
        {
          en: `This is the second page.

Continue the text here.`,
          tr: `Bu ikinci sayfadır.

Metni burada sürdürün.`
        },
        {
          en: `Third page.`,
          tr: `Üçüncü sayfa.`
        },
        {
          en: `Fourth page.`,
          tr: `Dördüncü sayfa.`
        },
      ]
    },
    {
      id:    'book-2',
      title: { en: 'Book Title Two', tr: 'Kitap Başlık İki' },
      year:  2024,
      cover: '',
      pages: [
        { en: `First page of book two.`, tr: `İkinci kitabın ilk sayfası.` },
        { en: `Second page of book two.`, tr: `İkinci kitabın ikinci sayfası.` },
      ]
    },
  ],

};


/* ─────────────────────────────────────────
   PROJECTS (shown on home page)
───────────────────────────────────────── */
const PROJECTS = [
  {
    title:  { en: 'Project Title One', tr: 'Proje Bir' },
    desc:   { en: 'A short description.', tr: 'Kısa açıklama.' },
    status: 'ongoing',
  },
  {
    title:  { en: 'Project Title Two', tr: 'Proje İki' },
    desc:   { en: 'A short description.', tr: 'Kısa açıklama.' },
    status: 'planned',
  },
];
