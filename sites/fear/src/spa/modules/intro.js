
import { gsap } from 'gsap';

export default function introModule() {
    return {
        load() {
    gsap.from('.section.active .sec-inner', { y: 60, opacity: 0, duration: 1.3, ease: 'power3.out', delay: 0.2 });
    gsap.from('#topbar', { y: -40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.5 });
    gsap.from('#side-nav', { x: -40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.7 });
    gsap.from('#bottombar', { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', delay: 0.6 });
} }; }
