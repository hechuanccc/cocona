<template>
  <div class="header">
    <div class="topbar">
      <TopBar/>
    </div>
    <div :class="['bottomnavs', isUserPage ? 'lower' : '']">
      <div :class="
        ['navs',
          'container',
          {
            'block-center': $route.path === '/'
          }
        ]">
        <Logo/>
        <GameResult :gameid="$route.params.gameId" v-if="$route.path.indexOf('/game/') >= 0"/>
        <NavMenu :menus="isUserPage ? showUserMenus : menus" />
      </div>
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
      userMenus: [
        {
          name: this.$t('navMenu.game_center'),
          path: '/game'
        },
        {
          name: this.$t('navMenu.game_intro'),
          path: '/gameintro'
        }, {
          name: this.$t('navMenu.draw_history'),
          path: '/gamehistory'
        }, {
          name: this.$t('navMenu.promotion'),
          path: '/promotions'
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
    currentGame () {
      return this.$store.getters.gameById(this.$route.params.gameId)
    },
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

<style lang="scss" scoped>
.header {
  width: 100%;
}
.topbar {
  display: inline-block;
  background-color: #f9f9f9;
  height: 36px;
  width: 100%;
}
.bottomnavs {
  width: 100%;
  height: 100px;
  background-color: #fff;
  .navs {
    height: 100%;
    &:after {
      content: '';
      display: block;
      height: 20px;
    }
  }
  &.lower {
    height: 60px;
  }
}
</style>
