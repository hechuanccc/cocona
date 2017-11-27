import axios from 'axios'
import qs from 'qs'
import urls from './urls'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

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
  return axios.get(urls.homePage)
}
export function getPromotions () {
  return axios.get(urls.promotions).then(res => res.data)
}

export function register (user) {
  return axios.post(urls.register, qs.stringify(user))
}

export function checkUserName (username) {
  return axios.get(urls.check_username, { params: { username: username } }).then(res => res.data)
}

export function fetchGames () {
  return axios.get(urls.games).then(res => res.data)
}

export function fetchUser () {
  return axios.get(urls.user).then(res => res.data)
}
export function updateUser (user) {
  return axios.put(`${urls.user}${user.id}/`, user).then(res => res.data)
}

export function updatePassword (password) {
  return axios.post(urls.password, qs.stringify(password)).then(res => res.data)
}

export function updateWithdrawPassword (withdrawPassword) {
  return axios.post(urls.withdraw_password, qs.stringify(withdrawPassword)).then(res => res.data)
}

export function fetchCategories (gameId) {
  return axios.get(`${urls.category}?&game=${gameId}`).then(res => res.data)
}

export function fetchPlaygroup (categoryId) {
  return axios.get(`${urls.playgroup}?&category=${categoryId}`).then(res => res.data)
}

export function fetchSchedule (gameId) {
  return axios.get(`${urls.schedule}?&game=${gameId}`).then(res => res.data)
}

export function fetchCaptcha () {
  return axios.get(urls.verification).then(res => {
    let data = res.data
    data.captcha_src = urls.domain + data.captcha_src
    return data
  })
}

export function fetchPaymentType () {
  return axios.get(urls.paymentType).then(res => res.data)
}

export function placeBet (data) {
  return axios.post(urls.betrecord, data, {
    'Content-Type': 'application/json'
  }).then(res => res.data)
}

export function fetchTransactionRecord (type) {
  return axios.get(`${urls.transaction_record}?transaction_type=${type}`).then(res => res.data)
}

export function fetchBet (gameId) {
  return axios.get(`${urls.betrecord}?opt_expand=play&game=${gameId}&status=ongoing`).then(res => res.data.data)
}
export function fetchBetHistory () {
  return axios.get(`${urls.betrecord}?opt_expand=play`).then(res => res.data.data)
}

export function fetchResults (gameId) {
  return axios.get(`${urls.result}?game=${gameId}`).then(res => res.data)  // ?
}

export function getToken (oldToken) {
  if (!oldToken) {
    return
  }
  return axios.post(urls.refresh_token, {
    refresh_token: oldToken
  }).then(
    res => {
      axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.data.access_token
      return res.data
    }
    )
}
export function fetchBank () {
  return axios.get(urls.bank).then(res => res.data)
}
export function fetchGameResult (gameId) {
  return axios.get(`${urls.game_result}?game=${gameId}`).then(res => res.data)
}
export function withdraw (info) {
  return axios.post(urls.withdraw, qs.stringify(info))
}

export function fetchRemitpayee () {
  return axios.get(urls.remitpayee).then(res => res.data)
}

export function remit (info) {
  return axios.post(urls.remit, info, {
    'Content-Type': 'application/json'
  })
}

export function fetchMessages () {
  return axios.get(urls.messages).then(res => res.data)
}

export function readMessage (ids) {
  return axios.post(urls.readMessage,
    { ids: ids },
    { 'Content-Type': 'application/json' })
}
