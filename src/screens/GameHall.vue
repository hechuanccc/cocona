<template>
  <div>

    <GameMenu path="game"/>

    <div class="container">
      <!-- user key props to force Vue to re-render router-view whenever route change -->
      <el-container>
        <el-aside width="220px">
          <ul v-if="user.account_type===0" class="side-menu">
            <li>
              <span>账户余额</span>
              <span class="balance">{{user.balance | currency('￥')}}</span>
            </li>
            <li>
              <span>未结余额</span>
              <span>{{user.unsettled||0 | currency('￥')}}</span>
            </li>
            <li class="center">
              <el-button type="primary" plain @click="openBetRecordDialog">我的注单</el-button>
              <a :href="$store.state.common.customerServiceUrl" target="_blank" class="m-l">
                <el-button type="primary" plain>在线客服</el-button>
              </a>
            </li>
            <li class="center">
              <el-button type="primary" class="register" @click="linkTo('/register')">立即注册</el-button>
            </li>
          </ul>
          <ul v-else class="side-menu">
            <li>
              <span>账户余额</span>
              <span class="balance">{{user.balance | currency('￥')}}</span>
            </li>
            <li>
              <span>未结余额</span>
              <span>{{user.unsettled||0 | currency('￥')}}</span>
            </li>
            <li class="center">
              <el-button type="primary" plain @click="linkTo('/account/my/primary_info')">我的账号</el-button>
              <el-button type="primary" plain @click="linkTo('/account/online_payment')">立即充值</el-button>
            </li>
            <li class="center">
              <el-button type="primary" plain @click="linkTo('/account/finance/betrecord')">我的注单</el-button>
              <a :href="$store.state.common.customerServiceUrl" target="_blank" class="m-l">
                <el-button type="primary" plain>在线客服</el-button>
              </a>
            </li>
          </ul>
          <div class="betrecords">
            <h3>
              最新注单
            </h3>
            <ul  v-if="betrecords && betrecords.length > 0">
              <li v-for="(bet, index) in betrecords" :key="bet.issue_number + index">
                <span class="issue-number">{{bet.issue_number}} 期</span>
                <span class="amount">
                ￥{{bet.bet_amount}}</span>
                <div>
                  <span class="play-name">{{bet.play.playgroup}}-{{bet.play.display_name}}</span>
                  <span class="odds">{{bet.odds}}</span>
                </div>
                <div v-if="bet.bet_options.options" class="selected-numbers">
                  已选号码：{{bet.bet_options.options | betOptionFilter}}
                </div>
              </li>
            </ul>
            <div class="empty" v-else>暂无注单</div>
          </div>
        </el-aside>
        <el-main class="m-t-lg">
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
      notifyIssueNumber: {}
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  watch: {
    '$route': function (to, from) {
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
      })
    },
    generateWinMessage (results) {
      let winMsg = (createElement, result) => {
        if (result) {
          return createElement('div',
            {
              style: {
                maxHeight: '500px',
                overflow: 'scroll'
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
              createElement('p', {'class': {'text-center': true, 'm-t-sm': true, 'm-b-sm': true}}, `${result.game} 第${result.issue_number}期`),
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
        this.pollWinNotify()
      })
    })
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
  padding: 10px 0;
  margin-top: 20px;
  background: #fff;
  color: #333;
  margin-right: 20px;
  li {
    padding: 3px 10px;
    span {
      display: inline-block;
      width: 60px;
      text-align: center;
      color: #999;
      &.balance {
        color: #67c23a;
        font-size: 14px;
      }
    }
    &.center {
      margin-top: 10px;
      text-align: center;
    }
    .register {
      width: 100%;
    }
  }
}
.betrecords {
  margin: 10px 20px 0 0;
  background: #fff;
  ul {
    max-height: 400px;
    overflow-y: scroll;
  }
  li {
    color: #999;
    margin: 0 10px;
    padding: 5px 0;
    border-top: 1px solid #f5f5f5;
  }
  h3 {
    display: block;
    color: #999;
    padding-left: 15px;
    margin-top: 10px;
    line-height: 36px;
    height: 36px;
  }
}

.empty {
  text-align: center;
  line-height: 30px;
  height: 30px;
  padding-bottom: 10px;
  color: #999;
}
.odds {
  color: $red;
}
.play-name {
  color: #666;
}
.amount {
  color: #666;
  line-height: 36px;
  float: right;
  font-size: 13px;
}

.selected-numbers {
  word-break: break-all;
}
</style>
