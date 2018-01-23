const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
  host: 'localhost',
  port: 1025,
  secure: false
})

async function send (subject, body) {
  let options = {
    from: '"Monitor script 👻" <noreply@monitor.deskbookers.com>',
    to: 'f.berrocal@deskbookers.com',
    subject,
    text: body,
    html: body
  }

  const response = await transporter.sendMail(options)
}

module.exports = {
  send
}
