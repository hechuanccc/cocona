<template>
  <div class="header">
    <div class="topbar">
      <TopBar/>
    </div>
    <div class="bottomnavs container">
      <Logo/>
      <NavMenu :menus="isUserPage ? showUserMenus : menus" />
    </div>
  </div>
</template>

<script>
import TopBar from '../components/TopBar'
import NavMenu from '../components/NavMenu'
import Logo from '../components/Logo'

export default {
  data () {
    return {
      menus: [{
        name: this.$t('navMenu.game_center'),
        path: '/game'
      }, {
        name: this.$t('navMenu.promotion'),
        path: '/promotions'
      }, {
        name: this.$t('navMenu.qa'),
        path: '/faq'
      }, {
        name: this.$t('navMenu.affliate'),
        path: '/agent'
      }, {
        name: this.$t('navMenu.online_service'),
        path: this.$store.state.common.customerServiceUrl ? this.$store.state.common.customerServiceUrl : '/',
        class: 'online-service'
      }],
      userMenus: [
        {
          name: this.$t('navMenu.game_intro'),
          path: '/gameintro'
        }, {
          name: this.$t('navMenu.draw_history'),
          path: '/gamehistory'
        }, {
          name: this.$t('navMenu.promotion'),
          path: '/promotions'
        }, {
          name: this.$t('navMenu.online_service'),
          path: this.$store.state.common.customerServiceUrl ? this.$store.state.common.customerServiceUrl : '/',
          class: 'online-service'
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
      let pat = new RegExp(/\/game\/|\/game|\/account\/|\/gamehistory|\/gameintro/)
      return pat.test(this.$route.path)
    },
    isGamePage () {
      let path = this.$route.path.split('/')
      if (path[1] === 'game') {
        return true
      }
    },
    showUserMenus () {
      let accountType = this.$store.state.user.account_type
      if (accountType === 0) {
        return this.userMenus.filter(page => page.path !== '/account')
      } else {
        return this.userMenus
      }
    }
  }
}
</script>

<style lang="sass" scoped>

.header
  height: 100px
.topbar
  display: inline-block
  background-color: #f9f9f9
  height: 40px
.bottomnavs
  display: inline-block
  height: 60px
  line-height: 60px
  background-color: #ffffff
  text-align: justify
  &:after
    display: inline-block
    content: ''
    width: 100%
</style>
