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
    console.log('Errors found! sendind emai...')
    console.log(errors.join('\n'))
    await email.send('There is something wrong! 😱😱😱 ', errors)
  } else {
    console.log('No errors found!')
  }

  console.log('Monitor process finished!')
}

main()
