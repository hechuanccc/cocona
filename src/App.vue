<template>
  <div v-loading.fullscreen="$store.state.loading" element-loading-text="加载中...">
    <Top />
    <div :style="{minHeight: bodyHeight + 'px'}">
      <router-view/>
    </div>
    <Bottom v-if="!$route.params.gameId"/>
    <el-dialog
      :title="$t('navMenu.pop_title')"
      :visible="showLoginDialog"
      width="740px"
      top="205px"
      @close="closeLoginDialog()"
      center>
      <LoginPopup/>
    </el-dialog>
    <el-dialog
      :title="$t('user.betrecord')"
      :visible="showBetRecordDialog"
      width="1080px"
      @close="closeBetRecordDialog()"
      center>
      <BetRecord v-if="showBetRecordDialog" :lazyFetch="!showBetRecordDialog"/>
    </el-dialog>
    <chat-room :showEntry="showEntry"></chat-room>
  </div>
</template>


<script>
import './style/reset.css'
import './style/base.scss'
import './style/theme.scss'
import './style/animate.css'
import Top from './components/Header'
import Bottom from './components/Footer'
import LoginPopup from './components/LoginPopup'
import ChatRoom from './components/ChatRoom'

import BetRecord from './screens/member/BetRecord'
import { getToken, fetchMessageCount } from './api'
import axios from 'axios'
import { setIndicator } from './utils'

export default {
  name: 'app',
  data () {
    return {
      timer: '',
      getMessageInterval: '',
      bodyHeight: ~~(document.documentElement.clientHeight - 330)
    }
  },
  components: {
    Top,
    Bottom,
    LoginPopup,
    BetRecord,
    ChatRoom
  },
  methods: {
    closeLoginDialog () {
      this.$store.commit('CLOSE_LOGINDIALOG')
    },
    closeBetRecordDialog () {
      this.$store.dispatch('closeBetRecordDialog')
    },
    replaceToken () {
      let refreshToken = this.$cookie.get('refresh_token')
      if (!refreshToken || this.$store.state.user.account_type === 0) {
        return
      }
      getToken(refreshToken).then(res => {
        let expires = new Date(res.expires_in)
        this.$cookie.set('access_token', res.access_token, {
          expires: expires
        })
        this.$cookie.set('refresh_token', res.refresh_token, {
          expires: expires
        })
        axios.defaults.withCredentials = true
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.access_token
      })
    },
    getMessageCount () {
      let user = this.$store.state.user
      if (!user.logined || user.account_type === 0) {
        return
      }
      fetchMessageCount().then(res => {
        this.$store.dispatch('setMessageCount', res.message_count)
      }).catch(() => {})
    }
  },
  computed: {
    showLoginDialog () {
      return this.$store.state.loginDialogVisible
    },
    showBetRecordDialog () {
      return this.$store.state.betRecordDialogVisible
    },
    showEntry () {
      let name = this.$route.name
      return name === 'Gameintro' || name === 'GameDetail' || name === 'GameHistory' || name === 'Game' || name === 'Schedules'
    }
  },
  created () {
    if (this.$cookie.get('access_token')) {
      this.$store.dispatch('fetchUser').then(() => {
        this.getMessageCount()
      }).catch(() => {})
    }

    this.getMessageInterval = window.setInterval(() => {
      this.getMessageCount()
    }, 30000)
    let refreshTokenInterval
    setIndicator(() => {
      refreshTokenInterval = window.setInterval(() => {
        this.replaceToken()
      }, 300000)
    }, () => {
      window.clearInterval(refreshTokenInterval)
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    window.clearInterval(this.getMessageInterval)
  },
  watch: {
    '$store.state.systemConfig.homePageLogo': function (homePageLogo) {
      document.getElementById('favicon').href = homePageLogo
    }
  }
}
</script>
