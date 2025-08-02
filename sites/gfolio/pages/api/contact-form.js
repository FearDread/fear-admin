/** *************************************************************
 * Any file inside the folder pages/api is mapped to /api/* and *
 * will be treated as an API endpoint instead of a page.        *
 ****************************************************************/

import axios from "axios";
import { config } from '../../theme.config'

const API_BASE_URL = process.env.API_BASE_URL;
const contact = async (req, res) => {
  const { email } = req.body
  const { recipient, subject } = config.contactForm || {}

  if (!email) return res.status(400).json({ error: 'Missing email address. Please provide a correct email address.' });

  const getHtmlBody = (body) => {
    return Object.entries(body).map(([key, value]) => {
      if (typeof value === 'string') {
        return `<b>${key}</b>: ${value}`
      }
      if (typeof value === 'boolean') {
        return value === true ? key : false
      }
      if (typeof value === 'object') {
        return `<b>${key}</b>: ${getHtmlBody(value)?.filter(Boolean).join(', ')}`
      }
      return html
    })
  }

  let html = getHtmlBody(req.body)
  if (Array.isArray(html)) {
    html = html.join('<br />')
  }

  await axios.post(API_BASE_URL + "mail/project", {
    to: recipient, // Your email where you'll receive emails
    from: recipient, // your website email address here
    replyTo: email,
    subject: req.body.subject || subject || 'Contact form entry',
    html,
  })
  .then((response) => { return res.status(200).json({response, success: true})})
  .catch((error) => { return res.status(400).json({error, success: false})})

}

export default contact
