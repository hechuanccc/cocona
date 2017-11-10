<template>
  <el-menu
  :default-active="activeIndex"
  class="el-menu"
  mode="horizontal"
  @select="handleSelect"
  :active-text-color="style.primaryColor">
    <el-menu-item index="" v-show="!islogin">{{$t('navMenu.home_page')}}</el-menu-item>
    <el-menu-item index="game">{{$t('navMenu.game_center')}}</el-menu-item>
    <el-menu-item index="register" v-show="!islogin">{{$t('navMenu.user_register')}}</el-menu-item>
    <el-menu-item index="promotions" v-show="!islogin">{{$t('navMenu.promotion')}}</el-menu-item>
    <el-menu-item index="qa" v-show="!islogin">{{$t('navMenu.qa')}}</el-menu-item>
    <el-menu-item index="agent/register" v-show="!islogin">{{$t('navMenu.affliate')}}</el-menu-item>

    <el-menu-item index="account" v-show="islogin">{{$t('navMenu.personal_account')}}</el-menu-item>
    <el-menu-item index="history" v-show="islogin">{{$t('navMenu.draw_history')}}</el-menu-item>
    <el-menu-item index="game-intro" v-show="islogin">{{$t('navMenu.game_intro')}}</el-menu-item>
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

export default {
  data () {
    return {
      activeIndex: '',
      style
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.$router.push('/' + key) // key to that page set by index attribute
    }
  },
  computed: {
    islogin () {
      return this.$store.state.user.logined
    }
  }
}
</script>
