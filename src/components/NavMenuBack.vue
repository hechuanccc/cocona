<template>
  <ul class="menu">
    <router-link tag="li" :to="menu.path" :class="{'active': menu.active, [menu.class]: menu.class}" v-for="menu in menus" :key="menu.icon">
      <i class="icon">
        <icon :name="menu.icon" scale="1.4" />
      </i>
      <span class="txt">{{menu.name}}</span>
    </router-link>
  </ul>
</template>

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

<script>
import 'vue-awesome/icons/th-large'
import 'vue-awesome/icons/money'
import 'vue-awesome/icons/line-chart'
import 'vue-awesome/icons/star'
import style from '../style'
export default {
  data () {
    return {
      style,
      menus: [{
        icon: 'th-large',
        name: this.$t('navMenu.game_center'),
        path: '/game'
      }, {
        icon: 'money',
        name: this.$t('navMenu.personal_account'),
        path: '/account'
      }, {
        icon: 'line-chart',
        name: this.$t('navMenu.draw_history'),
        path: '/history'
      }, {
        icon: 'star',
        name: this.$t('navMenu.game_intro'),
        path: '/gameintro'
      }]
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.$router.push('/' + key)
    }
  }
}
</script>
