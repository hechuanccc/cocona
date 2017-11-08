<template>
  <div class="game-container">
    <el-tabs v-model="activeName" @tab-click="switchTab" v-if="categories.length > 0">
      <el-tab-pane v-for="(category, index) in categories" :key="'category' + index" :name="''+category.id" :label="category.display_name" ></el-tab-pane>
    </el-tabs>
    <div class="schedule-tips">
      <span v-if="schedule && schedule.issue_number">
        <span class="issue-number">{{schedule.issue_number}} 期</span>
        封盘
        <span v-if="!gameClosed" class="red countdown">
          <span v-if="closeCountDown.hours > 0">{{closeCountDown.hours | complete}}:</span>{{closeCountDown.minutes | complete}}:{{closeCountDown.seconds | complete}}
        </span>
        <span v-else class="red countdown">已封盘</span>
        开奖
        <span v-if="!ended" class="green countdown">
          <span v-if="resultCountDown.hours > 0">{{resultCountDown.hours | complete}}:</span>{{resultCountDown.minutes | complete}}:{{resultCountDown.seconds | complete}}
        </span>
        <span v-else class="green countdown">已结束</span>
      </span>
    </div>
    <router-view :key="$route.name + ($route.params.categoryId || '')" :scheduleId="schedule ? schedule.id : null" :gameClosed="gameClosed" />
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
      schedule: '',
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
  components: {
  },
  created () {
    const categoryId = this.$route.params.categoryId
    this.categories = this.$store.getters.categoriesByGameId(this.$route.params.gameId)
    if (!this.categories.length) {
      this.$store.dispatch('fetchCategories', this.gameId)
        .then((res) => {
          this.categories = res
          if (!categoryId) {
            this.forward(res[0])
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
      fetchSchedule(this.gameId)
      .then(res => {
        this.schedule = _.find(res, schedule => schedule.status === 'open' || schedule.status === 'created')
        if (!this.timer && this.schedule) {
          this.startTimer()
        }
      }, error => {
        if (error.response.status > 400) {
          this.$route.push({
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
        this.closeCountDown = this.diffTime(closeTime)
        this.resultCountDown = this.diffTime(resultTime, true)
      }, 1000)
    },
    diffTime (target, flag) {
      const duration = this.$moment.duration(target.diff())
      const days = duration.minutes()
      const hours = duration.hours()
      const minutes = duration.minutes()
      let seconds = duration.seconds()
      if (flag && (days + hours + minutes + seconds === 0)) {
        this.updateSchedule()
      }
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
  padding: 0 20px;
}
.el-tabs__header {
  margin-bottom: 5px;
}
.schedule-tips {
  text-align: center;
  color: #878d99;
  font-weight: 500;
  padding: 8px;
  border-radius: 4px;
  background: #f3f4f5;
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
</style>
