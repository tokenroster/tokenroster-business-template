#!/usr/bin/env node
'use strict';

// Shared engine for {{COMPANY}} pitch decks: brand-compliant slide HTML
// helpers + PDF rendering + QA screenshots. A per-deck script (e.g.
// sales/pitch-deck/generation/generate-deck.js) requires this, builds an array
// of slide HTML strings using the helpers below, then calls buildHtml()
// and renderPdf()/screenshotSlides().
//
// Path layout this file assumes (mirrors md-to-pdf):
//   <repo root>/.claude/skills/pitch-deck/scripts/deck-kit.js  (this file)
//   <repo root>/.claude/skills/md-to-pdf/scripts/node_modules/playwright  (reused, not reinstalled)
//   <repo root>/marketing/brand/logos/*.svg
//
// Setup: fill in COMPANY_NAME below, and put your three logo SVGs at the
// LOGOS path with the filenames referenced below (or change the filenames
// here to match what you actually have).

const fs = require('fs');
const path = require('path');

const COMPANY_NAME = '{{COMPANY}}';

const SKILL_DIR = path.join(__dirname, '..');
const ROOT = path.join(SKILL_DIR, '..', '..', '..');
const LOGOS = path.join(ROOT, 'marketing', 'brand', 'logos');
const THEME_CSS = fs.readFileSync(path.join(SKILL_DIR, 'assets', 'deck-theme.css'), 'utf8');

// Full wordmark (used on the title slide), a tile-shaped mark (used as the
// corner mark on every other slide), and an ink-only variant of the mark
// (for placing on light backgrounds where the tile's own colors would clash).
const wordmarkSvg = fs.readFileSync(path.join(LOGOS, 'wordmark.svg'), 'utf8');
const markTileSvg = fs.readFileSync(path.join(LOGOS, 'mark-tile.svg'), 'utf8');
const markInkSvg = fs.readFileSync(path.join(LOGOS, 'mark-ink.svg'), 'utf8');

// Keep in sync with the --font-display/--font-body/--font-mono families in
// assets/deck-theme.css, if you swap the theme's fonts, update this link too.
const GOOGLE_FONTS_LINK =
  '<link rel="preconnect" href="https://fonts.googleapis.com">' +
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
  '<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600&family=Outfit:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">';

// ---- slide structure helpers ----------------------------------------------
//
// Every slide follows: slideOpen() -> title() [optional] -> body(...) -> slideClose.
// title() is pinned near the top; body() fills and vertically centers
// whatever's left, so slides read full without dead space at the bottom.
// Never call title() and expect it inside body() — they're siblings.

function cornerMark() {
  return `<div class="corner-mark">${markTileSvg}</div>`;
}

function slideOpen(n, section, extraClass) {
  return `<section class="slide${extraClass ? ' ' + extraClass : ''}">
    <div class="eyebrow">${String(n).padStart(2, '0')} &middot; ${section}</div>
    ${cornerMark()}`;
}

const slideClose = `<div class="slide-footer"><span>${COMPANY_NAME}</span><span>Confidential &amp; Proprietary</span></div></section>`;

function title(t) {
  return `<h2 class="slide-title">${t}</h2>`;
}

function body(content) {
  return `<div class="slide-body">${content}</div>`;
}

function bullets(items) {
  return `<ul class="brand-list">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`;
}

function flowBox(t) {
  return `<div class="flow-box">${t}</div>`;
}

// Line chart: hand-built SVG, single accent-color line + dots on a light grid.
function lineChart(label, points, w, h) {
  w = w || 560;
  h = h || 300;
  const max = Math.max(...points.map((p) => p.v)) * 1.12;
  const padL = 34, padT = 14, padR = 8;
  const padB = 22;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const x = (i) => padL + (i / (points.length - 1)) * plotW;
  const y = (v) => padT + plotH - (v / max) * plotH;
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i).toFixed(1)} ${y(p.v).toFixed(1)}`).join(' ');
  const gridLines = [0, 0.25, 0.5, 0.75, 1]
    .map((f) => `<line x1="${padL}" x2="${w - padR}" y1="${(padT + plotH * (1 - f)).toFixed(1)}" y2="${(padT + plotH * (1 - f)).toFixed(1)}" class="chart-grid"/>`)
    .join('');
  const dots = points.map((p, i) => `<circle cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="3.4" class="chart-dot"/>`).join('');
  const xLabels = points
    .map((p, i) => `<text x="${x(i).toFixed(1)}" y="${h - 4}" class="chart-axis-label" text-anchor="middle">${p.k}</text>`)
    .join('');
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    ${gridLines}
    <path d="${linePath}" class="chart-line"/>
    ${dots}
    ${xLabels}
    <text x="${padL}" y="12" class="chart-title">${label}</text>
  </svg>`;
}

// Bar chart: N bars, $-formatted value labels above each bar.
function barChart(label, points, w, h) {
  w = w || 560;
  h = h || 300;
  const max = Math.max(...points.map((p) => p.v)) * 1.18;
  const padL = 10, padT = 26, padR = 10;
  const padB = 26;
  const plotW = w - padL - padR;
  const plotH = h - padT - padB;
  const gap = 0.35;
  const barW = plotW / points.length / (1 + gap);
  const bars = points
    .map((p, i) => {
      const bx = padL + i * (plotW / points.length) + (plotW / points.length - barW) / 2;
      const bh = (p.v / max) * plotH;
      const by = padT + plotH - bh;
      return `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barW.toFixed(1)}" height="${bh.toFixed(1)}" class="chart-bar"/>
        <text x="${(bx + barW / 2).toFixed(1)}" y="${(by - 6).toFixed(1)}" class="chart-bar-value" text-anchor="middle">$${p.v.toLocaleString('en-US')}K</text>
        <text x="${(bx + barW / 2).toFixed(1)}" y="${h - 6}" class="chart-axis-label" text-anchor="middle">${p.k}</text>`;
    })
    .join('');
  return `<svg class="chart" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    <line x1="${padL}" x2="${w - padR}" y1="${padT + plotH}" y2="${padT + plotH}" class="chart-grid"/>
    ${bars}
    <text x="${padL}" y="14" class="chart-title">${label}</text>
  </svg>`;
}

// Nested/stacked bar visual for TAM/SAM/SOM-style market sizing. Widths are
// linear against the largest item, with a floor so a much smaller item
// (e.g. SOM at <1% of TAM) never shrinks to an unreadable sliver. Fill
// opacity increases down the list, so the visual narrows and darkens
// toward the achievable slice.
function tamBars(items) {
  const FLOOR_PCT = 6;
  const shades = ['tam', 'sam', 'som'];
  const max = Math.max(...items.map((it) => it.value));
  const rows = items
    .map((it, i) => {
      const pct = Math.max((it.value / max) * 100, FLOOR_PCT);
      const shade = shades[i] || 'som';
      return `<div class="tam-bar-row">
        <div class="tam-bar-head">
          <span class="tam-bar-label">${it.label}</span>
          <span class="tam-bar-value">${it.valueLabel}</span>
        </div>
        <div class="tam-bar-track"><div class="tam-bar-fill ${shade}" style="width:${pct.toFixed(1)}%"></div></div>
        <p class="tam-bar-desc">${it.description}</p>
      </div>`;
    })
    .join('');
  return `<div class="tam-bars">${rows}</div>`;
}

function personCard(photoDataUri, name, role, bio) {
  return `<div class="person-card">
    <img class="person-photo" src="${photoDataUri}" alt="${name}">
    <div class="person-name">${name}</div>
    <div class="person-role">${role}</div>
    <p>${bio}</p>
  </div>`;
}

// logoDataUri fits within a fixed frame via object-fit: contain, so logos
// of any aspect ratio (circular badge, wide wordmark, portrait photo) sit
// consistently without cropping. Pass opts.logoOnDark for a white/light
// logo (transparent PNG or SVG with white fill) that would otherwise
// vanish against the card's white background.
function logoFrame(logoDataUri, name, opts) {
  opts = opts || {};
  const cls = opts.logoOnDark ? 'card-logo-frame on-dark' : 'card-logo-frame';
  return `<div class="${cls}"><img class="card-logo" src="${logoDataUri}" alt="${name}"></div>`;
}

// Named entity + logo + description, for a strategic-partners slide.
function partnerCard(logoDataUri, name, blurb, opts) {
  return `<div class="card partner-card">
    ${logoFrame(logoDataUri, name, opts)}
    <strong>${name}</strong>
    <p>${blurb}</p>
  </div>`;
}

// Named entity + logo + description, for a portfolio/projects slide.
function projectCard(logoDataUri, name, blurb, opts) {
  return `<div class="card project-card">
    ${logoFrame(logoDataUri, name, opts)}
    <strong>${name}</strong>
    <p>${blurb}</p>
  </div>`;
}

// Captioned row of logo badges (e.g. "also evaluating" platforms). Sized
// to read clearly, not as a small footnote — label stacked above a row of
// larger badges. items: [{ src, alt }].
function logoStrip(label, items) {
  const badges = items
    .map((it) => `<div class="logo-strip-badge"><img src="${it.src}" alt="${it.alt}"></div>`)
    .join('');
  return `<div class="logo-strip">
    ${label ? `<span class="logo-strip-label">${label}</span>` : ''}
    <div class="logo-strip-badges">${badges}</div>
  </div>`;
}

// Reads an image file from disk and returns a data: URI, for embedding
// photos (e.g. team headshots) directly in the HTML with no external refs.
function embedImage(absPath) {
  const buf = fs.readFileSync(absPath);
  const ext = path.extname(absPath).slice(1).toLowerCase();
  const mime = { jpg: 'jpeg', svg: 'svg+xml' }[ext] || ext;
  return `data:image/${mime};base64,${buf.toString('base64')}`;
}

// ---- document assembly + rendering -----------------------------------------

function buildHtml(pageTitle, slidesHtmlArray) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${pageTitle}</title>
${GOOGLE_FONTS_LINK}
<style>
${THEME_CSS}
</style>
</head>
<body>
${slidesHtmlArray.join('\n')}
</body>
</html>`;
}

function getChromium() {
  // Reuses the browser already installed for the md-to-pdf skill instead
  // of a second npm/playwright-browser download.
  return require(path.join(ROOT, '.claude', 'skills', 'md-to-pdf', 'scripts', 'node_modules', 'playwright')).chromium;
}

async function renderPdf(html, outPath) {
  const chromium = getChromium();
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: outPath,
      printBackground: true,
      width: '13.333in',
      height: '7.5in',
      margin: { top: 0, bottom: 0, left: 0, right: 0 },
    });
  } finally {
    await browser.close();
  }
  return outPath;
}

// Screenshots every .slide element to <qaDir>/slide-NN.png. Use this for
// QA instead of markitdown/soffice/pdftoppm — none of those are available
// in this environment. Look at every image before calling a deck done.
async function screenshotSlides(html, qaDir) {
  const chromium = getChromium();
  fs.mkdirSync(qaDir, { recursive: true });
  const browser = await chromium.launch();
  const outputs = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const slides = await page.$$('.slide');
    for (let i = 0; i < slides.length; i++) {
      const n = String(i + 1).padStart(2, '0');
      const outPath = path.join(qaDir, `slide-${n}.png`);
      await slides[i].screenshot({ path: outPath });
      outputs.push(outPath);
    }
  } finally {
    await browser.close();
  }
  return outputs;
}

module.exports = {
  ROOT,
  LOGOS,
  wordmarkSvg,
  markTileSvg,
  markInkSvg,
  cornerMark,
  slideOpen,
  slideClose,
  title,
  body,
  bullets,
  flowBox,
  lineChart,
  barChart,
  tamBars,
  personCard,
  partnerCard,
  projectCard,
  logoStrip,
  embedImage,
  buildHtml,
  renderPdf,
  screenshotSlides,
};
