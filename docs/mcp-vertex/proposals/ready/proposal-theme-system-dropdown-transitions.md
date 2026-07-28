---
id: proposal-theme-system-dropdown-transitions
title: Multi-theme palette system with smooth cross-theme transitions and a header dropdown selector
status: ready
priority: high
created: 2026-07-28
owner: frontend
labels: [theming, ui, ux, scss, tokens, signals]
---

# Proposal — Multi-theme palette system with smooth cross-theme transitions and a header dropdown selector

## Why

The portfolio only supports **two themes** today (`dark` / `light`)
through a hardcoded pair of palette maps in
[`src/styles/tokens/_palette.scss`](src/styles/tokens/_palette.scss)
and a boolean `lightMode` signal in
[`src/core/platform/shell.facade.ts`](src/core/platform/shell.facade.ts)
that toggles `data-theme` between `'dark'` and `'light'`. The toggle
UX is a single circular button (☼ / ◐) in the header. Three real
problems follow:

1. **Boring visual range.** Two themes don't show the breadth of the
   design system. Other palettes (sunset, forest, ocean, midnight, …)
   have lived in design notes but never shipped.
2. **No transition between palettes.** `body { transition: background
   0.35s ease; }` only animates `background`; component-level
   properties that hardcode `--ink`, `--cyan`, etc. flash instantly
   when `data-theme` flips.
3. **The theme button is opaque.** Users don't know what other
   themes exist — the icon silently cycles between two states. The
   language dropdown next to it (`EN ⌄`) is the model we want: a
   visible button with the active value + a popover listing every
   option, each with a hint of what it looks like.

## What

Replace the boolean `lightMode` / `data-theme=dark|light` system
with a **typed theme registry** that ships **eight** palettes, an
explicit **transition layer** that interpolates every token between
themes, and a **header dropdown** that mirrors the language
dropdown's UX.

### Target theme set

| id | label | primary | accent |
|----|-------|---------|--------|
| `dark` | Midnight | `#32c8ff` | `#b9ef73` |
| `light` | Paper | `#0863e6` | `#527b10` |
| `midnight` | Deep blue | `#7d5cff` | `#32c8ff` |
| `ocean` | Tidal | `#0fb4ff` | `#a7ffeb` |
| `forest` | Forest | `#41c47c` | `#ffd166` |
| `sunset` | Sunset | `#ff7a59` | `#ffd166` |
| `solar` | Solar | `#ffb454` | `#ff5d8f` |
| `mono` | Graphite | `#9aa4b2` | `#e8e8e8` |

Every theme carries the **full token set** the existing components
consume (`--ink`, `--muted`, `--canvas`, `--surface`,
`--surface-2`, `--line`, `--cyan`, `--blue`, `--ice`, `--lime`,
`--neon`). Themes live in `src/styles/tokens/_themes.scss` as a
Sass map-of-maps so the existing `@include portfolio-tokens($map)`
mixin keeps working.

### TypeScript side

- New file `src/core/platform/theme.ts` declares
  `IThemeId = 'dark' | 'light' | 'midnight' | 'ocean' | 'forest' | 'sunset' | 'solar' | 'mono'`,
  the `IThemeDefinition { id, label, primary, accent }` interface and
  the `THEMES` registry array.
- `ShellFacade.lightMode: signal<boolean>` becomes
  `theme: signal<IThemeId>`, defaulting to `'dark'`. A
  `setTheme(id)` method persists the choice in
  `localStorage` (key `cartago-theme`), applies
  `data-theme="<id>"` on `<html>`, and bumps
  `data-theme-transition="1"` for the duration of the transition so
  the cross-fade runs once.
- The signal-based facade keeps the header dumb: the header passes
  the active theme + the registry in via inputs and emits
  `themeSelect = output<IThemeId>()`.

### CSS transition layer

A new `src/styles/motion/_theme-transition.scss` partial adds the
following rules:

- `:root { transition: background 480ms cubic-bezier(0.22, 0.9, 0.25,
  1), color 480ms ...; }` for every property a token maps to
  (`background-color`, `color`, `border-color`, `box-shadow`,
  `text-shadow`, `fill`, `stroke`).
- A `[data-theme-transition]` attribute scoping selector that adds
  `transition-delay: 0` to descendants, ensuring the transition
  reaches the leaf elements instead of only the root.
- `@media (prefers-reduced-motion: reduce)` short-circuit that
  collapses transitions to `0ms`.

The Sass palette mixin is upgraded to emit per-theme blocks:

````scss
:root[data-theme='dark'] { @include portfolio-tokens($portfolio-tokens-dark); }
:root[data-theme='light'] { @include portfolio-tokens($portfolio-tokens-light); }
:root[data-theme='midnight'] { @include portfolio-tokens($portfolio-tokens-midnight); }
/* … */
````

The existing light-mode selector (`body:has(.portfolio.light-mode)`)
becomes redundant and is removed in this slice; theme is now a single
attribute on `<html>`.

### Header UX

Replace the current `<button class="header__theme">` with a
**`<div class="header__theme">`** that wraps a button + a popover:

````html
<div class="header__theme">
  <button (click)="themeToggle.emit()" [attr.aria-expanded]="themeMenuOpen()">
    <span class="header__theme-swatch" [style.--swatch]="theme().primary"></span>
    <span>{{ theme().label }}</span>
    <i>⌄</i>
  </button>
  @if (themeMenuOpen() || themeMenuClosing()) {
    <div class="header__theme-menu" role="listbox">
      @for (option of themes(); track option.id) {
        <button role="option"
                [attr.aria-selected]="theme().id === option.id"
                (click)="themeSelect.emit(option.id)">
          <span class="header__theme-swatch" [style.--swatch]="option.primary"></span>
          <span>{{ option.label }}</span>
          @if (theme().id === option.id) { <b>✓</b> }
        </button>
      }
    </div>
  }
</div>
````

Visually:

- The trigger button shows a **filled colour circle** (16 px, with
  `box-shadow` matching the active neon token) and the theme label,
  followed by the same `⌄` glyph the locale button uses.
- The dropdown mirrors the locale dropdown's geometry
  (`width: 180px`, same border, blur, animation). Each row is
  `grid-template-columns: 1.6rem 1fr auto` — circle, label, check.
- The colour circle uses `var(--swatch)` set inline via
  `[style.--swatch]="option.primary"` so each theme announces itself
  before the user clicks it.

### Wire-up in the shell

- `app.page.html` already binds `(themeToggle)="shell.setTheme()"`;
  it becomes `(themeToggle)="shell.toggleThemeMenu()"` and
  `(themeSelect)="shell.setTheme($event)"`.
- `ShellFacade` gains `themeMenuOpen`, `themeMenuClosing` signals
  matching the existing `localeMenuOpen` / `localeMenuClosing` pattern
  (the close animation is reused through the existing `menu-in` /
  `menu-out` keyframes).
- The SSR `index.html` reads the persisted theme cookie /
  `localStorage` value ahead of the first paint and emits the
  matching `data-theme` attribute on `<html>` to avoid a flash of the
  default theme.

### Tests

- `theme.spec.ts`: `setTheme` flips `data-theme`, persists to
  `localStorage`, and ignores unknown ids.
- `header.component.spec.ts`: theme dropdown opens / closes; clicking
  a row emits `themeSelect` with the right id; aria attributes flip.
- Visual regression: not in this slice, but the spec snapshot of the
  header covers the dropdown structure.

## Out of scope

- Per-user scheme override (`auto`) that follows
  `prefers-color-scheme`. Worth adding later but not blocking the
  palette expansion.
- Theme authoring tools / contrast checkers. The eight palettes are
  curated by hand and shipped as a static registry.
- Persisting custom user-mixed palettes.

## Risks

- **Hardcoded colors in components.** Several components still use
  literal hex values (e.g. brand mark `var(--blue)` is fine, but
  inline `background: #090a12` in `body` and the `_palette.scss`
  hex literals must go through tokens). Mitigation: a one-pass audit
  with `grep_search` for `#[0-9a-f]{3,6}` in component SCSS, plus
  using `color-mix(in srgb, var(--surface) …)` to derive derived
  shades from the tokens.
- **Transition cost on heavy pages.** A 480 ms cross-fade on every
  property can feel slow on the demos / lab pages with many
  animated SVG elements. Mitigation: gate the transition by
  `data-theme-transition` so it only runs once per click; allow
  individual components to opt out with `transition: none`.
- **Accessibility.** A theme dropdown needs the same focus /
  keyboard handling the locale dropdown has today. Mitigation: the
  locale dropdown already uses `aria-haspopup="listbox"` /
  `role="option"`; reuse the exact pattern.

## Success criteria

- [ ] Eight themes registered in `src/core/platform/theme.ts`, each
      with a full token set in `_themes.scss`.
- [ ] Switching theme animates every surface colour, text colour,
      border colour and shadow over ~480 ms.
- [ ] Header shows a labelled trigger button with the active
      theme's primary colour as a swatch; the dropdown lists all
      eight themes with their primary colour as a circle prefix.
- [ ] Selection persists across reloads via `localStorage` + SSR
      cookie hydration so the first paint matches the chosen theme.
- [ ] `prefers-reduced-motion` users get an instant switch.
- [ ] `bun run validate` is green (lint + typecheck + tests).

## Slice breakdown (suggested order)

1. **`S1` — Registry & facade**: `theme.ts`, `THEMES`, `ShellFacade`
   replacement of `lightMode` with `theme`. Header still uses the
   old single-button; no visual change yet.
2. **`S2` — Palette expansion**: extend `_palette.scss` (rename to
   `_themes.scss`) with the six new themes; ensure each page renders
   correctly under every theme by manual QA.
3. **`S3` — Transition layer**: add `_theme-transition.scss`,
   wire `data-theme-transition` flip on theme change,
   `prefers-reduced-motion` short-circuit.
4. **`S4` — Header dropdown**: replace the theme button with the
   `header__theme` block; copy locale dropdown CSS / animation;
   add `themeMenuOpen` / `themeMenuClosing` signals; spec coverage.
5. **`S5` — Persistence + SSR**: localStorage write, server-side
   cookie / `Accept-Language`-style theme negotiation in
   `server.ts` (or a parallel `themeMiddleware`), first-paint
   hydration test.