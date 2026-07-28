---
id: proposal-lang-ts-files-pipe
title: TypeScript-native i18n with a typed `lang/*.ts` source and a `translate` pipe
status: ready
priority: high
created: 2026-07-28
owner: frontend
labels: [i18n, translations, architecture, signals]
---

# Proposal — TypeScript-native i18n with a typed `lang/*.ts` source and a `translate` pipe

## Why

Today the portfolio ships **two locales only** (`en`, `es`) and the
`PORTFOLIO_COPY` record in [`src/domain/data.ts`](src/domain/data.ts)
covers a tiny slice of the chrome: four nav labels, one availability
sentence, two CTAs, role and intro. The result is two real problems:

1. **Most of the UI is hardcoded in English.** Page bodies (e.g.
   [`work.page.html`](src/pages/work/work.page.html): `"01 / Selected work"`,
   `"Pinned work, not filler examples."`, every card description),
   eyebrow labels, capability text and demo copy are written directly
   in the template. Switching `locale()` to `'es'` only changes a
   handful of nav strings; the rest of the page stays English.
2. **Adding a third language means editing a fat shared record.** The
   `PORTFOLIO_COPY` / `PAGE_TITLES` / `PAGE_DESCRIPTIONS` shape lives in
   `data.ts` and `seo.ts` and is keyed by `ILocale`. Contributors have
   to thread every new key through three files, and there's no static
   guarantee that `en` and `es` expose the same set of keys.

The header already shows a clean dropdown for the two available
locales — that UX must keep working, but it must also expand
transparently to a third / fourth locale and start affecting the page
bodies too.

## What

Move translations out of `domain/data.ts` into a **`src/lang/`** folder
where each language is a dedicated, typed `.ts` module. Expose a
**signal-based translation service** and a **`TranslatePipe`** that
mirrors the well-known `@ngx-translate/core` API (`'key.path' | args`)
but is fully typed against the canonical English shape, so a missing
key fails the type check at build time.

### Target layout

````text
src/lang/
├── types.ts           # TranslationKey union, ITranslationMap contract
├── en.ts              # English source-of-truth
├── es.ts              # Spanish (current default second locale)
├── fr.ts              # French (new — required to prove the pipeline is generic)
├── de.ts              # German (new — same)
├── translate.service.ts  # Signal-driven locale + key resolution
├── translate.pipe.ts     # {{ 'home.hero.title' | translate }}
└── index.ts           # Public surface
````

Each language file is just:

````typescript
// src/lang/en.ts
import type { ITranslationMap } from './types';
export const en: ITranslationMap = {
	home: { hero: { title: 'Frontend product engineer', subtitle: '...' } },
	work: { ... },
	// ...
};
````

### Pipeline

1. **`ILocale` widens** from `'en' | 'es'` to `'en' | 'es' | 'fr' | 'de'`
   in [`src/domain/types.ts`](src/domain/types.ts). The
   `LANGUAGES` array in `domain/data.ts` exposes the new entries with
   flag assets (`flag-fr.svg`, `flag-de.svg` under `public/icons/`).
2. **`TranslationService`** (`TranslateService`) is provided in root,
   exposes `locale = signal<ILocale>('en')` and a
   `t(key, args?)` helper that returns a `Signal<string>`.
3. **`TranslatePipe`** is a pure / impure pipe that takes a key string,
   resolves it through the active locale signal, and re-runs the
   `computed` whenever the locale changes — identical behaviour to
   `@ngx-translate/core`'s pipe.
4. **`ShellFacade`** delegates locale persistence + URL routing to the
   service; the dropdown UI in the header keeps emitting through
   `localeSelect` so the rest of the shell is untouched.
5. **All hardcoded UI copy** in every page/component/HTML template
   moves to `lang/en.ts` and `lang/es.ts` (and `fr.ts`, `de.ts`).
   `seo.ts` pulls from the same source so `<title>` / `<meta
   description>` track the rest of the chrome.

### Contract guarantees

- A missing translation key in any `.ts` file fails `tsc --noEmit` with
  `Type '...' is missing the following properties from type
  'ITranslationMap': ...`.
- The `TranslateService.t(key)` signature uses `keyof NestedPaths<typeof
  en>` so only valid paths compile.
- Runtime fallback: if a key is absent in the active locale, the
  service returns the English string with a one-time
  `console.warn` (gated by `isDevMode()` so production is silent).
- Tests:
  - `translate.service.spec.ts`: locale switching, fallback, ICU-lite
    interpolation (`{count}` placeholders).
  - `translate.pipe.spec.ts`: pure transform, change detection on locale
    flip.
  - `lang/en.spec.ts`: asserts the English map is a superset of every
    other locale's keys.

### UX

- Header language dropdown gains **four** options (EN / ES / FR / DE).
  Flag SVGs land under `public/icons/`. Existing CSS in
  `header.component.scss` is reused as-is.
- The active locale keeps being persisted in cookie + URL (`/:locale/...`)
  through the existing `localeMiddleware` in
  [`src/server.ts`](src/server.ts) and `detectPreferredLocale` /
  `persistLocale` helpers in [`src/core/platform/locale.ts`](src/core/platform/locale.ts).
- Page bodies become locale-aware without any new wiring at the page
  level: every `{{ '... key ...' | translate }}` runs through the
  service automatically.

## Out of scope

- Pluralization / select ICU features beyond simple `{name}`
  interpolation. Plurals are easy to retrofit later because the
  service returns a `Signal<string>` and not a raw map.
- Lazy-loading locale bundles from the network. Every locale ships in
  the SSR bundle for now — sizes are tiny and SSR-first delivery
  prefers a single critical-path payload.
- Server-side locale negotiation beyond what `localeMiddleware`
  already does (Accept-Language → cookie → URL).

## Risks

- **Typing overhead.** The `NestedPaths<>` derivation that powers the
  pipe is a known TS ergonomics tax. Mitigation: keep
  `ITranslationMap` shallow (one level per domain area, e.g.
  `home.hero.title`); use `as const satisfies ITranslationMap` so the
  compiler can verify shape without losing literal types.
- **Migration cost.** Every page body string must be extracted.
  Mitigation: ship the migration per-page in small, individually
  committable PRs; the service + pipe land first behind a feature
  flag (the existing `lightMode` signal demonstrates the pattern).
- **Test fallout.** Specs that snapshot rendered HTML will need to be
  locale-aware. Mitigation: introduce a default `locale` fixture in
  the test setup (`TestBed` provider returning `'en'`) so specs don't
  all need to be updated at once.

## Success criteria

- [ ] `src/lang/` exists with `en.ts`, `es.ts`, `fr.ts`, `de.ts` and a
      shared `types.ts`.
- [ ] `TranslateService` + `TranslatePipe` are provided in
      `app.config.ts` and exported through `src/lang/index.ts`.
- [ ] `ILocale` widens to four values and `LANGUAGES` exposes them.
- [ ] All previously hardcoded page copy (work, lab, approach,
      knowledge, docker, demos, contact, hero, capabilities,
      playground, demos, telemetry, footer) is rendered through
      `translate`.
- [ ] Header dropdown shows four locales and persists choice via
      cookie + URL.
- [ ] Switching locale updates every page body, the page `<title>` and
      the meta description.
- [ ] `bun run validate` is green (lint + typecheck + tests).
- [ ] No `console.warn` appears in production builds.

## Slice breakdown (suggested order)

1. **`S1` — Foundation**: create `src/lang/` skeleton, types,
   `TranslateService`, `TranslatePipe`, `app.config.ts` wiring, tests
   for service + pipe. Header dropdown stays on two locales for now.
2. **`S2` — Locale widening**: `ILocale` grows to four, new flag
   assets, `LANGUAGES` array updated, server `localeMiddleware`
   accepts the new codes, header dropdown gains the four options.
3. **`S3` — Page-body migration**: every page template + component
   moves its strings to `en.ts` / `es.ts` (fr/de fall back to English
   in this slice). One commit per page.
4. **`S4` — French + German translations**: copy in `fr.ts` and
   `de.ts` for every existing key.
5. **`S5` — Hardening**: SSR check (no missing keys in non-EN locales,
   no `console.warn` in prod), update affected specs, run full
   `validate`.