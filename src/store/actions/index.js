import _ from 'lodash'
import axios from 'axios'
import Vue from 'vue'

import * as types from '../mutations/mutation-types'

import {
  login,
  register,
  fetchUser,
  updateUser,
  fetchGames,
  fetchCategories
} from '../../api'

export default {
  login: ({ commit, state }, { user }) => {
    return login(user).then(res => {
      let data = res.data
      let expires = new Date(data.expires_in)
      if (data.access_token && data.refresh_token) {
        Vue.cookie.set('access_token', data.access_token, {
          expires: expires
        })
        Vue.cookie.set('refresh_token', data.refresh_token, {
          expires: expires
        })
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
  register: ({ commit, state }, { user }) => {
    return register(user).then(res => {
      return Promise.resolve(res.data)
    }, error => Promise.reject(error))
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
      }
      return Promise.resolve(res)
    }, error => {
      console.log(error)
      commit(types.SET_USER, {
        user: {
          logined: false
        }
      })
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
  fetchCategories: ({commit, state}, gameId) => {
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
  }
}
