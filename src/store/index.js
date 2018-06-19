import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      logined: '',
      showChatRoom: true,
      account_type: undefined,
      chatInfo: null,
      unsettled: 0
    },
    isChatting: false,
    chatRoom: {
      defaultRoom: 100000,
      currentRoom: null,
      roomsStatus: undefined
    },
    loginDialogVisible: false,
    showTrialVerifyDialog: false,
    betRecordDialogVisible: false,
    games: [],
    categories: [],
    loading: false,
    messageCount: 0,
    envelopes: {},
    currentGameResult: null,
    customPlayGroups: [
      {
        // 重庆幸运农场 连码
        code: 'cqlf_pg_wc_wc',
        component: 'common',
        options: Array.from(Array(20).keys()).map(item => item + 1),
        cols: 5
      },
      {
        // 广东11选5 直选
        code: 'gd11x5_pg_seq_seq',
        component: 'gd11x5Seq',
        options: Array.from(Array(11).keys()),
        cols: 6
      },
      {
        // 广东11选5 连码
        code: 'gd11x5_pg_wc_wc',
        component: 'common',
        options: Array.from(Array(11).keys()),
        cols: 6,
        transpose: true
      },
      {
        // 广东快乐十分 连码
        code: 'gdklsf_pg_wc_wc',
        component: 'common',
        options: Array.from(Array(20).keys()).map(item => item + 1),
        cols: 5
      },
      {
        // 香港六合彩 合肖
        code: 'hkl_pg_shxiao_spczdc',
        component: 'hklPgShxiaoSpczdc',
        options: Array.from(Array(12).keys()).map(item => item + 1),
        cols: 2
      },
      {
        // 香港六合彩 连码
        code: 'hkl_pg_withcode',
        component: 'common',
        options: Array.from(Array(49).keys()).map(item => item + 1),
        cols: 7
      },
      {
        // 香港六合彩 二连肖
        code: 'hkl_pg_exlzdc2',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 香港六合彩 三连肖
        code: 'hkl_pg_exlzdc3',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 香港六合彩 四连肖
        code: 'hkl_pg_exlzdc4',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 香港六合彩 五连肖
        code: 'hkl_pg_exlzdc5',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 香港六合彩 二连尾
        code: 'hkl_pg_exltail2',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 香港六合彩 三连尾
        code: 'hkl_pg_exltail3',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 香港六合彩 四连尾
        code: 'hkl_pg_exltail4',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 香港六合彩 五连尾
        code: 'hkl_pg_exltail5',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 香港六合彩 自选不中
        code: 'hkl_pg_ntinfvr_num',
        component: 'hklPgNtinfvrNum',
        options: Array.from(Array(49).keys()).map(item => item + 1),
        cols: 7
      },
      {
        // 幸運六合彩 合肖
        code: 'luckl_pg_shxiao_spczdc',
        component: 'hklPgShxiaoSpczdc',
        options: Array.from(Array(12).keys()).map(item => item + 1),
        cols: 2
      },
      {
        // 幸運六合彩 连码
        code: 'luckl_pg_withcode',
        component: 'common',
        options: Array.from(Array(49).keys()).map(item => item + 1),
        cols: 7
      },
      {
        // 幸運六合彩 二连肖
        code: 'luckl_pg_exlzdc2',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 幸運六合彩 三连肖
        code: 'luckl_pg_exlzdc3',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 幸運六合彩 四连肖
        code: 'luckl_pg_exlzdc4',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 幸運六合彩 五连肖
        code: 'luckl_pg_exlzdc5',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 幸運六合彩 二连尾
        code: 'luckl_pg_exltail2',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 幸運六合彩 三连尾
        code: 'luckl_pg_exltail3',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 幸運六合彩 四连尾
        code: 'luckl_pg_exltail4',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 幸運六合彩 五连尾
        code: 'luckl_pg_exltail5',
        component: 'hklPgExl',
        cols: 2
      },
      {
        // 幸運六合彩 自选不中
        code: 'luckl_pg_ntinfvr_num',
        component: 'hklPgNtinfvrNum',
        options: Array.from(Array(49).keys()).map(item => item + 1),
        cols: 7
      },
      {
        // 福彩3D 二字定位
        code: 'fc3d_pg_2df',
        component: 'fc3dPg2df',
        options: Array.from(Array(10).keys()).map(item => item),
        cols: 5
      },
      {
        // 福彩3D 三字定位
        code: 'fc3d_pg_3df',
        component: 'fc3dPg2df',
        options: Array.from(Array(10).keys()).map(item => item),
        cols: 5
      },
      {
        // 福彩3D 组选三
        code: 'fc3d_pg_pic',
        component: 'fc3dPgIc',
        options: Array.from(Array(10).keys()),
        cols: 2
      },
      {
        // 福彩3D 组选六
        code: 'fc3d_pg_msic',
        component: 'fc3dPgIc',
        options: Array.from(Array(10).keys()),
        cols: 2
      }

    ],
    systemConfig: {
      customerServiceUrl: '',
      agentDashboardUrl: '',
      homePageLogo: '',
      siteName: '',
      global_preferences: {
        chat_condition_message: ''
      },
      chatroomEnabled: false,
      floatAd: null
    }
  },
  actions,
  mutations,
  getters
})
