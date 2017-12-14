<template>
  <div class="m-t-lg">
    <el-row class="account-content" v-if="user.bank">
      <el-col :span="8" >
        <div class="bank-info clearfix">
          <el-row>
            <div>
              <el-col :span="8">
                <label>当前账户余额</label>
              </el-col>
              <el-col :span="16">{{user.balance||0 | currency('￥')}}</el-col>
            </div>
            <div v-if="limit.lower">
              <el-col :span="8">
                <label>最小取款金额</label>
              </el-col>
              <el-col :span="16">{{limit.lower | currency('￥')}}</el-col>
            </div>
            <div v-if="limit.upper">
              <el-col :span="8">
                <label>最大取款金额</label>
              </el-col>
              <el-col :span="16">{{limit.upper | currency('￥')}}</el-col>
            </div>
          </el-row>
          <h3 class="m-t">你的取款银行信息如下，如需修改请联系客服</h3>
          <div>
            <el-col :span="8">
              <label>银行</label>
            </el-col>
            <el-col :span="16">{{user.bank.bank}}</el-col>
          </div>
          <div>
            <el-col :span="8">
              <label>账号</label>
            </el-col>
            <el-col :span="16">{{user.bank.account}}</el-col>
          </div>
          <div>
            <el-col :span="8">
              <label>收款人</label>
            </el-col>
            <el-col :span="16">{{user.real_name}}</el-col>
          </div>
        </div>
      </el-col>
      <el-col :span="12" :offset="2">
        <el-alert
          v-if="updateStatus !== 0"
          :title="message"
          :type="updateStatus === 1 ? 'success' : 'error'"
          :closable="false"
          center>
        </el-alert>
        <el-form :model="withdrawInfo" class="m-t" :rules="withdrawRules" status-icon ref="withdrawInfo" label-width="120px">
          <el-form-item :label="$t('user.withdraw_amount')" prop="amount">
            <el-input class="input-width" type="number" v-model.number="withdrawInfo.amount" @keypress.native="filtAmount" :min="limit.lower" :max="limit.upper"></el-input>
          </el-form-item>
          <el-form-item :label="$t('user.withdraw_password')" prop="withdraw_password">
            <el-input class="input-width" name="withdraw_password" type="password" v-model="withdrawInfo.withdraw_password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="input-width" type="primary" @click="submitWithdraw">{{$t('action.submit')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div v-else>
      <el-alert
        title="您需要提供银行信息才能申请取款"
        type="warning"
        :closable="false"
        description=""
        show-icon>
      </el-alert>
      <el-button class="submit" size="medium" type="primary" @click="$router.push('/account/my/bank_info')">添加银行信息</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { withdraw } from '../../api'
import { msgFormatter, filtAmount } from '../../utils'
export default {
  name: 'Withdraw',
  data () {
    let limitPass = (rule, value, callback) => {
      const lower = this.limit.lower ? parseFloat(this.limit.lower) : null
      const upper = this.limit.upper ? parseFloat(this.limit.upper) : null
      if (lower && value < lower) {
        callback(new Error(this.$t('validate.min_withdraw_amount_validate')))
      } else if (upper && value > upper) {
        callback(new Error(this.$t('validate.max_withdraw_amount_validate')))
      } else {
        callback()
      }
    }
    return {
      withdrawInfo: {
        amount: '',
        withdraw_password: ''
      },
      updateStatus: 0,
      message: '',
      withdrawRules: {
        amount: [
          { required: true, type: 'number', message: this.$t('validate.required_num'), trigger: 'blur' },
          { validator: limitPass, trigger: 'blur,change' }
        ],
        withdraw_password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur,change' }
        ]
      },
      displayMode: true,
      bankOptions: []
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ]),
    limit () {
      const level = this.$store.state.user.level
      return level ? level.withdraw_limit : {}
    }
  },
  methods: {
    submitWithdraw () {
      this.$refs['withdrawInfo'].validate((valid) => {
        if (valid) {
          withdraw(this.withdrawInfo).then(data => {
            this.updateStatus = 1
            this.message = '取款信息已提交'
            this.withdrawInfo.withdraw_password = ''
            this.$refs.withdrawInfo.resetFields()
            setTimeout(() => {
              this.updateStatus = 0
            }, 3000)
          }, errorMsg => {
            this.withdrawInfo.withdraw_password = ''
            this.updateStatus = -1
            this.message = msgFormatter(errorMsg)
          })
        }
      })
    },
    filtAmount
  }

}
</script>

<style lang="scss" scoped>
.bank-info {
  font-size: 13px;
  line-height: 26px;
  border-radius: 4px;
  padding: 20px;
  background: #f5f5f5;
  width: 300px;
  margin: 0 auto;
  h3 {
    color: #999;
  }
  label {
    color: #999;
  }
}
.submit {
  margin: 30px auto;
  display: block;
  width: 200px;
}
</style>
