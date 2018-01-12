<template>
  <div>
    <GameMenu path="game"/>
    <!-- user key props to force Vue to re-render router-view whenever route change -->
    <el-container>
      <el-aside width="200px">
        <div class="box">
          <span class="title">账户信息</span>
          <ul v-if="user.account_type===0" class="side-menu">
            <li class="item">
              <span class="text">余额</span>
              <span class="amount balance">{{user.balance | currency('￥')}}</span>
            </li>
            <li class="item">
              <span class="text">未结</span>
              <span class="amount">{{user.unsettled||0 | currency('￥')}}</span>
            </li>
          </ul>
          <ul v-else class="items">
            <li class="item">
              <span class="text">余额</span>
              <span class="amount balance">{{user.balance | currency('￥')}}</span>
            </li>
            <li class="item">
              <span class="text">未结</span>
              <span class="amount">{{user.unsettled||0 | currency('￥')}}</span>
            </li>
          </ul>
          <div v-if="user.account_type===0" class="buttons">
            <el-button class="large-btn" type="primary" @click="linkTo('/register')">立即注册</el-button>
          </div>
          <div v-else class="buttons">
            <el-button class="small-btn" type="primary" @click="linkTo('/account/my/primary_info')">我的账号</el-button>
            <el-button class="small-btn" type="primary" @click="linkTo('/account/online_payment')">立即充值</el-button>
          </div>
        </div>
        <div class="box">
          <span class="title">最新注单</span>
          <ul class="items" >
            <li class="record" v-for="(bet, index) in betrecords" :key="bet.issue_number + index">
              <div class="issueNumber">
                <span>{{bet.issue_number}} 期</span>
              </div>
              <div class="play-name">玩法: {{bet.play.playgroup}}-{{bet.play.display_name}} @ <span class="odds">{{bet.odds}}</span></div>
              <div v-if="bet.bet_options.options" class="selected-numbers">
                号码：{{bet.bet_options.options | betOptionFilter}}
              </div>
              <div >金额: {{bet.bet_amount| currency('￥')}}</div>
            </li>
            <li class="empty"  v-if="!betrecords || betrecords.length === 0">暂无注单</li>

          </ul>
          <div class="buttons" v-if="betrecords && betrecords.length > 0">
            <el-button v-if="user.account_type===0" class="large-btn" type="primary" @click="openBetRecordDialog">查看全部</el-button>
            <el-button v-else class="large-btn" type="primary" @click="linkTo('/account/finance/betrecord')">查看全部</el-button>
          </div>
        </div>
      </el-aside>
      <el-main class="m-t">
        <router-view :key="$route.name + ($route.params.gameId || '')"/>
      </el-main>
    </el-container>
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
    ]),
    currentGame () {
      return this.$store.getters.gameById(this.$route.params.gameId)
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.params.gameId !== from.params.gameId) {
        this.betrecords = []
      }
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
      }).catch(() => {})
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
                            fontSize: '14px',
                            lineHeight: '28px'
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
              position: 'left',
              duration: 8000,
              message: winMsg(this.$createElement, result)
            })
          }, 1000)
        }
        this.notifyIssueNumber[result.game] = result.issue_number
      })
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
    this.$root.bus.$off('new-betrecords')
  }
}
</script>

<style scoped lang="scss">
@import "../style/vars.scss";
.el-main {
  padding: 0;
}
.box {
  margin: 10px 10px 0;
  background: #fff;
  max-height: 100vh;
  .items {
    max-height: 300px;
    overflow-y: auto;
  }
  .title {
    display: block;
    color: #9b9b9b;
    font-size: 13px;
    text-align: center;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid $pinkish-grey;
    margin-bottom: 10px;
  }
  .item {
    padding: 0 10px;
    height: 24px;
    line-height: 24px;
    color: #666;
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
  .record {
    color: #666;
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
  .empty {
    color: #ccc;
    text-align: center;
    line-height: 30px;
    height: 30px;
    padding: 0 0 10px;
    font-weight: 200;
  }
  .buttons {
    margin-top: 10px;
    text-align: center;
    padding-bottom: 10px;
    .el-button:last-child {
      margin-left: 5px;
    }
    .large-btn.el-button {
      margin: 0;
      width: 170px;
    }
  }
}
</style>
