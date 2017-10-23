import * as types from './mutation-types'

export default {
  [types.SET_USER]: (state, { user }) => {
    state.user = {
      ...state.user,
      ...user
    }
  },
  [types.SET_GAMES]: (state, { games }) => {
    state.games = games
  }
}
