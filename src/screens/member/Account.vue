<template>
  <div>
    <header>
      <el-row class="row-bg">
        <div class="container">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{$t('navMenu.personal_account')}}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </el-row>
    </header>
    <el-container class="container no-border">
      <div class="aside m-r-sm">
        <AsideMenu v-show="user.onlinePaymentTypes && user.onlinePaymentTypes.length" @clicked="onClickChild" :items="menus" :defaultActive="currentPath" />
        <AsideMenu v-show="!(user.onlinePaymentTypes && user.onlinePaymentTypes.length)" @clicked="onClickChild" :items="noOnlinePayMenus" :defaultActive="currentPath" />
      </div>
      <div class="main m-b-xlg">
        <router-view/>
      </div>
    </el-container>
  </div>
</template>

<script>
import 'vue-awesome/icons/credit-card'
import 'vue-awesome/icons/arrow-circle-right'
import 'vue-awesome/icons/file'
import 'vue-awesome/icons/list-ul'
import 'vue-awesome/icons/user'
import 'vue-awesome/icons/envelope'
import 'vue-awesome/icons/bullhorn'

import urls from '../../api/urls'
import style from '../../style'
import Vue from 'vue'
import AsideMenu from '../../components/AsideMenu.vue'

export default {
  name: 'Account',
  components: {
    AsideMenu
  },
  data () {
    const menus = [
      {
        display_name: this.$t('user.online_payment'),
        route: '/account/online_payment',
        leftIcon: 'credit-card'
      },
      {
        display_name: this.$t('user.remit'),
        route: '/account/remit',
        leftIcon: 'arrow-circle-right'
      },
      {
        display_name: this.$t('user.withdraw'),
        route: '/account/withdraw',
        leftIcon: 'file'
      },
      {
        display_name: this.$t('user.finance'),
        route: '/account/finance',
        leftIcon: 'list-ul'
      },
      {
        display_name: this.$t('user.my_account'),
        route: '/account/my',
        leftIcon: 'user'
      },
      {
        display_name: this.$t('user.message'),
        route: '/account/message',
        leftIcon: 'envelope'
      },
      {
        display_name: this.$t('user.announcement'),
        route: '/account/announcement',
        leftIcon: 'bullhorn'
      }
    ]

    const noOnlinePayMenus = menus.filter(item => item.route !== '/account/online_payment')

    return {
      style,
      formSrc: urls.payment,
      token: Vue.cookie.get('access_token'),
      menus,
      noOnlinePayMenus
    }
  },
  methods: {
    onClickChild (e) {
      this.$router.push(e.route)
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
      next(vm => {
        vm.$store.dispatch('fetchUser')
          .catch(error => {
            if (error.response.status > 400) {
              vm.performLogin()
            }
          })
      })
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
@import "../../style/base.scss";
.aside {
  display: inline-block;
  vertical-align: top;
}
.main {
  display: inline-block;
  box-sizing: border-box;
  width: $main_width;
  min-height: 50vh;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding: 10px 20px;
  @extend %text;
}
.el-main {
  margin-left: 20px;
  background: #fff;
}
</style>


