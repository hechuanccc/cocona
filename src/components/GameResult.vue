<template>
  <div class="result-balls">
    <div class="balls-text" v-if="gameLatestResult">
      <p class="game">{{gameLatestResult.display_name}}</p>
      <p class="issue">{{gameLatestResult.issue_number}}{{$t('navMenu.result_period')}}</p>
    </div>
    <div :class="['balls-number', 'wrapper-' + gameLatestResult.game_code]" v-if="gameLatestResult">
      <span
        v-for="(num, index) in resultNums"
        :key="gameLatestResult.issue_number + index"
        :class="getResultClass(num)">
        <b> {{num}} </b>
        <p class="ball-zodiac" v-if="showZodiac"> {{zodiacs[index]}} </p>
      </span>
      <div class="ball-sum" v-if="showSum">
        {{$t('navMenu.total')}}
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
              this.$emit('refreshResult')
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
@import "../style/vars.scss";

.result-balls {
  display: table;
  background: #fff;
  border-left: 5px solid $marine-blue;
  width: 49%;
  height: 55px;
  float: left;
  .balls-text {
    display: table-cell;
    vertical-align: middle;
    color: #4a4a4a;
    text-align: center;
    p {
      width: 120px;
      height: 18px;
      line-height: 18px;
    }
    .issue {
      color: #999;
      font-size: 11px;
    }
  }
  .balls-number {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    height: 100%;
    width: 100%;
  }
  span {
    display: inline-block;
    margin: 1px 5px 1px 0;
    vertical-align: middle;
  }
  .ball-sum {
    display: inline-block;
  }
  .wrapper-hkl span{
    margin-bottom: 10px;
  }
}
</style>


