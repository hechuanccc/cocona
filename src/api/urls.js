'use strict'
const config = require('../../config')
const env = process.env.NODE_ENV === 'development' ? config.dev.env : config.build.env
const host = env.HOST.replace(/"/g, '')
const prefix = host + '/member'

export default {
  domain: host,
  login: prefix + '/login/',
  refresh_token: prefix + '/login/refresh/',
  verification: prefix + '/verification_code/',
  logout: host + '/logout/'
}
