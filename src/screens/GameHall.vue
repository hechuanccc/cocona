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
            <el-button class="small-btn" type="primary" @click="linkTo(paymentPage)">立即充值</el-button>
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
        <router-view :key="$route.params.gameId"/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'
import { fetchBet } from '../api'
import GameMenu from '../components/GameMenu'
let bus = new Vue()

function keyEnterListener (event) {
  if (event.keyCode === 13 && !this.isChatting) {
    this.$root.bus.$emit('openBetDialog')
  }
}

export default {
  name: 'gamehall',
  components: {
    GameMenu
  },
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
      betrecords: []
    }
  },
  computed: {
    ...mapGetters([
      'user', 'allGames'
    ]),
    ...mapState([
      'isChatting', 'winNotification'
    ]),
    paymentPage () {
      const onlinePaymentTypes = this.user.onlinePaymentTypes
      if (onlinePaymentTypes && onlinePaymentTypes.length) {
        return '/account/online_payment'
      } else {
        return '/account/remit'
      }
    }
  },
  watch: {
    '$route': function (to, from) {
      if (to.params.gameId !== from.params.gameId) {
        this.betrecords = []
      }
      if (to.path === '/game') {
        this.chooseGame()
      }
    },
    'winNotification': function (n) {
      this.broadcastWinMsg(n)
    }
  },
  created () {
    if (!this.$route.params.gameId) {
      if (this.allGames.length > 0) {
        this.chooseGame()
      } else {
        const unwatch = this.$watch('allGames', function (allGames) {
          this.chooseGame()
          unwatch()
        })
      }
    }
    this.$store.dispatch('setRoomsStatus')

    this.$root.bus = bus
    this.$root.bus.$on('new-betrecords', (gameData) => {
      this.fetchOngoingBet(gameData)
    })

    window.addEventListener('keypress', keyEnterListener.bind(this))
  },
  methods: {
    chooseGame () {
      const gameId = localStorage.getItem('lastGame') || this.allGames[0].id
      this.$router.replace('/game/' + gameId)
    },
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
    winMsg (notification) {
      if (notification) {
        return this.$createElement('div', { style: { maxHeight: '500px', overflow: 'scroll', paddingRight: '25px' } },
          [
            this.$createElement('p', { 'class': { 'text-center': true, 'red': true, 'p-b-sm': true } }, `中奖通知`),
            this.$createElement('p', { 'class': { 'text-center': true, 'm-t-sm': true, 'm-b-sm': true } }, `${notification.game_name} 第${notification.issue_number}期`),
            this.$createElement('ul', notification.win_bets.map((bet, index) => {
              let settlement = parseFloat(bet.settlement_amount)
              return this.$createElement('li', [
                this.$createElement('span', `${index + 1}. ${bet.playgroup_name || bet.playgruop_name} ${bet.play_name}`),
                this.$createElement('span', { style: { color: 'red', fontSize: '14px', lineHeight: '28px' } }, `中奖金额：${settlement.toFixed(3)}`)
              ])
            }))
          ]
        )
      }
    },
    broadcastWinMsg (notification) {
      setTimeout(() => {
        this.$notify({
          showClose: true,
          position: 'left',
          duration: 8000,
          message: this.winMsg(notification)
        })
      }, 1000)
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
