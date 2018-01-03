<template>
  <el-row class="row-bg">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>注册会员</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="register-container">
        <el-form :model="user" status-icon :rules="rules" ref="user" label-width="70px">
          <el-form-item :label="$t('user.username')" prop="username">
            <el-input class="input-width" :maxlength="15" v-model="user.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('user.password')" prop="password">
            <el-input class="input-width" :maxlength="15" type="password" v-model="user.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('user.confirm_password')" prop="confirmation_password">
            <el-input class="input-width" :maxlength="15" type="password" v-model="user.confirmation_password" auto-complete="off"></el-input>
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
          <el-form-item :label="$t('user.withdraw_password')" prop="withdraw_password">
            <el-input class="input-width" type="password" :maxlength="6" v-model="user.withdraw_password"></el-input>
          </el-form-item>
          <el-form-item prop="verification_code_1" :label="$t('user.captcha')" required>
            <el-input class="input-width" :maxlength="4" v-model="user.verification_code_1" auto-complete="off">
            </el-input>
          </el-form-item>
          <div class="captcha-row">
            <button type="button" class="captcha-getter" @click="fetchCaptcha">
              <i class="el-icon-refresh"></i>
            </button>
            <img :src="captcha_src" alt="captcha" class="captcha" width="70" height="30">
          </div>
          <el-form-item>
            <el-button type="primary" size="medium" class="input-width submit" @click="submitForm">{{$t('action.submit')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-row>
</template>

<script>
import { fetchCaptcha, checkUserName, register } from '../../api'
import { validateUserName, validatePassword, validatePhone, validateWithdrawPassword } from '../../validate'
import { msgFormatter } from '../../utils'
export default {
  name: 'register',
  data () {
    const userNameValidator = (rule, value, callback) => {
      if (!validateUserName(value)) {
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
        verification_code_1: ''
      },
      captcha_src: '',
      rules: {
        username: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: userNameValidator, trigger: 'blur,change' }
        ],
        password: [
          { required: true, validator: passwordValidator, trigger: 'blur' },
          { validator: passwordFormatValidator, trigger: 'blur,change' }
        ],
        confirmation_password: [
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
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: withdrawPasswordValidator, trigger: 'blur,change' }
        ],
        verification_code_1: [
          { required: true, validator: captchaValidator, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.fetchCaptcha()
  },
  methods: {
    submitForm () {
      this.$refs['user'].validate((valid) => {
        if (valid) {
          register(this.user).then(result => {
            return this.$store.dispatch('login', {
              user: {
                username: this.user.username,
                password: this.user.password
              }
            })
          }).then(result => {
            this.$router.push({ name: 'Game' })
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
    resetForm () {
      this.$refs['user'].resetFields()
      this.fetchCaptcha()
    },
    fetchCaptcha () {
      fetchCaptcha().then(res => {
        this.captcha_src = res.captcha_src
        this.user.verification_code_0 = res.captcha_val
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../style/vars.scss';
@import '../../style/base.scss';

.register-container{
  box-sizing: border-box;
  width: 400px;
  height: auto;
  padding: 30px 80px 20px 80px;
  margin: 0 auto 40px auto;
  background-color: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}
.captcha-row {
  width: $form_width;
  height: 30px;
  padding-left: 70px;
  text-align: justify;
  margin-bottom: 20px;
  &:after {
    content: '';
    display: inline-block;
    width: 100%;
  }
}
.captcha {
  display: inline;
  vertical-align: middle;
}
.captcha-getter {
  display: inline-block;
  border-radius: 2px;
  width: 40px;
  height: 30px;
  background-color: $pinkish-grey;
  i {
    font-size: 8px;
    color: #ffffff;
  }
}
.submit.el-button--medium {
  height: 40px;
}
.el-form-item /deep/ .el-form-item__label {
  @extend %form-label;
}
.el-input /deep/ .el-input__inner{
  height: 25px;
  border: solid 1px #c8c8c8;
}
</style>
