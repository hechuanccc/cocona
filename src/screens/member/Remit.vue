<template>
<div>
  <el-row>
    <el-tabs v-model="activeName" class="indented-tab" type="card" @tab-click="chooseRemitWay">
      <el-tab-pane :label="$t('user.bank')" name="bank">
        <el-row class="account-content">
          <el-col :offset="8" :span="16">
            <el-form :model="remitData" status-icon ref="bankForm" :rules="remitDataRules" label-width="128px">
              <el-form-item :label="$t('user.remit_bank')" ref="bankPayee" prop="remit_info.remit_payee">
                <el-select
                  v-model="remitData.remit_info.remit_payee"
                  class="input-width"
                  :placeholder="$t('common.please_select')">
                  <el-option
                    v-for="payee in remitPayeesWithoutQRCode"
                    :key="payee.id"
                    :label="payee.payee_name||payee.nickname"
                    :value="payee.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('user.remit_account')">
                {{selectedPayee.account}}
              </el-form-item>
              <el-form-item :label="$t('user.remit_address')">
                {{selectedPayee.address}}
              </el-form-item>
              <el-form-item :label="$t('user.remit_despositor')" prop="remit_info.depositor">
                <el-input class="input-width" v-model="remitData.remit_info.depositor"></el-input>
              </el-form-item>
              <el-form-item :label="$t('user.remit_time')" prop="remit_info.deposited_at">
                <el-date-picker
                  v-model="remitData.remit_info.deposited_at"
                  style="width:200px"
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
                <el-button type="primary" @click="submitRemitForm('bankForm')">{{$t('action.submit')}}</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane :label="'QR Code'" name="qrcode">
        <el-row class="account-content">
          <el-col :offset="8" :span="16">
            <el-form :model="remitData" status-icon ref="qrcodeForm" :rules="remitDataRules" label-width="128px">
              <el-form-item :label="$t('user.payway')" ref="qrcodePayee" prop="remit_info.remit_payee">
                <el-select
                  v-model="remitData.remit_info.remit_payee"
                  class="input-width"
                  :placeholder="$t('common.please_select')">
                  <el-option
                    v-for="payee in remitPayeesWithQRCode"
                    :key="payee.id"
                    :label="payee.payee_name||payee.nickname"
                    :value="payee.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-show="selectedPayee.qr_code">
                <img :src="selectedPayee.qr_code" alt="">
              </el-form-item>
              <el-form-item :label="$t('user.remit_despositor')" prop="remit_info.depositor">
                <el-input class="input-width" v-model="remitData.remit_info.depositor"></el-input>
              </el-form-item>
              <el-form-item :label="$t('user.remit_time')" prop="remit_info.deposited_at">
                <el-date-picker
                  v-model="remitData.remit_info.deposited_at"
                  style="width:200px"
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
                <el-button type="primary" @click="submitRemitForm('qrcodeForm')">{{$t('action.submit')}}</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-row>

</div>

</template>
<script>
import { fetchRemitpayee, remit } from '../../api'
import { msgFormatter } from '../../utils'
export default {
  name: 'Remit',
  data () {
    return {
      activeName: 'bank',
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
    selectedPayee () {
      let payees = this.remitPayees.filter(payee => payee.id === this.remitData.remit_info.remit_payee)
      if (payees.length > 0) {
        return payees[0]
      } else {
        return {}
      }
    },
    remitPayeesWithQRCode () {
      return this.remitPayees.filter(payee => payee.qr_code)
    },
    remitPayeesWithoutQRCode () {
      return this.remitPayees.filter(payee => !payee.qr_code)
    }
  },
  created () {
    fetchRemitpayee().then(payees => {
      this.remitPayees = payees
    })
  },
  methods: {
    submitRemitForm (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          remit(this.remitData).then(data => {
            this.$message({
              showClose: true,
              message: this.$t('message.submit_success'),
              type: 'success'
            })
            this.$refs[form].resetFields()
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
    chooseRemitWay () {
      this.remitData.remit_info.remit_payee = ''
      this.$refs['bankForm'].clearValidate()
      this.$refs['qrcodeForm'].clearValidate()
    }
  }
}
</script>


