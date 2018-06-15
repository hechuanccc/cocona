module.exports = {
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
    // browser.end()
  },
  'init page Test': function (browser) {
    browser
    .waitForElementVisible('.clickable', 2000)
    .expect.element('.clickable').to.be.visible
  },
  'change page Test': function (browser) {
    browser
    .click('li.game-menu-item:nth-child(2)')
    .waitForElementVisible('.clickable', 2000)
    .expect.element('.clickable').to.be.visible
  },
  'click the same page Test': function (browser) {
    browser
    .click('li.game-menu-item:nth-child(2)')
    .waitForElementVisible('.clickable', 2000)
    .expect.element('.clickable').to.be.visible
  },
  'change twice page Test': function (browser) {
    browser
    .click('li.game-menu-item:nth-child(2)')
    .click('li.game-menu-item:nth-child(3)')
    .click('li.game-menu-item:nth-child(2)')
    .waitForElementVisible('.clickable', 2000)
    .expect.element('.clickable').to.be.visible
  },
  'change multi page Test': function (browser) {
    browser
    .click('li.game-menu-item:nth-child(2)')
    .click('li.game-menu-item:nth-child(4)')
    .click('li.game-menu-item:nth-child(3)')
    .click('li.game-menu-item:nth-child(1)')
    .click('li.game-menu-item:nth-child(3)')
    .waitForElementVisible('.clickable', 2000)
    .expect.element('.clickable').to.be.visible
  },
  'eneter by url Test': function (browser) {
    browser
    .url(browser.launch_url + '/#/game')
    .waitForElementVisible('.clickable', 2000)
    .expect.element('.clickable').to.be.visible
  }
}
