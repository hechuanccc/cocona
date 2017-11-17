<template>
  <ul class="menu">
    <router-link
      tag="li"
      :to="'/' + menu.path"
      :class="getMenuClass(menu)"
      v-for="menu in menus"
      :key="menu.icon">
      <i class="icon">
        <icon :name="menu.icon" scale="1.4" />
      </i>
      <span class="txt">{{menu.name}}</span>
    </router-link>
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
    }
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
