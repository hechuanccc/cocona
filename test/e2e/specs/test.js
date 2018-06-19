require('../page_objects/bet.js')
// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
module.exports = {
  '@disabled': true,
  before: function (browser) {
    browser
      .url(browser.launch_url)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('#home')
      .click('#login-link')
      .waitForElementVisible('#username', 3000)
      .setValue('#username', 'eeeeee')
      .setValue('#password', 'Aa111111')
      .click('.el-button.login-btn.el-button--primary.el-button--small')
      .waitForElementVisible('.top-bar .username', 3000)
      .assert.containsText('.top-bar .username', '欢迎, eeeeee')
      .pause(1000)
  },
  after: function (browser) {
    browser.end()
  },
  'bet Test': function (browser) {
    const bet = browser.page.bet()
    bet.navigate()
    .waitForElementNotPresent('@disabledBetButton', 3000)
    .clearValue('@amountInput')
    .setValue('@amountInput', 1)
    .selectAll()
    bet.click('@betButton')
    .waitForElementVisible('@dialog', 1000)
    .expect.element('@dialog').to.be.visible
    bet.click('@confirmButton')
    .waitForElementVisible('@alertSuccess', 2000)
    .expect.element('@alertSuccess').to.be.visible
  }
}
