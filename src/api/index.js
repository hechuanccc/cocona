import axios from 'axios'
import qs from 'qs'
import urls from './urls'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
let axiosChat = axios.create()

export function login (user) {
  return axios.post(urls.login, qs.stringify(user))
}
export function logout () {
  return axios.post(urls.logout)
}

export function agentRegister (userInfo) {
  return axios.post(urls.agent_register, qs.stringify(userInfo))
}

export function getCaptcha () {
  return axios.get(urls.agent_captcha)
}

export function getBanner () {
  return axios.get(urls.banner)
}

export function getAnnouncements () {
  return axios.get(urls.announcements)
}

export function gethomePage () {
  return axios.get(`${urls.website}home-page/`)
}

export function getDescription () {
  return axios.get(`${urls.website}descriptions/`)
}
export function getPromotions () {
  return axios.get(urls.promotions)
}

export function register (user) {
  return axios.post(urls.register, qs.stringify(user))
}

export function checkUserName (username) {
  return axios.get(urls.check_username, { params: { username: username } })
}
export function checkAgentName (username) {
  return axios.get(urls.check_agentname, { params: { username: username } })
}

export function fetchGames () {
  return axios.get(urls.games)
}

export function fetchUser () {
  return axios.get(urls.user)
}
export function updateUser (user, id) {
  return axios.put(`${urls.user}${user.id ? user.id : id}/`, user)
}

export function updatePassword (password) {
  return axios.post(urls.password, qs.stringify(password))
}

export function updateWithdrawPassword (withdrawPassword) {
  return axios.post(urls.withdraw_password, qs.stringify(withdrawPassword))
}

export function fetchCategories (gameId) {
  return axios.get(`${urls.category}?&game=${gameId}`)
}

export function fetchPlaygroup (categoryId) {
  return axios.get(`${urls.playgroup}?&category=${categoryId}`)
}

export function fetchSchedule (gameId) {
  return axios.get(`${urls.schedule}?&game=${gameId}`)
}

export function fetchCaptcha () {
  return axios.get(urls.verification).then(data => {
    data.captcha_src = urls.domain + data.captcha_src
    return data
  })
}

export function fetchPaymentType () {
  return axios.get(urls.paymentType)
}

export function placeBet (data) {
  return axios.post(urls.betrecord, data, {
    'Content-Type': 'application/json'
  })
}

export function fetchTransactionRecord (option) {
  return axios.get(`${urls.transaction_record}?transaction_type=${option.transaction_type}&limit=10&offset=${option.offset}`)
}

export function fetchBet (gameData) {
  return axios.get(`${urls.betrecord}?game=${gameData.gameId}&schedule=${gameData.scheduleId}&status=ongoing`)
}

export function fetchWinBet () {
  return axios.get(`${urls.betrecord}?status=win&latest=1`)
}

export function fetchBetHistory (option) {
  let url = `${urls.betrecord}?limit=20`
  Object.keys(option).forEach(key => {
    if (option[key]) {
      url += `&${key}=${option[key]}`
    }
  })
  return axios.get(url)
}

export function getToken (oldToken) {
  if (!oldToken) {
    return
  }
  return axios.post(urls.refresh_token, {
    refresh_token: oldToken
  }).then(
    res => {
      axios.defaults.withCredentials = true
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.access_token
      return res
    })
}
export function fetchBank () {
  return axios.get(urls.bank)
}
export function fetchGameResult (gameId) {
  return axios.get(`${urls.game_result}?game=${gameId}&opt_expand=next`)
}
export function withdraw (info) {
  return axios.post(urls.withdraw, qs.stringify(info))
}

export function fetchRemitpayee () {
  return axios.get(urls.remitpayee)
}

export function remit (info) {
  return axios.post(urls.remit, info, {
    'Content-Type': 'application/json'
  })
}

export function fetchMessages (option) {
  let url = `${urls.messages}?limit=10`
  Object.keys(option).forEach(key => {
    if (option[key] || option[key] === 0) {
      url += `&${key}=${option[key]}`
    }
  })
  return axios.get(url)
}

export function fetchMessageCount () {
  return axios.get(urls.messageCount)
}

export function readMessage (ids) {
  return axios.post(urls.readMessage,
    { ids: ids },
    { 'Content-Type': 'application/json' })
}

export function fetchHistory (option) {
  let url = `${urls.gamehistory}?game_code=${option.game_code}&limit=30`
  Object.keys(option).forEach(key => {
    if (option[key]) {
      url += `&${key}=${option[key]}`
    }
  })
  return axios.get(url)
}

export function fetchPlaySetting (id) {
  return axios.get(`${urls.playSetting}?game=${id}`)
}

export function fetchStatistic (code) {
  return axios.get(`${urls.statistic}?game_code=${code}`)
}

export function fetchTransactionStatus (id) {
  return axios.get(`${urls.payment}?transaction_ids=${id}`)
}

export function fetchArticle () {
  return axios.get(urls.article)
}

export function fetchChatEmoji () {
  return axiosChat.get(`${urls.chatEmoji}`)
}

export function sendImgToChat (data) {
  return axios.post(`${urls.sendImgToChat}`, data)
}

export function banChatUser (id, data) {
  return axiosChat.put(`${urls.apiRoom}/${id}/`,
    {
      action: 'banned',
      user: data.user,
      banned_time: data.banned_time
    })
}

export function unbanChatUser (id, data) {
  return axiosChat.put(`${urls.apiRoom}/${id}/`,
    {
      action: 'unbanned',
      user: data.user,
      banned_time: data.banned_time
    })
}

export function blockChatUser (id, data) {
  return axiosChat.put(`${urls.apiRoom}/${id}/`,
    {
      action: 'block',
      user: data.user,
      block_time: 60
    })
}
export function unblockChatUser (id, data) {
  return axiosChat.put(`${urls.apiRoom}/${id}/`,
    {
      action: 'unblock',
      user: data.user
    })
}

export function getChatUser (id) {
  return axiosChat.get(`${urls.apiRoom}/${id}/`)
}
