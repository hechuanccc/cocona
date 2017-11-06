<template>
  <el-menu :default-active="activeIndex2" class="el-menu-demo" mode="horizontal" @select="handleSelect" background-color="#3399CC"
    text-color="#DAF5FF" active-text-color="#FFFFFF">
    <el-menu-item index="1">投注中心</el-menu-item>
    <el-submenu index="2">
      <template slot="title">个人帐户中心</template>
      <el-menu-item index="2-1">会员注册</el-menu-item>
      <el-menu-item index="2-2">一般会员注册</el-menu-item>
    </el-submenu>
    <el-menu-item index="3">歷史開獎</el-menu-item>
    <el-submenu index="4">
      <template slot="title">新手上路</template>
      <el-menu-item index="4-1">遊戲介紹</el-menu-item>
      <el-menu-item index="4-2">常見問題</el-menu-item>
    </el-submenu>
    <el-menu-item index="5">加盟合作</el-menu-item>
  </el-menu>
</template>


<script>
  export default {
    data () {
      return {
        activeIndex: '1',
        activeIndex2: '1'
      }
    },
    methods: {
      handleSelect (key, keyPath) {
        console.log(key, keyPath)
      }
    }
  }
</script>
<style lang="scss">
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
</style>