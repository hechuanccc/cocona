<template>
  <ul class="main-navs">
    <router-link
      v-if="menu.path"
      tag="li"
      :to="menu.path"
      :class="getMenuClass(menu)"
      v-for="menu in menus"
      :key="menu.icon">
      <span>{{menu.name}}</span>
    </router-link>
    <a v-if="$store.state.systemConfig.customerServiceUrl"
      class="online-service m-r"
      target="_blank"
      :href="$store.state.systemConfig.customerServiceUrl ? $store.state.systemConfig.customerServiceUrl : '#'">
      {{$t('navMenu.online_service')}}
    </a>
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
        'active': this.$route.path.split('/')[1] === menu.path.slice(1),
        [menu.class]: menu.class,
        'nav-link': true
      }
    }
  }
}
</script>


<style lang="sass" scoped>
@import "../style/vars.scss";
.main-navs
  float: right
.nav-link
  line-height: 60px
  display: inline-block
  padding: 0 20px
  cursor: pointer
  text-align: center
  color: #666
  font-size: 16px
  &.active
    color: $primary

.online-service
  display: inline-block
  text-align: center
  text-decoration: none
  width: 90px
  height: 40px
  line-height: 40px
  border-radius: 3px
  font-size: 14px
  font-weight: normal
  color: #ffffff
  background-color: $azul
</style>
