# S13 locale parity and prerender audit

- **Date:** 2026-11-23
- **Locales:** English, Spanish, French and German
- **Routes:** Home, Work, Lab, Approach, Knowledge, Docker, Demos and Contact
- **Browser:** fresh Chromium development server on port 4410
- **Production artifact:** Angular browser + SSR build

## Guarded translation parity

`src/lang/i18n-parity.spec.ts` recursively compares every translation leaf against English. The check fails on any English-identical leaf unless it is an explicitly allowed immutable value, such as a brand, technology, package name, acronym, CSS token or empty title segment.

The typed `content` catalogue owns domain copy that used to live in raw component/domain records:

- six project details and statuses;
- six capability explanations and practical examples;
- six Knowledge practical examples;
- six Docker image purposes and statuses;
- ten public-link descriptions;
- 31 stack/tool labels;
- 41 technology definitions.

All four locales expose those complete record sets. Route components consume keys through `TranslateService`; they do not render the English fallback strings from domain data.

## Browser truth

A fresh-server DOM scan covered all eight routes in `/es`, `/fr` and `/de` (24 route/locale cases). The scan found none of the blocked English prose groups: `Skip to content`, `Public repository`, `workflow(s)`, `dashboard`, `playground`, `tooling`, `testing`, `responsive`, `release-ready`, `touch-first`, `local-first`, `feedback`, `timing`, `easing`, `assets` or `delivery surfaces`.

Proper nouns, technology names, package names, command literals and public destination labels remain unchanged by design.

## URL locale wins persisted preference

With `localStorage` and the locale cookie deliberately set to another language:

- `/es/work` rendered `lang="es"`, Spanish SEO title, Spanish skip link and Spanish Work heading.
- `/de/work` rendered `lang="de"`, German SEO title, German skip link and German Work heading.

The URL therefore remains authoritative; persisted preferences are only a convenience for future navigation.

## Static and SSR delivery

Production build output contains 32 prerendered route documents:

```text
8 product routes × 4 locales = 32 static routes
```

Each locale directory contains Home plus `work`, `lab`, `approach`, `knowledge`, `docker`, `demos` and `contact`.

The production SSR server was started from `dist/portfolio/server/server.mjs`; all four `/[locale]/work` responses returned HTTP 200 with the matching header:

- `Content-Language: en`
- `Content-Language: es`
- `Content-Language: fr`
- `Content-Language: de`

Static HTML also contains the route locale and localized skip/title copy for Spanish, French and German Work pages.
