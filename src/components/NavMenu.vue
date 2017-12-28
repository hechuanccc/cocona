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
    <a v-if="$store.state.common.customerServiceUrl"
      class="online-service"
      target="_blank"
      :href="$store.state.common.customerServiceUrl ? $store.state.common.customerServiceUrl : '#'">
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
        'active': this.$route.path.split('/')[1] === menu.path,
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
  display: inline-block
  padding-right: 40px
.nav-link
  display: inline-block
  width: 127px
  cursor: pointer
  text-align: center
  color: $pinkish-grey
  font-size: 18px

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
