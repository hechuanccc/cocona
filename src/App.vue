<template>
  <div>
    <HeadBar />
    <router-view/>
  </div>
</template>

<script>
import './style/reset.css'
import './style/base.scss'
import HeadBar from './components/HeadBar.vue'
import {refreshToken} from './api'
import axios from 'axios'

export default {
  name: 'app',
  components: {
    HeadBar
  },
  methods: {
    refresh () {
      let old = this.$cookie.get('refresh_token')
      if (!old) {
        return
      }
      refreshToken(old).then(
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
          }
        }
      )
    },
    setAuth () {
      this.refreshTokenInterval = window.setInterval(() => {
        if (!this.$cookie.get('access_token')) {
          return
        }
        this.refresh()
      }, 3000)

      axios.interceptors.response.use(
        res => res,
        errRes => {
          if (errRes.response.status === 401 || errRes.response.status === 403) { // every unauthorized request will get back to index and logout
            this.$cookie.delete('access_token')
            this.$cookie.delete('refresh_token')
            this.$router.push('/')
          }
        }
      )
    }
  },
  created () {
    this.setAuth()
    if (this.$store.state.user.logined) {
      this.$store.dispatch('fetchUser')
    }
  },
  beforeDestroy () {
    clearInterval(this.refreshTokenInterval)
  }

}
</script>
