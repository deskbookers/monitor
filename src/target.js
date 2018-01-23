const { jsonFetchBuilder, textFetchBuilder } = require('./helper/fetch-builder')

const AssertBuilder = require('./check')
const TIMEOUT_SECONDS = 5000

const getTextReqBuilder = target =>
  new AssertBuilder(target, textFetchBuilder(target))
    .assertNoTimeout(TIMEOUT_SECONDS)
    .isHttpStatusOk()

const getBuilder = target =>
  new AssertBuilder(target, jsonFetchBuilder(target))
    .assertNoTimeout(TIMEOUT_SECONDS)
    .isHttpStatusOk()

const getDefaultBuilder = target =>
  getBuilder(target)
    .isPostgresHealthy()
    .isRedisHealthy()

function all () {
  return [
    getDefaultBuilder('http://localhost:3007/status'),
    getDefaultBuilder('http://localhost:3017/status'),
    getDefaultBuilder('http://localhost:3006/status'),

    getBuilder('http://localhost:3100/status')
      .isPostgresHealthy('authentication')
      .isRedisHealthy(),

    getBuilder('http://localhost:3031/status')
      .isPostgresHealthy()
      .isPostgresHealthy('authentication'),

    getBuilder('http://localhost:3012/status')
      .isPostgresHealthy(),

    getTextReqBuilder('http://deskbookers.local'),

    getTextReqBuilder('http://2cnnct.deskbookers.local')
  ]
}

module.exports = { all }
