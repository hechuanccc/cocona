<template>
  <div class="top-header">
    <div class="header-bar">
        <TopBar v-if="showTopbar"/>
    </div>
    <el-row class="header-nav">
      <el-col :span="4">
        <Logo/>
      </el-col>
      <el-col :span="14" :offset="4">
        <NavMenu />
      </el-col>
    </el-row>
  </div>
</template>

<style lang="sass">
.top-header
  margin-bottom: 20px
.header-bar
  width: 100%
  background: #433e81
  text-align: center
.header-nav
  width: 1000px
  margin: 0 auto
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
      return !(['Game'].includes(this.$route.meta.Page))
    }
  }
}
</script>


