'use strict'
const config = require('../../config')
const env = process.env.NODE_ENV === 'development' ? config.dev.env : config.build.env
const host = env.HOST.replace(/"/g, '')
const prefix = host + '/member'
const apiv1 = host + '/v1/member'
const apiManage = host + '/v1/manage'

export default {
  domain: host,
  login: prefix + '/login/',
  user: apiv1 + '/profile/',
  refresh_token: prefix + '/login/refresh/',
  verification: prefix + '/verification_code/',
  logout: host + '/logout/',
  games: apiv1 + '/game/',
  category: apiv1 + '/game/category/',
  playgroup: apiv1 + '/game/playgroup/',
  schedule: apiv1 + '/game/schedule/',
  agent_register: apiManage + '/agentapplication/',
  agent_captcha: apiv1 + '/verification_code/'
}
