'use strict'
var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HOST: '"http://a546542.eastasia.cloudapp.azure.com:8000"',
  chatHost: '"ws://a546542.eastasia.cloudapp.azure.com:8003"',
  chatApi: '"http://a546542.eastasia.cloudapp.azure.com:8003"'
})
