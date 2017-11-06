
<template>
<el-row class="row-bg">
  <el-col :span="16" :offset="4">
    <el-form :model="user" status-icon :rules="rules" ref="user" label-width="150px">
      <el-form-item :label="$t('register.username')" prop="username">
        <el-input :maxlength="10" v-model="user.username" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('register.password')" prop="password">
        <el-input type="text" v-model="user.password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('register.confirm_password')" prop="confirmation_password">
        <el-input type="password" v-model="user.confirmation_password" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item :label="$t('register.realname')" prop="real_name">
        <el-input v-model="user.real_name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('register.phone')" prop="phone">
        <el-input v-model="user.phone"></el-input>
      </el-form-item>
      <el-form-item :label="$t('register.email')" prop="email">
        <el-input v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item :label="$t('register.withdraw_password')" prop="withdraw_password">
        <el-input v-model="user.withdraw_password"></el-input>
      </el-form-item>
      <el-form-item :label="$t('register.captcha')" required>
        <el-col :span="12">
          <el-form-item  prop="verification_code_1">
            <el-input :maxlength="4" v-model="user.verification_code_1">
              <el-button slot="append" icon="el-icon-refresh" @click="fetchVerification"></el-button>
            </el-input>

          </el-form-item>
        </el-col>
        <el-col :span="4" :offset="1">
          <img :src="captcha_src" alt="">
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">{{$t('action.submit')}}</el-button>
        <el-button @click="resetForm">{{$t('action.reset')}}</el-button>
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
          callback(new Error(this.$t('validate.username_validate')))
        } else {
          checkUserName(value).then(data => {
            if (data.length > 0) {
              callback()
            } else {
              callback(new Error(this.$t('validate.username_exist')))
            }
          })
        }
      }
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('validate.password_required')))
        } else {
          if (this.user.confirmation_password !== '') {
            this.$refs.user.validateField('confirmation_password')
          }
          callback()
        }
      }

      const validatePassFormat = (rule, value, callback) => {
        if (!passwordPattern.test(value)) {
          callback(new Error(this.$t('validate.password_validate')))
        } else {
          callback()
        }
      }

      const validateConfirmPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('validate.password_again')))
        } else if (value !== this.user.password) {
          callback(new Error(this.$t('validate.password_diff')))
        } else {
          callback()
        }
      }
      const validateCode = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('validate.captcha_required')))
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
            { required: true, message: this.$t('validate.username_required'), trigger: 'blur' },
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
            { required: true, message: this.$t('validate.realname_required'), trigger: 'blur' }
          ],
          phone: [
            { required: true, message: this.$t('validate.phone_required'), trigger: 'blur' }
          ],
          email: [
            { required: true, message: this.$t('validate.email_required'), trigger: 'blur' },
            { type: 'email', message: this.$t('validate.email_validate'), trigger: 'blur,change' }
          ],
          withdraw_password: [
            { required: true, message: this.$t('validate.withdraw_password_required'), trigger: 'blur' }
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
