<template>
  <ul class="menu">
    <router-link
      v-if="menu.path"
      tag="li"
      :to="'/' + menu.path"
      :class="getMenuClass(menu)"
      v-for="menu in menus"
      :key="menu.icon">
      {{menu.name}}
    </router-link>
    <li @click="menu.onClick" v-else-if="menu.onClick">
      {{menu.name}}
    </li>
  </ul>
</template>

<script>
import style from '../style'
export default {
  props: {
    menus: {
      type: Array
    }
  },
  data () {
    return {
      style
    }
  },
  methods: {
    getMenuClass (menu) {
      return {
        'active': this.$route.path.split('/')[1] === menu.path,
        [menu.class]: menu.class
      }
    },
    logout () {
      this.$store.dispatch('logout')
    }
  },
  computed: {
    isUserPage () {
      let pat = new RegExp(/\/game\/|\/game|\/account\/|\/gamehistory|\/gameintro/)
      return pat.test(this.$route.path)
    }
  }
}
</script>


<style lang="sass" scoped>
@import "../style/vars.scss";
.menu
  float: right
  li
    cursor: pointer
    margin: 0 15px
    color: #666
    float: left
    text-align: center
    font-size: 15px
    font-weight: bold
    line-height: 77px
    color: #999
    &:hover
      color: #444
    &.active
      color: #444
      border-bottom: 3px solid $primary
    &.yellow
      color: $yellow
</style>
