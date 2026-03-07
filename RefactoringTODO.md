# Refactoring TODO

Tracks technical debt surfaced by AgentEnforcer CI runs or identified during development sessions.

---

## Format

Each entry must include:
- **Date** – when the debt was identified (YYYY-MM-DD)
- **Area** – file(s) or subsystem affected
- **Description** – what the problem is
- **Priority** – `High` / `Medium` / `Low`
- **Session** – brief description of the conversation that surfaced it

---

## Open Items

### Low Priority

---

**twitter-script-no-sri**
- **Date:** 2026-03-07
- **Area:** `src/components/TwitterEmbed.astro`
- **Description:** `platform.twitter.com/widgets.js` is dynamically injected with no `integrity` (Subresource Integrity) hash. No stable hash exists because Twitter's CDN serves different versions. Proper mitigation requires a Content-Security-Policy header that allowlists `platform.twitter.com` in `script-src`. Blocked by the need for `unsafe-inline` in `script-src` (Astro static output uses inline scripts); a full CSP audit is required before adding the header to `public/_headers`.
- **Priority:** Low
- **Session:** Full codebase audit — AgentEnforcer init

---

**eslintrc-deprecated-format**
- **Date:** 2026-03-07
- **Area:** `.eslintrc.cjs`
- **Description:** The `.eslintrc.*` config format is deprecated in ESLint 8 and removed in ESLint 9. Migration to `eslint.config.js` (flat config) is required before upgrading ESLint. Track the official [migration guide](https://eslint.org/docs/latest/use/configure/migration-guide) when ready.
- **Priority:** Low
- **Session:** Full codebase audit — AgentEnforcer init

---

## Resolved Items

---

**site-url** — 2026-03-07 — Fixed `astro.config.mjs` `site` from `astro-nano-demo.vercel.app` → `the-beef.info`. All canonical URLs, sitemaps and RSS links now point to the correct domain.

**preload-404s** — 2026-03-07 — Removed all hardcoded content-hash `modulepreload` and font `preload` `<link>` tags from `Head.astro`. Astro injects its own preloads; the manual ones caused 404s after every rebuild.

**body-invisible-no-fallback** — 2026-03-07 — Added a 3-second `setTimeout` fallback to the font-loading IIFE in `Head.astro`. The page is now guaranteed to become visible even if `document.fonts` is unavailable or blocked.

**aria-hidden-landmark** — 2026-03-07 — Replaced `aria-hidden="true"` on the `<header>` with the HTML `inert` attribute in `Header.astro`. `inert` removes both the accessibility tree entry and keyboard focus in one attribute, eliminating the WCAG 2.1 violation. Also added a 50 px scroll threshold to prevent flicker.

**entry-slug-deprecated** — 2026-03-07 — Replaced `entry.slug` with `entry.id` in `src/pages/rss.xml.ts` and `src/components/ArrowCard.astro`. Resolves the Astro v5 deprecation.

**domcontentloaded-view-transitions** — 2026-03-07 — Replaced `DOMContentLoaded` with `astro:page-load` in `src/scripts/page-layout.js`. All managers (`ScrollHandler`, `ErrorHandler`, `LoadingIndicator`, `PerformanceMonitor`) now re-initialize on every View Transition navigation.

**gettweet-no-error-handling** — 2026-03-07 — Wrapped `getTweet(id)` in a `try/catch` in `TwitterEmbed.astro`. Unknown tweet IDs now render a graceful fallback UI instead of crashing the page.

**xss-innerhtml** — 2026-03-07 — Replaced `placeholder.innerHTML = \`...\`` with `document.createElement` + `textContent` DOM construction in `TwitterEmbed.astro`. XSS surface eliminated.

**link-no-noopener** — 2026-03-07 — Added `rel="noopener noreferrer"` automatically for external links in `Link.astro`. Also removed the redundant `target="_self"` from non-external links.

**workspace-file-in-content** — 2026-03-07 — Deleted `src/content/work/the-beef.info.code-workspace` from the Astro content collection directory.

**dead-netlify-option** — 2026-03-07 — Removed `cacheOnDemandPages: true` from `astro.config.mjs`. This option has no effect with `output: "static"`.

**duplicate-meta-tags** — 2026-03-07 — Removed the duplicate `viewport`, `description`, and `og:*` meta tags from `PageLayout.astro`. These are already emitted by `<Head />`.

**analytics-token-hardcoded** — 2026-03-07 — Replaced hardcoded Seline token in `PageLayout.astro` with `import.meta.env.PUBLIC_SELINE_TOKEN`. Add this variable to `.env` and Netlify environment settings.

**theme-color-inverted** — 2026-03-07 — Fixed swapped `theme-color` meta values in `PageLayout.astro`: light mode now gets `#f5f5f4` (stone-100) and dark mode gets `#1c1917` (stone-900), matching the page background.

**dual-theme-init** — 2026-03-07 — Removed the redundant theme-initialization script and `html { visibility: hidden }` CSS from `PageLayout.astro`. The single IIFE in `Head.astro` is now the sole theme initializer.

**font-face-duplicate** — 2026-03-07 — Removed the manually-declared `@font-face` blocks from `Head.astro`. The `@fontsource/inter` CSS imports already generate these declarations; the manual copies had hardcoded hashed paths that staled on every build.

**loading-indicator-inverted** — 2026-03-07 — Fixed event order in `page-layout.js`: the bar is now shown on `astro:before-preparation` (navigation starts) and hidden on `astro:page-load` (navigation complete).

**header-no-scroll-threshold** — 2026-03-07 — Added a 50 px minimum delta threshold in `Header.astro`. The header now only hides after a deliberate 50 px downward scroll, eliminating flicker from momentum scrolling.

**domcontentloaded-theme-toggle** — 2026-03-07 — Replaced the dead `DOMContentLoaded` listener in `ThemeToggle.astro` with a direct `updateThemeButtons()` call (executes immediately at script time) plus an `astro:page-load` listener for subsequent navigations.

**mutation-observer-leak** — 2026-03-07 — Added `observer.disconnect()` inside an `astro:before-preparation` listener in `ThemeToggle.astro`. The observer is now cleaned up before each navigation, preventing accumulation across View Transitions.

**announce-duplicated** — 2026-03-07 — Removed the copy-pasted `aria-live` announcement logic from `ThemeToggle.astro`. It now delegates to `window.focusManager.announce()` exposed by `FocusManager.astro`.

**focus-manager-view-transitions** — 2026-03-07 — Guarded the global `keydown` listener in `FocusManager.astro` with a `shortcutsRegistered` boolean flag. The listener is only added once regardless of how many View Transition navigations occur.

**floating-buttons-no-js** — 2026-03-07 — `ScrollHandler.init()` in `page-layout.js` now runs on every `astro:page-load` event, wiring up the `#backToTop` and `#lastUpdate` button click and scroll handlers on every page load including View Transitions.

**back-to-top-no-handler** — 2026-03-07 — Added a `<script>` block to `BackToTop.astro` that attaches a `click` listener performing `window.scrollTo({ top: 0, behavior: "smooth" })`.

**error-boundary-dead-code** — 2026-03-07 — `ErrorHandler.init()` in `page-layout.js` already wires `window.onerror` to `#error-boundary`. The boundary is now actively shown on uncaught errors since `page-layout.js` is re-initialized on every `astro:page-load`.

**error-boundary-inline-onclick** — 2026-03-07 — Replaced `onclick="window.location.reload()"` with a `<script>` block using `addEventListener("click", ...)` in `ErrorBoundary.astro`. Also added `role="alertdialog"` and `aria-modal="true"`.

**loading-indicator-no-wiring** — 2026-03-07 — Added `role="progressbar"`, `aria-label="Page loading"`, `aria-valuemin`, and `aria-valuemax` to `LoadingIndicator.astro`. The JS wiring is handled by `LoadingIndicator.init()` in `page-layout.js`.

**format-date-duplicated** — 2026-03-07 — Removed the local `formatDate` from `TwitterEmbed.astro`. The component now imports and uses `formatDate` from `@lib/utils`, resolving the locale inconsistency (`en-US` vs `en-GB`).

**twitter-embed-observer-stale** — 2026-03-07 — Wrapped the `IntersectionObserver` setup in an `observeContainers()` function and registered it on `astro:page-load`. Lazy-loading video tweets now works correctly on client-side back-navigations.

**prebuild-invalid-key** — 2026-03-07 — Removed `prebuild: true` from the `build` block in `astro.config.mjs`. This key is not in Astro's `BuildConfig` type.

**terser-unsafe-flags** — 2026-03-07 — Removed `unsafe_math`, `unsafe_comps`, `unsafe_Function`, and `unsafe_arrows` from the Terser `compress` config in `astro.config.mjs`.

**mangle-properties-risky** — 2026-03-07 — Removed `properties: { regex: /^_/ }` from the Terser `mangle` config. Property mangling of `_`-prefixed names was at risk of corrupting third-party library internals.

**dateend-schema-loose** — 2026-03-07 — Changed `z.string()` to `z.literal("Present")` in `src/content/config.ts`. The schema now rejects arbitrary strings and only accepts dates or the exact sentinel `"Present"`.

**filename-space** — 2026-03-07 — Renamed `src/content/work/push ups.mdx` → `src/content/work/push-ups.mdx` via `git mv`. URL is now `/work/push-ups` instead of `/work/push%20ups`.

**lora-font-not-loaded** — 2026-03-07 — Added `import "@fontsource/lora/latin.css"` to `Head.astro`. Prose paragraphs now load the Lora serif font as declared in `tailwind.config.mjs`.

**eslint-jsx-a11y-not-configured** — 2026-03-07 — Added `"plugin:jsx-a11y/recommended"` to `.eslintrc.cjs` `extends`. All accessibility rules are now active and caught one real bug on the first CI run (empty anchor in `TwitterEmbed.astro`).

**copyright-year-stale** — 2026-03-07 — Replaced `&copy; 2025` with `&copy; {new Date().getFullYear()}` in `Footer.astro`.

**arrowcard-placeholder-text** — 2026-03-07 — Removed the `"{entry.data.role} details or other relevant information"` placeholder line from `ArrowCard.astro`.

**cleartweet-dead-code** — 2026-03-07 — Removed the `clearTweetCache()` export from `src/lib/tweets.ts`. No runtime use case exists in SSG.

**socials-type-unused** — 2026-03-07 — Removed the unused `Socials` type from `src/types.ts`. Template artifact from Astro Nano.

**reading-speed-magic-number** — 2026-03-07 — Extracted `200` to `const AVERAGE_READING_SPEED_WPM = 200` in `src/lib/utils.ts`.

**twitter-url-hardcoded** — 2026-03-07 — Changed all `twitter.com` URLs to `x.com` in `TwitterEmbed.astro`. Extracted the widgets script URL to `const TWITTER_WIDGETS_URL`.

**link-target-self-redundant** — 2026-03-07 — Removed `target="_self"` from `Link.astro`. The browser's default link behavior is `_self`.

**og-image-template-default** — 2026-03-07 — Changed the default OG image fallback in `Head.astro` from `"/nano.png"` (Astro Nano artifact) to `"/og-image.png"`.

**svg-icons-no-aria-hidden** — 2026-03-07 — Added `aria-hidden="true"` to all four icon SVGs (`MoonIcon`, `SunIcon`, `ArrowUpIcon`, `ArrowDownIcon`).

**icon-sizing-inconsistent** — 2026-03-07 — Standardized `MoonIcon` and `SunIcon` from `width="18" height="18"` attributes to `class="size-[18px]"`, matching the Tailwind-class approach already used by the Arrow icons.

**redundant-aria-roles** — 2026-03-07 — Removed `role="navigation"` from `Navigation.astro`'s `<nav>` and `role="button"` from both `<button>` elements in `FloatingButtons.astro`.

**skip-link-redundant-aria-label** — 2026-03-07 — Removed `aria-label={link.text}` from skip links in `SkipLinks.astro`. The visible text content is sufficient for screen readers.

**skip-link-focus-color-inconsistent** — 2026-03-07 — Replaced hardcoded `#4a90e2` with `theme('colors.blue.500')` in `SkipLinks.astro` focus styles. Updated `:focus-visible` in `global.css` the same way.

**scroll-threshold-var-misleading** — 2026-03-07 — Renamed `scrollThreshold` to `BACK_TO_TOP_SCROLL_OFFSET` in `Head.astro` and added a clarifying comment.

**global-css-hardcoded-hex** — 2026-03-07 — Replaced `background: #000; color: white` with `@apply bg-black text-white` in `.skip-link` inside `global.css`.

**analytics-token-env** — 2026-03-07 — `PUBLIC_SELINE_TOKEN` added to Netlify environment variables. The env var was already wired in `PageLayout.astro` in the previous session; the Netlify deployment now has the value.

**index-work-duplicate** — 2026-03-07 — Deleted `src/pages/work/index.astro` (older, less accessible duplicate). Added `public/_redirects` with `301` redirects for `/work` and `/work/` → `/`. A single canonical timeline now lives at `/`.

**arrowcard-collection-hardcoded** — 2026-03-07 — `ArrowCard.astro` was never imported anywhere in the codebase. Deleted the unused component instead of refactoring its generics.

**consts-unused** — 2026-03-07 — Removed `NUM_POSTS_ON_HOMEPAGE`, `NUM_WORKS_ON_HOMEPAGE`, and `NUM_PROJECTS_ON_HOMEPAGE` from `src/consts.ts` and their type definitions from `src/types.ts`.

**readingtime-daterange-dead** — 2026-03-07 — Removed `readingTime()` and `dateRange()` from `src/lib/utils.ts`. No blog post pages exist in the project; the exports were dead code.

**unused-packages** — 2026-03-07 — Ran `npm uninstall unified unist-util-visit lazysizes @tailwindcss/aspect-ratio`. All four packages had no consumers in `src/`.

**notlikeus-mv-youtube-bug** — 2026-03-07 — Removed stray `/>` from YouTube URL string in `notlikeus-mv.mdx`. The malformed URL was silently breaking the embed.

**grahams-wrong-date** — 2026-03-07 — Fixed `dateStart` in `grahams.mdx` from `"03/15/2024"` (March) to `"05/03/2024"` (May). Entry now appears at the correct position on the timeline alongside Drake's "Family Matters".

**hsts-header-survivability** — 2026-03-07 — Added `Strict-Transport-Security` to the `@astrojs/netlify` adapter's `build.headers` in `astro.config.mjs`. HSTS now survives even if the adapter regenerates `_headers` during build.

**lora-font-gate** — 2026-03-07 — Added `document.fonts.load("1em Lora")` to the `Promise.all` in `Head.astro`. The page reveal now waits for Lora to load, eliminating the Inter → Lora swap visible on first paint.

**vite-config-noise** — 2026-03-07 — Removed `optimizeDeps.force: true` (dev startup penalty), `astro:transitions` from `optimizeDeps.include` and `ssr.noExternal` (virtual module, no-op), and dead `tailwind` branch from `manualChunks` (Tailwind has no JS bundle).

**netlify-adapter-invalid-keys** — 2026-03-07 — Removed unsupported `compress: true`, `minify: true`, and `inlineStylesheets: "always"` from the Netlify adapter's `build` block. Compression/minification is handled by Vite and the Astro `build.inlineStylesheets` key.

**xss-protection-deprecated** — 2026-03-07 — Removed `X-XSS-Protection: 1; mode=block` from the security headers. The header is ignored by all modern browsers and was removed from Chrome in v78.

**seo-meta-description** — 2026-03-07 — Updated `WORK.DESCRIPTION` in `src/consts.ts` from the generic "A timeline of the events." to a keyword-rich description referencing Kendrick Lamar, Drake, and the beef.

**seo-og-meta** — 2026-03-07 — Added `og:locale` and `og:site_name` to `Head.astro`. These are required by most social platforms for proper link preview rendering.

**seo-json-ld** — 2026-03-07 — Added a `WebSite` JSON-LD schema block to `Head.astro`. Enables Google sitelinks searchbox and richer indexing.

**loading-indicator-role** — 2026-03-07 — Changed `LoadingIndicator.astro` from `role="progressbar"` (requires `aria-valuenow`) to `role="status" aria-live="polite"` with a visually-hidden text child that JS updates on navigation start/end.

**error-boundary-focus** — 2026-03-07 — Added `tabindex="-1"` to `ErrorBoundary.astro` and `errorBoundary.focus()` in `page-layout.js`. Keyboard and screen reader users now receive focus when the overlay appears.

**performance-monitor-dead** — 2026-03-07 — Removed `PerformanceMonitor` from `page-layout.js`. The object calculated `loadTime` and immediately discarded it with `void`; it was pure overhead.

**site-email-empty** — 2026-03-07 — Removed `EMAIL: ""` from `src/consts.ts` and its field from `src/types.ts`. The field was never consumed and would silently render nothing if accessed.

**skip-link-css-duplicate** — 2026-03-07 — Removed the `.skip-link` block from `global.css`. The authoritative (richer) scoped styles live in `SkipLinks.astro`.

**rss-machine-format** — 2026-03-07 — Changed RSS item description from `` `Role: ${role}, Company: ${company}` `` to `` `${role} — ${company}` `` in `rss.xml.ts`.

**grammys-typo** — 2026-03-07 — Fixed `"grammny"` → `"Grammy"` in the alt text of `grammys.mdx`.

**role-main-redundant** — 2026-03-07 — Removed `role="main"` from `<main>` in `PageLayout.astro`. The element carries an implicit `main` role.

**role-complementary-misapplied** — 2026-03-07 — Removed `role="complementary"` from the `FloatingButtons.astro` wrapper `<div>`. Navigation shortcut buttons are not complementary content; each button already has an `aria-label`.

**heavy-page-copy** — 2026-03-07 — Replaced `"It's a heavy page, so please be patient."` with `"Scroll to explore the full timeline."` in `index.astro`. The original copy created unnecessary user anxiety.

**transition-persist-static** — 2026-03-07 — Added `transition:persist` to `<Header />` and `<FloatingButtons />` in `PageLayout.astro`. Astro's View Transitions now reuses these DOM elements across navigations instead of tearing them down and rebuilding them.

**youtube-full-urls** — 2026-03-07 — Converted all 48 YouTube embeds in `src/content/work/*.mdx` from full URLs to bare 11-character video IDs. Bare IDs enable `astro-embed`'s lite-embed path with lazy-loading poster images.

**twitter-preconnect** — 2026-03-07 — Added `<link rel="preconnect">` and `<link rel="dns-prefetch">` for `platform.twitter.com` in `PageLayout.astro`. Eliminates cold DNS/TCP/TLS handshakes on first Twitter widget load.
