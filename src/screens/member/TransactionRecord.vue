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
        <template slot-scope="scope">
          <span v-if="scope.row.red_envelope_type">{{ scope.row.red_envelope_type | envelopFilter}}</span>
          <span v-else>{{ scope.row.transaction_type.display_name }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('user.status')">
        <template slot-scope="scope">
          <span :class="color(scope.row.status)">{{ statusFilter(scope.row.status) }}</span>
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
export default {
  name: 'PaymentRecord',
  filters: {
    envelopFilter (value) {
      switch (value) {
        case 1:
          return '发送红包'
        case 2:
          return '接收红包'
        case 3:
          return '返还红包'
        default:
          return '红包'
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
        return 'discount,envelope'
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
    statusFilter (value) {
      switch (value) {
        case 1:
          return this.$t('user.success')
        case 2:
          return this.$t('user.failed')
        case 3:
          return this.$t('user.ongoing')
        case 4:
          return this.$t('user.cancelled')
        case 5:
          return this.$t('user.declined')
        case 6:
          return this.$t('user.ongoing')
        default:
          return ''
      }
    },
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


