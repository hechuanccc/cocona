<template>
  <div class="top-header">
    <div class="header-bar" v-show="!isUserPage">
      <TopBar/>
    </div>
    <div class="header-nav container">
      <Logo/>
      <div class="game-result" :game="currentGame" v-if="isGamePage">
        <div class="result-balls">
          <div class="balls-text">
            <p>{{gameLatestResult.display_name}}</p>
            <p>{{$t('user.issue_number')}}:{{gameLatestResult.issue_number}}</p>
          </div>
          <div class="balls-number">
            <span v-for="(ball, index) in resultBall" :key="ball" :class="getResultClass(ball)">
              <b> {{ball}} </b>
              <p class="ball-zodiac" v-if="gameLatestResult.game_code === 'hkl'"> {{zodiacs[index]| zodiacFilter}} </p>
            </span>
            <div class="ball-sum" v-if="gameLatestResult.game_code === 'pcdd'">
              總和:
              <span>
                <b>{{resultsSum}}</b>
              </span>
            </div>
          </div>
        </div>
      </div>
      <NavMenu :menus="isUserPage ? userMenus : menus" />
    </div>
  </div>
</template>



<script>
import TopBar from '../components/TopBar'
import NavMenu from '../components/NavMenu'
import Logo from '../components/Logo'
import {fetchGameResult} from '../api'

import 'vue-awesome/icons/home'
import 'vue-awesome/icons/user-plus'
import 'vue-awesome/icons/info'
import 'vue-awesome/icons/clone'
import 'vue-awesome/icons/list-ul'

import 'vue-awesome/icons/th-large'
import 'vue-awesome/icons/money'
import 'vue-awesome/icons/line-chart'
import 'vue-awesome/icons/star'
import 'vue-awesome/icons/sign-out'

export default {
  data () {
    return {
      menus: [{
        icon: 'home',
        name: this.$t('navMenu.home_page'),
        path: ''
      }, {
        icon: 'th-large',
        name: this.$t('navMenu.game_center'),
        path: 'game'
      }, {
        icon: 'list-ul',
        name: this.$t('navMenu.promotion'),
        path: 'promotions'
      }, {
        icon: 'info',
        name: this.$t('navMenu.qa'),
        path: 'faq'
      }, {
        icon: 'clone',
        name: this.$t('navMenu.affliate'),
        path: 'agent'
      }],
      userMenus: [{
        icon: 'th-large',
        name: this.$t('navMenu.game_center'),
        path: 'game'
      }, {
        icon: 'money',
        name: this.$t('navMenu.personal_account'),
        path: 'account'
      }, {
        icon: 'line-chart',
        name: this.$t('navMenu.draw_history'),
        path: 'gamehistory'
      }, {
        icon: 'star',
        name: this.$t('navMenu.game_intro'),
        path: 'gameintro'
      }],
      gameLatestResult: '',
      zodiacs: ''
    }
  },
  components: {
    TopBar,
    NavMenu,
    Logo
  },
  computed: {
    isUserPage () {
      let pat = new RegExp(/\/game\/|\/game|\/account\/|\/gamehistory|\/gameintro/)
      return pat.test(this.$route.path)
    },
    isGamePage () {
      let path = this.$route.path.split('/')
      if (path[1] === 'game') {
        return true
      }
    },
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

.top-header
  margin-bottom: 10px
  .header-bar
    height: 33px
    padding: 3px 0
    width: 100%
    background: #f0f0f0
    text-align: center
  .header-nav
    height: 60px
    margin-top: 10px
    .game-result
      display: inline-block
      text-align: left
.result-balls
  display: inline-block
  width: 405px
  .balls-number
    width: 300px
  div
    display: inline-block
    position: relative
    vertical-align: middle
    color: #409EFF
    font-size: 12px
  span
    display: inline-block
    margin-left: 4px
</style>
