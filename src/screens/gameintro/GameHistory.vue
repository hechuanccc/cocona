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
          <table class="table">
            <tr>
              <th :rowspan="isResultGroup?2:1">{{$t('history.draw_period')}}</th>
              <th :rowspan="isResultGroup?2:1">{{$t('history.draw_time')}}</th>
              <th colspan="5">开出号码</th>
              <th :rowspan="isResultGroup?2:1" :colspan="playHead.count" v-for="(playHead,index) in gameFormat[currentGame].playGroups" :key="index">{{playHead.name}}</th>
            </tr>
            <tr v-if="isResultGroup">
              <th v-for="(resultHead,index) in gameFormat[currentGame].resultGroups" :key="index">{{resultHead}}</th>
            </tr>
            <tr v-for="data in historyDatas" :key="data.issue_number">
              <td>{{data.issue_number}}</td>
              <td>{{data.draw_time}}</td>
              <td v-for="result in data.results" :key="result">{{result}}</td>
              <td v-for="(play,index) in data.plays" :key="index">{{play}}</td>
            </tr>
          </table>
      </el-col>
    </el-row>


  </div>
</template>


<style lang="scss" scoped>
@import "../../style/vars.scss";
.mb-20 {
  margin-bottom: 20px;
}
.table {
  width: 100%;
  border: 1px solid #000;
  text-align: center;
  th {
    vertical-align: middle;
    border: 1px solid #000;
  }
  td {
    border: 1px solid #000;
  }
}
</style>
<script>
import { fetchGames } from '../../api'

export default {
  data () {
    return {
      tabposition: 'left',
      games: '',
      currentGame: 'cqssc',
      gameFormat: {
        cqssc: {
          resultGroups: ['第1球', '第2球', '第3球', '第4球', '第5球'],
          playGroups: [
            { name: '總和', count: 3 },
            { name: '龍虎', count: 1 },
            { name: '前三', count: 1 },
            { name: '中三', count: 1 },
            { name: '後三', count: 1 }]
        }
      },
      historyDatas: [{
        issue_number: '11111111',
        draw_time: '2016-05-03',
        results: ['1', '2', '3', '4', '5'],
        plays: ['34', '大', '雙', '和', '半順', '半順', '半順']
      },
      {
        issue_number: '11111112',
        draw_time: '2016-05-03',
        results: ['1', '2', '3', '4', '5'],
        plays: ['34', '大', '雙', '和', '半順', '半順', '半順']
      },
      {
        issue_number: '11111113',
        draw_time: '2016-05-03',
        results: ['1', '2', '3', '4', '5'],
        plays: ['34', '大', '雙', '和', '半順', '半順', '半順']
      },
      {
        issue_number: '11111114',
        draw_time: '2016-05-03',
        results: ['1', '2', '3', '4', '5'],
        plays: ['34', '大', '雙', '和', '半順', '半順', '半順']
      }
      ]
    }
  },
  computed: {
    isResultGroup () {
      return this.gameFormat[this.currentGame].playGroups.length > 0
    }
  },
  created () {
    fetchGames().then(
      games => {
        this.games = games
      }
    )
  },
  methods: {
    calcWidth (num) {
      return { width: 100 / num + '%' }
    }
  }
}
</script>
