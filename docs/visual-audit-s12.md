# S12 visual and responsive audit

- **Date:** 2026-11-23
- **Browser:** Chromium through Playwright
- **Dev server:** fresh Angular server on `http://localhost:4410`
- **Locale:** Spanish (`/es/...`)
- **Themes:** `dark` and `light`
- **Viewports:** 1366×768, 768×1024 (tablet), 390×844 (mobile)

## Named matrix

The measurement checks the document width, every rendered text node below 12px, semantic focus/scrim tokens and the footer chrome. The `-10px` document delta is the intentionally reserved scrollbar gutter, not overflow.

| Route | 1366×768 dark/light | 768×1024 dark/light | 390×844 dark/light | Result |
| --- | --- | --- | --- | --- |
| Home | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | pass |
| Work | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | pass |
| Lab | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | pass |
| Approach | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | pass |
| Knowledge | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | pass |
| Docker | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | pass |
| Demos | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | pass |
| Contact | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | overflow `≤0`, text `≥12px` | pass |

**48/48 cases passed** for page overflow and the 12px text floor.

## Controlled local scrolling

- At 390px, the Lab chart picker intentionally uses a local horizontal scroller for all 14 chart controls. No card or label depends on ellipsis.
- At 390px, Home destinations use a snap-scrolling local rail. The cards remain reachable and do not create page overflow. S16 still owns the requested larger monitor composition and final no-overlap visual audit.

## Footer truth

All routes and both schemes report:

- `backgroundColor: rgba(0, 0, 0, 0)`
- `borderTopWidth: 0px`
- `boxShadow: none`

Only the back-to-top and profile link surfaces receive button backgrounds.

## Transition and motion truth

- `CSS.supports('view-transition-name: route-content')`: `true`
- Normal route sequence: 0 console errors
- Rapid stress: 14 navigations separated by 25ms, 0 console/page errors, 0 running animations after settle
- `prefers-reduced-motion: reduce`:
  - `scrollBehavior: auto`
  - route/controls transition duration: `0.00001s` (`0.01ms`)
- Dark/light semantic samples:
  - dark focus `#5ae2ff`, scrim `rgba(1, 7, 15, 0.84)`
  - light focus `#005ea8`, scrim `rgba(236, 244, 255, 0.76)`

## Blocking follow-up ownership

S12 establishes and verifies the shared system. It does not waive the S16 human-visual requirements: wider desktop monitor use, final icon/text collision audit, project-specific Work effects, canonical sports maps, higher-detail exoplanets and quaternion-aware Saturn rings. S16 remains blocking before S14 certification and deployment.
