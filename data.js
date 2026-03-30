/* =========================================================
   data.js  --  Base content. The site reads from
   localStorage first (set by admin panel), falling back
   to this file. Export from admin to keep them in sync.
   ========================================================= */
 
const SITE_BASE = {
 
  /* -- ARTWORKS -------------------------------------------
     image:  'images/artwork/filename.jpg'
     model:  '3d model path' or null
  -------------------------------------------------------- */
  artworks: [
    {
      id: 'untitled-1',
      title: 'Untitled I',
      titleTR: 'İsimsiz I',
      year: '2024',
      medium: 'Mixed Media',
      mediumTR: 'Karma Teknik',
      image: null,
      extraImages: [],
      model: 'images/3d/test.gltf',
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
      image: null,
      extraImages: [],
      model: 'images/3d/torus_spin.glb',
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
      image: null,
      extraImages: [],
      model: null,
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
      image: null,
      extraImages: [],
      model: null,
      desc: 'Add a description of this artwork.',
      descTR: 'Bu eserle ilgili açıklama ekleyin.',
    },
  ],
 
  /* -- POEMS --------------------------------------------- */
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
      body: `Second poem goes here.\nAdd as many lines as you like.`,
      bodyTR: `İkinci şiir buraya gelir.\nİstediğiniz kadar satır ekleyebilirsiniz.`,
    },
    {
      id: 'poem-3',
      title: 'Poem Title Three',
      titleTR: 'Şiir Başlık Üç',
      year: '2023',
      body: `Third poem goes here.`,
      bodyTR: `Üçüncü şiir buraya gelir.`,
    },
  ],
 
  /* -- ARTICLES ------------------------------------------- */
  articles: [
    {
      id: 'article-1',
      title: 'Article Title One',
      titleTR: 'Makale Başlık Bir',
      year: '2024',
      type: 'Essay',
      typeTR: 'Deneme',
      body: `Add your full article text here. This is the body of the essay — you can write as much as you need.
 
A second paragraph of the article continues here.`,
      bodyTR: `Makale metninizi buraya ekleyin.
 
Makalenin ikinci paragrafı burada devam eder.`,
    },
    {
      id: 'article-2',
      title: 'Article Title Two',
      titleTR: 'Makale Başlık İki',
      year: '2023',
      type: 'Criticism',
      typeTR: 'Eleştiri',
      body: `Second article body goes here.`,
      bodyTR: `İkinci makale metni buraya gelir.`,
    },
  ],
 
  /* -- BOOKS --------------------------------------------- */
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
 
  /* -- PROJECTS ------------------------------------------ */
  projects: [
    {
      id: 'proj-1',
      title: 'Project Title One',
      titleTR: 'Proje Başlık Bir',
      desc: 'A short description of this ongoing project.',
      descTR: 'Bu devam eden projenin kısa açıklaması.',
      status: 'ongoing',
    },
    {
      id: 'proj-2',
      title: 'Project Title Two',
      titleTR: 'Proje Başlık İki',
      desc: 'A short description of this planned project.',
      descTR: 'Bu planlanan projenin kısa açıklaması.',
      status: 'planned',
    },
  ],
 
  /* -- SITE TEXTS ----------------------------------------
     Edit these in the admin panel under "Site Texts"
  ------------------------------------------------------- */
  texts: {
    aboutEN: `Write your biography or artist statement here. Who you are, where you come from, what you make and why.
 
A second paragraph about your practice — the themes you return to, the tensions that drive your work.`,
    aboutTR: `Biyografinizi buraya yazın. Kim olduğunuzu, nereden geldiğinizi, ne ürettiğinizi ve neden.
 
Pratiğiniz hakkında ikinci paragraf — döndüğünüz temalar, çalışmalarınızı yönlendiren gerilimler.`,
    contactNote: 'Collaborations, exhibitions, publications.',
    contactNoteTR: 'İşbirlikleri, sergiler, yayınlar.',
  },
};
