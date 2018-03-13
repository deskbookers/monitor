/* eslint-disable no-console */
const moment = require('moment')
const targets = require('./target')
const email = require('./helper/email')
const db = require('./helper/db')

const LAST_TIME_UNHEALTHY = moment().subtract(15, 'minute').format('x')
const TIME_TO_PURGE = moment().subtract(1, 'hour').format('x')

async function main () {
  const asserts = await Promise.all(
    targets.all().map(b => b.process())
  )

  db.save(asserts.filter(x => !x.result))

  const storedErrors = db.getMultipleTimesUnhealthy(LAST_TIME_UNHEALTHY)

  if (storedErrors && storedErrors.length) {
    console.log('Errors found! sending email...')

    const descriptions = storedErrors.map(prettyError)
    console.log(descriptions.join('\n'))

    const subject = 'There is something wrong! 😱😱😱'
    const { response } = await email.send(subject, descriptions)
    console.log(`Response from mail: ${response}`)
  } else {
    console.log('No errors found!\nRan at: ', new Date())
  }

  console.log('Purging old logs!')
  db.purgeOldLogs(TIME_TO_PURGE)

  console.log('Monitor process finished!')
}

const prettyError = target =>
  `Error on ${target.target}:\n${target.errors.map(error =>
    `${moment.unix(error.date).format()} ` +
    `${error.message} ` +
    `${JSON.stringify(error.context.data) || ''}`
  ).join('\n')}`

main()
