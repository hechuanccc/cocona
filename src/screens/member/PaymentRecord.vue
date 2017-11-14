<template>
  <div>
    <el-table v-loading="loading" :data="displayRecord" stripe>
      <el-table-column :label="$t('user.payment_time')">
          <template slot-scope="scope">
          <span>{{ scope.row.created_at | moment("YYYY-MM-DD HH:mm:ss")}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" :label="$t('user.payment_amount')">
        <template slot-scope="scope">
          <span>{{ `$${scope.row.amount}`}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="transaction_type.display_name" :label="$t('user.payment_way')">
      </el-table-column>
      <el-table-column :label="$t('user.status')">
        <template slot-scope="scope">
          <span :class="color(scope.row.status)">{{ scope.row.status | statusFilter}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page.sync="currentPage"
      :page-size="pageSize"
      layout="total, prev, pager, next"
      :total="paymentRecords.length">
    </el-pagination>
  </div>
</template>
<script>
import { fetchPaymentRecord } from '../../api'
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
      loading: true
    }
  },
  created () {
    fetchPaymentRecord().then(datas => {
      this.paymentRecords = datas
      this.loading = false
    })
  },
  computed: {
    displayRecord () {
      let groupIdx = (this.currentPage - 1) * this.pageSize
      return this.paymentRecords.slice(groupIdx, groupIdx + this.pageSize)
    }
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
    }
  }
}
</script>


