# GeniusIke the Neko Homepage Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dependency-free personal homepage with the approved full-screen neko artwork, terminal-style title, four external links, and responsive behavior.

**Architecture:** A semantic `index.html` supplies all content, `styles.css` owns the full-viewport composition and responsive crop, and a small ES module animates the title cursor. Node's built-in test runner verifies the static contract and the isolated cursor behavior without adding project dependencies.

**Tech Stack:** HTML5, CSS3, browser ES modules, Node.js 22 built-in test runner, macOS `sips`, Python 3 static HTTP server

## Global Constraints

- Use no framework, package manager, build step, or runtime dependency.
- Use the title `GeniusIke the Neko`.
- Use the supplied image from `/Users/geniusike/Downloads/IMG_0315.jpeg`.
- Use the exact four link labels and destinations from the approved design.
- Use the footer text `© 2026 GeniusIke. Some rights reserved.`
- Open every external link in a new tab with `rel="noopener noreferrer"`.
- Alternate the title cursor every 500 milliseconds.
- Keep a stable underscore and schedule no timer when reduced motion is requested.
- Use only local assets; do not copy assets or source code from `lain.observer`.
- Preserve all content and links when JavaScript is unavailable.
- At viewport widths of 768 pixels or less, use a 28-pixel title and position the background at `58% bottom`.
- Work in the local Git repository initialized during execution pre-flight.

## File Map

- `.gitignore` excludes the visual-brainstorming workspace and macOS metadata.
- `index.html` contains metadata, semantic landmarks, title, links, footer, and local asset references.
- `styles.css` contains the full-viewport layout, typography, focus treatment, and mobile crop.
- `script.js` exports cursor-formatting and animation functions, then progressively enhances the title in a browser.
- `assets/neko-background.jpeg` is the optimized local background image.
- `tests/homepage.test.mjs` verifies content, link safety, local assets, and responsive CSS.
- `tests/title-cursor.test.mjs` verifies cursor text, timing, and reduced-motion behavior.

---

### Task 1: Static Homepage Layout

**Files:**
- Create: `.gitignore`
- Create: `tests/homepage.test.mjs`
- Create: `index.html`
- Create: `styles.css`
- Create: `script.js`
- Create: `assets/neko-background.jpeg`

**Interfaces:**
- Consumes: `/Users/geniusike/Downloads/IMG_0315.jpeg`
- Produces: the `[data-title]` heading consumed by `script.js`; the `.links` navigation; the `assets/neko-background.jpeg` URL consumed by `styles.css`; a valid no-op ES module that Task 2 enhances

- [ ] **Step 1: Verify Git and ignore local scratch files**

Run:

```bash
git rev-parse --show-toplevel
```

Expected: Git prints `/Users/geniusike/Project/homepage`.

Create `.gitignore`:

```gitignore
.DS_Store
.superpowers/
```

- [ ] **Step 2: Write the failing static contract test**

Create `tests/homepage.test.mjs`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);

function readProjectFile(path) {
  return readFile(new URL(path, projectRoot), "utf8");
}

const links = [
  ["GitHub", "https://github.com/wattlebird"],
  ["Fediverse", "https://mastodon.social/@wattlebird"],
  ["Tech blog", "https://blog.ikely.me"],
  ["Treehole", "https://treehole.ikely.me"],
];

test("homepage contains the approved semantic content", async () => {
  const html = await readProjectFile("index.html");

  assert.ok(html.includes("<title>GeniusIke the Neko</title>"));
  assert.ok(
    html.includes(
      '<h1 class="site-title" data-title>GeniusIke the Neko_</h1>',
    ),
  );
  assert.ok(html.includes('<main class="page">'));
  assert.ok(
    html.includes('<nav class="links" aria-label="External links">'),
  );
  assert.ok(
    html.includes(
      '<footer class="site-footer">© 2026 GeniusIke. Some rights reserved.</footer>',
    ),
  );

  for (const [label, destination] of links) {
    assert.ok(
      html.includes(
        `<a href="${destination}" target="_blank" rel="noopener noreferrer">${label}</a>`,
      ),
      `${label} must use the approved URL and safe external-link attributes`,
    );
  }
});

test("homepage uses only local presentation assets", async () => {
  const html = await readProjectFile("index.html");

  assert.ok(html.includes('<link rel="stylesheet" href="styles.css">'));
  assert.ok(html.includes('<script type="module" src="script.js"></script>'));
  assert.doesNotMatch(html, /https?:\/\/[^"]+\.(?:css|js)(?:["?])/);
  await access(new URL("script.js", projectRoot));
  await access(new URL("assets/neko-background.jpeg", projectRoot));
});

test("styles define the approved desktop and mobile composition", async () => {
  const css = await readProjectFile("styles.css");

  assert.ok(
    css.includes('background-image: url("assets/neko-background.jpeg");'),
  );
  assert.ok(css.includes("background-position: center bottom;"));
  assert.ok(css.includes("background-size: cover;"));
  assert.ok(css.includes(".site-title"));
  assert.ok(css.includes("font-size: 36px;"));
  assert.ok(css.includes(":focus-visible"));

  const mobileRules = css.slice(css.indexOf("@media (max-width: 768px)"));
  assert.notEqual(mobileRules, css);
  assert.ok(mobileRules.includes("background-position: 58% bottom;"));
  assert.ok(mobileRules.includes("font-size: 28px;"));
});
```

- [ ] **Step 3: Run the static contract test and verify it fails**

Run:

```bash
node --test tests/homepage.test.mjs
```

Expected: FAIL with `ENOENT` because `index.html` does not exist.

- [ ] **Step 4: Optimize the supplied image into the local assets directory**

Run:

```bash
mkdir -p assets
sips -s format jpeg -s formatOptions 82 --resampleWidth 2400 /Users/geniusike/Downloads/IMG_0315.jpeg --out assets/neko-background.jpeg
sips -g pixelWidth -g pixelHeight assets/neko-background.jpeg
```

Expected: `assets/neko-background.jpeg` is created with a width of 2400 pixels and a height of approximately 1698 pixels.

- [ ] **Step 5: Implement the semantic page**

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta
      name="description"
      content="GeniusIke the Neko — links to GitHub, the Fediverse, a tech blog, and Treehole."
    >
    <meta name="color-scheme" content="light">
    <title>GeniusIke the Neko</title>
    <link rel="stylesheet" href="styles.css">
    <script type="module" src="script.js"></script>
  </head>
  <body>
    <main class="page">
      <h1 class="site-title" data-title>GeniusIke the Neko_</h1>

      <nav class="links" aria-label="External links">
        <a href="https://github.com/wattlebird" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://mastodon.social/@wattlebird" target="_blank" rel="noopener noreferrer">Fediverse</a>
        <a href="https://blog.ikely.me" target="_blank" rel="noopener noreferrer">Tech blog</a>
        <a href="https://treehole.ikely.me" target="_blank" rel="noopener noreferrer">Treehole</a>
      </nav>
    </main>

    <footer class="site-footer">© 2026 GeniusIke. Some rights reserved.</footer>
  </body>
</html>
```

- [ ] **Step 6: Implement the reference-inspired responsive layout**

Create `styles.css`:

```css
:root {
  color-scheme: light;
  font-family: "SFMono-Regular", "Roboto Mono", "Liberation Mono", Consolas,
    monospace;
  color: #050505;
  background-color: #fff;
}

* {
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  min-height: 100%;
}

body {
  min-height: 100vh;
  min-height: 100svh;
  margin: 0;
  overflow: hidden;
  background-color: #fff;
  background-image: url("assets/neko-background.jpeg");
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;
}

.page {
  min-height: inherit;
}

.site-title {
  position: fixed;
  top: 20px;
  left: 20px;
  max-width: calc(100vw - 40px);
  margin: 0;
  font-size: 36px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.05em;
}

.links {
  position: fixed;
  bottom: 62px;
  left: 20px;
  display: grid;
  gap: 8px;
}

.links a {
  width: fit-content;
  color: inherit;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.links a:focus-visible {
  outline: 2px solid #050505;
  outline-offset: 4px;
  box-shadow: 0 0 0 5px #fff;
}

.site-footer {
  position: fixed;
  bottom: 20px;
  left: 20px;
  max-width: calc(100vw - 40px);
  font-size: 12px;
  line-height: 1.3;
}

@media (max-width: 768px) {
  body {
    background-position: 58% bottom;
  }

  .site-title {
    font-size: 28px;
  }

  .links {
    bottom: 60px;
  }

  .links a {
    font-size: 15px;
  }

  .site-footer {
    font-size: 11px;
  }
}
```

- [ ] **Step 7: Add the valid no-op enhancement module**

Create `script.js`:

```javascript
export {};
```

This keeps the static page free of browser errors while leaving the title and links fully usable without animation.

- [ ] **Step 8: Run the static contract test and verify it passes**

Run:

```bash
node --test tests/homepage.test.mjs
```

Expected: three tests pass with zero failures.

- [ ] **Step 9: Commit the static homepage**

Run:

```bash
git add .gitignore index.html styles.css script.js assets/neko-background.jpeg tests/homepage.test.mjs
git commit -m "feat: add static Neko homepage layout" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

Expected: one feature commit records the page structure, styling, image, and passing contract tests.

---

### Task 2: Accessible Title Cursor

**Files:**
- Create: `tests/title-cursor.test.mjs`
- Modify: `script.js`

**Interfaces:**
- Consumes: the `HTMLElement` selected by `[data-title]`; `window.matchMedia("(prefers-reduced-motion: reduce)")`
- Produces: `BASE_TITLE: string`; `formatTitle(cursorVisible: boolean): string`; `startTitleCursor(options: { element: { textContent: string }; reducedMotion: boolean; setIntervalFn?: (callback: () => void, delay: number) => unknown }): unknown | null`

- [ ] **Step 1: Write the failing cursor behavior tests**

Create `tests/title-cursor.test.mjs`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import {
  BASE_TITLE,
  formatTitle,
  startTitleCursor,
} from "../script.js";

test("formatTitle returns both cursor states", () => {
  assert.equal(BASE_TITLE, "GeniusIke the Neko");
  assert.equal(formatTitle(false), "GeniusIke the Neko");
  assert.equal(formatTitle(true), "GeniusIke the Neko_");
});

test("startTitleCursor toggles the cursor every 500 milliseconds", () => {
  const element = { textContent: "" };
  const timerHandle = Symbol("timer");
  let callback;
  let delay;

  const result = startTitleCursor({
    element,
    reducedMotion: false,
    setIntervalFn(next, milliseconds) {
      callback = next;
      delay = milliseconds;
      return timerHandle;
    },
  });

  assert.equal(result, timerHandle);
  assert.equal(delay, 500);
  assert.equal(element.textContent, "GeniusIke the Neko_");

  callback();
  assert.equal(element.textContent, "GeniusIke the Neko");

  callback();
  assert.equal(element.textContent, "GeniusIke the Neko_");
});

test("startTitleCursor keeps a stable cursor for reduced motion", () => {
  const element = { textContent: "" };
  let timerScheduled = false;

  const result = startTitleCursor({
    element,
    reducedMotion: true,
    setIntervalFn() {
      timerScheduled = true;
    },
  });

  assert.equal(result, null);
  assert.equal(timerScheduled, false);
  assert.equal(element.textContent, "GeniusIke the Neko_");
});

test("startTitleCursor rejects a missing title element", () => {
  assert.throws(
    () =>
      startTitleCursor({
        element: null,
        reducedMotion: false,
        setIntervalFn: setInterval,
      }),
    {
      name: "TypeError",
      message: "A title element with textContent is required.",
    },
  );
});
```

- [ ] **Step 2: Run the cursor tests and verify they fail**

Run:

```bash
node --test tests/title-cursor.test.mjs
```

Expected: FAIL because `script.js` does not export `BASE_TITLE`, `formatTitle`, or `startTitleCursor`.

- [ ] **Step 3: Implement the progressive cursor enhancement**

Replace `script.js` with:

```javascript
export const BASE_TITLE = "GeniusIke the Neko";

export function formatTitle(cursorVisible) {
  return `${BASE_TITLE}${cursorVisible ? "_" : ""}`;
}

export function startTitleCursor({
  element,
  reducedMotion,
  setIntervalFn = globalThis.setInterval,
}) {
  if (!element || !("textContent" in element)) {
    throw new TypeError("A title element with textContent is required.");
  }

  let cursorVisible = true;
  element.textContent = formatTitle(cursorVisible);

  if (reducedMotion) {
    return null;
  }

  return setIntervalFn(() => {
    cursorVisible = !cursorVisible;
    element.textContent = formatTitle(cursorVisible);
  }, 500);
}

if (typeof document !== "undefined" && typeof window !== "undefined") {
  const title = document.querySelector("[data-title]");
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  startTitleCursor({
    element: title,
    reducedMotion,
    setIntervalFn: window.setInterval.bind(window),
  });
}
```

- [ ] **Step 4: Run the cursor tests and verify they pass**

Run:

```bash
node --test tests/title-cursor.test.mjs
```

Expected: four tests pass with zero failures.

- [ ] **Step 5: Run the complete test suite**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: seven tests pass with zero failures.

- [ ] **Step 6: Verify the static site over HTTP**

Run:

```bash
python3 -m http.server 4173 --directory . >/tmp/geniusike-homepage-http.log 2>&1 &
server_pid=$!
trap 'kill "$server_pid"' EXIT
sleep 1
curl --fail --silent http://127.0.0.1:4173/ | grep -F "<title>GeniusIke the Neko</title>"
```

Expected: the command prints `<title>GeniusIke the Neko</title>` and exits successfully.

Open `http://127.0.0.1:4173/` in the browser canvas and inspect both a desktop viewport and a 390-by-844-pixel mobile viewport. The desktop view must show the complete title, four unobscured links, and footer inside the viewport. The mobile view must retain the central neko character, use the 28-pixel title, and keep the complete link stack and footer visible.

- [ ] **Step 7: Commit the cursor behavior**

Run:

```bash
git add script.js tests/title-cursor.test.mjs
git commit -m "feat: add accessible title cursor" -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>"
```

Expected: a second commit records the tested 500-millisecond cursor animation and reduced-motion behavior.
