<template>
  <div :class="['balls-number', 'wrapper-' + gameCode]">
    <template v-if="gameCode === 'hkl' || gameCode === 'luckl'">
      <div
        :class="`result-${gameCode} view`"
        v-for="(chunk, chunkIndex) in resultChunks.slice(0,-1)"
        :key="chunkIndex">
        <ul :class="`${animate}-${chunkIndex%2?'odd':'even'}`">
          <li
            v-for="(num, index) in chunk"
            :key="index"
            :class="`result-${gameCode} resultnum-${num}`">
            <b> {{num}} </b>
          </li>
        </ul>
      </div>
      <div class="cross">＋</div>
      <div
        :class="`result-${gameCode} view`">
        <ul :class="`${animate}-even`">
          <li
            v-for="(num, index) in resultChunks[resultChunks.length-1]"
            :key="index"
            :class="`result-${gameCode} resultnum-${num}`">
            <b> {{num}} </b>
          </li>
        </ul>
      </div>
    </template>
    <div
      v-else
      :class="`result-${gameCode} view`"
      v-for="(chunk, chunkIndex) in resultChunks"
      :key="chunkIndex">
      <ul :class="`${animate}-${chunkIndex%2?'odd':'even'}`">
        <li
          v-for="(num, index) in chunk"
          :key="index"
          :class="`result-${gameCode} resultnum-${num}`">
          <b> {{num}} </b>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
const GameOnlyChange = ['jspk10', 'bcr', 'mlaft', 'er75ft', 'hkl', 'luckl', 'jsk3']
const rand1to10 = ['jspk10', 'bcr', 'mlaft', 'er75ft']
const rand0to9 = ['jsssc', 'tjssc', 'xjssc', 'cqssc', 'csffc']
const rand1to11 = ['gd11x5']
const rand1to20 = ['cqlf', 'gdklsf', 'hkl', 'luckl']
const rand1to49 = ['bjkl8', 'pcdd', 'jnd28']
const randomGeneratorFactory = (gameCode) => {
  if (rand1to10.includes(gameCode)) {
    return () => Math.floor(Math.random() * 10 + 1)
  } else if (rand0to9.includes(gameCode)) {
    return () => Math.floor(Math.random() * 10)
  } else if (rand1to11.includes(gameCode)) {
    return () => Math.floor(Math.random() * 11 + 1)
  } else if (rand1to20.includes(gameCode)) {
    return () => Math.floor(Math.random() * 20 + 1)
  } else if (rand1to49.includes(gameCode)) {
    return () => Math.floor(Math.random() * 80 + 1)
  } else {
    return () => Math.floor(Math.random() * 6 + 1)
  }
}
export default {
  name: 'GameResultAnimate',
  props: {
    gameCode: {
      type: String
    },
    resultNums: {
      type: Array
    }
  },
  computed: {
    resultChunks () {
      const randomGenerator = randomGeneratorFactory(this.gameCode)
      return this.resultNums.map(() => {
        const arr = []
        for (let i = 0; i < 4; i++) {
          arr.push(randomGenerator())
        }
        arr.push(arr[0])
        return arr
      })
    },
    animate () {
      return GameOnlyChange.includes(this.gameCode) ? 'step' : 'scroll'
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style/resultsball.scss";
.balls-number {
  flex: 2.5;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100%;
}
.view {
  display: inline-block;
  margin-right: 3px;
  background: none;
  overflow: hidden;
  border-radius: 0;
  vertical-align: bottom;
  .scroll-odd {
    width: 100%;
    animation: scrollUp 1s linear infinite normal;
  }
  .scroll-even {
    width: 100%;
    animation: scrollDown 1.5s linear infinite normal;
  }
  .step-odd {
    width: 100%;
    animation: changeStep 1s step-start infinite normal;
  }
  .step-even {
    width: 100%;
    animation: changeStep 1s step-start infinite normal;
  }
}
.ball-sum {
  display: inline-block;
  font-size: 12px;
}
.wrapper-hkl .view{
  margin-bottom: 10px;
}
.wrapper-luckl .view{
  margin-bottom: 10px;
}
@keyframes scrollUp {
  0% {
      transform: translateY(0);
  }
  100% {
      transform: translateY(-80%);
  }
}
@keyframes scrollDown {
  0% {
      transform: translateY(-80%);
  }
  100% {
      transform: translateY(0);
  }
}
@keyframes changeStep {
  0% {
      transform: translateY(0);
  }
  25% {
      transform: translateY(-20%);
  }
  50% {
      transform: translateY(-40%);
  }
  75% {
      transform: translateY(-60%);
  }
  100% {
      transform: translateY(-80%);
  }
}
.cross {
  display: inline-block;
  margin-bottom: 10px;
  height: 26px;
  margin-left: -8px;
}
</style>
