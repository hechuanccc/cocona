<template>
  <el-container class="container">
    <el-header>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('navMenu.personal_account')}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-container>
      <el-aside width="180px">
        <ul class="side-menu">
          <li>
            <span>{{$t('user.username')}}</span>
            {{user.username}}
          </li>
          <li>
            <span>{{$t('user.balance')}}</span>
            <strong class="balance">￥{{user.balance}}</strong>
          </li>
        </ul>
        <el-menu :default-active="currentPath" text-color="#fff" active-text-color="#fff" :background-color="style.primaryColor"
          :router="true">
          <el-menu-item index="/account/online_payment">
            <icon name="credit-card"></icon>
            <span slot="title" class="menu-text">{{$t('user.online_payment')}}</span>
          </el-menu-item>
          <el-menu-item index="/account/remit">
            <icon name="credit-card-alt"></icon>
            <span slot="title" class="menu-text">{{$t('user.remit')}}</span>
          </el-menu-item>
          <el-menu-item index="/account/withdraw">
            <icon name="file-text-o" />
            <span slot="title" class="menu-text">{{$t('user.withdraw')}}</span>
          </el-menu-item>
          <el-menu-item index="/account/finance">
            <icon name="list-ul" />
            <span slot="title" class="menu-text">{{$t('user.finance')}}</span>
          </el-menu-item>
          <el-menu-item index="/account/my">
            <icon name="user" />
            <span slot="title" class="menu-text">{{$t('user.my_account')}}</span>
          </el-menu-item>
          <el-menu-item index="/account/message">
            <icon name="envelope-o" />
            <span slot="title" class="menu-text">{{$t('user.message')}}</span>
          </el-menu-item>
          <el-menu-item index="/account/announcement">
            <icon name="bullhorn" />
            <span slot="title" class="menu-text">{{$t('user.announcement')}}</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>


<script>
import 'vue-awesome/icons/credit-card'
import 'vue-awesome/icons/credit-card-alt'
import 'vue-awesome/icons/file-text-o'
import 'vue-awesome/icons/list-ul'
import 'vue-awesome/icons/user'
import 'vue-awesome/icons/envelope-o'
import 'vue-awesome/icons/bullhorn'

import urls from '../../api/urls'
import style from '../../style'
import Vue from 'vue'

export default {
  name: 'Account',
  data () {
    return {
      style,
      formSrc: urls.payment,
      token: Vue.cookie.get('access_token')
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    },
    currentPath () {
      const path = this.$route.path
      const paths = path.split('/')
      if (paths.length > 3) {
        return `/${paths[1]}/${paths[2]}`
      } else {
        return path
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    if (to.name === 'Account') {
      next({ name: 'MyAccount' })
    } else {
      next()
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.name === 'Account') {
        this.$router.push({ name: 'MyAccount' })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../style/vars.scss";
.el-main {
  padding-top: 0;
}
.container {
  border-top: 1px solid #ededed;
  padding-top: 20px;
}
.el-menu .el-menu-item {
  &.is-active {
    background: url("../../assets/active_menu_bg_right.png") no-repeat center
      right;
    background-size: 200px 44px;
    border-bottom-width: 0;
  }
}
.fa-icon {
  width: 16px;
}
.menu-text {
  padding-left: 10px;
}
.el-menu-item,
.el-submenu__title {
  height: 44px;
  line-height: 44px;
}
.side-menu {
  padding: 10px 0;
  border: 1px solid #efefef;
  color: #333;

  li {
    padding: 3px 0;
    span {
      display: inline-block;
      width: 60px;
      text-align: center;
      color: #999;
    }
    &.center {
      margin-top: 10px;
      text-align: center;
    }
  }
}
.balance {
  color: #67C23A;
  font-size: 14px;
}
</style>


