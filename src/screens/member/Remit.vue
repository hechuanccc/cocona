<template>
  <el-row class="remit-area">
    <el-tabs v-model="activeName" class="indented-tab" type="card" @tab-click="chooseRemitWay">
      <el-tab-pane  :label="item.remit_type == 1 ? bankMap[String(item.bank)] : item.remit_type == 2 ? '微信' : '支付宝'" :name="String(item.id)" v-for="(item, index) in remitPayees" :key="index">
        <el-alert
          :title="limitAlert"
          type="info"
          :closable="false">
        </el-alert>
        <el-row class="m-t-lg" v-if="item.remit_type == 1">
          <el-col :push="2" :span="7">
            <p class="m-l m-b-sm bank-tip">入款银行资料</p>
            <ul class="list-group m-l">
              <li class="list-group-item clearfix">
                <span class="text-muted fl">银行账号</span>
                <span class="fr bank-account">{{item.account}}</span>
              </li>
              <li class="list-group-item clearfix">
                <span class="text-muted fl">银行</span>
                <span class="fr">{{bankMap[item.bank]}}</span>
              </li>
              <li class="list-group-item clearfix">
                <span class="text-muted fl">银行开户行</span>
                <span class="fr">{{item.address}}</span>
              </li>
              <li class="list-group-item clearfix">
                <span class="text-muted fl">银行开户名</span>
                <span class="fr">{{item.payee_name}}</span>
              </li>
            </ul>
            <ul class="info-tips m-l">
              <li>1. 您在给公司入款时请仔细核对入款信息</li>
              <li>2. 请认真填写存款人信息，以免核对出错</li>
              <li>3. 填写入款表单完成后，可在财务纪录当中查看入款状态</li>
            </ul>
          </el-col>
          <el-col :push="2" class="m-l-xlg" :span="14">
            <el-form class="m-t-lg" :model="remitData" status-icon :ref="item.id" :rules="remitDataRules" label-width="128px">
              <el-form-item :label="$t('user.remit_name')" prop="remit_info.remit_payee">
                <el-input :key="item.id" clearable class="input-width" v-model="remitData.remit_info.depositor" :placeholder="$t('user.remit_please_name')"></el-input>
              </el-form-item>
              <el-form-item :label="$t('user.remit_time')" prop="remit_info.deposited_at" class="input-width">
                <el-date-picker
                  v-model="remitData.remit_info.deposited_at"
                  style="width:270px"
                  type="datetime"
                  :placeholder="$t('common.select_date_time')"
                  format="yyyy-MM-dd HH:mm"
                  :id="String(index)"
                  value-format="yyyy-MM-dd HH-mm">
                </el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('user.amount')" prop="amount">
                <el-input clearable class="input-width" placeHolder="请输入存款金额" v-model.number="remitData.amount" type="number" @keypress.native="filtAmount" :min="limit.lower" :max="limit.upper"></el-input>
              </el-form-item>
              <el-form-item :label="$t('common.memo')" prop="memo">
                <el-input clearable class="input-width" v-model="remitData.memo"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button class="m-r-lg" size="medium" type="primary" @click="submitRemitForm(item.id)">提交入款资料</el-button>
                <router-link v-show="successPayeeId" to="/account/finance/payment_record">查看入款记录</router-link>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
        <el-row class="m-t-lg" v-else>
          <el-col :push="3" :span="7" class="m-t-lg">
             <img width="200" height="200" :src="item.qr_code" alt="">
             <p class="text-info m-t-lg">请用手机扫描此二维码进行充值</p>
          </el-col>
          <el-col :push="2" class="m-l-lg" :span="14">
            <el-form class="m-t-lg" :model="remitData" status-icon :ref="item.id" :rules="remitDataRules" label-width="128px">
              <el-form-item :label="$t('user.remit_despositor')" prop="remit_info.depositor">
                <el-input class="input-width" v-model="remitData.remit_info.depositor"></el-input>
              </el-form-item>
              <el-form-item :label="$t('user.remit_time')" prop="remit_info.deposited_at">
                <el-date-picker
                  class="input-width"
                  v-model="remitData.remit_info.deposited_at"
                  style="width:270px"
                  type="datetime"
                  :placeholder="$t('common.select_date_time')"
                  format="yyyy-MM-dd HH:mm"
                  :id="String(index)"
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
                <el-button class="m-r-lg" type="primary" @click="submitRemitForm(item.id)">提交入款资料</el-button>
                <router-link v-show="successPayeeId" to="/account/finance/payment_record">查看入款记录</router-link>
              </el-form-item>
            </el-form>
          </el-col>
        </el-row>
      </div>

      </el-tab-pane>
    </el-tabs>
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
      activeName: '',
      successPayeeId: '',
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
    remitPayeesWithQRCode () {
      return this.remitPayees.filter(payee => payee.qr_code)
    },
    remitPayeesWithoutQRCode () {
      return this.remitPayees.filter(payee => !payee.qr_code)
    }
  },
  created () {
    fetchBank().then(banks => {
      banks.forEach(bank => {
        this.bankMap[bank.key] = bank.value
      })
      fetchRemitpayee().then(payees => {
        this.remitPayees = payees
        this.activeName = this.remitPayees.length ? String(this.remitPayees[0].id) : ''
        if (this.remitPayees.length) {
          this.chooseRemitWay(this.remitPayees[0])
        }
      })
    })
  },
  methods: {
    submitRemitForm (payeeId) {
      this.$refs[payeeId][0].validate((valid) => {
        if (valid) {
          remit(this.remitData).then(data => {
            this.successPayeeId = this.remitData.remit_info.remit_payee
            this.$message({
              showClose: true,
              message: this.$t('message.submit_success'),
              type: 'success'
            })
            this.$refs[payeeId][0].resetFields()
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
    chooseRemitWay (tab, e) {
      this.remitData.remit_info.remit_payee = tab.name || tab.id
      this.successPayeeId = ''
      for (let key in this.$refs) {
        this.$refs[key] instanceof Array && this.$refs[key][0] && this.$refs[key][0].resetFields && this.$refs[key][0].resetFields()
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .remit-area {
    font-size: 14px;
    .input-width {
      width: 270px;
    }
    .text-info {
      color: #31708f;
    }
  }
  .text-muted {
    color: #777;
  }
  .bank-tip {
    font-size: 14px;
    font-weight: bold;
  }
  .list-group {
    padding-left: 0;
    margin-bottom: 20px;
    .list-group-item:first-child {
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    .list-group-item {
      position: relative;
      display: block;
      padding: 10px 15px;
      margin-bottom: -1px;
      background-color: #fff;
      border: 1px solid #ddd;
      span {
        font-size: 14px;
      }
      .bank-account {
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
</style>