<template>
  <div class="top-header">
    <div class="header-bar">
        <TopBar v-show="isFrontPage"/>
    </div>
    <div class="header-nav container">
        <Logo/>
        <NavMenu v-if="isFrontPage" />
        <NavMenuBack v-else/>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.top-header
  margin-bottom: 10px
  .header-bar
    width: 100%
    background: #f0f0f0
    text-align: center
  .header-nav
    height: 60px
    margin-top: 10px
</style>
<script>
import TopBar from '../components/TopBar'
import NavMenu from '../components/NavMenu'
import Logo from '../components/Logo'
import NavMenuBack from '../components/NavMenuBack'

export default {
  data () {
    return {
      userInfo: ''
    }
  },
  components: {
    TopBar,
    NavMenu,
    Logo,
    NavMenuBack
  },
  computed: {
    isFrontPage () {
      return this.$route.path.indexOf('/game/') === -1 && this.$route.path.indexOf('/account/') === -1
    }
  }
}
</script>


