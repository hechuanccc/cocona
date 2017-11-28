<template>
  <div class="result-balls" v-if="gameLatestResult">
    <div class="balls-text">
      <p class="game">{{gameLatestResult.display_name}}</p>
      <p class="issue">{{gameLatestResult.issue_number}}{{$t('navMenu.result_period')}}</p>
    </div>
    <div class="balls-number">
      <span v-for="(ball, index) in resultBall" :key="ball" :class="getResultClass(ball)">
        <b> {{ball}} </b>
        <p class="ball-zodiac" v-if="showZodiac"> {{zodiacs[index]| zodiacFilter}} </p>
      </span>
      <div class="ball-sum" v-if="showSum">
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
  props: {
    gameid: {
      type: String
    }
  },
  data () {
    return {
      gameLatestResult: '',
      zodiacs: '',
      showZodiac: false,
      showSum: false
    }
  },
  created () {
    this.fetchResult(this.gameid)
  },
  computed: {
    resultBall () {
      let rawBalls = this.gameLatestResult.result_str.split(',')
      let formattedBalls = []
      if (this.gameLatestResult.game_code === 'bjkl8') {
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
    }
  },
  watch: {
    'gameid': function (gameid) {
      this.showZodiac = false
      this.showSum = false
      this.fetchResult(gameid)
    }
  },
  methods: {
    getResultClass (resultNum) {
      let gameClass = `result-${this.gameLatestResult.game_code}`
      let resultClass = `resultnum-${resultNum}`
      return [gameClass, resultClass]
    },
    fetchResult (gameId) {
      fetchGameResult(gameId).then(
      result => {
        if (!result || !result[0].result_str) {
          this.gameLatestResult = this.$t('navMenu.no_result')
        }

        if (result[0].game_code === 'hkl') {
          this.showZodiac = true
        }
        if (result[0].game_code === 'pcdd') {
          this.showSum = true
        }
        this.gameLatestResult = result[0]
        this.zodiacs = result[0].zodiac.split(',')
      }
    )
    }
  },
  filters: {
    zodiacFilter (val) {
      if (!val) {
        return ''
      }
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

<style lang="scss" scoped>
@import "../style/resultsball.scss";

.result-balls {
  padding-top: 10px;
  display: block;
  margin: 0 0 0 30px;
  float: left;
  text-align: center;
  .balls-text {
    text-align: center;
    padding: 10px;
  }
  .balls-number {
    width: 300px;
  }
  div {
    display: inline-block;
    position: relative;
    vertical-align: middle;
    font-size: 12px;
  }
  .game {
    color: #666;
    font-size: 13px;
  }
  .issue {
    color: #999;
  }
  span {
    display: inline-block;
    margin-left: 4px;
  }
}
</style>


