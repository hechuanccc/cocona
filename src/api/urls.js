'use strict'
const config = require('../../config')
const env = process.env.NODE_ENV === 'development' ? config.dev.env : config.build.env
const host = env.HOST.replace(/"/g, '')
const prefix = host + '/member'
const apiv2 = host + '/v2/member'
const apiv1 = host + '/v1/member'
const apiChat = env.chatApi.replace(/"/g, '')
const apiRoom = apiChat + '/v1/member/room'

export default {
  domain: host,
  login: prefix + '/login/',
  register: apiv2 + '/register/',
  user: apiv2 + 's/', // profile -> v2/members
  password: prefix + '/password/',
  withdraw_password: prefix + '/withdraw_password/',
  refresh_token: prefix + '/login/refresh/',
  verification: apiv2 + '/verification_code/',
  smsCode: apiv2 + '/sms_verification/',
  logout: host + '/logout/',
  games: apiv2 + '/game/',
  category: apiv2 + '/game/category/',
  playgroup: apiv2 + '/game/playgroup/',
  schedule: apiv2 + '/game/schedule/',
  playSetting: apiv2 + '/game/playset/',
  agent_register: apiv2 + '/agentapplication/',
  game_result: apiv2 + '/result/',
  promotions: apiv2 + '/promotion/',
  banner: apiv2 + '/banners/',
  website: apiv2 + '/website/',
  announcements: apiv2 + '/announcements/',
  check_username: apiv2 + '/username/',
  check_agentname: host + '/v1/checkagent/',
  payment: apiv1 + '/payment/',
  paymentType: apiv2 + '/paymenttype/?opt_expand=1&platform=pc',
  betrecord: apiv2 + '/betrecord/',
  betrecordByDay: apiv2 + '/betrecord_dates/',
  transaction_record: apiv2 + '/transaction/',
  result: '/result/',
  bank: apiv2 + '/bank/',
  withdraw: apiv2 + '/withdraw/',
  remitpayee: apiv2 + '/remitpayee/',
  remit: apiv2 + '/remit_transaction/',
  readMessage: apiv2 + '/message/read/',
  messages: apiv2 + '/messages/',
  messageCount: apiv2 + '/message/count/',
  gamehistory: apiv2 + '/history/',
  statistic: apiv2 + '/statistic/',
  article: apiv2 + '/website/franchising-program-page/',
  chatEmoji: apiChat + '/v1/emoji/',
  sendImgToChat: host + '/v1/manage/attachment/',
  apiRoom,
  setCookie: host + '/set_cookie/',
  stickers: apiChat + '/v1/stickers/',
  envelope: host + '/v1/member/red_envelope/',
  chatUser: apiChat + '/v1/user/'
}
