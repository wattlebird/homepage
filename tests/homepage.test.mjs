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
  await access(new URL("assets/neko-background.png", projectRoot));
});

test("styles define the approved desktop and mobile composition", async () => {
  const css = await readProjectFile("styles.css");

  assert.ok(
    css.includes('background-image: url("assets/neko-background.png");'),
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
