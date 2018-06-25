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
    browser.end()
  },
  'init page Test': function (browser) {
    browser
    .waitForElementVisible('.clickable', 5000)
    browser.expect.element('.clickable').to.be.visible
    browser.expect.element('li.game-menu-item.active').to.be.visible
    browser.expect.element('li.category-menu-item.active').to.be.visible
  },
  'change page Test': function (browser) {
    browser
    .click('li.game-menu-item:nth-child(2)')
    .waitForElementVisible('.clickable', 5000)
    browser.expect.element('.clickable').to.be.visible
    browser.expect.element('li.game-menu-item.active').to.be.visible
    browser.expect.element('li.category-menu-item.active').to.be.visible
  },
  'click the same page again Test': function (browser) {
    browser
    .click('li.game-menu-item:nth-child(2)')
    .waitForElementVisible('.clickable', 5000)
    browser.expect.element('.clickable').to.be.visible
    browser.expect.element('li.game-menu-item.active').to.be.visible
    browser.expect.element('li.category-menu-item.active').to.be.visible
  },
  'switch between two page Test': function (browser) {
    browser
    .click('li.game-menu-item:nth-child(2)')
    .click('li.game-menu-item:nth-child(3)')
    .click('li.game-menu-item:nth-child(2)')
    .waitForElementVisible('.clickable', 5000)
    browser.expect.element('.clickable').to.be.visible
    browser.expect.element('li.game-menu-item.active').to.be.visible
    browser.expect.element('li.category-menu-item.active').to.be.visible
  },
  'switch between multiple page Test': function (browser) {
    browser
    .click('li.game-menu-item:nth-child(2)')
    .click('li.game-menu-item:nth-child(4)')
    .click('li.game-menu-item:nth-child(3)')
    .click('li.game-menu-item:nth-child(1)')
    .click('li.game-menu-item:nth-child(3)')
    .waitForElementVisible('.clickable', 5000)
    browser.expect.element('.clickable').to.be.visible
    browser.expect.element('li.game-menu-item.active').to.be.visible
    browser.expect.element('li.category-menu-item.active').to.be.visible
  },
  'eneter by url Test': function (browser) {
    browser
    .url(browser.launch_url + '/#/game')
    .waitForElementVisible('.clickable', 5000)
    browser.expect.element('.clickable').to.be.visible
    browser.expect.element('li.game-menu-item.active').to.be.visible
    browser.expect.element('li.category-menu-item.active').to.be.visible
  },
  'browser history back Test': function (browser) {
    browser
    .click('li.game-menu-item:nth-child(2)')
    .click('li.game-menu-item:nth-child(3)')
    .click('li.game-menu-item:nth-child(4)')
    .back()
    .back()
    .waitForElementVisible('.clickable', 5000)
    browser.expect.element('.clickable').to.be.visible
    browser.expect.element('li.game-menu-item.active').to.be.visible
    browser.expect.element('li.category-menu-item.active').to.be.visible
  }
}
