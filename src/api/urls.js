'use strict'
const config = require('../../config')
const env = process.env.NODE_ENV === 'development' ? config.dev.env : config.build.env
const host = env.HOST.replace(/"/g, '')
const prefix = host + '/member'
const apiv1 = host + '/api/v1.0/member'

export default {
  domain: host,
  login: prefix + '/login/',
  user: apiv1 + '/profile/',
  refresh_token: prefix + '/login/refresh/',
  verification: prefix + '/verification_code/',
  logout: host + '/logout/',
  games: apiv1 + '/game/lottery/',
  plays: apiv1 + '/game/play/'
}
