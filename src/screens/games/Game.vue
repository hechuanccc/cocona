<template>
  <div>
    <el-row class="info-panel">
      <GameResult :gameid="$route.params.gameId"/>
      <div class="countdown-panel">
        <div class="info-text" v-if="currentGame">
          <p>{{currentGame.display_name}}</p>
          <p>{{schedule.issue_number}}期</p>
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
  </div>
</template>

<script>
import { fetchSchedule } from '../../api'
import GameResult from '../../components/GameResult'
import _ from 'lodash'

export default {
  name: 'game',
  components: {
    GameResult
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
      }
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
    }
  },
  created () {
    this.updateSchedule()
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  filters: {
    complete (value) {
      value = parseInt(value)
      return value < 10 ? ('0' + value) : value
    }
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
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../style/vars.scss";
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
  float: left;
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
  margin-right: 100px;
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
