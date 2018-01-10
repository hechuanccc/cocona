<template>
<el-row>
  <el-row class="m-t-lg">
    <el-col :offset="7" :span="10">
      <el-alert
        v-if="payeeError"
        :title="`${payeeErrorMessage}异常，请联系客服`"
        :type="'error'"
        :closable="false"
        center>
      </el-alert>
    </el-col>
  </el-row>
  <div class="form-wp">
    <el-form class="m-t-lg" method="post" target="_blank" :action="paymentUrl" :model="payment" ref="payment" status-icon :rules="rule" label-width="100px">
      <div>
        <el-form-item class="p-b" :label="$t('user.amount')" prop="amount">
          <el-input class="input-width" name="amount" type="number" v-model.number="payment.amount" @keypress.native="filtAmount" :min="limit.lower" :max="limit.upper"></el-input>
          <div class="min-amount">
            <span class="text">{{$t('user.min_amount')}}:</span>
            <icon scale="0.75" name="jpy"></icon>
            <span class="amount">{{limit.lower}}</span>
          </div>
          <input name="payee" type="hidden" :value="payment.payee_id" />
          <input name="payment_type" type="hidden" :value="payment.payway" />
          <input name="payment_gateway" type="hidden" :value="payment.gateway_id" />
          <input name="token" type="hidden" :value="token" />
          <input name="notify_page" type="hidden" :value="notify_page" />
        </el-form-item>
      </div>
      <div class="payment text-center m-b-lg">
        <ul class="payment-types">
          <li :class="['payment-type', activeType === 'wechat' ? 'active' : '']" @click="select('wechat')">
            <i class="icon weixin-icon"></i>
            <span class="name">{{$t('user.weixin')}}</span>
          </li>
          <li :class="['payment-type', activeType === 'alipay' ? 'active' : '']" @click="select('alipay')">
            <i class="icon alipay-icon"></i>
            <span class="name">{{$t('user.alipay')}}</span>
          </li>
          <li :class="['payment-type', activeType === 'bank' ? 'active' : '']" @click="select('bank')">
            <i class="icon bankcard-icon"></i>
            <span class="name">{{$t('user.bankcard')}}</span>
          </li>
        </ul>
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
        <p>支付金额：{{this.payment.amount|currency('￥')}}</p>
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
import 'vue-awesome/icons/jpy'
export default {
  name: 'Payment',
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
      payment: {
        amount: '',
        payway: '',
        payee_id: '',
        gateway_id: ''
      },
      rule: {
        amount: [
          { required: true, type: 'number', message: this.$t('validate.required_num'), trigger: 'blur' },
          { validator: limitPass, trigger: 'blur,change' }
        ]
      },
      activeType: '',
      paymentTypes: {},
      token: Vue.cookie.get('access_token'),
      paymentUrl: urls.payment,
      notify_page: `${window.location.origin}/#/account/online_payment_success/`,
      isSubmit: false
    }
  },
  computed: {
    limit () {
      const level = this.$store.state.user.level
      return level ? level.online_limit : {}
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
    payeeError () {
      return this.payment.gateway_id === undefined
    },
    payeeErrorMessage () {
      switch (this.activeType) {
        case 'wechat':
          return this.$t('user.weixin')
        case 'alipay':
          return this.$t('user.alipay')
        case 'bank':
          return this.$t('user.bankcard')
      }
    }
  },
  created () {
    fetchPaymentType().then(datas => {
      datas.forEach((data, index) => {
        this.paymentTypes[data.name] = data.detail[0] || {}
        this.paymentTypes[data.name].id = data.id
        if (index === 0) {
          this.select(data.name)
        }
      })
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
      this.activeType = type
      let paymentType = this.paymentTypes[type]
      if (paymentType) {
        this.payment.payway = paymentType.id
        this.payment.payee_id = paymentType.payee_id
        this.payment.gateway_id = paymentType.gateway_id
      }
    },
    filtAmount,
    closeDetailDialog () {
      this.isSubmit = false
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
  display: inline-block;
  height: 12px;
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
