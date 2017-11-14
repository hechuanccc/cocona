<template>
  <el-row :gutter="4" class="top-bar container">
    <el-col :span="4" class="bar-descript">
      {{nowTime}} {{$t('navMenu.bussiness_hours')}}
    </el-col>
    <el-col :span="3" :push="5">
      <el-input v-model="username" :placeholder="$t('navMenu.user_login')"></el-input>
    </el-col>
    <el-col :span="3" :push="5">
      <el-input v-model="password" type="password" :placeholder="$t('navMenu.password')">
        <el-button slot="suffix" size="mini" type="info" class="ipt-slot">{{$t('navMenu.forget_password')}}</el-button>
      </el-input>
    </el-col>
    <el-col :span="8" :push="4">
      <el-button type="primary" @click="login()">{{$t('navMenu.user_login')}}</el-button>
      <el-button type="info"><router-link tag="span" to="/register">{{$t('navMenu.user_register')}}</router-link></el-button>
      <el-button type="warning">{{$t('navMenu.try_play')}}</el-button>
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
      homepage: '',
      nowTime: ''
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
.ipt-slot
  margin-top: 2px
  padding: 7px
.top-bar
  padding-top: 7px
  display: inline-block
.bar-descript
  width: auto
  line-height: 36px
  margin-right: 10px
  color: white
</style>


