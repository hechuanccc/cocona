<template>
  <el-container>
    <el-header>
      <GameTab />
    </el-header>
    <!-- user key props to force Vue to re-render router-view whenever route change -->
    <router-view :key="$route.name + ($route.params.id || '')"/>
  </el-container>
</template>

<script>
import GameTab from '../components/GameTab'
export default {
  name: 'game',
  components: {
    GameTab
  },
  created () {
    if (!this.$store.state.games.length) {
      this.$store.dispatch('fetchGames')
    }
  }
}
</script>

<style scoped>
</style>
