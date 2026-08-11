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
