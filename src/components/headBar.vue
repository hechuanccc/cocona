<template>
  <div class="top-header">
    <div class="header-bar" v-show="isFrontPage">
        <TopBar/>
    </div>

    <div class="header-nav container">
      <Logo/>
      <NavMenu v-if="isFrontPage" />
      <NavMenuBack v-else/>
    </div>
  </div>
</template>

<script>
import TopBar from '../components/TopBar'
import NavMenu from '../components/NavMenu'
import Logo from '../components/Logo'
import NavMenuBack from '../components/NavMenuBack'

export default {
  data () {
    return {
      userInfo: '',
      nowTime: new Date().toLocaleString()
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
      let pat = new RegExp(/\/game\/|\/game|\/account\/|\/history|\/gameintro/)
      return !(pat.test(this.$route.path))
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