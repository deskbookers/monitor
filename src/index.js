/* eslint-disable no-console */

const targets = require('./target')
const email = require('./helper/email')

async function main () {
  const asserts = await Promise.all(
    targets.all().map(b => b.process())
  )

  const errors = asserts
    .filter(x => !x.result)

  if (errors && errors.length) {
    console.log('Errors found! sending email...')

    const descriptions = errors.map(prettyError)
    console.log(descriptions.join('\n'))

    const subject = 'There is something wrong! 😱😱😱'
    const { response } = await email.send(subject, descriptions)
    console.log(`Response from mail: ${response}`)
  } else {
    console.log('No errors found!\nRan at: ', new Date())
  }

  console.log('Monitor process finished!')
}

const prettyError = err =>
  `Error on ${err.context.target}: ${err.message}
   ${JSON.stringify(err.context.data)}\n`

main()
