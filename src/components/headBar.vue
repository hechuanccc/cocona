<template>
  <div class="top-header">
    <div class="header-bar">
        <TopBar v-if="showTopbar" />
    </div>
    <div class="header-nav">
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
    width: 1280px
    margin: 10px auto
</style>
<script>
import TopBar from '../components/TopBar'
import NavMenu from '../components/NavMenu'
import Logo from '../components/Logo'

export default {
  components: {
    TopBar,
    NavMenu,
    Logo
  },
  computed: {
    showTopbar () {
      return !this.$store.state.user.logined
    }
  }
}
</script>


