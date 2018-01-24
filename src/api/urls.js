'use strict'
const config = require('../../config')
const env = process.env.NODE_ENV === 'development' ? config.dev.env : config.build.env
const host = env.HOST.replace(/"/g, '')
const prefix = host + '/member'
const apiv1 = host + '/v1/member'
const apiChat = env.chatApi.replace(/"/g, '')
const apiRoom = apiChat + '/v1/room'

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
  playSetting: apiv1 + '/game/playset/',
  agent_register: apiv1 + '/agentapplication/',
  game_result: apiv1 + '/result/',
  promotions: apiv1 + '/promotion/',
  banner: apiv1 + '/banners/',
  website: apiv1 + '/website/',
  announcements: apiv1 + '/announcements/',
  check_username: apiv1 + '/username/',
  check_agentname: host + '/v1/checkagent/',
  payment: apiv1 + '/payment/',
  paymentType: apiv1 + '/paymenttype/?opt_expand=1&platform=0',
  betrecord: apiv1 + '/betrecord/',
  transaction_record: apiv1 + '/transaction/',
  result: '/result/',
  bank: apiv1 + '/bank/',
  withdraw: apiv1 + '/withdraw/',
  remitpayee: apiv1 + '/remitpayee/',
  remit: apiv1 + '/remit_transaction/',
  readMessage: apiv1 + '/message/read/',
  messages: apiv1 + '/messages/',
  messageCount: apiv1 + '/message/count/',
  gamehistory: apiv1 + '/history/',
  statistic: apiv1 + '/statistic/',
  chatRoomLogin: apiChat + '/chat/',
  article: apiv1 + '/website/franchising-program-page',
  chatEmoji: apiChat + '/v1/emoji/',
  sendImgToChat: host + '/v1/manage/attachment/',
  apiRoom
}
