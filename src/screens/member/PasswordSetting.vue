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
            <el-button type="primary" class="submit" :disabled="updateStatus===1" @click="submitPasswordForm">{{$t('action.submit')}}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { updatePassword } from '../../api'
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
      updateStatus: 0,
      message: ''
    }
  },
  methods: {
    submitPasswordForm () {
      this.$refs['password'].validate((valid) => {
        if (valid) {
          updatePassword(this.password).then(data => {
            this.updateStatus = 1
            this.message = this.$t('message.save_success')
            setTimeout(() => {
              this.updateStatus = 0
              this.$store.commit('RESET_USER')
              this.$router.push({name: 'Home'})
              this.$store.commit('SHOW_LOGIN_DIALOG')
            }, 3000)
          }, errorMsg => {
            this.updateStatus = -1
            this.message = msgFormatter(errorMsg)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
