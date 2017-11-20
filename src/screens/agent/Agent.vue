<template>
  <div class="agent-index container">
    <div class="page-title">
      <h1 class="title">{{$t('navMenu.affliate')}}</h1>
      <span>JOIN US</span>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  beforeRouteEnter: (to, from, next) => {
    if (to.name === 'Agent') {
      next({ name: 'AgentRegister' })
    } else {
      next()
    }
  }
}
</script>

