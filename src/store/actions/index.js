import _ from 'lodash'
import axios from 'axios'
import Vue from 'vue'

import * as types from '../mutations/mutation-types'

import {
  login,
  logout,
  fetchUser,
  updateUser,
  fetchGames,
  fetchCategories
} from '../../api'

export default {
  login: ({ commit, state }, { user }) => {
    commit('START_LOADING')
    return login(user).then(res => {
      let expires = new Date(res.expires_in)
      if (res.access_token && res.refresh_token) {
        Vue.cookie.set('access_token', res.access_token, {
          expires: expires
        })
        Vue.cookie.set('refresh_token', res.refresh_token, {
          expires: expires
        })
        axios.defaults.withCredentials = true
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.access_token
      }
      commit(types.SET_USER, {
        user: {
          logined: true
        }
      })
      commit('END_LOADING')
      return Promise.resolve(res)
    }, error => {
      if (error.code === 9011) {
        Vue.cookie.set('sessionid', error.data.sessionid)
      }
      commit('END_LOADING')
      return Promise.reject(error)
    })
  },
  logout: ({ commit, state }) => {
    return logout().then(
      res => {
        Vue.cookie.delete('access_token')
        Vue.cookie.delete('refresh_token')
        commit(types.RESET_MESSAGE_COUNT)
        commit(types.RESET_USER)
      },
      errRes => Promise.reject(errRes)
    )
  },
  fetchUser: ({ commit, state }) => {
    return fetchUser().then(res => {
      if (res.length > 0) {
        commit(types.SET_USER, {
          user: {
            ...res[0],
            logined: true
          }
        })
        return Promise.resolve(res[0])
      } else {
        return Promise.reject(res[0])
      }
    }, error => {
      commit(types.SET_USER, {
        user: {
          logined: false
        }
      })
      return Promise.reject(error)
    })
  },
  updateUser: ({ commit, state }, updateData) => {
    return updateUser(updateData).then(data => {
      commit(types.SET_USER, {
        user: data
      })
    })
  },
  fetchGames: ({ commit, state }) => {
    return fetchGames().then(res => {
      commit(types.SET_GAMES, {
        games: res
      })
    })
  },
  fetchCategories: ({ commit, state }, gameId) => {
    return fetchCategories(gameId).then(res => {
      const categories = _.map(res, item => {
        item['game_id'] = gameId
        return item
      })
      commit(types.SET_CATEGORIES, {
        categories
      })
      return categories
    })
  },
  openBetRecordDialog: ({ commit, state }) => {
    commit(types.OPEN_BETRECORD_DIALOG)
  },
  closeBetRecordDialog: ({ commit, state }) => {
    commit(types.CLOSE_BETRECORD_DIALOG)
  },
  startLoading: ({ commit }) => {
    commit(types.START_LOADING)
  },
  endLoading: ({ commit }) => {
    commit(types.END_LOADING)
  },
  setMessageCount: ({ commit }, count) => {
    commit(types.SET_MESSAGE_COUNT, count)
  },
  setSystemConfig: ({ commit }, data) => {
    commit(types.SET_SYSTEM_CONFIG, data)
  }
}
