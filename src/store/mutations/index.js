import _ from 'lodash'
import * as types from './mutation-types'
import Vue from 'vue'

export default {
  [types.SET_USER]: (state, { user }) => {
    Vue.set(state, 'user', {
      ...state.user,
      ...user
    })
  },
  [types.RESET_USER]: (state) => {
    state.user = {
      logined: false
    }
  },
  [types.SHOW_LOGIN_DIALOG]: (state) => {
    state.loginDialogVisible = true
  },
  [types.CLOSE_LOGINDIALOG]: (state) => {
    state.loginDialogVisible = false
  },
  [types.SET_GAMES]: (state, { games }) => {
    state.games = games
  },
  [types.SET_CATEGORIES]: (state, { categories }) => {
    state.categories = _.xorBy(state.categories, categories, 'id').filter(item => !!item)
  },
  [types.SET_TOKEN_PROMISE]: (state, tokenPromise) => {
    state.tokenPromise = tokenPromise
  },
  [types.CLEAR_TOKEN_PROMISE]: (state, tokenPromise) => {
    state.tokenPromise = ''
  }
}
