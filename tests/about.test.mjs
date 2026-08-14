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
