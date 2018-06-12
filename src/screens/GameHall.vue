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
              <div>
                <span>{{bet.issue_number}} 期</span>
              </div>
              <div class="play-name">玩法: {{bet.play.playgroup}}-{{bet.play.display_name}} @ <span class="odds">{{bet.odds}}</span></div>
              <div v-if="bet.bet_options.options" class="selected-numbers">
                号码：{{bet.bet_options.options | betOptionFilter}}
              </div>
              <div >金额: {{bet.bet_amount| currency('￥')}}</div>
            </li>
            <li class="empty" v-if="!betrecords || betrecords.length === 0">暂无注单</li>

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
import { mapGetters, mapState } from 'vuex'
import { fetchBet, fetchWinBet } from '../api'
import GameMenu from '../components/GameMenu'
import _ from 'lodash'

let bus = new Vue()

function keyEnterListener (event) {
  if (event.keyCode === 13 && !this.isChatting) {
    this.$root.bus.$emit('openBetDialog')
  }
}

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
    ...mapState([
      'isChatting'
    ])
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
    },
    'user.unsettled': function (value) {
      clearInterval(this.interval)

      if (value) {
        fetchWinBet().then(results => {
          _.each(this.formattedWinRecords(results.win_bets), (result) => {
            this.notifyIssueNumber[result.game] = result.issue_number
            this.generateWinMessage(results.win_bets)
          })
        })
        this.pollWinNotify()
      }
    }
  },
  components: {
    GameMenu
  },
  methods: {
    fetchOngoingBet (gameData) {
      fetchBet(gameData).then(res => {
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
      if (!results || !results.length) {
        return
      }
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
        if (!this.user.unsettled) {
          clearInterval(this.interval)
          return
        }
        this.getWinNotify()
      }, 5000)
    },
    getWinNotify () {
      fetchWinBet().then(results => {
        this.$store.dispatch('updateUnsettled', results.unsettled)
        this.generateWinMessage(results.win_bets)
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
                  let settlement = parseFloat(win.settlement_amount)

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
                        `中奖金额：${settlement.toFixed(3)}`
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
    this.$store.dispatch('setRoomsStatus')

    this.$root.bus = bus

    this.$root.bus.$on('new-betrecords', (gameData) => {
      this.fetchOngoingBet(gameData)
    })

    if (this.user.unsettled) {
      fetchWinBet().then(results => {
        _.each(this.formattedWinRecords(results.win_bets), (result) => {
          this.notifyIssueNumber[result.game] = result.issue_number
          this.generateWinMessage(results.win_bets)
        })
      })
      this.pollWinNotify()
    }

    window.addEventListener('keypress', keyEnterListener.bind(this))
  },
  beforeDestroy () {
    clearInterval(this.interval)
    this.$root.bus.$off('new-betrecords')
    this.$root.bus.$off('followBet')
    window.removeEventListener('keypress', keyEnterListener)
  }
}
</script>

<style scoped lang="scss">
@import "../style/vars.scss";

.el-main {
  padding: 0;
}

.box {
  max-height: 100vh;
  margin: 10px 10px 0;
  background: #fff;
  .items {
    max-height: 300px;
    overflow-y: auto;
  }
  .title {
    display: block;
    height: 32px;
    line-height: 32px;
    font-size: 13px;
    color: #9b9b9b;
    text-align: center;
    border-bottom: 1px solid $pinkish-grey;
    margin-bottom: 10px;
  }

  .item {
    height: 24px;
    line-height: 24px;
    padding: 0 10px;
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
    padding: 5px 0;
    border-bottom: 1px solid #f5f5f5;
    margin: 0 10px;
    font-size: 12px;
    color: #666;
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
    height: 30px;
    line-height: 30px;
    padding: 0 0 10px;
    color: #ccc;
    text-align: center;
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
