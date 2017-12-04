<template>
  <el-row :gutter="40" class="pop-content">
    <el-col :span="12">
      <div class="register">
        <span>{{$t('navMenu.guest')}}:</span>
        <div class="m-t-lg">
          <el-button type="primary" @click="toRegister">
            <span>{{$t('navMenu.user_register')}}</span>
          </el-button>
        </div>
        <div class="m-t">
          <el-button>{{$t('navMenu.try_play')}}</el-button>
        </div>
      </div>
    </el-col>
    <el-col :span="12" class="login">
      <div class="login">
        <span>{{$t('navMenu.user')}} </span>
        <el-input v-model="username"
          :placeholder="$t('navMenu.user_login')"
          class="m-t-sm"
          @keyup.enter.native="login"
          :autofocus="true"
          ref="username"/>
        <el-input v-model="password"
          type="password"
          :placeholder="$t('navMenu.password')"
          class="m-t"
          @keyup.enter.native="login">
          <el-button slot="suffix" size="mini" type="info" class="ipt-slot">{{$t('navMenu.forget_password')}}</el-button>
        </el-input>
        <el-button type="primary" class="submit m-t" @click="login">{{$t('navMenu.login')}}</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    toRegister () {
      this.$store.commit('CLOSE_LOGINDIALOG')
      this.$router.push('/register')
    },
    login () {
      if (!this.username || !this.password) {
        this.$refs.username.focus()
        this.$message({
          showClose: true,
          message: this.$t('message.please_keyinforlogin'),
          type: 'warning'
        })
        return
      }
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
  },
  watch: {
    '$store.state.loginDialogVisible': function () {
      this.$refs.username.focus()
    }
  }
}
</script>

<style lang="scss" scoped>
.pop-content {
  padding: 60px 0;
}
.register {
  text-align: center;
  margin: auto;
  &:after {
    content: ' ';
    display: inline-block;
    position: absolute;
    height: 200px;
    right: 50%;
    top: 50%;
    transform: translateY(-50%);
    border-right: 1px solid #eee;
  }
  .el-button {
    width: 150px;
  }
}

.login {
  padding: 0 40px;
  .submit {
    width: 100%;
  }
}
.el-button.ipt-slot {
  margin-top: 2px;
}
</style>
