<template>
  <div class="pop-content">
    <div class="guest-link">
      <h1>{{$t('navMenu.guest')}}:</h1>
      <el-button type="info">
        <router-link tag="span" to="/rigister">{{$t('navMenu.user_register')}}</router-link>
      </el-button>
      <el-button type="warning">{{$t('navMenu.try_play')}}</el-button>
    </div>
    <div class="notguest-link">
      <h1>{{$t('navMenu.user')}}: </h1>
      <el-input v-model="username" :placeholder="$t('navMenu.user_login')"></el-input>
      <el-input v-model="password" type="password" :placeholder="$t('navMenu.password')">
        <el-button slot="suffix" size="mini" type="info" class="ipt-slot">{{$t('navMenu.forget_password')}}</el-button>
      </el-input>
      <el-button type="primary" @click="login">{{$t('navMenu.login')}}</el-button>
    </div>
  </div>
</template>

<style lang="sass" scoped>
.pop-content
  text-align: center
  position: relative
  div
    width: 200px
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
  div
    width: 80%
    margin: 7px

  > button
    position: relative
    width: 50%
.ipt-slot
  margin-top: 2px
</style>
<script>
export default {
  data () {
    return {
      username: '',
      password: ''
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
        this.$store.commit('CLOSE_LOGINDIALOG')
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
    }
  }
}
</script>
