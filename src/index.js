/* eslint-disable no-console */

const targets = require('./target')
const email = require('./helper/email')

async function main () {
  const asserts = await Promise.all(
    targets.all().map(b => b.process())
  )

  const errors = asserts
    .filter(x => !x.result)
    .map(err => `Error on ${err.context.target}: ${err.message}`)

  if (errors && errors.length) {
    console.log('Errors found! sending email...')
    console.log(errors.join('\n'))
    const { response } = await email.send('There is something wrong! 😱😱😱', errors)
    console.log('Response from mail: ', response)
  } else {
    console.log('No errors found!\nRan at: ', new Date())
  }

  console.log('Monitor process finished!')
}

main()
