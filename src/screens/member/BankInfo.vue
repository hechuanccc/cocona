<template>
  <el-row>
    <el-col :offset="8" :span="16">
      <el-form :model="bankInfo" status-icon ref="bankInfo" :rules="bankInfoRules" label-width="120px">
        <el-form-item :label="$t('user.bank')" prop="bank">
          <el-select v-model="bankInfo.bank" placeholder="请选择">
            <el-option
              v-for="option in bankOptions"
              :key="option.key"
              :label="option.value"
              :value="option.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('user.city')" prop="city">
          <el-input class="input-width" type="text" v-model="bankInfo.city"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.province')" prop="province">
          <el-input class="input-width" type="text" v-model="bankInfo.province"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.username')" prop="account">
          <el-input class="input-width" type="text" v-model="bankInfo.account"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitBankInfo">{{$t('action.submit')}}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { fetchBank, updateUser } from '../../api'
import { msgFormatter } from '../../utils'
export default {
  name: 'BankInfo',
  data () {
    return {
      bankInfo: {
        bank: '',
        city: '',
        province: '',
        account: ''
      },
      withdrawInfo: {
        amount: '',
        withdraw_password: ''
      },
      bankInfoRules: {
        bank: [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        city: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        province: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        account: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      },
      withdrawRules: {
        amount: [
          { required: true, type: 'number', message: this.$t('validate.required_num'), trigger: 'blur,change' }
        ],
        withdraw_password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      },
      bankOptions: []
    }
  },
  computed: {
    originBankInfo () {
      return this.$store.state.user.bank
    }
  },
  watch: {
    'originBankInfo': function (info) {
      this.setBankInfo(info)
    }
  },
  created () {
    fetchBank().then(options => {
      this.bankOptions = options
    })
    const bankInfo = this.$store.state.user.bank
    if (bankInfo) {
      this.setBankInfo(bankInfo)
    }
  },
  methods: {
    submitBankInfo () {
      this.$refs['bankInfo'].validate((valid) => {
        if (valid) {
          updateUser({
            id: this.$store.state.user.id,
            bank: {
              ...this.bankInfo
            }
          }).then(data => {
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
    },
    setBankInfo (info) {
      Object.keys(this.bankInfo).forEach(key => {
        this.bankInfo[key] = info[key]
      })
    }
  }
}
</script>
