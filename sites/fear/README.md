# FEAR GUI SPA

## Install

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production build

```bash
npm run build
```

## Start

```bash
npm start
```

### jQuery integration

The SPA bundles jQuery through npm. `src/gui/jquery.gui.js` imports jQuery and exposes `$` and `jQuery` on `globalThis` before the GUI framework initializes, so GUI modules can safely use `$`. No separate jQuery script file is required in `public/index.html`.
