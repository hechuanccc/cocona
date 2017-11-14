<template>
  <!-- 这里只处理了UI 部分，没有加上 router -->
  <ul class="menu">
    <li :class="{'active': menu.active, [menu.class]: menu.class}" v-for="menu in menus">
      <i class="icon"><icon :name="menu.icon" scale="1.4" /></i>
      <span class="txt">{{menu.name}}</span>
    </li>
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
      activeIndex: 'home',
      popVisible: false,
      style,
      menus: [{
        icon: 'home',
        active: true,
        name: this.$t('navMenu.home_page')
      }, {
        icon: 'th-large',
        name: this.$t('navMenu.game_center')
      }, {
        icon: 'list-ul',
        name: this.$t('navMenu.promotion')
      }, {
        icon: 'info',
        name: this.$t('navMenu.qa')
      }, {
        icon: 'clone',
        name: this.$t('navMenu.affliate')
      }]
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
