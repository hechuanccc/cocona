<template>
<el-row class="row-bg">
  <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
    <el-tab-pane label="基本信息" ></el-tab-pane>
    <el-tab-pane label="密码修改" ></el-tab-pane>
    <el-tab-pane label="取款密码" ></el-tab-pane>
    <el-tab-pane label="银行信息" ></el-tab-pane>
  </el-tabs>
  <router-view />
  <el-col :span="10" :offset="7">
    <el-form :model="user" status-icon :rules="rules" ref="user" label-width="150px">
      <el-form-item :label="$t('user.level')">
        {{level}}
      </el-form-item>
      <el-form-item :label="$t('user.email')" prop="email">
        <span v-if="displayMode">{{userInfo.email}}</span>
        <el-input v-else v-model="user.email"></el-input>
      </el-form-item>
      <el-form-item :label="$t('user.gender')">
        <span v-if="displayMode">{{userInfo.gender | genderFilter}}</span>
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
      displayMode: true,
      user: {
        id: '',
        gender: '',
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
      this.resetForm()
      this.displayMode = false
    },
    submitForm () {
      this.$refs['user'].validate((valid) => {
        if (valid) {
          this.$store.dispatch('updateUser', this.user).then(
            (data) => { this.displayMode = true },
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
    },
    resetForm () {
      Object.keys(this.user).forEach(key => {
        this.user[key] = this.userInfo[key]
      })
    }
  }
}
</script>

