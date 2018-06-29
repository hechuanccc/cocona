<template>
  <div>
    <div class="main">
      <el-row class="game-container">
        <game-match
          :key="$route.params.categoryId"
          :game="currentGame"
          :scheduleId="schedule && schedule.id ? schedule.id : null"
          :gameClosed="gameClosed"
          @selectMatch="updateSchedule"/>
        <Countdown
          v-if="schedule && schedule.id"
          :schedule="schedule"
          :currentGame="currentGame"
          :gameClosed="gameClosed"
          :closeCountDown="closeCountDown"
          :resultCountDown="resultCountDown"/>
      </el-row>
    </div>
  </div>
</template>

<script>
import Countdown from '../../components/Countdown'
import GameMatch from './GameMatch'
import { mapGetters } from 'vuex'

export default {
  name: 'GameWorldCup',
  components: {
    Countdown,
    GameMatch
  },
  data () {
    return {
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
  computed: {
    gameClosed () {
      const c = this.closeCountDown
      return c.days + c.hours + c.minutes + c.seconds === 0
    },
    currentGameId () {
      return this.$route.params.gameId
    },
    currentGame () {
      return this.$store.getters.gameById(this.currentGameId)
    },
    sortedStatistic () {
      return this.statistic.sort((a, b) => {
        return b.num - a.num
      })
    },
    currentCategoryId () {
      return this.$route.params.categoryId
    },
    currentCategory () {
      const currentCategory = this.$store.getters.categoriesById(this.currentCategoryId)
      return currentCategory
    },
    categories () {
      const currentGameId = this.currentGameId
      if (!currentGameId) {
        return []
      }
      return this.$store.getters.categoriesByGameId(currentGameId)
    },
    ...mapGetters([
      'allGames'
    ])
  },
  watch: {
    gameClosed: function () {
      if (this.gameClosed) {
        this.$store.dispatch('setCurrentGameResult', [{}])
      }
    },
    'schedule.id': function (newId, oldId) {
      if (newId) {
        this.$root.bus.$emit('new-betrecords', {
          gameId: this.currentGameId,
          scheduleId: newId
        })
      }
    },
    '$route': function (to, from) {
      if (to.path === `/game/${this.currentGameId}`) {
        this.chooseCategory()
      }
    }
  },
  created () {
    if (!this.$route.params.categoryId) {
      if (this.categories.length > 0) {
        this.chooseCategory()
      } else {
        const unwatch = this.$watch('categories', function () {
          this.chooseCategory()
          unwatch()
        })
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  methods: {
    chooseCategory () {
      const categoryId = localStorage.getItem(this.currentGameId + '-lastCategory') || this.categories[0].id
      this.$router.replace(`/game/${this.currentGameId}/${categoryId}`)
    },
    updateSchedule (schedule) {
      clearInterval(this.timer)
      this.schedule = schedule
      this.startTimer()
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
        clearInterval(this.timer)
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
 .tabs.el-tabs--top{
  /deep/ .el-tabs__header {
    margin: 0;
  }
  /deep/ .el-tabs__nav-wrap.is-scrollable {
    padding: 0;
  }
  /deep/ .el-tabs__nav-prev {
    display: none;
  }
  /deep/ .el-tabs__nav-next {
    display: none;
  }
  /deep/ .el-tabs__nav-scroll{
    padding-left: 0;
  }
  /deep/ .el-tabs__item {
    padding: 0 10px;
    width: 90px;
    box-sizing: border-box;
    text-align: center;
  }
}
.shortcut-play {
  display: inline-block;
  box-sizing: border-box;
  border-right: 1px solid $pinkish-grey;
  border-top: 1px solid $pinkish-grey;
  color: #35406d;
  width: 60px;
  height: 28px;
  line-height: 28px;
  text-align: center;
  cursor: pointer;
  &:nth-child(1),&:nth-child(2),&:nth-child(3){
    border-top: none;
  }
  &:nth-child(3n){
    border-right: none;
  }
  &.actived {
    background: #f3dab2;
  }
}
.leader-board, .tabs {
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
