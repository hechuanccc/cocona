<template>
  <el-row class="account-content">
    <el-col :offset="8" :span="16">
      <el-form :model="remitData" status-icon ref="remitData" :rules="remitDataRules" label-width="128px">
        <el-form-item :label="$t('user.remitpayee')" prop="remit_info.remit_payee">
          <el-select v-model="remitData.remit_info.remit_payee" :placeholder="$t('common.please_select')">
            <el-option
              v-for="payee in remitPayees"
              :key="payee.id"
              :label="payee.payee_name||payee.nickname"
              :value="payee.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="remitData.remit_info.remit_payee"  v-show="hasQRCode">
          <img :src="selectedPayee.qr_code" alt="">
        </el-form-item>
        <el-form-item v-if="remitData.remit_info.remit_payee" v-show="!hasQRCode" :label="$t('user.remit_account')">
          {{selectedPayee.account}}
        </el-form-item>
        <el-form-item v-if="remitData.remit_info.remit_payee" v-show="!hasQRCode" :label="$t('user.remit_address')">
          {{selectedPayee.address}}
        </el-form-item>
        <el-form-item :label="$t('user.remit_despositor')" prop="remit_info.depositor">
          <el-input class="input-width" v-model="remitData.remit_info.depositor"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.remit_time')" prop="remit_info.deposited_at">
          <el-date-picker
            v-model="remitData.remit_info.deposited_at"
            type="datetime"
            :placeholder="$t('common.select_date_time')"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH-mm">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('user.amount')" prop="amount">
          <el-input class="input-width" v-model.number="remitData.amount"></el-input>
        </el-form-item>
        <el-form-item :label="$t('common.memo')" prop="memo">
          <el-input class="input-width" v-model="remitData.memo"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitRemitForm">{{$t('action.submit')}}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
<script>
import { fetchRemitpayee, remit } from '../../api'
import { msgFormatter } from '../../utils'
export default {
  name: 'Remit',
  data () {
    return {
      remitPayees: [],
      remitData: {
        amount: '',
        memo: '',
        remit_info: {
          remit_payee: '',
          deposited_at: '',
          depositor: ''
        }
      },
      remitDataRules: {
        'remit_info.remit_payee': [
          { required: true, type: 'number', message: this.$t('validate.required'), trigger: 'change' }
        ],
        'remit_info.depositor': [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        'remit_info.deposited_at': [
          { required: true, message: this.$t('validate.required'), trigger: 'change' }
        ],
        amount: [
          { required: true, type: 'number', message: this.$t('validate.required_num'), trigger: 'blur,change' }
        ]
      }
    }
  },
  computed: {
    payeeTable () {
      const table = {}
      this.remitPayees.forEach(payee => {
        table[payee.id] = payee
      })
      return table
    },
    selectedPayee () {
      return this.payeeTable[this.remitData.remit_info.remit_payee]
    },
    hasQRCode () {
      return this.selectedPayee.qr_code
    }
  },
  created () {
    fetchRemitpayee().then(payees => {
      this.remitPayees = payees
    })
  },
  methods: {
    submitRemitForm () {
      this.$refs['remitData'].validate((valid) => {
        if (valid) {
          remit(this.remitData).then(data => {
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


