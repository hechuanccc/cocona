<template>
  <div class="container">
    <div class="page-title">
      <h1 class="title">歷史開獎</h1>
      <span>GAME HISTORY</span>
    </div>
    <el-row>
      <el-col :span="3">
        <el-tabs type="border-card" :tab-position="tabposition" class="mb-20 container">
          <el-tab-pane v-for="game in games" :key="game.id" :label="game.display_name">
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="21">
      </el-col>
    </el-row>
  </div>
</template>


<style lang="scss" scoped>
@import "../../style/vars.scss";
.mb-20 {
  margin-bottom: 20px;
}
</style>
<script>
import { fetchGames } from '../../api'

export default {
  data () {
    return {
      tabposition: 'left',
      games: ''
    }
  },
  created () {
    fetchGames().then(
      games => {
        this.games = games
      }
    )
  }
}
</script>
