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
import { HERO_SLIDES, type HeroSlide } from './slides';
import styles from './HeroSlider.module.css';

const AUTO_MS = 6500;
const SWIPE_PX = 50;

interface HeroSliderProps {
  slides?: HeroSlide[];
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

/**
 * Full-viewport 3D ring slider.
 *
 * The "bagged and boarded" idea is the whole concept: each slide is a comic-
 * shaped panel with a cream backing board sitting 16px behind the cover and a
 * poly-bag gloss layer on top that follows the pointer. The ring itself is
 * pure CSS 3D; React only tracks one integer (`pos`) so wrap-around always
 * spins the short way.
 *
 * SEO notes:
 *  - Every slide's heading, copy, CTA link and image alt are in the server-
 *    rendered HTML (inactive slides are faded + `inert`, not unmounted).
 *  - One real <h1> (visually hidden) — slide titles are <h2>.
 *  - First image is `priority` so it is the LCP candidate and gets preloaded.
 */
export default function HeroSlider({ slides = HERO_SLIDES }: HeroSliderProps) {
  const n = slides.length;
  const [pos, setPos] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  const stageRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const dragged = useRef(false);

  const active = mod(pos, n);
  const step = 360 / n;

  /* ── Navigation ── */
  const next = useCallback(() => setPos((p) => p + 1), []);
  const prev = useCallback(() => setPos((p) => p - 1), []);
  const goTo = useCallback(
    (i: number) => {
      setPos((p) => {
        let d = mod(i - mod(p, n), n);
        if (d > n / 2) d -= n; // take the shorter way round
        return p + d;
      });
    },
    [n],
  );

  /* ── prefers-reduced-motion ── */
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  /* ── Autoplay (resets on any manual navigation because `pos` is a dep) ── */
  useEffect(() => {
    if (paused || reduced || n < 2) return;
    const id = setInterval(next, AUTO_MS);
    return () => clearInterval(id);
  }, [paused, reduced, n, next, pos]);

  /* ── Pointer: tilt + gloss follow, swipe to navigate ── */
  const setStageVars = (x: number, y: number) => {
    const el = stageRef.current;
    if (!el) return;
    el.style.setProperty('--px', x.toFixed(3));
    el.style.setProperty('--py', y.toFixed(3));
    el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    setStageVars((e.clientX - r.left) / r.width - 0.5, (e.clientY - r.top) / r.height - 0.5);
  };
  const onPointerLeave = () => setStageVars(0, -0.2);
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
    else if (e.key === 'Home') goTo(0);
    else if (e.key === 'End') goTo(n - 1);
  };

  const ringStyle = { '--pos': pos, '--step': `${step}deg`, '--n': n } as CSSProperties;

    return (
    <>
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
      <h1 className={styles.srOnly}>eFear: comics, e-books and collectibles</h1>

      {/* One accent wash per slide, cross-faded — custom properties can't be transitioned. */}
      {slides.map((s, i) => (
        <div
          key={s.id}
          aria-hidden="true"
          className={`${styles.wash}${i === active ? ` ${styles.washOn}` : ''}`}
          style={{ '--accent': s.accent } as CSSProperties}
        />
      ))}
      <div className={styles.dots} aria-hidden="true" />

      <div className={styles.inner}>
        {/* ── Copy ── */}
        <div className={styles.copyStack} aria-live={paused ? 'polite' : 'off'}>
          {slides.map((s, i) => {
            const on = i === active;
            return (
              <div
                key={s.id}
                className={`${styles.copy}${on ? ` ${styles.copyOn}` : ''}`}
                style={{ '--accent': s.accent } as CSSProperties}
                inert={!on}
              >
                <p className={styles.sub}>{s.sub}</p>
                <h2 className={styles.heading}>{s.heading}</h2>
                <p className={styles.body}>{s.body}</p>
                <div className={styles.cta}>
                  <Link href={s.ctaLink} className="btn-hero-primary">
                    {s.cta}
                  </Link>
                  <Link href="/shop" className="btn-hero-ghost">
                    View all
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── 3D stage ── */}
        <div
          ref={stageRef}
          className={styles.stage}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <div className={styles.floor} aria-hidden="true" />
          <div className={styles.tilt}>
            <div className={styles.ring} style={ringStyle}>
              {slides.map((s, i) => {
                const on = i === active;
                return (
                  <div
                    key={s.id}
                    className={`${styles.panel}${on ? ` ${styles.panelOn}` : ''}`}
                    style={{ '--i': i } as CSSProperties}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${n}`}
                  >
                    <Link
                      href={s.ctaLink}
                      className={styles.panelLink}
                      tabIndex={on ? 0 : -1}
                      draggable={false}
                      onClickCapture={(e) => {
                        // Swipes shouldn't navigate; side panels rotate into view instead of navigating.
                        if (dragged.current || !on) {
                          e.preventDefault();
                          if (!on && !dragged.current) goTo(i);
                        }
                      }}
                    >
                      <span className={styles.board} aria-hidden="true" />
                      <span className={styles.cover}>
                        <Image
                          src={s.image}
                          alt={s.alt}
                          fill
                          sizes="(max-width: 900px) 60vw, 340px"
                          className={styles.img}
                          priority={i === 0}
                          unoptimized={s.image.endsWith('.svg')}
                          draggable={false}
                        />
                        <span className={styles.shade} aria-hidden="true" />
                      </span>
                      <span className={styles.bag} aria-hidden="true" />
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
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
              style={{ '--accent': s.accent } as CSSProperties}
              onClick={() => goTo(i)}
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
            key={pos}
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
</>
  );
}
