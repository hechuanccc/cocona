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
    Vue.cookie.delete('access_token')
    Vue.cookie.delete('refresh_token')
  },
  [types.SET_SYSTEM_CONFIG]: (state, data) => {
    state.systemConfig = data
  },
  [types.SHOW_LOGIN_DIALOG]: (state) => {
    state.loginDialogVisible = true
  },
  [types.CLOSE_LOGINDIALOG]: (state) => {
    state.loginDialogVisible = false
  },
  [types.OPEN_BETRECORD_DIALOG]: (state) => {
    state.betRecordDialogVisible = true
  },
  [types.CLOSE_BETRECORD_DIALOG]: (state) => {
    state.betRecordDialogVisible = false
  },
  [types.SET_GAMES]: (state, { games }) => {
    state.games = games
  },
  [types.SET_CATEGORIES]: (state, { categories }) => {
    state.categories = _.xorBy(state.categories, categories, 'id').filter(item => !!item)
  },
  [types.START_LOADING]: (state, loading) => {
    state.loading = true
  },
  [types.END_LOADING]: (state) => {
    state.loading = false
  },
  [types.SET_MESSAGE_COUNT]: (state, count) => {
    state.messageCount = count
  },
  [types.RESET_MESSAGE_COUNT]: (state, count) => {
    state.messageCount = 0
  }
}
