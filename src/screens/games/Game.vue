<template>
  <el-main>
    <el-tabs v-model="activeName" @tab-click="switchTab" v-if="categories.length > 0">
      <el-tab-pane v-for="(category, index) in categories" :key="'category' + index" :name="''+category.id" :label="category.display_name" ></el-tab-pane>
    </el-tabs>

    <el-row>
      <el-col :span="6">
        <span v-if="currentGame">{{currentGame.display_name}}</span> - 
        <span v-if="currentCategory">{{currentCategory.display_name}}</span>
      </el-col>
      <el-col v-if="schedule" :span="6">
        {{schedule.issue_number}} 期 
        封盘倒数 
        <span v-if="closeCountDown.seconds > 0">{{closeCountDown.minutes}}:{{closeCountDown.seconds}} </span>
        <span v-else>已封盘</span>
        开奖倒数
        <span v-if="resultCountDown.seconds > 0">{{resultCountDown.minutes}}:{{resultCountDown.seconds}}</span>
        <span v-else>已结束</span>
      </el-col>
    </el-row>
    <router-view :key="$route.name + ($route.params.categoryId || '')" />
  </el-main>
</template>

<script>
import { fetchSchedule } from '../../api'

export default {
  name: 'game',
  data () {
    return {
      activeName: this.$route.params.categoryId,
      categories: [],
      gameId: this.$route.params.gameId,
      schedule: {},
      closeCountDown: {},
      resultCountDown: {}
    }
  },
  computed: {
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
  methods: {
    updateSchedule () {
      fetchSchedule(this.gameId)
      .then(res => {
        this.schedule = res[0]
        if (!this.timer) {
          this.startTimer()
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
        this.resultCountDown = this.diffTime(resultTime)
      }, 1000)
    },
    diffTime (target) {
      const duration = this.$moment.duration(target.diff())

      const days = duration.minutes()
      const hours = duration.hours()
      const minutes = duration.minutes()
      const seconds = duration.seconds()
      if (days + hours + minutes + seconds === 0) {
        this.updateSchedule()
      }
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

<style scoped>
</style>
