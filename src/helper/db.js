const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)
db.defaults({ errors: [] }).write()

function save (errors) {
  return errors.forEach(x =>
    db.get('errors')
      .push(x)
      .write()
  )
}

function getMultipleTimesUnhealthy (lastTimeUnhealthy) {
  return db.get('errors')
    .filter(error => error.date > lastTimeUnhealthy)
    .groupBy('context.target')
    .map((values, key) => ({
      'target': key,
      'errors': values
    }))
    .filter(error => error.errors.length > 1)
    .value()
}

function purgeOldLogs (timeToPurge) {
  return db.get('errors')
    .remove(error => error.date < timeToPurge)
    .write()
}

module.exports = {
  save,
  getMultipleTimesUnhealthy,
  purgeOldLogs
}
