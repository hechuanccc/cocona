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
  register: apiv1 + '/register/',
  user: apiv1 + '/profile/',
  password: prefix + '/password/',
  withdraw_password: prefix + '/withdraw_password/',
  refresh_token: prefix + '/login/refresh/',
  verification: apiv1 + '/verification_code/',
  logout: host + '/logout/',
  games: apiv1 + '/game/',
  category: apiv1 + '/game/category/',
  playgroup: apiv1 + '/game/playgroup/',
  schedule: apiv1 + '/game/schedule/',
  agent_register: apiManage + '/agentapplication/',
  promotions: apiv1 + '/promotion/',
  agent_captcha: apiv1 + '/verification_code/',
  banner: apiv1 + '/banners/',
  homePage: apiv1 + '/website/home-page/',
  announcements: apiv1 + '/announcements/',
  check_username: host + '/v1/checkmember/',
  payment: apiv1 + '/payment/',
  paymentType: apiv1 + '/paymenttype/?opt_expand=1/',
  betrecord: apiv1 + '/betrecord/'
}
