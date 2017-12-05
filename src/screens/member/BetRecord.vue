<template>
<div>
  <el-row class="m-b">
    <el-form :inline="true">
      <el-form-item :label="$t('user.game_name')">
        <el-date-picker
          v-model="selectedDate"
          type="date"
          :placeholder="$t('user.choose_date')"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('user.issue_number')">
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
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="isUnsettled">{{$t('user.unsettled_period')}}</el-checkbox>
      </el-form-item>
    </el-form>
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
          <span :class="profitColor(scope.row.profit)">{{ scope.row.profit | currency('￥') | placeholder($t('user.unsettled'))}}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('user.odd')"
        prop="odds">
      </el-table-column>
      <el-table-column
        :label="$t('user.betdate')"
        prop="created_at">
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
      selectedDate: '',
      selectedIssueNumber: '',
      currentPage: 1,
      pageSize: 10,
      loading: false,
      issueNumbers: [],
      gameNames: [],
      isUnsettled: false
    }
  },
  created () {
    this.loading = true
    fetchBetHistory()
      .then(records => {
        this.betRecords = records
        const issueNumbersSet = new Set()
        this.betRecords.forEach(record => {
          const issueNumber = record.issue_number
          if (!issueNumbersSet.has(issueNumber)) {
            issueNumbersSet.add(issueNumber)
            this.issueNumbers.push(issueNumber)
          }
          record.created_at = this.$moment(record.created_at).format('YYYY-MM-DD')
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
      let filtRecords = this.betRecords
      if (this.selectedDate) {
        filtRecords = filtRecords.filter(record => record.created_at === this.selectedDate)
      }
      if (this.selectedIssueNumber) {
        filtRecords = filtRecords.filter(record => record.issue_number === this.selectedIssueNumber)
      }
      if (this.isUnsettled) {
        filtRecords = filtRecords.filter(record => !record.profit && record.profit !== 0)
      }
      return filtRecords
    },
    showRecords () {
      let groupIdx = (this.currentPage - 1) * this.pageSize
      return this.filtRecords.slice(groupIdx, groupIdx + this.pageSize)
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

