const AssertBuilder = require('./AssertBuilder')
const {
  jsonFetchBuilder,
  textFetchBuilder
} = require('./helper/fetch-builder')

const TIMEOUT_SECONDS = 5000

const {
  DNS_AVAILABILITY_API,
  DNS_FEATURES_API,
  DNS_NOTIFICATIONS_API,
  DNS_PAYMENTS_API,
  DNS_REPORTS_API,
  DNS_SEARCH_API,
  DNS_PORTAL_API,
  DNS_2CNNCT_API,
  DNS_3CNNCT_API
} = process.env

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
    getDefaultBuilder(DNS_AVAILABILITY_API),
    getDefaultBuilder(DNS_FEATURES_API),
    getDefaultBuilder(DNS_NOTIFICATIONS_API),

    getBuilder(DNS_PAYMENTS_API)
      .isPostgresHealthy('authentication')
      .isRedisHealthy(),

    getBuilder(DNS_REPORTS_API)
      .isPostgresHealthy()
      .isPostgresHealthy('authentication'),

    getBuilder(DNS_SEARCH_API)
      .isPostgresHealthy(),

    getTextReqBuilder(DNS_PORTAL_API),

    getTextReqBuilder(DNS_2CNNCT_API),

    getTextReqBuilder(DNS_3CNNCT_API)
  ]
}

module.exports = { all }
