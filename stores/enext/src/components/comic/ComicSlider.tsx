'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HERO_SLIDES, type HeroSlide } from '../hero/slides';
import { COMIC_EXTRAS, FALLBACK_EXTRA } from './ComicExtras';
import styles from './ComicSlider.module.css';

const AUTO_MS = 7000;
const SWIPE_PX = 50;

/*
 * Panel outlines. These are the SAME polygons (in % of the stage) that the CSS
 * uses to clip each panel slot — keep them in sync with ComicPanelSlider.module.css.
 * The frames never move: only the art inside them wipes in and out.
 */
const FRAMES_DESKTOP = [
  '0,0 58,0 50,100 0,100',
  '60.2,0 100,0 100,45 56,53',
  '55.7,55.6 78.5,51.5 72.5,100 52.2,100',
  '80.9,51.1 100,47.6 100,100 74.9,100',
];
const FRAMES_MOBILE = ['0,0 100,0 100,42 0,47', '0,49.4 100,44.4 100,84 0,89', '0,91.4 100,86.4 100,100 0,100'];

/* Generated art: irregular explosion burst as SVG, no image file needed. */
const burstPoints = (spikes: number, outer: number, inner: number) => {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer - (i % 6 === 0 ? 7 : 0) : inner + (i % 4 === 1 ? 6 : 0);
    const a = (Math.PI * i) / spikes - Math.PI / 2;
    pts.push(`${(100 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`);
  }
  return pts.join(' ');
};
const BURST = burstPoints(13, 98, 70);

function Burst({ word, fill }: { word: string; fill: string }) {
  return (
    <svg viewBox="0 0 200 200" className={styles.burstSvg} aria-hidden="true" focusable="false">
      <polygon points={BURST} fill={fill} stroke="#111" strokeWidth="5" strokeLinejoin="round" />
      <text
        x="100"
        y="118"
        textAnchor="middle"
        className={styles.burstText}
        fontSize={word.length <= 4 ? 58 : 42}
        transform="rotate(-8 100 100)"
      >
        {word}
      </text>
    </svg>
  );
}

interface ComicPanelSliderProps {
  slides?: HeroSlide[];
  /** Render the page's single <h1>. Set false if another component already has one. */
  withH1?: boolean;
}

/**
 * Full-width comic page that "re-draws" itself for every slide.
 *
 * Four fixed panels (diagonal gutters, inked frames). Each slide supplies the
 * contents of all four panels — hero art + title, copy + CTA, a zoomed detail
 * crop with speed lines, and a sound-effect burst — and they wipe in from
 * different sides, staggered, then the title and burst slam into place.
 *
 * SEO: every slide's heading, copy, links and image alt are in the server-
 * rendered HTML. Inactive layers are clipped and `inert`, never unmounted.
 */
export default function ComicPanelSlider({ slides = HERO_SLIDES, withH1 = true }: ComicPanelSliderProps) {
  const n = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  const startX = useRef<number | null>(null);
  const dragged = useRef(false);

  const next = useCallback(() => setActive((a) => (a + 1) % n), [n]);
  const prev = useCallback(() => setActive((a) => (a - 1 + n) % n), [n]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // `active` is a dependency so any manual change restarts the timer.
  useEffect(() => {
    if (paused || reduced || n < 2) return;
    const id = setInterval(next, AUTO_MS);
    return () => clearInterval(id);
  }, [paused, reduced, n, next, active]);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    startX.current = e.clientX;
    dragged.current = false;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > SWIPE_PX) {
      dragged.current = true; // swallow the click that follows a swipe
      setTimeout(() => (dragged.current = false), 60);
      if (dx < 0) next();
      else prev();
    }
  };
  const onKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
    else if (e.key === 'Home') setActive(0);
    else if (e.key === 'End') setActive(n - 1);
  };

  const layer = (on: boolean) => `${styles.layer}${on ? ` ${styles.layerOn}` : ''}`;
  const accent = (s: HeroSlide) => ({ '--accent': s.accent }) as CSSProperties;

  return (
    <section
      className={styles.hero}
      aria-roledescription="carousel"
      aria-label="Featured collections"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {withH1 && <h1 className={styles.srOnly}>eFear: comics, e-books and collectibles</h1>}

      <div
        className={styles.stage}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onClickCapture={(e) => {
          if (dragged.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {/* ── Panel 1: hero art + title ── */}
        <div className={`${styles.slot} ${styles.p1}`}>
          {slides.map((s, i) => {
            const on = i === active;
            return (
              <div key={s.id} className={layer(on)} style={accent(s)} inert={!on}>
                <div className={styles.p1Art}>
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 900px) 100vw, 60vw"
                    className={styles.img}
                    priority={i === 0}
                    unoptimized={s.image.endsWith('.svg')}
                    draggable={false}
                  />
                  <span className={styles.halftone} aria-hidden="true" />
                  <span className={styles.scrim} aria-hidden="true" />
                </div>
                <h2 className={styles.heading}>{s.heading}</h2>
              </div>
            );
          })}
        </div>

        {/* ── Panel 2: copy + CTA ── */}
        <div className={`${styles.slot} ${styles.p2}`}>
          {slides.map((s, i) => {
            const on = i === active;
            const ex = COMIC_EXTRAS[s.id] ?? FALLBACK_EXTRA;
            return (
              <div key={s.id} className={layer(on)} style={accent(s)} inert={!on}>
                <div className={styles.copy}>
                  <p className={styles.caption}>
                    <span className={styles.captionTag}>{ex.indicia}</span>
                    {s.sub}
                  </p>
                  <p className={styles.bubble}>{s.body}</p>
                  <div className={styles.cta}>
                    <Link href={s.ctaLink} className={styles.btnMain}>
                      {s.cta}
                    </Link>
                    <Link href="/shop" className={styles.btnGhost}>
                      View all
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Panel 3: zoomed detail crop + speed lines (decorative) ── */}
        <div className={`${styles.slot} ${styles.p3}`} aria-hidden="true">
          {slides.map((s, i) => {
            const on = i === active;
            return (
              <div key={s.id} className={layer(on)} style={accent(s)} inert>
                <div className={styles.p3Art}>
                  <div className={styles.zoom}>
                    <Image
                      src={s.image}
                      alt=""
                      fill
                      sizes="30vw"
                      className={styles.img}
                      unoptimized={s.image.endsWith('.svg')}
                      draggable={false}
                    />
                  </div>
                  <span className={styles.halftone} />
                  <span className={styles.speed} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Panel 4: sound effect ── */}
        <div className={`${styles.slot} ${styles.p4}`} aria-hidden="true">
          {slides.map((s, i) => {
            const on = i === active;
            const ex = COMIC_EXTRAS[s.id] ?? FALLBACK_EXTRA;
            return (
              <div key={s.id} className={layer(on)} style={accent(s)} inert>
                <div className={styles.burstPos}>
                  <Burst word={ex.sfx} fill={s.accent} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Inked frames (static) ── */}
        <svg className={styles.frames} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <g className={styles.framesDesktop}>
            {FRAMES_DESKTOP.map((p) => (
              <polygon key={p} points={p} />
            ))}
          </g>
          <g className={styles.framesMobile}>
            {FRAMES_MOBILE.map((p) => (
              <polygon key={p} points={p} />
            ))}
          </g>
        </svg>
      </div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        <div className={styles.tabs} role="tablist" aria-label="Choose a collection">
          {slides.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              className={`${styles.tab}${i === active ? ` ${styles.tabOn}` : ''}`}
              style={accent(s)}
              onClick={() => setActive(i)}
            >
              {s.label}
            </button>
          ))}
        </div>
        <div className={styles.arrows}>
          <span className={styles.count} aria-hidden="true">
            {active + 1} / {n}
          </span>
          <button type="button" className={styles.arrow} onClick={prev} aria-label="Previous slide">
            &#8592;
          </button>
          <button type="button" className={styles.arrow} onClick={next} aria-label="Next slide">
            &#8594;
          </button>
        </div>
      </div>

      {!reduced && n > 1 && (
        <span className={styles.progress} aria-hidden="true">
          <span
            key={active}
            className={styles.progressBar}
            style={
              {
                animationDuration: `${AUTO_MS}ms`,
                animationPlayState: paused ? 'paused' : 'running',
                background: slides[active].accent,
              } as CSSProperties
            }
          />
        </span>
      )}
    </section>
  );
}