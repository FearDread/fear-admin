// Generated placeholder cover art for project cards (used until a real `image` is set in resume.js).
// Six pattern families, alternating red/teal so neighbouring cards never match.
const RED = '#ff4560', TEAL = '#0af0c8';
const W = 400, H = 240;

const seeded = (seed) => { let s = (seed + 1) * 9301 + 49297; return () => (s = (s * 16807) % 2147483647) / 2147483647; };

const patterns = [
    // 0 · blueprint grid
    (i, a) => `<pattern id="gp${i}" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="${a}" stroke-opacity=".24"/></pattern><rect width="${W}" height="${H}" fill="url(#gp${i})"/>`,
    // 1 · dot matrix
    (i, a, b) => `<pattern id="dp${i}" width="18" height="18" patternUnits="userSpaceOnUse"><circle cx="9" cy="9" r="1.5" fill="${b}" fill-opacity=".45"/></pattern><rect width="${W}" height="${H}" fill="url(#dp${i})"/>`,
    // 2 · diagonal hazard stripes
    (i, a) => `<pattern id="sp${i}" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="2" height="16" fill="${a}" fill-opacity=".3"/></pattern><rect width="${W}" height="${H}" fill="url(#sp${i})"/>`,
    // 3 · radar rings
    (i, a) => [30, 60, 90, 120, 150, 180].map((r) => `<circle cx="290" cy="120" r="${r}" fill="none" stroke="${a}" stroke-opacity="${(0.42 - r / 520).toFixed(2)}"/>`).join('') + `<path d="M290 120 L${290 + 190} 20" stroke="${a}" stroke-opacity=".5"/>`,
    // 4 · signal waves
    (i, a) => [0, 1, 2, 3, 4, 5].map((k) => { const y = 50 + k * 30; return `<path d="M0 ${y} Q100 ${y - 34} 200 ${y} T400 ${y}" fill="none" stroke="${a}" stroke-opacity="${(0.15 + k * 0.07).toFixed(2)}"/>`; }).join(''),
    // 5 · network graph
    (i, a, b) => {
        const rnd = seeded(i), pts = Array.from({ length: 14 }, () => [20 + rnd() * 360, 20 + rnd() * 200]);
        let d = '';
        pts.forEach((p, m) => pts.forEach((q, n) => { if (n > m && Math.hypot(p[0] - q[0], p[1] - q[1]) < 115) d += `M${p[0].toFixed(0)} ${p[1].toFixed(0)}L${q[0].toFixed(0)} ${q[1].toFixed(0)}`; }));
        return `<path d="${d}" stroke="${a}" stroke-opacity=".38" fill="none"/>` + pts.map((p) => `<circle cx="${p[0].toFixed(0)}" cy="${p[1].toFixed(0)}" r="2.4" fill="${b}"/>`).join('');
    }
];

export function placeholderArt(i) {
    const a = i % 2 ? TEAL : RED, b = i % 2 ? RED : TEAL;
    return `<svg class="proj-art" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">` +
        `<defs><linearGradient id="pg${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}" stop-opacity=".32"/><stop offset="1" stop-color="${b}" stop-opacity=".07"/></linearGradient>` +
        `<radialGradient id="vg${i}" cx=".5" cy=".5" r=".75"><stop offset=".35" stop-color="#080b13" stop-opacity="0"/><stop offset="1" stop-color="#080b13" stop-opacity=".9"/></radialGradient></defs>` +
        `<rect width="${W}" height="${H}" fill="#080b13"/><rect width="${W}" height="${H}" fill="url(#pg${i})"/>` +
        patterns[i % patterns.length](i, a, b) +
        `<rect width="${W}" height="${H}" fill="url(#vg${i})"/></svg>`;
}

export const accent = (i) => (i % 2 ? TEAL : RED);
