<template>
  <!-- 这里只处理了UI 部分，没有加上 router -->
  <ul class="menu">
    <router-link tag="li" :to="'/' + menu.path" :class="currentPath(menu)" v-for="menu in menus" :key="menu.icon">
      <i class="icon">
        <icon :name="menu.icon" scale="1.4" />
      </i>
      <span class="txt">{{menu.name}}</span>
    </router-link>
  </ul>
</template>

<script>
import 'vue-awesome/icons/home'
import 'vue-awesome/icons/th-large'
import 'vue-awesome/icons/user-plus'
import 'vue-awesome/icons/info'
import 'vue-awesome/icons/clone'
import 'vue-awesome/icons/list-ul'
import style from '../style'
import loginPopup from './LoginPopup'
export default {
  data () {
    return {
      popVisible: false,
      style,
      menus: [{
        icon: 'home',
        name: this.$t('navMenu.home_page'),
        path: ''
      }, {
        icon: 'th-large',
        name: this.$t('navMenu.game_center'),
        path: 'game'
      }, {
        icon: 'list-ul',
        name: this.$t('navMenu.promotion'),
        path: 'promotions'
      }, {
        icon: 'info',
        name: this.$t('navMenu.qa'),
        path: 'faq'
      }, {
        icon: 'clone',
        name: this.$t('navMenu.affliate'),
        path: 'agent'
      }]
    }
  },
  methods: {
    currentPath (menu) {
      return {
        'active': this.$route.path.split('/')[1] === menu.path,
        [menu.class]: menu.class
      }
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


<style lang="sass" scoped>
@import "../style/vars.scss";
.icon
  color: #999
  height: 20px
  margin-top: 10px
  display: inline-block
.menu
  float: right
  li
    margin-left: 5px
    height: 60px
    cursor: pointer
    width: 90px
    color: #999
    float: left
    text-align: center
    font-size: 13px
    border-radius: 2px
    a
      text-decoration: none
      color: #999
    &:hover
      background: #f5f5f5
    &.active
      background: #f0f0f0
    &.yellow
      color: $yellow
      .icon
        color: $yellow
  .txt
    display: block

</style>
