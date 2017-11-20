<template>
  <div class="top-header">
    <div class="header-bar" v-show="!isUserPage">
      <TopBar/>
    </div>
    <div class="header-nav container">
      <Logo/>
      <NavMenu :menus="isUserPage ? userMenus : menus" />
    </div>
  </div>
</template>



<script>
import TopBar from '../components/TopBar'
import NavMenu from '../components/NavMenu'
import Logo from '../components/Logo'

import 'vue-awesome/icons/home'
import 'vue-awesome/icons/user-plus'
import 'vue-awesome/icons/info'
import 'vue-awesome/icons/clone'
import 'vue-awesome/icons/list-ul'

import 'vue-awesome/icons/th-large'
import 'vue-awesome/icons/money'
import 'vue-awesome/icons/line-chart'
import 'vue-awesome/icons/star'

export default {
  data () {
    return {
      userInfo: '',
      nowTime: new Date().toLocaleString(),
      menus: [{
        icon: 'home',
        name: this.$t('navMenu.home_page'),
        path: ''
      }, {
        icon: 'th-large',
        name: this.$t('navMenu.game_center'),
        path: 'game'
      }, {
        icon: 'list-ul',
        name: this.$t('navMenu.promotion'),
        path: 'promotions'
      }, {
        icon: 'info',
        name: this.$t('navMenu.qa'),
        path: 'faq'
      }, {
        icon: 'clone',
        name: this.$t('navMenu.affliate'),
        path: 'agent'
      }],
      userMenus: [{
        icon: 'th-large',
        name: this.$t('navMenu.game_center'),
        path: 'game'
      }, {
        icon: 'money',
        name: this.$t('navMenu.personal_account'),
        path: 'account'
      }, {
        icon: 'line-chart',
        name: this.$t('navMenu.draw_history'),
        path: 'history'
      }, {
        icon: 'star',
        name: this.$t('navMenu.game_intro'),
        path: 'gameintro'
      }]
    }
  },
  components: {
    TopBar,
    NavMenu,
    Logo
  },
  computed: {
    isUserPage () {
      let pat = new RegExp(/\/game\/|\/game|\/account\/|\/history|\/gameintro/)
      return pat.test(this.$route.path)
    }
  },
  created () {
    this.timing = setInterval(() => {
      let now = new Date()
      this.nowTime = now.toLocaleString()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timing)
  }
}
</script>

<style lang="sass" scoped>
.top-header
  margin-bottom: 10px
  .header-bar
    height: 33px
    padding: 3px 0
    width: 100%
    background: #f0f0f0
    text-align: center
  .header-nav
    height: 60px
    margin-top: 10px
</style>
