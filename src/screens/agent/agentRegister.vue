<template>
  <div class="agent-register">
    <el-steps :active="0" finish-status="success"  simple>
      <el-step title="代理註冊" icon="el-icon-edit" ></el-step>
      <el-step title="註冊完成" icon="el-icon-success"></el-step>
      <el-step title="代理登入" icon="el-icon-star-on" ></el-step>
    </el-steps>
      <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="8">
            <el-form :label-position="labelPosition" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="代理帳號設定" prop="username">
                <el-input v-model.number="ruleForm.username"></el-input>
              </el-form-item>
              <el-form-item label="設定密码" prop="password">
                <el-input type="password" v-model="ruleForm.password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="confirm_password">
                <el-input type="password" v-model="ruleForm.confirm_password" auto-complete="off"></el-input>
              </el-form-item>
              <el-tooltip class="item" content="真实姓名必须与您用于提款银行账户名称一致唷" placement="right">
              <el-form-item label="真實姓名" prop="real_name">
                <el-input v-model="ruleForm.real_name"> </el-input>
              </el-form-item>
              </el-tooltip>
              <el-form-item label="手機號碼" prop="phone">
                <el-input v-model="ruleForm.phone" number></el-input>
              </el-form-item>
              <el-form-item label="郵箱" prop="email">
                <el-input v-model="ruleForm.email"></el-input>
              </el-form-item>
              <el-tooltip class="item" placement="right" effect="light" :value="captcha.show">
              <div slot="content" manual="true"><img :src="captcha.img" @click="reCaptcha()"></div>
              <el-form-item label="驗證碼">
                <el-input v-model="ruleForm.captcha_1"  @focus="captcha.show = true" @blur="captcha.show = false"></el-input> 
              </el-form-item>  
              </el-tooltip>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')" size= "mini">提交</el-button>
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
      var checkusername = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为空'))
        }
        setTimeout(() => {
          if (value.length > 16 || value.length < 7) {
            callback(new Error('帐户名由6-15个字符组成'))
          }
          callback()
        }, 1000)
      }
      // var checkname = (rule, value, callback) => {
      //   if (!value) {
      //     return callback(new Error('不能为空'))
      //   }
      //   setTimeout(() => {
      //     if () {
      //       callback(new Error('帐户名由6-15个字符组成'))
      //     }
      //     callback()
      //   }, 1000)
      // }
      var validatePass = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm.confirm_password !== '') {
            this.$refs.ruleForm.validateField('confirm_password')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
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
        rules: {
          password: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          confirm_password: [{
            validator: validatePass2,
            trigger: 'blur'
          }],
          username: [{
            validator: checkusername,
            trigger: 'blur'
          }],
          phone: [{
            pattern: /^\d{11}$/,
            message: '请输入 11 位手机号'
          }]
        },
        labelPosition: 'left',
        isLoading: false
      }
    },
    created () {
      getCaptcha().then(
        response => {
          this.captcha.show = true
          this.ruleForm.captcha_0 = response.data.captcha_val
          this.captcha.img = api.domain + response.data.captcha_src
        },
        response => {
          console.log('capture lost')
        }
      )
    },
    methods: {
      submitForm (formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let inputData = this.ruleForm
            register(inputData).then(
              response => {
                console.log('post success')
                console.log(response)
              }, response => {
              console.log(response)
              console.log('post fail')
              console.log(this.$route.path.push)
              this.$route.path.push('/success')
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      reCaptcha () {
        this.captcha.show = true
        getCaptcha().then(
        response => {
          this.ruleForm.captcha_0 = response.data.captcha_val
          this.captcha.img = api.domain + response.data.captcha_src
        },
        response => {
          console.log('capture lost')
        }
      )
      }
    },
    components: {
      TopBar
    }
  }
</script>

<style lang="sass" scoped>
.el-row
  border-radius: 3px
  box-shadow: 0px 0px 3px rgba(0,0,0,.1)

.row-bg
  padding: 10px 0
  background-image: linear-gradient(180deg, #fdfbfb 0%, #ebedee 100%)
</style>


