<template>
  <div>
    <div class="menu-container">
      <GameMenu path="game"/>
    </div>
    <!-- user key props to force Vue to re-render router-view whenever route change -->
    <router-view :key="$route.name + ($route.params.gameId || '')"/>
  </div>
</template>

<script>
import GameMenu from '../components/GameMenu'
export default {
  name: 'gamehall',
  components: {
    GameMenu
  },
  created () {
    this.$store.dispatch('fetchUser')
      .then(res => {
        this.$store.dispatch('fetchGames')
      })
      .catch(error => {
        if (error.response.status > 400) {
          this.$router.push({
            path: '/',
            query: {
              next: this.$route.path
            }
          })
        }
      })
  }
}
</script>

<style scoped>
.menu-container {
  padding: 0 20px;
}
</style>
