<template>
  <div class="logo">
    <router-link to="/">
      <img :src="$store.state.common.homePageLogo" alt="logo" height="60" />
    </router-link>
  </div>
</template>

<script>
export default {
  data () {
    return {
      icon: ''
    }
  }
}
</script>

<style lang="sass" scoped>
.logo
  float: left
  display: inline-block
  padding: 10px
  height: 60px
  width: 240px
  vertical-align: middle
  a
    display: inline-block
    height: 60px
  img
    width: auto
    height: 100%
</style>

