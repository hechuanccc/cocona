<template>
  <div>
    <el-row :gutter="40" class="pop-content">
      <el-col :span="12">
        <div class="register">
          <span>{{$t('navMenu.guest')}}</span>
          <div class="m-t">
            <el-button type="primary" @click="toRegister">
              <span>{{$t('navMenu.user_register')}}</span>
            </el-button>
          </div>
          <div>
            <el-button @click="tryplay">{{$t('navMenu.try_play')}}</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="12" class="login">
        <div class="login">
          <div class="login-title">
            <span class="please-login">{{$t('navMenu.user')}} </span>
          </div>
          <el-form :model="user" status-icon :rules="rules" ref="user">
            <el-form-item prop="username" :label="$t('user.username')" label-width="55px">
              <el-input v-model="user.username"
                id="username"
                class="m-t-sm"
                @keyup.enter.native="login"
                @blur="clearSpace(user, 'username')"
                :autofocus="true"
                ref="username"/>
            </el-form-item>
            <el-form-item prop="password" :label="$t('user.password')" label-width="55px">
              <el-input v-model="user.password"
                id="password"
                type="password"
                @blur="clearSpace(user, 'password')"
                @keyup.enter.native="login">
              </el-input>
            </el-form-item>

            <el-form-item v-if="illegalTriedLogin" :label="'验证码'" label-width="55px"  prop="verification_code_1">
              <el-input class="input-width" :maxlength="4" v-model="user.verification_code_1" auto-complete="off"></el-input>
              <div class="m-t">
                <el-col :span="12" :pull="2">
                  <img class="captcha" :src="captcha_src" height="32">
                </el-col>
                <el-col :span="12" class="text-right">
                  <el-button type="info" icon="el-icon-refresh" class="captcha-getter" @click="fetchCaptcha"></el-button>
                </el-col>
              </div>
            </el-form-item>

            <div class="login-actions">
              <transition name="el-fade-in">
                <div class="error text-center" v-if="errorMsg">
                  <span>{{errorMsg}}</span>
                </div>
              </transition>
              <el-form-item>
                <el-button class="login-btn" type="primary" @click="login">{{$t('navMenu.login')}}</el-button>
              </el-form-item>
              <div class="forgot-password">
                <a :href="$store.state.systemConfig && $store.state.systemConfig.customerServiceUrl" target="_blank" @click="closeLoginDialog()">{{$t('navMenu.forget_password')}}?</a>
              </div>
            </div>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { register, fetchCaptcha } from '../api'
import { msgFormatter } from '../utils'
export default {
  data () {
    return {
      user: {
        username: '',
        password: '',
        verification_code_0: '',
        verification_code_1: ''
      },
      rules: {
        username: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      },
      errorMsg: '',
      captcha_src: '',
      illegalTriedLogin: false
    }
  },
  methods: {
    closeLoginDialog () {
      this.$store.commit('CLOSE_LOGINDIALOG')
    },
    toRegister () {
      this.$store.commit('CLOSE_LOGINDIALOG')
      this.$router.push('/register')
    },
    login () {
      if (!this.user.username || !this.user.password) {
        this.$refs.username && this.$refs.username.focus()
        return
      }
      this.$store.dispatch('login', {
        user: {
          username: this.user.username,
          password: this.user.password,
          verification_code_0: this.user.verification_code_0,
          verification_code_1: this.user.verification_code_1
        }
      }).then(result => {
        this.$store.commit('CLOSE_LOGINDIALOG')
        this.illegalTriedLogin = false
        const next = this.$route.query.next
        this.$router.push(next || 'game')
      }, errorMsg => {
        if (errorMsg.data && errorMsg.data.auth_req === 1) {
          this.fetchCaptcha()
          this.illegalTriedLogin = true
        }
        this.errorMsg = errorMsg.msg
      })
    },
    tryplay () {
      register({ account_type: 0 }).then(user => {
        return this.$store.dispatch('login', { user })
      }).then(result => {
        this.$store.commit('CLOSE_LOGINDIALOG')
        this.$router.push({ name: 'Game' })
        window.gtag('event', '試玩', {'event_category': '遊客'})
      }, errorMsg => {
        this.errorMsg = msgFormatter(errorMsg)
      })
    },
    fetchCaptcha () {
      fetchCaptcha().then(res => {
        this.captcha_src = res.captcha_src
        this.user.verification_code_0 = res.captcha_val
      })
    }
  },
  watch: {
    '$store.state.loginDialogVisible': function () {
      this.$refs.username && this.$refs.username.focus()
    },
    'errorMsg': function () {
      setTimeout(() => {
        this.errorMsg = ''
      }, 3000)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/vars.scss";
@import "../style/base.scss";

.pop-content {
  padding: 30px 0;
  color: #9b9b9b;
}
.register {
  text-align: center;

  &:after {
    content: " ";
    display: inline-block;
    position: absolute;
    height: 200px;
    right: 50%;
    top: 45%;
    transform: translateY(-50%);
    border-right: 1px solid $pinkish-grey;
  }
  .el-button {
    margin: auto;
    width: 200px;
    display: block;
  }
  .el-button--primary {
    margin-bottom: 15px;
  }
}

.login {
  padding-left: 30px;
  .please-login {
    display: inline-block;
    text-align: left;
  }
  .login-btn {
    width: 220px;
  }
}

.login-title, .login-actions {
  padding-left: 55px;
}

.login-actions {
  position: relative;
}

.el-input {
  width: $form_width;
}

.forgot-password {
  display: inline-block;
  width: $form_width;
  text-align: left;
  position: relative;
  bottom: 20px;
  a {
    font-size: 12px;
    font-weight: 500;
    text-decoration: none;
  }
}

.error {
  position: absolute;
  width: 220px;
  font-size: 13px;
  color: $red;
  top: -25px;
}

.captcha {
  width: 70px;
}

.verification-container {
  display: inline-block;
  width: 300px;
  .continue {
    width: 220px;
  }
}
</style>
