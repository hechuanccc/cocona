<template>
  <div>
    <el-table v-loading="loading" :data="displayRecord" stripe>
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
      v-if="paymentRecords.length > pageSize"
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="paymentRecords.length">
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
      }
    }
  },
  data () {
    return {
      paymentRecords: [],
      currentPage: 1,
      pageSize: 10,
      loading: false
    }
  },
  computed: {
    transactionType () {
      if (this.$route.name === 'PaymentRecord') {
        return 'online_pay,remit'
      } else {
        return 'withdraw'
      }
    },
    displayRecord () {
      let groupIdx = (this.currentPage - 1) * this.pageSize
      return this.paymentRecords.slice(groupIdx, groupIdx + this.pageSize)
    }
  },
  watch: {
    '$route': function () {
      this.fetchTransactionRecord()
    }
  },
  created () {
    this.fetchTransactionRecord()
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
    fetchTransactionRecord () {
      this.loading = true
      fetchTransactionRecord(this.transactionType).then(datas => {
        this.paymentRecords = datas
        this.loading = false
      }, errorMsg => {
        this.$message({
          showClose: true,
          message: msgFormatter(errorMsg),
          type: 'error'
        })
        this.loading = false
      })
    }
  }
}
</script>


