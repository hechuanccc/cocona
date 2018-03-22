<template>
  <div v-loading.fullscreen="$store.state.loading" element-loading-text="加载中..." class="block-center" id="app">
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
    <el-dialog
      :title="'继续试玩'"
      :visible="showTrialVerifyDialog"
      @close="closeVerifyTrialDialog"
      width="360px"
      append-to-body
      center>
      <div>
        <el-form ref="user">
          <el-form-item :label="'验证码'" label-width="70px">
            <el-input class="input-width" :maxlength="4" v-model="user.verification_code_1" auto-complete="off"></el-input>
            <div class="m-t">
              <el-col :span="12">
                <img class="captcha" :src="captcha_src" height="32">
              </el-col>
              <el-col :span="12" :pull="2" class="text-right">
                <el-button type="info" icon="el-icon-refresh" class="captcha-getter" @click="fetchCaptcha"></el-button>
              </el-col>
            </div>
            <el-button class="input-width" type="primary" @click.native="tryplay">继续试玩</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
    <chat-room v-if="$store.state.systemConfig.chatroomEnabled === 'true'" :showEntry="showEntry"></chat-room>
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
import { getToken, fetchMessageCount, fetchCaptcha, register } from './api'
import axios from 'axios'
import { setIndicator, msgFormatter } from './utils'

export default {
  name: 'app',
  data () {
    return {
      timer: '',
      getMessageInterval: '',
      bodyHeight: ~~(document.documentElement.clientHeight - 330),
      illegalTrial: false,
      captcha_src: '',
      user: {
        verification_code_0: '',
        verification_code_1: ''
      }
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
    closeVerifyTrialDialog () {
      this.$store.dispatch('closeTrialVerifyDialog')
      this.closeLoginDialog()
    },
    closeLoginDialog () {
      this.$store.commit('CLOSE_LOGINDIALOG')
    },
    tryplay () {
      register({
        account_type: 0,
        verification_code_0: this.user.verification_code_0,
        verification_code_1: this.user.verification_code_1
      }).then(user => {
        if (user.trial_auth_req === 1) {
          return Promise.reject(user)
        }
        return this.$store.dispatch('login', { user })
      }).then(result => {
        this.$router.push({ name: 'Game' })
        this.closeVerifyTrialDialog()
        this.user.verification_code_1 = ''
      }, errorMsg => {
        this.fetchCaptcha()
        this.$message({
          showClose: true,
          message: msgFormatter(errorMsg),
          type: 'error'
        })
      })
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
    },
    fetchCaptcha () {
      fetchCaptcha().then(res => {
        this.captcha_src = res.captcha_src
        this.user.verification_code_0 = res.captcha_val
      })
    }
  },
  computed: {
    showLoginDialog () {
      return this.$store.state.loginDialogVisible
    },
    showBetRecordDialog () {
      return this.$store.state.betRecordDialogVisible
    },
    showTrialVerifyDialog () {
      return this.$store.state.showTrialVerifyDialog
    },
    showEntry () {
      let name = this.$route.name
      return name === 'Gameintro' || name === 'GameDetail' || name === 'GameHistory' || name === 'Game' || name === 'Schedules'
    }
  },
  created () {
    const version = this.$route.query.desktop
    if (version === '0' && this.$cookie.desktop !== '0') {
      this.$cookie.set('desktop', version)
      window.location.reload()
    }

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
    },
    '$store.state.showTrialVerifyDialog': function () {
      this.user.verification_code_1 = ''
      this.fetchCaptcha()
    }
  }
}
</script>

<style lang="scss" scoped>
.captcha {
  width: 70px;
  height: 32px;
}
</style>
