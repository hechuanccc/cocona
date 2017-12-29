<template>
<el-row>
  <Tabs :items="tabs" @clicked="getCurrentContent"/>
  <router-view/>
</el-row>
</template>
<script>
import Tabs from '../../components/Tabs.vue'
export default {
  name: 'MyAccount',
  components: {
    Tabs
  },
  data () {
    return {
      nowTab: this.$route.name,
      tabs: [
        {
          label: this.$t('user.primary_info'),
          key: 'PrimaryInfo',
          routename: 'PrimaryInfo'
        },
        {
          label: this.$t('user.password_setting'),
          key: 'PasswordSetting',
          routename: 'PasswordSetting'
        },
        {
          label: this.$t('user.withdraw_password'),
          key: 'WithdrawPassword',
          routename: 'WithdrawPassword'
        },
        {
          label: this.$t('user.bank_info'),
          key: 'BankInfo',
          routename: 'BankInfo'
        }
      ]
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
      this.nowTab = this.$route.name
    }
  },
  methods: {
    getCurrentContent (e) {
      this.$router.push({ name: e.routename })
      this.nowTab = e.routename
    }
  }
}
</script>

