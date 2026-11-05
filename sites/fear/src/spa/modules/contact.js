import { API } from '../config.js';
export default function contactModule() {
    const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function onSubmit(e) {
        e.preventDefault(); const $form = $(e.currentTarget), $btn = $form.find('.send-btn'), $status = $('#contact-status');
        const say = (text, ok) => $status.text(text).toggleClass('ok', !!ok).toggleClass('err', !ok);
        const payload = { name: $.trim($form.find('[name=name]').val()), email: $.trim($form.find('[name=email]').val()), budget: $.trim($form.find('[name=budget]').val()), message: $.trim($form.find('[name=message]').val()), website: $form.find('[name=website]').val() };
        if (!payload.name) return say('Please enter your name.');
        if (!EMAIL.test(payload.email)) return say('Please enter a valid email address.');
        if (payload.message.length < 10) return say('Tell me a little more (10+ characters).');
        $btn.prop('disabled', true); say('Sending…', true);
        $.ajax({ url: API + '/contact', method: 'POST', dataType: 'json', contentType: 'application/json', data: JSON.stringify(payload) })
            .done(() => { say('Thanks — your message is on its way. I reply within 24 hours.', true); $form[0].reset(); })
            .fail((xhr) => say((xhr.responseJSON && xhr.responseJSON.message) || 'Something went wrong. Please try again.'))
            .always(() => $btn.prop('disabled', false));
    }
    return { load() { $(document).on('submit.contact', '#contact-form', onSubmit); }, unload() { $(document).off('.contact'); } };
}
