<template>
<el-row>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane :label="$t('user.primary_info')" name="PrimaryInfo"></el-tab-pane>
    <el-tab-pane :label="$t('user.password_setting')" name="PasswordSetting"></el-tab-pane>
    <el-tab-pane :label="$t('user.withdraw_password')" name="WithdrawPassword"></el-tab-pane>
    <el-tab-pane :label="$t('user.bank_info')" name="BankInfo"></el-tab-pane>
  </el-tabs>
  <router-view/>
</el-row>
</template>
<script>
export default {
  name: 'MyAccount',
  data () {
    return {
      activeName: this.$route.name
    }
  },
  beforeRouteEnter (to, from, next) {
    if (to.name === 'MyAccount') {
      next({ name: 'PrimaryInfo' })
    } else {
      next()
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.name === 'MyAccount') {
        this.$router.push({ name: 'PrimaryInfo' })
      }
    },
    '$route.name': function () {
      this.activeName = this.$route.name
    }
  },
  methods: {
    handleClick (tab, event) {
      this.$router.push({ name: tab.name })
    }
  }
}
</script>
