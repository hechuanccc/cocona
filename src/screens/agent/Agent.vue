<template>
  <div class="agent-index container">
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

