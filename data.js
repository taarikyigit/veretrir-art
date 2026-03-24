/* ═══════════════════════════════════════════════════════
   data.js  —  Edit this file to update all site content
   ═══════════════════════════════════════════════════════ */

const SITE = {

  /* ── ARTWORKS ─────────────────────────────────────────
     image:   path relative to site root, e.g. "images/work1.jpg"
     model:   optional .gltf path, e.g. "images/3d/test.gltf"
              set to null if no 3D model
  ──────────────────────────────────────────────────────── */
  artworks: [
    {
      id: 'untitled-1',
      title: 'Untitled I',
      titleTR: 'İsimsiz I',
      year: '2024',
      medium: 'Mixed Media',
      mediumTR: 'Karma Teknik',
      image: null,                         // e.g. "images/untitled1.jpg"
      extraImages: [],                     // e.g. ["images/untitled1-b.jpg"]
      model: 'images/3d/test.gltf',        // 3D model attached to this work
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
      model: null,
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

  /* ── POEMS ────────────────────────────────────────────
     body: use \n for line breaks within the poem
  ──────────────────────────────────────────────────────── */
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

  /* ── ARTICLES ─────────────────────────────────────────
     type: genre label, e.g. "Essay", "Criticism", "Review"
     body: plain text, paragraphs separated by \n\n
  ──────────────────────────────────────────────────────── */
  articles: [
    {
      id: 'article-1',
      title: 'Article Title One',
      titleTR: 'Makale Başlık Bir',
      year: '2024',
      type: 'Essay',
      typeTR: 'Deneme',
      body: `Add your full article text here. This is the body of the essay — you can write as much as you need. Replace this placeholder with your actual writing.

A second paragraph of the article continues here. The reading view is clean and distraction-free.`,
      bodyTR: `Makale metninizi buraya ekleyin. Bu denemenin gövdesidir. Bu yer tutucuyu gerçek yazınızla değiştirin.

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
    {
      id: 'article-3',
      title: 'Article Title Three',
      titleTR: 'Makale Başlık Üç',
      year: '2023',
      type: 'Essay',
      typeTR: 'Deneme',
      body: `Third article body goes here.`,
      bodyTR: `Üçüncü makale metni buraya gelir.`,
    },
  ],

  /* ── HERO SLIDESHOW ───────────────────────────────────
     Add image paths for the homepage slideshow background.
     If empty, dark placeholder slides are shown.
  ──────────────────────────────────────────────────────── */
  heroSlides: [
    null,   // replace with "images/hero1.jpg"
    null,
    null,
    null,
  ],

};
