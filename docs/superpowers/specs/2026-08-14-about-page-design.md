# About GeniusIke Page Design

## Goal

Add a static About page at `/about/` that extends the existing homepage's
terminal-inspired visual language. The page uses the same current
`assets/neko-background.png` artwork, flipped horizontally, and places its
title and content column on the right side.

## Route and Navigation

- Create `about/index.html`, served at `/about/`.
- End the About content with an underlined `Back` link whose destination is
  `/`.
- Do not add an About link to the homepage as part of this change.

## Content

The document title and page heading are `About GeniusIke`. The heading shows a
blinking underscore with the same 500-millisecond timing and reduced-motion
behavior as the homepage.

The About copy is divided into semantic paragraphs and preserved exactly:

> GeniusIke (a.k.a. Genius⭐️小乖) (they/them/she/her) is the owner of this domain and the author of this page, alongside with the page under subdomain.
>
> As a software developer working for more than 10 years, GeniusIke has rich experience in full stack development. GeniusIke involved in highly complicated desktop client development (mainly using React.js and Vanilla JS) and backend applications including simple RESTful backend to realtime duplex streaming service. Besides that, GeniusIke operates the services on Kubernetes and has a deep understanding on modern observation stack.
>
> GeniusIke is also a queer feminist. Living on a life depending on their own, GeniusIke has decided to follow their own initiative in caring the minorities, and rebel against their family of origin and gender assigned at birth. GeniusIke always stands with minorities, and constantly offers help to them.
>
> GeniusIke’s super idol is ACAね. GeniusIke feels the musics from ZUTOMAYO filled a major part of their spirit. As a clarinet player, GeniusIke is a fan playing various works from them. Occasionally, GeniusIke can also play some classics.
>
> GeniusIke plays an active role in Nintendo related circles, you can always expect GeniusIke’s creative free gifts on Splatoon and Animal Crossing.
>
> You are welcomed to know more about GeniusIke from the blog links on this site. But to summarize their mindset, the following 3 phrases best describes the current status of GeniusIke:

The three closing phrases appear as separate emphasized lines:

> 🐱 KEEP CUTE
>
> 🏳️‍⚧️ KEEP PRIDEFUL
>
> 💪 KEEP REBELLIOUS

## Visual Design

- Render the background through a fixed pseudo-element so
  `transform: scaleX(-1)` mirrors only the artwork, never the text.
- Keep the current white fallback background and local monospaced font stack.
- Place a scrollable content column on the right with a maximum width of 650
  pixels and 20-pixel edge spacing.
- Right-align the heading while keeping paragraphs left-aligned for
  readability.
- Use a 36-pixel heading, 14-pixel body text, and comfortable paragraph
  spacing on desktop.
- Style the three motto lines more prominently than the body copy.
- Style `Back` consistently with the homepage's underlined links and visible
  keyboard focus treatment.

At viewport widths of 768 pixels or less:

- Let the content column occupy the available width with 20-pixel padding.
- Reduce the heading to 28 pixels and body text to 13 pixels.
- Keep the flipped artwork fixed behind the content and reduce its opacity so
  every paragraph remains readable.
- Allow normal vertical page scrolling; do not clip long content.

## Architecture

The implementation remains dependency-free:

- `about/index.html` owns About metadata and semantic content.
- `styles.css` retains homepage styling and adds selectors scoped under
  `.about-page`.
- `script.js` continues to export the homepage title as its default while
  accepting a page-specific title from the heading's `data-title` value.

Both pages load the same shared CSS and JavaScript. No separate About assets,
stylesheets, scripts, framework, package manager, or build step are added.

## Behavior and Failure Handling

- The About heading alternates between `About GeniusIke` and
  `About GeniusIke_` every 500 milliseconds.
- When `prefers-reduced-motion: reduce` is active, the underscore remains
  visible and no interval is scheduled.
- Without JavaScript, the initial heading includes a static underscore and all
  content and navigation remain available.
- If the image fails to load, the white fallback keeps black text readable.
- The Back link is keyboard accessible and receives a visible focus outline.

## Validation

- Verify `/about/` contains the exact supplied paragraphs, motto lines, title,
  and Back destination.
- Verify the page uses only shared local CSS, JavaScript, and artwork.
- Verify the flipped background layer does not mirror page content.
- Extend cursor tests to cover a custom page title while preserving homepage
  defaults, timing, input validation, and reduced-motion behavior.
- Check representative desktop and 390-by-844-pixel mobile viewports for
  readable copy, correct right-column placement, scrolling, and artwork
  positioning.
- Run the complete Node built-in test suite and serve the project with a static
  HTTP server.

## Non-Goals

- Editing the supplied prose for grammar or tone is out of scope.
- Adding new homepage navigation, external dependencies, analytics, or
  additional About interactions is out of scope.
