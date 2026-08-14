# About GeniusIke Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a responsive `/about/` page with the current artwork flipped horizontally, right-side content, exact supplied biography, shared blinking-title behavior, and a Back link to `/`.

**Architecture:** Generalize the existing title-cursor module so a heading may supply a page-specific title while retaining the homepage default. Add one semantic `about/index.html` and scope its layout rules under `.about-page` in the shared stylesheet; Node's built-in test runner verifies exact content, shared local assets, responsive CSS, and cursor behavior.

**Tech Stack:** HTML5, CSS3, browser ES modules, Node.js 22 built-in test runner, Python 3 static HTTP server

## Global Constraints

- Keep the project dependency-free: no framework, package manager, build step, remote font, remote script, or runtime dependency.
- Serve the new page from `about/index.html` at `/about/`.
- Use the current `assets/neko-background.png` artwork and preserve the user's existing PNG replacement.
- Flip only the About background horizontally; never mirror text or controls.
- Use the document title and page heading `About GeniusIke`.
- Preserve every supplied biography sentence, punctuation mark, pronoun, emoji, and motto phrase exactly.
- End the content with an underlined `Back` link to `/`.
- Do not add an About link to the homepage.
- Keep the content column on the right, right-align the heading, and left-align paragraphs.
- Use a 650-pixel maximum content width, 36-pixel desktop heading, and 14-pixel desktop body text.
- At viewport widths of 768 pixels or less, use a 28-pixel heading, 13-pixel body text, full-width content with 20-pixel padding, and a faded fixed background.
- Allow normal vertical scrolling on the About page while preserving the homepage's clipped full-screen layout.
- Blink the About underscore every 500 milliseconds; with reduced motion, retain a static underscore and schedule no interval.
- Preserve full content and navigation when JavaScript is unavailable.
- Preserve the user's uncommitted `.gitignore` change and never stage it in feature commits.

## File Map

- `script.js` keeps the existing homepage default and accepts a title from the heading's `data-title` value.
- `tests/title-cursor.test.mjs` adds coverage for page-specific title text.
- `about/index.html` contains About metadata, semantic biography paragraphs, motto lines, and Back navigation.
- `styles.css` retains homepage rules and adds About-only background, scrolling, typography, layout, focus, and mobile rules.
- `tests/about.test.mjs` verifies exact About content, shared local resources, navigation, and About CSS contracts.
- `tests/homepage.test.mjs` follows the current PNG asset without changing homepage content or behavior.
- `assets/neko-background.png` is the user's current shared artwork; the superseded JPEG is removed.

---

### Task 1: Shared Page-Specific Title Cursor

**Files:**
- Modify: `script.js`
- Modify: `tests/title-cursor.test.mjs`

**Interfaces:**
- Consumes: an element with `textContent` and optional `dataset.title`; `prefers-reduced-motion`; an interval function
- Produces: `BASE_TITLE: string`; `formatTitle(cursorVisible: boolean, baseTitle?: string): string`; `startTitleCursor(options): unknown | null`

- [ ] **Step 1: Add a failing test for a page-specific title**

Replace `tests/title-cursor.test.mjs` with:

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import {
  BASE_TITLE,
  formatTitle,
  startTitleCursor,
} from "../script.js";

test("formatTitle returns both homepage cursor states", () => {
  assert.equal(BASE_TITLE, "GeniusIke the Neko");
  assert.equal(formatTitle(false), "GeniusIke the Neko");
  assert.equal(formatTitle(true), "GeniusIke the Neko_");
});

test("formatTitle accepts a page-specific title", () => {
  assert.equal(formatTitle(false, "About GeniusIke"), "About GeniusIke");
  assert.equal(formatTitle(true, "About GeniusIke"), "About GeniusIke_");
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

test("startTitleCursor reads the title from the element dataset", () => {
  const element = {
    dataset: { title: "About GeniusIke" },
    textContent: "",
  };
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
  assert.equal(element.textContent, "About GeniusIke_");
});

test("startTitleCursor keeps a stable homepage cursor for reduced motion", () => {
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

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```bash
node --test tests/title-cursor.test.mjs
```

Expected: two new tests fail because `formatTitle` ignores its second argument and `startTitleCursor` does not read `element.dataset.title`.

- [ ] **Step 3: Generalize the title cursor without breaking homepage defaults**

Replace `script.js` with:

```javascript
export const BASE_TITLE = "GeniusIke the Neko";

export function formatTitle(cursorVisible, baseTitle = BASE_TITLE) {
  return `${baseTitle}${cursorVisible ? "_" : ""}`;
}

export function startTitleCursor({
  element,
  reducedMotion,
  setIntervalFn = globalThis.setInterval,
}) {
  if (!element || !("textContent" in element)) {
    throw new TypeError("A title element with textContent is required.");
  }

  const baseTitle = element.dataset?.title || BASE_TITLE;
  let cursorVisible = true;
  element.textContent = formatTitle(cursorVisible, baseTitle);

  if (reducedMotion) {
    return null;
  }

  return setIntervalFn(() => {
    cursorVisible = !cursorVisible;
    element.textContent = formatTitle(cursorVisible, baseTitle);
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

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/title-cursor.test.mjs
```

Expected: six tests pass with zero failures and pristine output.

- [ ] **Step 5: Run the existing homepage contract tests**

Run:

```bash
node --test tests/homepage.test.mjs
```

Expected: the semantic-content test passes; two asset assertions remain red
until Task 2 updates the intentional PNG replacement.

- [ ] **Step 6: Commit only the cursor change**

Run:

```bash
git add script.js tests/title-cursor.test.mjs
git commit -m "refactor: support page-specific title cursor" \
  -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>" \
  -m "Copilot-Session: bffb1a91-1d6f-4509-a652-40a0d0dda01c"
```

Expected: one commit records the generalized, tested cursor behavior without staging `.gitignore`, the artwork replacement, or About files.

---

### Task 2: Responsive About Page

**Files:**
- Create: `about/index.html`
- Create: `tests/about.test.mjs`
- Modify: `styles.css`
- Modify: `tests/homepage.test.mjs`
- Add: `assets/neko-background.png`
- Delete: `assets/neko-background.jpeg`

**Interfaces:**
- Consumes: `styles.css`, `script.js`, and `assets/neko-background.png` from the project root
- Produces: a static `/about/` document; `.about-page`, `.about-content`, `.about-title`, `.about-copy`, `.about-motto`, and `.about-back` style hooks

- [ ] **Step 1: Write the failing About page contract tests**

Create `tests/about.test.mjs`:

```javascript
import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const projectRoot = new URL("../", import.meta.url);

function readProjectFile(path) {
  return readFile(new URL(path, projectRoot), "utf8");
}

const paragraphs = [
  "GeniusIke (a.k.a. Genius⭐️小乖) (they/them/she/her) is the owner of this domain and the author of this page, alongside with the page under subdomain.",
  "As a software developer working for more than 10 years, GeniusIke has rich experience in full stack development. GeniusIke involved in highly complicated desktop client development (mainly using React.js and Vanilla JS) and backend applications including simple RESTful backend to realtime duplex streaming service. Besides that, GeniusIke operates the services on Kubernetes and has a deep understanding on modern observation stack.",
  "GeniusIke is also a queer feminist. Living on a life depending on their own, GeniusIke has decided to follow their own initiative in caring the minorities, and rebel against their family of origin and gender assigned at birth. GeniusIke always stands with minorities, and constantly offers help to them.",
  "GeniusIke’s super idol is ACAね. GeniusIke feels the musics from ZUTOMAYO filled a major part of their spirit. As a clarinet player, GeniusIke is a fan playing various works from them. Occasionally, GeniusIke can also play some classics.",
  "GeniusIke plays an active role in Nintendo related circles, you can always expect GeniusIke’s creative free gifts on Splatoon and Animal Crossing.",
  "You are welcomed to know more about GeniusIke from the blog links on this site. But to summarize their mindset, the following 3 phrases best describes the current status of GeniusIke:",
];

const mottos = [
  "🐱 KEEP CUTE",
  "🏳️‍⚧️ KEEP PRIDEFUL",
  "💪 KEEP REBELLIOUS",
];

test("About page contains the exact approved semantic content", async () => {
  const html = await readProjectFile("about/index.html");

  assert.ok(html.includes("<title>About GeniusIke</title>"));
  assert.ok(html.includes('<body class="about-page">'));
  assert.ok(
    html.includes(
      '<h1 class="site-title about-title" data-title="About GeniusIke">About GeniusIke_</h1>',
    ),
  );

  for (const paragraph of paragraphs) {
    assert.ok(
      html.includes(`<p>${paragraph}</p>`),
      `Missing exact paragraph: ${paragraph}`,
    );
  }

  for (const motto of mottos) {
    assert.ok(html.includes(`<li>${motto}</li>`), `Missing motto: ${motto}`);
  }

  assert.ok(html.includes('<a class="about-back" href="/">Back</a>'));
});

test("About page reuses only local shared presentation resources", async () => {
  const html = await readProjectFile("about/index.html");

  assert.ok(html.includes('<link rel="stylesheet" href="../styles.css">'));
  assert.ok(html.includes('<script type="module" src="../script.js"></script>'));
  assert.doesNotMatch(html, /https?:\/\/[^"]+\.(?:css|js)(?:["?])/);
  await access(new URL("assets/neko-background.png", projectRoot));
});

test("About styles flip only the background and support responsive scrolling", async () => {
  const css = await readProjectFile("styles.css");

  assert.ok(css.includes(".about-page::before"));
  assert.ok(css.includes("transform: scaleX(-1);"));
  assert.ok(css.includes("overflow-y: auto;"));
  assert.ok(css.includes("width: min(650px, calc(100% - 40px));"));
  assert.ok(css.includes(".about-title"));
  assert.ok(css.includes("text-align: right;"));
  assert.ok(css.includes(".about-copy"));
  assert.ok(css.includes("font-size: 14px;"));
  assert.ok(css.includes(".about-back:focus-visible"));

  const mobileRules = css.slice(css.indexOf("@media (max-width: 768px)"));
  assert.ok(mobileRules.includes(".about-content"));
  assert.ok(mobileRules.includes("width: 100%;"));
  assert.ok(mobileRules.includes("padding: 20px;"));
  assert.ok(mobileRules.includes(".about-title"));
  assert.ok(mobileRules.includes("font-size: 28px;"));
  assert.ok(mobileRules.includes(".about-copy"));
  assert.ok(mobileRules.includes("font-size: 13px;"));
  assert.ok(mobileRules.includes("opacity: 0.14;"));
});
```

- [ ] **Step 2: Update the homepage asset contract to the current PNG**

In `tests/homepage.test.mjs`, replace:

```javascript
await access(new URL("assets/neko-background.jpeg", projectRoot));
```

with:

```javascript
await access(new URL("assets/neko-background.png", projectRoot));
```

Replace:

```javascript
css.includes('background-image: url("assets/neko-background.jpeg");')
```

with:

```javascript
css.includes('background-image: url("assets/neko-background.png");')
```

- [ ] **Step 3: Run the static page tests and verify RED**

Run:

```bash
node --test tests/homepage.test.mjs tests/about.test.mjs
```

Expected: homepage tests pass, while all About tests fail with `ENOENT` because `about/index.html` does not exist.

- [ ] **Step 4: Create the semantic About document**

Create `about/index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta
      name="description"
      content="About GeniusIke — software developer, queer feminist, musician, and Nintendo community creator."
    >
    <meta name="color-scheme" content="light">
    <title>About GeniusIke</title>
    <link rel="stylesheet" href="../styles.css">
    <script type="module" src="../script.js"></script>
  </head>
  <body class="about-page">
    <main class="about-content">
      <h1 class="site-title about-title" data-title="About GeniusIke">About GeniusIke_</h1>

      <article class="about-copy">
        <p>GeniusIke (a.k.a. Genius⭐️小乖) (they/them/she/her) is the owner of this domain and the author of this page, alongside with the page under subdomain.</p>
        <p>As a software developer working for more than 10 years, GeniusIke has rich experience in full stack development. GeniusIke involved in highly complicated desktop client development (mainly using React.js and Vanilla JS) and backend applications including simple RESTful backend to realtime duplex streaming service. Besides that, GeniusIke operates the services on Kubernetes and has a deep understanding on modern observation stack.</p>
        <p>GeniusIke is also a queer feminist. Living on a life depending on their own, GeniusIke has decided to follow their own initiative in caring the minorities, and rebel against their family of origin and gender assigned at birth. GeniusIke always stands with minorities, and constantly offers help to them.</p>
        <p>GeniusIke’s super idol is ACAね. GeniusIke feels the musics from ZUTOMAYO filled a major part of their spirit. As a clarinet player, GeniusIke is a fan playing various works from them. Occasionally, GeniusIke can also play some classics.</p>
        <p>GeniusIke plays an active role in Nintendo related circles, you can always expect GeniusIke’s creative free gifts on Splatoon and Animal Crossing.</p>
        <p>You are welcomed to know more about GeniusIke from the blog links on this site. But to summarize their mindset, the following 3 phrases best describes the current status of GeniusIke:</p>

        <ul class="about-motto" aria-label="GeniusIke's current mindset">
          <li>🐱 KEEP CUTE</li>
          <li>🏳️‍⚧️ KEEP PRIDEFUL</li>
          <li>💪 KEEP REBELLIOUS</li>
        </ul>

        <a class="about-back" href="/">Back</a>
      </article>
    </main>
  </body>
</html>
```

- [ ] **Step 5: Extend the shared stylesheet with scoped About rules**

Replace `styles.css` with:

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
  background-image: url("assets/neko-background.png");
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

.links a,
.about-back {
  width: fit-content;
  color: inherit;
  font-size: 16px;
  font-weight: 700;
  line-height: 1.2;
  text-decoration-line: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 3px;
}

.links a:focus-visible,
.about-back:focus-visible {
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

.about-page {
  position: relative;
  isolation: isolate;
  overflow-x: hidden;
  overflow-y: auto;
  background-image: none;
}

.about-page::before {
  position: fixed;
  inset: 0;
  z-index: -1;
  background-color: #fff;
  background-image: url("assets/neko-background.png");
  background-repeat: no-repeat;
  background-position: center bottom;
  background-size: cover;
  content: "";
  transform: scaleX(-1);
}

.about-content {
  width: min(650px, calc(100% - 40px));
  min-height: 100vh;
  min-height: 100svh;
  margin-left: auto;
  padding: 20px 20px 48px 0;
}

.about-title {
  position: static;
  max-width: none;
  margin: 0 0 30px;
  text-align: right;
}

.about-copy {
  font-size: 14px;
  line-height: 1.58;
}

.about-copy p {
  margin: 0 0 20px;
}

.about-motto {
  display: grid;
  gap: 7px;
  margin: 28px 0;
  padding: 0;
  font-size: 18px;
  font-weight: 700;
  list-style: none;
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

  .about-page::before {
    background-position: 42% bottom;
    opacity: 0.14;
  }

  .about-content {
    width: 100%;
    padding: 20px;
  }

  .about-title {
    font-size: 28px;
  }

  .about-copy {
    font-size: 13px;
    line-height: 1.55;
  }

  .about-motto {
    font-size: 16px;
  }
}
```

- [ ] **Step 6: Run the static page tests and verify GREEN**

Run:

```bash
node --test tests/homepage.test.mjs tests/about.test.mjs
```

Expected: six tests pass with zero failures and pristine output.

- [ ] **Step 7: Run the complete test suite**

Run:

```bash
node --test tests/*.test.mjs
```

Expected: twelve tests pass with zero failures and pristine output.

- [ ] **Step 8: Verify both routes over HTTP**

Run:

```bash
python3 -m http.server 4173 --bind 127.0.0.1 --directory . > .superpowers/about-http.log 2>&1 &
server_pid=$!
trap 'kill "$server_pid"' EXIT
sleep 1
curl --fail --silent http://127.0.0.1:4173/ | grep -F "<title>GeniusIke the Neko</title>"
curl --fail --silent http://127.0.0.1:4173/about/ | grep -F "<title>About GeniusIke</title>"
```

Expected: both title lines print and both requests exit successfully.

Open `http://127.0.0.1:4173/about/` in the browser canvas. Confirm the desktop page shows the mirrored artwork on the left, the title and readable column on the right, all paragraphs and motto lines in the supplied order, visible Back navigation, and normal vertical scrolling. Confirm the mobile CSS contract at 768 pixels or less through the passing test: full-width padded content, 28-pixel heading, 13-pixel copy, and 0.14 background opacity.

- [ ] **Step 9: Commit only the About implementation and current artwork replacement**

Run:

```bash
git add about/index.html styles.css tests/about.test.mjs tests/homepage.test.mjs assets/neko-background.png
git add -u assets/neko-background.jpeg
git diff --cached --name-only
```

Expected staged paths:

```text
about/index.html
assets/neko-background.jpeg
assets/neko-background.png
styles.css
tests/about.test.mjs
tests/homepage.test.mjs
```

Confirm `.gitignore` is not staged, then run:

```bash
git commit -m "feat: add About GeniusIke page" \
  -m "Co-authored-by: Copilot App <223556219+Copilot@users.noreply.github.com>" \
  -m "Copilot-Session: bffb1a91-1d6f-4509-a652-40a0d0dda01c"
```

Expected: one commit records the About route, shared responsive styling, exact content tests, and current PNG artwork replacement while leaving the user's `.gitignore` change untouched.
