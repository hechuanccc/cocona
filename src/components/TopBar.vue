<template>
  <div class="top-bar container" justify="space-between">
    <div class="clock">
      {{nowTime}}
    </div>
    <ul class="account-links" v-if="!isLogin">
      <li>
        <span @click="login">{{$t('navMenu.user_login')}}</span>
      </li>
      <li>
        <router-link tag="span" to="/register">{{$t('navMenu.user_register')}}</router-link>
      </li>
      <li>
        <span class="red">{{$t('navMenu.try_play')}}</span>
      </li>
    </ul>
    <ul v-else-if="user.logined" class="account-links" >
      <li>
        <router-link to="/account/online_payment">立即存款</router-link>
      </li>
      <li>
        <router-link to="/account/withdraw">申请取款</router-link>
      </li>
      <li>
        <router-link to="/account/finance/betrecord">我的注单</router-link>
      </li>
      <li>
        <span :class="['account-trigger', {
            active: showDropdown
          }]"
          @mouseenter="showDropdown=true"
          @mouseleave="showDropdown=false">
          我的账号
          <i class="el-icon-caret-bottom" v-if="!showDropdown" />
          <i class="el-icon-caret-top" v-else />
          <ul v-show="showDropdown" class="dropdown">
            <li><router-link to="/account/my/">账户余额: ￥{{user.balance}}</router-link></li>
            <li><router-link to="/account/message">账号信息</router-link></li>
            <li><router-link to="/account/my/password_setting">修改密码</router-link></li>
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
      this.$store.commit('SHOW_LOGINDIALOG')
    },
    logout () {
      this.$store.dispatch('logout')
    }
  },
  created () {
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
  a, span
    text-decoration: none
    padding: 0 10px
    color: #999
    &:hover
      color: $primary
    &.red
      color: $red

.account-trigger
  border: 1px solid #f2f2f2
  border-width: 0 1px
  &.active
    padding-bottom: 1px
    background: #fff
    border-color: #eee
  display: block

.dropdown
  padding: 10px 0
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
    line-height: 32px
    padding: 0 10px
    a
      display: block
    &:hover
      background: #f0f0f0
</style>


