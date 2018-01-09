<template>
  <div class="logo p-l">
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
  vertical-align: middle
  img
    width: 100%
    height: 100%
</style>

