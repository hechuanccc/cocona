<template>
  <div class="top-bar container" >
    <div class="clock">
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
    </ul>
    <ul v-else-if="user.account_type === 1" class="account-links" >
      <li>
        欢迎, {{user.username}}
      </li>
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
          <router-link tag="span" to="/account"> 我的账号<span v-if="messageCount" class="msgTooltip">{{messageCount}}</span></router-link>
          <i class="el-icon-caret-bottom" v-if="!showDropdown" />
          <i class="el-icon-caret-top" v-else />
          <ul v-show="showDropdown" class="dropdown">
            <li><router-link to="/account/my/">账户余额: ￥{{user.balance}}</router-link></li>
            <li><router-link to="/account/my/primary_info">{{$t('user.my_account')}}</router-link></li>
            <li><router-link to="/account/online_payment">{{$t('user.online_payment')}}</router-link></li>
            <li><router-link to="/account/remit">{{$t('user.remit')}}</router-link></li>
            <li><router-link to="/account/withdraw">{{$t('user.withdraw')}}</router-link></li>
            <li><router-link to="/account/finance/payment_record">{{$t('user.finance')}}</router-link></li>
            <li><router-link to="/account/message">{{$t('user.message')}}<span v-if="messageCount" class="msgTooltip-right">{{messageCount}}</span></router-link></li>
            <li @click="logout()"><a>{{$t('navMenu.logout')}}</a></li>
          </ul>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { gethomePage, register } from '../api'
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
      homepage: '',
      showDropdown: false,
      nowTime: new Date().toLocaleString()
    }
  },
  methods: {
    login () {
      this.$store.commit('SHOW_LOGIN_DIALOG')
    },
    logout () {
      this.$store.dispatch('logout')
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
    gethomePage().then(
      response => {
        this.homepage = response
        this.$store.dispatch('setServiceUrl', response.global_preferences.customer_service_url)
      }
    )

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
.ipt-slot
  margin-top: 2px
  padding: 7px
.top-bar
  display: inline-block
.clock
  float: left
  line-height: 32px
  margin-right: 10px
  color: #666
.input
  width: 140px
  float: left
  margin-right: 10px
.actions
  float: right
  text-align: right
.buttons
  float: right
.account-links
  position: relative
  float: right
  color: #999
  li
    cursor: pointer
    display: inline-block
    line-height: 32px
  a
    text-decoration: none
    color: #999
    &:hover
      color: $primary
    &.red
      color: $red
  .link
    padding: 0 10px


.account-trigger
  border: 1px solid #f2f2f2
  border-width: 0 1px
  &.active
    padding-bottom: 1px
    background: #fff
    border-color: #eee
  display: block

.dropdown
  padding: 5px 0
  text-align: left
  position: absolute
  top: 33px
  right: 0
  border: 1px solid #eee
  border-top: none
  border-radius: 2px
  background: #fff
  width: 160px
  z-index: 10
  li
    display: block
    position: relative
    cursor: pointer
    line-height: 30px
    padding: 0 10px
    a
      display: block
    &:hover
      background: $primary
      a
        color: #fff
.msgTooltip
  display: inline-block
  width: 20px
  height: 20px
  line-height: 20px
  text-align: center
  background: $red
  color: #fff
.msgTooltip-right
  position: absolute
  top: 5px
  right: 0
  width: 20px
  height: 20px
  line-height: 20px
  text-align: center
  background: $red
  color: #fff
</style>


