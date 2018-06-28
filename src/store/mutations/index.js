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
  [types.UPDATE_UNSETTLED]: (state, data) => {
    state.user.unsettled = data
  },
  [types.RESET_USER]: (state) => {
    state.user = {
      logined: false,
      showChatRoom: !state.user.showChatRoom
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
  [types.SET_CURRENTGAME_RESULT]: (state, result) => {
    let obj = result[0] || result
    if (obj.extra_info) {
      _.each(obj.extra_info, (value, key) => {
        _.each(value.numbers, (number, index) => {
          let cardDisplayMap = {
            number: number,
            cardType: parseInt(4 * Math.random()) + 1 // for flower color
          }

          value.numbers[index] = cardDisplayMap
        })
      })
    }

    state.currentGameResult = obj
  },
  [types.RESET_MESSAGE_COUNT]: (state, count) => {
    state.messageCount = 0
  },
  [types.OPEN_VERIFICATION_DIALOG]: (state) => {
    state.showTrialVerifyDialog = true
  },
  [types.CLOSE_VERIFICATION_DIALOG]: (state) => {
    state.showTrialVerifyDialog = false
  },
  [types.UPDATE_ISCHATTING]: (state, signal) => {
    state.isChatting = signal
  },
  [types.COLLECT_ENVELOPE]: (state, data) => {
    Vue.set(state.envelopes, data.envelope_status.id, data)
  },
  [types.UPDATE_CURRENTCHATROOM]: (state, room) => {
    state.chatRoom.currentRoom = room
  },
  [types.SET_ROOMSSTATUS]: (state, roomStatus, roomId, status) => {
    if (roomId) {
      Vue.set(state.chatRoom.roomsStatus[roomId], 'status', status)
    } else {
      Vue.set(state.chatRoom, 'roomsStatus', roomStatus)
    }
  }
}
