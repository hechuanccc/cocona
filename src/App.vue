<template>
  <div>
    <Top />
    <router-view/>
    <Bottom v-if="!$route.params.gameId && $route.path.indexOf('/account') < 0"/>
    <el-dialog 
      :title="$t('navMenu.pop_title')"
      :visible="showLoginDialog"
      width="680px"
      @close="closeLoginDialog()"
      center>
      <LoginPopup/>
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
    LoginPopup
  },
  methods: {
    closeLoginDialog () {
      this.$store.commit('CLOSE_LOGINDIALOG')
    },
    replaceToken () {
      let refreshToken = this.$cookie.get('refresh_token')
      if (!refreshToken) {
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
