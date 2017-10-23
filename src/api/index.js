import axios from 'axios'
import qs from 'qs'
import urls from './urls'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

export function login (user) {
  return axios.post(urls.login, qs.stringify(user))
}

export function fetchGames () {
  return axios.get(urls.games)
}

export function fetchUser () {
  return axios.get(urls.user)
}

export function fetchGamePlays (gameId) {
  return axios.get(`${urls.plays}?&game=${gameId}`)
}
