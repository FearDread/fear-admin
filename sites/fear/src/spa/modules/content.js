import { pad, esc, safeUrl, icon } from '../utils.js';
import { placeholderArt, accent } from '../art.js';
import { PROFILE, EXP, TECH, PROJECTS, SERVICES, PROCESS, TESTIMONIALS, STATS, SKILLS } from '../data/resume.js';

const t = {
    exp: (items) => items.map((e) => `<div class="exp-item"><span class="exp-num">${esc(e.num)}</span><span class="exp-lbl">${esc(e.lbl)}</span></div>`).join(''),
    tech: (items) => items.map((x) => `<span class="tech-tag">${esc(x)}</span>`).join(''),
    projects: (items) => items.map((p, n) => {
        const img = safeUrl(p.image);
        const media = img ? `<img class="pc-img" src="${esc(img)}" alt="" loading="lazy">` : placeholderArt(n);
        return `<article class="proj-card" tabindex="0" role="button" aria-haspopup="dialog" aria-label="${esc('Project details: ' + p.title)}" style="--c1:${accent(n)}">` +
            `<div class="pc-media">${media}<i class="bi ${icon(p.icon)} pc-glyph" aria-hidden="true"></i>` +
            `<span class="pc-badge">${esc(p.status || '')}</span><span class="pc-idx">${pad(n + 1)}</span>` +
            (img ? '' : '<span class="pc-ph">Cover image \u00b7 placeholder</span>') +
            `<span class="pc-open"><i class="bi bi-arrows-angle-expand"></i> View details</span></div>` +
            `<div class="pc-body"><div class="pc-cat">${esc(p.category || '')}</div><h3 class="pc-title">${esc(p.title)}</h3>` +
            `<div class="pc-tags">${(p.tags || []).slice(0, 3).map((t) => `<span>${esc(t)}</span>`).join('')}</div></div><span class="pc-spot"></span></article>`;
    }).join(''),
    services: (items) => items.map((s, n) => `<div class="serv-cell"><span class="serv-num">${pad(n + 1)}</span><i class="bi ${icon(s.icon)} serv-icon" aria-hidden="true"></i><div class="serv-name">${esc(s.name)}</div><div class="serv-desc">${esc(s.desc)}</div></div>`).join(''),
    process: (items) => items.map((s, n) => `<div class="proc-step"><div class="proc-circle">${pad(n + 1)}</div><div class="proc-content"><div class="proc-title">${esc(s.title)}</div><div class="proc-desc">${esc(s.desc)}</div><span class="proc-tag">${esc(s.tag)}</span></div></div>`).join(''),
    testimonials: (items) => items.map((x, n) => `<figure class="testi-card${n === 0 ? ' active' : ''}"><blockquote class="testi-quote">${esc(x.quote)}</blockquote><figcaption><div class="testi-author">${esc(x.author)}</div><div class="testi-role">${esc(x.role)}</div></figcaption></figure>`).join(''),
    dots: (items) => items.map((_, n) => `<button type="button" class="testi-dot${n === 0 ? ' active' : ''}" aria-label="Testimonial ${n + 1}"></button>`).join(''),
    stats: (items) => items.map((s) => `<div class="stat-box"><div class="stat-bignum counter" data-t="${s.t}" data-d="${s.d || 0}" data-prefix="${esc(s.prefix || '')}" data-suffix="${esc(s.suffix || '')}">0</div><div class="stat-lbl">${esc(s.label)}</div></div>`).join(''),
    skills: (items) => items.map((s) => `<div class="sk-row"><div class="sk-head"><span class="sk-name">${esc(s.name)}</span><span class="sk-pct" data-w="${s.w}">0%</span></div><div class="sk-track"><div class="sk-fill" data-w="${s.w}"></div></div></div>`).join('')
};

export default function contentModule(sb) {
    const mount = (sel, html) => { const $el = $(sel); if ($el.length) $el.html(html); else sb.warn('content: missing mount ' + sel); };

    return {
        load() {
            mount('#exp-row', t.exp(EXP));
            mount('#tech-row', t.tech(TECH));
            mount('#proj-list', t.projects(PROJECTS));
            mount('#serv-grid', t.services(SERVICES));
            mount('#process-steps', t.process(PROCESS));
            mount('#testi-cards', t.testimonials(TESTIMONIALS));
            mount('#testi-dots', t.dots(TESTIMONIALS));
            mount('#stats-top', t.stats(STATS));
            mount('#skills', t.skills(SKILLS));

            $('#year').text(new Date().getFullYear());
            $('[data-profile="github"]').attr('href', safeUrl(PROFILE.github));
            $('[data-profile="site"]').attr('href', safeUrl(PROFILE.site));
            if (PROFILE.email) $('#c-email').attr('href', 'mailto:' + PROFILE.email).text(PROFILE.email).closest('.c-info-row').show();
            else $('#c-email').closest('.c-info-row').hide();

            $(document).on('click.content', '[data-href]', function () { window.open($(this).attr('data-href'), '_blank', 'noopener'); });
            sb.emit('testimonials:refresh');
        },
        unload() { $(document).off('.content'); }
    };
}