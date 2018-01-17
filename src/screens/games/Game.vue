<template>
  <div>
    <div class="main">
      <el-row class="game-container">
        <router-view
          :key="$route.name + ($route.params.categoryId || '')"
          :game="currentGame"
          :scheduleId="schedule ? schedule.id : null"
          :gameClosed="gameClosed" />
        <Countdown
          :schedule="schedule"
          v-if="schedule.id"
          :currentGame="currentGame"
          :gameClosed="gameClosed"
          :closeCountDown="closeCountDown"
          :resultCountDown="resultCountDown"/>
      </el-row>
      <el-row class="m-b-xlg">
        <GameStatistic
          v-if="currentGame&&currentGame.code!=='hkl'&&currentGame.code!=='fc3d'"
          :gameCode="currentGame.code"
          :resultStatistic="resultStatistic"/>
      </el-row>
    </div>
    <div class="leader-board">
      <div class="title">
        长龙排行榜
      </div>
      <ul class="menu">
        <li class="menu-item" v-for="(item,index) in sortedStatistic" :key="index">
          <span class="text">{{item.title}} - {{item.type | typeFilter}}</span>
          <span class="period">{{item.num}}期</span>
        </li>
        <li v-if="sortedStatistic.length === 0" class="menu-empty">暂无排行榜</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { fetchSchedule, fetchStatistic } from '../../api'
import gameTranslator from '../../utils/gameTranslator'
import GameStatistic from '../../components/GameStatistic'
import Countdown from '../../components/Countdown'
import _ from 'lodash'

export default {
  name: 'game',
  components: {
    GameStatistic,
    Countdown
  },
  filters: {
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
        case 'tailprime':
          return '尾质'
        case 'tailcomposite':
          return '尾合'
        case 'prime':
          return '质'
        case 'composite':
          return '合'
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
    'currentGame.code': function () {
      this.fetchStatistic()
    }
  },
  created () {
    this.$root.bus.$on('refreshResult', this.fetchStatistic)

    this.updateSchedule()
    const currentGame = this.$store.getters.gameById(this.$route.params.gameId)
    if (currentGame) {
      this.fetchStatistic()
    }
  },
  beforeDestroy () {
    this.$root.bus.$off('refreshResult', this.fetchStatistic)
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
    fetchStatistic () {
      const code = this.currentGame.code
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
          if (item[type] < 3) { // 只取連續三期以上
            return
          }
          let translated = translator(key)
          if (!translated[0]) {
            return
          }
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
.leader-board {
  float: right;
  width: 180px;
  background: #fff;
  font-size: 13px;
  .title {
    color: #9b9b9b;
    text-align: center;
    height: 32px;
    line-height: 32px;
    border-bottom: 1px solid $pinkish-grey;
  }
  .menu-empty {
    color: #ccc;
    text-align: center;
    line-height: 30px;
    height: 30px;
    padding: 10px 0;
    font-weight: 200;
  }
  .menu-item {
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
    color: #666;
    border-bottom: 1px solid $pinkish-grey;
    .period {
      float: right;
      color: $watermelon;
    }
  }
}
.main {
  float: left;
  width: 890px;
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

.el-tabs--top /deep/.el-tabs__nav-scroll {
  padding: 0;
}
</style>
