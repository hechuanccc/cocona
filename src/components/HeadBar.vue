<template>
  <div class="top-header">
    <transition name="el-fade-in">
      <div class="header-bar" v-show="isFrontPage">
        <div class="container">
          <span class="bar-descript">
            {{nowTime}} {{$t('navMenu.bussiness_hours')}}
          </span>
          <TopBar/>
        </div>
      </div>
    </transition>
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
    height: 45px
    background: #433e81
    margin: 0 auto
  .header-nav
    margin-top: 10px
.bar-descript
  float: left
  width: auto
  line-height: 45px
  color: white
</style>
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


