// Gera todos os SVGs do README de perfil — português em assets/ e inglês em assets/en/.
// Uso: node scripts/render.mjs   (GITHUB_TOKEN opcional — habilita commits/PRs/contribuições)
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const USER = "EvertonSantosBR";
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKEN = process.env.GITHUB_TOKEN;

// ─── Identidade visual ────────────────────────────────────────────────
const C = {
  bg: "#0d1117", bg2: "#0b1a33", surface: "#161b22", border: "#30363d",
  text: "#e6edf3", muted: "#8b949e", dim: "#6e7681",
  blue: "#58a6ff", blueDeep: "#1f6feb", green: "#3fb950",
  teal: "#39c5cf", amber: "#d29922", purple: "#a371f7", coral: "#f78166",
};
const SANS = "'Segoe UI',Ubuntu,'Helvetica Neue',Arial,sans-serif";
const MONO = "'JetBrains Mono','Cascadia Code','SFMono-Regular',Consolas,'Liberation Mono',monospace";
const LANG_COLORS = {
  JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5", "C#": "#178600",
  Java: "#b07219", HTML: "#e34c26", CSS: "#663399", Solidity: "#AA6746", Batchfile: "#C1F12E",
};

// ─── Textos ───────────────────────────────────────────────────────────
const T = {
  pt: {
    dateLocale: "pt-BR",
    hello: "// olá, eu sou",
    heroChips: ["Node.js", "C# / .NET", "MySQL", "APIs REST"],
    heroStudy: "Sistemas de Informação @ UNIFACS  ·  Salvador, BA",
    heroFlow: "request → auth → regra de negócio → persistência",
    heroDesc: "Banner animado com nome, cargo e um diagrama de uma requisição passando por API, serviços e banco de dados.",
    term: {
      title: "Terminal: Everton Santos, Backend Developer em Salvador/BA; formado em Desenvolvimento Web, cursando Sistemas de Informação na UNIFACS; programa desde 2021.",
      edu: "cat formacao.txt", focus: "ls ./foco", journey: "cat jornada.log",
      eduOut: [["Desenvolvimento Web", "text"], [" (concluído)  ·  ", "muted"], ["Sistemas de Informação", "text"], [" @ UNIFACS (cursando)", "muted"]],
      focusOut: "apis-rest/  regras-de-negocio/  modelagem-relacional/  arquitetura-em-camadas/  testes/",
      journeyOut: [["2021", "amber"], [" HTML·CSS·JS  →  ", "muted"], ["2023", "amber"], [" React  →  ", "muted"], ["hoje", "green"], [" back-end com Node.js e C#/.NET", "text"]],
    },
    footer: ["obrigado pela visita", "aberto a conversas sobre back-end, projetos e oportunidades", "Obrigado pela visita"],
    updated: "atualizado",
    stats: {
      title: "Visão geral", repos: "Repositórios públicos", stars: "Estrelas recebidas", followers: "Seguidores",
      commits: (y) => `Commits em ${y}`, prs: (y) => `Pull requests em ${y}`, total: "Contribuições (12 meses)",
      langs: "Linguagens utilizadas", active: (y) => `Repos ativos em ${y}`, since: "No GitHub desde",
    },
    langsTitle: "Linguagens por projeto", langsNote: "peso igual por repositório · sem forks",
    contact: { linkedin: "LinkedIn", email: "E-mail", portfolio: "Portfólio", agenda: "Agendar conversa" },
  },
  en: {
    dateLocale: "en-US",
    hello: "// hi, I'm",
    heroChips: ["Node.js", "C# / .NET", "MySQL", "REST APIs"],
    heroStudy: "Information Systems @ UNIFACS  ·  Salvador, Brazil",
    heroFlow: "request → auth → business rules → persistence",
    heroDesc: "Animated banner with name, role and a diagram of a request flowing through API, services and database.",
    term: {
      title: "Terminal: Everton Santos, Backend Developer in Salvador, Brazil; Web Development graduate, studying Information Systems at UNIFACS; coding since 2021.",
      edu: "cat education.txt", focus: "ls ./focus", journey: "cat journey.log",
      eduOut: [["Web Development", "text"], [" (completed)  ·  ", "muted"], ["Information Systems", "text"], [" @ UNIFACS (in progress)", "muted"]],
      focusOut: "rest-apis/  business-rules/  relational-modeling/  layered-architecture/  testing/",
      journeyOut: [["2021", "amber"], [" HTML·CSS·JS  →  ", "muted"], ["2023", "amber"], [" React  →  ", "muted"], ["today", "green"], [" back-end with Node.js and C#/.NET", "text"]],
    },
    footer: ["thanks for visiting", "open to conversations about back-end, projects and opportunities", "Thanks for visiting"],
    updated: "updated",
    stats: {
      title: "Overview", repos: "Public repositories", stars: "Stars earned", followers: "Followers",
      commits: (y) => `Commits in ${y}`, prs: (y) => `Pull requests in ${y}`, total: "Contributions (12 months)",
      langs: "Languages used", active: (y) => `Active repos in ${y}`, since: "On GitHub since",
    },
    langsTitle: "Languages by project", langsNote: "equal weight per repository · no forks",
    contact: { linkedin: "LinkedIn", email: "Email", portfolio: "Portfolio", agenda: "Book a call" },
  },
};

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const monoW = (text, size) => text.length * size * 0.6; // largura aproximada em fonte mono

const baseStyle = `
  .sans{font-family:${SANS}} .mono{font-family:${MONO}}
  .in{opacity:0;animation:up .7s cubic-bezier(.2,.7,.2,1) forwards}
  @keyframes up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
  .blink{animation:blink 1.1s steps(1) infinite}
  @keyframes blink{50%{opacity:0}}
  @media (prefers-reduced-motion:reduce){*{animation:none!important;opacity:1!important}}`;

const delay = (s) => `style="animation-delay:${s.toFixed(2)}s"`;

function chip(x, y, label, color, size = 13) {
  const w = monoW(label, size) + 22;
  return {
    w,
    svg: `<g transform="translate(${x} ${y})"><rect width="${w}" height="${size + 15}" rx="${(size + 15) / 2}" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-opacity=".45"/><text x="11" y="${size + 3}" class="mono" font-size="${size}" fill="${color}">${esc(label)}</text></g>`,
  };
}

function chipRow(x, y, labels, color, size, gap = 8) {
  let cx = x;
  return labels.map((l) => { const c = chip(cx, y, l, color, size); cx += c.w + gap; return c.svg; }).join("");
}

// ─── Hero ─────────────────────────────────────────────────────────────
function hero(t) {
  const W = 1200, H = 320;
  const node = (x, y, w, label, color, d) => `
    <g class="in" ${delay(d)}>
      <rect x="${x}" y="${y}" width="${w}" height="46" rx="10" fill="${C.surface}" stroke="${color}" stroke-opacity=".7"/>
      <circle cx="${x + 16}" cy="${y + 23}" r="4" fill="${color}"><animate attributeName="opacity" values="1;.3;1" dur="2.4s" begin="${d}s" repeatCount="indefinite"/></circle>
      <text x="${x + 30}" y="${y + 28}" class="mono" font-size="14" fill="${C.text}">${label}</text>
    </g>`;
  const packet = (path, color, dur, begin) =>
    `<circle r="4" fill="${color}"><animateMotion path="${path}" dur="${dur}s" begin="${begin}s" repeatCount="indefinite"/></circle>`;

  // Diagrama: client → api → services → mysql, api → audit
  const p1 = "M822 92 H880", p2 = "M950 115 V190", p3 = "M1012 213 H1060", p4 = "M1012 92 H1060";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
<title id="t">Everton Santos — Backend Developer</title>
<desc id="d">${esc(t.heroDesc)}</desc>
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.bg}"/><stop offset="1" stop-color="${C.bg2}"/></linearGradient>
  <radialGradient id="glow" cx=".8" cy=".45" r=".45"><stop offset="0" stop-color="${C.blueDeep}" stop-opacity=".35"/><stop offset="1" stop-color="${C.blueDeep}" stop-opacity="0"/></radialGradient>
  <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="#21262d" stroke-width="1"/></pattern>
  <linearGradient id="gfade" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".15"/><stop offset=".6" stop-color="#fff" stop-opacity=".9"/></linearGradient>
  <mask id="m"><rect width="${W}" height="${H}" fill="url(#gfade)"/></mask>
  <linearGradient id="name" x1="0" x2="1"><stop offset="0" stop-color="${C.text}"/><stop offset="1" stop-color="${C.blue}"/></linearGradient>
  <linearGradient id="edge" x1="0" x2="1"><stop offset="0" stop-color="${C.blue}" stop-opacity="0"/><stop offset=".5" stop-color="${C.blue}"/><stop offset="1" stop-color="${C.blue}" stop-opacity="0"/></linearGradient>
  <clipPath id="clip"><rect width="${W}" height="${H}" rx="20"/></clipPath>
</defs>
<style>${baseStyle}
  .flow{stroke-dasharray:4 7;animation:dash 1s linear infinite}
  @keyframes dash{to{stroke-dashoffset:-22}}
</style>
<g clip-path="url(#clip)">
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)" mask="url(#m)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect y="${H - 2}" width="${W}" height="2" fill="url(#edge)"/>
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="20" fill="none" stroke="${C.border}"/>

<text x="64" y="84" class="mono in" font-size="16" fill="${C.blue}" ${delay(0.1)}>${esc(t.hello)}</text>
<text x="62" y="148" class="sans in" font-size="64" font-weight="700" fill="url(#name)" ${delay(0.25)}>Everton Santos</text>
<g class="in" ${delay(0.45)}>
  <text x="64" y="192" class="mono" font-size="22" fill="${C.muted}">Backend Developer</text>
  <rect x="${64 + monoW("Backend Developer", 22) + 6}" y="174" width="11" height="22" fill="${C.blue}" class="blink"/>
</g>
<g class="in" ${delay(0.65)}>${chipRow(64, 222, t.heroChips, C.blue, 13)}</g>
<g class="in" ${delay(0.85)}>
  <circle cx="70" cy="279" r="5" fill="${C.green}"><animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;.5;1" dur="2s" repeatCount="indefinite"/></circle>
  <text x="84" y="284" class="mono" font-size="14" fill="${C.muted}">${esc(t.heroStudy)}</text>
</g>

<g fill="none" stroke-width="2">
  <path d="${p1}" stroke="${C.blue}" class="flow" opacity=".7"/>
  <path d="${p2}" stroke="${C.blue}" class="flow" opacity=".7"/>
  <path d="${p3}" stroke="${C.blue}" class="flow" opacity=".7"/>
  <path d="${p4}" stroke="${C.purple}" class="flow" opacity=".6"/>
</g>
${node(712, 69, 110, "client", C.teal, 0.9)}
${node(880, 69, 132, "api / jwt", C.blue, 1.05)}
${node(880, 190, 132, "services", C.blue, 1.2)}
${node(1060, 69, 110, "audit", C.purple, 1.35)}
${node(1060, 190, 110, "mysql", C.amber, 1.5)}
<text x="712" y="286" class="mono in" font-size="12" fill="${C.dim}" ${delay(1.7)}>${esc(t.heroFlow)}</text>
${packet("M822 92 H950 V213 H1060", C.teal, 2.8, 1.8)}
${packet(p4, C.purple, 2.6, 2.4)}
${packet("M1060 222 H950 V100 H822", C.green, 2.8, 3.2)}
</svg>`;
}

// ─── Terminal "sobre mim" ────────────────────────────────────────────
function terminal(t) {
  const W = 1000, lh = 30, x0 = 32, size = 15;
  const colored = (parts) => parts.map(([s, c]) => [s, C[c]]);
  const lines = [
    { cmd: "whoami" },
    { out: [["Everton Santos", C.text], ["  ·  Backend Developer  ·  Salvador, BA", C.muted]] },
    { cmd: t.term.edu },
    { out: colored(t.term.eduOut) },
    { cmd: t.term.focus },
    { out: [[t.term.focusOut, C.blue]] },
    { cmd: t.term.journey },
    { out: colored(t.term.journeyOut) },
  ];
  const H = 70 + lines.length * lh + 44;
  let at = 0.4, y = 78, body = "", clips = "";
  lines.forEach((l, i) => {
    if (l.cmd) {
      const w = monoW(l.cmd, size) + 4, dur = Math.max(0.35, l.cmd.length * 0.045);
      clips += `<clipPath id="c${i}"><rect x="${x0 + 22}" y="${y - 20}" height="28" width="0"><animate attributeName="width" from="0" to="${w}" dur="${dur}s" begin="${at}s" fill="freeze"/></rect></clipPath>`;
      body += `<g opacity="0"><set attributeName="opacity" to="1" begin="${at}s" fill="freeze"/><text x="${x0}" y="${y}" class="mono" font-size="${size}" fill="${C.green}">$</text></g>`;
      body += `<text x="${x0 + 22}" y="${y}" class="mono" font-size="${size}" fill="${C.text}" clip-path="url(#c${i})">${esc(l.cmd)}</text>`;
      at += dur + 0.25;
    } else {
      body += `<text x="${x0}" y="${y}" class="mono" font-size="${size}" opacity="0"><set attributeName="opacity" to="1" begin="${at}s" fill="freeze"/>${l.out.map(([s, c]) => `<tspan fill="${c}">${esc(s)}</tspan>`).join("")}</text>`;
      at += 0.45;
    }
    y += lh;
  });
  body += `<g opacity="0"><set attributeName="opacity" to="1" begin="${at}s" fill="freeze"/><text x="${x0}" y="${y}" class="mono" font-size="${size}" fill="${C.green}">$</text><rect x="${x0 + 22}" y="${y - 15}" width="9" height="18" fill="${C.blue}" class="blink"/></g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t">
<title id="t">${esc(t.term.title)}</title>
<defs>${clips}</defs>
<style>${baseStyle}</style>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="14" fill="${C.bg}" stroke="${C.border}"/>
<path d="M.5 14.5a14 14 0 0 1 14-14h${W - 29}a14 14 0 0 1 14 14V40H.5z" fill="${C.surface}"/>
<line x1="0" y1="40" x2="${W}" y2="40" stroke="${C.border}"/>
<circle cx="24" cy="20" r="6" fill="#ff5f57"/><circle cx="44" cy="20" r="6" fill="#febc2e"/><circle cx="64" cy="20" r="6" fill="#28c840"/>
<text x="${W / 2}" y="25" text-anchor="middle" class="mono" font-size="13" fill="${C.dim}">everton@github: ~</text>
${body}
</svg>`;
}

// ─── Divisor ──────────────────────────────────────────────────────────
function divider() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="12" viewBox="0 0 1000 12" role="presentation">
<defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="${C.blue}" stop-opacity="0"/><stop offset=".5" stop-color="${C.blue}"/><stop offset="1" stop-color="${C.blue}" stop-opacity="0"/></linearGradient></defs>
<line x1="0" y1="6" x2="1000" y2="6" stroke="${C.border}" stroke-width="1"/>
<rect x="-300" y="5" width="300" height="2" fill="url(#g)"><animate attributeName="x" from="-300" to="1000" dur="4s" repeatCount="indefinite"/></rect>
<circle cx="500" cy="6" r="3.5" fill="${C.bg}" stroke="${C.blue}" stroke-width="1.5"/>
</svg>`;
}

// ─── Rodapé ───────────────────────────────────────────────────────────
function footer(t) {
  const W = 1200, H = 150;
  const wave = (y, amp, color, op, dur, dir) => {
    let d = `M-1200 ${y}`;
    for (let x = -1200; x < 2400; x += 300) d += ` q75 ${-amp} 150 0 t150 0`;
    d += ` V${H} H-1200 Z`;
    return `<path d="${d}" fill="${color}" fill-opacity="${op}"><animateTransform attributeName="transform" type="translate" from="0 0" to="${dir * 300} 0" dur="${dur}s" repeatCount="indefinite"/></path>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(t.footer[2])}">
<defs><clipPath id="r"><rect width="${W}" height="${H}" rx="20"/></clipPath></defs>
<style>${baseStyle}</style>
<g clip-path="url(#r)">
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  ${wave(92, 14, C.blueDeep, 0.25, 7, 1)}
  ${wave(104, 10, C.blue, 0.18, 5, -1)}
  ${wave(118, 8, C.blueDeep, 0.35, 9, 1)}
</g>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="20" fill="none" stroke="${C.border}"/>
<text x="${W / 2}" y="58" text-anchor="middle" class="mono" font-size="18" fill="${C.text}">${esc(t.footer[0])}<tspan fill="${C.blue}" class="blink">_</tspan></text>
<text x="${W / 2}" y="84" text-anchor="middle" class="mono" font-size="12" fill="${C.muted}">${esc(t.footer[1])}</text>
</svg>`;
}

// ─── Cards de projeto ────────────────────────────────────────────────
// Campos com { pt, en } são traduzidos; os demais valem para os dois idiomas.
const PROJECTS = [
  {
    file: "peopleos", repo: null, n: "01", featured: true, color: C.blue,
    title: "PeopleOS",
    tag: { pt: "back-end · rh & folha de pagamento", en: "back-end · hr & payroll" },
    lines: {
      pt: [
        "Sistema de RH com motor de cálculo de folha: 13º salário parcelado, salário",
        "proporcional, pensão alimentícia e holerites em PDF. Controle de acesso por",
        "perfil e por unidade, trilha de auditoria, migrations e 20+ suítes de teste.",
      ],
      en: [
        "HR system with a payroll calculation engine: 13th salary in installments,",
        "prorated pay, alimony deductions and PDF payslips. Role- and unit-based",
        "access control, audit trail, migrations and 20+ test suites.",
      ],
    },
    stack: ["Node.js", "Express 5", "MySQL", "JWT", "bcrypt", "PDFKit", "React 19", "node:test"],
    badge: { pt: "privado · em desenvolvimento", en: "private · in development" },
    highlights: {
      pt: [["11", "módulos de API REST"], ["6", "middlewares (auth, RBAC, escopo)"], ["20+", "suítes de teste automatizado"]],
      en: [["11", "REST API modules"], ["6", "middlewares (auth, RBAC, scope)"], ["20+", "automated test suites"]],
    },
  },
  {
    file: "libras-bridge", repo: "LIBRAS-Bridge", n: "02", color: C.teal,
    title: "LIBRAS Bridge",
    tag: { pt: "visão computacional · a11y", en: "computer vision · a11y" },
    lines: {
      pt: [
        "Comunicação entre médicos e pacientes surdos: sinais",
        "em LIBRAS viram texto e voz (MediaPipe + classificador",
        "ML) e o texto do médico vira LIBRAS pelo VLibras.",
      ],
      en: [
        "Doctor–deaf patient communication: LIBRAS signs",
        "become text and speech (MediaPipe + ML classifier)",
        "and the doctor's text becomes LIBRAS via VLibras.",
      ],
    },
    stack: ["Python", "OpenCV", "MediaPipe", "scikit-learn"],
  },
  {
    file: "greenchain", repo: "GreenChain", n: "03", color: C.green,
    title: "GreenChain",
    tag: { pt: "web3 · sustentabilidade", en: "web3 · sustainability" },
    lines: {
      pt: [
        "Plataforma Recycle-to-Earn: lixeiras inteligentes",
        "(simulador IoT) recompensam reciclagem com tokens",
        "$GREEN na Celo. Painéis para usuário e empresa.",
      ],
      en: [
        "Recycle-to-Earn platform: smart bins (IoT",
        "simulator) reward recycling with $GREEN tokens",
        "on Celo. Dashboards for users and companies.",
      ],
    },
    stack: ["Next.js", "TypeScript", "Solidity", "Hardhat"],
  },
  {
    file: "bibliocontrole", repo: "BiblioControle", n: "04", color: C.amber,
    title: "BiblioControle",
    tag: { pt: "back-end · gestão", en: "back-end · management" },
    lines: {
      pt: [
        "Gestão de bibliotecas: cadastro de leitores e livros,",
        "empréstimos, devoluções, disponibilidade do acervo e",
        "histórico — com versão desktop via Electron.",
      ],
      en: [
        "Library management: readers and books, loans,",
        "returns, catalog availability and lending history",
        "— with a desktop version built on Electron.",
      ],
    },
    stack: ["Node.js", "Express", "MySQL", "EJS", "Electron"],
  },
  {
    file: "appweb-iel", repo: "APPWEB---IEL", n: "05", color: C.purple,
    title: { pt: "Gestão de Alunos — IEL", en: "Student Management — IEL" },
    tag: "full stack · .net",
    lines: {
      pt: [
        "CRUD de alunos com busca por CPF: API em ASP.NET",
        "com Entity Framework Core sobre SQL Server e",
        "interface em React com Bootstrap.",
      ],
      en: [
        "Student CRUD with search by CPF: ASP.NET API",
        "with Entity Framework Core on SQL Server and a",
        "React + Bootstrap interface.",
      ],
    },
    stack: ["C#", "ASP.NET", "EF Core", "SQL Server", "React"],
  },
];

const pick = (v, lang) => (v && typeof v === "object" && !Array.isArray(v) ? v[lang] : v);

function projectCard(src, meta, t, lang) {
  const p = Object.fromEntries(Object.entries(src).map(([k, v]) => [k, pick(v, lang)]));
  const W = p.featured ? 1000 : 490, H = p.featured ? 250 : 270;
  const r = 16, per = Math.round(2 * (W - 4 + H - 4) - 8 * r + 2 * Math.PI * r);
  const metaText = p.badge ?? (meta ? `${meta.stars ? `★ ${meta.stars}  ·  ` : ""}${t.updated} ${meta.updated[lang]}` : "");
  const metaW = monoW(metaText, 12);
  const descY = p.featured ? 128 : 124;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="t d">
<title id="t">${esc(p.title)}</title>
<desc id="d">${esc(p.lines.join(" "))} Stack: ${esc(p.stack.join(", "))}.</desc>
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.surface}"/><stop offset="1" stop-color="${C.bg}"/></linearGradient>
  <radialGradient id="glow" cx="1" cy="0" r=".8"><stop offset="0" stop-color="${p.color}" stop-opacity=".18"/><stop offset="1" stop-color="${p.color}" stop-opacity="0"/></radialGradient>
</defs>
<style>${baseStyle}
  .orbit{stroke-dasharray:120 ${per - 120};animation:orbit 7s linear infinite}
  @keyframes orbit{to{stroke-dashoffset:-${per}}}</style>
<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="16" fill="url(#bg)" stroke="${C.border}"/>
<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="16" fill="url(#glow)"/>
<rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="16" fill="none" stroke="${p.color}" stroke-width="2" stroke-linecap="round" stroke-opacity=".9" class="orbit"/>
<rect x="28" y="30" width="4" height="${p.featured ? 64 : 62}" rx="2" fill="${p.color}"/>
${p.highlights ? "" : `<text x="${W - 26}" y="${H - 22}" text-anchor="end" class="mono" font-size="${p.featured ? 72 : 56}" font-weight="700" fill="${p.color}" fill-opacity=".08">${p.n}</text>`}
${p.highlights ? `<line x1="660" y1="78" x2="660" y2="206" stroke="${C.border}"/>` + p.highlights.map(([n, label], i) => `<g class="in" ${delay(0.5 + i * 0.15)}><text x="686" y="${104 + i * 44}" class="mono" font-size="26" font-weight="700" fill="${p.color}">${esc(n)}</text><text x="${686 + monoW(n, 26) + 12}" y="${99 + i * 44}" class="sans" font-size="14" fill="${C.muted}">${esc(label)}</text></g>`).join("") : ""}
<g class="in" ${delay(0.1)}>
  <text x="46" y="46" class="mono" font-size="12" fill="${p.color}" letter-spacing=".5">${esc(p.tag.toUpperCase())}</text>
  <text x="46" y="${p.featured ? 86 : 84}" class="sans" font-size="${p.featured ? 32 : 26}" font-weight="700" fill="${C.text}">${esc(p.title)}</text>
</g>
${metaText ? `<g class="in" ${delay(0.2)}><text x="${W - 30}" y="46" text-anchor="end" class="mono" font-size="12" fill="${C.muted}">${esc(metaText)}</text>${p.badge ? `<circle cx="${W - 38 - metaW}" cy="42" r="4" fill="${C.amber}"/>` : ""}</g>` : ""}
<g class="in" ${delay(0.3)}>
${p.lines.map((l, i) => `<text x="46" y="${descY + i * 24}" class="sans" font-size="${p.featured ? 16 : 15}" fill="${C.muted}">${esc(l)}</text>`).join("\n")}
</g>
<g class="in" ${delay(0.45)}>${chipRow(46, H - 58, p.stack, p.color, 12)}</g>
</svg>`;
}

// ─── Dados do GitHub ──────────────────────────────────────────────────
async function gh(path) {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": USER, ...(TOKEN && { Authorization: `Bearer ${TOKEN}` }) },
  });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
}

async function contributions() {
  if (!TOKEN) return null;
  const year = new Date().getUTCFullYear();
  const query = `query($login:String!,$from:DateTime!){user(login:$login){
    year: contributionsCollection(from:$from){totalCommitContributions totalPullRequestContributions restrictedContributionsCount}
    last: contributionsCollection{contributionCalendar{totalContributions}}}}`;
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json", "User-Agent": USER },
    body: JSON.stringify({ query, variables: { login: USER, from: `${year}-01-01T00:00:00Z` } }),
  });
  const json = await res.json();
  if (!res.ok || json.errors) { console.warn("GraphQL indisponível:", json.errors ?? res.status); return null; }
  const u = json.data.user;
  return {
    year,
    commits: u.year.totalCommitContributions + u.year.restrictedContributionsCount,
    prs: u.year.totalPullRequestContributions,
    total: u.last.contributionCalendar.totalContributions,
  };
}

async function loadData() {
  const [user, repos] = await Promise.all([gh(`/users/${USER}`), gh(`/users/${USER}/repos?per_page=100&type=owner`)]);
  const own = repos.filter((r) => !r.fork && r.name.toLowerCase() !== USER.toLowerCase());
  // Cada repositório pesa igual: evita que um build commitado (ex.: .next) domine o gráfico.
  const share = {};
  for (const r of own) {
    const langs = await gh(`/repos/${USER}/${r.name}/languages`);
    const total = Object.values(langs).reduce((a, b) => a + b, 0);
    if (!total) continue;
    for (const [lang, bytes] of Object.entries(langs)) share[lang] = (share[lang] ?? 0) + bytes / total;
  }
  const sum = Object.values(share).reduce((a, b) => a + b, 0);
  const languages = Object.entries(share).map(([name, v]) => ({ name, pct: (v / sum) * 100 })).sort((a, b) => b.pct - a.pct);
  const fmt = (iso, lang) => new Date(iso).toLocaleDateString(T[lang].dateLocale, { month: "short", year: "numeric", timeZone: "UTC" }).replace(".", "").replace(" de ", "/");
  const meta = Object.fromEntries(repos.map((r) => [r.name, { stars: r.stargazers_count, updated: { pt: fmt(r.pushed_at, "pt"), en: fmt(r.pushed_at, "en") } }]));
  return {
    user, languages, meta, contrib: await contributions(),
    stars: own.reduce((a, r) => a + r.stargazers_count, 0),
    activeThisYear: own.filter((r) => new Date(r.pushed_at).getUTCFullYear() === new Date().getUTCFullYear()).length,
  };
}

// ─── Card de estatísticas ────────────────────────────────────────────
const ICONS = {
  repo: "M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z",
  star: "M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z",
  people: "M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z",
  commit: "M11.93 8.5a4.002 4.002 0 0 1-7.86 0H.75a.75.75 0 0 1 0-1.5h3.32a4.002 4.002 0 0 1 7.860 0h3.32a.75.75 0 0 1 0 1.5Zm-1.43-.75a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0Z",
  pr: "M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354Z",
  graph: "M1.5 1.75V13.5h13.75a.75.75 0 0 1 0 1.5H.75a.75.75 0 0 1-.75-.75V1.75a.75.75 0 0 1 1.5 0Zm14.28 2.53-5.25 5.25a.75.75 0 0 1-1.06 0L7 7.06 4.28 9.78a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042l3.25-3.25a.75.75 0 0 1 1.060 0L10 7.94l4.72-4.72a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042Z",
  code: "m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z",
  calendar: "M4.75 0a.75.75 0 0 1 .75.75V2h5V.75a.75.75 0 0 1 1.5 0V2h1.25c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0 1 13.25 16H2.75A1.75 1.75 0 0 1 1 14.25V3.75C1 2.784 1.784 2 2.75 2H4V.75A.75.75 0 0 1 4.75 0ZM2.5 7.5v6.75c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25V7.5Zm10.75-4H2.75a.25.25 0 0 0-.25.25V6h11V3.75a.25.25 0 0 0-.25-.25Z",
};

function cardShell(W, H, title, body, extraStyle = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(title)}">
<style>${baseStyle}${extraStyle}</style>
<rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="16" fill="${C.bg}" stroke="${C.border}"/>
<text x="28" y="44" class="sans" font-size="18" font-weight="600" fill="${C.blue}">${esc(title)}</text>
${body}
</svg>`;
}

function statsCard(d, t) {
  const s = t.stats, year = new Date().getUTCFullYear();
  const since = new Date(d.user.created_at).getUTCFullYear();
  const rows = [
    ["repo", s.repos, d.user.public_repos],
    ["star", s.stars, d.stars],
    ["people", s.followers, d.user.followers],
    ...(d.contrib
      ? [["commit", s.commits(d.contrib.year), d.contrib.commits], ["pr", s.prs(d.contrib.year), d.contrib.prs], ["graph", s.total, d.contrib.total]]
      : [["code", s.langs, d.languages.length], ["graph", s.active(year), d.activeThisYear], ["calendar", s.since, since]]),
  ];
  const body = rows.map(([icon, label, value], i) => {
    const y = 84 + i * 34;
    return `<g class="in" ${delay(0.1 + i * 0.1)}>
  <path d="${ICONS[icon]}" transform="translate(28 ${y - 13})" fill="${C.muted}"/>
  <text x="56" y="${y}" class="sans" font-size="15" fill="${C.text}">${esc(label)}</text>
  <text x="462" y="${y}" text-anchor="end" class="mono" font-size="15" font-weight="700" fill="${C.text}">${esc(value)}</text>
  <line x1="56" y1="${y + 12}" x2="462" y2="${y + 12}" stroke="${C.border}" stroke-dasharray="2 4" opacity="${i === rows.length - 1 ? 0 : 1}"/>
</g>`;
  }).join("\n");
  return cardShell(490, 290, s.title, body);
}

function languagesCard(d, t) {
  const top = d.languages.slice(0, 6);
  const W = 490, barX = 28, barW = W - 56;
  let x = barX;
  const stacked = top.map((l) => {
    const w = (l.pct / 100) * barW;
    const seg = `<rect x="${x.toFixed(1)}" y="64" width="${Math.max(w - 2, 1).toFixed(1)}" height="10" fill="${LANG_COLORS[l.name] ?? C.muted}"/>`;
    x += w;
    return seg;
  }).join("");
  const list = top.map((l, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const lx = 28 + col * 220, ly = 118 + row * 54;
    const color = LANG_COLORS[l.name] ?? C.muted;
    return `<g class="in" ${delay(0.3 + i * 0.08)}>
  <circle cx="${lx + 6}" cy="${ly - 5}" r="6" fill="${color}"/>
  <text x="${lx + 20}" y="${ly}" class="sans" font-size="15" fill="${C.text}">${esc(l.name)}</text>
  <text x="${lx + 200}" y="${ly}" text-anchor="end" class="mono" font-size="14" fill="${C.muted}">${l.pct.toFixed(1)}%</text>
  <rect x="${lx}" y="${ly + 12}" width="200" height="4" rx="2" fill="${C.surface}"/>
  <rect x="${lx}" y="${ly + 12}" width="${Math.max(2, 2 * l.pct).toFixed(1)}" height="4" rx="2" fill="${color}" class="grow" style="animation-delay:${(0.4 + i * 0.08).toFixed(2)}s"/>
</g>`;
  }).join("\n");
  const body = `<clipPath id="bar"><rect x="${barX}" y="64" width="${barW}" height="10" rx="5"/></clipPath>
<g clip-path="url(#bar)"><rect x="${barX}" y="64" width="${barW}" height="10" fill="${C.surface}"/><g class="grow">${stacked}</g></g>
${list}
<text x="28" y="${290 - 18}" class="mono" font-size="11" fill="${C.dim}">${esc(t.langsNote)}</text>`;
  return cardShell(W, 290, t.langsTitle, body,
    `.grow{transform-box:fill-box;transform-origin:left;animation:grow 1.2s cubic-bezier(.2,.7,.2,1) both}@keyframes grow{from{transform:scaleX(0)}to{transform:scaleX(1)}}`);
}

// ─── Botões de contato ───────────────────────────────────────────────
const CONTACT_ICONS = {
  linkedin: `<rect x="0" y="0" width="18" height="18" rx="4" fill="${C.blue}"/><text x="9" y="13.5" text-anchor="middle" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="${C.bg}">in</text>`,
  email: `<path transform="translate(1 1)" fill="${C.blue}" d="M1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25v-8.5C0 2.784.784 2 1.75 2ZM1.5 12.251c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25V5.809L8.38 9.397a.75.75 0 0 1-.76 0L1.5 5.809v6.442Zm13-8.181v-.32a.25.25 0 0 0-.25-.25H1.75a.25.25 0 0 0-.25.25v.32L8 7.88Z"/>`,
  portfolio: `<g fill="none" stroke="${C.blue}" stroke-width="1.6"><circle cx="9" cy="9" r="8"/><ellipse cx="9" cy="9" rx="3.6" ry="8"/><path d="M1 9h16M2.5 4.5h13M2.5 13.5h13"/></g>`,
  agenda: `<path transform="translate(1 1)" fill="${C.text}" d="${ICONS.calendar}"/>`,
};

function contactButton(kind, label, primary = false) {
  const W = 220, H = 52;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}">
<style>${baseStyle}</style>
<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="12" fill="${primary ? C.blueDeep : C.surface}" stroke="${primary ? C.blue : C.border}"/>
<g transform="translate(22 17)">${CONTACT_ICONS[kind]}</g>
<text x="52" y="31" class="sans" font-size="15" font-weight="600" fill="${C.text}">${esc(label)}</text>
<text x="${W - 22}" y="31" text-anchor="end" class="mono" font-size="15" fill="${primary ? C.text : C.blue}">→</text>
</svg>`;
}

// ─── Painel de tech stack ────────────────────────────────────────────
const STACK = [
  { key: "langs", color: C.blue, items: [["js", "JavaScript"], ["ts", "TypeScript"], ["cs", "C#"], ["py", "Python"], ["java", "Java"], ["solidity", "Solidity"]] },
  { key: "backend", color: C.green, items: [["nodejs", "Node.js"], ["express", "Express"], ["dotnet", ".NET"], ["sequelize", "Sequelize"]] },
  { key: "frontend", color: C.teal, items: [["react", "React"], ["nextjs", "Next.js"], ["tailwind", "Tailwind"], ["bootstrap", "Bootstrap"], ["electron", "Electron"], ["html", "HTML"], ["css", "CSS"]] },
  { key: "data", color: C.amber, items: [["mysql", "MySQL"], ["@sqlserver", "SQL Server"]] },
  { key: "ai", color: C.purple, items: [["opencv", "OpenCV"], ["sklearn", "scikit-learn"]] },
  { key: "tools", color: C.coral, items: [["git", "Git"], ["github", "GitHub"], ["vscode", "VS Code"], ["vercel", "Vercel"]] },
];
const LIBS = ["JWT", "bcrypt", "PDFKit", "EF Core", "EJS", "MediaPipe", "Hardhat", "Ethers.js", "Axios", "node:test"];
const LEARNING = [["aws", "AWS"], ["docker", "Docker"], ["linux", "Linux"]];
const STACK_T = {
  pt: { title: "Tech stack", langs: "linguagens", backend: "back-end", frontend: "front-end", data: "banco de dados", ai: "ia & visão", tools: "ferramentas", libs: "bibliotecas do dia a dia", learning: "estudando agora" },
  en: { title: "Tech stack", langs: "languages", backend: "back-end", frontend: "front-end", data: "databases", ai: "ai & vision", tools: "tools", libs: "everyday libraries", learning: "learning now" },
};

// Ícone próprio para o SQL Server (o skillicons não tem)
const SQLSERVER_ICON = `<rect width="256" height="256" rx="60" fill="#242938"/><path d="M62 78v100c0 15 30 27 66 27s66-12 66-27V78" fill="#CC2927"/><ellipse cx="128" cy="78" rx="66" ry="27" fill="#E8584F"/><path d="M62 128c0 15 30 27 66 27s66-12 66-27" fill="none" stroke="#242938" stroke-width="8"/>`;

async function loadIcons(ids) {
  const icons = {};
  for (const id of ids) {
    if (id.startsWith("@")) continue;
    const res = await fetch(`https://skillicons.dev/icons?i=${id}&theme=dark`);
    if (!res.ok) throw new Error(`skillicons ${id}: ${res.status}`);
    const svg = await res.text();
    const inner = svg.slice(svg.indexOf(">", svg.indexOf("<svg", svg.indexOf("<g"))) + 1, svg.lastIndexOf("</svg>", svg.lastIndexOf("</svg>") - 1));
    if (!inner.trim()) throw new Error(`skillicons ${id}: ícone vazio`);
    // Prefixa ids para não colidirem entre ícones embutidos no mesmo SVG
    icons[id] = inner.replace(/id="([^"]+)"/g, `id="${id}-$1"`).replace(/url\(#([^)]+)\)/g, `url(#${id}-$1)`).replace(/href="#([^"]+)"/g, `href="#${id}-$1"`);
  }
  icons["@sqlserver"] = SQLSERVER_ICON;
  return icons;
}

function stackPanel(icons, lang) {
  const s = STACK_T[lang];
  const W = 1000, cw = 492, ch = 142, gap = 16, top = 0;
  const icon = (id, x, y, size = 44) => `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 256 256">${icons[id]}</svg>`;
  const cardBg = (x, y, w, h, color, i) => `
  <g class="in" ${delay(0.1 + i * 0.1)}>
    <rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="14" fill="url(#cbg)" stroke="${C.border}"/>
    <rect x="${x + 0.5}" y="${y + 0.5}" width="${w - 1}" height="${h - 1}" rx="14" fill="${color}" fill-opacity=".05"/>
    <rect x="${x + 24}" y="${y}" width="56" height="2" rx="1" fill="${color}"/>`;
  const label = (x, y, text, color) => `<circle cx="${x + 4}" cy="${y - 4}" r="4" fill="${color}"/><text x="${x + 16}" y="${y}" class="mono" font-size="12" fill="${color}" letter-spacing="1">${esc(text.toUpperCase())}</text>`;

  let body = "";
  STACK.forEach((cat, i) => {
    const x = (i % 2) * (cw + gap), y = top + Math.floor(i / 2) * (ch + gap);
    body += cardBg(x, y, cw, ch, cat.color, i) + label(x + 24, y + 36, s[cat.key], cat.color);
    cat.items.forEach(([id, name], j) => {
      const ix = x + 24 + j * 64;
      body += icon(id, ix, y + 54) + `<text x="${ix + 22}" y="${y + 120}" text-anchor="middle" class="sans" font-size="11" fill="${C.muted}">${esc(name)}</text>`;
    });
    body += `</g>`;
  });

  // Card largo: bibliotecas + estudando
  const y = top + 3 * (ch + gap), h = 150, divX = 700;
  body += cardBg(0, y, W, h, C.blue, 6) + label(24, y + 36, s.libs, C.blue);
  let cx = 24, cy = y + 56;
  for (const lib of LIBS) {
    const w = monoW(lib, 12) + 22;
    if (cx + w > divX - 24) { cx = 24; cy += 38; }
    body += chip(cx, cy, lib, C.blue, 12).svg;
    cx += w + 8;
  }
  body += `<line x1="${divX}" y1="${y + 24}" x2="${divX}" y2="${y + h - 24}" stroke="${C.border}" stroke-dasharray="3 5"/>`;
  body += label(divX + 28, y + 36, s.learning, C.green);
  LEARNING.forEach(([id, name], j) => {
    const ix = divX + 28 + j * 80;
    body += `<g opacity=".92">${icon(id, ix, y + 56, 48)}</g><text x="${ix + 24}" y="${y + 126}" text-anchor="middle" class="sans" font-size="11" fill="${C.muted}">${esc(name)}</text>`;
  });
  body += `</g>`;

  const H = y + h + 2;
  const all = [...STACK.flatMap((c) => c.items.map((it) => it[1])), ...LIBS, ...LEARNING.map((l) => l[1])];
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(s.title + ": " + all.join(", "))}">
<defs><linearGradient id="cbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.surface}"/><stop offset="1" stop-color="${C.bg}"/></linearGradient></defs>
<style>${baseStyle}</style>
${body}
</svg>`;
}

// ─── Seletor de idioma (controle segmentado) ─────────────────────────
function langButton(code, name, side, active) {
  const W = 150, H = 40, r = 10;
  const shape = side === "left"
    ? `M${r} .5H${W}V${H - 0.5}H${r}A${r - 0.5} ${r - 0.5} 0 0 1 .5 ${H - r}V${r}A${r - 0.5} ${r - 0.5} 0 0 1 ${r} .5Z`
    : `M0 .5H${W - r}A${r - 0.5} ${r - 0.5} 0 0 1 ${W - 0.5} ${r}V${H - r}A${r - 0.5} ${r - 0.5} 0 0 1 ${W - r} ${H - 0.5}H0Z`;
  const label = `${code}  ${name}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(name)}">
<style>${baseStyle}</style>
<path d="${shape}" fill="${active ? C.blueDeep : C.surface}" stroke="${active ? C.blue : C.border}"/>
${active ? `<circle cx="22" cy="20" r="4" fill="${C.text}"><animate attributeName="opacity" values="1;.4;1" dur="2s" repeatCount="indefinite"/></circle>` : ""}
<text x="${active ? 84 : W / 2}" y="25" text-anchor="middle" class="sans" font-size="14" font-weight="${active ? 600 : 500}" fill="${active ? C.text : C.muted}"><tspan class="mono" font-size="12" fill="${active ? "#cae8ff" : C.dim}">${esc(code)}</tspan>  ${esc(name)}</text>
</svg>`;
}

// ─── Main ─────────────────────────────────────────────────────────────
async function out(rel, svg) {
  const file = join(ROOT, "assets", rel);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, svg.replace(/\n\s*\n/g, "\n"));
  console.log("✓", rel);
}

await out("divider.svg", divider());
await out("lang/pt-on.svg", langButton("PT", "Português", "left", true));
await out("lang/pt-off.svg", langButton("PT", "Português", "left", false));
await out("lang/en-on.svg", langButton("EN", "English", "right", true));
await out("lang/en-off.svg", langButton("EN", "English", "right", false));

let icons = null;
try { icons = await loadIcons([...STACK.flatMap((c) => c.items.map((i) => i[0])), ...LEARNING.map((l) => l[0])]); } catch (e) { console.warn("skillicons indisponível — painel de stack não atualizado:", e.message); }

let data = null;
try { data = await loadData(); } catch (e) { console.warn("API do GitHub indisponível — cards dinâmicos não atualizados:", e.message); }

for (const [lang, t] of Object.entries(T)) {
  const dir = lang === "pt" ? "" : `${lang}/`;
  await out(`${dir}hero.svg`, hero(t));
  await out(`${dir}terminal.svg`, terminal(t));
  await out(`${dir}footer.svg`, footer(t));
  if (icons) await out(`${dir}stack.svg`, stackPanel(icons, lang));
  for (const kind of ["linkedin", "email", "portfolio", "agenda"])
    await out(`${dir}contact/${kind}.svg`, contactButton(kind, t.contact[kind], kind === "agenda"));
  for (const p of PROJECTS) if (data || !p.repo) await out(`${dir}projects/${p.file}.svg`, projectCard(p, data?.meta[p.repo], t, lang));
  if (data) {
    await out(`${dir}generated/stats.svg`, statsCard(data, t));
    await out(`${dir}generated/languages.svg`, languagesCard(data, t));
  }
}
