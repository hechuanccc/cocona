<template>
  <div class="box-card">
    <p>关于{{name}}网的任何操作及相关问题，您可以在（常见问题）中找到答案，
      <br/> 如果您仍然有任何疑惑，可以随时洽询我们的24小时在线客服，
      <br/> 或填写以下表格后确认送出，我们的客服人员将于24小时内与您联系。 </p>
      <br/>
    <h2>联系电话：{{contactPhoneNumber}} </h2>
    <h2>开户咨询QQ：{{openAccountConsultingQQ}} </h2>
    <h2>代理业务QQ：{{agentBusinessConsultingQQ}} </h2>
    <h2>电子邮箱：{{contactEmail}} </h2>
  </div>
</template>
<script>
export default {
  data () {
    return {
      name: this.$store.state.systemConfig.siteName,
      contactPhoneNumber: this.$store.state.systemConfig.contactPhoneNumber,
      openAccountConsultingQQ: this.$store.state.systemConfig.openAccountConsultingQQ,
      agentBusinessConsultingQQ: this.$store.state.systemConfig.agentBusinessConsultingQQ,
      contactEmail: this.$store.state.systemConfig.contactEmail
    }
  }
}
</script>

