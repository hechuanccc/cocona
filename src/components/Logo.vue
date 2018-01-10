<template>
  <div class="logo p-l">
    <router-link to="/">
      <img :src="$store.state.systemConfig.homePageLogo" alt="logo" />
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
  width: 225px
  height: 50px
  margin: 5px 0
  vertical-align: middle
  img
    width: 100%
    height: 100%
</style>

