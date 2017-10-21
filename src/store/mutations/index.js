import * as types from './mutation-types'

export default {
  [types.SET_USER]: (state, { user }) => {
    console.log(user)
    state.user = {
      ...state.user,
      ...user
    }
  }
}
