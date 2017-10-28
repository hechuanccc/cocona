import axios from 'axios'
import Vue from 'vue'

import * as types from '../mutations/mutation-types'

import {
  login,
  fetchUser,
  fetchGames
} from '../../api'

export default {
  login: ({ commit, state }, { user }) => {
    return login(user).then(res => {
      let data = res.data
      let expires = new Date(data.expires_in)
      if (data.access_token && data.refresh_token) {
        Vue.cookie.set('access_token', data.access_token, expires.toGMTString())
        Vue.cookie.set('refresh_token', data.refresh_token, expires.toGMTString())
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token
      }
      commit(types.SET_USER, {
        user: {
          logined: true
        }
      })
      return Promise.resolve(res.data)
    }, error => Promise.reject(error))
  },
  fetchUser: ({ commit, state }) => {
    return fetchUser().then(res => {
      if (res.length > 0) {
        commit(types.SET_USER, {
          user: res[0]
        })
      }
    })
  },
  fetchGames: ({ commit, state }) => {
    return fetchGames().then(res => {
      console.log(res)
      commit(types.SET_GAMES, {
        games: res
      })
    })
  }
}
