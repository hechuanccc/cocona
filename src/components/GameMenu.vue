<template>
  <el-menu
    v-if="this.allGames.length"
    class="el-menu-demo"
    mode="horizontal"
    :default-active="activeIndex"
    @select="handleSelect"
    :background-color="style.primaryColor"
    text-color="#fff"
    active-text-color="#fff">
    <el-menu-item v-for="(game, index) in allGames" :key="index" :index="index + ''">{{game.display_name}}</el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import style from '../style'

export default {
  data () {
    return {
      style
    }
  },
  computed: {
    activeIndex () {
      return '' + this.allGames.findIndex(item => {
        return item.id === parseInt(this.$route.params.id)
      })
    },
    ...mapGetters([
      'allGames'
    ]),
    user () {
      return this.$store.state.user
    }
  },
  created () {
  },
  name: 'gamemenu',
  methods: {
    handleSelect (key, keyPath) {
      this.$router.push('/game/' + this.allGames[key].id)
    }
  }
}
</script>

<style scoped lang='scss'>
</style>
