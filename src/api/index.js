import axios from 'axios'
import qs from 'qs'
import urls from './urls'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export function login (user) {
  return axios.post(urls.login, qs.stringify(user))
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

export function fetchPaymentTypeDetail (id) {
  return axios.get(`${urls.paymentType}?opt_expand=1`).then(res => res.data)
}

export function placeBet (data) {
  return axios.post(urls.betrecord, data, {
    'Content-Type': 'application/json'
  }).then(res => res.data)
}
