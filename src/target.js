const AssertBuilder = require('./AssertBuilder')
const {
  jsonFetchBuilder,
  textFetchBuilder
} = require('./helper/fetch-builder')

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
    getDefaultBuilder(process.env.DNS_AVAILABILITY_TARGET),
    getDefaultBuilder(process.env.DNS_FEATURES_TARGET),
    getDefaultBuilder(process.env.DNS_NOTIFICATIONS_TARGET),

    getBuilder(process.env.DNS_PAYMENTS_TARGET)
      .isPostgresHealthy('authentication')
      .isRedisHealthy(),

    getBuilder(process.env.DNS_REPORTS_TARGET)
      .isPostgresHealthy()
      .isPostgresHealthy('authentication'),

    getBuilder(process.env.DNS_SEARCH_TARGET)
      .isPostgresHealthy(),

    getTextReqBuilder(process.env.DNS_PORTAL_TARGET),

    getTextReqBuilder(process.env.DNS_2CNNCT_TARGET)
  ]
}

module.exports = { all }
