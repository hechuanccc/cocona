
<template>
<el-row class="row-bg">
  <el-col :span="12" :offset="6">
    <el-form :model="user" status-icon :rules="rules" ref="user" label-width="100px">
      <el-form-item label="帐号" prop="username">
        <el-input :maxlength="10" v-model="user.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="text" v-model="user.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmation_password">
        <el-input type="password" v-model="user.confirmation_password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="real_name">
        <el-input v-model="user.real_name"></el-input>
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="user.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮件信箱" prop="email">
        <el-input v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item label="提款密码" prop="withdraw_password">
        <el-input v-model="user.withdraw_password"></el-input>
      </el-form-item>
      <el-form-item label="验证码" required>
        <el-col :span="12">
          <el-form-item  prop="verification_code_1">
            <el-input :maxlength="4" v-model="user.verification_code_1">
              <el-button slot="append" @click="fetchVerification">更新验证码</el-button>
            </el-input>

          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="1">
          <img :src="captcha_src" alt="">
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</el-row>
</template>

<script>
  import {fetchVerification, checkUserName} from '../../api'
  import urls from '../../api/urls'

  const userNamePattern = /^[a-zA-Z0-9]{4,10}$/
  const passwordPattern = /^[a-zA-Z]{2}[a-zA-Z0-9]{4,13}$/
  export default {
    data () {
      const validateUserName = (rule, value, callback) => {
        if (!userNamePattern.test(value)) {
          callback(new Error('请输入4~10位英数字'))
        } else {
          checkUserName(value).then(data => {
            if (data.length > 0) {
              callback()
            } else {
              callback(new Error('该帐号已存在'))
            }
          })
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.user.confirmation_password !== '') {
            this.$refs.user.validateField('confirmation_password')
          }
          callback()
        }
      }

      const validatePassFormat = (rule, value, callback) => {
        if (!passwordPattern.test(value)) {
          callback(new Error('请输入6~15位英数字,首两位须为英文字母'))
        } else {
          callback()
        }
      }

      const validateConfirmPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.user.password) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      const validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入验证码'))
        } else {
          callback()
        }
      }
      return {
        user: {
          username: '',
          password: '',
          confirmation_password: '',
          real_name: '',
          phone: '',
          email: '',
          withdraw_password: '',
          verification_code_0: '',
          verification_code_1: ''
        },
        captcha_src: '',
        rules: {
          username: [
            { required: true, message: '请输入帐号', trigger: 'blur' },
            { validator: validateUserName, trigger: 'blur,change' }
          ],
          password: [
            { required: true, validator: validatePass, trigger: 'blur' },
            { validator: validatePassFormat, trigger: 'blur,change' }
          ],
          confirmation_password: [
            { required: true, validator: validateConfirmPass, trigger: 'blur' }
          ],
          real_name: [
            { required: true, message: '请输入真实姓名', trigger: 'blur' }
          ],
          phone: [
            { required: true, message: '请输入手机号码', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' }
          ],
          withdraw_password: [
            { required: true, message: '提款密码', trigger: 'blur' }
          ],
          verification_code_1: [
            { required: true, validator: validateCode, trigger: 'blur' }
          ]
        }
      }
    },
    created () {
      this.fetchVerification()
    },
    methods: {
      submitForm () {
        this.$refs['user'].validate((valid) => {
          if (valid) {
            this.$store.dispatch('register', {
              user: this.user
            }).then(result => {
              return this.$store.dispatch('login', {
                user: {
                  username: this.user.username,
                  password: this.user.password
                }
              })
            }).then(result => {
              this.$router.push({name: 'Game'})
            }, errorRes => {
              const errors = errorRes.response.data.error

              let message
              if (Array.isArray(errors)) {
                let messages = []

                errors.forEach(error => {
                  Object.keys(error).forEach(key => {
                    messages.push(error[key])
                  })
                })
                message = messages.join(', ')
              } else {
                message = errors
              }

              this.$message({
                showClose: true,
                message: message,
                type: 'error'
              })
            })
          } else {
            return false
          }
        })
      },
      resetForm () {
        this.$refs['user'].resetFields()
        this.fetchVerification()
      },
      fetchVerification () {
        fetchVerification().then(data => {
          this.captcha_src = urls.domain + data.captcha_src
          this.user.verification_code_0 = data.captcha_val
        })
      }
    }
  }
</script>
