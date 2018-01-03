<template>
  <div>
    <GameMenu path="game"/>
    <div class="container p-l-xlg">
      <!-- user key props to force Vue to re-render router-view whenever route change -->
      <el-container>
        <el-aside width="200px">
          <ul v-if="user.account_type===0" class="side-menu">
            <li class="side-menu-title">
              账户信息
            </li>
            <li class="side-menu-item">
              <span class="text">余额</span>
              <span class="amount balance">{{user.balance | currency('￥')}}</span>
            </li>
            <li class="side-menu-item">
              <span class="text">未结</span>
              <span class="amount">{{user.unsettled||0 | currency('￥')}}</span>
            </li>
            <li class="side-menu-button">
              <el-button class="large-btn" type="primary" @click="linkTo('/register')">立即注册</el-button>
            </li>
          </ul>
          <ul v-else class="side-menu">
            <li class="side-menu-title">
              账户信息
            </li>
            <li class="side-menu-item">
              <span class="text">余额</span>
              <span class="amount balance">{{user.balance | currency('￥')}}</span>
            </li>
            <li class="side-menu-item">
              <span class="text">未结</span>
              <span class="amount">{{user.unsettled||0 | currency('￥')}}</span>
            </li>
            <li class="side-menu-button">
              <el-button class="small-btn" type="primary" @click="linkTo('/account/my/primary_info')">我的账号</el-button>
              <el-button class="small-btn" type="primary" @click="linkTo('/account/online_payment')">立即充值</el-button>
            </li>
          </ul>
          <ul ref="sideMenuUl"  class="side-menu side-menu-ul" :style="{height: betrecords.length && (betrecords.length * 65 + 42 * 2) < gameMainAreaHeight ? betrecords.length * 65 + 42 * 2 + 'px' : betrecords.length ? gameMainAreaHeight + 'px' : 'auto'}">
            <li class="side-menu-title">最新注单</li>
            <li class="side-menu-record" v-for="(bet, index) in betrecords" :key="bet.issue_number + index">
              <div class="issueNumber">
                <span>{{bet.issue_number}} 期</span>
                <span class="amount">{{bet.bet_amount| currency('￥')}}</span>
              </div>
              <div class="play-name">{{bet.play.playgroup}}-{{bet.play.display_name}}</div>
              <div v-if="bet.bet_options.options" class="selected-numbers">
                已选号码：{{bet.bet_options.options | betOptionFilter}}
              </div>
              <div class="odds">{{bet.odds}}</div>
            </li>
            <li class="side-menu-empty"  v-if="!betrecords || betrecords.length === 0">暂无注单</li>
            <li class="side-menu-button">
              <el-button v-if="user.account_type===0" class="large-btn" type="primary" @click="openBetRecordDialog">查看全部</el-button>
              <el-button v-else class="large-btn" type="primary" @click="linkTo('/account/finance/betrecord')">查看全部</el-button>
            </li>
          </ul>
        </el-aside>
        <el-main class="m-t-lg" ref="mainGameArea" id="mainGameArea">
          <router-view :key="$route.name + ($route.params.gameId || '')"/>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { fetchBet, fetchWinBet } from '../api'
import GameMenu from '../components/GameMenu'
import _ from 'lodash'

let bus = new Vue()

export default {
  name: 'gamehall',
  filters: {
    betOptionFilter (options) {
      if (options) {
        return options.join(', ')
      } else {
        return ''
      }
    }
  },
  data () {
    return {
      betrecords: [],
      notifyIssueNumber: {},
      gameMainAreaHeight: 0
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  watch: {
    '$route': function (to, from) {
      this.betrecords = []
      if (to.path === '/game') {
        this.$store.dispatch('fetchGames').catch(error => {
          if (error.response.status > 400) {
            this.performLogin()
          }
        })
      }
    }
  },
  components: {
    GameMenu
  },
  methods: {
    fetchOngoingBet (gameData) {
      fetchBet(gameData)
        .then(res => {
          this.betrecords = res
          this.computeMainAreaHeight()
        })
    },
    linkTo (path) {
      this.$router.push({ path: path })
    },
    openBetRecordDialog () {
      this.$store.dispatch('openBetRecordDialog')
    },
    formattedWinRecords (results) {
      let formatted = []
      _.each(results, (result) => {
        let win = {
          playgroup: result.play.playgroup,
          play: result.play.display_name,
          settlement_amount: result.profit + result.bet_amount
        }
        let game = {
          game: result.game.display_name,
          issue_number: result.issue_number,
          win: win
        }
        formatted.push(game)
      })

      let last = []
      let hash = {}

      _.each(formatted, (result) => {
        let tempObj
        if (hash[result.game]) {
          tempObj = hash[result.game]
        } else {
          tempObj = {}
          tempObj.game = result.game
          tempObj.issue_number = result.issue_number
          tempObj.wins = []
          hash[result.game] = tempObj
          last.push(tempObj)
        }
        tempObj.wins.push(result.win)
      })
      return last
    },
    pollWinNotify () {
      this.interval = setInterval(() => {
        this.getWinNotify()
      }, 5000)
    },
    getWinNotify () {
      fetchWinBet().then(results => {
        this.generateWinMessage(results)
      })
    },
    generateWinMessage (results) {
      let winMsg = (createElement, result) => {
        if (result) {
          return createElement('div',
            {
              style: {
                maxHeight: '500px',
                overflow: 'scroll',
                paddingRight: '25px'
              }
            },
            [
              createElement('p',
                {
                  'class': {
                    'text-center': true,
                    'red': true
                  },
                  style: {
                    paddingBottom: '5px'
                  }
                },
                `中奖通知`
              ),
              createElement('p', { 'class': { 'text-center': true, 'm-t-sm': true, 'm-b-sm': true } }, `${result.game} 第${result.issue_number}期`),
              createElement('ul',
                result.wins.map(function (win, index) {
                  return createElement('li',
                    [
                      createElement('span', `${index + 1}. ${win.playgroup} `),
                      createElement('span', `${win.play} `),
                      createElement('span',
                        {
                          style: {
                            color: 'red',
                            fontSize: '14px'
                          }
                        },
                        `中奖金额：${win.settlement_amount}`
                      )
                    ]
                  )
                })
              )
            ])
        }
      }

      _.each(this.formattedWinRecords(results), (result) => {
        if (this.notifyIssueNumber[result.game] !== result.issue_number) {
          setTimeout(() => {
            this.$notify({
              showClose: true,
              position: 'right',
              message: winMsg(this.$createElement, result)
            })
          }, 1000)
        }
        this.notifyIssueNumber[result.game] = result.issue_number
      })
    },
    computeMainAreaHeight () {
      setTimeout(() => {
        let mainHeight = document.getElementById('mainGameArea')
        this.gameMainAreaHeight = mainHeight ? mainHeight.offsetHeight - 194 : 0
      }, 1200)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$store.dispatch('fetchGames')
        .catch(error => {
          if (error.response.status > 400) {
            vm.performLogin()
          }
        })
    })
  },
  created () {
    this.$root.bus = bus
    this.$root.bus.$on('new-betrecords', (gameData) => {
      this.fetchOngoingBet(gameData)
    })
    fetchWinBet().then(results => {
      _.each(this.formattedWinRecords(results), (result) => {
        this.notifyIssueNumber[result.game] = result.issue_number
        this.generateWinMessage(results)
      })
    })
    this.pollWinNotify()
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style scoped lang="scss">
@import "../style/vars.scss";

.el-main {
  padding: 0;
}
.side-menu {
  margin-top: 20px;
  background: #fff;
  color: #9b9b9b;
  font-size: 14px;
  margin-right: 20px;
  max-height: 100vh;
  &.side-menu-ul {
    overflow-y: scroll;
  }
  .side-menu-title {
    font-weight: 200;
    text-align: center;
    height: 40px;
    line-height: 40px;
    border-bottom: 2px solid $pinkish-grey;
  }
  .side-menu-item {
    font-weight: 200;
    padding: 0 10px;
    height: 40px;
    line-height: 40px;
    .text {
      font-size: 12px;
    }
    .balance {
      color: $red;
    }
    .amount {
      float: right;
      display: block;
      text-align: right;
    }
  }
  .side-menu-record {
    margin: 0 10px;
    padding: 5px 0;
    border-bottom: 1px solid #f5f5f5;
    font-size: 12px;
    .issueNumber {
      .amount {
        float: right;
        display: block;
        text-align: right;
        color: #000;
      }
    }
    .odds {
      color: $red;
    }
    .play-name {
      color: #666;
    }
    .selected-numbers {
      word-break: break-all;
    }
  }
  .side-menu-empty {
    color: $pinkish-grey;
    text-align: center;
    line-height: 30px;
    height: 30px;
    padding: 20px 0;
    font-weight: 200;
  }
  .side-menu-button {
    text-align: center;
    padding-bottom: 10px;
    .el-button {
      background-color: $azul;
    }
    .el-button:last-child {
      margin-left: 5px;
    }
    .large-btn.el-button {
      background-color: $azul;
      margin: 0;
      width: 170px;
    }
  }
}
</style>
