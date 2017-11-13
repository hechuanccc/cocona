<template>
<el-row class="row-bg">
  <el-col :span="12" :offset="8">
    <el-row class="title">
      <el-col :offset="6" :span="4">{{$t('user.password')}}</el-col>
    </el-row>
    <el-row>
      <el-form :model="password" status-icon :rules="passwordRule" ref="password" label-width="120px">
        <el-form-item :label="$t('user.prev_password')" prop="prev_password">
          <el-input class="input-width" type="password" v-model="password.prev_password" :maxlength="15" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.new_password')" prop="new_password">
          <el-input class="input-width" type="password" v-model="password.new_password" :maxlength="15" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.confirm_password')" prop="repeat_password">
          <el-input class="input-width" type="password" v-model="password.repeat_password" :maxlength="15" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitPasswordForm">{{$t('action.submit')}}</el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-row class="title">
      <el-col :offset="6" :span="4">{{$t('user.withdraw_password')}}</el-col>
    </el-row>
    <el-row>
      <el-form :model="withdraw_password" status-icon :rules="withdrawRule" ref="withdraw_password" label-width="120px">
        <el-form-item :label="$t('user.prev_withdraw_password')" prop="current_password">
          <el-input class="input-width" type="password" v-model="withdraw_password.current_password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.new_withdraw_password')" prop="new_password">
          <el-input class="input-width" type="password" v-model="withdraw_password.new_password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.confirm_withdraw_password')" prop="repeat_password">
          <el-input class="input-width" type="password" v-model="withdraw_password.repeat_password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitWithdrawForm">{{$t('action.submit')}}</el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </el-col>
</el-row>
</template>
<script>
import { updatePassword, updateWithdrawPassword } from '../../api'
import { validatePassword } from '../../validate'
import { msgFormatter } from '../../utils'
export default {
  name: 'AccountEdit',
  data () {
    const passwordValidator = (form) => {
      return (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('validate.required')))
        } else {
          if (this[form].repeat_password !== '') {
            this.$refs[form].validateField('repeat_password')
          }
          callback()
        }
      }
    }

    const passwordFormatValidator = (rule, value, callback) => {
      if (!validatePassword(value)) {
        callback(new Error(this.$t('validate.password_validate')))
      } else {
        callback()
      }
    }

    const repeatPasswordValidator = (form) => {
      return (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('validate.password_again')))
        } else if (value !== this[form].new_password) {
          callback(new Error(this.$t('validate.password_diff')))
        } else {
          callback()
        }
      }
    }

    return {
      displayMode: true,
      password: {
        new_password: '',
        prev_password: '',
        repeat_password: ''
      },
      withdraw_password: {
        new_password: '',
        current_password: '',
        repeat_password: ''
      },
      passwordRule: {
        prev_password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        new_password: [
          { required: true, validator: passwordValidator('password'), trigger: 'blur' },
          { validator: passwordFormatValidator, trigger: 'blur,change' }
        ],
        repeat_password: [
          { required: true, validator: repeatPasswordValidator('password'), trigger: 'blur' }
        ]
      },
      withdrawRule: {
        current_password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        new_password: [
          { required: true, validator: passwordValidator('withdraw_password'), trigger: 'blur' }
        ],
        repeat_password: [
          { required: true, validator: repeatPasswordValidator('withdraw_password'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitPasswordForm () {
      this.$refs['password'].validate((valid) => {
        if (valid) {
          updatePassword(this.password).then(data => {
            this.$message({
              showClose: true,
              message: msgFormatter(data.message),
              type: 'success'
            })
          }, errorRes => {
            this.$message({
              showClose: true,
              message: msgFormatter(errorRes.response.data.error),
              type: 'error'
            })
          })
        }
      })
    },
    submitWithdrawForm () {
      this.$refs['withdraw_password'].validate((valid) => {
        if (valid) {
          updateWithdrawPassword(this.withdraw_password).then(data => {
            this.$message({
              showClose: true,
              message: msgFormatter(data.message),
              type: 'success'
            })
          }, errorRes => {
            this.$message({
              showClose: true,
              message: msgFormatter(errorRes.response.data.error),
              type: 'error'
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  padding: 20px 0;
}
</style>
