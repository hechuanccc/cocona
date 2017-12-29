<template>
<div class="main">
  <el-tabs v-if="statistics.length>0" v-model="activeName" type="card" @tab-click="changeActiveName">
    <el-tab-pane v-for="(item, index) in statistics" :key="index" :label="item.tabName" :name="item.tabName"></el-tab-pane>
  </el-tabs>

  <table class="table" v-if="currentTab" width="100%" >
    <tr>
      <td v-for="num in currentTableSetting" :key="num">
        {{num}}
      </td>
    </tr>
    <tr>
      <td v-for="num in currentTableSetting" :key="num">
        {{currentTab[num] || 0}}
      </td>
    </tr>
  </table>
  <el-tabs v-model="activeHistoryTag" type="card" @tab-click="changeActiveHistoryTag">
    <el-tab-pane v-for="(tag, index) in currentHistoryTag" :key="index" :label="tag" :name="tag"></el-tab-pane>
  </el-tabs>

  <table class="table" width="100%" >
    <tr v-if="cumulative">
      <td  colspan="25">
        <template v-for="(item, index) in cumulative">
          <span>{{item.key | typeFilter}}:</span>
          <span>{{item.value || 0}} </span>
        </template>
      </td>
    </tr>
    <tr>
      <td v-for="(datas, groupIndex) in currentHistory" :key="groupIndex" width="4%">
        <div v-for="(data, index) in datas" :key="index">
          {{data | typeFilter}}
        </div>
      </td>
    </tr>
  </table>
</div>
</template>
<script>
import gameTranslator from '../utils/gameTranslator'
import _ from 'lodash'

export default {
  name: 'GameStatistic',
  props: {
    gameCode: {
      type: String
    },
    resultStatistic: {
      type: Object
    }
  },
  filters: {
    typeFilter (value) {
      switch (value) {
        case 'dragon':
          return '龙'
        case 'tiger':
          return '虎'
        case 'bigger':
          return '大'
        case 'smaller':
          return '小'
        case 'odd':
          return '单'
        case 'even':
          return '双'
        case 'equal':
          return '和'
        case 'blue':
          return '蓝'
        case 'red':
          return '红'
        case 'green':
          return '绿'
        case 'outOfDefinition':
          return '无'
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
          return '前'
        case 'rear_part_more':
          return '后'
        case 'odd_more':
          return '单'
        case 'even_more':
          return '双'
      }
      return value
    }
  },
  data () {
    return {
      statistics: [],
      statisticsMap: {},
      activeName: '',
      historyTag: [],
      historyMap: {},
      activeHistoryTag: '',
      tableSetting: {
        jspk10: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
        bcr: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
        mlaft: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
        er75ft: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10'],
        jsssc: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        tjssc: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        xjssc: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        cqssc: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
        gd11x5: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
      },
      panelSetting: {
        '单双': ['odd', 'even'],
        '大小': ['bigger', 'smaller'],
        '龙虎': ['dragon', 'tiger'],
        '龙虎和': ['dragon', 'tiger', 'equal'],
        '总和大小': ['bigger', 'smaller'],
        '总和单双': ['odd', 'even'],
        '尾数大小': ['bigger', 'smaller'],
        '总和尾数大小': ['bigger', 'smaller'],
        '合数单双': ['odd', 'even'],
        '总和色波': ['red', 'blue', 'green', 'outOfDefinition'],
        '五行': ['gold', 'wood', 'water', 'fire', 'earth'],
        '前后和': ['front_part_more', 'rear_part_more'],
        '单双和': ['odd_more', 'even_more'],
        '810': ['odd', 'even']
      },
      currentHistoryTag: [],
      currentHistory: [],
      cumulative: ''
    }
  },
  computed: {
    currentTab () {
      return this.statisticsMap[this.activeName]
    },
    currentTableSetting () {
      if (this.activeName === '冠、亚军和') {
        return ['3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19']
      } else {
        return this.tableSetting[this.gameCode]
      }
    }
  },
  watch: {
    'resultStatistic': function (resultStatistic) {
      const resultSingleStatistic = resultStatistic.resultSingleStatistic
      const historyStatistic = resultStatistic.historyStatistic
      let dragonTigerSpecial
      // if game in ssc series the dragon_tiger would become dragon_tiger_equal
      if (this.gameCode.includes('ssc')) {
        dragonTigerSpecial = '龙虎和'
      } else {
        dragonTigerSpecial = '龙虎'
      }

      const translator = gameTranslator[this.gameCode]
      let keys = Object.keys(resultSingleStatistic)
      const statisticsMap = {}
      const statistic = []
      _.each(keys, (key) => {
        let translated = translator(key)
        let title = translated[0]
        if (!title) {
          return
        }

        let type
        let resultSingle = resultSingleStatistic[key]
        if (key.includes('odd_even')) {
          type = '单双'
        } else if (key.includes('than_size')) {
          type = '大小'
        } else if (key.includes('dragon_tiger')) {
          type = dragonTigerSpecial
        } else if (key.includes('color_wavelength')) {
          type = '色波'
        }
        if (title === '总和') {
          statisticsMap[title + type] = resultSingle
        } else if (title === '五行') {
          statisticsMap[title] = resultSingle
        } else if (title === '前后和') {
          statisticsMap[title] = resultSingle
        } else if (title === '单双和') {
          statisticsMap[title] = resultSingle
        } else {
          let obj
          if (statisticsMap[title]) {
            obj = statisticsMap[title]
          } else {
            obj = { tabName: title }
            statistic.push(obj)
            statisticsMap[title] = obj
          }
          let types = Object.keys(resultSingle)

          if (types.length === 0) {
            return
          }
          _.each(types, (type) => {
            let num = resultSingle[type]
            if (translated[1]) {
              type = translated[1] + type
            }
            obj[type] = num
          })
        }
      })
      this.statistics = statistic
      this.statisticsMap = statisticsMap

      keys = Object.keys(historyStatistic)
      const historyMap = {}
      const historyTag = []
      const tagSet = new Set()
      _.each(keys, (key) => {
        let type
        let translated = translator(key)
        let title = translated[0]
        if (!title) {
          return
        }
        if (key.includes('sum_number_odd_even')) {
          type = '合数单双'
        } else if (key.includes('tail_than_size')) {
          type = '尾数大小'
        } else if (key.includes('odd_even')) {
          type = '单双'
        } else if (key.includes('than_size')) {
          type = '大小'
        } else if (key.includes('dragon_tiger')) {
          type = dragonTigerSpecial
        } else if (key.includes('color_wavelength')) {
          type = '色波'
        }
        if (title === '总和') {
          type = title + type
          historyMap[type] = historyStatistic[key]
        } else if (title === '五行') {
          type = title
          historyMap[title] = historyStatistic[key]
        } else if (title === '前后和') {
          type = title
          historyMap[title] = historyStatistic[key]
        } else if (title === '单双和') {
          type = title
          historyMap[title] = historyStatistic[key]
        } else {
          let obj
          if (historyMap[title]) {
            obj = historyMap[title]
          } else {
            obj = { tabName: title }
            historyMap[title] = obj
          }
          obj[type] = historyStatistic[key]
        }
        if (!tagSet.has(type)) {
          historyTag.push(type)
          tagSet.add(type)
        }
      })

      this.historyTag = historyTag
      this.historyMap = historyMap
      if (statistic.length > 0) {
        this.activeName = statistic[0].tabName
      }
      this.createHistoryTag()
      this.createHistoryData()
      this.createCumulative()
    }
  },
  methods: {
    changeActiveName () {
      this.createHistoryTag()
      this.createHistoryData()
      this.createCumulative()
    },
    changeActiveHistoryTag () {
      this.createHistoryData()
      this.createCumulative()
    },
    createHistoryTag () {
      this.currentHistoryTag = _.filter(this.historyTag, (tag) => {
        return this.historyMap[tag] || this.historyMap[this.activeName][tag]
      })

      this.activeHistoryTag = this.currentHistoryTag[0]
    },
    createHistoryData () {
      let arr
      if (this.historyMap[this.activeHistoryTag]) {
        arr = this.historyMap[this.activeHistoryTag]
      } else {
        arr = this.historyMap[this.activeName][this.activeHistoryTag]
      }
      if (!arr) {
        this.currentHistory = []
        return []
      } else {
        if (arr.length < 25) {
          for (let i = 0, length = 25 - arr.length; i < length; i++) {
            arr.push([])
          }
        }
        this.currentHistory = arr
      }
    },
    createCumulative () {
      let keys = this.panelSetting[this.activeHistoryTag]
      let values
      if (this.statisticsMap[this.activeHistoryTag]) {
        values = this.statisticsMap[this.activeHistoryTag]
      } else {
        values = this.statisticsMap[this.activeName]
      }

      let cumulative = []
      _.each(keys, (key, index) => {
        cumulative.push({
          key: keys[index],
          value: values[keys[index]]
        })
      })
      this.cumulative = cumulative
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  background: #fff;
}
.table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  text-align: center;
  td {
    padding: 10px 0;
    border: 1px solid #ccc;
  }
}
</style>



