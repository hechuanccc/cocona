<template>
<div>
  <el-row>
    <el-col :span="8">
      <span class="title">{{$t('user.issue_number')}}</span>
      <el-select v-model="selectedIssueNumber" placeholder="请选择">
        <el-option
          v-for="num in issueNumbers"
          :key="num"
          :label="num"
          :value="num">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="8">
      <span class="title">當前遊戲</span>
      <el-select v-model="selectedGame" placeholder="请选择">
        <el-option
          v-for="game in allGames"
          :key="game.id"
          :label="game.display_name"
          :value="game.id">
        </el-option>
      </el-select>
    </el-col>

  </el-row>
  <el-row>
    <el-table :data="betRecords" stripe>
      <el-table-column
        :label="$t('user.issue_number')"
        prop="issue_number">
      </el-table-column>
      <el-table-column :label="$t('user.play')">
        <template slot-scope="scope">
          <span>{{ `${scope.row.play.playgroup} ${scope.row.play.display_name}`}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('user.bet_amount')"
        prop="bet_amount">
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="betRecords.length">
    </el-pagination>
  </el-row>
</div>

</template>
<script>
import { fetchBetHistory } from '../../api'
export default {
  name: 'BetRecord',
  data () {
    return {
      betRecords: [],
      selectedGame: '',
      selectedIssueNumber: '',
      currentPage: 1,
      pageSize: 10,
      loading: true
    }
  },
  created () {

  },
  computed: {
    allGames () {
      let games = this.$store.state.games
      if (games.length > 0) {
        this.selectedGame = games[0].id
        return games
      } else {
        this.$store.dispatch('fetchGames')
        return []
      }
    },
    issueNumbers () {
      const s = new Set()
      this.betRecords.forEach(record => {
        s.add(record.issue_number)
      })
      return Array.from(s)
    }
  },
  watch: {
    'selectedGame': function (id) {
      fetchBetHistory(id)
        .then(res => {
          this.betRecords = res
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.title{
  margin-right: 20px;
}
</style>

