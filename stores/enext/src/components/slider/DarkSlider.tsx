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
import styles from './DarkSlider.module.css';

const AUTO_MS = 7000;
const SWIPE_PX = 50;
const PARTICLES = 70;

const hexToRgb = (hex: string): [number, number, number] => {
    const h = hex.replace('#', '');
    const v = parseInt(h.length === 3 ? h.replace(/./g, '$&$&') : h, 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
};

interface DarkSliderProps {
    slides?: HeroSlide[];
    /** Render the page's single <h1>. Set false if another component already has one. */
    withH1?: boolean;
}

/**
 * Full-width dark hero. The background is generated, not an image file:
 *   1. slow-drifting blurred "aurora" blobs tinted by the active slide's accent
 *   2. a perspective grid floor that scrolls toward the viewer
 *   3. a <canvas> of rising ember particles (pauses off-screen / reduced motion)
 * Slides cross-fade; the art floats and follows the pointer, text reveals in stages.
 *
 * SEO: every slide's heading, copy, link and image alt is in the server HTML;
 * inactive slides are faded and `inert`, never unmounted.
 */
export default function DarkSlider({ slides = HERO_SLIDES, withH1 = true }: DarkSliderProps) {
    const n = slides.length;
    const [active, setActive] = useState(0);
    const [paused, setPaused] = useState(false);
    const [reduced, setReduced] = useState(false);

    const rootRef = useRef < HTMLElement > (null);
    const canvasRef = useRef < HTMLCanvasElement > (null);
    const accentRef = useRef < [number, number, number] > (hexToRgb(slides[0].accent));
    const startX = useRef < number | null > (null);
    const dragged = useRef(false);

    const next = useCallback(() => setActive((a) => (a + 1) % n), [n]);
    const prev = useCallback(() => setActive((a) => (a - 1 + n) % n), [n]);

    useEffect(() => {
        accentRef.current = hexToRgb(slides[active].accent);
    }, [active, slides]);

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

    /* ── Ember particles ── */
    useEffect(() => {
        const canvas = canvasRef.current;
        const root = rootRef.current;
        if (!canvas || !root || reduced) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let w = 0;
        let h = 0;
        let raf = 0;
        let visible = true;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const make = (initial: boolean) => ({
            x: Math.random() * w,
            y: initial ? Math.random() * h : h + 10,
            r: 0.6 + Math.random() * 2.2,
            vy: 0.15 + Math.random() * 0.6,
            sway: Math.random() * Math.PI * 2,
            a: 0.25 + Math.random() * 0.6,
        });
        let ps: ReturnType<typeof make>[] = [];

        const resize = () => {
            w = root.clientWidth;
            h = root.clientHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ps = Array.from({ length: PARTICLES }, () => make(true));
        };
        resize();

        const tick = () => {
            raf = requestAnimationFrame(tick);
            if (!visible) return;
            ctx.clearRect(0, 0, w, h);
            ctx.globalCompositeOperation = 'lighter';
            const [r, g, b] = accentRef.current;
            for (let i = 0; i < ps.length; i++) {
                const p = ps[i];
                p.y -= p.vy;
                p.sway += 0.01;
                p.x += Math.sin(p.sway) * 0.35;
                if (p.y < -10) ps[i] = make(false);
                const fade = Math.min(1, p.y / (h * 0.5)); // fade out toward the top
                ctx.beginPath();
                ctx.fillStyle = `rgba(${r},${g},${b},${(p.a * fade).toFixed(3)})`;
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            }
        };
        raf = requestAnimationFrame(tick);

        const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
        io.observe(root);
        const ro = new ResizeObserver(resize);
        ro.observe(root);

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            ro.disconnect();
        };
    }, [reduced]);

    /* ── Pointer: parallax (CSS vars, no re-render) + swipe ── */
    const onPointerMove = (e: PointerEvent<HTMLElement>) => {
        if (reduced || !rootRef.current) return;
        const r = rootRef.current.getBoundingClientRect();
        rootRef.current.style.setProperty('--mx', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
        rootRef.current.style.setProperty('--my', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    };
    const onPointerDown = (e: PointerEvent<HTMLElement>) => {
        startX.current = e.clientX;
        dragged.current = false;
    };
    const onPointerUp = (e: PointerEvent<HTMLElement>) => {
        if (startX.current === null) return;
        const dx = e.clientX - startX.current;
        startX.current = null;
        if (Math.abs(dx) > SWIPE_PX) {
            dragged.current = true;
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

    const accent = (s: HeroSlide) => ({ '--accent': s.accent }) as CSSProperties;

    return (
        <section
            ref={rootRef}
            className={styles.hero}
            style={accent(slides[active])}
            aria-roledescription="carousel"
            aria-label="Featured collections"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onPointerMove={onPointerMove}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
            onClickCapture={(e) => {
                if (dragged.current) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }}
        >
            {withH1 && <h1 className={styles.srOnly}>eFear: comics, e-books and collectibles</h1>}

            {/* ── Generated animated background ── */}
            <div className={styles.bg} aria-hidden="true">
                <span className={`${styles.blob} ${styles.blobA}`} />
                <span className={`${styles.blob} ${styles.blobB}`} />
                <span className={`${styles.blob} ${styles.blobC}`} />
                <div className={styles.gridWrap}>
                    <div className={styles.grid} />
                </div>
                <canvas ref={canvasRef} className={styles.canvas} />
                <span className={styles.vignette} />
            </div>

            {/* ── Slides ── */}
            <div className={styles.slides} aria-live={paused ? 'polite' : 'off'}>
                {slides.map((s, i) => {
                    const on = i === active;
                    return (
                        <article
                            key={s.id}
                            className={`${styles.slide}${on ? ` ${styles.on}` : ''}`}
                            style={accent(s)}
                            inert={!on}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={`${i + 1} of ${n}`}
                        >
                            <span className={styles.ghost} aria-hidden="true">
                                {s.heading}
                            </span>

                            <div className={styles.copy}>
                                <p className={`${styles.sub} ${styles.r1}`}>{s.sub}</p>
                                <h2 className={`${styles.heading} ${styles.r2}`}>{s.heading}</h2>
                                <p className={`${styles.body} ${styles.r3}`}>{s.body}</p>
                                <div className={`${styles.cta} ${styles.r4}`}>
                                    <Link href={s.ctaLink} className={styles.btnMain}>
                                        {s.cta}
                                    </Link>
                                    <Link href="/shop" className={styles.btnGhost}>
                                        View all
                                    </Link>
                                </div>
                            </div>

                            <div className={styles.art}>
                                <div className={styles.float}>
                                    <div className={styles.frame}>
                                        <Image
                                            src={s.image}
                                            alt={s.alt}
                                            fill
                                            sizes="(max-width: 900px) 70vw, 36vw"
                                            className={styles.img}
                                            priority={i === 0}
                                            unoptimized={s.image.endsWith('.svg')}
                                            draggable={false}
                                        />
                                        <span className={styles.sheen} aria-hidden="true" />
                                    </div>
                                    <span className={styles.shadow} aria-hidden="true" />
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            {/* ── Controls: each tab fills as the autoplay timer runs ── */}
            <div className={styles.controls}>
                <div className={styles.tabs} role="tablist" aria-label="Choose a collection">
                    {slides.map((s, i) => {
                        const on = i === active;
                        return (
                            <button
                                key={s.id}
                                type="button"
                                role="tab"
                                aria-selected={on}
                                className={`${styles.tab}${on ? ` ${styles.tabOn}` : ''}`}
                                style={accent(s)}
                                onClick={() => setActive(i)}
                            >
                                <span className={styles.tabNum}>{String(i + 1).padStart(2, '0')}</span>
                                <span className={styles.tabLabel}>{s.label}</span>
                                <span className={styles.track} aria-hidden="true">
                                    {on && !reduced && (
                                        <span
                                            key={active}
                                            className={styles.fill}
                                            style={{
                                                animationDuration: `${AUTO_MS}ms`,
                                                animationPlayState: paused ? 'paused' : 'running',
                                            }}
                                        />
                                    )}
                                    {on && reduced && <span className={`${styles.fill} ${styles.fillStatic}`} />}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <div className={styles.arrows}>
                    <button type="button" className={styles.arrow} onClick={prev} aria-label="Previous slide">
                        &#8592;
                    </button>
                    <button type="button" className={styles.arrow} onClick={next} aria-label="Next slide">
                        &#8594;
                    </button>
                </div>
            </div>
        </section>
    );
}