<template>
  <el-container>
    <el-header>
      <GameMenu path="game"/>
    </el-header>
    <!-- user key props to force Vue to re-render router-view whenever route change -->
    <router-view :key="$route.name + ($route.params.gameId || '')"/>
  </el-container>
</template>

<script>
import GameMenu from '../components/GameMenu'
export default {
  name: 'gamehall',
  components: {
    GameMenu
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
