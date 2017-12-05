<template>
  <el-row>
    <el-col :span="16" :offset="8">
      <el-form :model="user"
                status-icon
                :rules="rules"
                ref="user"
                label-width="150px">
          <el-form-item :label="$t('agent.username')" prop="username">
            <el-input class="input-width" :maxlength="10" v-model.number="user.username"></el-input>
          </el-form-item>
          <el-form-item :label="$t('agent.password')" prop="password">
            <el-input class="input-width" :maxlength="15" type="password" v-model="user.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('agent.confirm_password')" prop="confirmation_password">
            <el-input class="input-width" :maxlength="15" type="password" v-model="user.confirm_password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('agent.real_name')" prop="real_name">
            <el-input class="input-width" v-model="user.real_name"> </el-input>
          </el-form-item>
          <el-form-item :label="$t('agent.phone')" prop="phone">
            <el-input class="input-width" v-model="user.phone" number></el-input>
          </el-form-item>
          <el-form-item :label="$t('agent.email')" prop="email">
            <el-input class="input-width" v-model="user.email"></el-input>
          </el-form-item>
          <el-form-item :label="$t('agent.captcha')" required>
          <el-col :span="7">
            <el-form-item  prop="verification_code_1">
              <el-input class="input-width" :maxlength="4" v-model="user.captcha_1" auto-complete="off">
                <el-button slot="append" icon="el-icon-refresh" @click="fetchCaptcha"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" :offset="1">
            <img :src="captcha_src" alt="captcha" height="30">
          </el-col>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" class="input-width" @click="submitForm('user')" size="medium">{{$t('action.submit')}}</el-button>
          </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import TopBar from '../../components/TopBar'
  import { agentRegister, fetchCaptcha, checkUserName } from '../../api'
  import { validateUserName, validatePassword } from '../../validate'
  import { msgFormatter } from '../../utils'

  export default {
    name: 'agentRegister',
    data () {
      const userNameValidator = (rule, value, callback) => {
        if (!validateUserName(value)) {
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
      const passwordValidator = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('validate.required')))
        } else {
          if (this.user.confirmation_password !== '') {
            this.$refs.user.validateField('confirmation_password')
          }
          callback()
        }
      }

      const passwordFormatValidator = (rule, value, callback) => {
        if (!validatePassword(value)) {
          callback(new Error(this.$t('validate.password_validate')))
        } else {
          callback()
        }
      }

      const confirmPasswordValidator = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('validate.password_again')))
        } else if (value !== this.user.password) {
          callback(new Error(this.$t('validate.password_diff')))
        } else {
          callback()
        }
      }
      const captchaValidator = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('validate.required')))
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
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { validator: userNameValidator, trigger: 'blur,change' }
          ],
          password: [
          { required: true, validator: passwordValidator, trigger: 'blur' },
          { validator: passwordFormatValidator, trigger: 'blur,change' }
          ],
          confirmation_password: [
          { required: true, validator: confirmPasswordValidator, trigger: 'blur' }
          ],
          real_name: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          phone: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          email: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' },
          { type: 'email', message: this.$t('validate.email_validate'), trigger: 'blur,change' }
          ],
          withdraw_password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
          ],
          verification_code_1: [
          { required: true, validator: captchaValidator, trigger: 'blur' }
          ]
        },
        labelPosition: 'left'
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let inputData = this.user
            agentRegister(inputData).then(
              response => {
                this.$router.push({name: 'Home'})
              }, errorRes => {
              this.$message({
                showClose: true,
                message: msgFormatter(errorRes.response.data.error),
                type: 'error'
              })
            })
          } else {
            return false
          }
        })
      },
      fetchCaptcha () {
        fetchCaptcha().then(
          data => {
            this.captcha_src = data.captcha_src
            this.user.verification_code_0 = data.captcha_val
          }
      )
      },
      resetForm () {
        this.$refs['user'].resetFields()
        this.fetchCaptcha()
      }
    },
    created () {
      this.fetchCaptcha()
    },
    components: {
      TopBar
    }
  }
</script>


