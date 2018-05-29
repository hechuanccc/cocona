<template>
  <el-row class="row-bg">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>注册会员</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="greetmoney-box" v-if="parseInt(regPresentAmount)">
        <span class="greet-money" v-if="!needBankinfo">
          现在注册立领{{regPresentAmount | currency('￥', 0)}} 红包
        </span>
        <div class="greet-money" v-else>
          注册账号并填写银行信息即可领取 {{regPresentAmount | currency('￥', 0)}} 红包
          <el-popover
            placement="bottom-start"
            title="注意"
            width="300"
            trigger="hover">
            <ul style="list-style: square inside; color: #999;">
              <li>登录后请到「我的账号」> 「银行信息」填写</li>
              <li>同一银行卡信息最多仅可领取一次</li>
              <li>同一 IP 最多仅可领取一次，请勿重复注册</li>
              <li>本平台保留对本次活动的全部解释权</li>
            </ul>

            <i class="el-icon-info" slot="reference"></i>
          </el-popover>
        </div>
      </div>
      <div class="register-container">
        <el-form :model="user" status-icon :rules="rules" ref="user" label-width="120px">
          <el-form-item :label="$t('user.username')" prop="username">
            <el-input class="input-width" :maxlength="15" v-model="user.username" auto-complete="off" @blur="clearSpace(user, 'username')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('user.password')" prop="password">
            <el-input class="input-width" :maxlength="15" type="password" v-model="user.password" auto-complete="off" @blur="clearSpace(user, 'password')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('user.confirm_password')" prop="confirmation_password">
            <el-input class="input-width" :maxlength="15" type="password" v-model="user.confirmation_password" @blur="clearSpace(user, 'confirmation_password')" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('user.realname')" prop="real_name">
            <el-input class="input-width" v-model="user.real_name"></el-input>
          </el-form-item>
          <el-form-item :label="$t('user.phone')" prop="phone">
            <el-input class="input-width" v-model="user.phone" @blur="clearSpace(user, 'phone')"></el-input>
          </el-form-item>
          <el-form-item :label="'短信验证码'" prop="sms_code" v-if="systemConfig.sms_validation_enabled !== 'false'">
            <el-input class="input-width" :maxlength="6" v-model="user.sms_code" @blur="clearSpace(user, 'sms_code')">
              <el-button slot="suffix" type="info" class="captcha" @click="fetchSmsCode">获取</el-button>
            </el-input>
            <div class="sms-tip m-t" v-if="sms_tip">{{sms_tip}}</div>
          </el-form-item>
          <el-form-item :label="$t('user.qq')" prop="qq">
            <el-input class="input-width" v-model="user.qq" @blur="clearSpace(user, 'qq')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('user.withdraw_password')" prop="withdraw_password">
            <el-input class="input-width" type="password" :maxlength="6" v-model="user.withdraw_password" @blur="clearSpace(user, 'withdraw_password')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('user.captcha')" prop="verification_code_1" v-if="systemConfig.sms_validation_enabled === 'false'">
            <el-col :span="7">
              <el-input class="input-width" :maxlength="4" v-model="user.verification_code_1" auto-complete="off" @blur="clearSpace(user, 'verification_code_1')">
                <el-button slot="suffix" type="info" icon="el-icon-refresh" class="captcha" @click="fetchCaptcha"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4" :offset="12">
              <img :src="captcha_src" alt="" height="30">
            </el-col>
          </el-form-item>
          <el-form-item :label="''" prop="hasAgree">
            <el-checkbox-group v-model="user.hasAgree">
              <el-checkbox :label="'hasAgree'" name="hasAgree">
                我已阅读并完全同意<a class="agreement-link" @click="dialogVisible = true">{{$t('user.agreement')}}</a>
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="medium" class="input-width submit" @click="submitForm">{{$t('action.submit')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog
      top="5vh"
      :title="$t('user.agreement')"
      width="40%"
      :visible.sync="dialogVisible">
      <p>01. 使用本公司网站的客户，请留意阁下所在的国家或居住地的相关法律规定，如有疑问应就相关问题，寻求当地法律意见。</p>
      </br>
      <p>02. 若发生遭黑客入侵破坏行为或不可抗拒之灾害导致网站故障或资料损坏、资料丢失等情况，我们将以本公司之后备资料为最后处理依据；为确保各方利益，请各会员投注后打印资料。本公司不会接受没有打印资料的投诉。</p>
      </br>
      <p>03. 为避免纠纷，各会员在投注之后，务必进入下注明细检查及打印资料。若发现任何异常，请立即与代理商联系查证，一切投注将以本公司资料库的资料为准，不得异议。如出现特殊网络情况或线路不稳定导致不能下注或下注失败。本公司概不负责。</p>
      </br>
      <p>04. 开奖结果以官方公布的结果为准。</p>
      </br>
      <p>05. 如遇到官方停止销售或者开奖结果不确定的情况，本公司将对相关注单进行无效处理，并且返还下注本金。</p>
      </br>
      <p>06. 我们将竭力提供准确而可靠的开奖统计等资料，但并不保证资料绝对无误，统计资料只供参考，并非是对客户行为的指引，本公司也不接受关于统计数据产生错误而引起的相关投诉。</p>
      </br>
      <p>07. 本公司拥有一切判决及注消任何涉嫌以非正常方式下注之权利，在进行更深入调查期间将停止发放与其有关之任何彩金。客户有责任确保自己的帐户及密码保密，如果客户怀疑自己的资料被盗用，应立即通知本公司，并须更改其个人详细资料。所有被盗用帐号之损失将由客户自行负责。</p>
      </br>
      <p>管理层 敬啟</p>
    </el-dialog>
  </el-row>
</template>

<script>
import { fetchCaptcha, checkUserName, register, fetchSmsCode } from '../../api'
import { validateUserName, validatePassword, validatePhone, validateWithdrawPassword, validateQQ, validateRealName } from '../../validate'
import { msgFormatter } from '../../utils'
import { mapState } from 'vuex'

export default {
  name: 'register',
  data () {
    const userNameValidator = (rule, value, callback) => {
      if (!value) {
        callback(new Error(this.$t('validate.required')))
      } else if (!validateUserName(value)) {
        callback(new Error(this.$t('validate.username_validate')))
      } else {
        checkUserName(value).then(response => {
          if (response.length > 0) {
            callback()
          } else {
            callback(new Error(this.$t('validate.username_exist')))
          }
        })
      }
    }
    const passwordValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.required')))
      } else {
        if (this.user.confirmation_password !== '') {
          this.$refs.user.validateField('confirmation_password')
        }
        callback()
      }
    }

    const passwordFormatValidator = (rule, value, callback) => {
      if (!validatePassword(value)) {
        callback(new Error(this.$t('validate.password_validate')))
      } else {
        callback()
      }
    }

    const confirmPasswordValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.password_again')))
      } else if (value !== this.user.password) {
        callback(new Error(this.$t('validate.password_diff')))
      } else {
        callback()
      }
    }

    const captchaValidator = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validate.required')))
      } else {
        callback()
      }
    }

    const phoneValidator = (rule, value, callback) => {
      if (!validatePhone(value)) {
        callback(new Error(this.$t('validate.phone_validate')))
      } else {
        callback()
      }
    }

    const qqValidator = (rule, value, callback) => {
      if (!validateQQ(value)) {
        callback(new Error(this.$t('validate.qq_validate')))
      } else {
        callback()
      }
    }

    const realNameValidator = (rule, value, callback) => {
      if (!validateRealName(value)) {
        callback(new Error(this.$t('validate.realname_validate')))
      } else {
        callback()
      }
    }

    const withdrawPasswordValidator = (rule, value, callback) => {
      if (!validateWithdrawPassword(value)) {
        callback(new Error(this.$t('validate.withdraw_password_validate')))
      } else {
        callback()
      }
    }

    return {
      user: {
        username: '',
        password: '',
        confirmation_password: '',
        real_name: '',
        phone: '',
        email: '',
        withdraw_password: '',
        verification_code_0: '',
        verification_code_1: '',
        hasAgree: ['hasAgree'],
        sms_code: '',
        loading: false
      },
      sms_tip: '',
      dialogVisible: false,
      captcha_src: '',
      rules: {
        username: [
          { required: true, validator: userNameValidator, trigger: 'blur' }
        ],
        password: [
          { required: true, validator: passwordValidator, trigger: 'blur' },
          { validator: passwordFormatValidator, trigger: 'blur,change' }
        ],
        confirmation_password: [
          { required: true, validator: confirmPasswordValidator, trigger: 'blur' }
        ],
        real_name: [
          { required: true, validator: realNameValidator, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: phoneValidator, trigger: 'blur,change' }
        ],
        qq: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: qqValidator, trigger: 'blur,change' }
        ],
        withdraw_password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: withdrawPasswordValidator, trigger: 'blur,change' }
        ],
        verification_code_1: [
          { required: true, validator: captchaValidator, trigger: 'blur' }
        ],
        hasAgree: [
          { type: 'array', required: true, message: this.$t('validate.agreement_validate'), trigger: 'change' }
        ],
        sms_code: [
          { required: true, validator: captchaValidator, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.systemConfig.sms_validation_enabled === 'false') {
      this.fetchCaptcha()
    }
  },
  methods: {
    submitForm () {
      this.$refs['user'].validate((valid) => {
        if (valid) {
          this.loading = true
          register(this.user).then(result => {
            if (result.code === 9001) {
              this.$message({
                showClose: true,
                message: result.msg,
                type: 'warning'
              })
            }
            this.loading = false
            return this.$store.dispatch('login', {
              user: {
                username: this.user.username,
                password: this.user.password
              }
            })
          }).then(result => {
            this.$router.push({ name: 'Game' })
          }, errorMsg => {
            if (this.systemConfig.sms_validation_enabled === 'false') {
              this.fetchCaptcha()
            }

            this.$message({
              showClose: true,
              message: msgFormatter(errorMsg),
              type: 'error'
            })

            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    fetchCaptcha () {
      if (this.loading) {
        return
      }
      this.loading = true
      fetchCaptcha().then(res => {
        this.captcha_src = res.captcha_src
        this.user.verification_code_0 = res.captcha_val
        this.loading = false
      })
    },
    fetchSmsCode () {
      if (this.loading) {
        return
      }

      if (!this.user.phone) {
        this.sms_tip = '请先填入手机号码'
        return
      }

      if (!validatePhone(this.user.phone)) {
        this.sms_tip = this.$t('validate.phone_validate')
        return
      }

      this.loading = true
      fetchSmsCode(this.user.phone).then(res => {
        this.sms_tip = res.msg
        this.loading = false
      },
      errRes => {
        this.sms_tip = msgFormatter(errRes)
        this.loading = false
      })
    }
  },
  computed: {
    ...mapState([
      'systemConfig'
    ]),
    regPresentAmount () {
      return this.systemConfig.regPresentAmount
    },
    needBankinfo () {
      return this.systemConfig.needBankinfo
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../style/vars.scss';
@import '../../style/base.scss';

.greetmoney-box{
  box-sizing: border-box;
  width: 600px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 20px;
  padding-right: 20px;
  margin: 0 auto 10px auto;
  background-color: #f0f9eb;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  text-align: center;
  .greet-money {
    color: $green;
    font-size: 14px;
  }
}

.register-container{
  box-sizing: border-box;
  width: 600px;
  height: auto;
  padding: 30px 80px 20px 80px;
  margin: 0 auto 40px auto;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}

.el-input /deep/ .el-input__suffix {
  right: 0
}
.el-button.el-button--info.el-button--small.captcha {
  position: absolute;
  right: 0;
}
.agreement-link {
  color: $primary;
  text-decoration: underline;
}

.sms-tip {
  color: #aaa;
  line-height: 15px;
}
</style>
