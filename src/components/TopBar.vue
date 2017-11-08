<template>

  <el-row :gutter="4" class="top-bar">
    <!--static data--><el-col :span="4" class="bar-descript">內時聞海提出主面必調的為化。育麼活研件怎斷和熱到大好</el-col>
    <el-col :span="4">
      <el-input v-model="username" placeholder="会员登录"></el-input>
    </el-col>
    <el-col :span="4">
      <el-input v-model="password" type="password" placeholder="密码">
        <el-button slot="suffix" size="mini" type="info" class="ipt-slot">忘记?</el-button>
      </el-input>
    </el-col>
    <el-col :span="8">
      <el-button type="primary" @click="login">会员登录</el-button>
      <el-button type="info">会员注册</el-button>
      <el-button type="warning">免费试玩</el-button>
    </el-col>
  </el-row>

</template>

<script>
import {gethomePage} from '../api'
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
      password: '',
      homepage: ''
    }
  },
  created () {
    gethomePage().then(
      response => {
        this.homepage = response.data
      }
    )
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
<style scoped lang='sass'>
.ipt-slot
  margin-top: 2px
  padding: 7px
.top-bar
  padding-top: 7px
  width: 1000px
  display: inline-block
.bar-descript
  width: auto
  line-height: 36px
  margin-right: 10px
  color: white
</style>


