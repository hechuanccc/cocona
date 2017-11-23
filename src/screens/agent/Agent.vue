<template>
  <el-row class="row-bg">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('agent.register')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <router-view/>
    </div>
  </el-row>
</template>

<script>
export default {
  beforeRouteEnter: (to, from, next) => {
    if (to.name === 'Agent') {
      next({ name: 'AgentRegister' })
    } else {
      next()
    }
  }
}
</script>

