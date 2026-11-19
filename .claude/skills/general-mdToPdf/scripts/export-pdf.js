#!/usr/bin/env node
'use strict';

const { chromium } = require('playwright');
const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

const SKILL_DIR = path.join(__dirname, '..');
const REPO_ROOT = path.join(SKILL_DIR, '..', '..', '..');
const ASSETS_DIR = path.join(SKILL_DIR, 'assets');
const BRAND_TOKENS = path.join(REPO_ROOT, 'marketing', 'brand', 'brand-tokens.css');
const DEFAULT_TOKENS = path.join(ASSETS_DIR, 'default-brand-tokens.css');
const ONE_PAGER_DIR = path.join(REPO_ROOT, 'sales', 'collateral', '1-pager');
const ONE_PAGER_PDF_DIR = path.join(ONE_PAGER_DIR, 'output');

marked.setOptions({
  gfm: true,
  breaks: false,
});

function readAsset(name) {
  return fs.readFileSync(path.join(ASSETS_DIR, name), 'utf8');
}

function readCompanyDomain() {
  const companyPath = path.join(REPO_ROOT, 'company.json');
  const { domain } = JSON.parse(fs.readFileSync(companyPath, 'utf8'));
  if (!domain) {
    throw new Error(`"domain" is empty in ${companyPath}. Run the general-companySetup skill first.`);
  }
  return domain;
}

// The company's brand tokens if they exist, otherwise this skill's default look.
// They go first in the <style> block so an @import for web fonts stays valid.
let warnedDefaultTokens = false;
function readBrandTokens() {
  if (fs.existsSync(BRAND_TOKENS)) {
    return fs.readFileSync(BRAND_TOKENS, 'utf8');
  }
  if (!warnedDefaultTokens) {
    console.warn(
      `Warning: ${path.relative(REPO_ROOT, BRAND_TOKENS)} not found, using the default look.\n` +
        '         Write it from marketing/brand/brand-guidelines.md (general-companySetup) to apply the brand.'
    );
    warnedDefaultTokens = true;
  }
  return fs.readFileSync(DEFAULT_TOKENS, 'utf8');
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

function buildHtml(markdown, title) {
  const body = marked.parse(markdown);
  const wrapper = readAsset('wrapper.html');
  const layout = readAsset('one-pager-print.css').replaceAll('{{COMPANY_DOMAIN}}', readCompanyDomain());
  const styles = readBrandTokens() + '\n' + layout;

  return wrapper
    .replace('{{TITLE}}', title)
    .replace('{{STYLES}}', styles)
    .replace('{{BODY}}', body);
}

async function exportPdf(inputPath) {
  const absInput = path.resolve(inputPath);

  if (!fs.existsSync(absInput)) {
    throw new Error(`File not found: ${absInput}`);
  }

  if (path.extname(absInput).toLowerCase() !== '.md') {
    throw new Error(`Expected a .md file: ${absInput}`);
  }

  const markdown = fs.readFileSync(absInput, 'utf8');
  const title = path.basename(absInput, '.md');
  const html = buildHtml(markdown, title);
  const outputPath = resolveOutputPath(absInput);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
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
  let allOnePagers = false;
  const files = [];

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--all-one-pagers') {
      allOnePagers = true;
    } else {
      files.push(args[i]);
    }
  }

  if (args.length === 0) {
    console.error('Usage: node export-pdf.js <file.md> [file2.md ...]');
    console.error('       node export-pdf.js --all-one-pagers');
    console.error('Colors and fonts come from marketing/brand/brand-tokens.css (default look if it is missing).');
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
    return { files: onePagerFiles };
  }

  return { files: files.map((f) => path.resolve(f)) };
}

async function main() {
  const { files } = parseArgs(process.argv.slice(2));

  if (files.length === 0) {
    console.error('No markdown files matched.');
    process.exit(1);
  }

  const outputs = [];

  for (const input of files) {
    const output = await exportPdf(input);
    outputs.push({ input, output });
    console.log(`Exported: ${output}`);
  }

  console.log(`\nDone: ${outputs.length} PDF${outputs.length === 1 ? '' : 's'} generated.`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
