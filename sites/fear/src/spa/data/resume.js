import { PUBLICATIONS } from './publications.js';

// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for everything repeatable on the site.
// Edit here, run `npm run build`, and the site updates everywhere.
// Tone: professional, restrained, a little dark.
// ─────────────────────────────────────────────────────────────────────────────

export const PROFILE = {
    name: 'Garrett Haptonstall',
    handle: 'FearDread',
    location: 'Killeen, TX',
    email: 'ghaptonstall@gmail.com',
    github: 'https://github.com/FearDread',
    site: 'https://efear.shop',
    taglines: [
        'I build systems that keep running after everyone has gone home.',
        'Reliability is a discipline, not a feature.',
        'Linux. Networking. Automation. Quiet nights on call.',
        'Everything fails eventually. The work is deciding how.',
        'Infrastructure you stop thinking about.'
    ]
};

export const EXP = [
    { num: 'Linux', lbl: 'Systems administration' },
    { num: 'AWS', lbl: 'Cloud & networking' },
    { num: 'Node', lbl: 'Full-stack development' }
];

export const TECH = ['Linux', 'Ubuntu', 'Bash', 'nginx', 'AWS', 'Networking', 'DevOps', 'Node.js', 'Express', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'WebRTC'];

export const TERMINAL = [
    { cmd: true, s: 'whoami' },
    { s: 'garrett' },
    { cmd: true, s: 'uname -a' },
    { s: 'Linux, full-stack, infrastructure' },
    { cmd: true, s: 'ls ~/interests' },
    { s: 'gaming/ camping/ hiking/' },
    { s: 'climbing/ computers/' },
    { cmd: true, s: 'echo $HOME' },
    { s: 'Killeen, TX (DFW roots)' },
    { cmd: true, s: 'systemctl status garrett' },
    { s: 'active (running)' },
    { cmd: true, s: 'cat /etc/motto' },
    { s: 'Measure twice. Deploy once.' }
];

// Each project powers a row in the Work list and the detail modal.
//   summary / role / highlights → modal. icon is a Bootstrap Icons class.
export const PROJECTS = [
    {
        title: 'FEAR Platform',
        category: 'Self-hosted platform',
        status: 'Ongoing',
        icon: 'bi-hdd-network',
        link: 'https://fear.dedyn.io',
        image: '/img/projects/fear-admin-1.png',
        role: 'Design, development, operations',
        tags: ['Node.js', 'Express', 'nginx', 'Linux'],
        summary: 'A self-hosted Node/Express platform that I build and run across my own domains, including efear.shop. One backend serves the front-end bundle and the API routes behind an nginx reverse proxy.',
        highlights: [
            'Single Node/Express backend (FEAR.js and FEARServer.js) serving the SPA and its APIs.',
            'Fronted by an nginx reverse proxy for multiple domains.',
            'Self-hosted end to end: application, proxy and certificates all under my control.',
            'Extended over time with new services, such as the vchat signaling app.'
        ]
    },
    {
        title: 'E-FEAR E-Commerce Store',
        category: 'Front-end ecommerce',
        status: 'Completed',
        icon: 'bi-arrow-left-right',
        image: '/img/projects/efear-shop-1.png',
        link: 'https://efear.shop',
        role: 'Developer',
        tags: ['React', 'Next.js', 'Node.js'],
        summary: 'Contains React modules for search optimization work: an on-page analyzer and a meta tag manager with live previews.',
        highlights: [
            'Fully functional custom built e-commerece store built with NextJS using the FEAR-Admin API',
            'Restructured the application around App Router conventions.',
            'Carried Redux and Zustand state management into the new architecture.',
            'Converted client-side data fetching to async Server Components.',
            'SEO JSON-Doc modules and meta information for indexable content and markup for every product page.'
        ]
    },
    {
        title: 'V-Chat: WebRTC Signaling',
        category: 'Real-time E2EE communications',
        status: 'In development',
        icon: 'bi-camera-video',
        link: 'https://vchat.efear.shop',
        role: 'Design and implementation',
        tags: ['WebRTC', 'Node.js', 'Express'],
        summary: 'A WebRTC video chat application. Its signaling service lives inside the FEAR Node/Express backend rather than running as a separate system.',
        highlights: [
            'Signaling layer coordinates session setup between peers.',
            'Media flows peer to peer; the server only brokers the connection.',
            'Integrated into the existing FEAR backend to keep operations simple.'
        ]
    },
    {
        title: 'Multi-Domain nginx Reverse Proxy',
        category: 'Infrastructure',
        status: 'Resolved',
        icon: 'bi-shield-lock',
        role: 'Configuration and troubleshooting',
        tags: ['nginx', 'TLS', 'DNS', 'Linux', 'Cloudflare'],
        summary: 'Configuration and troubleshooting of an nginx reverse proxy serving two self-hosted domains, efear.shop and fear.dedyn.io.',
        highlights: [
            'Traced a TLS certificate mismatch to a missing server_name directive on one of the server blocks.',
            'Established explicit server blocks per domain so each name resolves to the right certificate and upstream.',
            'Worked the problem layer by layer: DNS, then TLS, then proxy configuration.'
        ]
    },
    {
        title: 'HipComic Collection Importer',
        category: 'Data import',
        status: 'In progress',
        icon: 'bi-box-arrow-in-down',
        role: 'Design and implementation',
        tags: ['Node.js', 'Scraping', 'Database'],
        summary: 'A tool that imports my personal HipComic collection into a database I own. With no app or API access available, it works by scraping the public collection page.',
        highlights: [
            'Moves collection data out of a third-party app and into my own database.',
            'Built as a scraper because no official access was available.',
            'Supports the eFear comics storefront with inventory data.'
        ]
    }
];

export const SERVICES = [
    { icon: 'bi-terminal', name: 'Linux Administration', desc: 'Provisioning, hardening, patching and monitoring of Linux servers. Systems stay quiet because they are maintained.' },
    { icon: 'bi-diagram-3', name: 'Infrastructure & Networking', desc: 'AWS, nginx, DNS and TLS. Proxies, routing and certificates configured so failures are rare and easy to diagnose.' },
    { icon: 'bi-code-slash', name: 'Full-Stack Development', desc: 'Node.js, Express, React and Next.js. Clean interfaces on top of dependable back ends.' },
    { icon: 'bi-gear-wide-connected', name: 'DevOps & Automation', desc: 'Scripts, build pipelines and repeatable deployments. If a task happens twice, it gets automated.' }
];

export const PROCESS = [
    { title: 'Observe', desc: 'Start with logs and metrics. Establish what is actually happening before deciding what is wrong.', tag: 'journalctl -xe' },
    { title: 'Isolate', desc: 'Narrow the cause one layer at a time: network, DNS, certificates, application.', tag: 'dig +trace' },
    { title: 'Change one thing', desc: 'Make a single, reversible change with a rollback ready.', tag: 'git revert' },
    { title: 'Automate', desc: 'Turn the fix into a script or a check so the problem is caught earlier next time.', tag: 'cron' },
    { title: 'Document', desc: 'Record what happened, why, and what changed. Whoever inherits the system will need it.', tag: 'docs/' }
];

// Working principles. Swap in real client testimonials here when you have them.
export const TESTIMONIALS = [
    { quote: 'A system you cannot explain is a system you cannot trust.', author: 'Operating principle', role: '01 \u00b7 Clarity' },
    { quote: 'Every failure mode you plan for is one you will sleep through.', author: 'Operating principle', role: '02 \u00b7 Preparation' },
    { quote: 'Automate the repeatable. Reserve attention for the unexpected.', author: 'Operating principle', role: '03 \u00b7 Automation' },
    { quote: 'Simple systems fail in ways you can understand.', author: 'Operating principle', role: '04 \u00b7 Simplicity' },
    { quote: 'A backup is real only after it has been restored.', author: 'Operating principle', role: '05 \u00b7 Verification' }
];

// Counters are derived from the data above so they never drift. Add `d` for decimals, `prefix`/`suffix` to wrap.
export const STATS = [
    { t: PROJECTS.length, label: 'Featured projects' },
    { t: 2, label: 'Domains self-hosted' },
    { t: SERVICES.length, label: 'Core disciplines' },
    { t: PUBLICATIONS.length, label: 'Published eBooks' }
];

// Self-assessed proficiency (0-100).
export const SKILLS = [
    { name: 'Linux Administration', w: 92 },
    { name: 'Bash & Automation', w: 90 },
    { name: 'Node.js / Express', w: 88 },
    { name: 'Networking & nginx', w: 85 },
    { name: 'AWS & DevOps', w: 82 },
    { name: 'React / Next.js', w: 80 }
];
];