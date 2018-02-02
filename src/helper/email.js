const nodemailer = require('nodemailer')

const {
  EMAIL_SMTP_HOST,
  EMAIL_SMTP_PORT,
  EMAIL_SMTP_USERNAME,
  EMAIL_SMTP_PASSWORD,
  EMAIL_SMTP_TLS,

  EMAIL_FROM,
  EMAIL_TO
} = process.env

let transporter = nodemailer.createTransport({
  host: EMAIL_SMTP_HOST,
  port: EMAIL_SMTP_PORT,
  secure: (EMAIL_SMTP_TLS === 'true'),
  auth: {
    user: EMAIL_SMTP_USERNAME,
    pass: EMAIL_SMTP_PASSWORD
  }
})

async function send (subject, errors) {
  try {
    let options = {
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject,
      text: errors.join('\n'),
      html: errors.join('<br />')
    }

    const res = await transporter.sendMail(options)
    return { response: res.response }
  } catch (exception) {
    return { response: exception }
  }
}

module.exports = { send }
