<template>
<el-row class="account-content">
  <el-alert
    :title="limitAlert"
    type="info"
    :closable="false">
    </el-alert>
  <div class="form-wp">
    <el-form class="m-t-lg" method="post" :action="paymentUrl" :model="payment" ref="payment" status-icon :rules="rule" label-width="100px">
      <el-form-item :label="$t('user.amount')" prop="amount">
        <el-input class="input-width" name="amount" type="number" v-model.number="payment.amount"></el-input>
        <input name="payee" type="hidden" :value="payment.payee_id" />
        <input name="payment_type" type="hidden" :value="payment.payway" />
        <input name="payment_gateway" type="hidden" :value="payment.gateway_id" />
        <input name="token" type="hidden" :value="token" />
        <input name="notify_page" type="hidden" :value="notify_page" />
      </el-form-item>
      <el-form-item>
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
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit($event)">{{$t('action.submit')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</el-row>
</template>

<script>
import { fetchPaymentType } from '../../api'
import { msgFormatter } from '../../utils'
import urls from '../../api/urls'
import Vue from 'vue'
export default {
  name: 'Payment',
  data () {
    let limitPass = (rule, value, callback) => {
      const lower = this.limit.lower ? parseFloat(this.limit.lower) : null
      const upper = this.limit.upper ? parseFloat(this.limit.upper) : null
      if (lower && value < lower) {
        callback(new Error('必须大于最小充值金额'))
      } else if (upper && value > upper) {
        callback(new Error('必须小于于最大充值金额'))
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
          { validator: limitPass, trigger: 'blur' }
        ]
      },
      activeType: '',
      paymentTypes: [],
      token: Vue.cookie.get('access_token'),
      paymentUrl: urls.payment,
      notify_page: 'xxx'
    }
  },
  computed: {
    limit () {
      const level = this.$store.state.user.level
      return level ? level.online_limit : {}
    },
    limitAlert () {
      let alerts = []
      const lowerAlert = this.limit.lower ? `最小金额: ￥${this.limit.lower}` : null
      const upperAlert = this.limit.upper ? `最大金额: ￥${this.limit.upper}` : null
      if (lowerAlert) {
        alerts.push(lowerAlert)
      }
      if (upperAlert) {
        alerts.push(upperAlert)
      }
      return alerts.join(', ')
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
    }, errorRes => {
      this.$message({
        showClose: true,
        message: msgFormatter(errorRes.response.data.error),
        type: 'error'
      })
    })
  },
  methods: {
    submit (e) {
      this.$refs['payment'].validate((valid) => {
        if (valid) {
          this.$refs['payment'].$el.submit()
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
  float: left;
}
.payment-type {
  width: 80px;
  float: left;
  text-align: center;
  margin-right: 10px;
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
  margin-top: -10px;
  font-size: 12px;
  color: #666;
}
.el-button {
  width: 200px;
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
</style>
