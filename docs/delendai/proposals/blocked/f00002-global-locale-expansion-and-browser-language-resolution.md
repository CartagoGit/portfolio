---
id: f00002
title: "Global locale expansion and browser language resolution"
kind: feat
status: blocked
type: proposal
track: portfolio-i18n
date: 2026-11-22
last-transition-id: 54a916c1-1ac0-4096-974a-6863349314c3
last-correlation-id: 54a916c1-1ac0-4096-974a-6863349314c3
last-transition-from: ready
last-transition-at: 2026-11-22T23:41:09.259Z
---

# f00002 — Global locale expansion and browser language resolution

## goal

Expand the portfolio from four locales to a global, maintainable language catalogue, route canonical regional variants correctly, and detect the visitor's browser language automatically. Every unsupported browser language must fall back to English without losing the explicit locale in the URL.

This proposal is intentionally after the product work. It must not start until `f00001` is functionally complete and verified; publication is owned independently and is not a blocker for locale implementation.

## why

The portfolio is a professional contact and acquisition surface. Visitors may arrive from many regions, and requiring them to find a manually hidden language preference increases friction before they can understand the work or contact the author. Product polish and route completeness from `f00001` remain the priority; once the product is stable, global language reach should be added as a separate feature with explicit detection, fallback, RTL and SSR contracts.

## design

### Canonical locale catalogue

Use the following canonical route locales as the first global release:

- `en`, `es`, `fr`, `de`, `it`
- `pt-PT`, `pt-BR`
- `ru`, `uk`, `pl`, `hr`, `tr`
- `ar`, `hi`, `bn`
- `zh-CN`, `zh-TW`
- `ja`, `ko`, `id`

Brand names, project names, package names and technical identifiers remain unchanged across locales.

### Browser resolution

- Prefer the explicit route locale over cookie/localStorage, preserving direct links and shareability.
- Parse every entry in `navigator.languages` with `Intl.Locale` rather than splitting blindly on two characters.
- Resolve regional/script variants to a canonical locale:
  - `en-*` → `en`; `es-*` → `es`; `fr-*` → `fr`; `de-*` → `de`; `it-*` → `it`
  - `pt-BR`, `pt` → `pt-BR`; `pt-PT` and other Portuguese regions → `pt-PT` unless a better explicit alias exists
  - `zh-Hans`, `zh-CN`, `zh-SG` → `zh-CN`
  - `zh-Hant`, `zh-TW`, `zh-HK`, `zh-MO` → `zh-TW`
  - regional variants of Russian, Ukrainian, Polish, Croatian, Turkish, Arabic, Hindi, Bengali, Japanese, Korean and Indonesian map to their canonical base locale
- If no supported locale is present, use `en`.
- On the initial root route, the server may redirect using the same resolver plus `Accept-Language`; explicit routes never redirect merely because storage/cookie differs.

### UI and accessibility

- The language selector becomes searchable/filterable for twenty locales and stays usable at 390px.
- Each locale displays native language name, English helper label and region/script where needed (`Português (Brasil)`, `中文（简体）`, `中文（繁體）`).
- Arabic sets `dir="rtl"` and includes targeted RTL layout tests; all other locales use `ltr`.
- `<html lang>`, `Content-Language`, SEO alternate/hreflang metadata and SSR/prerender output use the same canonical locale source.
- Translation fallback remains key → canonical locale → English; unsupported/invalid values never leave an unresolved key or locale code in visible UI.

## non-goals

- Starting locale expansion before `f00001` product work and product-quality corrections are complete.
- Creating a separate translated website, route tree or duplicate design per locale.
- Translating private/client evidence, package names, repository names or technical terms that should remain literal.
- Machine-translation claims without glossary review and parity tests.
- Replacing the established explicit route contract with query-string-only language state.

## dependency

- **Blocked by**: `f00001`
- **Unblock condition**: `f00001` is functionally complete and its product gates pass. Publication remains an independent concern.

## slices

- global_gate: i18n parity + locale resolution matrix + lint + typecheck + all tests + production/SSR build

### S1 — Locale registry, variant resolver and route/SSR contract
- **Status**: pending
- **Files**: `src/domain/types.interface.ts`, `src/core/platform/locale.helper.ts`, `src/core/platform/locale.spec.ts`, `src/lang/translate.service.ts`, `src/lang/translate.service.spec.ts`, `src/app/app.routes.content.ts`, `src/app/app.routes.server.ts`, `src/server.entrypoint.ts`
- **Gate**: locale matrix unit tests + typecheck + SSR request audit
- **Acceptance**: every canonical locale is recognized; all regional/script aliases resolve deterministically; unsupported languages return English; explicit route locale beats storage/cookie; HTML lang, Content-Language and route locale agree.

### S2 — Translation catalogue and glossary
- **Status**: pending
- **Files**: `src/lang/en.content.ts`, `src/lang/es.content.ts`, `src/lang/fr.content.ts`, `src/lang/de.content.ts`, `src/lang/it.ts`, `src/lang/pt-PT.ts`, `src/lang/pt-BR.ts`, `src/lang/ru.ts`, `src/lang/uk.ts`, `src/lang/pl.ts`, `src/lang/hr.ts`, `src/lang/tr.ts`, `src/lang/ar.ts`, `src/lang/hi.ts`, `src/lang/bn.ts`, `src/lang/zh-CN.ts`, `src/lang/zh-TW.ts`, `src/lang/ja.ts`, `src/lang/ko.ts`, `src/lang/id.ts`, `src/lang/index.barrel.ts`, `src/lang/types.interface.ts`, `src/lang/i18n-parity.spec.ts`
- **Gate**: translation shape/interpolation parity + editorial glossary audit
- **Acceptance**: every supported locale satisfies `ITranslationMap`; no visible/ARIA key is missing; names and technical identifiers follow the glossary; Chinese script variants stay distinct; Arabic RTL copy is complete.
- "Portuguese PT/BR collapse to one selector group while preserving route resolution."
- "All twenty routes have complete visible/ARIA copy; English fallback is reserved for explicitly immutable technical glossary terms and not whole route/home/monitor blocks."
- "Each locale's native/translated label pairs, flag asset and sort key are tested."
- "Searchable language rows stay keyboard/touch usable at 390px."

### S3 — Searchable language selector and flags
- **Status**: pending
- **Files**: `src/shared/ui/header/**`, `public/icons/flags/**`
- **Gate**: keyboard, touch and 390px Playwright audit
- **Acceptance**: twenty locales fit in a searchable menu, selected locale is marked, native-name labels are readable, flags/icons are optional presentation rather than meaning, focus remains stable and no layout shift occurs.
- "Header button uses the active locale's local flag asset."
- "The selector renders one Portuguese group, one English group and distinct Chinese script groups."
- "Rows are ordered by native locale name and display current-language helper copy beneath the native name."

### S4 — SEO alternates, metadata and RTL layout
- **Status**: pending
- **Files**: `src/core/platform/seo.helper.ts`, `src/app/page.html`, `src/app/page.scss`, `src/index.html`, `src/styles.scss`
- **Gate**: metadata/SSR audit + RTL desktop/mobile visual audit
- **Acceptance**: canonical and `hreflang` alternates exist for each route; Arabic uses `dir="rtl"` without clipping; long native labels, CJK typography and Cyrillic text remain readable across shell and route layouts.

### S5 — Locale regression matrix and prerender
- **Status**: pending
- **Files**: `e2e/**`, `docs/i18n.md`
- **Gate**: all locales × priority routes unit/browser matrix
- **Acceptance**: each canonical locale and representative regional variant is tested; unsupported locales fall back to English; direct URLs, refresh, back/forward, cookies and localStorage cannot override explicit routes; prerender outputs all canonical locales.

## dependency graph

- S1 defines the canonical route and detection contract.
- S2 supplies complete copy for the catalogue.
- S3 consumes S1/S2 in the language selector.
- S4 consumes the canonical locale list for SEO and RTL.
- S5 runs only after S1–S4 are complete and proves the matrix before release.

## acceptance

- The portfolio reaches canonical routes for English, Spanish, French, German, Italian, Portuguese (PT/BR), Russian, Ukrainian, Polish, Croatian, Turkish, Arabic, Hindi, Bengali, simplified/traditional Chinese, Japanese, Korean and Indonesian.
- Browser variants resolve to the correct canonical route; unsupported browser languages always use English.
- Explicit route locale always wins over cookie/localStorage.
- EN remains the documented and tested fallback for missing translation keys and unsupported languages.
- Arabic layout is direction-correct and long/CJK/Cyrillic labels do not overflow or clip.
- Searchable locale selection, SSR, SEO alternates and prerender agree on the same locale registry.
- Lint, typecheck, all unit/browser locale tests, production build and SSR build pass before this final feature can ship.
