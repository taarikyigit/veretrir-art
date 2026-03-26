/* =========================================================
   data.js  --  Edit this file to update all site content.
   This is the ONLY file you need to touch for content.
   ========================================================= */
 
const SITE = {
 
  /* -- ARTWORKS -------------------------------------------
     image:       path relative to site root
     extraImages: array of additional photo paths
     model:       .gltf path or null
  -------------------------------------------------------- */
  artworks: [
    {
      id: 'untitled-1',
      title: 'Untitled I',
      titleTR: 'Isimsiz I',
      year: '2024',
      medium: 'Mixed Media',
      mediumTR: 'Karma Teknik',
      image: null,
      extraImages: [],
      model: 'images/3d/test.gltf',
      desc: 'Add a description of this artwork -- the process, the intent, the materials, the context.',
      descTR: 'Bu eserle ilgili aciklama ekleyin -- surec, niyet, malzeme, bagiam.',
    },
    {
      id: 'untitled-2',
      title: 'Untitled II',
      titleTR: 'Isimsiz II',
      year: '2024',
      medium: 'Digital',
      mediumTR: 'Dijital',
      image: null,
      extraImages: [],
      model: null,
      desc: 'Add a description of this artwork.',
      descTR: 'Bu eserle ilgili aciklama ekleyin.',
    },
    {
      id: 'untitled-3',
      title: 'Untitled III',
      titleTR: 'Isimsiz III',
      year: '2023',
      medium: 'Print',
      mediumTR: 'Baski',
      image: null,
      extraImages: [],
      model: null,
      desc: 'Add a description of this artwork.',
      descTR: 'Bu eserle ilgili aciklama ekleyin.',
    },
    {
      id: 'untitled-4',
      title: 'Untitled IV',
      titleTR: 'Isimsiz IV',
      year: '2023',
      medium: 'Oil on Canvas',
      mediumTR: 'Tuval Uzerine Yagliboyal',
      image: null,
      extraImages: [],
      model: null,
      desc: 'Add a description of this artwork.',
      descTR: 'Bu eserle ilgili aciklama ekleyin.',
    },
  ],
 
  /* -- POEMS --------------------------------------------- */
  poems: [
    {
      id: 'poem-1',
      title: 'Poem Title One',
      titleTR: 'Siir Baslik Bir',
      year: '2024',
      body: `Add your full poem text here.
Each line break is preserved exactly.
This is where your verses live.
 
A second stanza can go here,
separated by a blank line.`,
      bodyTR: `Siir metninizi buraya ekleyin.
Her satir sonu korunur.
Dizeleriniz burada yer alacak.
 
Ikinci kita buraya gelebilir,
bos bir satirla ayrilmis sekilde.`,
    },
    {
      id: 'poem-2',
      title: 'Poem Title Two',
      titleTR: 'Siir Baslik Iki',
      year: '2024',
      body: `Second poem goes here.\nAdd as many lines as you like.`,
      bodyTR: `Ikinci siir buraya gelir.\nIstediginiz kadar satir ekleyebilirsiniz.`,
    },
    {
      id: 'poem-3',
      title: 'Poem Title Three',
      titleTR: 'Siir Baslik Uc',
      year: '2023',
      body: `Third poem goes here.`,
      bodyTR: `Ucuncu siir buraya gelir.`,
    },
  ],
 
  /* -- ARTICLES ------------------------------------------- */
  articles: [
    {
      id: 'article-1',
      title: 'Article Title One',
      titleTR: 'Makale Baslik Bir',
      year: '2024',
      type: 'Essay',
      typeTR: 'Deneme',
      body: `Add your full article text here. This is the body of the essay -- you can write as much as you need. Replace this placeholder with your actual writing.
 
A second paragraph of the article continues here. The reading view is clean and distraction-free.`,
      bodyTR: `Makale metninizi buraya ekleyin. Bu denemenin govdesidir. Bu yer tutucuyu gercek yazinizla degistirin.
 
Makalenin ikinci paragrafi burada devam eder.`,
    },
    {
      id: 'article-2',
      title: 'Article Title Two',
      titleTR: 'Makale Baslik Iki',
      year: '2023',
      type: 'Criticism',
      typeTR: 'Elesitiri',
      body: `Second article body goes here.`,
      bodyTR: `Ikinci makale metni buraya gelir.`,
    },
    {
      id: 'article-3',
      title: 'Article Title Three',
      titleTR: 'Makale Baslik Uc',
      year: '2023',
      type: 'Essay',
      typeTR: 'Deneme',
      body: `Third article body goes here.`,
      bodyTR: `Ucuncu makale metni buraya gelir.`,
    },
  ],
 
  /* -- BOOKS ---------------------------------------------
     pdf:   path relative to site root, e.g. "books/mybook.pdf"
     cover: optional cover image path, or null
  ------------------------------------------------------- */
  books: [
    {
      id: 'stain',
      title: 'Stain',
      titleTR: 'Leke',
      year: '2026',
      pdf: 'books/stainturkish.pdf',
      cover: null,
      desc: 'A collection of poems.',
      descTR: 'Siirler derlemesi.',
    },
  ],
 
  /* -- HERO SLIDES --------------------------------------- */
  heroSlides: [
    null,
    null,
    null,
    null,
  ],
 
  /* -- ONGOING / PLANNED PROJECTS ----------------------- */
  projects: [
    {
      title: 'Project Title One',
      titleTR: 'Proje Baslik Bir',
      desc: 'A short description of this ongoing project.',
      descTR: 'Bu devam eden projenin kisa aciklamasi.',
      status: 'ongoing',
    },
    {
      title: 'Project Title Two',
      titleTR: 'Proje Baslik Iki',
      desc: 'A short description of this planned project.',
      descTR: 'Bu planlanan projenin kisa aciklamasi.',
      status: 'planned',
    },
  ],
};
