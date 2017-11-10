<template>
  <el-container>
    <el-aside width="250px">
      <div :class="['avatar', gender]"></div>
      <div class="welcome">{{username}} 你好</div>
      <el-menu :default-active="$route.path" :router="true">
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
      <router-view/>
    </el-main>
  </el-container>
</template>

<script>
import urls from '../../api/urls'
import Vue from 'vue'

export default {
  name: 'Account',
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
    },
    routeName () { }
  },
  beforeRouteEnter (to, from, next) {
    if (to.name === 'Account') {
      next({ name: 'PrimaryInfo' })
    } else {
      next()
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.name === 'Account') {
        this.$router.push({ name: 'PrimaryInfo' })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../../style/vars.scss';
.avatar {
  margin: 10px auto;
  height: 50px;
  width: 50px;
  border-radius: 50%;

  &.male {
    background: darkblue;
  }
  &.female {
    background: $red;
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


