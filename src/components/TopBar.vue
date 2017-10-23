<template>
  <el-row :gutter="10">
    <el-col :span="4" :offset="10">
      <el-input v-model="username" placeholder="会员登录" ></el-input>
    </el-col>
    <el-col :span="4">
      <el-input v-model="password" type="password" placeholder="密码">
        <el-button slot="suffix" size="mini" type="info" class="ipt-slot">忘记?</el-button>
      </el-input>
    </el-col>
    <el-col :span="6">
      <el-button type="primary" @click="login">登录</el-button>
      <el-button type="info">注册</el-button>
      <el-button type="warning">免费试玩</el-button>
    </el-col>
  </el-row>
</template>

<script>
export default {
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  name: 'TopBar',
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
        this.$router.push('game')
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

<style scoped lang='scss'>
.ipt-slot {
  margin-top: 2px;
  padding: 7px;
}
</style>
