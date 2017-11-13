<template>
  <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect" :active-text-color="style.primaryColor">
    <el-menu-item index="">{{$t('navMenu.home_page')}}</el-menu-item>
    <el-menu-item index="game" @click="popGuest">{{$t('navMenu.game_center')}}</el-menu-item>
    <el-dialog :title="$t('navMenu.pop_title')"
    :visible.sync="popVisible"
    width="480px"
    center>
      <loginPopup />
    </el-dialog>
    <el-menu-item index="register">{{$t('navMenu.user_register')}}</el-menu-item>
    <el-menu-item index="promotions">{{$t('navMenu.promotion')}}</el-menu-item>
    <el-menu-item index="quastions/quastion">{{$t('navMenu.qa')}}</el-menu-item>
    <el-menu-item index="agent/register">{{$t('navMenu.affliate')}}</el-menu-item>
  </el-menu>
</template>

<style lang="sass" scoped>
.el-menu
  display: inline-block
  float: right
  width: auto
</style>

<script>
import style from '../style'
import loginPopup from './LoginPopup'
export default {
  data () {
    return {
      activeIndex: '',
      popVisible: false,
      style
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.$router.push('/' + key) // key to that page set by index attribute
    },
    popGuest () {
      if (!this.$store.state.user.logined) {
        this.popVisible = true
      }
    }
  },
  components: {
    loginPopup
  }
}
</script>
