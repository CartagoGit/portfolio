<p align="center">
  <img src="./public/images/banner-portfolio.png" alt="Cartago Portfolio — Mario Cabrero Volarich">
</p>

# Cartago Portfolio

The public website of **Mario Cabrero Volarich** (CartagoGit): a zoneless, SSR/SSG front-end built on Angular 22 that surfaces the independent work, the engineering discipline, and the technical lab behind every public repository on the profile.

This repository is the **front-end** of the work documented in [`CartagoGit`](https://github.com/CartagoGit). The README pins the *evidence*; this site delivers the *experience* — running, navigable, auditable.

<p>
  <a href="https://www.linkedin.com/in/mario-cabrero-volarich"><img src="./assets/linkedin-profile-badge.svg" alt="LinkedIn"></a>
  <a href="https://github.com/CartagoGit"><img src="https://img.shields.io/badge/GitHub_CartagoGit_%E2%86%97-181717?style=flat-square&logo=github&logoColor=white" alt="GitHub CartagoGit"></a>
  <a href="https://hub.docker.com/u/cartagodocker"><img src="https://img.shields.io/badge/Docker_Hub_%E2%86%97-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker Hub"></a>
  <a href="https://www.npmjs.com/~cartago-git"><img src="https://img.shields.io/badge/npm_%E2%86%97-CB3837?style=flat-square&logo=npm&logoColor=white" alt="npm packages"></a>
</p>

---

## Table of contents

1. [What it is and who it is for](#1-what-it-is-and-who-it-is-for)
2. [What we want it to be](#2-what-we-want-it-to-be)
3. [The public-content boundary — Beateam is forbidden per se](#3-the-public-content-boundary--beateam-is-forbidden-per-se)
4. [What the repo contains — structure](#4-what-the-repo-contains--structure)
5. [What the site shows — pages and content](#5-what-the-site-shows--pages-and-content)
6. [Technical architecture](#6-technical-architecture)
7. [Stack and dependencies](#7-stack-and-dependencies)
8. [i18n, accessibility, and performance](#8-i18n-accessibility-and-performance)
9. [Design system](#9-design-system)
10. [The `portfolio-content` plugin (MCP Vertex)](#10-the-portfolio-content-plugin-mcp-vertex)
11. [Run, validate, deploy](#11-run-validate-deploy)
12. [Image placeholders](#12-image-placeholders)
13. [Roadmap](#13-roadmap)
14. [Maintenance, licence, and authorship](#14-maintenance-licence-and-authorship)

---

## 1. What it is and who it is for

**Cartago Portfolio** is the public site that materialises Mario Cabrero Volarich's professional profile. It does four things a GitHub README cannot do well:

- **Trajectory**: shows how production front-end is thought of and delivered, not just which libraries are listed on a CV.
- **Independent work**: amplifies the public repositories (`mcp-vertex`, `quickmodel`, `keyer`, `print-cv`, `zoneless-calculator`, `nestgpt`) with narrative, decisions, and demos.
- **Lab**: hosts experimental pieces (visualisations, playgrounds, zoneless demos) that justify the Angular, RxJS, rendering, and motion chops.
- **Availability**: offers a serious contact channel and an explicit declaration of what is accepted and what is not.

### Audience

| Audience | What they come for |
| --- | --- |
| Recruiters and tech leads | Verifiable signals of seniority: architecture, testing, decisions — not just a list of logos. |
| Front-end engineers | How a real Angular 22 zoneless app is built, with SSR, i18n, view transitions, and an MCP plugin that audits the content. |
| Contributors to my projects | A single entry point into the public repos, with context and links. |
| Future me | A log of what I can do today and what I am learning. |

### Relationship to `CartagoGit`

`CartagoGit` (the GitHub profile repository) is the **static calling card**: badges, pinned repos, activity metrics. This portfolio is the **dynamic calling card**: the same information, running, with navigable content, context, and live demos. The README pins the *evidence*; this site delivers the *experience*.

---

## 2. What we want it to be

These are the non-negotiable principles of the project. If a change breaks one of them, the change goes behind a debate.

### Product principles

1. **Content is code.** Nothing in the portfolio lives in a CMS. Every page, every text, every image is in `src/` under review, with types, with tests, and an audit that forbids client terms. It avoids the dreaded "the portfolio rotted."
2. **SSR/SSG by default.** The site must be servable from the edge with static HTML and rehydrate without flicker. This site is a *demonstration of capability*, not a blog; the perceived weight matters.
3. **Zoneless for real.** No `zone.js`. Signals, `OnPush`, `ChangeDetectionStrategy.OnPush` on every component. The whole app is evidence that modern Angular works without zone.
4. **Zoneless + i18n + SSR** is the hard case; any low-effort simplification that drops one of the three is rejected.
5. **Accessibility for real.** Skip links, ARIA roles, keyboard navigation, visible focus, AA contrast in both themes. This is part of the delivery, not an extra.
6. **Performance is a feature.** View transitions, bundle budgets (1 MB error / 500 kB warn), layered CSS, no heavy UI libraries.

### Editorial principles

7. **Privacy before spectacle.** No client name, employer, internal screenshot, domain data, or proprietary code fragment enters this repo. This is not optional and the `portfolio-content` plugin enforces it automatically.
8. **Per-se forbidden roots.** Any name listed in `plugins.portfolio-content.options.perSeRoots` is rejected in **every** form: case-insensitive, with separators (`_ . - , /` whitespace) collapsed. **Beateam is per-se forbidden** — `Beateam`, `beateam`, `BEATEAM`, `Beateam.es`, `beateam-dev`, `BeateamSpain`, `bea team` all trigger the same `error`-severity finding. No neutralisation, no anonymisation, no rephrasing makes it acceptable.
9. **Honest images.** Until each image is produced, `TODO(image)` is used in the HTML and the visual material is marked as stock. The goal is to replace stock as soon as legitimate captures of the project itself exist.
10. **Intentional anonymity.** Professional experience is told by **capabilities** (product, architecture, mobile, quality, systems, tooling) and never by the projects of a given employer. This protects former clients and me.
11. **Explicit state.** Every page must declare what it is: present, in construction, or planned. There are no "decoration" screens.

### Engineering principles

12. **Layered architecture visible.** `app / core / domain / features / shared / styles` is a contract, not a suggestion. The `portfolio_architecture` plugin verifies it.
13. **Typed domain contracts.** Pages, capabilities, panels, playground steps, etc., live in `src/domain/portfolio.types.ts`. Features do not redefine types; they import them.
14. **Single source of truth for content.** `src/domain/portfolio.data.ts` centralises copy, links, technologies, telemetry. Pages read from there.
15. **Local MCP plugin.** The repo includes a [`mcp-vertex`](https://github.com/CartagoGit/mcp-vertex) plugin that introspects the architecture, features, contracts, and audits the public content. This makes the repo *agent-readable* and shields it from drift.
16. **The portfolio audits itself.** If the plugin finds a forbidden term, a per-se root, a temporary image without marker, or a declared component that does not exist on disk, the build fails.

---

## 3. The public-content boundary — Beateam is forbidden per se

This is the single most important editorial rule of the project, and it now lives in two redundant layers.

### Layer 1 — `forbiddenTerms` (explicit list)

The audit scans every public template declared in `plugins.portfolio-content.options.contentPaths` and rejects any substring in the `forbiddenTerms` list, case-insensitive. The portfolio's current list includes:

- `Beateam`, `Beateamer`, `Beateams`, `Beateam Group`, `Beateam Spain`, `Beateam App`, `BeateamApp`, `BeateamGroup`, `BeateamSpain`, `beateam.es`, `beateam.io`, `beateam.com`
- `Mazinger`
- `MDM Platform`
- `Gestion de Tarifas`

### Layer 2 — `perSeRoots` (per-se, by root)

The audit also runs a second pass that matches any root listed in `plugins.portfolio-content.options.perSeRoots` after collapsing the same separators used in the scanner (`_ . - , /` whitespace). Currently the host config declares:

```jsonc
"perSeRoots": ["beateam"]
```

That single entry — `beateam` — is the source of truth for the per-se rule. Every form of it is rejected:

| Form | Caught? |
| --- | --- |
| `Beateam` | ✅ |
| `beateam` | ✅ |
| `BEATEAM` | ✅ |
| `Beateam.es` | ✅ |
| `beateam-dev` | ✅ |
| `BeateamSpain` | ✅ |
| `beateam_dev` | ✅ |
| `bea team` | ✅ |
| `Beateam Group` | ✅ |
| `BeateamApp` | ✅ |
| `my-beateam-tribute` | ✅ |
| `beta.team` | ✅ (the rule is `beateam`, not `beateam`; the dot is a separator) |

The rule is intentionally binary: no phrase, no euphemism, no anonymisation makes a per-se root acceptable. The audit emits a `per-se-root` finding with `error` severity; the build fails.

### Verification

Every public template in `plugins.portfolio-content.options.contentPaths` is scanned. Add a path there whenever a new public page ships. The gate runs with:

```bash
bun run mcp:check         # host boot + audit
bun run mcp:all           # typecheck + tests + host boot
```

If the audit returns a `per-se-root` error, the publish is blocked. The output includes the file, the line, and the root that matched.

### Why both layers?

`forbiddenTerms` exists for long, multi-word client names people would type as-is. `perSeRoots` exists for roots that *must never* appear under any form. The two layers are not redundant: the explicit list catches typos, OCR artefacts, and accidental imports; the per-se pass catches attempts to bypass the rule with separator tricks.

### Adding a new per-se root

1. Add the root to `mcp-vertex.config.json` under `plugins.portfolio-content.options.perSeRoots`.
2. Run `bun run mcp:check`. Existing templates must come back clean.
3. Document the new root in the team's editorial rules (this README or the project's contribution guide).

Removing a per-se root is a **breaking editorial change** and must be justified in a written proposal reviewed on its own merits. It is not a routine refactor.

---

## 4. What the repo contains — structure

```
portfolio/
├── README.md                  ← this file
├── package.json               ← Angular 22 + Bun + local MCP Vertex
├── angular.json               ← Angular CLI config
├── tsconfig.{json,app,spec}   ← three independent tsconfigs
├── eslint.config.mjs          ← eslint + typescript-eslint
├── .prettierrc.json
├── mcp-vertex.config.json     ← local plugin config (per-se roots live here)
├── public/                    ← static assets (icons, images, favicon)
├── src/                       ← the app
├── plugins/portfolio-content/ ← local MCP-vertex plugin
├── docs/mcp-vertex/           ← knowledge entries and proposals
└── tools/
    ├── check-mcp-vertex.mjs   ← MCP-vertex host gate
    └── mcp-vertex/            ← auxiliary scripts
```

### `src/` — the app in layers

The tree is mapped by `src/lib/contracts/interfaces/architecture.interface.ts`. Summary:

```
src/
├── app/                       ← shell, routes, page host
│   ├── app.ts                 ← root component (3 lines)
│   ├── app.config.ts          ← provideRouter, provideClientHydration, view transitions
│   ├── app.config.server.ts   ← server-only overrides
│   ├── app.routes.ts          ← routes per locale + pageId
│   ├── app.routes.server.ts   ← prerender plan
│   ├── portfolio-page.ts/.html/.scss
│   └── app.spec.ts            ← smoke test
├── core/                      ← cross-cutting capabilities
│   ├── motion/                ← animation presets
│   ├── platform/              ← PortfolioShellFacade (shell-wide state)
│   └── rendering/             ← paint and view-transition helpers
├── domain/                    ← shared contracts and data
│   ├── portfolio.types.ts     ← public types: Locale, PortfolioPageId, Capability, …
│   └── portfolio.data.ts      ← copy, links, telemetry, technologies
├── features/                  ← each page as an isolated feature
│   ├── home/{home-intro,hero-monitor,earth-globe,profile-links,technology-marquee}
│   ├── work/                  ← professional projects and featured repos
│   ├── lab/                   ← playground and live demos
│   ├── approach/              ← how the work is done — values, process
│   ├── knowledge/             ← capabilities and skills index
│   ├── docker/                ← Docker Hub images
│   ├── demos/                 ← tiny Angular zoneless demos
│   └── contact/               ← channels and availability
├── shared/                    ← reusable UI
│   └── ui/{portfolio-header,portfolio-footer,command-palette}
└── styles/                    ← global tokens and motion
    ├── _tokens.scss
    └── _motion.scss
```

### `plugins/portfolio-content/` — the plugin that audits this repo

It is a [`mcp-vertex`](https://github.com/CartagoGit/mcp-vertex) plugin that lives inside the project itself. That is intentional: the repo audits itself. See [section 10](#10-the-portfolio-content-plugin-mcp-vertex).

### `docs/mcp-vertex/` — knowledge and proposals

When the plugin needs to learn something new about the project (e.g. a new boundary rule), the human writes it as a knowledge entry here. Proposals follow the `mcp-vertex` cycle (work → ready → done).

---

## 5. What the site shows — pages and content

There are **eight public routes**, all prefixed with a locale (`/en` or `/es`). A single screen, `PortfolioPage`, mounts them by `data.page` to avoid shell duplication.

| Route | What it does | What it contains today |
| --- | --- | --- |
| `/:locale` (home) | Identity statement and work CTA. | Animated hero, intro, technology marquee, telemetry monitor, earth globe, profile links. |
| `/:locale/work` | Main project showcase. | Curated list of public repos with role, problem, decision, and link. |
| `/:locale/lab` | Interactive play area. | `discover → model → build → verify` playground, zoneless demos, command palette. |
| `/:locale/approach` | How the work is thought of and delivered. | Working principles, taboos, processes, anonymised concrete examples. |
| `/:locale/knowledge` | Capability index. | Map of `CapabilityId` with `product`, `architecture`, `mobile`, `quality`, `systems`, `tooling`. |
| `/:locale/docker` | Published Docker Hub images. | Image table with live pulls, via `simple-icons` + official badges. |
| `/:locale/demos` | Angular zoneless demos. | Each demo is a self-contained micro-project in a feature. |
| `/:locale/contact` | How and for what to contact. | Channels, availability statement, disclaimer. |

### Home in detail

The home is the most carefully crafted piece. It has three coordinated components:

- **`home-intro`**: live copy (`copy.role`, `copy.intro`), technology marquee, work/contact CTAs.
- **`hero-monitor`**: panel with `HeroPanelId` (`overview`, `workflows`, `quality`, `mobile`, `tooling`, `delivery`) and visual effects (`idle`, `shake`, `glitch`, `float`, `spectrum`). Switches palette (`ocean`, `heat`, `lime`) and transition (`slide`, `flip`, `scan`).
- **`earth-globe`**: micro-render with `EarthDepth` (`behind`, `out-behind`, `front-ready`, `front`, `out-front`, `behind-ready`). Reflects the idea of "work that circles the globe" without grand-standing.

### Work in detail

Curated list of pinned repos on `CartagoGit`:

1. `mcp-vertex` — the most technically deep piece.
2. `quickmodel` — TypeScript library with validation, security, MCP.
3. `Keyer` — published npm utility.
4. `print-cv` — Vue/TypeScript with E2E.
5. `zoneless-calculator` — Angular zoneless with tests.
6. `NestGpt` — NestJS + OpenAI with Docker.

**No** screenshots or employer names enter here. Only the repo, its role, its problem, and its lesson.

### Lab in detail

`lab` is designed for a visitor to *touch* something. The central piece is a **four-step playground** (`discover → model → build → verify`) fed by `PlaygroundStepDefinition`. Each step is declarative; the feature decides how to render it. The command palette (`Cmd+K` / `Ctrl+K`) opens a fast-navigation layer across pages and actions.

> **Status:** the command palette and playground are in active development, but the contracts are already stable. Deliberate: the *interface* is the promise; the *implementation* comes later.

### Approach, knowledge, docker, demos, contact

These five pages complete the picture. `docker` consumes live pulls from `hub.docker.com`; `contact` explicitly states the channels and contexts in which work is accepted. None of them promises "immediate availability" because that is a commitment that changes over time.

---

## 6. Technical architecture

### Layers and their responsibilities

The contract lives in `src/lib/contracts/interfaces/architecture.interface.ts`:

| Layer | Folder | Responsibility | Sub-layers |
| --- | --- | --- | --- |
| `app` | `src/app/` | Shell, routes, page host, configuration. | `*.config.ts`, `*.routes*.ts`, `portfolio-page.*` |
| `core` | `src/core/` | Cross-cutting capabilities reusable by features. | `motion/`, `platform/`, `rendering/` |
| `domain` | `src/domain/` | Shared contracts and data. Single source of truth. | `portfolio.types.ts`, `portfolio.data.ts` |
| `features` | `src/features/` | Each page/domain component. Knows no other feature. | one folder per feature, no cross-imports |
| `shared` | `src/shared/` | Reusable UI without domain logic. | `ui/portfolio-header/`, `ui/portfolio-footer/`, `ui/command-palette/` |
| `styles` | `src/styles/` | Global tokens and motion consumed by SCSS. | `_tokens.scss`, `_motion.scss` |

**Dependency rules:**

- `features → domain + shared + core` (never `features ↔ features`).
- `shared → core + domain` (never features).
- `core → domain` (never features or shared).
- `app → features + shared + core + domain`.

The `portfolio_architecture` plugin walks the tree and reports any violation. Any PR that breaks it does not merge.

### Shell and shared state

`PortfolioShellFacade` lives in `src/core/platform/`. It is the only surface of global signals:

- `locale`, `page`, `lightMode`, `menuOpen`, `localeMenuOpen`, `scrolled`, `commandOpen`.
- `copy()` returns `PortfolioCopy` already resolved for the current locale.
- `selectLocale`, `setTheme`, `setTransition` control navigation and theming.

Features do not lift their own state for things that belong to the shell. If a feature needs state, it declares it inside its folder.

### Domain and data

`src/domain/portfolio.types.ts` defines:

- `Locale`, `PortfolioPageId`, `PlaygroundStep`, `CapabilityId`, `HeroPanelId`, `TelemetryId`, `ChartType`, `HeroEffect`, `HeroPalette`, `HeroPanelTransition`, `EarthDepth`.
- Interfaces: `Capability`, `HeroPanel`, `Technology`, `PublicLink`, `PortfolioCopy`, `LanguageOption`, `PlaygroundStepDefinition`, `Telemetry`.

`src/domain/portfolio.data.ts` is the only file where per-locale copy lives. Features read from there. Translating the site is a *local* operation, not a global grep.

### Server

`src/server.ts` boots Express with `@angular/ssr`. `src/main.server.ts` produces the server bundle. `app.config.server.ts` adds the providers that only apply on the node. `app.routes.server.ts` declares the prerender plan so the home and the static pages are served from HTML.

---

## 7. Stack and dependencies

### Runtime

![Angular](https://img.shields.io/badge/Angular-22-DD0031?style=flat-square&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=flat-square&logo=reactivex&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-4-3E67B1?style=flat-square&logo=zod&logoColor=white)
![simple-icons](https://img.shields.io/badge/simple--icons-16-222222?style=flat-square)
![Express](https://img.shields.io/badge/Express-5-000000?style=flat-square&logo=express&logoColor=white)

### Tooling

![Bun](https://img.shields.io/badge/Bun-1.3-000000?style=flat-square&logo=bun&logoColor=F9F1E1)
![Angular CLI](https://img.shields.io/badge/Angular_CLI-22-DD0031?style=flat-square&logo=angular&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![typescript-eslint](https://img.shields.io/badge/typescript--eslint-8-4B32C3?style=flat-square&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3-F7B93E?style=flat-square&logo=prettier&logoColor=black)
![Vitest](https://img.shields.io/badge/Vitest-4-6E9F18?style=flat-square&logo=vitest&logoColor=white)
![jsdom](https://img.shields.io/badge/jsdom-28-2EAD33?style=flat-square)

### Plugins and orchestration

`mcp-vertex` (local, via `file:../mcp-vertex/packages/core`). The `portfolio-content` plugin depends on `@mcp-vertex/core` as a `peerDependency` and on `zod` to define the input/output schemas of its tools.

### Stack decisions

- **Bun** for install, scripts, and plugin tests. It is the same runtime as the `mcp-vertex` repo, which reduces friction when developing both.
- **Zod** in plugins and models. It is the same validator that `mcp-vertex` and `quickmodel` already use.
- **simple-icons** for all brand SVGs. Avoids pasted, poorly-licensed SVGs in `public/`.
- **No UI library** (Angular Material, PrimeNG, etc.). The project uses only SCSS and tokens. Deliberate: the home is specific enough that a UI library would only add weight.

---

## 8. i18n, accessibility, and performance

### i18n

- Supported locales: `en`, `es`.
- Routes: `/:locale/{page}`. Default redirect is `en`.
- Per-locale copy in `src/domain/portfolio.data.ts`.
- The locale does not pollute the shell URL (no `?lang=`, no expiring cookie): navigation is by prefix, as SSR requires.

### Accessibility

- `<a class="skip-link" href="#main-content">` jumps to content on every page.
- ARIA roles on regions (`aria-labelledby`, `aria-label`).
- Contrast verified in dark and light mode; the palette tokens keep AA ratio in both.
- Keyboard navigation across header, command palette, footer, and every interactive card.
- `@HostListener('window:scroll')` only triggers a state change; smooth-scroll lives in CSS so the JS event stays passive.

### Performance

- `outputMode: "server"` + `provideClientHydration()` → SSR + flicker-free rehydration.
- `withViewTransitions()` in the router → native route animation with no library.
- Each feature is `loadComponent` (lazy) → the initial bundle does not load lab or demos.
- `ChangeDetectionStrategy.OnPush` everywhere. No `zone.js` in the bundle.
- Bundle budgets: **500 kB warn / 1 MB error** on initial, **86 kB warn / 92 kB error** on component CSS. Any PR that breaks them is rejected.

### SSR + hydration

The most interesting technical challenge of the repo: combining `zoneless + SSR + i18n` without leaks. The prerender plan lives in `app.routes.server.ts`. The server is Express via `@angular/ssr`. Pages without dynamic state (home, static copy) are prerendered; pages with state (command palette, monitor) rehydrate on the client.

---

## 9. Design system

### Palette

Tokens in `src/styles/_tokens.scss`. **Dark** by default, **light** toggleable and persisted in the session.

| Token | Dark | Light | Use |
| --- | --- | --- | --- |
| `--canvas` | `#04070d` | `#f3f7ff` | background |
| `--surface` | `#08111d` | `#ffffff` | cards |
| `--surface-2` | `#0c1827` | `#e8f1ff` | elevated cards |
| `--ink` | `#eff7ff` | `#0a1b38` | text |
| `--muted` | `#91a2b9` | `#536784` | secondary text |
| `--cyan` | `#32c8ff` | `#0078bc` | primary accent |
| `--blue` | `#1678ff` | `#0863e6` | secondary accent |
| `--lime` | `#b9ef73` | `#527b10` | success / highlight |
| `--neon` | `blue glow` | `soft glow` | hover, focus |

### Motion

Tokens and curves in `src/styles/_motion.scss`. Features do not write `transition` ad-hoc; they import the tokens. That keeps the site breathing the same way across every page.

### Command palette

`Cmd+K` / `Ctrl+K` opens `app-command-palette`. A power-user surface: fast navigation, page search, shortcuts. Its state lives in `PortfolioShellFacade.commandOpen`.

### Theme switching

The theme toggle sits in the header and persists in the session. The transition is `transition: background 0.35s, color 0.35s` so the change is not a jolt.

---

## 10. The `portfolio-content` plugin (MCP Vertex)

This repo is one of the few that **includes its own MCP plugin** inside itself. That makes the portfolio an *agent-readable* repository: any tool that speaks MCP can ask `mcp-vertex` how the site is organised without reading every file.

### Tools exposed

| Tool | Type | What it returns |
| --- | --- | --- |
| `portfolio_architecture` | read | The layer tree (`app / core / domain / features / shared / styles`) with its sub-folders and one-line responsibility. |
| `portfolio_features` | read | Every feature and the components it owns, grouped. |
| `portfolio_domain` | read | The public contracts extracted from `src/domain/portfolio.types.ts`. |
| `portfolio_public_audit` | read (with gate) | Content audit: `forbiddenTerms`, `perSeRoots`, `TODO(image)`, orphan features. |

### Finding IDs

The audit emits findings with stable `id`s. The CI gate and the agent runbook key on them:

| `id` | Severity | Source |
| --- | --- | --- |
| `per-se-root` | `error` | A root in `perSeRoots` (e.g. `beateam`) appeared in the template, case-insensitive, separator-collapsed. Publish blocker. |
| `private-term` | `error` | A term in `forbiddenTerms` appeared in the template. Publish blocker. |
| `image-todo` | `warning` | `TODO(image): …` placeholder is still in the committed HTML. |
| `duplicated-content` | `info` | Path declared twice in `contentPaths`. |
| `missing-content` | `info` | Declared path has no file yet. |
| `unreadable-content` | `info` | The reader could not read the file. |

### Knowledge entries

The plugin also loads procedural knowledge in `docs/mcp-vertex/knowledge/`:

- `portfolio-architecture` — layer rules and dependencies.
- `portfolio-features` — how to add a feature without breaking the boundary.
- `portfolio-domain` — contract surface and hard rules.
- `portfolio-public-boundary-en` / `…-es` — bilingual publication rules.
- `portfolio-content-runbook` — when to call each tool.

### Configuration

`mcp-vertex.config.json` declares:

```jsonc
{
  "plugins": {
    "portfolio-content": {
      "path": "plugins/portfolio-content/src/index.ts",
      "prefix": "portfolio",
      "options": {
        "contentPaths": [
          "src/app/portfolio-page.html",
          "src/features/contact/contact-page.component.html",
          "src/features/docker/docker-page.component.html",
          "src/features/demos/demos-page.component.html",
          "src/features/approach/approach-page.component.html",
          "src/features/work/work-page.component.html",
          "src/features/knowledge/knowledge-page.component.html",
          "src/features/lab/lab-page.component.html",
          "src/features/home/home-intro/home-intro.component.html",
          "src/features/home/hero-monitor/hero-monitor.component.html",
          "src/features/home/earth-globe/earth-globe.component.html"
        ],
        "forbiddenTerms": [
          "Beateam",
          "Beateamer",
          "Beateams",
          "Beateam Group",
          "Beateam Spain",
          "Beateam App",
          "BeateamApp",
          "BeateamGroup",
          "BeateamSpain",
          "beateam.es",
          "beateam.io",
          "beateam.com",
          "Mazinger",
          "MDM Platform",
          "Gestion de Tarifas"
        ],
        "perSeRoots": ["beateam"],
        "locale": "en"
      }
    }
  }
}
```

### Run the plugin

```bash
bun run mcp:typecheck     # plugin types
bun run mcp:test          # plugin tests (vitest)
bun run mcp:check         # host boot + audit
bun run mcp:all           # all three in order
```

`mcp-vertex` is not yet published. Meanwhile, both `mcp-vertex.config.json` and `.vscode/mcp.json` point at the local checkout at `../mcp-vertex`. **Do not change that path until the package is published.**

---

## 11. Run, validate, deploy

### Requirements

- **Bun ≥ 1.3.14** (declared in `packageManager`).
- **Node.js ≥ 22** (Angular 22 peer).
- Local checkout of `mcp-vertex` at `../mcp-vertex` (plugin only).

### Install and start

```bash
bun install
bun start
```

The app boots at `http://localhost:4200`. Public routes: `http://localhost:4200/en` and `http://localhost:4200/es`.

### Validate

```bash
bun run check           # format:check + lint + typecheck
bun run mcp:all         # plugin: typecheck + test + host boot
bun run test            # ng test (Karma + jsdom)
```

### Production build

```bash
bun run build
bun run serve:ssr:portfolio
```

The SSR server listens on `http://localhost:4000` by default. The output of `dist/portfolio/` is ready to upload to any Node-with-SSR host (Render, Railway, Fly.io, etc.) or to prerender to static if configured.

### Ideal deploy (not yet implemented)

1. `bun run build` → produces `dist/portfolio/server/server.mjs`.
2. Deploy the Express server in a Docker container based on `cartagodocker/nodebun`.
3. CDN in front for static assets.
4. `mcp:check` as a pre-deploy hook. A `per-se-root` error blocks the deploy.

---

## 12. Image placeholders

### Policy

- No stock image is allowed to stay as the final asset.
- Every temporary image carries an HTML comment `<!-- TODO(image): ... -->`.
- The `portfolio_public_audit` plugin enumerates all open `TODO(image)` placeholders. When a `TODO(image)` is not resolved before a release, it is documented in the associated proposal.

### Current inventory

The home images live in `public/images/`. Some pieces (avatar, demo captures) are marked with `TODO(image)`. The replacement proposal lives in `docs/mcp-vertex/proposals/`. When a proprietary image is produced, it is substituted *in the same file* and the TODO is closed.

### Why stock and not nothing

A site without images sells less. Stock + `TODO(image)` is an honest middle ground: it communicates "this is provisional" without sacrificing the visual hierarchy of the content.

---

## 13. Roadmap

Open work, grouped by area. It moves as `mcp-vertex` and my own projects evolve.

### Immediate (next release)

- Replace the banner `public/images/banner-portfolio.png` once the final version is produced.
- Replace the home stock images with real captures.
- Finish the `lab` playground (the four steps already have contracts; the visual implementation is missing).
- Publish the site at a final URL.

### Mid-term

- Add `demos/zoneless-onpush-lab` as a self-contained feature to reinforce the zoneless message.
- Migrate the header to an animated state with `@defer` to delay hydration.
- Add per-page `og:image`.
- E2E tests with Playwright for the critical flows (navigation, command palette, theme toggle).

### Long-term

- i18n to `ca` and `fr` if the professional context requires it.
- "Presentation" mode for interviews: screen-only, no header, no footer.
- GitHub activity data API consumed at build-time so tokens never enter the runtime.

> **No dates promised.** This section is so that any visitor (including me in six months) can see what is coming and what is not.

---

## 14. Maintenance, licence, and authorship

### Maintenance

- The repo is maintained while the professional identity stays active.
- It is archived (not deleted) if the personal brand moves to another domain.
- The content-discipline rules are contractual: the plugin audits them, not the human.

### Authorship

Work, code, and design by **Mario Cabrero Volarich** — [CartagoGit](https://github.com/CartagoGit).

### Licence

The portfolio code is **private**. The copy, the structure, and the editorial discipline are public in the measure this README describes them. If you want to reuse the architecture for your own portfolio, please **read it and rewrite it**: copying this repo verbatim would be, paradoxically, a lack of judgement.

### Acknowledgements

- [Angular](https://angular.dev) for a framework that still takes render and change detection seriously.
- [mcp-vertex](https://github.com/CartagoGit/mcp-vertex) for letting a repo audit itself.
- [Bun](https://bun.sh) for using the right runtime in each context.
- The reviewers of every PR linked from `/work` — the discipline of this portfolio is heir to those reviews.

---

<details>
<summary><strong>Executive summary — one screen</strong></summary>

**Cartago Portfolio** is the public site of Mario Cabrero Volarich. It is **Angular 22 zoneless with SSR**, **i18n `en`/`es`**, **view transitions**, **`OnPush` everywhere**, **a local mcp-vertex plugin** that audits content and architecture, and an **editorial discipline that forbids client terms per se** — including Beateam, which is rejected in every form, case-insensitive, with separators collapsed.

The promise is: what you see on screen is exactly what is in `src/`, no CMS, no surprises, no third-party names. If you come from the `CartagoGit` repo, everything is here, but running. If you come from outside, this is the site that replaces a PDF CV.

</details>

---

<p align="center">
  <sub>Built with Angular 22, Bun, mcp-vertex, and zero zone.js. By Mario Cabrero Volarich, in Seville.</sub>
</p>
