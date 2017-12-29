<template>
  <div>
    <el-row class="m-t-lg">
      <el-col :offset="8" :span="10">
        <el-alert
          v-if="updateStatus !== 0"
          :title="message"
          :type="updateStatus === 1 ? 'success' : 'error'"
          :closable="false"
          center>
        </el-alert>
      </el-col>
    </el-row>
    <el-row>
      <el-col :offset="8" :span="16">
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
            <el-button type="primary" class="submit" :disabled="updateStatus===1" @click="submitWithdrawForm">{{$t('action.submit')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { updateWithdrawPassword } from '../../api'
import { validateWithdrawPassword } from '../../validate'
import { msgFormatter } from '../../utils'

export default {
  name: 'WithdrawPassword',
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
      if (!validateWithdrawPassword(value)) {
        callback(new Error(this.$t('validate.withdraw_password_validate')))
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
      withdraw_password: {
        new_password: '',
        current_password: '',
        repeat_password: ''
      },
      withdrawRule: {
        current_password: [
          { required: true, message: this.$t('validate.required'), trigger: 'blur' }
        ],
        new_password: [
          { required: true, validator: passwordValidator('withdraw_password'), trigger: 'blur' },
          { validator: passwordFormatValidator, trigger: 'blur,change' }
        ],
        repeat_password: [
          { required: true, validator: repeatPasswordValidator('withdraw_password'), trigger: 'blur' }
        ]
      },
      updateStatus: 0,
      message: ''
    }
  },
  methods: {
    submitWithdrawForm () {
      this.$refs['withdraw_password'].validate((valid) => {
        if (valid) {
          updateWithdrawPassword(this.withdraw_password).then(data => {
            this.updateStatus = 1
            this.message = this.$t('message.save_success')
            this.$refs.withdraw_password.resetFields()
            setTimeout(() => {
              this.updateStatus = 0
            }, 3000)
          }, errorMsg => {
            this.updateStatus = -1
            this.$refs.withdraw_password.resetFields()
            this.message = msgFormatter(errorMsg)
          })
        }
      })
    }
  }

}
</script>
