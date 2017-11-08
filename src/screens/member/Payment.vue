<template>
<div>
  <el-row>
    <el-col :span="16">
      <el-form class="form" target="_blank" method="post" :action="paymentUrl" :model="user" label-width="100px">
        <el-form-item :label="'支付方式'" prop="payway">
          <el-radio :label="paymentType" v-for="(paymentType, index) in paymentTypes" :key="paymentType.id" v-model="selectedType">{{paymentType.display_name}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('user.amount')" prop="amount">
          <el-input name="amount" type="text" v-model.number="user.amount"></el-input>
          <input name="payee" type="hidden" :value="user.payee" />
          <input name="payment_type" type="hidden" :value="user.payment_type" />
          <input name="paymnet_gateway" type="hidden" :value="user.paymnet_gateway" />
          <input name="token" type="hidden" v-model.number="user.token" />
          <input name="notify_page" type="hidden" v-model.number="user.notify_page" />
        </el-form-item>
        <el-form-item>
          <el-button native-type="submit" @click="submit($event)">{{$t('action.submit')}}</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</div>
</template>

<script>
import { fetchPaymentType } from '../../api'
import urls from '../../api/urls'
export default {
  name: 'Payment',
  data () {
    return {
      paymentTypes: [],
      selectedType: '',
      selectedPayment: {

      },
      paymentUrl: urls.payment,
      user: {
        amount: '',
        payee: '',
        payment_type: '',
        payment_gateway: '',
        token: '',
        notify_page: ''
      }
    }
  },
  created () {
    fetchPaymentType().then(datas => {
      this.paymentTypes = datas
    })
  },
  methods: {
    submit (e) {

    }
  }
}
</script>


<style lang="scss" scoped>
.form {
  margin-top: 20px;
}
</style>
