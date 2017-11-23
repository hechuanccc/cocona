<template>
  <div class="top-bar container" justify="space-between">
    <div class="clock">
      {{nowTime}} {{$t('navMenu.bussiness_hours')}}
    </div>
    <div class="actions" v-if="!isLogin">
      <div class="input">
        <el-input v-model="username" :placeholder="$t('navMenu.user_login')"></el-input>
      </div>
      <div class="input">
        <el-input v-model="password" type="password" :placeholder="$t('navMenu.password')" @keyup.enter.native="login">
          <el-button slot="suffix" size="mini" type="info" class="ipt-slot">{{$t('navMenu.forget_password')}}</el-button>
        </el-input>
      </div>
      <div class="buttons">
        <el-button type="primary" @click="login()">{{$t('navMenu.user_login')}}</el-button>
        <el-button type="info"><router-link tag="span" to="/register">{{$t('navMenu.user_register')}}</router-link></el-button>
        <el-button type="warning">{{$t('navMenu.try_play')}}</el-button>
      </div>
    </div>
    <div v-else-if="user.logined" class="account-links" >
      <el-button-group>
        <router-link to="/account/online_payment"><el-button>立即存款</el-button></router-link>
        <router-link to="/account/withdraw"><el-button>申请取款</el-button></router-link>
        <router-link to="/account/finance/betrecord"><el-button>我的注单</el-button></router-link>
      </el-button-group>
      <el-button class="account-trigger"
        @mouseenter.native="showDropdown=true"
        @mouseleave.native="showDropdown=false">我的账号<i class="el-icon-caret-bottom"></i>
        <ul v-show="showDropdown" class="dropdown">
          <li><router-link to="/account/my/">账户余额 {{user.balance}}</router-link></li>
          <li><router-link to="/account/message">账号信息</router-link></li>
          <li><router-link to="/account/my/password_setting">修改密码</router-link></li>
          <li @click="logout()"><a>{{$t('navMenu.logout')}}</a></li>
        </ul>
      </el-button>
    </div>
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
      this.$store.dispatch('login', {
        user: {
          username: this.username,
          password: this.password
        }
      }).then(result => {
        const next = this.$route.query.next
        if (next) {
          this.$router.push(next)
        } else {
          this.$router.push({ path: '/game' })
        }
      }, errorRes => {
        const errors = errorRes.response.data.error
        let messages = []

        errors.forEach(error => {
          Object.keys(error).forEach(key => {
            messages.push(error[key])
          })
        })

        this.$message({
          showClose: true,
          message: messages.join(', '),
          type: 'error'
        })
      })
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
  color: #666
  a, span
    text-decoration: none
    padding: 0 5px
    color: #666
    &:hover
      color: $primary

.dropdown
  padding: 10px 0
  text-align: left
  position: absolute
  top: 30px
  right: 0
  border: 1px solid #d8dce5
  border-radius: 2px
  background: #fff
  width: 160px
  z-index: 10
  li
    cursor: pointer
    line-height: 32px
    padding: 0 10px
    a
      display: block
    &:hover
      background: #f0f0f0
</style>


