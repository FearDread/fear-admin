import { pad, esc, safeUrl, icon } from '../utils.js';
import { PROFILE, EXP, TECH, PROJECTS, SERVICES, PROCESS, TESTIMONIALS, POSTS, STATS, SKILLS } from '../data/resume.js';

const t = {
    exp: (items) => items.map((e) => `<div class="exp-item"><span class="exp-num">${esc(e.num)}</span><span class="exp-lbl">${esc(e.lbl)}</span></div>`).join(''),
    tech: (items) => items.map((x) => `<span class="tech-tag">${esc(x)}</span>`).join(''),
    projects: (items) => items.map((p, n) => `<div class="proj-row" tabindex="0" role="button" aria-haspopup="dialog"><span class="proj-num">${pad(n + 1)}</span><div class="proj-thumb proj-glyph" aria-hidden="true"><i class="bi ${icon(p.icon)}"></i></div><div class="proj-info"><div class="proj-name">${esc(p.title)}</div><div class="proj-cat">${esc([p.category].concat(p.tags || []).filter(Boolean).slice(0, 4).join(' \u00b7 '))}</div></div><div class="proj-year">${esc(p.status || '')}</div><i class="bi bi-plus-lg proj-arrow"></i></div>`).join(''),
    services: (items) => items.map((s, n) => `<div class="serv-cell"><span class="serv-num">${pad(n + 1)}</span><i class="bi ${icon(s.icon)} serv-icon" aria-hidden="true"></i><div class="serv-name">${esc(s.name)}</div><div class="serv-desc">${esc(s.desc)}</div></div>`).join(''),
    process: (items) => items.map((s, n) => `<div class="proc-step"><div class="proc-circle">${pad(n + 1)}</div><div class="proc-content"><div class="proc-title">${esc(s.title)}</div><div class="proc-desc">${esc(s.desc)}</div><span class="proc-tag">${esc(s.tag)}</span></div></div>`).join(''),
    testimonials: (items) => items.map((x, n) => `<figure class="testi-card${n === 0 ? ' active' : ''}"><blockquote class="testi-quote">${esc(x.quote)}</blockquote><figcaption><div class="testi-author">${esc(x.author)}</div><div class="testi-role">${esc(x.role)}</div></figcaption></figure>`).join(''),
    dots: (items) => items.map((_, n) => `<button type="button" class="testi-dot${n === 0 ? ' active' : ''}" aria-label="Testimonial ${n + 1}"></button>`).join(''),
    posts: (items) => items.map((b, n) => `<div class="blog-card${n === 0 ? ' featured' : ''}"${b.link ? ` data-href="${esc(safeUrl(b.link))}"` : ''}><div class="blog-img blog-art" aria-hidden="true"><i class="bi ${icon(b.icon)}"></i></div><div class="blog-body"><div class="blog-cat">${esc(b.section)}</div><div class="blog-title">${esc(b.title)}</div><div class="blog-date">${esc(b.meta)}</div></div></div>`).join(''),
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
            mount('#blog-grid', t.posts(POSTS));
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
