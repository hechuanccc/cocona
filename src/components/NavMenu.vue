<template>
  <el-menu :default-active="activeIndex" class="el-menu" mode="horizontal" @select="handleSelect" :active-text-color="style.primaryColor">
    <el-menu-item index="" v-show="!islogin">{{$t('navMenu.home_page')}}</el-menu-item>

    <el-menu-item index="game" @click="popGuest">{{$t('navMenu.game_center')}}</el-menu-item>
    <el-dialog title="需要先登入才能進入遊戲大廳！" :visible.sync="popVisible" width="40%" center>
      <div class="pop-content">
        <div class="guest-link">
          <h1>訪客: </h1>
          <el-button type="info"><router-link tag="span" to="/rigister">会员注册</router-link></el-button>
          <el-button type="warning">免费试玩</el-button>
        </div>
        <div class="notguest-link">
          <h1>用戶: </h1>
          <el-input v-model="username" placeholder="会员登录"></el-input>
          <el-input v-model="password" type="password" placeholder="密码">
            <el-button slot="suffix" size="mini" type="info" class="ipt-slot">忘记?</el-button>
          </el-input>
          <el-button type="primary" @click="login">登录</el-button>
        </div>
      </div>
    </el-dialog>

    <el-menu-item index="register" v-show="!islogin">{{$t('navMenu.user_register')}}</el-menu-item>
    <el-menu-item index="promotions" v-show="!islogin">{{$t('navMenu.promotion')}}</el-menu-item>
    <el-menu-item index="qa" v-show="!islogin">{{$t('navMenu.qa')}}</el-menu-item>
    <el-menu-item index="agent/register" v-show="!islogin">{{$t('navMenu.affliate')}}</el-menu-item>

    <el-menu-item index="personal" v-show="islogin">{{$t('navMenu.personal_account')}}</el-menu-item>
    <el-menu-item index="history" v-show="islogin">{{$t('navMenu.draw_history')}}</el-menu-item>
    <el-menu-item index="game-intro" v-show="islogin">{{$t('navMenu.game_intro')}}</el-menu-item>
  </el-menu>
</template>


<style lang="sass" scoped>
.el-menu
  display: inline-block
  float: right
  width: auto
.pop-content
  position: relative
  div
    width: calc( (100% - 15px) / 2 )
    display: inline-block

.guest-link
  border-right: 1px solid #ddd
  vertical-align: middle
  button
    margin: 25px auto
    display: block
    width: 80%

.notguest-link
  vertical-align: top
  margin-left: 10px
  div
    width: 80%
    margin: 7px

  > button
    position: relative
    left: 50%
    width: 50%
    margin-left: -33%
.ipt-slot
  margin-top: 1.5px
</style>


<script>
import style from '../style'

export default {
  data () {
    return {
      activeIndex: '',
      popVisible: false,
      username: '',
      password: '',
      style
    }
  },
  methods: {
    handleSelect (key, keyPath) {
      this.$router.push('/' + key) // key to that page set by index attribute
    },
    popGuest () {
      if (!this.$store.state.user.logined) {
        this.popVisible = true
      }
      this.$router.push('game')
    },
    login () {
      this.$store.dispatch('login', {
        user: {
          username: this.username,
          password: this.password
        }
      }).then(result => {
        const next = this.$route.query.next
        this.$router.push(next || 'game')
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
      this.popVisible = false
    }
  },
  computed: {
    islogin () {
      return this.$store.state.user.logined
    },
    user () {
      return this.$store.state.user
    }
  }
}
</script>
