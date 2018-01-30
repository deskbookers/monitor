const fetch = require('node-fetch')

const textFetchBuilder = target =>
  fetchBuilder(async r => r.text(), target)

const jsonFetchBuilder = target =>
  fetchBuilder(async r => r.json(), target)

function fetchBuilder (extractFun, target) {
  return async options => {
    const request = await fetch(target, options)
    const data = await extractFun(request)

    return {
      data: data.data || data, // shorten response
      http: {
        status: request.status,
        text: request.statusText
      }
    }
  }
}

module.exports = {
  jsonFetchBuilder,
  textFetchBuilder
}
