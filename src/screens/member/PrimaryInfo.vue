<template>
<el-row >
  <el-col :span="10" :offset="7">
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
        <el-date-picker type="date" :placeholder="$t('user.choose_date')" v-model="user.birthday" value-format="yyyy-MM-dd" style="width: 200px;"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('user.gender')">
        <el-radio-group v-model="user.gender">
          <el-radio :label="'M'">{{$t('user.male')}}</el-radio>
          <el-radio :label="'F'">{{$t('user.female')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="QQ" prop="qq">
        <el-input class="input-width" v-model="user.qq"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.wechat')" prop="wechat">
        <el-input class="input-width" v-model="user.wechat"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">{{$t('action.save')}}</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</el-row>
</template>
<script>
import { msgFormatter } from '../../utils'
import Vue from 'vue'
export default {
  name: 'PrimaryInfo',
  filters: {
    genderFilter (value) {
      return value === 'M' ? Vue.t('user.male') : Vue.t('user.female')
    }
  },
  data () {
    return {
      user: {
        id: '',
        gender: '',
        email: '',
        qq: '',
        wechat: '',
        birthday: ''
      },
      rules: {
        email: [
          { type: 'email', message: this.$t('validate.email_validate'), trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    userInfo () {
      let user = this.$store.state.user
      Object.keys(this.user).forEach(key => {
        this.user[key] = user[key]
      })
      return user
    }
  },
  methods: {
    submitForm () {
      this.$refs['user'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('updateUser', this.user).then(
            (data) => {
              this.$refs['user'].clearValidate()
              this.$message({
                showClose: true,
                message: this.$t('message.save_success'),
                type: 'success'
              })
            },
            errorRes => {
              this.$message({
                showClose: true,
                message: msgFormatter(errorRes.response.data.error),
                type: 'error'
              })
            }
          )
        }
      })
    }
  }
}
</script>

