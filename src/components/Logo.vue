<template>
  <div class="logo">
    <router-link to="/">
      <img :src="$store.state.common.homePageLogo" alt="logo" />
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
  display: inline-block
  width: 225px
  height: 50px
  padding-left: 40px
  vertical-align: middle
  position: relative
  top: -4px
  img
    width: 100%
    height: 100%
</style>

