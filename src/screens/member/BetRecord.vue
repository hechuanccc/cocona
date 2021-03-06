<template>
  <div>
    <el-row class="m-b">
      <el-form :inline="true" :model="conditions">
        <el-form-item :label="$t('user.betdate')" prop="startDate" :error="startDateValidate">
          <el-date-picker
            v-model="startDate"
            type="date"
            :id="'date1'"
            :name="'date1'"
            :placeholder="$t('user.choose_date')"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>~</el-form-item>
        <el-form-item prop="endDate" :error="endDateValidate">
          <el-date-picker
            v-model="endDate"
            :id="'date2'"
            :name="'date2'"
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
          :width="100"
          :label="$t('user.game_name')"
          prop="game.display_name">
        </el-table-column>
        <el-table-column
          :width="190"
          :label="$t('user.issue_number')"
          prop="issue_number">
          <template slot-scope="scope">
            <span>{{ scope.row.match || scope.row.issue_number }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :width="125"
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
            <div>{{ `${scope.row.play.playgroup} @ ${scope.row.play.display_name}`}}</div>
            <div v-if="scope.row.bet_options.options">{{`共${scope.row.bet_options.opts_combos_count}组 # ${scope.row.bet_options.options.join(',')}`}}</div>
          </template>
        </el-table-column>
        <el-table-column
          :width="135"
          :label="$t('user.bet_amount')">
          <template slot-scope="scope">
            <span>{{ scope.row.bet_amount | currency('￥')}}</span>
            <span v-if="scope.row.prepaid_amount">(+{{scope.row.prepaid_amount}})</span>
          </template>
        </el-table-column>
        <el-table-column
          :width="90"
          :label="$t('gameIntro.return_rate')">
          <template slot-scope="scope">
            <span>{{ scope.row.play.return_rate && scope.row.return_amount ? `${scope.row.return_amount}(${Math.floor(scope.row.play.return_rate*10000)/100}%)`: '0' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :width="125"
          :label="$t('user.profit')">
          <template slot-scope="scope">
            <span v-if="scope.row.profit === null">{{ statusFilter(scope.row.remarks) }}</span>
            <span v-else :class="profitColor(scope.row.profit)">{{ scope.row.profit | currency('￥')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :width="65"
          :label="$t('user.odd')"
          prop="odds">
        </el-table-column>
      </el-table>
      <el-table v-if="betRecordTotal.length > 0 && !isUnsettled" :data="betRecordTotal" :show-header="false">
        <el-table-column
          :width="100">
        </el-table-column>
        <el-table-column
          :width="190">
        </el-table-column>
        <el-table-column
          :width="125">
        </el-table-column>
        <el-table-column
          :min-width="150"
          prop="text">
        </el-table-column>
        <el-table-column
          :width="135">
          <template slot-scope="scope">
            <span>{{ scope.row.amount | currency('￥')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :width="90">
        </el-table-column>
        <el-table-column
          :width="125">
          <template slot-scope="scope">
            <span :class="profitColor(scope.row.profit)">{{ scope.row.profit | currency('￥')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :width="65">
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
import { fetchBetHistory, fetchBetTotal } from '../../api'
import { msgFormatter } from '../../utils'
export default {
  name: 'BetRecord',
  props: {
    lazyFetch: {
      type: Boolean
    }
  },
  data () {
    const today = this.$moment().format('YYYY-MM-DD')
    return {
      betRecords: [],
      betRecordTotal: [],
      selectedGame: '',
      currentPage: 1,
      pageSize: 20,
      loading: false,
      allGames: [],
      isUnsettled: false,
      totalCount: 0,
      offset: 0,
      startDateValidate: '',
      endDateValidate: '',
      startDate: today,
      endDate: today
    }
  },
  created () {
    if (!this.lazyFetch) {
      this.initFetchBetHistory({...this.conditions, status: 'win,lose,tie,ongoing,cancelled,no_draw'})
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
        status: this.isUnsettled ? 'ongoing,cancelled,no_draw' : 'win,lose,tie,ongoing,cancelled,no_draw',
        created_at_0: this.startDate,
        created_at_1: this.endDate
      }
    }
  },
  watch: {
    'lazyFetch': function (lazyFetch) {
      if (!lazyFetch) {
        this.initFetchBetHistory({...this.conditions, status: 'win,lose,tie,ongoing,cancelled,no_draw'})
      }
    },
    'conditions': function (conditions) {
      let startDate = this.$moment(conditions.created_at_0)
      let endDate = this.$moment(conditions.created_at_1)
      if (startDate && endDate && startDate.diff(endDate) > 0) {
        this.startDateValidate = this.$t('validate.date_range_validate')
        this.endDateValidate = ' '
      } else {
        this.startDateValidate = ''
        this.endDateValidate = ''
        this.initFetchBetHistory(conditions)
      }
    }
  },
  methods: {
    statusFilter (value) {
      if (value === 'no_draw') {
        return this.$t('user.no_draw')
      } else if (value === 'cancelled') {
        return this.$t('user.cancelled')
      } else {
        return this.$t('user.unsettled')
      }
    },
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
      this.getSummary()
      fetchBetHistory({ ...option, offset: 0 })
        .then(data => {
          if (data.results) {
            this.totalCount = data.count
            this.betRecords = data.results
          } else {
            this.totalCount = data.length
            this.betRecords = data
          }

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
      this.getSummary()
      fetchBetHistory({ ...this.conditions, offset: (currentPage - 1) * this.pageSize }).then(data => {
        this.betRecords = data.results || data

        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    getSummary () {
      fetchBetTotal({startdate: this.startDate || '', enddate: this.endDate || '', game: this.selectedGame}).then(res => {
        const total = res.results[0]
        if (total) {
          this.betRecordTotal = [{
            text: '总计',
            amount: total.amount,
            profit: total.profit
          }]
        } else {
          this.betRecordTotal = []
        }
      }).catch(errorMsg => {
        this.$message({
          showClose: true,
          message: msgFormatter(errorMsg),
          type: 'error'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/vars.scss";
.gain {
  color: $red;
}
.loss {
  color: $green;
}
.unsettle {
  color: $primary;
}
</style>

