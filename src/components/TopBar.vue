<template>
  <div :class="[
    'top-bar',
    'container',
    {
      'block-center': $route.path === '/'
    }]">
    <div class="clock p-l">
      {{nowTime}}
    </div>
    <ul class="account-links" v-if="!isLogin">
      <li>
        <a @click="login" class="link">{{$t('navMenu.user_login')}}</a>
      </li>
      <li>
        <router-link to="/register" class="link">{{$t('navMenu.user_register')}}</router-link>
      </li>
      <li>
        <a class="red link" @click="tryplay">{{$t('navMenu.try_play')}}</a>
      </li>
    </ul>
    <ul v-else-if="user.account_type === 0" class="account-links" >
      <li>
        欢迎, {{$t('user.visitor')}}
      </li>
      <li>
        <a class="link" @click="logout()">退出试玩</a>
      </li>
      <li>
        <a class="link" @click="openBetRecordDialog">我的注单</a>
      </li>
      <li>
        <router-link to="/register" class="link">{{$t('navMenu.register_now')}}</router-link>
      </li>
    </ul>
    <ul v-else-if="user.account_type === 1" class="account-links" >
      <li>
        <router-link to="/account/online_payment" class="link">立即存款</router-link>
      </li>
      <li>
        <router-link to="/account/withdraw" class="link">申请取款</router-link>
      </li>
      <li>
        <router-link to="/account/finance/betrecord" class="link">我的注单</router-link>
      </li>
      <li>
        <span :class="['account-trigger', 'link', {
            'active': showDropdown
          }]"
          @mouseenter="showDropdown=true"
          @mouseleave="showDropdown=false">
          <router-link tag="span" to="/account">
            <span class="username">欢迎, {{user.username}}</span>
            <span v-if="messageCount" class="msg-tooltip m-l-sm">{{messageCount}}</span>
          </router-link>
          <i class="el-icon-caret-bottom" v-if="!showDropdown" />
          <i class="el-icon-caret-top" v-else />
          <ul v-show="showDropdown" class="dropdown" >
            <li><router-link to="/account/my/primary_info">{{$t('user.my_account')}}</router-link></li>
            <li><router-link to="/account/online_payment">{{$t('user.online_payment')}}</router-link></li>
            <li><router-link to="/account/remit">{{$t('user.remit')}}</router-link></li>
            <li><router-link to="/account/withdraw">{{$t('user.withdraw')}}</router-link></li>
            <li><router-link to="/account/finance/payment_record">{{$t('user.finance')}}</router-link></li>
            <li><router-link to="/account/message">{{$t('user.message')}}<span v-if="messageCount" class="msg-tooltip-right">{{messageCount}}</span></router-link></li>
            <li @click="logout()"><a>{{$t('navMenu.logout')}}</a></li>
          </ul>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { register } from '../api'
import { msgFormatter } from '../utils'
export default {
  computed: {
    user () {
      return this.$store.state.user
    },
    isLogin () {
      return this.$store.state.user.logined
    },
    messageCount () {
      let count = this.$store.state.messageCount
      return count > 99 ? count + '+' : count
    }
  },
  name: 'TopBar',
  data () {
    return {
      username: '',
      password: '',
      showDropdown: false,
      nowTime: new Date().toLocaleString()
    }
  },
  methods: {
    login () {
      this.$store.commit('SHOW_LOGIN_DIALOG')
    },
    logout () {
      this.$store.dispatch('logout').then(() => {
        this.$router.push('/')
      })
    },
    tryplay () {
      register({ account_type: 0 }).then(user => {
        return this.$store.dispatch('login', { user })
      }).then(result => {
        this.$router.push({ name: 'Game' })
      }, errorMsg => {
        this.$message({
          showClose: true,
          message: msgFormatter(errorMsg),
          type: 'error'
        })
      })
    },
    openBetRecordDialog () {
      this.$store.dispatch('openBetRecordDialog')
    }
  },
  watch: {
    '$route.path': function (path) {
      let pat = new RegExp(/\/game\/|\/game|\/account\/|\/gamehistory|\/gameintro/)
      if (pat.test(path)) {
        this.showDropdown = false
      }
    }
  },
  created () {
    this.timing = setInterval(() => {
      let now = new Date()
      this.nowTime = now.toLocaleString()
    }, 1000)
  },
  beforeDestroy () {
    clearInterval(this.timing)
  }
}
</script>
<style scoped lang='sass'>
@import '../style/vars.scss';
.top-bar
  position: relative
  height: 36px
  line-height: 36px
.clock
  display: inline-block
  font-size: 14px
  font-weight: 500
  color: #666

.account-links
  float: right
  font-size: 14px
  display: inline-block
  color: #999
  li
    cursor: pointer
    display: inline-block
  a
    text-decoration: none
    color: #999
    &:hover
      color: $primary
    &.red
      font-size: 14px
      color: $azul
  .link
    padding: 0 10px

.username
  color: #4a4a4a
  font-weight: 500
.account-trigger
  border-left: 1px solid #f2f2f2
  border-width: 2px 0
  &.active
    padding-bottom: 1px
  display: block

.dropdown
  box-shadow: 0 2px 2px rgba(0,0,0, .3)
  padding: 5px 0
  text-align: left
  position: absolute
  top: 30px
  right: 0
  border-top: none
  border-radius: 2px
  background: #fff
  width: 160px
  z-index: 10
  li
    display: block
    position: relative
    cursor: pointer
    line-height: 36px
    padding: 0 10px
    a
      display: block
    &:hover
      background: $primary
      a
        color: #fff
.msg-tooltip
  display: inline-block
  width: 20px
  height: 20px
  line-height: 20px
  text-align: center
  background: $red
  color: #fff
  font-size: 11px
  border-radius: 4px
.msg-tooltip-right
  font-size: 11px
  border-radius: 4px
  position: absolute
  top: 8px
  right: 5px
  width: 20px
  height: 20px
  line-height: 20px
  text-align: center
  background: $red
  color: #fff
</style>


