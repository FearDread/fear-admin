import { API } from '../config.js';
import { PROFILE } from '../data/resume.js';

export default function contactModule() {
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let cooling = false;

    const say = (text, ok) => $('#contact-status').text(text).toggleClass('ok', !!ok).toggleClass('err', !ok && !!text);
    const val = ($form, name) => $.trim($form.find(`[name=${name}]`).val() || '');

    function onSubmit(e) {
        e.preventDefault();
        if (cooling) return;
        const $form = $(e.currentTarget), $btn = $form.find('.send-btn');
        const payload = { name: val($form, 'name'), email: val($form, 'email'), budget: val($form, 'budget'), message: val($form, 'message'), website: $form.find('[name=website]').val() };

        if (!payload.name) return say('A name, please. Even a fake one has character.');
        if (!EMAIL.test(payload.email)) return say('That email looks fake. Try one with an @ and a domain that exists.');
        if (payload.message.length < 10) return say('Give me at least 10 characters. A haiku works.');

        $btn.prop('disabled', true); say('Transmitting into the void\u2026', true);
        $.ajax({ url: API + '/contact', method: 'POST', dataType: 'json', contentType: 'application/json', data: JSON.stringify(payload) })
            .done(() => {
                say('Delivered. Somewhere, a pager just buzzed. Expect a reply soon.', true);
                $form[0].reset();
                cooling = true; setTimeout(() => { cooling = false; $btn.prop('disabled', false); }, 15000);
            })
            .fail((xhr) => {
                const server = xhr.responseJSON && xhr.responseJSON.message;
                if (server) say(server);
                else if (xhr.status === 0) say(`Couldn't reach the server. Ironic, given my day job. Try GitHub: ${PROFILE.handle}.`);
                else if (xhr.status === 429) say('Slow down. Rate limits are my love language, but still.');
                else say('Something broke. Not the form\u2019s fault. Probably. Please try again.');
                $btn.prop('disabled', false);
            });
    }

    return {
        load() {
            $(document).on('submit.contact', '#contact-form', onSubmit)
                .on('input.contact', '#contact-form', () => { if ($('#contact-status').hasClass('err')) say(''); });
        },
        unload() { $(document).off('.contact'); }
    };
}
