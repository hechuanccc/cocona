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
      tokenPromise: '',
      customPlayGroups: [
        {
          code: 'cqlf_pg_wc_wc',
          component: 'common',
          options: Array.from(Array(20).keys()).map(item => item + 1),
          cols: 5
        },
        {
          code: 'hkl_pg_shxiao_spczdc',
          component: 'hklPgShxiaoSpczdc',
          options: Array.from(Array(12).keys()).map(item => item + 1),
          cols: 2
        },
        {
          code: 'gd11x5_pg_seq_seq',
          component: 'gd11x5Seq',
          options: Array.from(Array(11).keys()),
          cols: 6
        },
        {
          code: 'gd11x5_pg_wc_wc',
          component: 'common',
          options: Array.from(Array(11).keys()),
          cols: 6,
          transpose: true
        },
        {
          code: 'gdklsf_pg_wc_wc',
          component: 'common',
          options: Array.from(Array(20).keys()).map(item => item + 1),
          cols: 5
        },
        {
          code: 'hkl_pg_withcode',
          component: 'common',
          options: Array.from(Array(49).keys()).map(item => item + 1),
          cols: 7
        }
      ]
    },
    actions,
    mutations,
    getters
  })
}
