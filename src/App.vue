<template>
  <div>
    <HeadBar />
    <router-view/>
  </div>
</template>

<script>
import './style/reset.css'
import './style/base.scss'
import HeadBar from './components/HeadBar.vue'

export default {
  name: 'app',
  components: {
    HeadBar
  }
}
</script>
