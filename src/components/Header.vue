<template>
  <div class="top-header">
    <div class="header-bar">
      <TopBar/>
    </div>
    <div class="header-nav container">
      <Logo/>
      <GameResult v-if="$route.params.gameId && isGamePage" :gameid="$route.params.gameId"/>
      <NavMenu :menus="isUserPage ? userMenus : menus" />
    </div>
  </div>
</template>

<script>
import TopBar from '../components/TopBar'
import NavMenu from '../components/NavMenu'
import Logo from '../components/Logo'
import GameResult from '../components/GameResult'

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
      }],
      userMenus: [{
        name: this.$t('navMenu.game_center'),
        path: '/game'
      }, {
        name: this.$t('navMenu.home_page'),
        path: '/'
      }, {
        name: this.$t('navMenu.draw_history'),
        path: '/gamehistory'
      }, {
        name: this.$t('navMenu.game_intro'),
        path: '/gameintro'
      }, {
        name: this.$t('navMenu.personal_account'),
        path: '/account'
      }]
    }
  },
  components: {
    TopBar,
    NavMenu,
    Logo,
    GameResult
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
    }
  }
}
</script>

<style lang="sass" scoped>

.top-header
  background: #fff
  .header-bar
    height: 32px
    width: 100%
    background: #f2f2f2
    border-bottom: 1px solid #e5e5e5
    text-align: center
  .header-nav
    height: 80px
</style>
