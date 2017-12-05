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
        <a class="red link">{{$t('navMenu.try_play')}}</a>
      </li>
    </ul>
    <ul v-else-if="user.logined" class="account-links" >
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
            active: showDropdown
          }]"
          @mouseenter="showDropdown=true"
          @mouseleave="showDropdown=false">
          <router-link tag="span" to="/account"> 我的账号</router-link>
          <i class="el-icon-caret-bottom" v-if="!showDropdown" />
          <i class="el-icon-caret-top" v-else />
          <ul v-show="showDropdown" class="dropdown">
            <li><router-link to="/account/my/">账户余额: ￥{{user.balance}}</router-link></li>
            <li><router-link to="/account/my/primary_info">{{$t('user.my_account')}}</router-link></li>
            <li><router-link to="/account/online_payment">{{$t('user.online_payment')}}</router-link></li>
            <li><router-link to="/account/remit">{{$t('user.remit')}}</router-link></li>
            <li><router-link to="/account/withdraw">{{$t('user.withdraw')}}</router-link></li>
            <li><router-link to="/account/finance/payment_record">{{$t('user.finance')}}</router-link></li>
            <li><router-link to="/account/message">{{$t('user.message')}}</router-link></li>
            <li @click="logout()"><a>{{$t('navMenu.logout')}}</a></li>
          </ul>
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { gethomePage } from '../api'
export default {
  computed: {
    user () {
      return this.$store.state.user
    },
    isLogin () {
      return this.$store.state.user.logined
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
    }
  },
  created () {
    if (this.$cookie.get('access_token')) {
      this.$store.dispatch('fetchUser')
        .catch(error => {
          Promise.resolve(error)
        })
    }
    gethomePage().then(
      response => {
        this.homepage = response.data
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
    cursor: pointer
    line-height: 30px
    padding: 0 10px
    a
      display: block
    &:hover
      background: $primary
      a
        color: #fff
</style>


