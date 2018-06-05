// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage
module.exports = {
  'Login Test': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('#app', 5000)
      .assert.elementPresent('#home')
      .click('#login-link')
      .waitForElementVisible('#username', 3000)
      .setValue('#username', 'eeeeee')
      .setValue('#password', 'Aa111111')
      .click('.el-button.login-btn.el-button--primary.el-button--small')
      .waitForElementVisible('.top-bar .username', 3000)
      .assert.containsText('.top-bar .username', '欢迎, eeeeee')
      .end()
  }
}
