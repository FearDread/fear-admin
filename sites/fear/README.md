# FEAR GUI SPA: Garrett Haptonstall

A single-page resume built on the FEAR GUI framework, esbuild, jQuery and GSAP. Tone: dark comedy.

## Install / run

```bash
npm install
npm run dev      # watch mode
npm run build    # production bundle -> build/
npm start        # serve build/ via the FEAR backend
```

## Editing content

Everything repeatable lives in **`src/spa/data/resume.js`**: profile, taglines, terminal lines, projects, services, method steps, testimonials, postmortems, counters and skill bars. Static prose (hero, about, contact copy) lives in `public/index.html`.

- Set `PROFILE.email` to show an email row in Contact (blank hides it).
- Counters and skill bars are jokes. Tune them to taste.

## Layout

```
public/index.html           page shell (sections s0..s8)
public/css/style.css        theme + additions at the bottom
src/spa/main.js             boots modules (content first)
src/spa/config.js           SECTIONS order, selectors, media helpers
src/spa/utils.js            esc / safeUrl / icon / canScrollInside
src/spa/data/resume.js      all site content
src/spa/modules/
  content.js     renders lists from resume.js
  nav.js         section transitions, wheel/touch/keys/hash, nested-scroll aware
  cursor.js      GSAP quickTo cursor (disabled on touch)
  clock.js       Killeen time, time wasted, availability mood
  intro.js       entrance timeline
  parallax.js    background blobs (disabled for reduced motion / touch)
  typewriter.js  rotating hero taglines
  terminal.js    About-page terminal
  stats.js       counters + skill bars, replay on every visit
  testimonials.js rotates only while visible; pause on hover
  contact.js     validation + POST to /fear/api/portfolio/contact
  easter.js      Konami code -> fake kernel panic
```

### jQuery integration

`src/gui/jquery.gui.js` imports jQuery and exposes `$` and `jQuery` on `globalThis` before the GUI framework initializes, so modules can use `$` directly. No separate jQuery script tag is needed in `public/index.html`.

### Notes

- Section order in `config.js` (`SECTIONS`) must match the `<section id="sN">` order and the side-nav `data-s` values.
- Fonts and Bootstrap Icons load from Google Fonts / jsDelivr. If your FEAR server sets a strict CSP, allow those hosts.
