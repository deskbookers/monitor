const { get } = require('lodash')

const success = (context = {}) => ({
  context,
  result: true,
  message: null
})

const fail = (message, context = {}) => ({
  message,
  context,
  result: false
})

class AssertBuilder {
  constructor (target, get) {
    this.get = get
    this.target = target
    this.asserts = []
  }

  assertNoTimeout (timeout) {
    this.asserts.push(async () => {
      try {
        const context = await this.get({timeout})
        return success(context)
      } catch (ex) {
        return fail('Timeout reach for target')
      }
    })

    return this
  }

  isHttpStatusOk () {
    this.asserts.push(ctx => {
      const status = get(ctx, 'http.status', -1)

      return (status >= 200 && status < 300)
        ? success()
        : fail(`Unexpected http status code: ${status}`)
    })

    return this
  }

  isPostgresHealthy (rootKey = 'database') {
    this.asserts.push(ctx => {
      const pgNode = get(ctx.data, `${rootKey}.postgres.healthy`, false)

      return (pgNode === true)
        ? success()
        : fail('Postgres is not healthy')
    })

    return this
  }

  isRedisHealthy () {
    this.asserts.push(reply => {
      const redisNode = get(reply.data, 'cache.redis.healthy', false)

      return (redisNode === true)
        ? success()
        : fail('Redis is not healthy')
    })

    return this
  }

  async process () {
    const initial = Promise.resolve(success({ target: this.target }))

    return this.asserts.reduce(async (prevPromisse, next) => {
      let assert = await prevPromisse
      if (!assert.result) {
        return assert
      }

      const nextAssert = await next(assert.context)
      const context = {...assert.context, ...nextAssert.context}
      if (nextAssert.result) {
        return success(context)
      }

      return fail(nextAssert.message, context)
    }, initial)
  }
}

module.exports = AssertBuilder
