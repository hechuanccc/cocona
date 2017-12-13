<template>
  <div v-loading.fullscreen="$store.state.loading" element-loading-text="加载中...">
    <Top />
    <router-view/>
    <Bottom v-if="!$route.params.gameId && $route.path.indexOf('/account') < 0"/>
    <el-dialog
      :title="$t('navMenu.pop_title')"
      :visible="showLoginDialog"
      width="720px"
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
  </div>
</template>


<script>
import './style/reset.css'
import './style/base.scss'
import './style/theme.scss'
import Top from './components/Header'
import Bottom from './components/Footer'
import LoginPopup from './components/LoginPopup'
import BetRecord from './screens/member/BetRecord'
import { getToken } from './api'
import axios from 'axios'
import { setIndicator } from './utils'

export default {
  name: 'app',
  data () {
    return {
      timer: ''
    }
  },
  components: {
    Top,
    Bottom,
    LoginPopup,
    BetRecord
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
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + res.access_token
      })
    }
  },
  computed: {
    showLoginDialog () {
      return this.$store.state.loginDialogVisible
    },
    showBetRecordDialog () {
      return this.$store.state.betRecordDialogVisible
    }
  },
  created () {
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
  }
}
</script>
