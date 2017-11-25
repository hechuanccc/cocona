<template>
  <div class="result-balls" :game="currentGame">
    <div class="balls-text">
      <p>{{gameLatestResult.display_name}}</p>
      <p>{{gameLatestResult.issue_number}}{{$t('navMenu.result_period')}}</p>
    </div>
    <div class="balls-number">
      <span v-for="(ball, index) in resultBall" :key="ball" :class="getResultClass(ball)">
        <b> {{ball}} </b>
        <p class="ball-zodiac" v-if="gameLatestResult.game_code === 'hkl'"> {{zodiacs[index]| zodiacFilter}} </p>
      </span>
      <div class="ball-sum" v-if="gameLatestResult.game_code === 'pcdd'">
        {{$t('navMenu.total')}}:
        <span>
          <b>{{resultsSum}}</b>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {fetchGameResult} from '../api'
export default {
  data () {
    return {
      gameLatestResult: '',
      zodiacs: ''
    }
  },
  computed: {
    resultBall () {
      if (!this.gameLatestResult.result_str) {
        return '尚无开奖结果'
      }
      let rawBalls = this.gameLatestResult.result_str.split(',')
      let formattedBalls = []
      if (this.gameLatestResult.game_code === 'bjkl8') { // delete the 21th ball
        rawBalls.pop()
      }
      rawBalls.forEach((rawBall) => {
        if (rawBall[0] === '0' && rawBall !== '0') {
          formattedBalls.push(rawBall.slice(1))
          return
        }
        formattedBalls.push(rawBall)
      })
      return formattedBalls
    },
    resultsSum () {
      let sum = 0
      for (let i = 0; i < this.resultBall.length; i++) {
        sum = sum + Number(this.resultBall[i])
      }
      return sum
    },
    currentGame () {
      fetchGameResult(this.$route.params.gameId).then(
      result => {
        this.gameLatestResult = result[0]
        this.zodiacs = result[0].zodiac.split(',')
      }
    )
      return this.gameLatestResult.game_code
    }
  },
  methods: {
    getResultClass (resultNum) {
      let gameClass = `result-${this.gameLatestResult.game_code}`
      let resultClass = `resultnum-${resultNum}`
      return [gameClass, resultClass]
    }
  },
  filters: {
    zodiacFilter (val) {
      switch (val) {
        case 'RAT':
          return '鼠'
        case 'OX':
          return '牛'
        case 'TIGER':
          return '虎'
        case 'RABBIT':
          return '兔'
        case 'DRAGON':
          return '龙'
        case 'SNAKE':
          return '蛇'
        case 'HORSE':
          return '马'
        case 'SHEEP':
          return '羊'
        case 'MONKEY':
          return '猴'
        case 'ROOSTER':
          return '鸡'
        case 'DOG':
          return '狗'
        case 'PIG':
          return '猪'
      }
    }
  }
}
</script>

<style lang="sass" scoped>
@import "../style/resultsball.sass"

.result-balls
  display: inline-block
  width: 425px
  font-weight: 700
  .balls-text
    text-align: center
    width: 120px
  .balls-number
    width: 300px
  div
    display: inline-block
    position: relative
    vertical-align: middle
    color: rgba(20, 20, 20, 0.8)
    font-size: 12px
  span
    display: inline-block
    margin-left: 4px
</style>


