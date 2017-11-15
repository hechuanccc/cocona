<template>
<el-row>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="基本信息" name="PrimaryInfo"></el-tab-pane>
    <el-tab-pane label="密码修改" name="PasswordSetting"></el-tab-pane>
    <el-tab-pane label="取款密码" name="WithdrawPassword"></el-tab-pane>
    <el-tab-pane label="银行信息" name="BankInfo"></el-tab-pane>
  </el-tabs>
  <router-view class="content"/>
</el-row>
</template>
<script>
export default {
  name: 'MyAccount',
  data () {
    return {
      activeName: 'PrimaryInfo'
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
    }
  },
  methods: {
    handleClick (tab, event) {
      this.$router.push({ name: tab.name })
    }
  }
}
</script>

<style lang="scss" scoped>
.content{
  padding-top: 50px;
}
</style>
