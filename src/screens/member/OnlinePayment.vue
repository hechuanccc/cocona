<template>
<el-row class="account-content">
  <el-col :offset="8" :span="16">
    <el-form class="form" method="post" :action="paymentUrl" :model="user" ref="user" status-icon :rules="rule" label-width="100px">
      <el-form-item required :label="$t('user.amount')" prop="amount">
        <el-input class="input-width" name="amount" v-model.number="user.amount"></el-input>
        <input name="payee" type="hidden" :value="user.payee_id" />
        <input name="payment_type" type="hidden" :value="user.payway" />
        <input name="payment_gateway" type="hidden" :value="user.gateway_id" />
        <input name="token" type="hidden" :value="token" />
        <input name="notify_page" type="hidden" :value="notify_page" />
      </el-form-item>
      <el-form-item>
        <ul class="paymentTypes">
          <li :class="['paymentType', activeType === 'wechat' ? 'active' : '']" @click="selectPaymentType('wechat')">
            <div class="icon weixin-icon"></div>
            <span>{{$t('user.weixin')}}</span>
          </li>
          <li :class="['paymentType', activeType === 'alipay' ? 'active' : '']" @click="selectPaymentType('alipay')">
            <div class="icon alipay-icon"></div>
            <span>{{$t('user.alipay')}}</span>
          </li>
          <li :class="['paymentType', activeType === 'bank' ? 'active' : '']" @click="selectPaymentType('bank')">
            <div class="icon bankcard-icon"></div>
            <span>{{$t('user.bankcard')}}</span>
          </li>
        </ul>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit($event)">{{$t('action.submit')}}</el-button>
      </el-form-item>
    </el-form>
  </el-col>
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
    return {
      user: {
        amount: '',
        payway: '',
        payee_id: '',
        gateway_id: ''
      },
      rule: {
        amount: [
          { type: 'number', message: this.$t('validate.required_num'), trigger: 'blur,change' }
        ]
      },
      activeType: '',
      paymentTypes: [],
      token: Vue.cookie.get('access_token'),
      paymentUrl: urls.payment,
      notify_page: 'xxx'
    }
  },
  created () {
    fetchPaymentType().then(datas => {
      datas.forEach((data, index) => {
        this.paymentTypes[data.name] = data.detail[0] || {}
        this.paymentTypes[data.name].id = data.id
        if (index === 0) {
          this.selectPaymentType(data.name)
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
      this.$refs['user'].validate((valid) => {
        if (valid) {
          this.$refs['user'].$el.submit()
        }
      })
    },
    selectPaymentType (type) {
      this.activeType = type
      let paymentType = this.paymentTypes[type]
      if (paymentType) {
        this.user.payway = paymentType.id
        this.user.payee_id = paymentType.payee_id
        this.user.gateway_id = paymentType.gateway_id
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.form {
  margin-top: 20px;
}
.weixin-bg {
  svg {
    display: inline;
  }
  text-align: center;
  vertical-align: middle;
  line-height: 50px;
  height: 50px;
  width: 50px;
  color: #fff;
  background: #62ad48;
}

.paymentTypes {
  float: left;
}
.paymentType {
  width: 80px;
  float: left;
  text-align: center;
  margin-right: 5px;
  cursor: pointer;
  &:hover {
    background: lighten(#dce5ef, 5%);
  }
  &.active {
    background: #dce5ef;
  }
}
.icon {
  margin: 0 auto;
  width: 50px;
  height: 50px;
  background: no-repeat center center;
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
