require("dotenv").config({ path: "backend/.env" });

module.exports = {
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  },
  "imap": {
    "host": "mail.mydomain.com",
    "port": 999,
    "auth": {
      "user": "user@domain.com",
      "pass": "xxx"
    }
  }
}