<template>
  <div class="logo">
    <router-link to="/">
      <img :src="icon">
    </router-link>
  </div>
</template>

<script>
import {gethomePage} from '../api'
export default {
  data () {
    return {
      icon: ''
    }
  },
  created () {
    gethomePage().then(
      response => {
        this.icon = response.data.icon
      }
    )
  }
}
</script>

<style lang="sass" scoped>
.logo
  float: left
  height: 60px
  img
    width: auto
    height: 100%
</style>

