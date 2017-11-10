<template>
  <div>
    <headBar />
    <router-view/>
  </div>
</template>

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
