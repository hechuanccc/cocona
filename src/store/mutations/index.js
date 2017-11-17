import _ from 'lodash'
import * as types from './mutation-types'

export default {
  [types.SET_USER]: (state, { user }) => {
    state.user = {
      ...state.user,
      ...user
    }
  },
  [types.RESET_USER]: (state) => {
    state.user = {
      logined: false
    }
  },
  [types.SHOW_LOGINDIALOG]: (state) => {
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
  }
}
