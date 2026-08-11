# GeniusIke the Neko Homepage Design

## Goal

Create a fast, dependency-free personal homepage inspired by the composition of
`lain.observer`: a full-viewport illustration, a large monospaced title in the
upper-left corner, and a compact group of external links and copyright text in
the lower-left corner.

The homepage title is **GeniusIke the Neko** and the user-provided illustration
at `/Users/geniusike/Downloads/IMG_0315.jpeg` is the background artwork.

## Content

The page contains these visible link labels and destinations:

| Label | Destination |
| --- | --- |
| GitHub | `https://github.com/wattlebird` |
| Fediverse | `https://mastodon.social/@wattlebird` |
| Tech blog | `https://blog.ikely.me` |
| Treehole | `https://treehole.ikely.me` |

The footer reads:

> © 2026 GeniusIke. Some rights reserved.

## Visual Design

- Fill the browser viewport with the supplied illustration.
- Keep the artwork centered near the bottom and crop it with `background-size:
  cover`.
- Place the title 20 pixels from the top and left edges.
- Render the title in a bold monospaced typeface at 36 pixels on desktop.
- Place the four underlined links in one vertical stack above the footer.
- Place the footer 20 pixels from the bottom and left edges.
- Use black text over the predominantly white illustration.
- Preserve the sparse, terminal-like appearance of the reference without
  copying its branding, text, or artwork.

At viewport widths of 768 pixels or less, shift the artwork to 58% from the
left so the central neko character remains visible, reduce the title to 28
pixels, and keep all links and footer text inside the viewport.

## Architecture

The site is a static project with no framework, package manager, build step, or
runtime dependency:

- `index.html` provides metadata and semantic page structure.
- `styles.css` owns layout, typography, responsive cropping, focus styles, and
  reduced-motion behavior.
- `script.js` controls the blinking underscore after the title.
- `assets/neko-background.jpeg` is an optimized local copy of the supplied
  image.

The page can be hosted by any static file server.

## Behavior

- The title alternates between `GeniusIke the Neko` and
  `GeniusIke the Neko_` every 500 milliseconds.
- Users who request reduced motion see a stable underscore with no timer.
- Every external link opens in a new tab and uses
  `rel="noopener noreferrer"`.
- Links remain fully usable with a keyboard and have a visible focus state.
- JavaScript is progressive enhancement: all content and links remain visible
  if scripting is unavailable.

## Failure Handling

- The body uses a white fallback color so black text remains readable if the
  background image cannot load.
- No remote fonts, scripts, analytics, or APIs are required, avoiding
  network-dependent failure states.

## Validation

- Confirm the four rendered links use the exact requested destinations.
- Confirm the title animation and reduced-motion alternative.
- Check representative desktop and mobile viewport sizes for clipping,
  readability, and artwork positioning.
- Confirm keyboard focus is visible and the document uses semantic landmarks.
- Confirm the project works through a basic static HTTP server without a build
  step.

## Non-Goals

- Contact forms, analytics, navigation menus, content management, and
  theme-switching are out of scope.
- The project will not reuse assets or source code from `lain.observer`.
