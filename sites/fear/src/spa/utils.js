export const pad = (n) => String(n).padStart(2, '0');
export const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const safeUrl = (u) => (/^https?:\/\//i.test(u || '') || /^\/(?!\/)/.test(u || '')) ? u : '';
export const icon = (name) => (/^bi-[a-z0-9-]+$/i.test(name || '') ? name : 'bi-dot');

/**
 * True when `target` sits inside something that can still scroll in the wheel/swipe
 * direction, so section navigation should leave the gesture alone.
 */
export function canScrollInside(target, dy) {
    for (let el = target; el && el !== document.body; el = el.parentElement) {

        if (!(el instanceof Element)) continue;

        const oy = getComputedStyle(el).overflowY;

        if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
            const atTop = el.scrollTop <= 0;
            const atEnd = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;

            if ((dy > 0 && !atEnd) || (dy < 0 && !atTop)) return true;
        }
    }
    return false;
}
