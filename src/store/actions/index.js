import axios from 'axios'
import Vue from 'vue'

import {
  login
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
      commit('SET_USER', {
        user: {
          logined: true
        }
      })
      return Promise.resolve(res.data)
    }, error => Promise.reject(error))
  }
}
