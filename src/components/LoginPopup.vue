<template>
  <el-row :gutter="40" class="pop-content">
    <el-col :span="12">
      <div class="register">
        <span>{{$t('navMenu.guest')}}:</span>
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
          <el-form-item prop="username" :label="$t('user.username')" label-width="50px">
            <el-input v-model="user.username"
              class="m-t-sm"
              @keyup.enter.native="login"
              :autofocus="true"
              ref="username"/>
          </el-form-item>
          <el-form-item prop="password" :label="$t('user.password')" label-width="50px">
            <el-input v-model="user.password"
              type="password"
              @keyup.enter.native="login">
            </el-input>
          </el-form-item>
          <transition name="el-fade-in">
            <span class="error" v-if="errorMsg">{{errorMsg}}</span>
          </transition>
          <div class="login-actions">
            <el-form-item>
              <el-button type="primary" class="submit" @click="login">{{$t('navMenu.login')}}</el-button>
            </el-form-item>
            <div class="forgot-password">
              <a :href="$store.state.common.customerServiceUrl" target="_blank" @click="closeLoginDialog()">{{$t('navMenu.forget_password')}}?</a>
            </div>
          </div>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import { register } from '../api'
import { msgFormatter } from '../utils'
export default {
  data () {
    return {
      user: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ]
      },
      errorMsg: ''
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
        this.$refs.username.focus()
        return
      }
      this.$store.dispatch('login', {
        user: {
          username: this.user.username,
          password: this.user.password
        }
      }).then(result => {
        this.$store.commit('CLOSE_LOGINDIALOG')
        const next = this.$route.query.next
        this.$router.push(next || 'game')
      }, errorMsg => {
        this.errorMsg = msgFormatter(errorMsg)
      })
    },
    tryplay () {
      register({ account_type: 0 }).then(user => {
        return this.$store.dispatch('login', { user })
      }).then(result => {
        this.$store.commit('CLOSE_LOGINDIALOG')
        this.$router.push({ name: 'Game' })
      }, errorMsg => {
        this.errorMsg = msgFormatter(errorMsg)
      })
    }
  },
  watch: {
    '$store.state.loginDialogVisible': function () {
      this.$refs.username.focus()
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
  margin: auto;
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
    @extend %fat-button;
    border: 1px solid $azul;
    font-size: 14px;
  }
  .el-button--primary {
    background-color: $azul;
    margin-bottom: 15px;
  }
  .el-button--default {
    color: $azul;
  }
}

.login {
  padding-left: 40px; /*60 - 20(elementui default)*/
  .please-login {
    display: inline-block;
    text-align: left;
    width: 160px;
  }
  .submit {
    @extend %fat-button;
    background-color: $azul;
    font-size: 14px;
  }
}
.login-title {
  padding-left: 50px;
}
.el-input {
  width: 160px;
}
.el-input /deep/ .el-input__inner{
  height: 25px;
  border: solid 1px #c8c8c8;
}
.el-form-item /deep/ .el-form-item__label {
  font-size: 12px;
  line-height: 37px;
  color: #4a4a4a;
  position: relative;
  right: 20px;
}
.forgot-password {
  display: inline-block;
  width: 160px;
  text-align: left;
  position: relative;
  bottom: 20px;
  a {
    color: $azul;
    font-size: 12px;
    font-weight: 500;
    text-decoration: none;
  }
}

.login-actions {
  padding-left: 50px;
}
.error {
  position: absolute;
  font-size: 13px;
  color: $red;
  top: 150px;
  right: 75px;
}
</style>
