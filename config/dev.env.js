'use strict'
var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HOST: '"http://2689df54-0e1b-4a12-91ef-b853a47bab34.node.dockerapp.io:8000"'
})
