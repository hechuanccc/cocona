<template>
<el-row>
  <el-col :offset="4" :span="16">
    <el-form class="form" method="post" :action="paymentUrl" :model="user" ref="user" status-icon :rules="rule" label-width="100px">
      <el-form-item required :label="'支付方式'" prop="payway">
        <el-radio :label="index" v-for="(paymentType, index) in paymentTypes" :key="paymentType.id" v-model="selectedPaymentTypeIndex">{{paymentType.display_name}}</el-radio>
      </el-form-item>
      <el-form-item required :label="$t('user.amount')" prop="amount">
        <el-input class="input-width" name="amount" v-model.number="user.amount"></el-input>
        <input name="payee" type="hidden" :value="user.payee_id" />
        <input name="payment_type" type="hidden" :value="user.payway" />
        <input name="payment_gateway" type="hidden" :value="user.gateway_id" />
        <input name="token" type="hidden" :value="token" />
        <input name="notify_page" type="hidden" :value="notify_page" />
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
        ]
      },
      selectedPaymentTypeIndex: '',
      paymentTypes: [],
      token: Vue.cookie.get('access_token'),
      paymentUrl: urls.payment,
      notify_page: 'xxx'
    }
  },
  created () {
    fetchPaymentType().then(datas => {
      this.paymentTypes = datas.filter(data => {
        if (data.detail.length === 0) {
          return false
        } else {
          data.gateway_id = data.detail[0].gateway_id
          data.payee_id = data.detail[0].payee_id
          return true
        }
      })
    })
  },
  watch: {
    'selectedPaymentTypeIndex': function (index) {
      const paymentType = this.paymentTypes[index]
      this.user.payway = paymentType.id
      this.user.payee_id = paymentType.payee_id
      this.user.gateway_id = paymentType.gateway_id
      this.$refs['user'].validateField('payway')
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
