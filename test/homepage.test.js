import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const layout = readFileSync(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
const homepage = readFileSync(new URL('../src/pages/index.astro', import.meta.url), 'utf8');
const builtHomepage = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const layoutConsumers = [
  '../src/pages/404.astro',
  '../src/pages/blog/index.astro',
  '../src/pages/blog/[id].astro',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));

function contrastRatio(first, second) {
  const luminance = (hex) => {
    const channels = [1, 3, 5]
      .map((index) => Number.parseInt(hex.slice(index, index + 2), 16) / 255)
      .map((value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}
let styles = '';
try {
  styles = readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');
} catch {
  // The first RED run is expected while the shared stylesheet is still absent.
}

test('root layout emits the direction contract before any other body child', () => {
  const bodyStart = layout.indexOf('<body');
  const body = layout.slice(layout.indexOf('>', bodyStart) + 1);

  assert.match(body, /^\s*<!-- THESIS: A portfolio reads like a shareware field manual:/);
  assert.match(body, /OWN-WORLD: Warm paper #DED8C9, charcoal #171611, rust #B66A20, burgundy #7B1F29, and moss #182B26;/);
  assert.match(body, /FORM: Cover Split, first of three approved comps, seed 44af1320\./);
  assert.match(body, /FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN\.md/);

  const contract = body.match(/<!--[\s\S]*?-->/)?.[0] ?? '';
  assert.ok(contract.split(/\s+/).filter(Boolean).length <= 150, 'contract must stay under 150 words');
});

test('every root-layout page supplies the shared skip-link target', () => {
  for (const page of [homepage, ...layoutConsumers]) {
    assert.match(page, /<main[^>]+id="main-content"/);
  }
});

test('homepage is semantic, ordered, and mounted to the existing Breakout controller', () => {
  assert.match(homepage, /href="#main-content"|id="main-content"/);
  assert.match(homepage, /<header[\s\S]*aria-label=/);
  assert.match(homepage, /<main[^>]+id="main-content"/);
  assert.match(homepage, /id="work"[\s\S]*<ol/);
  assert.match(homepage, /id="play"[\s\S]*data-breakout/);
  assert.match(homepage, /data-breakout-canvas/);
  assert.match(homepage, /data-breakout-action="start"/);
  assert.match(homepage, /data-breakout-move="left"/);
  assert.match(homepage, /mountBreakout/);
  assert.match(homepage, /louis-halftone\.webp/);
  assert.doesNotMatch(homepage, /class="halftone"|class="proof-mark"/);
  assert.match(homepage, /class="icon-sprite"/);
  for (const icon of ['crosshair', 'github', 'graduate', 'cube', 'badge', 'globe', 'nodes', 'calendar', 'plug', 'coins', 'code', 'arrow', 'external']) {
    assert.match(homepage, new RegExp(`id="icon-${icon}"`));
  }
  assert.doesNotMatch(homepage, /home-cover-split/);
  assert.match(homepage, /projects\.map/);
  assert.match(homepage, /project\.description/);
  assert.match(homepage, /project\.repositoryUrl/);
  assert.match(homepage, /project\.homepageUrl/);
  assert.match(homepage, /project\.status/);
  assert.match(homepage, /project\.language/);
  assert.match(homepage, /posts\[0\]/);
  assert.match(homepage, /href="\/rss\.xml"/);
});

test('Breakout limits polite announcements to meaningful status changes', () => {
  assert.doesNotMatch(homepage, /class="breakout-status"[^>]*aria-live/);
  assert.match(homepage, /data-breakout-status aria-live="polite"/);
});

test('built Breakout module stays inside the document body', () => {
  const moduleScript = builtHomepage.lastIndexOf('<script type="module"');
  const bodyClose = builtHomepage.indexOf('</body>');
  const htmlClose = builtHomepage.indexOf('</html>');

  assert.ok(moduleScript > 0, 'missing built Breakout module');
  assert.ok(moduleScript < bodyClose, 'Breakout module was emitted after </body>');
  assert.equal(builtHomepage.slice(htmlClose + '</html>'.length).trim(), '');
});

test('shared visual system pins the approved material, type, responsive, and motion rules', () => {
  for (const token of ['#DED8C9', '#171611', '#B66A20', '#7B1F29', '#182B26']) {
    assert.match(styles, new RegExp(token.replace('#', '\\#')));
  }
  assert.match(styles, /Barlow Condensed/);
  assert.match(styles, /Atkinson Hyperlegible/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /min-width:\s*360px/);
  assert.match(styles, /min-(?:block-size|height):\s*44px/);
  assert.match(styles, /:focus-visible/);
  assert.match(styles, /paper-grain-1024\.png/);
  assert.doesNotMatch(styles, /linear-gradient|radial-gradient|conic-gradient/);
  assert.doesNotMatch(styles, /border-radius:\s*(?:[1-9]|[1-9][0-9])px/);
});

test('interactive and status color pairings use AA-safe approved tokens', () => {
  assert.match(styles, /a:hover\s*{[^}]*color:\s*var\(--burgundy\)/s);
  assert.match(styles, /:focus-visible\s*{[^}]*outline:\s*3px solid var\(--burgundy\)/s);
  assert.match(styles, /\.masthead nav a:first-child\s*{[^}]*color:\s*var\(--burgundy\)/s);
  assert.match(styles, /\.primary-tab\s*{[^}]*color:\s*var\(--ink\)/s);
  assert.match(styles, /\.primary-tab::before\s*{[^}]*background:\s*var\(--rust\)[^}]*tab-mask\.svg/s);
  assert.ok(contrastRatio('#171611', '#B66A20') >= 3, 'large tab text must meet 3:1');
  assert.match(styles, /\.primary-tab\s*{[^}]*font-size:\s*1\.2rem[^}]*font-weight:\s*700/s);
  assert.match(styles, /\.dossier-index\s*{[^}]*color:\s*var\(--burgundy\)/s);
  assert.match(styles, /\.breakout-status span\s*{[^}]*color:\s*var\(--paper\)/s);
});

test('desktop cover keeps the approved gutter, identity lines, and dossiers at the fold', () => {
  const titleRules = styles.match(/\.cover-title\s*{([^}]*)}/s)?.[1] ?? '';

  assert.match(styles, /\.cover\s*{[^}]*min-block-size:\s*clamp\(40rem, calc\(100svh - 17rem\), 47rem\)/s);
  assert.match(styles, /\.cover-copy\s*{[^}]*padding-inline-start:\s*clamp\(1rem, 3vw, 2\.5rem\)/s);
  assert.match(titleRules, /font-size:\s*clamp\(5\.2rem, 10\.5vw, 16rem\)/s);
  assert.doesNotMatch(titleRules, /max-inline-size|overflow-wrap/);
  assert.match(styles, /\.cover-title span\s*{[^}]*white-space:\s*nowrap/s);
  assert.match(homepage, /<section class="work-section" id="work"/);
  assert.match(homepage, /<h2 id="work-title" class="sr-only">Project dossiers<\/h2>/);
  assert.doesNotMatch(homepage, /class="section-heading"/);
  assert.match(styles, /\.portrait-side\s*{[^}]*padding:\s*clamp\(1\.25rem, 2vw, 2rem\)/s);
  assert.match(styles, /\.portrait-plate\s*{[^}]*inline-size:\s*min\(100%, 36rem\)/s);
  assert.match(styles, /\.portrait-image\s*{[^}]*aspect-ratio:\s*1 \/ 1/s);
  assert.match(styles, /@media \(min-width:\s*1900px\)[\s\S]*\.portrait-plate\s*{[^}]*inline-size:\s*min\(100%, 48rem\)[^}]*}[\s\S]*\.portrait-image\s*{[^}]*aspect-ratio:\s*4 \/ 3/s);
  assert.match(styles, /\.work-section\s*{[^}]*inline-size:\s*100%/s);
  assert.match(styles, /\.dossiers\s*{[^}]*padding:\s*0\.75rem 1\.25rem 0/s);
  assert.match(styles, /\.dossier\s*{[^}]*min-block-size:\s*5\.75rem[^}]*border:\s*2px solid var\(--ink\)/s);

  const masthead = 3.3 * 16;
  const cover = 47 * 16;
  const dossierInset = 0.75 * 16;
  const firstTwoDossiers = 2 * 5.75 * 16 + 2 * 0.5 * 16;
  assert.ok(masthead + cover + dossierInset + firstTwoDossiers <= 1024, 'first two dossiers must enter the approved viewport');
});

test('mobile proof labels stack without shrinking the approved type', () => {
  const mobileRules = styles.slice(styles.indexOf('@media (max-width: 680px)'));

  assert.match(mobileRules, /\.proof-list\s*{[^}]*grid-template-columns:\s*1fr/s);
  assert.match(mobileRules, /\.proof-list li\s*{[^}]*border-block-end:\s*1px solid var\(--burgundy\)/s);
  assert.doesNotMatch(mobileRules, /\.proof-list strong\s*{[^}]*font-size:\s*(?:0\.|1\.0[0-9])/s);
});

test('mobile identity title keeps deliberate right-edge breathing room', () => {
  const mobileRules = styles.slice(
    styles.indexOf('@media (max-width: 680px)'),
    styles.indexOf('@media (max-width: 420px)'),
  );
  const narrowRules = styles.slice(styles.indexOf('@media (max-width: 420px)'));

  assert.match(mobileRules, /\.cover-title\s*{[^}]*font-size:\s*clamp\(4rem, 18vw, 8rem\)/s);
  assert.doesNotMatch(narrowRules, /\.cover-title\s*{[^}]*font-size:/s);
});

test('dossiers stack before their desktop minimum columns can overflow', () => {
  const tabletRules = styles.slice(styles.indexOf('@media (max-width: 1100px)'));

  assert.match(tabletRules, /\.dossier\s*{[^}]*grid-template-columns:\s*5\.25rem minmax\(0, 1fr\)/s);
  assert.match(tabletRules, /\.dossier-route\s*{[^}]*display:\s*none/s);
});

test('small editorial links establish real 44px interaction boxes', () => {
  for (const selector of ['dossier-links a', 'latest-note a', 'site-footer a']) {
    const escaped = selector.replaceAll('.', '\\.').replaceAll(' ', '\\s+');
    const rules = styles.match(new RegExp(`\\.${escaped}\\s*\\{([^}]*)}`, 's'))?.[1] ?? '';

    assert.match(rules, /display:\s*inline-flex/);
    assert.match(rules, /align-items:\s*center/);
    assert.match(rules, /min-block-size:\s*44px/);
  }
});
