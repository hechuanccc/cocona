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

export default {
  name: 'app',
  components: {
    HeadBar
  },
  methods: {
    refresh () {
      let old = this.$cookie.get('refresh_token')
      if (old) {
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
          this.$store.commit('SET_USERs', {
            user: {
              logined: true
            }
          })
        }
      )
      }
    }
  },
  created () {
    this.refresh()
    this.refreshTokenInterval = window.setInterval(() => {
      this.refresh()
    }, 30000)
  },
  beforeDestroy () {
    clearInterval(this.refreshTokenInterval)
  }

}
</script>
