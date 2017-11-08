<template>
  <div>
    <el-row type="flex" class="row-bg" justify="center">
      <el-col :span="8">
        <el-form :label-position="labelPosition"
                 :model="ruleForm"
                 status-icon
                 :rules="formRules"
                 ref="ruleForm"
                 label-width="100px">
          <el-tooltip :content="$t('validate.username_validate')" placement="right">
            <el-form-item :label="$t('agent.username')" prop="username">
              <el-input v-model.number="ruleForm.username"></el-input>
            </el-form-item>
          </el-tooltip>
            <el-tooltip :content="$t('validate.password_validate')" placement="right">
              <el-form-item :label="$t('agent.password')" prop="password">
                <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
              </el-form-item>
            </el-tooltip>
            <el-form-item :label="$t('agent.confirm_password')" prop="confirm_password">
              <el-input type="password" v-model="ruleForm.confirm_password" auto-complete="off"></el-input>
            </el-form-item>
            <el-tooltip :content="$t('agent.realname_tip')" placement="right">
              <el-form-item :label="$t('agent.real_name')" prop="real_name">
                <el-input v-model="ruleForm.real_name"> </el-input>
              </el-form-item>
            </el-tooltip>
            <el-form-item :label="$t('agent.phone')" prop="phone">
              <el-input v-model="ruleForm.phone" number></el-input>
            </el-form-item>
            <el-form-item :label="$t('agent.email')" prop="email">
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-tooltip placement="right" effect="light" :value="captcha.show" :manual="true">
              <div slot="content">
                <img :src="captcha.img" @click="grabCaptcha()">
                <br/>{{$t('agent.captcha_reset')}}</div>
              <el-form-item :label="$t('agent.captcha')" prop="captcha_1">
                <el-input v-model="ruleForm.captcha_1"
                          @focus="captcha.show = true"
                          @blur="captcha.show = false"
                          @keyup.enter.native="submitForm('ruleForm')"></el-input>
              </el-form-item>
            </el-tooltip>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')" size="medium">{{$t('action.submit')}}</el-button>
            </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
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
            message: this.$t('validate.username_required'),
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            message: this.$t('validate.phone_required'),
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
            message: this.$t('validate.captcha_required'),
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
        getCaptcha().then(
        response => {
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
        }
      )
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

<style lang="sass" scoped>
.row-bg
  padding: 10px 0
  background-image: linear-gradient(180deg, #fdfbfb 0%, #ebedee 100%)
</style>


