<template>
  <div class="top-header">
    <div class="header-bar">
        <TopBar v-if="!isBack"/>
    </div>
    <div class="header-nav container">
        <Logo/>
        <NavMenu />
    </div>
  </div>
</template>

<style lang="sass" scoped>
.top-header
  margin-bottom: 10px
  .header-bar
    width: 100%
    background: #433e81
    text-align: center
  .header-nav
    margin-top: 10px
</style>
<script>
import TopBar from '../components/TopBar'
import NavMenu from '../components/NavMenu'
import Logo from '../components/Logo'

export default {
  data () {
    return {
      userInfo: ''
    }
  },
  components: {
    TopBar,
    NavMenu,
    Logo
  },
  computed: {
    isBack () {
      return ['Game', 'Account'].includes(this.$route.meta.Page)
    }
  }
}
</script>


