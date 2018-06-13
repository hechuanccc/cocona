require('babel-register')
var config = require('../../config')

// http://nightwatchjs.org/gettingstarted#settings-file
module.exports = {
  src_folders: ['test/e2e/specs'],
  output_folder: 'test/e2e/reports',
  custom_assertions_path: ['test/e2e/custom-assertions'],
  page_objects_path: './test/e2e/page_objects',

  selenium: {
    start_process: true,
    server_path: require('selenium-server').path,
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': require('chromedriver').path
    }
  },

  test_settings: {
    default: {
      launch_url: 'http://localhost:' + (process.env.PORT || config.dev.port),
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true
    },

    local: {
      launch_url: 'http://localhost:' + (process.env.PORT || config.dev.port),
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },

    staging: {
      launch_url: 'http://rico-st8ging.azureedge.net',
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    }
  }
}
