<template>
  <div>
    <div class="main">
      <el-row class="game-container">
        <router-view
          :key="$route.params.categoryId"
          :game="currentGame"
          :scheduleId="schedule && schedule.id ? schedule.id : null"
          :gameClosed="gameClosed"
          @clearShortCut="clearShortCut"
          :zodiacMap="zodiacMap"
          ref="gameCategory"/>
        <Countdown
          v-if="schedule && schedule.id"
          :schedule="schedule"
          :currentGame="currentGame"
          :gameClosed="gameClosed"
          :closeCountDown="closeCountDown"
          :resultCountDown="resultCountDown"/>
      </el-row>
      <el-row class="m-b-xlg">
        <GameStatistic
          v-if="currentGame &&
            currentGame.code!=='hkl' &&
            currentGame.code!=='fc3d' &&
            currentGame.code!=='luckl' &&
            currentGame.code!=='msnn' &&
            currentGame.code!=='pk10nn'"
          :gameCode="currentGame.code"
          :resultStatistic="resultStatistic"/>
      </el-row>
    </div>
    <el-tabs class="tabs" v-model="activeTab" v-if="isShowShortcut" type="card">
      <el-tab-pane label="长龙统计" name="statistic">
        <ul class="menu">
          <li class="menu-item" v-for="(item,index) in sortedStatistic" :key="index">
            <span class="text">{{item.title}} - {{item.type | typeFilter}}</span>
            <span class="period">{{item.num}}期</span>
          </li>
          <li v-if="sortedStatistic.length === 0" class="menu-empty">暂无排行榜</li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="快捷投注" name="shortcut">
        <span
          :class="['shortcut-play', {actived: group.actived}]"
          v-for="(group, index) in shortcutPlayGroups"
          :key="index"
          @click="selectShortcutPlayGroup(group)">{{group.display_name}}</span>
      </el-tab-pane>
    </el-tabs>
    <div v-else class="leader-board">
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
import { shortcutPlayGroups } from '../../utils/hk6'
const categoryNeedShortcut = ['正码', '特码', '正码特']
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
    shortcutPlayGroups.forEach(group => {
      group.actived = false
    })
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
      },
      statistic: [],
      resultStatistic: {},
      activeTab: 'statistic',
      selectedShortcutPlayGroup: {},
      zodiacMap: null,
      shortcutPlayGroups: shortcutPlayGroups
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
    isShowShortcut () {
      if (this.currentCategory) {
        return categoryNeedShortcut.includes(this.currentCategory.display_name)
      }
      return false
    }
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
    'currentGame.code': function () {
      this.fetchStatistic()
    },
    'currentCategoryId': function () {
      this.clearShortCut()
    },
    'currentCategory': function (currentCategory) {
      this.setZodiacMap(currentCategory)
    },
    'zodiacMap': function (zodiacMap) {
      for (let i = 27; i < 39; i++) {
        const group = this.shortcutPlayGroups[i]
        group.num = zodiacMap[group.display_name].map(num => num < 10 ? '0' + num : '' + num)
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
        this.$store.dispatch('fetchCategories', this.currentGameId)
        const unwatch = this.$watch('categories', function (categories) {
          this.chooseCategory()
          unwatch()
        })
      }
    } else if (this.categories.length === 0) {
      this.$store.dispatch('fetchCategories', this.currentGameId)
    }

    this.$root.bus.$on('refreshResult', this.fetchStatistic)
    this.updateSchedule()
    const currentGame = this.$store.getters.gameById(this.currentGameId)
    if (currentGame) {
      localStorage.setItem('lastGameCode', currentGame.code)
      this.fetchStatistic()
    }
    this.setZodiacMap(this.currentCategory)
  },
  beforeDestroy () {
    this.$root.bus.$off('refreshResult', this.fetchStatistic)
    clearInterval(this.timer)
  },
  methods: {
    chooseCategory () {
      const categoryId = localStorage.getItem(this.currentGameId + '-lastCategory') || this.categories[0].id
      this.$router.replace(`/game/${this.currentGameId}/${categoryId}`)
    },
    updateSchedule () {
      clearInterval(this.timer)
      fetchSchedule(this.currentGameId)
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
      }).catch(() => {})
    },
    selectShortcutPlayGroup (group) {
      this.selectedShortcutPlayGroup.actived = false
      this.selectedShortcutPlayGroup = group
      group.actived = true
      this.$refs.gameCategory.triggerShortcut(group)
    },
    clearShortCut () {
      this.selectedShortcutPlayGroup.actived = false
      this.selectedShortcutPlayGroup = {}
    },
    setZodiacMap (currentCategory) {
      if (!this.zodiacMap && currentCategory && currentCategory.extra_info) {
        this.zodiacMap = this.currentCategory.extra_info.shaw
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
