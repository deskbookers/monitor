const targets = require('./target')
const email = require('./helper/email')

async function main () {
  const asserts = await Promise.all(
    targets.all().map(b => b.process())
  )

  const errors = asserts
    .filter(x => !x.result)
    .map(err => `Error on ${err.context.target}: ${err.message}`)

  console.log(errors)

  if (errors && errors.length) {
    const body = errors.join('\n')
    await email.send('There is something wrong! 😱😱😱 ', body)
  }
}

main()
