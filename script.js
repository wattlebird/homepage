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
