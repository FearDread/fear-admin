require("dotenv").config({ path: "backend/.env" });

module.exports = {
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