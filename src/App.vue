<template>
  <div>
    <HeadBar />
    <router-view/>
    <el-dialog :title="$t('navMenu.pop_title')"
    :visible="showLoginDialog"
    width="480px"
    @close="closeLoginDialog()"
    center>
      <LoginPopup/>
    </el-dialog>
  </div>
</template>


<script>
import './style/reset.css'
import './style/base.scss'
import HeadBar from './components/HeadBar.vue'
import LoginPopup from './components/LoginPopup'
import { getToken } from './api'
import axios from 'axios'

export default {
  name: 'app',
  data () {
    return {
      timer: ''
    }
  },
  components: {
    HeadBar,
    LoginPopup
  },
  methods: {
    setAutoReplaceToken (expiresIn) {
      let tokenLifeTime
      if (expiresIn) {
        tokenLifeTime = this.$moment(expiresIn).diff(this.$moment(), 'ms') - 5 * 60 * 1000
      } else {
        tokenLifeTime = 50 * 60 * 1000
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.replaceToken()
      }, tokenLifeTime) // iterate setAutoReplaceToken: 5 mins before expired_in (refresh)
    },
    replaceToken () {
      let refreshToken = this.$cookie.get('refresh_token')
      if (refreshToken) {
        let tokenPromise = getToken(refreshToken).then(result => {
          let data = result
          let expires = new Date(data.expires_in)
          if (data.access_token && data.refresh_token) {
            axios.defaults.headers.common['Authorization'] = 'Bearer ' + data.access_token
            this.$cookie.set('access_token', data.access_token, {
              expires: expires
            })
            this.$cookie.set('refresh_token', data.refresh_token, {
              expires: expires
            })
          }
          this.setAutoReplaceToken(data.expires_in)
          this.$store.dispatch('clearTokenPromise')
        })
        this.$store.dispatch('setTokenPromise', tokenPromise)
        return tokenPromise
      } else {
        this.setAutoReplaceToken()
      }
    },
    setInterceptor () {
      axios.interceptors.response.use(
        res => res,
        errRes => {
          if (errRes.response.status === 401 || errRes.response.status === 403) {
            let tokenPromise = this.$store.state.tokenPromise
            if (!tokenPromise) {
              tokenPromise = this.replaceToken()
            }
            return tokenPromise.then(res => {
              // use latest access token
              errRes.config.headers.Authorization = 'Bearer ' + this.$cookie.get('access_token')
              return axios(errRes.config)
            })
          } else {
            return Promise.reject(errRes)
          }
        }
      )
    },
    closeLoginDialog () {
      this.$store.commit('CLOSE_LOGINDIALOG')
    }
  },
  computed: {
    showLoginDialog () {
      return this.$store.state.loginDialogVisible
    }
  },
  created () {
    this.setInterceptor()
    this.setAutoReplaceToken()
    let oldtoken = this.$cookie.get('refresh_token')
    if (oldtoken) {
      this.$store.dispatch('fetchUser')
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
