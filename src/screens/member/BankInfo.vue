<template>
  <el-row>
    <el-alert
      v-if="updateStatus !== 0"
      :title="message"
      :type="updateStatus === 1 ? 'success' : 'error'"
      :closable="false"
      center>
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
          <el-button :disabled="!!user.bank" class="input-width submit" type="primary" @click="submitBankInfo">{{$t('action.submit')}}</el-button>
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
          { validator: bankAccountValidator, trigger: 'blur,change' }
        ]
      },
      bankOptions: []
    }
  },
  computed: {
    originBankInfo () {
      return this.$store.state.user.bank
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
            this.$store.commit('SET_USER', {
              user: data
            })
            this.updated = 1
            this.$refs.bankInfo.clearValidate()
            this.message = '银行信息已更新'
            setTimeout(() => {
              this.updateStatus = 0
            }, 3000)
          }, errorMsg => {
            this.updateStatus = -1
            this.message = msgFormatter(errorMsg)
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
<style lang="scss" scoped>
  .tips {
    color: #999;
    font-size: 12px;
  }
</style>
