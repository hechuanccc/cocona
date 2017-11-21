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
import {getToken} from './api'
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
    setToken () {
      let oldtoken = this.$cookie.get('refresh_token')
      if (!oldtoken) {
        return
      }
      getToken(oldtoken).then(
        result => {
          let data = result
          let expires = new Date(data.expires_in)
          if (data.access_token && data.refresh_token) {
            this.$cookie.set('access_token', data.access_token, {
              expires: expires
            })
            this.$cookie.set('refresh_token', data.refresh_token, {
              expires: expires
            })
            let tokenLifeTime = new Date(data.expires_in) - new Date(Date.now()) - 5 * 60 * 1000
            this.timer = setTimeout(() => {
              this.setToken()
            }, tokenLifeTime) // iterate setToken: 5 mins before expired_in (refresh)
          }
        }
      )
    },
    setInterceptor () {
      axios.interceptors.response.use(
        res => res,
        errRes => {
          if (errRes.response.status === 401 || errRes.response.status === 403) {
            this.$cookie.delete('access_token')
            this.$cookie.delete('refresh_token')

            this.$store.commit('RESET_USERs')

            this.$router.push('/')
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
    this.setToken()
    this.setInterceptor()
    if (this.$store.state.user.logined) {
      this.$store.dispatch('fetchUser')
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
</script>
