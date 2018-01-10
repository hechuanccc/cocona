<template>
  <el-row class="row-bg">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="currentPage">{{$t('navMenu.affliate')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="aside">
        <AsideMenu @clicked="onClickChild" :items="pages"/>
        <a class="m-l-xlg m-r-sm login" :href="$store.state.systemConfig.agentDashboardUrl">代理登入</a>
      </div>
      <div class="main m-b-xlg">
        <component :is="currentPage"></component>
      </div>
    </div>
  </el-row>
</template>

<script>
import AsideMenu from '../../components/AsideMenu'
const Plan = (resolve) => require(['./AgentPlan'], resolve)
const Agreement = (resolve) => require(['./AgentAgreement'], resolve)
const Register = (resolve) => require(['./AgentRegister'], resolve)
export default {
  components: {
    AsideMenu,
    Plan,
    Agreement,
    Register
  },
  data () {
    return {
      currentPage: 'Plan',
      pages: [
        { display_name: '加盟方案', code: 'Plan' },
        { display_name: '联盟协议', code: 'Agreement' },
        { display_name: '代理注册', code: 'Register' }
      ]
    }
  },
  methods: {
    onClickChild (page) {
      this.currentPage = page
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/vars.scss";
@import "../../style/base.scss";

.aside {
  display: inline-block;
  vertical-align: top;
}

.main {
  box-sizing: border-box;
  display: inline-block;
  width: 1094px;
  height: auto;
  padding: 40px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  .box-card {
    min-height: 300px;
    @extend %text;
  }
}

.login {
  display: block;
  width: 210px;
  height: 40px;
  line-height: 40px;
  padding-left: 30px;
  font-size: 14px;
  background-color: #fff;
  color: $azul;
  text-decoration: none;
  cursor: pointer;
}

</style>
