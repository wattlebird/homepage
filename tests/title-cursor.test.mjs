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
