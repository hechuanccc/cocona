<template>
  <div class="main-play">
    <div class="main">
      <el-row class="info-panel">
        <GameResult :gameid="$route.params.gameId" @refreshResult="fetchStatistic(currentGame.code)"/>
        <div class="countdown-panel">
          <div class="info-text" v-if="currentGame && schedule">
            <p>{{currentGame.display_name}}</p>
            <p>{{schedule.issue_number}}{{$t('navMenu.result_period')}}</p>
          </div>
          <div class="schedule" v-if="schedule && schedule.issue_number">
            <div class="schedule-title">封盘</div>
            <span v-if="!gameClosed" class="red countdown">
              <span v-if="closeCountDown.days > 0">{{closeCountDown.days}}天 </span>
              <span v-if="closeCountDown.hours > 0">{{closeCountDown.hours | complete}}:</span>{{closeCountDown.minutes | complete}}:{{closeCountDown.seconds | complete}}
            </span>
            <span v-else class="red countdown">已封盘</span>
          </div>
          <div class="schedule" v-if="schedule && schedule.issue_number">
            <div class="schedule-title">开奖</div>
            <span v-if="!ended" class="green countdown">
              <span v-if="resultCountDown.days > 0">{{resultCountDown.days}}天 </span>
              <span v-if="resultCountDown.hours > 0">{{resultCountDown.hours | complete}}:</span>{{resultCountDown.minutes | complete}}:{{resultCountDown.seconds | complete}}
            </span>
            <span v-else class="green countdown">已结束</span>
          </div>
        </div>
      </el-row>
      <el-row class="game-container">
        <router-view :key="$route.name + ($route.params.categoryId || '')" :game="currentGame" :scheduleId="schedule ? schedule.id : null" :gameClosed="gameClosed" />
      </el-row>
      <el-row class="m-b-xlg">
        <GameStatistic v-if="currentGame&&currentGame.code!='hkl'" :gameCode="currentGame.code" :resultStatistic="resultStatistic"/>
      </el-row>
    </div>
    <div class="leaderBoard">
      <div class="leaderBoard-title">
        长龙排行榜
      </div>
      <ul class="leaderBoard-menu">
        <li class="leaderBoard-menu-item" v-for="(item,index) in sortedStatistic" :key="index">
          <span class="text">{{item.title}} - {{item.type | typeFilter}}</span>
          <span class="period">{{item.num}}期</span>
        </li>
        <li v-if="sortedStatistic.length === 0" class="leaderBoard-menu-empty">暂无排行榜</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { fetchSchedule, fetchStatistic } from '../../api'
import gameTranslator from '../../utils/gameTranslator'
import GameResult from '../../components/GameResult'
import GameStatistic from '../../components/GameStatistic'
import _ from 'lodash'

export default {
  name: 'game',
  components: {
    GameResult,
    GameStatistic
  },
  filters: {
    complete (value) {
      value = parseInt(value)
      return value < 10 ? ('0' + value) : value
    },
    typeFilter (val) {
      switch (val) {
        case 'dragon':
          return '龙'
        case 'tiger':
          return '虎'
        case 'bigger':
          return '大'
        case 'smaller':
          return '小'
        case 'great':
          return '极大'
        case 'tiny':
          return '极小'
        case 'outOfDefinition':
          return '无极值'
        case 'odd':
          return '单'
        case 'even':
          return '双'
        case 'straight':
          return '顺子'
        case 'half_straight':
          return '半顺'
        case 'misc_six':
          return '杂六'
        case 'pair':
          return '对子'
        case 'leopard':
          return '豹子'
        case 'blue':
          return '蓝波'
        case 'red':
          return '红波'
        case 'green':
          return '绿波'
        case 'equal':
          return '和'
        case 'gold':
          return '金'
        case 'wood':
          return '木'
        case 'water':
          return '水'
        case 'fire':
          return '火'
        case 'earth':
          return '土'
        case 'front_part_more':
          return '前多'
        case 'rear_part_more':
          return '后多'
        case 'odd_more':
          return '单多'
        case 'even_more':
          return '双多'
        case 'smaller_odd':
          return '小单'
        case 'smaller_even':
          return '小双'
        case 'bigger_odd':
          return '大单'
        case 'bigger_even':
          return '大双'
        case 'east':
          return '东'
        case 'west':
          return '西'
        case 'south':
          return '南'
        case 'north':
          return '北'
        case 'zhong':
          return '中'
        case 'fa':
          return '发'
        case 'bai':
          return '白'
        case 'sumodd':
          return '合数单'
        case 'sumeven':
          return '合数双'
        case 'sumbigger':
          return '合数大'
        case 'sumsmaller':
          return '合数小'
        case 'tailbigger':
          return '尾大'
        case 'tailsmaller':
          return '尾小'
        default:
          return val
      }
    }
  },
  data () {
    return {
      gameId: this.$route.params.gameId,
      schedule: {
        id: null
      },
      timer: '',
      closeCountDown: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      resultCountDown: {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
      },
      statistic: [],
      resultStatistic: {}
    }
  },
  computed: {
    gameClosed () {
      const c = this.closeCountDown
      return c.days + c.hours + c.minutes + c.seconds === 0
    },
    ended () {
      const r = this.resultCountDown
      return r.hours + r.hours + r.seconds + r.minutes === 0
    },
    currentGame () {
      return this.$store.getters.gameById(this.$route.params.gameId)
    },
    sortedStatistic () {
      return this.statistic.sort((a, b) => {
        return b.num - a.num
      })
    }
  },
  watch: {
    'schedule.id': function (newId, oldId) {
      if (newId) {
        this.$root.bus.$emit('new-betrecords', {
          gameId: this.gameId,
          scheduleId: newId
        })
      }
    },
    'currentGame': function (currentGame) {
      this.fetchStatistic(currentGame.code)
    }
  },
  created () {
    this.updateSchedule()
    const currentGame = this.$store.getters.gameById(this.$route.params.gameId)
    if (currentGame) {
      this.fetchStatistic(currentGame.code)
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    updateSchedule () {
      clearInterval(this.timer)
      fetchSchedule(this.gameId)
        .then(res => {
          this.schedule = _.find(res, schedule => {
            return schedule.id !== this.schedule.id &&
              this.$moment().isBefore(schedule.schedule_result) &&
              (schedule.status === 'open' || schedule.status === 'created')
          })
          this.startTimer()
        })
    },
    startTimer () {
      if (!this.schedule) {
        return
      }
      this.timer = setInterval(() => {
        const closeTime = this.$moment(this.schedule.schedule_close)
        const resultTime = this.$moment(this.schedule.schedule_result)
        if (this.$moment().isAfter(resultTime)) {
          clearInterval(this.timer)
          return
        }
        this.closeCountDown = this.diffTime(closeTime)
        this.resultCountDown = this.diffTime(resultTime, true)
      }, 1000)
    },
    diffTime (target, flag) {
      const duration = this.$moment.duration(target.diff())
      let days = duration.days()
      let hours = duration.hours()
      let minutes = duration.minutes()
      let seconds = duration.seconds()
      if (flag && (days + hours + minutes + seconds === 0)) {
        this.updateSchedule()
      }
      days = days < 0 ? 0 : days
      hours = hours < 0 ? 0 : hours
      minutes = minutes < 0 ? 0 : minutes
      seconds = seconds < 0 ? 0 : seconds
      return {
        days,
        hours,
        minutes,
        seconds
      }
    },
    fetchStatistic (code) {
      fetchStatistic(code).then(result => {
        const translator = gameTranslator[code]
        const frequencyStats = result.frequency_stats
        this.resultStatistic = {
          resultSingleStatistic: result.result_single_statistic,
          historyStatistic: result.result_category_statistic
        }
        const keys = Object.keys(frequencyStats)
        const statistic = []
        _.each(keys, (key) => {
          let item = frequencyStats[key]
          let type = Object.keys(item)
          if (type.length === 0) {
            return
          }
          type = type[0]
          if (item[type] < 3) {
            return
          }
          let translated = translator(key)
          statistic.push({
            title: translated[0],
            type: translated[1] ? translated[1] + type : type,
            num: item[type]
          })
        })
        this.statistic = statistic
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../style/vars.scss";
.leaderBoard {
  float: right;
  width: 180px;
  background: #fff;
  color: #9b9b9b;
  font-size: 14px;
}
.leaderBoard-title {
  font-weight: 200;
  text-align: center;
  height: 40px;
  line-height: 40px;
  border-bottom: 2px solid $pinkish-grey;
}
.leaderBoard-menu-empty {
  color: $pinkish-grey;
  text-align: center;
  line-height: 30px;
  height: 30px;
  padding: 20px 0;
  font-weight: 200;
}
.leaderBoard-menu-item {
  padding: 0 5px;
  height: 30px;
  line-height: 30px;
  font-size: 12px;
  border-bottom: 1px solid $pinkish-grey;
  .text {
    color: #000;
  }
  .period {
    float: right;
    color: $watermelon;
  }
}
.main {
  float: left;
  width: 840px;
}

.main-play {
  width: 1050px;
}
.current-game {
  position: absolute;
}
.el-tabs__header {
  margin-bottom: 5px;
}
.game-container /deep/ .el-tabs__item {
  padding: 0 12px;
}
.schedule {
  text-align: center;
  padding: 0 20px;
  float: right;
  .schedule-title {
    height: 30px;
    line-height: 30px;
  }
}
.info-panel {
  text-align: justify;
  &:after {
    content: "";
    display: inline-block;
    width: 100%;
  }
}
.countdown-panel {
  width: 49%;
  height: 55px;
  float: right;
  background: #fff;
  border-left: 5px solid $marine-blue;
}
.info-text {
  color: #4a4a4a;
  padding-left: 20px;
  float: left;
  text-align: center;
  margin-right: 30px;
  p {
    height: 27px;
    line-height: 27px;
    letter-spacing: 2px;
  }
}
.issue-number {
  display: inline-block;
}
.countdown {
  font-size: 18px;
}
.el-tabs--top /deep/.el-tabs__nav-scroll {
  padding: 0;
}
</style>
