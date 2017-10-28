import axios from 'axios'
import qs from 'qs'
import urls from './urls'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export function login (user) {
  return axios.post(urls.login, qs.stringify(user))
}

export function fetchGames () {
  return axios.get(urls.games).then(res => res.data)
}

export function fetchUser () {
  return axios.get(urls.user).then(res => res.data)
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
