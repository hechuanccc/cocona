<template>
    <div>
    <audio ref="audio"
    src="../assets/win.mp3"></audio>
    <div @click="play">test</div>
  </div>
</template>
<script>
export default {
  name: 'AudioButton',
  data () {
    return {

    }
  },
  methods: {
    play () {
      this.$refs.audio.play()
    }
  }
}
</script>
