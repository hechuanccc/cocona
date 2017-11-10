<template>
  <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect" :active-text-color="style.primaryColor">
    <el-menu-item index="" v-show="!isBack">{{$t('navMenu.home_page')}}</el-menu-item>
    <el-menu-item index="game" @click="popGuest">{{$t('navMenu.game_center')}}</el-menu-item>
    <el-dialog :title="$t('navMenu.pop_title')"
    :visible.sync="popVisible"
    width="480px"
    center>
      <loginPopup />
    </el-dialog>
    <el-menu-item index="register" v-show="!isBack">{{$t('navMenu.user_register')}}</el-menu-item>
    <el-menu-item index="promotions" v-show="!isBack">{{$t('navMenu.promotion')}}</el-menu-item>
    <el-menu-item index="qa" v-show="!isBack">{{$t('navMenu.qa')}}</el-menu-item>
    <el-menu-item index="agent/register" v-show="!isBack">{{$t('navMenu.affliate')}}</el-menu-item>
    <el-menu-item index="account" v-show="isBack">{{$t('navMenu.personal_account')}}</el-menu-item>
    <el-menu-item index="history" v-show="isBack">{{$t('navMenu.draw_history')}}</el-menu-item>
    <el-menu-item index="game-intro" v-show="isBack">{{$t('navMenu.game_intro')}}</el-menu-item>
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
      activeIndex: 'home',
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
      this.$router.push('/')
    }
  },
  computed: {
    isBack () {
      return ['Game', 'Account'].includes(this.$route.meta.Page)
    }
  },
  components: {
    loginPopup
  }
}
</script>
