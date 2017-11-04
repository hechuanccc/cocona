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
          <el-tooltip content="6~10个字符的代理帐号" placement="right">
            <el-form-item label="代理帐号" prop="username">
              <el-input v-model.number="ruleForm.username"></el-input>
            </el-form-item>
          </el-tooltip>
            <el-tooltip content="密码请至少含有两个字母且4-13个字符" placement="right">
              <el-form-item label="設定密码" prop="password">
                <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
              </el-form-item>
            </el-tooltip>
            <el-form-item label="确认密码" prop="confirm_password">
              <el-input type="password" v-model="ruleForm.confirm_password" auto-complete="off"></el-input>
            </el-form-item>
            <el-tooltip content="提醒：真实姓名必须与您用于提款银行账户名称一致唷" placement="right">
              <el-form-item label="真实姓名" prop="real_name">
                <el-input v-model="ruleForm.real_name"> </el-input>
              </el-form-item>
            </el-tooltip>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="ruleForm.phone" number></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="ruleForm.email"></el-input>
            </el-form-item>
            <el-tooltip placement="right" effect="light" :value="captcha.show" :manual="true">
              <div slot="content">
                <img :src="captcha.img" @click="grabCaptcha()">
                <br/>点击图片换一张</div>
              <el-form-item label="验证码" prop="captcha_1">
                <el-input v-model="ruleForm.captcha_1" 
                          @focus="captcha.show = true" 
                          @blur="captcha.show = false" 
                          @keyup.enter.native="submitForm('ruleForm')"></el-input>
              </el-form-item>
            </el-tooltip>
            <el-form-item>
              <el-button type="primary" @click="submitForm('ruleForm')" size="medium">提交</el-button>
            </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import TopBar from '../../components/TopBar'
  import {register, getCaptcha} from '../../api'
  import api from '../../api/urls'
  
  export default {
    data () {
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm.password) {
          callback(new Error('两次输入密码不一致!'))
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
        formRules: {
          username: [{
            required: true,
            pattern: /^[a-zA-Z0-9]{4,10}$/,
            message: '6~10个字符的代理帐号',
            trigger: 'blur'
          }],
          password: [{
            required: true,
            pattern: /^[a-zA-Z]{2}[a-zA-Z0-9]{4,13}$/,
            message: '密码请至少含有两个字母且4-13个字符',
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
            message: '请输入真实姓名',
            trigger: 'blur'
          }],
          phone: [{
            required: true,
            pattern: /^\d{11}$/,
            message: '请输入 11 位手机号',
            trigger: 'blur'
          }],
          email: [{
            required: true,
            pattern: /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/,
            message: '请输入正确格式的邮箱',
            trigger: 'blur'
          }],
          captcha_1: [{
            required: true,
            message: '请输入验证码',
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
            register(inputData).then(
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


