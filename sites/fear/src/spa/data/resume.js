// ─────────────────────────────────────────────────────────────────────────────
// Single source of truth for everything repeatable on the site.
// Edit here, run `npm run build`, and the lies update everywhere.
// ─────────────────────────────────────────────────────────────────────────────

export const PROFILE = {
    name: 'Garrett Haptonstall',
    handle: 'FearDread',
    location: 'Killeen, TX',
    email: 'ghaptonstall@gmail.com', // TODO: add a public email to show it in Contact (blank = row hidden)
    github: 'https://github.com/FearDread',
    site: 'https://efear.shop',
    taglines: [
        'I keep servers alive. People are a harder problem.',
        'Uptime is a bedtime story we tell ourselves.',
        'Fluent in bash, nginx, and passive-aggressive comments.',
        'Everything fails eventually. I schedule it for business hours.',
        'Your outage is just entropy with a ticket number.',
        'Linux, networking, and the quiet acceptance of the void.'
    ]
};

export const EXP = [
    { num: 'Linux', lbl: 'Native tongue' },
    { num: 'AWS', lbl: 'Reluctantly fluent' },
    { num: 'DFW', lbl: 'Origin story' }
];

export const TECH = ['Linux', 'Ubuntu', 'Bash', 'nginx', 'AWS', 'Networking', 'DevOps', 'Node.js', 'Express', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'WebRTC'];

export const TERMINAL = [
    { cmd: true, s: 'whoami' },
    { s: 'garrett' },
    { cmd: true, s: 'uptime' },
    { s: 'up since birth, load: concerning' },
    { cmd: true, s: 'ls ~/hobbies' },
    { s: 'gaming/ camping/ hiking/' },
    { s: 'climbing/ tinkering/' },
    { cmd: true, s: 'echo $HOME' },
    { s: 'Killeen, TX (DFW at heart)' },
    { cmd: true, s: 'sudo fix-everything' },
    { s: 'garrett is not in the sudoers file.' },
    { s: 'This incident will be reported.' }
];

export const PROJECTS = [
    { title: 'FEAR Platform', category: 'Self-hosted', tags: ['Node', 'Express', 'nginx'], year: 'Ongoing', icon: 'bi-hdd-network', link: 'https://efear.shop' },
    { title: 'The Reverse Proxy Rodeo', category: 'Infrastructure', tags: ['nginx', 'TLS', 'DNS'], year: 'Resolved', icon: 'bi-shield-lock' },
    { title: 'vchat: WebRTC Signaling', category: 'Real-time', tags: ['WebRTC', 'Node'], year: 'Beta-ish', icon: 'bi-camera-video' },
    { title: 'HipComic Importer', category: 'Data Liberation', tags: ['Scraping', 'eFear Comics'], year: 'In progress', icon: 'bi-box-arrow-in-down' },
    { title: 'CRA → Next.js Exodus', category: 'Migration', tags: ['React', 'Next.js', 'Redux/Zustand'], year: 'Survived', icon: 'bi-arrow-left-right' },
    { title: 'SEOToolkit & SEOManager', category: 'Front-end', tags: ['React', 'SERP/OG previews'], year: 'Shipped', icon: 'bi-search' }
];

export const SERVICES = [
    { icon: 'bi-terminal', name: 'Linux Administration', desc: 'Keeping boxes patched, secured, and mildly resentful. Users, services, cron, and the occasional séance for dead processes.' },
    { icon: 'bi-diagram-3', name: 'Infrastructure & Networking', desc: 'AWS, nginx, DNS, TLS. If packets go missing, I find them. If they left on purpose, I respect that.' },
    { icon: 'bi-code-slash', name: 'Full-Stack Development', desc: 'Node, Express, React, Next.js. A front end that smiles and a back end that tells the truth.' },
    { icon: 'bi-gear-wide-connected', name: 'DevOps & Automation', desc: 'Do it twice, script it. Do it three times, script it and leave a deeply honest comment.' }
];

export const PROCESS = [
    { title: 'Acknowledge the fire', desc: 'Read the logs before the chat messages. Logs lie less, and they never say "quick question."', tag: 'journalctl -xe' },
    { title: 'Find the actual cause', desc: 'It\u2019s DNS. It\u2019s not DNS. It\u2019s a certificate. It was DNS the whole time.', tag: 'dig +trace' },
    { title: 'Fix it without making it worse', desc: 'Small change, one variable, a rollback plan, and the humility of someone who has made it worse before.', tag: 'git revert' },
    { title: 'Automate it so it never hurts again', desc: 'It will hurt again. But now a script feels the pain first.', tag: 'cron' },
    { title: 'Write the postmortem', desc: 'Blameless, thorough, and only slightly haunted. Mostly it was me. Occasionally it was a missing semicolon.', tag: 'docs/' }
];

export const TESTIMONIALS = [
    { quote: 'I was perfectly healthy until the 3 AM deploy. Now I\u2019m a cautionary tale.', author: 'A Production Database', role: 'Formerly Healthy' },
    { quote: 'One missing server_name directive and I questioned my entire existence. Garrett found it. I have never felt so seen.', author: 'nginx', role: 'Reverse Proxy, Reformed' },
    { quote: 'He automated me. I wasn\u2019t even mad. I was relieved.', author: 'A Cron Job', role: 'Runs at 3:00 AM, Resents It' },
    { quote: 'Fourteen hundred dependencies. Zero trust. Exactly how it should be.', author: 'node_modules', role: 'Heavier Than the Sun' },
    { quote: 'Your backup strategy is a hope with a schedule. He\u2019ll gently make it a plan.', author: 'The Void', role: 'Patient. Always Patient.' }
];

export const POSTS = [
    { title: 'Postmortem: The Missing server_name Directive', section: 'Postmortem', meta: 'SEV-2 · Resolved · Blame: me', icon: 'bi-bug' },
    { title: 'I Wrote a Book So Nurses Could Automate the Charting', section: 'Field Notes', meta: 'F.E.A.R. Framework · Shipped', icon: 'bi-journal-text' },
    { title: 'Bash Scripts for Minecraft: A Sysadmin\u2019s Side Quest', section: 'Side Quest', meta: 'Java + Bedrock · Ubuntu', icon: 'bi-controller' }
];

// Counters: t = target, d = decimals, prefix/suffix wrap the number.
export const STATS = [
    { t: 99.9, d: 1, suffix: '%', label: 'Uptime (self-reported)' },
    { t: 3, suffix: ' AM', label: 'Preferred time for things to break' },
    { t: 404, label: 'Social plans: not found' },
    { t: 0, label: 'Backups I trust blindly' }
];

// Self-assessed. Mostly. The last one is accurate.
export const SKILLS = [
    { name: 'Linux Administration', w: 92 },
    { name: 'Networking & nginx', w: 85 },
    { name: 'Node / Express', w: 88 },
    { name: 'AWS & DevOps', w: 82 },
    { name: 'React / Next.js', w: 80 },
    { name: 'Sleep Schedule', w: 12 }
];
