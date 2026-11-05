import { gsap } from 'gsap';

export default function parallaxModule() {
    return {
    load() { $(document).on('mousemove.parallax', (e) => {
        const rx = e.clientX / window.innerWidth - 0.5, ry = e.clientY / window.innerHeight - 0.5;
        gsap.to('.mb1', { x: rx * 50, y: ry * 50, duration: 2.5, ease: 'power1.out' });
        gsap.to('.mb2', { x: rx * -35, y: ry * -35, duration: 2.5, ease: 'power1.out' });
        gsap.to('.mb3', { x: rx * 25, y: ry * 20, duration: 2.5, ease: 'power1.out' });
    }); }, unload() { $(document).off('.parallax'); }
}; }
