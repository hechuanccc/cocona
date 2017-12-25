<template>
  <div class="result-balls" v-if="gameLatestResult">
    <div class="balls-text">
      <p class="game">{{gameLatestResult.display_name}}</p>
      <p class="issue">{{gameLatestResult.issue_number}}{{$t('navMenu.result_period')}}</p>
    </div>
    <div class="balls-number">
      <span
        v-for="(num, index) in resultNums"
        :key="gameLatestResult.issue_number + index"
        :class="getResultClass(num)">
        <b> {{num}} </b>
        <p class="ball-zodiac" v-if="showZodiac"> {{zodiacs[index]}} </p>
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
import _ from 'lodash'

export default {
  props: {
    gameid: {
      type: String
    }
  },
  data () {
    return {
      gameLatestResult: '',
      drawTimeGap: '',
      zodiacs: '',
      showZodiac: false,
      showSum: false
    }
  },
  created () {
    this.fetchResult(this.gameid).then(res => { this.pollResult(this.gameid) })
  },
  computed: {
    resultNums () {
      let rawNums = this.gameLatestResult.result_str.split(',')
      let formattedNums = []
      if (this.gameLatestResult.game_code === 'bjkl8') {
        rawNums.pop()
      }
      rawNums.forEach((rawBall) => {
        if (rawBall[0] === '0' && rawBall !== '0') {
          formattedNums.push(rawBall.slice(1))
          return
        }
        formattedNums.push(rawBall)
      })
      if (!this.gameLatestResult.result_str) {
        return this.$t('navMenu.no_result')
      }
      return formattedNums
    },
    resultsSum () {
      return _.reduce(this.resultNums, (sum, nums) => { return sum + Number(nums) }, 0)
    }
  },
  watch: {
    'gameid': function (gameid) {
      this.showZodiac = false
      this.showSum = false
      clearInterval(this.interval)
      clearTimeout(this.timer)
      this.fetchResult(gameid).then(res => { this.pollResult(this.gameid) })
    },
    'gameLatestResult.game_code': function (code) {
      if (code === 'hkl') {
        this.showZodiac = true
      }
      if (code === 'pcdd') {
        this.showSum = true
      }
    }
  },
  methods: {
    getResultClass (resultNum) {
      let gameClass = `result-${this.gameLatestResult.game_code}`
      let resultClass = `resultnum-${resultNum}`
      return [gameClass, resultClass]
    },
    fetchResult (gameId) {
      return fetchGameResult(gameId).then(
      result => {
        if (!result || !result[0]) {
          return
        }
        this.gameLatestResult = result[0]
        this.zodiacs = result[0].zodiac.split(',')
        return result
      }
    )
    },
    pollResult (gameid) {
      if (!this.gameLatestResult) {
        return
      }

      let drawFromNow = this.$moment(this.gameLatestResult.next_draw).diff(this.$moment(), 'ms')
      let startPollingTime = drawFromNow < 8000 ? 8000 : drawFromNow

      let oldIssue = this.gameLatestResult.issue_number
      this.timer = setTimeout(() => {
        clearInterval(this.interval)
        this.interval = setInterval(() => {
          this.fetchResult(gameid).then(result => {
            if (!result || !result[0]) {
              clearInterval(this.interval)
            }

            let newIssue = result[0].issue_number
            if (newIssue !== oldIssue) {
              clearInterval(this.interval)
              clearInterval(this.timer)
              setTimeout(() => {
                this.$store.dispatch('fetchUser')
              }, 2000)
              this.pollResult(gameid)
            }
          })
        }, 5000)
        this.pollResult(gameid)
      }, startPollingTime)
    }
  },
  beforeDestroy () {
    clearTimeout(this.timer)
    clearInterval(this.interval)
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
    text-transform: uppercase;
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


