<template>
<el-row>
  <div class="register-container">
    <el-form :model="user"
      status-icon
      :rules="rules"
      ref="user"
      label-width="120px">
      <el-form-item :label="$t('user.username')" prop="username">
        <el-input class="input-width" :maxlength="15" v-model="user.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.password')" prop="password">
        <el-input class="input-width" :maxlength="15" type="password" v-model="user.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.confirm_password')" prop="confirm_password">
        <el-input class="input-width" :maxlength="15" type="password" v-model="user.confirm_password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.realname')" prop="real_name">
        <el-input class="input-width" v-model="user.real_name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.phone')" prop="phone">
        <el-input class="input-width" v-model="user.phone"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.email')" prop="email">
        <el-input class="input-width" v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.captcha')" required>
        <el-col :span="7">
          <el-form-item  prop="captcha_1">
            <el-input class="input-width" :maxlength="4" v-model="user.captcha_1" auto-complete="off">
              <el-button slot="suffix" type="info" icon="el-icon-refresh" class="captcha" @click="fetchCaptcha"></el-button>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="12">
          <img :src="captcha_src" alt="" height="30">
        </el-col>
      </el-form-item>
      <el-form-item>
        <div class="success" v-if="successMsg">{{successMsg}}</div>
        <el-button type="primary" size="medium" class="input-width submit" @click="submitForm">{{$t('action.submit')}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</el-row>
</template>

<script>
  import {agentRegister, fetchCaptcha, checkAgentName} from '../../api'
  import { validateUserName, validatePassword, validatePhone } from '../../validate'
  import { msgFormatter } from '../../utils'

  export default {
    name: 'agentRegister',
    data () {
      const userNameValidator = (rule, value, callback) => {
        if (!value) {
          callback(new Error(this.$t('validate.required')))
        } else if (!validateUserName(value)) {
          callback(new Error(this.$t('validate.username_validate')))
        } else {
          checkAgentName(value).then(data => {
            if (!data.existed) {
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
          if (this.user.confirm_password !== '') {
            this.$refs.user.validateField('confirm_password')
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
      return {
        user: {
          username: '',
          password: '',
          confirm_password: '',
          real_name: '',
          phone: '',
          email: '',
          withdraw_password: '',
          captcha_0: '',
          captcha_1: ''
        },
        captcha_src: '',
        rules: {
          username: [
          { required: true, validator: userNameValidator, trigger: 'blur' }
          ],
          password: [
          { required: true, validator: passwordValidator, trigger: 'blur' },
          { validator: passwordFormatValidator, trigger: 'blur,change' }
          ],
          confirm_password: [
          { required: true, validator: confirmPasswordValidator, trigger: 'blur' }
          ],
          real_name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          phone: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: phoneValidator, trigger: 'blur,change' }
          ],
          email: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { type: 'email', message: this.$t('validate.email_validate'), trigger: 'blur,change' }
          ],
          withdraw_password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          captcha_1: [
          { required: true, validator: captchaValidator, trigger: 'blur' }
          ]
        },
        successMsg: ''
      }
    },
    methods: {
      submitForm () {
        this.$refs['user'].validate((valid) => {
          if (valid) {
            agentRegister(this.user).then(result => {
              this.successMsg = this.$t('message.submit_success')
            }, errorMsg => {
              this.fetchCaptcha()
              this.$message({
                showClose: true,
                message: msgFormatter(errorMsg),
                type: 'error'
              })
            })
          } else {
            return false
          }
        })
      },
      fetchCaptcha () {
        fetchCaptcha().then(res => {
          this.captcha_src = res.captcha_src
          this.user.captcha_0 = res.captcha_val
        })
      }
    },
    created () {
      this.fetchCaptcha()
    }
  }
</script>

<style lang="scss" scoped>
@import '../../style/vars.scss';
.register-container{
  box-sizing: border-box;
  width: 600px;
  height: auto;
  padding: 30px 80px 20px 80px;
  margin: 0 auto 40px auto;
}

.el-input /deep/ .el-input__suffix {
  right: 0
}
.el-button.el-button--info.el-button--small.captcha {
  position: absolute;
  right: 0;
}
.success {
  position: absolute;
  bottom: 35px;
  color: $green;
}
</style>
