// ---------------------------------------------------------------------------
// V-CHAT email shared pieces. Palette and type come from vchat.css (the cyan-ring
// theme): black void, blue/violet chrome, cyan for "live / secure", magenta-red
// as the beam accent. Email clients ignore gradients and web fonts inconsistently,
// so every gradient has a solid fallback and the font stack is system fonts.
// ---------------------------------------------------------------------------
const VCHAT = {
    void: '#03050a',
    ink: '#070b14',
    card: '#0a0f1b',
    line: '#16304a',
    lineHi: '#1f5f86',
    text: '#e3f1ff',
    muted: '#8fa5bd',
    violet: '#7b4dff',
    violetSoft: '#a9bcff',
    violetDeep: '#5b34e0',
    blueDeep: '#2f55e6',
    sky: '#19c8ff',
    skySoft: '#7fe0ff',
    pink: '#ff4d8d',
    red: '#ff3b4a',
};

const VC_FONT = "'Avenir Next','Segoe UI',Helvetica,Arial,sans-serif";
const VC_MONO = "ui-monospace,'SF Mono',Menlo,Consolas,monospace";

const VCHAT_HEAD = `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">`;

const vcEsc = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const vcUrl = (u) => (/^https?:\/\//i.test(u || '') ? vcEsc(u) : '#');
const vcBeam = (height) => `background:${VCHAT.violet};background-image:linear-gradient(90deg,${VCHAT.blueDeep},${VCHAT.violet} 50%,${VCHAT.pink});height:${height}px;line-height:${height}px;font-size:0;`;
const vcLogo = (size, color = VCHAT.skySoft) => `<span style="font-family:${VC_FONT};font-size:${size}px;font-weight:800;letter-spacing:-0.02em;color:${color};">vchat</span>`;
const vcEyebrow = (text) => `<div style="font-family:${VC_FONT};font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:${VCHAT.sky};margin-bottom:10px;">${text}</div>`;
const vcButton = (href, label, primary = true) => primary
    ? `<a href="${vcUrl(href)}" style="display:inline-block;padding:13px 28px;background:${VCHAT.blueDeep};background-image:linear-gradient(135deg,${VCHAT.sky},${VCHAT.blueDeep} 55%,${VCHAT.violetDeep});border-radius:10px;color:#ffffff;font-family:${VC_FONT};font-size:15px;font-weight:700;text-decoration:none;">${label}</a>`
    : `<a href="${vcUrl(href)}" style="display:inline-block;padding:12px 28px;border:1px solid ${VCHAT.lineHi};border-radius:10px;color:${VCHAT.text};font-family:${VC_FONT};font-size:15px;text-decoration:none;">${label}</a>`;

// Pill like .badge.on in the app.
const vcBadge = (text) => `<span style="display:inline-block;padding:4px 12px;border:1px solid ${VCHAT.sky};border-radius:999px;background:#0a1a26;color:${VCHAT.sky};font-family:${VC_FONT};font-size:12px;">● ${text}</span>`;
const vcShell = (tag, rows) => `${VCHAT_HEAD}
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${VCHAT.void};">
  <tbody><tr><td align="center" style="padding:28px 16px;background:${VCHAT.void};">
    <table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:${VCHAT.card};border:1px solid ${VCHAT.line};border-radius:18px;overflow:hidden;">
      <tbody>
      <tr><td style="${vcBeam(3)}">&nbsp;</td></tr>
      <tr>
        <td style="background:${VCHAT.ink};border-bottom:1px solid ${VCHAT.line};padding:20px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr>
            <td>${vcLogo(24)}</td>
            <td align="right" style="font-family:${VC_FONT};font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:${VCHAT.muted};">${tag}</td>
          </tr></tbody></table>
        </td>
      </tr>
${rows}
      <tr>
        <td style="background:${VCHAT.ink};border-top:1px solid ${VCHAT.line};padding:24px 32px;" align="center">
          <div style="margin-bottom:8px;">${vcLogo(18, VCHAT.muted)}</div>
          <div style="font-family:${VC_FONT};font-size:12px;color:${VCHAT.muted};line-height:1.7;">
            Video rooms where only the people in the call can see the call.<br>
            © 2026 V-CHAT · Powered by FEAR
          </div>
        </td>
      </tr>
      <tr><td style="${vcBeam(2)}">&nbsp;</td></tr>
      </tbody>
    </table>
  </td></tr>
</tbody></table>`;

const EFEAR = {
    void: '#080808',
    card: '#0e0e0e',
    ink: '#131313',
    line: '#242424',
    red: '#c41a1a',
    text: '#f0f0f0',
    body: '#b0b0b0',
    muted: '#8a8a8a', // was #5a5a5a, which failed contrast on the dark card
    green: '#2a9d8f',
};

const EF_DISPLAY = "'Anton',Impact,'Arial Narrow',sans-serif";
const EF_MONO = "'Space Mono','Courier New',monospace";
const EF_CLIP = 'clip-path:polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px));';

const EF_BUSINESS = {
    legal: 'FEAR Inc.',
    address: '2003 E. Veterans Memorial Blvd, Killeen TX 76541',
    email: 'fear.dread@underworld.dog',
};

const EF_HEAD = `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<link href="https://fonts.googleapis.com/css2?family=Anton&amp;family=Space+Mono:ital@0;1&amp;display=swap" rel="stylesheet">
<!--[if mso]><style>td,p,a{font-family:Arial,sans-serif!important;}</style><![endif]-->`;

// Read at call time (not module load) so dotenv has already run.
const efSite = () => (process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://efear.shop').replace(/\/+$/, '');
const efHost = () => efSite().replace(/^https?:\/\//i, '');

const efEsc = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Absolute http(s) URLs pass through (escaped); anything else falls back to a site path.
const efUrl = (u, fallbackPath = '/') => (/^https?:\/\//i.test(u || '') ? efEsc(u) : efEsc(`${efSite()}${fallbackPath}`));
const efVal = (v, fallback = '—') => (v == null || v === '' ? fallback : efEsc(v));
const efText = (v) => efEsc(v).replace(/\r?\n/g, '<br>');
const efMoney = (v) => {
    const n = Number(v);
    return v == null || v === '' || Number.isNaN(n) ? '—' : '$' + n.toFixed(2);
};
const efNow = () => new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Chicago' }) + ' CT';

const efAddress = (d = {}) => {
    const cityLine = [d.city, [d.state, d.zip].filter(Boolean).join(' ')].filter(Boolean).join(', ');
    const lines = [d.fullName, d.addressLine1, d.addressLine2, cityLine].filter(Boolean).map(efEsc);
    return lines.length ? lines.join('<br>') : '—';
};

const efLogo = (size = 28, color = EFEAR.text) =>
    `<span style="font-family:${EF_DISPLAY};font-size:${size}px;color:${color};letter-spacing:.05em;">e<span style="color:${EFEAR.red};">Fear</span></span>`;

const efEyebrow = (text) =>
    `<div style="font-family:${EF_MONO};font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:${EFEAR.red};margin-bottom:8px;">// ${efEsc(text)}</div>`;

const efRow = (html, pad = '0 32px 28px') => `<tr><td style="padding:${pad};">${html}</td></tr>`;

const efHero = (eyebrow, lines) => efRow(
    `${efEyebrow(eyebrow)}<div style="font-family:${EF_DISPLAY};font-size:30px;color:${EFEAR.text};letter-spacing:.03em;line-height:1.1;">${lines.map(efEsc).join('<br>')}</div>`,
    '36px 32px 20px',
);

// `html` must already be safe (use efEsc / efVal for any data).
const efParagraph = (html) =>
    `<p style="font-family:${EF_MONO};font-size:12px;color:${EFEAR.body};line-height:1.9;margin:0 0 20px;">${html}</p>`;

const efStrong = (v) => `<strong style="color:${EFEAR.text};">${efEsc(v)}</strong>`;

const efButton = (href, label, variant = 'primary') => {
    const base = `display:inline-block;font-family:${EF_MONO};font-size:11px;letter-spacing:.12em;text-transform:uppercase;text-decoration:none;`;
    const look = variant === 'primary'
        ? `padding:13px 28px;background:${EFEAR.red};color:#ffffff;${EF_CLIP}`
        : `padding:12px 28px;border:1px solid ${EFEAR.line};color:${EFEAR.body};`;
    return `<a href="${href}" style="${base}${look}">${efEsc(label)}</a>`;
};

// buttons: [{ href(already-safe), label, variant }]
const efButtons = (buttons) =>
    `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tbody><tr>${buttons
        .map((b) => `<td style="padding-right:12px;padding-bottom:8px;">${efButton(b.href, b.label, b.variant)}</td>`)
        .join('')}</tr></tbody></table>`;

const efRule = () => `<tr><td style="padding:0 32px;"><div style="height:1px;background:${EFEAR.line};"></div></td></tr>`;

const efLabel = (text) =>
    `<div style="font-family:${EF_MONO};font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:${EFEAR.muted};margin-bottom:6px;">${efEsc(text)}</div>`;

const efValue = (html) =>
    `<div style="font-family:${EF_MONO};font-size:12px;color:${EFEAR.text};line-height:1.7;">${html}</div>`;

// pairs: [{ label, html }] laid out `cols` per row.
const efPairs = (pairs, cols = 2) => {
    const rows = [];
    for (let i = 0; i < pairs.length; i += cols) rows.push(pairs.slice(i, i + cols));
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody>${rows
        .map((r) => `<tr>${r
            .map((p) => `<td width="${Math.floor(100 / cols)}%" style="vertical-align:top;padding:0 12px 16px 0;">${efLabel(p.label)}${efValue(p.html)}</td>`)
            .join('')}</tr>`)
        .join('')}</tbody></table>`;
};

const efPanel = (inner, accent = EFEAR.line) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr><td style="background:${EFEAR.ink};border:1px solid ${EFEAR.line};border-left:3px solid ${accent};padding:18px 20px;">${inner}</td></tr></tbody></table>`;

const efNotice = (label, html, accent = EFEAR.red) =>
    efPanel(`<div style="font-family:${EF_MONO};font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:${EFEAR.text};margin-bottom:6px;">${efEsc(label)}</div><div style="font-family:${EF_MONO};font-size:11px;color:${EFEAR.body};line-height:1.8;">${html}</div>`, accent);

// steps: [{ title, copy }] — numbered 01, 02, 03 …
const efSteps = (steps) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr>${steps
        .map((s, i) => `<td width="${Math.floor(100 / steps.length)}%" style="vertical-align:top;${i ? `border-left:1px solid ${EFEAR.line};padding-left:16px;` : ''}padding-right:16px;">
            <div style="font-family:${EF_DISPLAY};font-size:22px;color:${EFEAR.red};margin-bottom:6px;">${String(i + 1).padStart(2, '0')}</div>
            <div style="font-family:${EF_MONO};font-size:10px;font-weight:700;color:${EFEAR.text};letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;">${efEsc(s.title)}</div>
            <div style="font-family:${EF_MONO};font-size:10px;color:${EFEAR.muted};line-height:1.7;">${efEsc(s.copy)}</div>
        </td>`)
        .join('')}</tr></tbody></table>`;

// steps: [{ label, date, done }]
const efTimeline = (steps) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr>${steps
        .map((s) => `<td width="${Math.floor(100 / steps.length)}%" align="center" style="vertical-align:top;">
            <div style="font-family:${EF_MONO};font-size:16px;color:${s.done ? EFEAR.green : EFEAR.muted};margin-bottom:6px;">${s.done ? '✓' : '○'}</div>
            <div style="font-family:${EF_MONO};font-size:10px;font-weight:700;color:${EFEAR.text};letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">${efEsc(s.label)}</div>
            <div style="font-family:${EF_MONO};font-size:10px;color:${EFEAR.muted};">${efVal(s.date)}</div>
        </td>`)
        .join('')}</tr></tbody></table>`;

// lines: [{ label, value(already-safe), strong }]
const efTotals = (lines) =>
    `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody>${lines
        .map((l) => `<tr>
            <td style="padding:${l.strong ? '12px 0 0' : '4px 0'};${l.strong ? `border-top:1px solid ${EFEAR.line};` : ''}font-family:${l.strong ? EF_DISPLAY : EF_MONO};font-size:${l.strong ? '16px' : '11px'};letter-spacing:${l.strong ? '.05em' : '.1em'};text-transform:uppercase;color:${l.strong ? EFEAR.text : EFEAR.muted};">${efEsc(l.label)}</td>
            <td align="right" style="padding:${l.strong ? '12px 0 0' : '4px 0'};${l.strong ? `border-top:1px solid ${EFEAR.line};` : ''}font-family:${l.strong ? EF_DISPLAY : EF_MONO};font-size:${l.strong ? '20px' : '12px'};color:${l.strong ? EFEAR.red : EFEAR.text};">${l.value}</td>
        </tr>`)
        .join('')}</tbody></table>`;

// Accepts items[] or the legacy single-item fields.
const efItems = (d = {}) => {
    if (Array.isArray(d.items) && d.items.length) return d.items;
    return d.itemName ? [{ name: d.itemName, qty: d.qty, variant: d.variant, price: d.itemPrice }] : [];
};

const efItemRows = (items) => {
    if (!items.length) return efParagraph(efEsc('Item details are available in your account.'));
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody>${items
        .map((it) => {
            const qty = Number(it.qty) > 0 ? Number(it.qty) : 1;
            const unit = Number(it.price);
            const line = Number.isNaN(unit) ? '—' : efMoney(unit * qty);
            const meta = [`Qty: ${qty}`, it.variant].filter(Boolean).map(efEsc).join(' &nbsp;·&nbsp; ');
            return `<tr>
                <td style="padding:12px 0;border-bottom:1px solid ${EFEAR.line};">
                    <div style="font-family:${EF_MONO};font-size:12px;font-weight:700;color:${EFEAR.text};margin-bottom:4px;">${efVal(it.name, 'Item')}</div>
                    <div style="font-family:${EF_MONO};font-size:10px;color:${EFEAR.muted};">${meta}</div>
                </td>
                <td align="right" style="padding:12px 0;border-bottom:1px solid ${EFEAR.line};font-family:${EF_MONO};font-size:12px;color:${EFEAR.text};vertical-align:top;">${line}</td>
            </tr>`;
        })
        .join('')}</tbody></table>`;
};

const efFooterLinks = (marketing) => {
    const link = (href, label) =>
        `<a href="${href}" style="font-family:${EF_MONO};font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${EFEAR.muted};text-decoration:none;margin:0 10px;">${label}</a>`;
    return [
        link(efUrl('', '/shop'), 'Shop'),
        link(efUrl('', '/account/orders'), 'Orders'),
        link(efUrl('', '/faq'), 'Help'),
        link(efUrl('', '/contact'), 'Contact'),
        marketing ? link(efEsc(`mailto:${EF_BUSINESS.email}?subject=Unsubscribe`), 'Unsubscribe') : '',
    ].join('');
};

// The one shell every eFear email goes through.
//   tag        right-hand label in the header
//   preheader  inbox preview text
//   rows       concatenated <tr>…</tr> body rows
//   reason     "You're receiving this because …"
//   marketing  adds an Unsubscribe link (transactional mail must not)
const efShell = ({ tag, preheader = '', rows, reason, marketing = false }) => `<!DOCTYPE html>
<html lang="en">
<head>${EF_HEAD}
<title>${efEsc(tag)} · eFear</title>
</head>
<body style="margin:0;padding:0;background:${EFEAR.void};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;mso-hide:all;">${efEsc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${EFEAR.void};">
  <tbody><tr><td align="center" style="padding:24px 16px;">
    <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:${EFEAR.card};border:1px solid ${EFEAR.line};">
      <tbody>
      <tr>
        <td style="background:${EFEAR.ink};border-bottom:3px solid ${EFEAR.red};padding:22px 32px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr>
            <td>${efLogo(28)}<span style="font-family:${EF_MONO};font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:${EFEAR.muted};display:inline-block;padding-left:14px;margin-left:10px;border-left:1px solid ${EFEAR.line};">Comics · Collectibles</span></td>
            <td align="right" style="font-family:${EF_MONO};font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:${EFEAR.muted};">${efEsc(tag)}</td>
          </tr></tbody></table>
        </td>
      </tr>
${rows}
      <tr>
        <td style="background:${EFEAR.ink};border-top:1px solid ${EFEAR.line};padding:24px 32px;" align="center">
          <div style="margin-bottom:12px;">${efLogo(18, EFEAR.muted)}</div>
          <div style="margin-bottom:14px;">${efFooterLinks(marketing)}</div>
          <div style="font-family:${EF_MONO};font-size:10px;color:${EFEAR.muted};line-height:1.8;">
            © ${new Date().getFullYear()} ${efEsc(EF_BUSINESS.legal)} · ${efEsc(EF_BUSINESS.address)} · All rights reserved<br>
            <span style="color:${EFEAR.muted};">${efEsc(reason)}</span>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </td></tr></tbody>
</table>
</body>
</html>`;

// ---------------------------------------------------------------------------
// eFear templates
// ---------------------------------------------------------------------------
const efWelcome = (data = {}) => efShell({
    tag: 'Account Confirmation',
    preheader: 'Your eFear account is live. Welcome to the crew.',
    reason: `You're receiving this because you signed up at ${efHost()}`,
    rows: [
        efHero('welcome aboard', ["You're part", 'of the crew.']),
        efRow(
            efParagraph(`Hey ${efStrong(data.firstName || 'there')},<br><br>Your eFear account is live. Comics, graphic novels, trading cards, manga — all of it, one login. We don't do junk mail. We do drops, restocks, and members-only deals.`) +
            efButtons([
                { href: efUrl(data.userUrl, '/account/dashboard'), label: 'Go to My Account →' },
                { href: efUrl('', '/shop'), label: 'Browse the Store', variant: 'ghost' },
            ]),
        ),
        efRule(),
        efRow(efSteps([
            { title: 'Browse & Wishlist', copy: 'Save items before they sell out.' },
            { title: 'Checkout Fast', copy: 'Saved addresses & payment methods.' },
            { title: 'Track Orders', copy: 'Real-time updates on every order.' },
        ]), '28px 32px'),
    ].join('\n'),
});

const efConfirm = (data = {}) => efShell({
    tag: 'Order Receipt',
    preheader: `Order #${data.orderId || ''} confirmed — we're picking it now.`,
    reason: `You're receiving this because you placed an order at ${efHost()}`,
    rows: [
        efHero('order confirmed', ['Got it.', "You're good."]),
        efRow(
            efParagraph(`Hey ${efStrong(data.firstName || 'there')} — your order is confirmed and being picked. We'll send tracking as soon as it ships.`) +
            efPairs([
                { label: 'Order', html: `#${efVal(data.orderId)}` },
                { label: 'Date', html: efVal(data.orderDate) },
            ]),
            '0 32px 8px',
        ),
        efRow(efItemRows(efItems(data)), '0 32px 20px'),
        efRow(efTotals([
            { label: 'Subtotal', value: efMoney(data.subtotal) },
            { label: 'Shipping', value: Number(data.shipping) === 0 ? 'FREE' : efMoney(data.shipping) },
            { label: 'Total', value: efMoney(data.total), strong: true },
        ])),
        efRule(),
        efRow(
            efPairs([
                { label: 'Ship To', html: efAddress(data) },
                { label: 'Payment', html: `${efVal(data.paymentMethod)}${data.cardLast4 ? ` ending in ${efEsc(data.cardLast4)}` : ''}` },
            ]) + efButtons([{ href: efUrl(data.orderUrl, '/account/orders'), label: 'Track My Order →' }]),
            '28px 32px',
        ),
    ].join('\n'),
});

const efUpdate = (data = {}) => efShell({
    tag: 'Shipping Update',
    preheader: `Order #${data.orderId || ''} has shipped.`,
    reason: `You're receiving this because you placed an order at ${efHost()}`,
    rows: [
        efHero('dispatched', ['Your order', 'just shipped.']),
        efRow(
            efParagraph(`Order ${efStrong(`#${data.orderId || '—'}`)} left our warehouse and is heading your way. Use the tracking number below to follow it.`) +
            efPanel(`${efLabel('Tracking Number')}<div style="font-family:${EF_MONO};font-size:14px;color:${EFEAR.text};letter-spacing:.06em;word-break:break-all;">${efVal(data.trackingNumber)}</div>`, EFEAR.red),
        ),
        efRow(efTimeline([
            { label: 'Order Placed', date: data.placedDate, done: true },
            { label: 'Dispatched', date: data.shipDate, done: true },
            { label: 'Delivered', date: data.etaDate ? `Est. ${data.etaDate}` : '', done: false },
        ])),
        efRule(),
        efRow(
            efPairs([
                { label: 'Delivering To', html: efAddress(data) },
                { label: 'Carrier', html: `${efVal(data.carrier)}${data.serviceLevel ? `<br>${efEsc(data.serviceLevel)}` : ''}` },
            ]) + efButtons([{ href: efUrl(data.trackingUrl, '/account/orders'), label: 'Track Package →' }]),
            '28px 32px',
        ),
    ].join('\n'),
});

const efOrderComplete = (data = {}) => efShell({
    tag: 'Order Complete',
    preheader: `Order #${data.orderId || ''} has been delivered.`,
    reason: `You're receiving this because you placed an order at ${efHost()}`,
    rows: [
        efHero('delivered', ['Your haul', 'has landed.']),
        efRow(
            efParagraph(`Order ${efStrong(`#${data.orderId || '—'}`)} has been delivered. We hope everything is in perfect condition — if not, we'll make it right.`) +
            efPairs([
                { label: 'Delivered To', html: efAddress(data) },
                { label: 'Delivered On', html: efVal(data.deliveredDate) },
            ]),
        ),
        efRow(efTimeline([
            { label: 'Order Placed', date: data.placedDate, done: true },
            { label: 'Dispatched', date: data.shippedDate, done: true },
            { label: 'Delivered', date: data.deliveredDate, done: true },
        ])),
        efRule(),
        efRow(
            efLabel('What Was Inside') + efItemRows(efItems(data)) +
            `<div style="height:12px;"></div>` +
            efTotals([{ label: 'Order Total', value: efMoney(data.total), strong: true }]),
            '28px 32px 20px',
        ),
        efRow(efButtons([
            { href: efUrl(data.reviewUrl, '/account/orders'), label: 'Leave a Review →' },
            { href: efUrl(data.shopUrl, '/shop'), label: 'Shop Again', variant: 'ghost' },
        ])),
        efRow(efNotice('Something not right?',
            `Missing items, damage, wrong product — <a href="${efUrl(data.supportUrl, '/contact')}" style="color:${EFEAR.red};">contact our team</a> within 7 days and we'll sort it out, no hassle.`,
            EFEAR.green)),
    ].join('\n'),
});

const EF_DEFAULT_PRODUCTS = [
    { category: 'Comic Books', name: 'Spawn #1', price: 30.99 },
    { category: 'Comic Books', name: 'Teenage Mutant Ninja Turtles', price: 29.99 },
    { category: 'E-Books', name: 'F.E.A.R. The Vegan Manifesto', price: 5.99 },
];

const efPromo = (data = {}) => {
    const products = Array.isArray(data.products) && data.products.length ? data.products : EF_DEFAULT_PRODUCTS;
    const cta = efUrl(data.ctaUrl, '/shop');
    return efShell({
        tag: 'New Arrival',
        preheader: 'Fresh drops just hit the shelves at eFear.',
        reason: "You're receiving this because you subscribed to eFear updates",
        marketing: true,
        rows: [
            efHero('new drop', [data.heading || 'Collection Update!']),
            efRow(
                efParagraph(efEsc(data.intro || 'Check out our latest rare comics!')) +
                efButtons([{ href: cta, label: 'Shop the Drop →' }]),
            ),
            efRule(),
            efRow(
                efLabel('Featured') +
                `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tbody>${products
                    .slice(0, 6)
                    .map((p) => `<tr>
                        <td style="padding:12px 0;border-bottom:1px solid ${EFEAR.line};">
                            <div style="font-family:${EF_MONO};font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:${EFEAR.red};margin-bottom:4px;">${efVal(p.category, 'Shop')}</div>
                            <a href="${efUrl(p.url, '/shop')}" style="font-family:${EF_MONO};font-size:12px;font-weight:700;color:${EFEAR.text};text-decoration:none;">${efVal(p.name, 'Item')}</a>
                        </td>
                        <td align="right" style="padding:12px 0;border-bottom:1px solid ${EFEAR.line};font-family:${EF_MONO};font-size:12px;color:${EFEAR.text};vertical-align:bottom;">${efMoney(p.price)}</td>
                    </tr>`)
                    .join('')}</tbody></table>`,
                '28px 32px 20px',
            ),
            efRow(efButtons([{ href: cta, label: 'See All New Arrivals →', variant: 'ghost' }])),
        ].join('\n'),
    });
};

const efContactForm = (data = {}) => efShell({
    tag: 'Contact Form',
    preheader: 'We got your message and will reply within 1–2 business days.',
    reason: `You're receiving this because you submitted a contact form at ${efHost()}`,
    rows: [
        efHero('message received', ['We got your', 'message.']),
        efRow(
            efParagraph(`Hey ${efStrong(data.$name || 'there')},<br><br>Thanks for reaching out. Our team has received your message and will get back to you within 1–2 business days. Here's a copy of what you sent.`) +
            efPairs([
                { label: 'Subject', html: efVal(data.$subject) },
                { label: 'Submitted', html: efVal(data.submittedAt || efNow()) },
            ]),
            '0 32px 12px',
        ),
        efRow(efLabel('Your Message') + efPanel(`<div style="font-family:${EF_MONO};font-size:12px;color:${EFEAR.body};line-height:1.9;">${efText(data.$message)}</div>`)),
        efRule(),
        efRow(
            efParagraph('Need faster help? Most answers are in the FAQ.') +
            efButtons([
                { href: efUrl('', '/faq'), label: 'Browse FAQ →' },
                { href: efUrl('', '/shop'), label: 'Back to Store', variant: 'ghost' },
            ]),
            '28px 32px',
        ),
    ].join('\n'),
});

// ---------------------------------------------------------------------------
// Account recovery
// ---------------------------------------------------------------------------
const efPasswordReset = (data = {}) => {
    const resetUrl = efUrl(data.resetURL || data.resetURL, '/forgot-password');
    const expires = data.expiresAt || `in ${data.expiresIn || '10 minutes'}`;
    return efShell({
        tag: 'Password Reset',
        preheader: `Reset your eFear password — this link expires ${expires}.`,
        reason: `You're receiving this because a password reset was requested for your account at ${efHost()}`,
        rows: [
            efHero('access request', ['Reset your', 'password.']),
            efRow(
                efParagraph(`Hey ${efStrong(data.firstName || 'there')},<br><br>We received a request to reset the password for your eFear account. Use the button below to choose a new one. This link expires ${efStrong(expires)} and can only be used once. If you didn't request this, you can safely ignore this email — your password won't change.`) +
                efPairs([
                    { label: 'Account', html: efVal(data.email) },
                    { label: 'Link Expires', html: efEsc(expires) },
                ]) +
                efButtons([{ href: resetUrl, label: 'Reset My Password →' }]),
            ),
            efRow(
                `<div style="font-family:${EF_MONO};font-size:10px;color:${EFEAR.muted};line-height:1.7;margin-bottom:6px;">Button not working? Paste this link into your browser:</div>` +
                `<div style="font-family:${EF_MONO};font-size:10px;color:${EFEAR.body};line-height:1.7;word-break:break-all;"><a href="${resetUrl}" style="color:${EFEAR.body};">${resetUrl}</a></div>`,
            ),
            efRule(),
            efRow(efSteps([
                { title: 'Click the Link', copy: 'Opens a secure reset page.' },
                { title: 'Set New Password', copy: 'Choose something strong.' },
                { title: 'Back in Business', copy: 'Log in and get back to the haul.' },
            ]), '28px 32px 20px'),
            efRow(efNotice('Keep this link private',
                `Never share it. eFear will never ask for your password by email, text, or phone.`, EFEAR.red)),
        ].join('\n'),
    });
};

const efPasswordResetSuccess = (data = {}) => efShell({
    tag: 'Security Notice',
    preheader: 'The password on your eFear account was just changed.',
    reason: `You're receiving this because the password changed on your account at ${efHost()}`,
    rows: [
        efHero('password updated', ['Password', 'changed.']),
        efRow(
            efParagraph(`Hey ${efStrong(data.firstName || 'there')},<br><br>The password for your eFear account was just changed. You can sign in with your new password right away.`) +
            efPairs([
                { label: 'Account', html: efVal(data.email) },
                { label: 'Changed', html: efEsc(data.changedAt || efNow()) },
            ]) +
            efButtons([{ href: efUrl('', '/login'), label: 'Sign In →' }]),
        ),
        efRow(efNotice("Wasn't you?",
            `Someone else may have access to your account. <a href="${efUrl('', '/forgot-password')}" style="color:${EFEAR.red};">Reset your password again</a> right away, then contact us at <a href="mailto:${efEsc(EF_BUSINESS.email)}" style="color:${EFEAR.red};">${efEsc(EF_BUSINESS.email)}</a>.`,
            EFEAR.red)),
    ].join('\n'),
});

// Plain-text bodies (the `text` half of multipart mail) for the templates that
// are sent programmatically. Unknown types fall back to a generic line.
const efPlainText = (data = {}, type) => {
    const name = data.firstName || 'there';
    const site = efSite();
    switch (type) {
        case 'passwordReset': {
            const url = data.resetUrl || data.resetURL || `${site}/forgot-password`;
            return [
                `Hey ${name},`,
                '',
                'We received a request to reset the password for your eFear account.',
                `Choose a new password here (the link expires in ${data.expiresIn || '10 minutes'} and works once):`,
                url,
                '',
                "If you didn't request this, you can safely ignore this email — your password won't change.",
                '',
                'eFear will never ask for your password by email, text, or phone.',
                `— eFear · ${site}`,
            ].join('\n');
        }
        case 'passwordResetSuccess':
            return [
                `Hey ${name},`,
                '',
                `The password for your eFear account${data.email ? ` (${data.email})` : ''} was just changed.`,
                `Sign in: ${site}/login`,
                '',
                `Wasn't you? Reset it again right away: ${site}/forgot-password`,
                `Then contact us at ${EF_BUSINESS.email}.`,
                `— eFear · ${site}`,
            ].join('\n');
        case 'welcome':
            return `Hey ${name},\n\nYour eFear account is live. Start shopping: ${site}/shop\n\n— eFear · ${site}`;
        case 'contactForm':
            return `Hey ${data.$name || 'there'},\n\nThanks for reaching out — we'll reply within 1–2 business days.\n\nYour message:\n${data.$message || ''}\n\n— eFear · ${site}`;
        default:
            return `eFear · ${site}`;
    }
};

module.exports = {
    welcome: efWelcome,
    confirm: efConfirm,
    update: efUpdate,
    orderComplete: efOrderComplete,
    promo: efPromo,
    contactForm: efContactForm,

    // Account recovery. The (resetURL, email) / (email) signatures are what
    // controllers/auth/password.js calls through mailService.templates.
    passwordReset: efPasswordReset,
    passwordResetTemplate: (resetURL, email, extra = {}) => efPasswordReset({ ...extra, resetUrl: resetURL, email }),
    passwordResetSuccess: efPasswordResetSuccess,
    passwordResetSuccessTemplate: (email, extra = {}) => efPasswordResetSuccess({ ...extra, email }),
    generatePlainText: efPlainText,

    vchatWelcome(data = {}) {
        const step = (n, title, copy, edge) => `
            <td width="33%" style="vertical-align:top;${edge ? `border-left:1px solid ${VCHAT.line};padding-left:16px;` : ''}padding-right:16px;">
              <div style="font-family:${VC_FONT};font-size:24px;font-weight:800;color:${VCHAT.sky};margin-bottom:6px;">${n}</div>
              <div style="font-family:${VC_FONT};font-size:14px;font-weight:700;color:${VCHAT.violetSoft};margin-bottom:4px;">${title}</div>
              <div style="font-family:${VC_FONT};font-size:13px;color:${VCHAT.muted};line-height:1.6;">${copy}</div>
            </td>`;

        const rows = `
      <tr>
        <td style="padding:36px 32px 12px;">
          ${vcEyebrow("You're in")}
          <div style="font-family:${VC_FONT};font-size:34px;font-weight:800;letter-spacing:-0.03em;line-height:1.1;color:${VCHAT.text};">Welcome to <span style="color:${VCHAT.skySoft};">V-CHAT</span>.</div>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 32px 28px;">
          <p style="font-family:${VC_FONT};font-size:16px;color:${VCHAT.muted};line-height:1.6;margin:0 0 22px;">
            Hey <strong style="color:${VCHAT.text};">${vcEsc(data.firstName || 'there')}</strong>, your account is live. Spin up a room, share the link, and talk face to face.
          </p>
          <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:18px;"><tbody><tr>
            <td>${vcButton(data.appUrl, 'Start a call')}</td>
          </tr></tbody></table>
          <div>${vcBadge('End-to-end encrypted between everyone in the room')}</div>
        </td>
      </tr>
      <tr><td style="padding:0 32px;"><div style="height:1px;line-height:1px;font-size:0;background:${VCHAT.line};">&nbsp;</div></td></tr>
      <tr>
        <td style="padding:28px 32px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0"><tbody><tr>
            ${step('01', 'New room', 'One click, one private link.', false)}
            ${step('02', 'Invite people', 'Share the link by email or message.', true)}
            ${step('03', 'Talk privately', 'Video, audio, screen share and chat.', true)}
          </tr></tbody></table>
        </td>
      </tr>`;
        return vcShell('Welcome', rows);
    },

    /**
     * data: { inviterName, roomUrl, roomName?, message?, scheduledFor? }
     */
    vchatInvite(data = {}) {
        const inviter = vcEsc(data.inviterName || 'Someone');
        const room = data.roomName ? vcEsc(data.roomName) : null;
        const label = (text) => `<div style="font-family:${VC_FONT};font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:${VCHAT.muted};margin-bottom:8px;">${text}</div>`;

        const rows = `
      <tr>
        <td style="padding:36px 32px 24px;border-bottom:1px solid ${VCHAT.line};">
          ${vcEyebrow('Incoming invite')}
          <div style="font-family:${VC_FONT};font-size:34px;font-weight:800;letter-spacing:-0.03em;line-height:1.12;color:${VCHAT.text};margin-bottom:14px;">${inviter}<br><span style="color:${VCHAT.skySoft};">wants you on a call.</span></div>
          <p style="font-family:${VC_FONT};font-size:16px;color:${VCHAT.muted};line-height:1.6;margin:0;">
            ${inviter} invited you to join ${room ? `<strong style="color:${VCHAT.text};">${room}</strong>` : 'a V-CHAT room'}. No download needed. Open the link, pick your camera and mic, and you're in.
          </p>
        </td>
      </tr>
      ${data.message ? `
      <tr>
        <td style="padding:24px 32px 0;">
          ${label(`Message from ${inviter}`)}
          <div style="background:#0d1024;border-left:2px solid ${VCHAT.violet};border-radius:4px 10px 10px 4px;padding:12px 16px;font-family:${VC_FONT};font-size:15px;color:${VCHAT.text};line-height:1.6;">${vcEsc(data.message).replace(/\r?\n/g, '<br>')}</div>
        </td>
      </tr>` : ''}
      ${data.scheduledFor ? `
      <tr>
        <td style="padding:24px 32px 0;">
          ${label('When')}
          <div style="font-family:${VC_FONT};font-size:18px;font-weight:700;color:${VCHAT.violetSoft};">${vcEsc(data.scheduledFor)}</div>
        </td>
      </tr>` : ''}
      <tr>
        <td style="padding:28px 32px 14px;">${vcButton(data.roomUrl, 'Join the call')}</td>
      </tr>
      <tr>
        <td style="padding:0 32px 28px;">
          ${label('Or paste this link')}
          <div style="display:inline-block;padding:6px 12px;border:1px solid ${VCHAT.line};border-radius:6px;background:${VCHAT.void};font-family:${VC_MONO};font-size:13px;color:${VCHAT.muted};word-break:break-all;">${vcEsc(data.roomUrl)}</div>
        </td>
      </tr>
      <tr><td style="padding:0 32px;"><div style="height:1px;line-height:1px;font-size:0;background:${VCHAT.line};">&nbsp;</div></td></tr>
      <tr>
        <td style="padding:20px 32px 28px;">
          <div style="margin-bottom:12px;">${vcBadge('End-to-end encrypted')}</div>
          <div style="font-family:${VC_FONT};font-size:13px;color:${VCHAT.muted};line-height:1.6;">
            Only join if you know ${inviter}. If you weren't expecting this, ignore this email.
          </div>
        </td>
      </tr>`;
        return vcShell('Call invitation', rows);
    },
}