<template>
<div>
  <el-row>
    <el-col :span="16">
      <el-form class="form" method="post" :action="paymentUrl" :model="user" ref="user" status-icon :rules="rule" label-width="100px">
        <el-form-item required :label="'支付方式'" prop="payway">
          <el-radio :label="paymentType.id" v-for="(paymentType, index) in paymentTypes" :key="paymentType.id" v-model="user.payway">{{paymentType.display_name}}</el-radio>
        </el-form-item>
        <el-form-item required :label="$t('user.amount')" prop="amount">
          <el-input name="amount" v-model.number="user.amount"></el-input>
          <input name="payee" type="hidden" :value="user.payee_id" />
          <input name="payment_type" type="hidden" :value="user.payway" />
          <input name="payment_gateway" type="hidden" :value="user.gateway_id" />
          <input name="token" type="hidden" :value="token" />
          <input name="notify_page" type="hidden" :value="notify_page" />
        </el-form-item>
        <el-form-item v-show="hasGateway" required :label="'Gate Way'" prop="gateway_id">
          <el-radio-group v-if="hasGateway" v-model="selectedGateWay">
            <el-radio :label="index" v-for="(gateway, index) in currentGateways" :key="index">{{gateway.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit($event)">{{$t('action.submit')}}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</div>
</template>

<script>
import { fetchPaymentType } from '../../api'
import urls from '../../api/urls'
import Vue from 'vue'
export default {
  name: 'Payment',
  data () {
    const paywayValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.required')))
      } else {
        callback()
      }
    }
    const gatewayValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('validate.required')))
      } else {
        callback()
      }
    }
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
        ],
        payway: [
          { validator: paywayValidator, trigger: 'blur' }
        ],
        gateway_id: [
          { validator: gatewayValidator, trigger: 'blur' }
        ]
      },
      selectedGateWay: '',
      paymentTypes: [],
      gatewaysPerPayment: {

      },
      token: Vue.cookie.get('access_token'),
      paymentUrl: urls.payment,
      notify_page: 'xxx'
    }
  },
  created () {
    fetchPaymentType().then(datas => {
      this.paymentTypes = datas
      datas.forEach(data => {
        this.gatewaysPerPayment[data.id] = data.detail
      })
    })
  },
  computed: {
    currentGateways () {
      return this.gatewaysPerPayment[this.user.payway]
    },
    hasGateway () {
      return this.currentGateways && this.currentGateways.length > 0
    }
  },
  watch: {
    'user.payway': function () {
      this.$refs['user'].validateField('payway')
    },
    'selectedGateWay': function () {
      this.user.gateway_id = this.currentGateways[this.selectedGateWay].gateway_id
      this.user.payee_id = this.currentGateways[this.selectedGateWay].payee_id
      this.$refs['user'].validateField('gateway_id')
    }
  },
  methods: {
    submit (e) {
      this.$refs['user'].validate((valid) => {
        if (valid) {
          this.$refs['user'].$el.submit()
        }
      })
    }
  }
}
</script>


<style lang="scss" scoped>
.form {
  margin-top: 20px;
}
</style>
