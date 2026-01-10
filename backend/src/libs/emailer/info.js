require("dotenv").config({ path: "backend/.env" });

module.exports = {
  mailgun: {
    domain: "fear.dedyn.io",
    region: 'US',
    apikey: process.env.MG_API_KEY,
    sandbox: "sandbox933b4315c0164f209bbf0bc7fb908598.mailgun.org"
  },
  smtp: {
    secure: process.env.SMTP_SECURE === 'true',
    mailgun: {
      host: process.env.MG_SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      auth: {
        user: process.env.MG_SMTP_USER,
        pass: process.env.MG_SMTP_PASS
      }
    },
    google: {
      host: process.env.GOOGLE_SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      auth: {
        user: process.env.GOOGLE_SMTP_USER,
        pass: process.env.GOOGLE_SMTP_PASS
      }
    }
  }
}