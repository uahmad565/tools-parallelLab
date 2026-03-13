import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const distDir = path.join(projectRoot, 'dist');

const siteUrl = (process.env.SITE_URL || process.env.VITE_SITE_URL || '').replace(/\/$/, '');

const examPages = [
  {
    key: 'az-305',
    route: '/az-305-practice-simulator',
    title: 'AZ-305 Practice Simulator | Azure Solutions Architect Mock Assessment',
    description:
      'Practice AZ-305 with an Azure Solutions Architect simulator covering compute, storage, identity, networking, governance, and business continuity.',
    keywords:
      'AZ-305 practice simulator, Azure Solutions Architect practice test, AZ-305 mock assessment, AZ-305 exam questions',
    eyebrow: 'Azure Solutions Architect Expert',
    headline: 'AZ-305 Practice Simulator',
    subtitle:
      'Rehearse architecture decisions across compute, storage, identity, networking, governance, and business continuity with instant answer review.',
    highlightPills: ['111 unique questions', 'Scenario-heavy practice', 'Topic scorecards', 'Instant rationale review'],
    focusAreas: [
      'Compute design',
      'Storage and data',
      'Identity and access',
      'Networking',
      'Business continuity',
      'Governance',
    ],
    simulatorIntro:
      'This route is built as an exam-specific practice page: you get crawlable context up front, then a full in-app simulator once you start.',
    benefits: [
      'Review one question at a time before moving forward.',
      'See rationale text as soon as you check your answer.',
      'Finish with topic-level scoring so weak domains are obvious.',
    ],
    faq: [
      {
        question: 'What does this AZ-305 simulator cover?',
        answer:
          'It focuses on Azure architecture decisions across compute, data, identity, networking, governance, and resiliency.',
      },
      {
        question: 'How does the practice flow work?',
        answer:
          'You choose an answer, check it, review the rationale and correct option list, then continue to the next question.',
      },
      {
        question: 'Is it useful for weak-area review?',
        answer:
          'Yes. The results table groups performance by topic so you can see which architecture domains need another pass.',
      },
    ],
  },
  {
    key: 'az-700',
    route: '/az-700-practice-simulator',
    title: 'AZ-700 Practice Simulator | Azure Networking Mock Assessment',
    description:
      'Practice AZ-700 with a dedicated Azure networking simulator covering virtual networks, connectivity, security, load balancing, DNS, and operations.',
    keywords:
      'AZ-700 practice simulator, Azure networking practice test, AZ-700 mock assessment, Azure network engineer questions',
    eyebrow: 'Azure Network Engineer Associate',
    headline: 'AZ-700 Practice Simulator',
    subtitle:
      'Practice Azure networking questions covering virtual networks, connectivity, security, load balancing, DNS, and monitoring with feedback after every answer.',
    highlightPills: ['180 unique questions', 'Connectivity depth', 'Networking focus', 'Question-by-question feedback'],
    focusAreas: [
      'Virtual networks',
      'Hybrid connectivity',
      'Security controls',
      'Load balancing',
      'DNS',
      'Monitoring and ops',
    ],
    simulatorIntro:
      'This page is designed as a dedicated AZ-700 landing route with an embedded simulator, so the exam content and the tool stay in one place.',
    benefits: [
      'Work through networking questions in a fixed check-answer-next loop.',
      'Inspect rationale text before you continue.',
      'Use the topic summary to pinpoint weak networking domains quickly.',
    ],
    faq: [
      {
        question: 'What does this AZ-700 simulator focus on?',
        answer:
          'It focuses on Azure networking domains such as virtual networks, hybrid connectivity, security, load balancing, DNS, and monitoring.',
      },
      {
        question: 'Do you get feedback after each question?',
        answer:
          'Yes. Every question is checked in place, with rationale and correct answers shown before you move to the next one.',
      },
      {
        question: 'Can you use it for short review sessions?',
        answer: 'Yes. The simulator is optimized for quick networking practice loops and repeat attempts.',
      },
    ],
  },
];

const practiceHub = {
  route: '/practice-simulators',
  title: 'Azure Practice Simulators | AZ-305 and AZ-700 Mock Assessments',
  description:
    'Browse dedicated AZ-305 and AZ-700 practice simulator pages with instant feedback, topic summaries, and role-based Azure exam prep.',
  keywords: 'Azure practice simulators, AZ-305 practice test, AZ-700 practice test, Azure exam prep',
};

const baseTemplate = await readFile(path.join(distDir, 'index.html'), 'utf8');

await writeRoute({
  route: practiceHub.route,
  title: practiceHub.title,
  description: practiceHub.description,
  keywords: practiceHub.keywords,
  structuredData: null,
  bodyContent: renderPracticeHubPage(examPages),
  activeNav: 'practice',
});

for (const page of examPages) {
  await writeRoute({
    route: page.route,
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
    bodyContent: renderExamPage(page),
    activeNav: 'practice',
  });
}

await writeFile(
  path.join(distDir, 'robots.txt'),
  [`User-agent: *`, `Allow: /`, `Sitemap: ${absoluteUrl('/sitemap.xml')}`].join('\n'),
  'utf8',
);

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${absoluteUrl('/')}</loc></url>
  <url><loc>${absoluteUrl(practiceHub.route)}</loc></url>
${examPages.map((page) => `  <url><loc>${absoluteUrl(page.route)}</loc></url>`).join('\n')}
</urlset>
`;

await writeFile(path.join(distDir, 'sitemap.xml'), sitemap, 'utf8');

async function writeRoute({ route, title, description, keywords, structuredData, bodyContent, activeNav }) {
  const html = baseTemplate
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeAttribute(description)}" />`)
    .replace(/<meta name="keywords" content="[^"]*"\s*\/>/, `<meta name="keywords" content="${escapeAttribute(keywords)}" />`)
    .replace('<div id="root"></div>', `<div id="root">${renderAppShell(bodyContent, activeNav)}</div>`)
    .replace('</head>', `${renderHeadTags({ route, title, description, structuredData })}\n  </head>`);

  const outputDir = path.join(distDir, trimLeadingSlash(route));
  await mkdir(outputDir, { recursive: true });
  await writeFile(path.join(outputDir, 'index.html'), html, 'utf8');
}

function renderAppShell(pageContent, activeNav) {
  return `
<div class="app">
  ${renderNavbar(activeNav)}
  <main class="main-content">
    ${pageContent}
  </main>
  ${renderFooter()}
</div>`.trim();
}

function renderNavbar(activeNav) {
  return `
<nav class="navbar">
  <div class="navbar-container">
    <a href="/" class="navbar-brand">
      <span class="brand-logo">🔨</span>
      <span class="brand-name">ParallelLabTools</span>
    </a>
    <div class="navbar-menu">
      <a href="/tools" class="nav-item">All Tools</a>
      <a href="/practice-simulators" class="nav-item ${activeNav === 'practice' ? 'active' : ''}">Practice Exams</a>
      <a href="/csv-to-csharp" class="nav-item">CSV to C#</a>
      <a href="/about" class="nav-item">About</a>
      <a href="/privacy" class="nav-item">Privacy</a>
    </div>
  </div>
</nav>`.trim();
}

function renderFooter() {
  return `
<footer class="app-footer">
  <div class="footer-content">
    <p>© 2024 Parallel Lab Tools - Forging Tools for Developers</p>
    <div class="footer-links">
      <a href="/privacy">Privacy Policy</a>
      <span class="separator">•</span>
      <a href="/about">About</a>
      <span class="separator">•</span>
      <a href="mailto:hello@devtoolsmith.dev">Contact</a>
    </div>
  </div>
</footer>`.trim();
}

function renderPracticeHubPage(exams) {
  return `
<div class="practice-hub-page">
  <section class="practice-hub-hero">
    <div class="practice-hub-hero__content">
      <div class="practice-hub-hero__badge">Role-Based Practice</div>
      <h1>Azure Practice Simulators</h1>
      <p>Choose a dedicated route for the exam you are studying and run a focused practice flow with instant answer checking, rationale review, and topic-based score summaries.</p>
      <div class="practice-hub-hero__actions">
        <a href="/az-305-practice-simulator" class="practice-hub-btn practice-hub-btn--primary">Start AZ-305</a>
        <a href="/az-700-practice-simulator" class="practice-hub-btn practice-hub-btn--secondary">Start AZ-700</a>
      </div>
    </div>
  </section>
  <section class="practice-hub-directory">
    <div class="practice-hub-heading">
      <h2>Dedicated exam routes</h2>
      <p>Each simulator page has its own positioning, exam focus, and study path inside the app.</p>
    </div>
    <div class="practice-hub-grid">
      ${exams.map((exam) => `
      <article class="practice-card practice-card--${exam.key}">
        <div class="practice-card__topline">
          <span class="practice-card__icon">${escapeHtml(exam.key === 'az-305' ? '🏗️' : '🌐')}</span>
          <span class="practice-card__eyebrow">${escapeHtml(exam.eyebrow)}</span>
        </div>
        <h3>${escapeHtml(exam.headline)}</h3>
        <p>${escapeHtml(exam.description)}</p>
        <div class="practice-card__chips">
          ${exam.highlightPills.map((pill) => `<span>${escapeHtml(pill)}</span>`).join('')}
        </div>
        <ul class="practice-card__topics">
          ${exam.focusAreas.map((area) => `<li>${escapeHtml(area)}</li>`).join('')}
        </ul>
        <a href="${exam.route}" class="practice-card__cta">Open ${escapeHtml(exam.key.toUpperCase())} Simulator</a>
      </article>`).join('')}
    </div>
  </section>
  <section class="practice-hub-method">
    <div class="practice-hub-heading">
      <h2>How the flow works</h2>
    </div>
    <div class="practice-hub-method__grid">
      <article>
        <h3>Choose your track</h3>
        <p>Pick the architecture or networking route that matches the exam objective you are studying.</p>
      </article>
      <article>
        <h3>Check before next</h3>
        <p>Every question stays on screen until you validate your answer and review the explanation.</p>
      </article>
      <article>
        <h3>Review weak domains</h3>
        <p>Results are grouped by detected topic so you can aim the next study session more precisely.</p>
      </article>
    </div>
  </section>
</div>`.trim();
}

function renderExamPage(page) {
  return `
<div class="exam-page exam-page--${page.key}">
  <section class="exam-page__hero">
    <div class="exam-page__hero-copy">
      <div class="exam-page__eyebrow">${escapeHtml(page.eyebrow)}</div>
      <h1>${escapeHtml(page.headline)}</h1>
      <p>${escapeHtml(page.subtitle)}</p>
      <div class="exam-page__badges">
        ${page.highlightPills.map((pill) => `<span>${escapeHtml(pill)}</span>`).join('')}
      </div>
      <div class="exam-page__hero-actions">
        <a href="${page.route}#simulator" class="exam-page__primary-btn">Start ${escapeHtml(page.key.toUpperCase())} Practice</a>
        <a href="/practice-simulators" class="exam-page__secondary-btn">Browse all practice routes</a>
      </div>
    </div>
  </section>
  <section class="exam-page__overview">
    <article class="exam-page__overview-card">
      <h2>Exam focus</h2>
      <p>${escapeHtml(page.simulatorIntro)}</p>
      <ul>
        ${page.benefits.map((benefit) => `<li>${escapeHtml(benefit)}</li>`).join('')}
      </ul>
    </article>
    <article class="exam-page__overview-card">
      <h2>Coverage areas</h2>
      <div class="exam-page__topics">
        ${page.focusAreas.map((area) => `<span>${escapeHtml(area)}</span>`).join('')}
      </div>
    </article>
  </section>
  <section class="exam-page__faq">
    ${page.faq.map((item) => `
      <article class="exam-page__faq-card">
        <h3>${escapeHtml(item.question)}</h3>
        <p>${escapeHtml(item.answer)}</p>
      </article>`).join('')}
  </section>
  <section class="exam-page__simulator" id="simulator">
    <div class="exam-page__simulator-header">
      <div>
        <div class="exam-page__eyebrow">Inline Simulator</div>
        <h2>${escapeHtml(page.headline)}</h2>
      </div>
      <p>Run a check-answer-next loop without leaving the page.</p>
    </div>
    <div class="exam-page__empty-state">
      <h3>Ready for a focused practice session?</h3>
      <p>Start the simulator when you want shuffled questions, instant answer checking, and topic-based results.</p>
      <button type="button" class="exam-page__primary-btn">Launch ${escapeHtml(page.key.toUpperCase())}</button>
    </div>
  </section>
</div>`.trim();
}

function renderHeadTags({ route, title, description, structuredData }) {
  const canonicalUrl = absoluteUrl(route);
  const parts = [
    `    <meta name="robots" content="index,follow" />`,
    `    <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />`,
    `    <meta property="og:type" content="website" />`,
    `    <meta property="og:site_name" content="Parallel Lab Tools" />`,
    `    <meta property="og:title" content="${escapeAttribute(title)}" />`,
    `    <meta property="og:description" content="${escapeAttribute(description)}" />`,
    `    <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />`,
    `    <meta name="twitter:card" content="summary" />`,
    `    <meta name="twitter:title" content="${escapeAttribute(title)}" />`,
    `    <meta name="twitter:description" content="${escapeAttribute(description)}" />`,
  ];

  if (structuredData) {
    parts.push(`    <script type="application/ld+json">${JSON.stringify(structuredData)}</script>`);
  }

  return parts.join('\n');
}

function absoluteUrl(route) {
  return siteUrl ? `${siteUrl}${route}` : route;
}

function trimLeadingSlash(value) {
  return value.replace(/^\/+/, '');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
