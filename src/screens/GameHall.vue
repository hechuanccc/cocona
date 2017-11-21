<template>
  <div>

    <GameMenu path="game"/>

    <div class="container">
      <!-- user key props to force Vue to re-render router-view whenever route change -->
      <el-container>
        <el-aside width="220px">
          <ul class="side-menu">
            <li>
              <span>账号</span>
              {{user.username}}
            </li>
            <li>
              <span>余额</span>
              <strong class="balance">￥{{user.balance}}</strong>
            </li>
            <li class="center">
              <el-button type="primary" plain>我的账号</el-button>
              <el-button type="primary" plain>立即充值</el-button>
            </li>
            <li class="center">
              <el-button type="primary" plain>申请提款</el-button>
              <el-button type="primary" plain>我的注单</el-button>
            </li>
            <li class="center">
              <el-button type="primary" plain>在线客服</el-button>
              <el-button type="primary" plain>开奖直播</el-button>
            </li>
          </ul>
          <div class="betrecords">
            <h3>最新注单</h3>
            <ul  v-if="betrecords.length > 0">
              <li v-for="bet in betrecords">
                <span class="issue-number">{{bet.issue_number}} 期</span>
                <span class="amount">
                ￥{{bet.bet_amount}}</span>
                <div>
                  <span class="play-name">{{bet.play.playgroup}}-{{bet.play.display_name}}</span> @
                  <span class="odds">{{bet.play.odds}}</span>
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
    fetchOngoingBet (gameId) {
      fetchBet(gameId)
      .then(res => {
        this.betrecords = res
      })
    }
  },
  created () {
    this.$root.bus = bus
    this.$root.bus.$on('new-betrecords', (gameId) => {
      this.fetchOngoingBet(gameId)
    })
    this.$store.dispatch('fetchUser')
      .then(res => {
        this.$store.dispatch('fetchGames')
        // this.fetchOngoingBet()
      })
      .catch(error => {
        if (error.response.status > 400) {
          this.$router.push({
            path: '/',
            query: {
              next: this.$route.path
            }
          })
        }
      })
  }
}
</script>

<style scoped lang="scss">
@import '../style/vars.scss';
.el-main {
  padding: 0;
}
.side-menu {
  padding: 10px 0;
  margin-top: 10px;
  border: 1px solid #efefef;
  color: #333;
  margin-right: 20px;
  li {
    padding: 3px 0;
    span {
      display: inline-block;
      width: 60px;
      text-align: center;
      color: #999;
    }
    &.center {
      margin-top: 10px;
      text-align: center;
    }
  }
}
.betrecords {
  margin: 10px 20px 0 0;
  border: 1px solid #efefef;
  ul {
    max-height: 400px;
    overflow-y: scroll;
  }
  li {
    background: #f5f5f5;
    color: #999;
    padding: 10px;
    margin-top: 1px;
  }
  h3 {
    display: block;
    color: #999;
    padding-left: 10px;
    margin-top: 5px;
    line-height: 30px;
    height: 30px;
  }
}
.balance {
  color: #67C23A;
  font-size: 14px;
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
  color: $primary;
}
.amount {
  color: #333;
  float: right;
  font-size: 13px;
}
</style>
