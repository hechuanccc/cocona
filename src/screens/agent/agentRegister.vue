<template>
  <div>
    <el-container>
      <el-header>
        <TopBar />
      </el-header>
      <el-main>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="6">
            <el-form :label-position="labelPosition" :model="ruleForm2" status-icon :rules="rules2" ref="ruleForm2" label-width="100px" class="demo-ruleForm">
              <el-form-item label="代理帳號設定" prop="age">
                <el-input v-model.number="ruleForm2.age"></el-input>
              </el-form-item>
              <el-form-item label="設定密码" prop="pass">
                <el-input type="password" v-model="ruleForm2.pass" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="确认密码" prop="checkPass">
                <el-input type="password" v-model="ruleForm2.checkPass" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="真實姓名" prop="age">
                <el-input v-model.number="ruleForm2.age"></el-input>
              </el-form-item>
              <el-form-item label="手機號碼" prop="age">
                <el-input v-model.number="ruleForm2.age"></el-input>
              </el-form-item>
              <el-form-item label="郵箱" prop="age">
                <el-input v-model.number="ruleForm2.age"></el-input>
              </el-form-item>
              <el-form-item label="驗證碼" prop="age">
                <el-input v-model.number="ruleForm2.age"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm2')">提交</el-button>
              </el-form-item>
            </el-form>
          </el-col>    
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
  import TopBar from '../../components/TopBar'
  
  export default {
    data () {
      var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'))
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'))
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'))
            } else {
              callback()
            }
          }
        }, 1000)
      }
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.ruleForm2.checkPass !== '') {
            this.$refs.ruleForm2.validateField('checkPass')
          }
          callback()
        }
      }
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.ruleForm2.pass) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        ruleForm2: {
          pass: '',
          checkPass: '',
          age: ''
        },
        rules2: {
          pass: [{
            validator: validatePass,
            trigger: 'blur'
          }],
          checkPass: [{
            validator: validatePass2,
            trigger: 'blur'
          }],
          age: [{
            validator: checkAge,
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
            alert('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    },
    components: {
      TopBar
    }
  }
</script>

<style lang="sass" scoped>
.el-row
  margin-bottom: 20px
  &:last-child
    margin-bottom: 0

.el-col
  border-radius: 4px

.row-bg
  padding: 10px 0
  background-color: #f9fafc
</style>


