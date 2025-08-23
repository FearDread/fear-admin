require("dotenv").config({ path: "backend/.env" });

module.exports = {
  "smtp": {
    "service": process.env.SMTP_SERVICE,
    "host": process.env.SMTP_HOST,
    "port": process.env.SMTP_PORT,
    "auth": {
      "user": process.env.SMTP_MAIL,
      "pass": process.env.SMTP_PASS
    },
    "apps": {
      "gfolio": {
        "auth": {
          "user": process.env.SMTP_MAIL,
          "pass": process.env.SMTP_PASS
        },
      },
      "gdrea": {
        "auth": {
          "user": process.env.SMTP_MAIL,
          "pass": process.env.SMTP_PASS
        },
      },
      "jbird": {
        "auth": {
          "user": process.env.SMTP_MAIL,
          "pass": process.env.SMTP_PASS
        },
      },
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