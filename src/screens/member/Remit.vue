<template>
  <el-row>
    <Tabs :items="tabs" @clicked="getCurrentContent"/>
      <div class="tab-pane" v-show="nowTab === 'bank'">
        <el-alert
          :title="limitAlert"
          type="info"
          :closable="false">
        </el-alert>
        <el-row>
          <el-col :offset="8" :span="16">
            <el-form class="m-t-lg" :model="remitData" status-icon ref="bankForm" :rules="remitDataRules" label-width="128px">
              <el-form-item :label="$t('user.realname')" ref="bankPayee" prop="remit_info.remit_payee">
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
              <el-form-item :label="$t('user.remit_bank')" ref="bankPayee" prop="remit_info.remit_payee">
                {{bankMap[selectedPayee.bank]}}
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
              <el-form-item :label="$t('user.remit_time')" prop="remit_info.deposited_at" class="input-width">
                <el-date-picker
                  v-model="remitData.remit_info.deposited_at"
                  type="datetime"
                  :placeholder="$t('common.select_date_time')"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH-mm">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('user.amount')" prop="amount">
                <el-input class="input-width" v-model.number="remitData.amount" type="number" @keypress.native="filtAmount" :min="limit.lower" :max="limit.upper"></el-input>
              </el-form-item>
              <el-form-item :label="$t('common.memo')" prop="memo">
                <el-input class="input-width" v-model="remitData.memo"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" class="submit" @click="submitRemitForm('bankForm')">{{$t('action.submit')}}</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>
      <div class="tab-pane"  v-show="nowTab === 'qrcode'">
        <el-alert
          :title="limitAlert"
          type="info"
          :closable="false">
        </el-alert>
        <el-row>
          <el-col :offset="8" :span="16">
            <el-form class="m-t-lg" :model="remitData" status-icon ref="qrcodeForm" :rules="remitDataRules" label-width="128px">
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
                  class="input-width"
                  v-model="remitData.remit_info.deposited_at"
                  type="datetime"
                  :placeholder="$t('common.select_date_time')"
                  format="yyyy-MM-dd HH:mm"
                  value-format="yyyy-MM-dd HH-mm">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('user.amount')" prop="amount">
                <el-input class="input-width" v-model.number="remitData.amount" type="number" @keypress.native="filtAmount" :min="limit.lower" :max="limit.upper"></el-input>
              </el-form-item>
              <el-form-item :label="$t('common.memo')" prop="memo">
                <el-input class="input-width" v-model="remitData.memo"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="submit" type="primary" @click="submitRemitForm('qrcodeForm')">{{$t('action.submit')}}</el-button>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>



  </el-row>
</template>
<script>
import { fetchRemitpayee, remit, fetchBank } from '../../api'
import { msgFormatter, filtAmount } from '../../utils'
import Tabs from '../../components/Tabs.vue'
export default {
  name: 'Remit',
  components: {
    Tabs
  },
  data () {
    let limitPass = (rule, value, callback) => {
      const lower = this.limit.lower ? parseFloat(this.limit.lower) : null
      const upper = this.limit.upper ? parseFloat(this.limit.upper) : null
      if (lower && value < lower) {
        callback(new Error(this.$t('validate.min_amount_validate')))
      } else if (upper && value > upper) {
        callback(new Error(this.$t('validate.max_amount_validate')))
      } else {
        callback()
      }
    }
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
          { required: true, type: 'integer', message: this.$t('validate.required_num'), trigger: 'blur' },
          { validator: limitPass, trigger: 'blur,change' }
        ]
      },
      bankMap: {},
      nowTab: 'bank',
      tabs: [
        {
          label: this.$t('user.bank'),
          key: 'bank'
        },
        {
          label: 'QR Code',
          key: 'qrcode'
        }
      ]
    }
  },
  computed: {
    limit () {
      const level = this.$store.state.user.level
      return level ? level.remit_limit : {}
    },
    limitAlert () {
      let alerts = []
      const lowerAlert = this.limit.lower ? `${this.$t('user.min_amount')}: ￥${this.limit.lower}` : null
      const upperAlert = this.limit.upper ? `${this.$t('user.max_amount')}: ￥${this.limit.upper}` : null
      if (lowerAlert) {
        alerts.push(lowerAlert)
      }
      if (upperAlert) {
        alerts.push(upperAlert)
      }
      return alerts.join(', ')
    },
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
    fetchBank().then(banks => {
      banks.forEach(bank => {
        this.bankMap[bank.key] = bank.value
      })
    })
  },
  methods: {
    getCurrentContent (e) {
      this.nowTab = e.key
    },
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
          }, errorMsg => {
            this.$message({
              showClose: true,
              message: msgFormatter(errorMsg),
              type: 'error'
            })
          })
        }
      })
    },
    filtAmount,
    chooseRemitWay () {
      this.remitData.remit_info.remit_payee = ''
      this.$refs['bankForm'].clearValidate()
      this.$refs['qrcodeForm'].clearValidate()
    }
  }
}
</script>
