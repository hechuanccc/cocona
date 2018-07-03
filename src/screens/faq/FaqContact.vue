<template>
  <div class="box-card">
    <p>关于{{systemConfig.siteName}}网的任何操作及相关问题，您可以在（常见问题）中找到答案，
      <br/> 如果您仍然有任何疑惑，可以随时洽询我们的24小时在线客服，
      <br/> 或填写以下表格后确认送出，我们的客服人员将于24小时内与您联系。 </p>
      <br/>
    <h2>联系电话：{{systemConfig.contactPhoneNumber}} </h2>
    <h2>开户咨询QQ：{{systemConfig.openAccountConsultingQQ}} </h2>
    <h2>代理业务QQ：{{systemConfig.agentBusinessConsultingQQ}} </h2>
    <h2>电子邮箱：{{systemConfig.contactEmail}} </h2>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['systemConfig'])
  }
}
</script>

