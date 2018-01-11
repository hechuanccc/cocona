<template>
    <div>
    <audio ref="audio"
    src="../assets/win.mp3"></audio>
    <div :class="['icon', audioStatus?'active':'']" @click="play"></div>
  </div>
</template>
<script>
export default {
  name: 'AudioButton',
  data () {
    return {
      audioStatus: false
    }
  },
  methods: {
    play () {
      this.$refs.audio.play()
    }
  }
}
</script>

<style lang="scss" scoped>
  .icon {
    width: 50px;
    height: 50px;

    &.active {

    }
  }
</style>
