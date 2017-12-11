<template>
  <div>

    <GameMenu path="game"/>

    <div class="container">
      <!-- user key props to force Vue to re-render router-view whenever route change -->
      <el-container>
        <el-aside width="220px">
          <ul class="side-menu">
            <li>
              <span>账户余额</span>
              <span class="balance">{{user.balance | currency('￥')}}</span>
            </li>
            <li>
              <span>未结余额</span>
              <span>{{user.unsettled||0 | currency('￥')}}</span>
            </li>
            <li class="center">
              <el-button type="primary" plain @click="linkTo('/my/primary_info')">我的账号</el-button>
              <el-button type="primary" plain @click="linkTo('/online_payment')">立即充值</el-button>
            </li>
            <li class="center">
              <el-button type="primary" plain @click="linkTo('/finance/betrecord')">我的注单</el-button>
              <el-button type="primary" plain>在线客服</el-button>
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
        <el-main>
          <router-view :key="$route.name + ($route.params.gameId || '')"/>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { fetchBet } from '../api'
import GameMenu from '../components/GameMenu'
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
      betrecords: []
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
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
      this.$router.push({ path: '/account' + path })
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
