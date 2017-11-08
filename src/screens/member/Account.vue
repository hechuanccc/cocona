<template>
  <el-container>
    <el-aside width="250px">
      <div :class="['avatar', gender]"></div>
      <div class="welcome">{{username}} 你好</div>
      <el-menu default-active="/account/primary_info" :router="true">
        <el-menu-item index="/account/primary_info">
          <span slot="title" class="menu-text">{{$t('user.primary_info')}}</span>
        </el-menu-item>
        <el-menu-item index="/account/password_setting">
          <span slot="title" class="menu-text">{{$t('user.password_setting')}}</span>
        </el-menu-item>
        <el-menu-item index="/account/payment">
          <span slot="title" class="menu-text">{{$t('user.payment')}}</span>
        </el-menu-item>
        <el-menu-item index="/account/withdraw">
          <span slot="title" class="menu-text">{{$t('user.withdraw')}}</span>
        </el-menu-item>
        <el-menu-item index="/account/betrecord">
          <span slot="title" class="menu-text">{{$t('user.betrecord')}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-main>
      <router-view :key="($route.name || '')"/>
    </el-main>
  </el-container>
</template>

<script>
import UserInfoPanel from '../../components/UserInfoPanel'
import urls from '../../api/urls'
// import axios from 'axios'
// import qs from 'qs'
import Vue from 'vue'

export default {
  name: 'Account',
  components: {
    UserInfoPanel: UserInfoPanel
  },
  data () {
    return {
      formSrc: urls.payment,
      token: Vue.cookie.get('access_token')
    }
  },
  computed: {
    username () {
      return this.$store.state.user.username
    },
    gender () {
      return this.$store.state.user.gender === 'M' ? 'male' : 'female'
    }
  },
  beforeRouteEnter (to, from, next) {
    if (to.name === 'Account') {
      next({ name: 'PrimaryInfo' })
    } else {
      next()
    }
  }
}
</script>
<style lang="scss" scoped>
.avatar {
  margin: 10px auto;
  height: 50px;
  width: 50px;
  border-radius: 50%;

  &.male {
    background: darkblue;
  }
  &.female {
    background: red;
  }
}
.welcome {
  text-align: center;
  height: 35px;
  line-height: 35px;
  width: 100%;
}
.menu-text {
  padding-left: 20px;
}
</style>


