<template>
  <div>
    <el-table v-loading="loading" :data="transactionRecords" stripe>
      <el-table-column :label="$t('user.transaction_time')">
        <template slot-scope="scope">
          <span>{{ scope.row.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" :label="$t('user.transaction_amount')">
        <template slot-scope="scope">
          <span>{{ scope.row.amount | currency('￥')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transaction_type.display_name" :label="$t('user.transaction_way')">
      </el-table-column>
      <el-table-column :label="$t('user.status')">
        <template slot-scope="scope">
          <span :class="color(scope.row.status)">{{ scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="totalCount > limit"
      :current-page.sync="currentPage"
      :page-size="limit"
      layout="total, prev, pager, next"
      :total="totalCount"
      @current-change="handlePageChange">
    </el-pagination>
  </div>
</template>
<script>
import { fetchTransactionRecord } from '../../api'
import { msgFormatter } from '../../utils'
import Vue from 'vue'
export default {
  name: 'PaymentRecord',
  filters: {
    statusFilter (value) {
      switch (value) {
        case 1:
          return Vue.t('user.success')
        case 2:
          return Vue.t('user.failed')
        case 3:
          return Vue.t('user.ongoing')
        case 4:
          return Vue.t('user.cancelled')
        case 5:
          return Vue.t('user.declined')
        case 6:
          return Vue.t('user.ongoing')
        default:
          return ''
      }
    }
  },
  data () {
    return {
      transactionRecords: [],
      currentPage: 1,
      limit: 20,
      totalCount: 0,
      loading: false
    }
  },
  computed: {
    transactionType () {
      if (this.$route.name === 'PaymentRecord') {
        return 'online_pay,remit'
      } else if (this.$route.name === 'DiscountRecord') {
        return 'discount'
      } else {
        return 'withdraw'
      }
    }
  },
  watch: {
    '$route': function () {
      this.initFetchTransactionRecord()
    }
  },
  created () {
    this.initFetchTransactionRecord()
  },
  methods: {
    color (value) {
      if (value === 1) {
        return 'green'
      } else if (value === 3) {
        return ''
      } else {
        return 'red'
      }
    },
    initFetchTransactionRecord () {
      this.loading = true
      fetchTransactionRecord({
        transaction_type: this.transactionType,
        offset: 0,
        limit: this.limit
      }).then(data => {
        this.totalCount = data.count
        this.transactionRecords = data.results
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
      fetchTransactionRecord({
        transaction_type: this.transactionType,
        offset: (currentPage - 1) * this.limit,
        limit: this.limit
      }).then(data => {
        this.transactionRecords = data.results
        this.loading = false
      }, () => {
        this.loading = false
      })
    }
  }
}
</script>


