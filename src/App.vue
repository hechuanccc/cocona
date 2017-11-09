<template>
  <div>
    <headBar />
    <router-view/>
  </div>
</template>
<style lang="sass">
// global
html
  height: 100%
body
  min-height: 100%
  height: 100%
.inner
  width: 1280px;
  margin: 0 auto
</style>

<script>
import './style/reset.css'
import './style/base.scss'
import headBar from './components/headBar.vue'

export default {
  name: 'app',
  components: {
    headBar
  }
}
</script>
