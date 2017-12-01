<template>
<div>
  <el-row class="m-b">
    <el-col :span="8">
      <span class="m-r filter-title">{{$t('user.game_name')}}</span>
      <el-select v-model="selectedGame">
        <el-option
          key="all"
          :label="$t('common.all')"
          value="">
        </el-option>
        <el-option
          v-for="name in gameNames"
          :key="name"
          :label="name"
          :value="name">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="8">
      <span class="m-r filter-title">{{$t('user.issue_number')}}</span>
      <el-select v-model="selectedIssueNumber">
        <el-option
          key="all"
          :label="$t('common.all')"
          value="">
        </el-option>
        <el-option
          v-for="num in issueNumbers"
          :key="num"
          :label="num"
          :value="num">
        </el-option>
      </el-select>
    </el-col>
  </el-row>
  <el-row>
    <el-table v-loading="loading" :data="showRecords" stripe>
      <el-table-column :label="$t('user.game_name')"
        prop="game.display_name">
      </el-table-column>
      <el-table-column
        :label="$t('user.issue_number')"
        prop="issue_number">
      </el-table-column>
      <el-table-column :label="$t('user.play')">
        <template slot-scope="scope">
          <span>{{ `${scope.row.play.playgroup} @ ${scope.row.play.display_name}`}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('user.bet_amount')">
        <template slot-scope="scope">
          <span>{{ scope.row.bet_amount | currency('￥')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('user.profit')">
        <template slot-scope="scope">
          <span>{{ scope.row.profit | placeholder('x') | currency('￥')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('user.odd')"
        prop="odds">
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="betRecords.length > pageSize"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="filtRecords.length">
    </el-pagination>
  </el-row>
</div>

</template>
<script>
import { fetchBetHistory } from '../../api'
import { msgFormatter } from '../../utils'
export default {
  name: 'BetRecord',
  data () {
    return {
      betRecords: [],
      selectedGame: '',
      selectedIssueNumber: '',
      currentPage: 1,
      pageSize: 10,
      loading: false,
      issueNumbers: [],
      gameNames: []
    }
  },
  created () {
    this.loading = true
    fetchBetHistory()
      .then(records => {
        this.betRecords = records
        const issueNumbersSet = new Set()
        const gameNameSet = new Set()
        this.betRecords.forEach(record => {
          const issueNumber = record.issue_number
          if (!issueNumbersSet.has(issueNumber)) {
            issueNumbersSet.add(issueNumber)
            this.issueNumbers.push(issueNumber)
          }
          const gameName = record.game.display_name
          if (!gameNameSet.has(gameName)) {
            gameNameSet.add(gameName)
            this.gameNames.push(gameName)
          }
        })
        this.loading = false
      }, errorRes => {
        this.$message({
          showClose: true,
          message: msgFormatter(errorRes.response.data.error),
          type: 'error'
        })
        this.loading = false
      })
  },
  computed: {
    filtRecords () {
      let gameFilter
      if (this.selectedGame) {
        gameFilter = (value) => {
          return value === this.selectedGame
        }
      } else {
        gameFilter = () => {
          return true
        }
      }
      let issueNumberFilter
      if (this.selectedIssueNumber) {
        issueNumberFilter = (value) => {
          return value === this.selectedIssueNumber
        }
      } else {
        issueNumberFilter = () => {
          return true
        }
      }
      return this.betRecords.filter(rec => {
        return gameFilter(rec.game.display_name) && issueNumberFilter(rec.issue_number)
      })
    },
    showRecords () {
      let groupIdx = (this.currentPage - 1) * this.pageSize
      return this.filtRecords.slice(groupIdx, groupIdx + this.pageSize)
    }
  }
}
</script>
<style lang="scss" scoped>
.filter-title {
  color: #666;
}
</style>

