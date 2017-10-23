<template>
  <el-tabs v-model="activeName" @tab-click="switchTab" v-if="gamePlays.length > 0">
    <el-tab-pane v-for="(play, index) in gamePlays" :key="'play' + index" :label="play.display_name" name="first">{{play.display_name}}</el-tab-pane>
  </el-tabs>
</template>

<script>
import { fetchGamePlays } from '../../api'

export default {
  name: 'game',
  data () {
    return {
      activeName: '',
      gamePlays: []
    }
  },
  components: {
  },
  created () {
    const gameId = this.$route.params.id
    fetchGamePlays(gameId)
      .then(res => {
        this.gamePlays = res.data
      })
  },
  methods: {
    switchTab (tab, event) {
    }
  }
}
</script>

<style scoped>
</style>
