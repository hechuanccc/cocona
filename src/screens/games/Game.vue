<template>
  <div class="game-container">
    <el-tabs v-model="activeName" @tab-click="switchTab" v-if="categories.length > 0">
      <el-tab-pane v-for="(category, index) in categories" :key="'category' + category.id" :name="''+category.id" :label="category.display_name" ></el-tab-pane>
    </el-tabs>
    <div class="schedule-tips">
      <div class="current-game" v-if="currentGame && currentCategory">
        {{currentGame.display_name}} > {{currentCategory.display_name}}
      </div>
      <span v-if="schedule && schedule.issue_number">
        <span class="issue-number">{{schedule.issue_number}} 期</span>
        封盘
        <span v-if="!gameClosed" class="red countdown">
          <span v-if="closeCountDown.days > 0">{{closeCountDown.days}}天 </span>
          <span v-if="closeCountDown.hours > 0">{{closeCountDown.hours | complete}}:</span>{{closeCountDown.minutes | complete}}:{{closeCountDown.seconds | complete}}
        </span>
        <span v-else class="red countdown">已封盘</span>
        开奖
        <span v-if="!ended" class="green countdown">
          <span v-if="resultCountDown.days > 0">{{resultCountDown.days}}天 </span>
          <span v-if="resultCountDown.hours > 0">{{resultCountDown.hours | complete}}:</span>{{resultCountDown.minutes | complete}}:{{resultCountDown.seconds | complete}}
        </span>
        <span v-else class="green countdown">已结束</span>
      </span>
    </div>
    <router-view :key="$route.name + ($route.params.categoryId || '')" :game="currentGame" :scheduleId="schedule ? schedule.id : null" :gameClosed="gameClosed" />
  </div>
</template>

<script>
import { fetchSchedule } from '../../api'
import _ from 'lodash'

export default {
  name: 'game',
  data () {
    return {
      activeName: this.$route.params.categoryId,
      categories: [],
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
    '$route.params.categoryId': function () {
      this.activeName = this.$route.params.categoryId
    },
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
    currentCategory () {
      return this.$store.getters.categoriesById(this.$route.params.categoryId)
    },
    currentGame () {
      return this.$store.getters.gameById(this.$route.params.gameId)
    }
  },
  created () {
    const categoryId = this.$route.params.categoryId
    this.categories = this.$store.getters.categoriesByGameId(this.$route.params.gameId)
    if (!this.categories.length) {
      this.$store.dispatch('fetchCategories', this.gameId)
        .then((res) => {
          if (res) {
            this.categories = res
            if (!categoryId) {
              this.forward(res[0])
            }
          } else {
            this.performLogin()
          }
        })
    } else if (!categoryId) {
      this.forward(this.categories[0])
    }
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
        }, error => {
          if (error.response.status > 400) {
            this.$router.push({
              path: '/',
              next: this.$route.path
            })
          }
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
    forward (category) {
      if (!category) {
        return
      }
      this.activeName = category.id + ''
      this.$router.push({
        path: `/game/${this.gameId}/${category.id}`,
        params: { formatting: category.formatting }
      })
    },
    switchTab (tab, event) {
      const targetCategory = this.categories[parseInt(tab.index)]
      this.forward(targetCategory)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../style/vars.scss';
.game-container {
  background: #fff;
  padding: 0 10px 10px;
  margin-top: 20px;
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
.schedule-tips {
  height: 30px;
  line-height: 30px;
  text-align: center;
  color: #878d99;
  padding: 0 8px;
  margin-top: -5px;
  margin-bottom: 10px;
}
.issue-number {
  margin-right: 10px;
  display: inline-block;
}
.countdown {
  margin-right: 10px;
  font-size: 14px;
}
.el-tabs--top  /deep/.el-tabs__nav-scroll {
  padding: 0;
}
</style>
