

module.exports = (fear) => {
    const router = fear.createRouter();
    const handler = fear.getHandler();
    const mailer = fear.getMailer();


    router.post("/send", handler.async(mailer.sendEmail))
    router.post("/contact", handler.async(mailer.sendContactEmail))
    router.post("/project", handler.async(mailer.sendProjectEmail))
    router.post("/subscribe", handler.async(mailer.sendSubscriptionEmail))
    router.post("/test", handler.async(mailer.sendTestEmail));
    return router;
};