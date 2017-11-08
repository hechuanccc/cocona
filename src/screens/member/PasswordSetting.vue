<template>
<el-row class="row-bg">
  <el-col :span="10" :offset="7">
    <el-form :model="user" status-icon :rules="rules" ref="user" label-width="150px">
      <el-form-item :label="$t('user.level')">
        {{level}}
      </el-form-item>
      <el-form-item :label="$t('user.realname')">
        <span v-if="displayMode">{{userInfo.real_name}}</span>
        <el-input v-else v-model="user.real_name"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.phone')">
        <span v-if="displayMode">{{userInfo.phone}}</span>
        <el-input v-else v-model="user.phone"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.email')" prop="email">
        <span v-if="displayMode">{{userInfo.email}}</span>
        <el-input v-else v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.gender')">
        <span v-if="displayMode">{{userInfo.gender}}</span>
        <el-radio-group v-else v-model="user.gender">
          <el-radio :label="'M'">{{$t('user.male')}}</el-radio>
          <el-radio :label="'F'">{{$t('user.female')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button v-if="displayMode" type="primary" @click="modifyForm">{{$t('action.modify')}}</el-button>
        <el-button v-if="!displayMode" type="primary" @click="submitForm">{{$t('action.submit')}}</el-button>
        <el-button v-if="!displayMode" @click="resetForm">{{$t('action.reset')}}</el-button>
      </el-form-item>
    </el-form>
  </el-col>
</el-row>
</template>
<script>
import { updateUser } from '../../api'
export default {
  name: 'AccountEdit',
  data () {
    return {
      displayMode: true,
      user: {
        id: '',
        real_name: '',
        gender: '',
        phone: '',
        email: ''
      },
      captcha_src: '',
      rules: {
        email: [
          { type: 'email', message: this.$t('validate.email_validate'), trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    level () {
      if (this.$store.state.user.level) {
        return this.$store.state.user.level.name
      } else {
        return ''
      }
    },
    userInfo () {
      return this.$store.state.user
    }
  },
  methods: {
    modifyForm () {
      this.displayMode = false
      Object.keys(this.user).forEach(key => {
        this.user[key] = this.userInfo[key]
      })
    },
    submitForm () {
      this.$refs['user'].validate((valid) => {
        if (valid) {
          updateUser(this.user).then(data => {
            console.log(data)
          })
        }
      })
    },
    resetForm () {
      this.$refs['user'].resetFields()
    }
  }
}
</script>

