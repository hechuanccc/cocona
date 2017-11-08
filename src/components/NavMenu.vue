<template>
  <el-menu
  :default-active="activeIndex"
  class="el-menu-demo"
  mode="horizontal"
  @select="handleSelect"
  :active-text-color="style.primaryColor">
    <el-menu-item index="">{{$t('navMenu.home_page')}}</el-menu-item>
    <el-menu-item index="register">{{$t('navMenu.game_center')}}</el-menu-item>
    <el-menu-item index="1">{{$t('navMenu.user_register')}}</el-menu-item>
    <el-menu-item index="2">{{$t('navMenu.promotion')}}</el-menu-item>
    <el-menu-item index="3">{{$t('navMenu.qa')}}</el-menu-item>
    <el-menu-item index="agent/register">{{$t('navMenu.affliate')}}</el-menu-item>
  </el-menu>
</template>

<script>
import style from '../style'

export default {
  data () {
    return {
      activeIndex: '1',
      style
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.$router.push('/' + key) // key to that page set by index attribute
    }
  },
  computed: {
    showHistory () {
      return ['Game', 'Personal'].includes(this.$route.meta.Page)
    }
  }
}
</script>
