# veretrir.art — Content Guide

A simple guide for adding and editing content on your site.  
**You never need to touch `index.html`.  
Everything lives in `content.js`.**

---

## Your files

```
index.html        ← the website (never edit this)
content.js        ← ALL your content lives here (edit this)
admin.html        ← helper tool to generate content snippets
README.md         ← this guide

images/
  hero/           ← hero slideshow photos
  artworks/
    artwork1/     ← one folder per artwork
      main.jpg
      detail1.jpg
    artwork2/
      main.jpg
  ...
```

---

## How to add a new Artwork

**Option A — use the helper tool (easiest)**

1. Open `admin.html` in your browser
2. Fill in the Artwork form
3. Click **Generate**
4. Click **Copy**
5. Open `content.js`, find the line that says `const ARTWORKS = [`
6. Paste your snippet right after that line (before the existing items)
7. Save — done.

**Option B — edit directly**

Open `content.js` and copy this block, paste it at the top of `ARTWORKS`:

```js
  {
    title:    { en: 'My New Artwork', tr: 'Yeni Eserim' },
    year:     '2025',
    medium:   { en: 'Oil on Canvas', tr: 'Tuval Üzerine Yağlıboya' },
    desc:     { en: 'Description in English.',
                tr: 'Türkçe açıklama.' },
    mainImage: 'images/artworks/artwork5/main.jpg',
    images:    [],
  },
```

Change the values. Save.

---

## How to add a new Poem

1. Open `admin.html` → Poem tab, fill in the form, click Generate, Copy
2. Open `content.js`, find `const POEMS = [`
3. Paste after the opening `[`
4. Save

Or manually paste this template at the top of `POEMS`:

```js
  {
    title: { en: 'My Poem', tr: 'Şiirim' },
    year:  '2025',
    body: {
      en: `First line here.
Second line here.

New stanza here.`,
      tr: `Türkçe ilk satır.
İkinci satır.`
    }
  },
```

---

## How to add a new Article

Same as poems. Use `admin.html` → Article tab, or paste manually into `ARTICLES`.

```js
  {
    title: { en: 'My Article', tr: 'Makalem' },
    year:  '2025',
    type:  { en: 'Essay', tr: 'Deneme' },
    body: {
      en: `First paragraph here.

Second paragraph here.`,
      tr: `Türkçe ilk paragraf.

Türkçe ikinci paragraf.`
    }
  },
```

---

## How to add images

### For artworks

1. Create a folder:  `images/artworks/artwork5/`
2. Drag your image in:  `images/artworks/artwork5/main.jpg`
3. In `content.js`, set `mainImage: 'images/artworks/artwork5/main.jpg'`
4. For extra photos, add them to the folder and list them:
   ```js
   images: ['images/artworks/artwork5/detail1.jpg', 'images/artworks/artwork5/detail2.jpg'],
   ```

### For the hero slideshow

1. Drag images into: `images/hero/`
2. In `content.js`, edit `HERO_IMAGES`:
   ```js
   const HERO_IMAGES = [
     'images/hero/slide1.jpg',
     'images/hero/slide2.jpg',
   ];
   ```

**Image tips:**
- Any filename works — `painting.jpg`, `photo-2025.jpg`, etc.
- JPG or PNG both work
- No resizing needed — the site handles it automatically
- Keep image filenames simple (no spaces, no accents)

---

## How to edit site info (name, email, Instagram, bio)

Open `content.js` and edit the `SITE` block at the top:

```js
const SITE = {
  name:       'tarik yigit',
  domain:     'veretrir.art',
  instagram:  'https://instagram.com/veretrir',
  email:      'hello@veretrir.art',

  about: {
    en: `Your bio in English.`,
    tr: `Türkçe biyografiniz.`
  },

  contact: {
    en: 'Collaborations, exhibitions, publications.',
    tr: 'İşbirlikleri, sergiler, yayınlar.'
  }
};
```

---

## Editing both languages

Every text field has this structure:

```js
title: { en: 'English text', tr: 'Türkçe metin' }
```

Edit both sides. If you leave `tr` empty, the English version shows for both languages.

---

## If something looks wrong

- Make sure every block ends with `},` (a closing curly brace and comma)
- Make sure you have not deleted any `[` or `]` brackets around the lists
- If the site goes blank, open your browser's developer console (press F12) to see the error

The most common mistake is a **missing comma** at the end of a block.  
Compare your new block against an existing one — they should look the same.

---

## Admin helper tool

Open `admin.html` in your browser.  
Fill in a form, click Generate, copy the result, paste it into `content.js`.  
No login needed. No data is sent anywhere.
