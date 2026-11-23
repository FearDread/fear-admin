# FEAR Agent Console

Terminal, AI chat and overview dashboard on the FEAR GUI framework (`src/js/gui/jquery_gui.js`, unmodified).

    npm install
    npm run dev        # unbundled src/ + mock API + mock Ollama on :4000  (admin@fear.dev / admin)
    npm run build      # src/ -> build/ (bundled, content-hashed)
    npm run preview    # build, then serve build/ with the mock API
    npm start          # builds, then runs server.js (serves build/ through FEARServer)

`server.js` (yours) stays next to `build/`; it calls `initialize({ root, app: 'build', build: 'build' })`.
Assets are hashed because FEARServer serves .js/.css/.woff2 as immutable for a year.

## Layout
    src/index.html        dev import map (stripped from the build)
    src/js/main.js        registers and starts the modules
    src/js/modules/       settings, background, api, overview, nginx, terminal, chat, shell
    src/js/lib/           format.js (escaping, markdown), charts.js (canvas line chart + ring), icons.js (Lucide, ISC)
    src/css/app.css       theme tokens + components (imports fonts.css)
    scripts/build.mjs     esbuild bundle + hashing + index.html rewrite
    dev/mock-server.mjs   fake agent/auth API and fake Ollama

## Animated background
`background` module: canvas behind the UI. Modes `matrix` | `network` | `off` (Settings, or Ctrl+K → "Cycle background").
30 fps cap, pauses when the tab is hidden, still frame under prefers-reduced-motion.

## Nginx / DNS monitor (`#nginx`)
`nginx` module: tiles, animated response-time chart (hover tooltip), fleet-health ring, certificate bars, per-vhost cards
with sparklines, event feed. Polls every 10 s while open; Run check / Start-Stop monitor / `nginx -t` buttons.
Calls `{apiRoot}/nginx/*` through the api module: `GET /status`, `GET /trend?limit=60`, `POST /check-all`,
`POST /monitor/start|stop`, `POST /test`. Responses are `{ success, result, message }`; `dev/mock-server.mjs` fakes them.
