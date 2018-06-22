// 預設使用staging 環境
// yarh run e2e --env local 可測試本機環境，須先起server
process.env.NODE_ENV = 'testing'
var opts = process.argv.slice(2)
if (opts.indexOf('--config') === -1) {
  opts = opts.concat(['--config', 'test/e2e/nightwatch.conf.js'])
}
if (opts.indexOf('--env') === -1) {
  opts = opts.concat(['--env', 'staging'])
}
var spawn = require('cross-spawn')
spawn('./node_modules/.bin/nightwatch', opts, { stdio: 'inherit' })
