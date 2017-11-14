<template>
  <div class="logo">
    <router-link to="/">
      <img :src="icon" alt="logo" height="60" />
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
  display: inline-block
  height: 60px
  width: 240px
  a
    display: inline-block
    height: 60px
  img
    width: auto
    height: 100%
</style>

