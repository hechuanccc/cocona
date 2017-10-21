<template>
  <div id="app">
    <el-container>
      <el-header>
        <TopBar />
      </el-header>
      <el-main>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import TopBar from '../components/TopBar'
export default {
  name: 'home',
  components: {
    TopBar
  }
}
</script>

<style scoped>
#app {
  width: 1000px;
  margin: 0 auto;
}
</style>
