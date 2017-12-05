<template>
  <el-row>
    <el-col :span="16" :offset="8">
      <el-form :model="ruleForm"
                status-icon
                :rules="formRules"
                ref="ruleForm"
                label-width="150px">

          <el-form-item :label="$t('agent.username')" prop="username">
            <el-input class="input-width" :maxlength="10" v-model.number="ruleForm.username"></el-input>
          </el-form-item>
          <el-form-item :label="$t('agent.password')" prop="password">
            <el-input class="input-width" :maxlength="15" type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('agent.confirm_password')" prop="confirm_password">
            <el-input class="input-width" :maxlength="15" type="password" v-model="ruleForm.confirm_password" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('agent.real_name')" prop="real_name">
            <el-input class="input-width" v-model="ruleForm.real_name"> </el-input>
          </el-form-item>
          <el-form-item :label="$t('agent.phone')" prop="phone">
            <el-input class="input-width" v-model="ruleForm.phone" number></el-input>
          </el-form-item>
          <el-form-item :label="$t('agent.email')" prop="email">
            <el-input class="input-width" v-model="ruleForm.email"></el-input>
          </el-form-item>
          <el-form-item :label="$t('agent.captcha')" required>
          <el-col :span="7">
            <el-form-item  prop="captcha_1">
              <el-input class="input-width" :maxlength="4" v-model="ruleForm.captcha_1" auto-complete="off">
                <el-button slot="suffix" type="info" icon="el-icon-refresh" @click="grabCaptcha"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4" :offset="1">
            <img :src="captcha.img" alt="" height="30">
          </el-col>
        </el-form-item>
          <el-form-item>
            <el-button type="primary" class="input-width" @click="submitForm('ruleForm')" size="medium">{{$t('action.submit')}}</el-button>
          </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
  import TopBar from '../../components/TopBar'
  import {agentRegister, getCaptcha} from '../../api'
  import api from '../../api/urls'

  export default {
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('validate.password_again')))
        } else if (value !== this.ruleForm.password) {
          callback(new Error(this.$t('validate.password_diff')))
        } else {
          callback()
        }
      }
      return {
        ruleForm: {
          username: '',
          password: '',
          confirm_password: '',
          real_name: '',
          phone: '',
          email: '',
          captcha_0: '',
          captcha_1: ''
        },
        captcha: {
          img: '',
          show: false
        },
        captcha1: {
          img: '',
          show: false
        },
        formRules: {
          username: [{
            required: true,
            pattern: /^[a-zA-Z0-9]{4,10}$/,
            message: this.$t('validate.username_validate'),
            trigger: 'blur'
          }],
          password: [{
            required: true,
            pattern: /^[a-zA-Z]{2}[a-zA-Z0-9]{4,13}$/,
            message: this.$t('validate.password_validate'),
            trigger: 'blur'
          }],
          confirm_password: [{
            required: true,
            validator: validatePass,
            trigger: 'blur'
          }],
          real_name: [{
            required: true,
            pattern: /^\D*$/,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }],
          email: [{
            required: true,
            pattern: /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
            message: this.$t('validate.email_validate'),
            trigger: 'blur'
          }],
          captcha_1: [{
            required: true,
            message: this.$t('validate.required'),
            trigger: 'blur'
          }]
        },
        labelPosition: 'left'
      }
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let inputData = this.ruleForm
            agentRegister(inputData).then(
              response => {
                this.$router.push({name: 'Home'})
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
          } else {
            return false
          }
        })
      },
      grabCaptcha () {
        getCaptcha().then(response => {
          this.captcha.show = true
          this.ruleForm.captcha_0 = response.data.captcha_val
          this.captcha.img = api.domain + response.data.captcha_src
        },
        errorRes => {
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
      this.grabCaptcha()
    },
    components: {
      TopBar
    }
  }
</script>

<style lang="sass" scoped="">
.el-input /deep/ .el-input__suffix
  right: 0
</style>
