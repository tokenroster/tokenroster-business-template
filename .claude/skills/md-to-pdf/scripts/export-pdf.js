#!/usr/bin/env node
'use strict';

const { chromium } = require('playwright');
const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

const SKILL_DIR = path.join(__dirname, '..');
const REPO_ROOT = path.join(SKILL_DIR, '..', '..', '..');
const ASSETS_DIR = path.join(SKILL_DIR, 'assets');
const THEMES_DIR = path.join(ASSETS_DIR, 'themes');
const ONE_PAGER_DIR = path.join(REPO_ROOT, 'sales', '1-pager');
const ONE_PAGER_PDF_DIR = path.join(ONE_PAGER_DIR, 'output');

marked.setOptions({
  gfm: true,
  breaks: false,
});

function readAsset(name) {
  return fs.readFileSync(path.join(ASSETS_DIR, name), 'utf8');
}

function resolveOutputPath(inputPath) {
  const absInput = path.resolve(inputPath);
  const basename = path.basename(absInput, path.extname(absInput)) + '.pdf';

  if (path.dirname(absInput) === ONE_PAGER_DIR) {
    fs.mkdirSync(ONE_PAGER_PDF_DIR, { recursive: true });
    return path.join(ONE_PAGER_PDF_DIR, basename);
  }

  return path.join(path.dirname(absInput), basename);
}

function buildHtml(markdown, title, themeName) {
  const body = marked.parse(markdown);
  const wrapper = readAsset('wrapper.html');
  let styles = readAsset('one-pager-print.css');

  if (themeName) {
    const themePath = path.join(THEMES_DIR, `${themeName}.css`);
    if (!fs.existsSync(themePath)) {
      const available = fs.readdirSync(THEMES_DIR)
        .filter((f) => f.endsWith('.css'))
        .map((f) => path.basename(f, '.css'))
        .join(', ');
      throw new Error(`Theme "${themeName}" not found. Available: ${available}`);
    }
    styles += '\n' + fs.readFileSync(themePath, 'utf8');
  }

  return wrapper
    .replace('{{TITLE}}', title)
    .replace('{{STYLES}}', styles)
    .replace('{{BODY}}', body);
}

async function exportPdf(inputPath, themeName) {
  const absInput = path.resolve(inputPath);

  if (!fs.existsSync(absInput)) {
    throw new Error(`File not found: ${absInput}`);
  }

  if (path.extname(absInput).toLowerCase() !== '.md') {
    throw new Error(`Expected a .md file: ${absInput}`);
  }

  const markdown = fs.readFileSync(absInput, 'utf8');
  const title = path.basename(absInput, '.md');
  const html = buildHtml(markdown, title, themeName);
  const outputPath = resolveOutputPath(absInput);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'load' });
    await page.pdf({
      path: outputPath,
      format: 'Letter',
      printBackground: true,
      margin: { top: '0.7in', bottom: '0.7in', left: '0.8in', right: '0.8in' },
    });
  } finally {
    await browser.close();
  }

  return outputPath;
}

function parseArgs(args) {
  let theme = null;
  let allOnePagers = false;
  const files = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--theme' && i + 1 < args.length) {
      theme = args[++i];
    } else if (args[i] === '--all-one-pagers') {
      allOnePagers = true;
    } else {
      files.push(args[i]);
    }
  }

  if (args.length === 0) {
    console.error('Usage: node export-pdf.js [--theme <name>] <file.md> [file2.md ...]');
    console.error('       node export-pdf.js [--theme <name>] --all-one-pagers');
    console.error('Themes: ocean, indigo, crimson, gold, slate (default: green/teal)');
    process.exit(1);
  }

  if (allOnePagers) {
    if (!fs.existsSync(ONE_PAGER_DIR)) {
      throw new Error(`One-pager directory not found: ${ONE_PAGER_DIR}`);
    }
    const onePagerFiles = fs
      .readdirSync(ONE_PAGER_DIR)
      .filter((name) => name.endsWith('.md'))
      .map((name) => path.join(ONE_PAGER_DIR, name))
      .sort();
    return { theme, files: onePagerFiles };
  }

  return { theme, files: files.map((f) => path.resolve(f)) };
}

async function main() {
  const { theme, files } = parseArgs(process.argv.slice(2));

  if (files.length === 0) {
    console.error('No markdown files matched.');
    process.exit(1);
  }

  const outputs = [];

  for (const input of files) {
    const output = await exportPdf(input, theme);
    outputs.push({ input, output });
    console.log(`Exported: ${output}${theme ? ` [${theme}]` : ''}`);
  }

  console.log(`\nDone — ${outputs.length} PDF${outputs.length === 1 ? '' : 's'} generated.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
