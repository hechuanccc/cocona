<template>
  <el-row>

    <el-alert
      v-if="updateStatus !== 0"
      :title="message"
      :type="updateStatus === 1 ? 'success' : 'error'"
      :closable="false"
      center />

    <el-alert
      v-if="user && !user.bank && systemConfig.needBankinfo && parseInt(systemConfig.regPresentAmount)"
      type="success"
      :closable="false"
      :title="'添加银行卡信息即可领取注册彩金 ￥' + systemConfig.regPresentAmount"
      center >
      <el-popover
        placement="bottom-start"
        title="注意"
        width="300"
        trigger="hover">
        <ul style="list-style: square inside; color: #999;">
          <li>同一银行卡信息最多仅可领取一次</li>
          <li>同一 IP 最多仅可领取一次，请勿重复注册</li>
          <li>本平台保留对本次活动的全部解释权</li>
        </ul>
        <i class="el-icon-info" slot="reference"></i>
      </el-popover>
    </el-alert>
    <el-col :offset="8" :span="16">
      <el-form :model="bankInfo" class="m-t-lg" status-icon ref="bankInfo" :rules="bankInfoRules" label-width="120px">
        <el-form-item :label="$t('user.bank')" prop="bank">
          <el-select :disabled="!!user.bank" class="input-width" v-model="bankInfo.bank" placeholder="请选择">
            <el-option
              v-for="option in bankOptions"
              :key="option.key"
              :label="option.value"
              :value="option.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('user.city')" prop="city">
          <el-input :disabled="!!user.bank" class="input-width" type="text" v-model="bankInfo.city"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.province')" prop="province">
          <el-input :disabled="!!user.bank" class="input-width" type="text" v-model="bankInfo.province"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.username')" prop="account">
          <el-input :disabled="!!user.bank" class="input-width" type="text" v-model="bankInfo.account"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="!!user.bank" :loading="loading" class="input-width" type="primary" @click="submitBankInfo">{{$t('action.submit')}}</el-button>
          <div class="tips" v-if="user.bank">您的银行卡信息已提交，如需修改请联系客服</div>
          <div v-else>银行卡信息提交之后需联系客服方可修改，请谨慎填写。</div>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import { validateBankAccount } from '../../validate'
import { fetchBank, updateUser } from '../../api'
import { msgFormatter } from '../../utils'
import { mapGetters } from 'vuex'
export default {
  name: 'BankInfo',
  data () {
    const bankAccountValidator = (rule, value, callback) => {
      if (!validateBankAccount(value)) {
        callback(new Error(this.$t('validate.account_validate')))
      } else {
        callback()
      }
    }
    return {
      bankInfo: {
        bank: '',
        city: '',
        province: '',
        account: ''
      },
      loading: false,
      updateStatus: 0,
      message: '',
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
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: bankAccountValidator, trigger: ['blur', 'change'] }
        ]
      },
      bankOptions: []
    }
  },
  computed: {
    originBankInfo () {
      return this.$store.state.user.bank
    },
    systemConfig () {
      return this.$store.state.systemConfig
    },
    ...mapGetters([
      'user'
    ])
  },
  watch: {
    'originBankInfo': function (info) {
      this.setBankInfo(info)
    }
  },
  created () {
    fetchBank(true).then(options => {
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
          this.loading = true
          updateUser({
            id: this.$store.state.user.id,
            bank: {
              ...this.bankInfo
            }
          }).then(data => {
            this.loading = false
            this.$store.commit('SET_USER', {
              user: data
            })
            this.updateStatus = 1
            this.$refs.bankInfo.clearValidate()
            this.message = '银行信息已更新'
            setTimeout(() => {
              this.updateStatus = 0
            }, 5000)
          }, errorMsg => {
            this.loading = false
            this.updateStatus = -1
            this.message = msgFormatter(errorMsg)
          })
        }
      })
    },
    setBankInfo (info) {
      if (!info) {
        return
      }
      Object.keys(this.bankInfo).forEach(key => {
        this.bankInfo[key] = info[key]
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tips {
  color: #999;
  font-size: 12px;
}
.el-row /deep/ .el-icon-info {
  margin-left: 5px;
}
</style>
