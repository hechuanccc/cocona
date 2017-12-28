<template>
<div class="main">
  <el-tabs v-model="activeName" type="card">
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
  <el-tabs v-model="activeHistoryTag" type="card">
    <el-tab-pane v-for="(tag, index) in currentHistoryTag" :key="index" :label="tag" :name="tag"></el-tab-pane>
  </el-tabs>

  <table class="table" width="100%" >
    <tr>
      <td  colspan="25"></td>
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
        cqssc: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
      },
      panelSetting: {
        bcr: [
          {
            name: '大小',
            keys: ['bigger', 'smaller']
          },
          {
            name: '单双',
            keys: ['odd', 'even']
          },
          {
            name: '龙虎',
            keys: ['dragon', 'tiger']
          }
        ]
      },
      currentHistoryTag: [],
      currentHistory: []
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
    'activeName': function (activeName) {
      this.currentHistoryTag = _.filter(this.historyTag, (tag) => {
        return this.historyMap[tag] || this.historyMap[activeName][tag]
      })

      if (this.activeHistoryTag === this.currentHistoryTag[0]) {
        this.createHistoryData()
      } else {
        this.activeHistoryTag = this.currentHistoryTag[0]
      }
    },
    'activeHistoryTag': function (activeHistoryTag) {
      this.createHistoryData()
    },
    'resultStatistic': function (resultStatistic) {
      const resultSingleStatistic = resultStatistic.resultSingleStatistic
      const historyStatistic = resultStatistic.historyStatistic

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
        let obj
        if (statisticsMap[title]) {
          obj = statisticsMap[title]
        } else {
          obj = { tabName: title }
          statistic.push(obj)
          statisticsMap[title] = obj
        }

        let resultSingle = resultSingleStatistic[key]
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
      })
      this.statistics = statistic
      this.statisticsMap = statisticsMap

      keys = Object.keys(historyStatistic)
      const historyMap = {}
      const historyTag = []
      const tagSet = new Set()
      _.each(keys, (key) => {
        let type
        if (key.includes('odd_even')) {
          type = '单双'
        } else if (key.includes('than_size')) {
          type = '大小'
        } else if (key.includes('dragon_tiger')) {
          type = '龙虎'
        } else {
          return
        }
        let translated = translator(key)
        let title = translated[0]
        if (!title) {
          return
        }
        if (title === '总和') {
          type = title + type
          historyMap[type] = historyStatistic[key]
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

      // this.activeName = statistic[0].tabName
    }
  },
  methods: {
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



