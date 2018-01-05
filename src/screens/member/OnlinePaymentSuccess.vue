<template>
<el-row>
  <div class="box">
    <div class="loading" v-if="loading">
      <icon name="spinner" spin scale="3"></icon>
      <p>交易正在查询当中, 请稍后</p>
    </div>
    <div v-else-if="noResult">
      <span class="el-icon-warning"></span>
      <p>查询本次交易暂无结果，点击按钮继续查询</p>
      <div class="btn-box">
        <el-button type="warning" @click.native="fetchTransactionStatus">继续查询</el-button>
      </div>
    </div>
    <div v-else>
      <span class="el-icon-success"></span>
      <p>充值成功!</p>
      <div class="btn-box">
        <el-button class="success-btn" type="success" @click.native="$router.push({name: 'OnlinePayment'})">继续充值</el-button>
        <el-button type="warning" @click.native="$router.push('/account/finance/payment_record')">充值记录</el-button>
      </div>
    </div>
  </div>
</el-row>
</template>

<script>
import { fetchTransactionStatus } from '../../api'
import Vue from 'vue'
export default {
  name: 'Payment',
  data () {
    return {
      token: Vue.cookie.get('access_token'),
      BillNo: this.$route.query.BillNo,
      loading: true,
      noResult: false,
      n: 0
    }
  },
  computed: {
  },
  created () {
    this.fetchTransactionStatus(this.BillNo)
  },
  methods: {
    fetchTransactionStatus (id) {
      let transactionId = id || this.BillNo
      this.n++
      this.noResult = false
      this.loading = true
      setTimeout(() => {
        fetchTransactionStatus(transactionId).then(result => {
          if (result.length && result[0].status === 1) {
            this.loading = false
            this.noResult = false
            this.n = 0
          } else {
            if (this.n === 6) {
              this.loading = false
              this.n = 0
              this.noResult = true
              return
            }
            this.fetchTransactionStatus(this.BillNo)
          }
        })
      }, 2000)
    }
  }
}
</script>

<style lang="scss" scoped>
  .box {
    text-align: center;
    .el-icon-loading {
      font-size: 40px;
    }
    .loading {
      padding-top: 40px;
      display: inline-block;
    }
    .el-icon-success, .el-icon-warning {
      color: #3c763d; font-size: 60px;
      padding-top: 40px;
    }
    .el-icon-warning {
      color: #8a6d3b;
    }
    .btn-box {
      padding-top: 30px;
      .success-btn {
        margin-right: 40px;
      }
    }
  }
</style>
