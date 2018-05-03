<template>
    <div class="animation-wrapper">
      <span :class="[
      'm-r-sm',
      `result-${gameCode}`,
      `resultnum-${number}`,
       noFallingGames.includes(gameCode) ? 'pure-animation' : 'falling-animation' ,
      { 'second': duration === 2 },
      { 'third': duration === 3 }]">
        <b>{{number}}</b>
     </span>
    </div>
</template>

<script>
export default {
  data () {
    return {
      number: 0,
      noFallingGames: ['jspk10', 'bcr', 'mlaft', 'er75ft', 'jsk3', 'cqlf', 'hkl', 'luckl']
    }
  },
  props: {
    gameCode: {
      type: String
    },
    duration: {
      type: Number
    }
  },
  methods: {
    change () {
      this.interval = setInterval(() => {
        this.number = Math.floor(Math.random() * 8) + 1
      }, 200)
    }
  },
  created () {
    this.change()
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style lang="scss" scoped>
@import "../style/resultsball.scss";
.animation-wrapper {
  display: inline-block;
  overflow: hidden;
  width: auto;
}

.falling-animation, .pure-animation {
  display: inline-block;
}

.falling-animation {
  animation: fall .5s infinite linear;
  &.second {
    animation: fall .6s infinite linear;
  }

  &.third {
    animation: fall .7s infinite linear;
  }
}

.pure-animation {
  animation: none;
}

@keyframes fall {
  0% {
    transform: translateY(-15px);
  }

  50% {
    transform: translateY(0px);
  }

  100% {
    transform: translateY(15px);
  }
}

</style>
