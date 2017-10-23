import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      user: {
        logined: !!Vue.cookie.get('access_token')
      },
      games: []
    },
    actions,
    mutations,
    getters
  })
}
