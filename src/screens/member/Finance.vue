<template>
<el-row>
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane :label="$t('user.payment_record')" name="PaymentRecord"></el-tab-pane>
    <el-tab-pane :label="$t('user.remit_record')" name="RemitRecord"></el-tab-pane>
    <el-tab-pane :label="$t('user.betrecord')" name="BetRecord"></el-tab-pane>
  </el-tabs>
  <router-view class="content"/>
</el-row>
</template>
<script>
export default {
  name: 'Finance',
  data () {
    return {
      activeName: 'PaymentRecord'
    }
  },
  beforeRouteEnter (to, from, next) {
    if (to.name === 'Finance') {
      next({ name: 'PaymentRecord' })
    } else {
      next()
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.name === 'Finance') {
        this.$router.push({ name: 'PaymentRecord' })
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
