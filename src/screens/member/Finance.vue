<template>
<el-row>
  <Tabs :items="tabs" @clicked="getCurrentContent"/>
  <router-view class="m-t"/>
</el-row>
</template>
<script>
import Tabs from '../../components/Tabs.vue'

export default {
  name: 'Finance',
  components: {
    Tabs
  },
  data () {
    return {
      nowTab: this.$route.name,
      tabs: [
        {
          label: this.$t('user.payment_record'),
          key: 'PaymentRecord',
          routename: 'PaymentRecord'
        },
        {
          label: this.$t('user.withdraw_record'),
          key: 'WithdrawRecord',
          routename: 'WithdrawRecord'
        },
        {
          label: this.$t('user.betrecord'),
          key: 'BetRecord',
          routename: 'BetRecord'
        }
      ]
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

