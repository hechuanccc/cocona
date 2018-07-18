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
  fetchCategories,
  fetchChatUserInfo,
  getRoomsStatus,
  fetchPaymentType
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
      if (error.code === 9011 || error.code === 9013) {
        axios.defaults.withCredentials = true
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
        let user = res[0]
        if (user.account_type) {
          if (!state.user.chatInfo) {
            fetchChatUserInfo(user.username).then((info) => {
              let chatInfo = info
              commit(types.SET_USER, {
                user: {
                  chatInfo
                }
              })
            }).catch(() => {})
          }
          if (!state.user.onlinePaymentTypes) {
            fetchPaymentType().then(datas => {
              commit(types.SET_USER, {
                user: {
                  onlinePaymentTypes: datas
                }
              })
            }).catch(() => {
              commit(types.SET_USER, {
                user: {
                  onlinePaymentTypes: []
                }
              })
            })
          }
        }
        commit(types.SET_USER, {
          user: {
            ...user,
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
      let i = -1
      let len = res.length
      while (++i < len) {
        let currentGame = res[i]
        if (currentGame.game_type === 1) {
          fetchCategories(currentGame.id).then(results => {
            const categories = []
            let formatting = results[0].formatting
            const categoryMap = {}
            currentGame.matches.forEach(match => {
              let date = Vue.moment(match.start_time)
              let id = date.format('YYYY-MM-DD')
              let displayName = date.format('MM月DD日')
              let category
              if (categoryMap[date]) {
                category = categoryMap[date]
              } else {
                category = {
                  originId: results[0].id,
                  id: id,
                  display_name: displayName,
                  matches: [],
                  game_id: currentGame.id + '',
                  formatting: formatting
                }
                categoryMap[date] = category
                categories.push(category)
              }
              category.matches.push(match)
            })
            if (categories.length > 0) {
              commit(types.SET_CATEGORIES, {
                categories
              })
            }
          })
          break
        }
      }
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
  },
  setCurrentGameResult: ({ commit }, result) => {
    commit(types.SET_CURRENTGAME_RESULT, result)
  },
  openTrialVerifyDialog: ({ commit, state }) => {
    commit(types.OPEN_VERIFICATION_DIALOG)
  },
  closeTrialVerifyDialog: ({ commit, state }) => {
    commit(types.CLOSE_VERIFICATION_DIALOG)
  },
  updateIsChatting: ({ commit, state }, signal) => {
    commit(types.UPDATE_ISCHATTING, signal)
  },
  collectEnvelope: ({ commit, state }, data) => {
    commit(types.COLLECT_ENVELOPE, data)
  },
  updateCurrentChatRoom: ({ commit, state }, room) => {
    commit(types.UPDATE_CURRENTCHATROOM, room)
  },
  setRoomsStatus: ({ commit, state }) => {
    let statusMap = {}
    getRoomsStatus().then((res) => {
      let roomsStatus = res.data.data
      _.each(roomsStatus, (room) => {
        statusMap[room.id] = room
      })
      commit(types.SET_ROOMSSTATUS, statusMap)
    }).catch(() => {})
  },
  updateRoomStatus: ({commit, state}, roomId, status) => {
    commit(types.SET_ROOMSSTATUS, roomId, status)
  },
  updateUnsettled: ({ commit, state }, value) => {
    commit(types.UPDATE_UNSETTLED, value)
  }
}
