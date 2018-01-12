<template>
    <div>
    <audio ref="audio"
    src="../assets/win.mp3"></audio>
    <div class="button" @click="audioStatus = !audioStatus">
      <icon v-if="audioStatus" name="volume-up" scale="1"></icon>
      <icon v-else name="volume-off" scale="1"></icon>
    </div>
  </div>
</template>
<script>
import 'vue-awesome/icons/volume-off'
import 'vue-awesome/icons/volume-up'
export default {
  name: 'AudioButton',
  data () {
    return {
      audioStatus: false
    }
  },
  created () {
    this.$root.bus.$on('refreshResult', this.play)
  },
  methods: {
    play () {
      if (this.audioStatus) {
        this.$refs.audio.play()
      }
    }
  },
  beforeDestroy () {
    this.$root.bus.$off('refreshResult', this.play)
  }
}
</script>

<style lang="scss" scoped>
.button{
  line-height: 30px;
  height: 30px;
  width: 30px;
  cursor: pointer;
  margin-left: -10px;
}
</style>
