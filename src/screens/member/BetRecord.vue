<template>
<div>
  <el-row class="m-b">
    <el-form :inline="true">
      <el-form-item :label="$t('user.betdate')">
        <el-date-picker
          v-model="selectedDate"
          type="date"
          :placeholder="$t('user.choose_date')"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('user.game_name')">
        <el-select v-model="selectedGame">
          <el-option
            key="all"
            :label="$t('common.all')"
            value="">
          </el-option>
          <el-option
            v-for="game in allGames"
            :key="game.id"
            :label="game.display_name"
            :value="game.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="isUnsettled">{{$t('user.unsettled_period')}}</el-checkbox>
      </el-form-item>
    </el-form>
  </el-row>
  <el-row>
    <el-table v-loading="loading" :data="betRecords" stripe>
      <el-table-column
        :width="130"
        :label="$t('user.game_name')"
        prop="game.display_name">
      </el-table-column>
      <el-table-column
        :width="135"
        :label="$t('user.issue_number')"
        prop="issue_number">
      </el-table-column>
      <el-table-column
        :width="130"
        :label="$t('user.betdate')"
        prop="created_at">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | moment("YYYY-MM-DD")}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :min-width="150"
        :label="$t('user.play')">
        <template slot-scope="scope">
          <span>{{ `${scope.row.play.playgroup} @ ${scope.row.play.display_name}`}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :width="135"
        :label="$t('user.bet_amount')">
        <template slot-scope="scope">
          <span>{{ scope.row.bet_amount | currency('￥')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :width="100"
        :label="$t('gameIntro.return_rate')">
        <template slot-scope="scope">
          <span>{{ scope.row.play.return_rate && scope.row.return_amount ? `${scope.row.return_amount}(${scope.row.play.return_rate}%)`: '0' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :width="135"
        :label="$t('user.profit')">
        <template slot-scope="scope">
          <span v-if="scope.row.profit === null">{{ scope.row.remarks | statusFilter}}</span>
          <span v-else :class="profitColor(scope.row.profit)">{{ scope.row.profit | currency('￥')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :width="65"
        :label="$t('user.odd')"
        prop="odds">
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="totalCount > pageSize"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="totalCount"
      @current-change="handlePageChange">
    </el-pagination>
  </el-row>
</div>

</template>
<script>
import { fetchBetHistory } from '../../api'
import { msgFormatter } from '../../utils'
import Vue from 'vue'
export default {
  name: 'BetRecord',
  props: {
    lazyFetch: {
      type: Boolean
    }
  },
  filters: {
    statusFilter (value) {
      if (value === 'no_draw') {
        return Vue.t('user.no_draw')
      } else if (value === 'cancelled') {
        return Vue.t('user.cancelled')
      } else {
        return Vue.t('user.unsettled')
      }
    }
  },
  data () {
    return {
      betRecords: [],
      selectedDate: '',
      selectedGame: '',
      currentPage: 1,
      pageSize: 20,
      loading: false,
      allGames: [],
      isUnsettled: false,
      totalCount: 0,
      nextUrl: '',
      previousUrl: '',
      offset: 0
    }
  },
  created () {
    if (!this.lazyFetch) {
      this.initFetchBetHistory({status: 'win,lose,tie'})
      this.allGames = this.$store.state.state
      if (!this.allGames || this.allGames.length === 0) {
        this.$store.dispatch('fetchGames').then(games => {
          this.allGames = this.$store.state.games
        })
      }
    }
  },
  computed: {
    conditions () {
      return {
        game: this.selectedGame,
        bet_date: this.selectedDate,
        status: this.isUnsettled ? 'ongoing,cancelled,no_draw' : 'win,lose,tie'
      }
    }
  },
  watch: {
    'lazyFetch': function (lazyFetch) {
      if (!lazyFetch) {
        this.initFetchBetHistory()
      }
    },
    'conditions': function (conditions) {
      this.initFetchBetHistory(conditions)
    }
  },
  methods: {
    profitColor (amount) {
      if (amount > 0) {
        return 'gain'
      } else if (amount < 0) {
        return 'loss'
      } else {
        return 'unsettle'
      }
    },
    initFetchBetHistory (option) {
      this.loading = true
      fetchBetHistory({ ...option, offset: 0 })
        .then(data => {
          this.totalCount = data.count
          this.betRecords = data.results
          this.currentPage = 1
          this.loading = false
        }, errorMsg => {
          this.$message({
            showClose: true,
            message: msgFormatter(errorMsg),
            type: 'error'
          })
          this.loading = false
        })
    },
    handlePageChange (currentPage) {
      this.loading = true
      fetchBetHistory({ ...this.conditions, offset: (currentPage - 1) * this.pageSize }).then(data => {
        this.betRecords = data.results
        this.loading = false
      }, () => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/vars.scss";
.gain {
  color: $green;
}
.loss {
  color: $red;
}
.unsettle {
  color: $primary;
}
</style>

