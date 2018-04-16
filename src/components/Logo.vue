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

<style lang="scss" scoped>
.logo {
  float: left;
  height: 100%;
  vertical-align: middle;
  a {
    height: 100%;
    display: flex;
    align-items: center;
  }
  img {
    max-height: 100%;
    max-width: 300px;
    display: block;
    margin: auto;
  }
}
</style>

