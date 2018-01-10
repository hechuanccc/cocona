<template>
<el-row >
  <el-col :span="10" :offset="7">
    <el-alert
      v-if="updateStatus !== 0"
      :title="message"
      :type="updateStatus === 1 ? 'success' : 'error'"
      :closable="false"
      center>
    </el-alert>
    <el-form :model="user" status-icon :rules="rules" ref="user" label-width="150px">
      <el-form-item :label="$t('user.username')">
        {{userInfo.username}}
      </el-form-item>
      <el-form-item :label="$t('user.realname')">
        {{userInfo.real_name}}
      </el-form-item>
      <el-form-item :label="$t('user.phone')">
        {{userInfo.phone}}
      </el-form-item>
      <el-form-item :label="$t('user.email')" prop="email">
        <el-input class="input-width" v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.birthday')" prop="birthday">
        <el-date-picker type="date" :placeholder="$t('user.choose_date')" v-model="user.birthday" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('user.gender')">
        <el-radio-group v-model="user.gender">
          <el-radio :label="'M'">{{$t('user.male')}}</el-radio>
          <el-radio :label="'F'">{{$t('user.female')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="QQ" prop="qq" ref="qq">
        <el-input class="input-width" v-model="user.qq"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.wechat')" prop="wechat">
        <el-input class="input-width" v-model="user.wechat"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="input-width" :disabled="updateStatus===1" @click="submitForm">{{$t('action.save')}}</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</el-row>
</template>
<script>
import { msgFormatter } from '../../utils'
import { validateQQ } from '../../validate'
import Vue from 'vue'
export default {
  name: 'PrimaryInfo',
  filters: {
    genderFilter (value) {
      return value === 'M' ? Vue.t('user.male') : Vue.t('user.female')
    }
  },
  data () {
    const qqValidator = (rule, value, callback) => {
      if (this.originUser.qq === '' && !value) {
        this.$refs.qq.clearValidate()
      } else if (!validateQQ(value)) {
        callback(new Error(this.$t('validate.qq_validate')))
      } else {
        callback()
      }
    }
    return {
      user: {
        id: '',
        gender: '',
        email: '',
        qq: '',
        wechat: '',
        birthday: ''
      },
      originUser: {},
      rules: {
        email: [
          { type: 'email', message: this.$t('validate.email_validate'), trigger: 'change' }
        ],
        qq: [
          { validator: qqValidator, trigger: 'change' }
        ]
      },
      updateStatus: 0,
      message: ''
    }
  },
  created () {
    const user = this.$store.state.user
    this.originUser = { ...user }
    Object.keys(this.user).forEach(key => {
      this.user[key] = user[key]
    })
  },
  computed: {
    userInfo () {
      return this.$store.state.user
    },
    updatedField () {
      return ['email', 'qq'].filter(key => {
        return this.user[key] !== this.originUser[key]
      })
    }
  },
  methods: {
    submitForm () {
      let isValid = true
      this.updatedField.forEach(field => {
        this.$refs['user'].validateField(field, (errorMsg) => {
          if (errorMsg) {
            isValid = false
          }
        })
      })
      if (isValid) {
        this.originUser = { ...this.user }
        this.$store.dispatch('updateUser', this.user).then(
          (data) => {
            this.$refs['user'].clearValidate()
            this.updateStatus = 1
            this.message = this.$t('message.save_success')
            setTimeout(() => {
              this.updateStatus = 0
            }, 3000)
          },
          errorMsg => {
            this.updateStatus = -1
            this.message = msgFormatter(errorMsg)
          }
        )
      }
    }
  }
}
</script>

