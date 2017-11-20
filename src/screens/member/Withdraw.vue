<template>
<el-row class="account-content">
  <el-col :offset="8" :span="16">
    <el-row>
      <el-form :model="withdrawInfo" :rules="withdrawRules" status-icon ref="withdrawInfo" label-width="120px">
        <el-form-item :label="$t('user.amount')" prop="amount">
          <el-input class="input-width" type="text" v-model.number="withdrawInfo.amount"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.withdraw_password')" prop="withdraw_password">
          <el-input class="input-width" type="password" v-model="withdrawInfo.withdraw_password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitWithdraw">{{$t('action.submit')}}</el-button>
        </el-form-item>
      </el-form>
    </el-row>

  </el-col>
</el-row>
</template>
<script>
import { withdraw } from '../../api'
import { msgFormatter } from '../../utils'
export default {
  name: 'Withdraw',
  data () {
    return {
      withdrawInfo: {
        amount: '',
        withdraw_password: ''
      },
      withdrawRules: {
        amount: [
          { required: true, type: 'number', message: this.$t('validate.required_num'), trigger: 'blur,change' }
        ],
        withdraw_password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      },
      displayMode: true,
      bankOptions: []
    }
  },
  methods: {
    submitWithdraw () {
      this.$refs['withdrawInfo'].validate((valid) => {
        if (valid) {
          withdraw(this.withdrawInfo).then(data => {
            this.$message({
              showClose: true,
              message: msgFormatter(data.message),
              type: 'success'
            })
          }, errorRes => {
            this.$message({
              showClose: true,
              message: msgFormatter(errorRes.response.data.error),
              type: 'error'
            })
          })
        }
      })
    }
  }

}
</script>
