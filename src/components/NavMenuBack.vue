<template>
  <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect" :active-text-color="style.primaryColor">
    <el-menu-item index="game">{{$t('navMenu.game_center')}}</el-menu-item>
    <el-menu-item index="account">{{$t('navMenu.personal_account')}}</el-menu-item>
    <el-menu-item index="history">{{$t('navMenu.draw_history')}}</el-menu-item>
    <el-menu-item index="gameintro">{{$t('navMenu.game_intro')}}</el-menu-item>
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
      activeIndex: 'game',
      style
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.$router.push('/' + key)
    }
  }
}
</script>
