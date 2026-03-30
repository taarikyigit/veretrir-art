/* ================================================================
   data.js  —  veretrir.art content base
   The site reads localStorage('veretrir_data') first,
   falling back to SITE_BASE here.
   Export from admin panel to make changes permanent.
   ================================================================

   ARTWORK / PROJECT SCHEMA:
   {
     id:        string (unique slug)
     title:     string
     titleTR:   string
     year:      string
     medium:    string
     mediumTR:  string
     images: [                 ← stacked gallery
       { path: 'images/artwork/x.jpg', isMain: true, caption: '' }
     ]
     materials: [              ← flexible extra blocks
       {
         id:    string
         label: string         ← custom block title
         type:  'text' | 'image-gallery' | 'gif' | '3d' | 'pdf' | 'video'
         // type-specific fields:
         content: string       ← for text
         images:  [{ path, caption }]  ← for image-gallery / gif
         path:    string       ← for 3d / pdf / video
       }
     ]
     desc:      string
     descTR:    string
     status:    'ongoing' | 'planned' | null   ← only for projects
   }
   ================================================================ */

const SITE_BASE = {

  artworks: [
    {
      id: 'untitled-1',
      title: 'Untitled I',
      titleTR: 'İsimsiz I',
      year: '2024',
      medium: 'Mixed Media',
      mediumTR: 'Karma Teknik',
      images: [],
      materials: [
        {
          id: 'mat-1a',
          label: '3D Model',
          type: '3d',
          path: 'images/3d/test.gltf',
        }
      ],
      desc: 'Add a description of this artwork — the process, the intent, the materials, the context.',
      descTR: 'Bu eserle ilgili açıklama ekleyin — süreç, niyet, malzeme, bağlam.',
    },
    {
      id: 'untitled-2',
      title: 'Untitled II',
      titleTR: 'İsimsiz II',
      year: '2024',
      medium: 'Digital',
      mediumTR: 'Dijital',
      images: [],
      materials: [
        {
          id: 'mat-2a',
          label: 'Animated Model',
          type: '3d',
          path: 'images/3d/torus_spin.glb',
        }
      ],
      desc: 'Add a description of this artwork.',
      descTR: 'Bu eserle ilgili açıklama ekleyin.',
    },
    {
      id: 'untitled-3',
      title: 'Untitled III',
      titleTR: 'İsimsiz III',
      year: '2023',
      medium: 'Print',
      mediumTR: 'Baskı',
      images: [],
      materials: [],
      desc: 'Add a description of this artwork.',
      descTR: 'Bu eserle ilgili açıklama ekleyin.',
    },
    {
      id: 'untitled-4',
      title: 'Untitled IV',
      titleTR: 'İsimsiz IV',
      year: '2023',
      medium: 'Oil on Canvas',
      mediumTR: 'Tuval Üzerine Yağlıboya',
      images: [],
      materials: [],
      desc: 'Add a description of this artwork.',
      descTR: 'Bu eserle ilgili açıklama ekleyin.',
    },
  ],

  projects: [
    {
      id: 'proj-1',
      title: 'Project Title One',
      titleTR: 'Proje Başlık Bir',
      year: '2024',
      medium: 'Installation',
      mediumTR: 'Enstalasyon',
      status: 'ongoing',
      images: [],
      materials: [],
      desc: 'A short description of this ongoing project.',
      descTR: 'Bu devam eden projenin kısa açıklaması.',
    },
    {
      id: 'proj-2',
      title: 'Project Title Two',
      titleTR: 'Proje Başlık İki',
      year: '2025',
      medium: 'Performance',
      mediumTR: 'Performans',
      status: 'planned',
      images: [],
      materials: [],
      desc: 'A short description of this planned project.',
      descTR: 'Bu planlanan projenin kısa açıklaması.',
    },
  ],

  poems: [
    {
      id: 'poem-1',
      title: 'Poem Title One',
      titleTR: 'Şiir Başlık Bir',
      year: '2024',
      body: `Add your full poem text here.
Each line break is preserved exactly.
This is where your verses live.

A second stanza can go here,
separated by a blank line.`,
      bodyTR: `Şiir metninizi buraya ekleyin.
Her satır sonu korunur.
Dizeleriniz burada yer alacak.

İkinci kıta buraya gelebilir,
boş bir satırla ayrılmış şekilde.`,
    },
    {
      id: 'poem-2',
      title: 'Poem Title Two',
      titleTR: 'Şiir Başlık İki',
      year: '2024',
      body: 'Second poem goes here.\nAdd as many lines as you like.',
      bodyTR: 'İkinci şiir buraya gelir.',
    },
    {
      id: 'poem-3',
      title: 'Poem Title Three',
      titleTR: 'Şiir Başlık Üç',
      year: '2023',
      body: 'Third poem goes here.',
      bodyTR: 'Üçüncü şiir buraya gelir.',
    },
  ],

  articles: [
    {
      id: 'article-1',
      title: 'Article Title One',
      titleTR: 'Makale Başlık Bir',
      year: '2024',
      type: 'Essay',
      typeTR: 'Deneme',
      body: 'Add your full article text here.\n\nA second paragraph.',
      bodyTR: 'Makale metninizi buraya ekleyin.\n\nİkinci paragraf.',
    },
  ],

  books: [
    {
      id: 'stain',
      title: 'Stain',
      titleTR: 'Leke',
      year: '2026',
      pdf: 'books/stainturkish.pdf',
      cover: null,
      allowDownload: true,
      desc: 'A collection of poems.',
      descTR: 'Şiirler derlemesi.',
    },
  ],

  texts: {
    aboutEN: 'Write your biography or artist statement here. Who you are, where you come from, what you make and why.\n\nA second paragraph about your practice.',
    aboutTR: 'Biyografinizi buraya yazın. Kim olduğunuzu, nereden geldiğinizi, ne ürettiğinizi ve neden.\n\nPratiğiniz hakkında ikinci paragraf.',
    contactNote: 'Collaborations, exhibitions, publications.',
    contactNoteTR: 'İşbirlikleri, sergiler, yayınlar.',
  },
};
