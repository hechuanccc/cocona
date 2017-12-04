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
        <el-form :model="user" status-icon :rules="rules" ref="user">
          <el-form-item prop="username">
            <el-input v-model="user.username"
              :placeholder="$t('navMenu.user_login')"
              class="m-t-sm"
              @keyup.enter.native="login"
              :autofocus="true"
              ref="username"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="user.password"
              type="password"
              :placeholder="$t('navMenu.password')"
              @keyup.enter.native="login">
              <el-button slot="suffix" size="mini" type="info" class="ipt-slot">{{$t('navMenu.forget_password')}}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="submit" @click="login">{{$t('navMenu.login')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-col>
  </el-row>
</template>

<script>
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
      }
    }
  },
  methods: {
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
  position: absolute;
  right: 20px;
  top: 2px
}
</style>
