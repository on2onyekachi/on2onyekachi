/*
 * Font lab: try other typefaces from the browser console. Nothing here changes
 * the site until you call it, and your pick is remembered on reload.
 *
 *   fonts.list()              show every option
 *   fonts.use('bricolage')    switch (loads the font from Google Fonts first)
 *   fonts.reset()             back to Literata
 *   or add ?font=bricolage to the URL
 *
 * Sources:
 *   davidbilson.dev                 Bricolage Grotesque (everything), Montserrat,
 *                                   Monoton and Rubik Glitch (decoration only)
 *   forty.lesliewilliams.design     Instrument Serif italic (big quotes),
 *                                   Helvetica / Arial (body), monospace (small labels)
 */
(() => {
  const HEADINGS = 'h1, h2, h3, .hero-title, .footer-email, .case-next strong, .case-stats b, .el::before';

  // display = big headings, body = everything else. `italic` makes headings italic.
  const FONTS = {
    literata:            { note: 'Current (default)' },
    kyoto:               { note: 'PP Kyoto, needs the licensed files in /font/kyoto/', display: '"PP Kyoto"', body: '"PP Kyoto"' },
    bricolage:           { note: 'davidbilson.dev: Bricolage Grotesque everywhere', google: 'Bricolage+Grotesque:opsz,wght@12..96,300..700', display: '"Bricolage Grotesque"', body: '"Bricolage Grotesque"' },
    montserrat:          { note: 'davidbilson.dev: Montserrat everywhere', google: 'Montserrat:wght@300..700', display: 'Montserrat', body: 'Montserrat' },
    'bricolage-literata':{ note: 'Bricolage headings, Literata body', google: 'Bricolage+Grotesque:opsz,wght@12..96,300..700', display: '"Bricolage Grotesque"' },
    instrument:          { note: 'forty.lesliewilliams.design: Instrument Serif headings, Helvetica body', google: 'Instrument+Serif:ital@0;1', display: '"Instrument Serif"', body: '"Helvetica Neue", Helvetica, Arial' },
    'instrument-italic': { note: 'Same, with italic headings like Leslie\'s quotes', google: 'Instrument+Serif:ital@0;1', display: '"Instrument Serif"', body: '"Helvetica Neue", Helvetica, Arial', italic: true },
    'instrument-literata':{ note: 'Instrument Serif headings, Literata body', google: 'Instrument+Serif:ital@0;1', display: '"Instrument Serif"' },
    'instrument-bricolage':{ note: 'Instrument Serif headings, Bricolage body (mix of both sites)', google: ['Instrument+Serif:ital@0;1', 'Bricolage+Grotesque:opsz,wght@12..96,300..700'], display: '"Instrument Serif"', body: '"Bricolage Grotesque"' },
    helvetica:           { note: 'Helvetica / Arial everywhere (Leslie\'s body font)', display: '"Helvetica Neue", Helvetica, Arial', body: '"Helvetica Neue", Helvetica, Arial' },
    monoton:             { note: 'davidbilson.dev decoration font, headings only (just to see it)', google: 'Monoton', display: 'Monoton' },
    glitch:              { note: 'davidbilson.dev decoration font, headings only (just to see it)', google: 'Rubik+Glitch', display: '"Rubik Glitch"' }
  };

  const STORE = 'font-lab';
  const style = document.createElement('style');
  style.id = 'font-lab';
  const loaded = new Set();

  const load = google => [].concat(google || []).forEach(family => {
    if (loaded.has(family)) return;
    loaded.add(family);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
    document.head.appendChild(link);
  });

  const save = name => { try { name ? localStorage.setItem(STORE, name) : localStorage.removeItem(STORE); } catch (e) { /* storage blocked */ } };

  function use(name) {
    const f = FONTS[name];
    if (!f) { console.warn(`No font called "${name}". Try fonts.list()`); return; }
    load(f.google);
    const fallback = 'var(--font-editorial)';
    let css = '';
    if (f.body) css += `body { font-family: ${f.body}, ${fallback}; }\n`;
    if (f.display) css += `${HEADINGS} { font-family: ${f.display}, ${fallback}; ${f.italic ? 'font-style: italic;' : ''} }\n`;
    style.textContent = css;
    if (!style.isConnected) document.head.appendChild(style);
    save(name === 'literata' ? null : name);
    console.log(`%cFont: ${name}%c  ${f.note}`, 'font-weight:bold', 'color:gray');
    return name;
  }

  const api = {
    list() { console.table(Object.fromEntries(Object.entries(FONTS).map(([k, v]) => [k, v.note]))); return Object.keys(FONTS); },
    use,
    reset: () => use('literata'),
    next() {
      const keys = Object.keys(FONTS);
      const now = (() => { try { return localStorage.getItem(STORE); } catch (e) { return null; } })() || 'literata';
      return use(keys[(keys.indexOf(now) + 1) % keys.length]);
    }
  };
  window.fonts = api;

  const fromUrl = new URLSearchParams(location.search).get('font');
  let saved = null;
  try { saved = localStorage.getItem(STORE); } catch (e) { /* storage blocked */ }
  if (fromUrl || saved) use(fromUrl || saved);
  else console.log('%cFont lab ready:%c fonts.list(), fonts.use("bricolage"), fonts.next(), fonts.reset()', 'font-weight:bold', 'color:gray');
})();
