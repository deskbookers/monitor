const AssertBuilder = require('./AssertBuilder')
const {
  jsonFetchBuilder,
  textFetchBuilder
} = require('./helper/fetch-builder')

const TIMEOUT_SECONDS = 5000

const {
  DNS_AVAILABILITY_TARGET,
  DNS_FEATURES_TARGET,
  DNS_NOTIFICATIONS_TARGET,
  DNS_PAYMENTS_TARGET,
  DNS_REPORTS_TARGET,
  DNS_SEARCH_TARGET,
  DNS_PORTAL_TARGET,
  DNS_2CNNCT_TARGET,
  DNS_3CNNCT_TARGET
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
    getDefaultBuilder(DNS_AVAILABILITY_TARGET),
    getDefaultBuilder(DNS_FEATURES_TARGET),
    getDefaultBuilder(DNS_NOTIFICATIONS_TARGET),

    getBuilder(DNS_PAYMENTS_TARGET)
      .isPostgresHealthy('authentication')
      .isRedisHealthy(),

    getBuilder(DNS_REPORTS_TARGET)
      .isPostgresHealthy()
      .isPostgresHealthy('authentication'),

    getBuilder(DNS_SEARCH_TARGET)
      .isPostgresHealthy(),

    getTextReqBuilder(DNS_PORTAL_TARGET),

    getTextReqBuilder(DNS_2CNNCT_TARGET),

    getTextReqBuilder(DNS_3CNNCT_TARGET)
  ]
}

module.exports = { all }
