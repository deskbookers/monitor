const nodemailer = require('nodemailer')

const {
  SMTP_HOST,
  SMTP_PORT,
  EMAIL_FROM,
  EMAIL_TO
} = process.env

let transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT
})

async function send (subject, errors) {
  let options = {
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject,
    text: errors.join('\n'),
    html: errors.join('<br />')
  }

  await transporter.sendMail(options)
}

module.exports = { send }
