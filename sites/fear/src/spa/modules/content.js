import { API } from '../config.js';
import { pad, esc, safeUrl } from '../utils.js';
export default function contentModule(sb) {
    const unsubscribe = [];
    const templates = {
        projects: (items) => items.map((p, n) => `<div class="proj-row"${p.link ? ` data-href="${esc(safeUrl(p.link))}"` : ''}><span class="proj-num">${pad(n + 1)}</span><img class="proj-thumb" src="${esc(safeUrl(p.image && p.image.url))}" alt=""><div class="proj-info"><div class="proj-name">${esc(p.title)}</div><div class="proj-cat">${esc([p.category].concat(p.tags || []).filter(Boolean).join(' · '))}</div></div><div class="proj-year">${esc(p.year || '')}</div><i class="bi bi-arrow-up-right proj-arrow"></i></div>`).join(''),
        testimonials: (items) => items.map((t, n) => `<div class="testi-card${n === 0 ? ' active' : ''}"><div class="testi-quote">${esc(t.quote)}</div><div class="testi-author">${esc(t.author)}</div><div class="testi-role">${esc(t.role)}</div></div>`).join(''),
        posts: (items) => items.map((b, n) => { const when = new Date(b.publishedAt || b.createdAt); const date = isNaN(when) ? '' : when.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); const img = b.images && b.images[0] && b.images[0].url; return `<div class="blog-card${n === 0 ? ' featured' : ''}"><img class="blog-img" src="${esc(safeUrl(img))}" alt=""><div class="blog-body"><div class="blog-cat">${esc(b.section || 'Journal')}</div><div class="blog-title">${esc(b.title)}</div><div class="blog-date">${esc(date)} · ${esc(b.readingTime || 1)} min read</div></div></div>`; }).join('')
    };
    function bind(path, el, template, after) {
        const model = sb.Model({ items: [] }); model.parse = (body) => ({ items: (body && body.result) || [] });
        const view = sb.View({ el, template: (data) => template(data.items) });
        unsubscribe.push(model.on('items', (items) => { if (!items.length) return; view.render(model.toJSON()).then(() => after && after(items)); }));
        return model.fetch(API + path, { dataType: 'json', parse: true }).catch((err) => sb.warn('content: ' + path + ' failed — ' + err.message));
    }
    return { load() {
        $(document).on('click.content', '.proj-row[data-href]', function () { window.open($(this).attr('data-href'), '_blank', 'noopener'); });
        return Promise.all([
            bind('/projects', '#proj-list', templates.projects),
            bind('/testimonials', '#testi-cards', templates.testimonials, (items) => { $('#testi-dots').html(items.map((_, n) => `<div class="testi-dot${n === 0 ? ' active' : ''}"></div>`).join('')); sb.emit('testimonials:refresh'); }),
            bind('/posts', '#blog-grid', templates.posts)
        ]);
    }, unload() { unsubscribe.forEach((off) => off()); $(document).off('.content'); } };
}
