<template>
<el-row>
  <el-row class="m-t">
    <el-col :offset="7" :span="10">
      <el-alert
        v-if="activeType === 'none'"
        title="目前暂无可用支付方式"
        :type="'error'"
        :closable="false"
        center>
      </el-alert>
      <el-alert
        v-else-if="payeeError"
        :title="`${payeeErrorMessage}异常，请联系客服`"
        :type="'error'"
        :closable="false"
        center>
      </el-alert>
    </el-col>
  </el-row>
  <el-tabs v-model="activeType" class="indented-tab" type="card" @tab-click="choosePaymentType">
    <el-tab-pane class="text-center" :label="item.display_name" :name="item.name" v-for="(item, index) in paymentTypes" :key="index">
      <el-radio-group v-if="item.detail.length>1" v-model="selectedPayment.payee_id">
        <el-radio v-for="(payment, index) in item.detail" :key="index" :label="payment.payee_id" @change="selectPayment(payment)">{{`${item.display_name}${index+1}`}}</el-radio>
      </el-radio-group>
    </el-tab-pane>
  </el-tabs>
  <div class="form-wp">
    <el-form class="m-t-lg" method="post" target="_blank" :action="paymentUrl" :model="selectedPayment" ref="payment" status-icon :rules="rule" label-width="90px">
      <div>
        <el-form-item class="p-b" label="选择银行" v-if="selectedPayment.banks.length">
          <el-select class="input-width" :default-first-option="true" v-model="bank" >
            <el-option
              v-for="item in selectedPayment.banks"
              :key="item.code"
              :label="item.name"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="balance" :label="$t('user.balance')">
          {{$store.state.user.balance | currency('￥') }}
        </el-form-item>
        <el-form-item class="p-b" :label="$t('user.amount')" prop="amount">
          <el-input class="input-width" name="amount" type="number" v-model.number="selectedPayment.amount" @keypress.native="filtAmount" :min="lower" :max="upper"></el-input>
          <div class="min-amount">
            <span class="text">{{$t('user.min_amount')}}:</span>
            <icon scale="0.75" name="yen-sign"></icon>
            <span class="amount">{{lower}}</span>
            <template v-if="upper">
              &nbsp;
              <span class="text">{{$t('user.max_amount')}}:</span>
              <icon scale="0.75" name="yen-sign"></icon>
              <span class="amount">{{upper}}</span>
            </template>
          </div>
          <input name="payee" type="hidden" :value="selectedPayment.payee_id" />
          <input name="bank" type="hidden" :value="bank" v-if="bank!==''"/>
          <input name="payment_type" type="hidden" :value="selectedPayment.payway" />
          <input name="payment_gateway" type="hidden" :value="selectedPayment.gateway_id" />
          <input name="token" type="hidden" :value="token" />
          <input name="notify_page" type="hidden" :value="notify_page" />
        </el-form-item>
      </div>
      <div class="submit-button text-center">
        <el-button class="input-width" type="primary" :disabled="payeeError" @click="submit($event)">{{$t('action.submit')}}</el-button>
      </div>
    </el-form>
    <el-dialog
      :title="'支付信息'"
      :visible="isSubmit"
      width="360px"
      @close="closeDetailDialog()"
      center>
      <div>
        <p>支付方式：在线支付</p>
        <p>支付金额：{{selectedPayment.amount|currency('￥')}}</p>
        <p>1. 成功付款后将会自动到帐，并弹出到帐提示。</p>
        <p>2. 长时间无反应，请联系客服。</p>
      </div>
      <slot name="footer">
        <el-row class="m-t-lg">
          <el-col :span="12" class="text-center">
            <router-link to="/account/finance/payment_record">
              <el-button class="dialog-button" type="primary">{{$t('user.payment_record')}}</el-button>
            </router-link>
          </el-col>
          <el-col :span="12" class="text-center">
            <a :href="$store.state.systemConfig.customerServiceUrl" target="_blank">
              <el-button class="dialog-button" type="primary">在线客服</el-button>
            </a>
          </el-col>
        </el-row>
      </slot>
    </el-dialog>
  </div>
</el-row>
</template>

<script>
import { fetchPaymentType } from '../../api'
import { msgFormatter, filtAmount } from '../../utils'
import urls from '../../api/urls'
import Vue from 'vue'
import 'vue-awesome/icons/yen-sign'
export default {
  name: 'OnlinePayment',
  data () {
    let limitPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('validate.required')))
      } else {
        const lower = this.lower ? parseFloat(this.lower) : null
        const upper = this.upper ? parseFloat(this.upper) : null
        if (lower && value < lower) {
          callback(new Error(this.$t('validate.min_amount_validate')))
        } else if (upper && value > upper) {
          callback(new Error(this.$t('validate.max_amount_validate')))
        } else {
          callback()
        }
      }
    }
    return {
      selectedPayment: {
        amount: '',
        payway: '',
        payee_id: '',
        gateway_id: '',
        online_limit: {},
        banks: []
      },
      rule: {
        amount: [
          { required: true, type: 'number', validator: limitPass, trigger: 'blur' }
        ]
      },
      bank: '',
      activeType: '',
      payee: {},
      paymentTypes: [],
      token: Vue.cookie.get('access_token'),
      paymentUrl: urls.payment,
      notify_page: `${window.location.origin}/#/account/online_payment_success/`,
      isSubmit: false
    }
  },
  watch: {
    'selectedPayment.banks': function (newBanks) {
      this.bank = newBanks.length ? newBanks[0].code : ''
    }
  },
  computed: {
    upper () {
      return this.selectedPayment.online_limit.upper || undefined
    },
    lower () {
      return this.selectedPayment.online_limit.lower || 0
    },
    payeeError () {
      return this.selectedPayment.gateway_id === undefined
    },
    payeeErrorMessage () {
      const currentPayment = this.paymentTypes.find(payment => payment.name === this.activeType)
      if (currentPayment) {
        return currentPayment.display_name
      }
      return ''
    }
  },
  created () {
    fetchPaymentType().then(datas => {
      if (datas.length === 0) {
        this.selectedPayment.gateway_id = undefined
        this.activeType = 'none'
      } else {
        this.paymentTypes = datas
        datas.forEach((data, index) => {
          let payment = data.detail[0]
          if (payment) {
            this.payee[data.name] = payment
            if (!this.selectedPayment.gateway_id) {
              this.select(data.name)
            }
          } else {
            this.payee[data.name] = {}
          }
        })
      }
    }, errorMsg => {
      this.$message({
        showClose: true,
        message: msgFormatter(errorMsg),
        type: 'error'
      })
    })
  },
  methods: {
    submit (e) {
      this.$refs['payment'].validate((valid) => {
        if (valid) {
          this.$refs['payment'].$el.submit()
          this.isSubmit = true
        }
      })
    },
    select (type) {
      if (this.activeType === 'none') {
        return
      }
      this.activeType = type
      let paymentType = this.payee[type]
      if (paymentType) {
        this.selectedPayment.payway = paymentType.payment_type
        this.selectedPayment.payee_id = paymentType.payee_id
        this.selectedPayment.gateway_id = paymentType.gateway_id
        this.selectedPayment.online_limit = paymentType.online_limit
        if (paymentType.banks) {
          this.selectedPayment.banks = paymentType.banks
        }
      } else {
        this.selectedPayment.gateway_id = undefined
      }
      if (this.selectedPayment.amount !== '') {
        this.$refs.payment.validate(() => {})
      }
    },
    selectPayment (payment) {
      this.selectedPayment.gateway_id = payment.gateway_id
      this.selectedPayment.online_limit = payment.online_limit
      if (payment.banks) {
        this.selectedPayment.banks = payment.banks
      }
      if (this.selectedPayment.amount !== '') {
        this.$refs.payment.validate(() => {})
      }
    },
    filtAmount,
    closeDetailDialog () {
      this.isSubmit = false
    },
    choosePaymentType (tab, e) {
      this.select(tab.name)
    }
  }
}
</script>


<style lang="scss" scoped>
.form-wp {
  width: 400px;
  margin: auto;
}

.payment-types {
  display: inline-block;
  width: 320px;
  text-align: justify;
  &:after {
    display: inline-block;
    content: "";
    width: 100%;
  }
}
.payment-type {
  display: inline-block;
  width: 50px;
  height: 50px;
  text-align: center;
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
  &.active {
    background: #eee;
  }
}
.icon {
  display: block;
  margin: 0 auto;
  width: 50px;
  height: 50px;
  background: no-repeat center center;
}
.name {
  display: block;
  font-size: 12px;
  color: #666;
}

.weixin-icon {
  background-image: url("../../assets/weixin.png");
}
.alipay-icon {
  background-image: url("../../assets/alipay.png");
}
.bankcard-icon {
  background-image: url("../../assets/credit-card.png");
}
.dialog-button {
  width: 150px;
}
.min-amount {
  position: absolute;
  top: 10px;
  left: 230px;
  height: 12px;
  width: 200px;
  line-height: 12px;
  font-size: 10px;
  color: #9b9b9b;
  .text {
    vertical-align: text-top;
  }
  .amount {
    vertical-align: text-top;
    letter-spacing: 0px;
  }
}
</style>
