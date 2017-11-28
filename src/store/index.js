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
        logined: ''
      },
      loginDialogVisible: false,
      games: [],
      categories: [],
      customPlayGroups: [
        {
          code: 'cqlf_pg_wc_wc',
          options: Array.from(Array(20).keys()).map(item => item + 1),
          cols: 5
        }
      ]
    },
    actions,
    mutations,
    getters
  })
}
