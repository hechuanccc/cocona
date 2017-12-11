<template>
  <el-row class="row-bg">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('navMenu.draw_history')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row class="history-container">
        <el-col :span="3">
          <el-menu default-active="1">
            <el-menu-item v-for="(game, index) in games"
              :key="game.id"
              :index="index + 1 + ''"
              @click="currentGame = game.code">
            <span slot="title">{{game.display_name}}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="21" class="schedule-container">
          <div v-if="loading">Loading...</div>
          <div v-else>
            <el-row class="m-t m-b">
              <el-col :span="3" :offset="1">
                <el-date-picker type="date"
                v-model = "selectedDate"
                placeholder="选择日期"
                @change="getHistory(currentGame,selectedDate)"></el-date-picker>
              </el-col>
              <el-col :span="4" :offset="2">
                <el-input
                  type="number"
                  v-model.number="inputPeriod"
                  placeholder="輸入期數"
                >
                </el-input>
              </el-col>
              <el-col :span="4" :offset="10">
                <el-button type="primary" @click="getHistory(currentGame, nowDate)">刷新數據</el-button>
              </el-col>
            </el-row>
            <div v-if="!showSchedules.length">暫無資料...</div>
            <table v-else
              class="history-table"
              :key="'table' + gameTable.code">
              <tr>
                <th v-for="(fieldsObject, fieldsIndex) in nowGameTable.table"
                  :key="'fields-'+fieldsIndex"
                  >
                  {{fieldsObject.displayName}}
                  <el-button v-if="fieldsObject.buttons"
                    type="info"
                    size="mini"
                    v-for="(button, index) in fieldsObject.buttons"
                    :key="index"
                    @click="nowDisplay = button.show"
                    >
                    {{button.displayName}}
                  </el-button>
                  <div>
                    <div v-if="fieldsObject.subHeads && subHead.displayName"
                      v-for="subHead in fieldsObject.subHeads"
                      :style="{'display': 'inline-block',
                        'width': 1/fieldsObject.subHeads.length * 100 + '%'}">
                      <span>{{subHead.displayName}}</span>
                    </div>
                  </div>
                </th>
              </tr>
              <tr v-for="schedule in showSchedules"
                :key="'issue-' + schedule.issue_number">
                <td v-for="(fieldsObject, fieldsIndex) in nowGameTable.table"
                  :key="'field-'+fieldsIndex"
                  v-if="!fieldsObject.buttons && fieldsObject.key !== 'result_str'">
                  <span v-if="schedule[fieldsObject.key]">
                    {{schedule[fieldsObject.key]}}
                  </span>
                  <span v-else :class="schedule.result_category[fieldsObject.key]">{{schedule.result_category[fieldsObject.key] |resultFilter}}</span>
                  <div>
                    <span v-if="fieldsObject.subHeads"
                      v-for="subHead in fieldsObject.subHeads"
                      :key="currentGame+'-'+subHead.key"
                      :style="{'display': 'inline-block',
                        'width': 1/fieldsObject.subHeads.length * 100 + '%'}"
                    >
                      <b :class="schedule.result_category[subHead.key]">{{schedule.result_category[subHead.key] |resultFilter}}</b>
                    </span>
                  </div>
                </td>
                <td v-else>
                  <div :style="{
                    'width': currentGame === 'bjkl8' ? '340px' : 'auto',
                    'margin': '0 auto'
                    }">
                    <ResultNums
                      v-for= "result in classifiyResults (schedule)"
                      :key="result.num"
                      :result="result"
                      :number = "nowDisplay === 'number'"
                      :thanSize = "nowDisplay === 'thanSize'"
                      :tailThanSize = "nowDisplay === 'tailThanSize'"
                      :oddEven = "nowDisplay === 'oddEven'"
                      :ballOfSumOddEven = "nowDisplay === 'ballOfSumOddEven'"
                      :ballOfSumThanSize = "nowDisplay === 'ballOfSumThanSize'"
                      :display= "nowDisplay"
                      :game="currentGame">
                    </ResultNums>
                  </div>
                </td>
              </tr>
            </table>
            <el-pagination
              v-if="filteredSchedules.length > pageSize"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              :total="filteredSchedules.length">
            </el-pagination>
          </div>
        </el-col>
      </el-row>
    </div>
  </el-row>
</template>

<style lang="scss" scoped>
@import "../../style/vars.scss";
.blue {
  color: $primary;
}
.bigger, .even, .dragon {
  color: $red
}
.game-nav {
  text-decoration: none;
}
.history-container {
  background-color: white;
  height: 100%;
  min-height: 100vh;
}
.schedule-container {
  text-align: center
}

.history-table {
  width: 100%;
  background: white;
  margin-bottom: 10px;
  td,
  th {
    border: $cell-border;
    height: $cell-height;
    line-height: $cell-height;
    vertical-align: middle;
  }
  .group-name {
    line-height: $cell-height;
    text-align: center;
    font-weight: bold;
  }
}
</style>
<script>
import { fetchGames, fetchHistory } from '../../api'
import ResultNums from './ResultNums'
import _ from 'lodash'

export default {
  data () {
    let currentGame = 'jspk10' // init

    const TransformerTable =
      [
        {
          displayName: '時間',
          key: 'schedule_result'
        },
        {
          displayName: '其數',
          key: 'issue_number'
        },
        {
          displayName: '',
          buttons: [
          { displayName: '顯示號碼', show: 'number' },
          { displayName: '顯示大小', show: 'thanSize' },
          { displayName: '顯示單雙', show: 'oddEven' }
          ]
        },
        {
          displayName: '冠亞和',
          subHeads: [
            {
              displayName: '號碼',
              key: 'sum_of_1st_2st'
            },
            {
              displayName: '大小',
              key: 'sum_of_1st_2st_than_size'
            },
            {
              displayName: '單雙',
              key: 'sum_of_1st_2st_odd_even'
            }
          ]
        },
        {
          displayName: '1-5龍虎',
          subHeads: [
            {
              displayName: '',
              key: 'dragon_tiger_2_9'
            },
            {
              displayName: '',
              key: 'dragon_tiger_3_8'
            },
            {
              displayName: '',
              key: 'dragon_tiger_4_7'
            },
            {
              displayName: '',
              key: 'dragon_tiger_5_6'
            }
          ]
        }
      ]

    const sscTable =
      [
        {
          displayName: '時間',
          key: 'schedule_result'
        },
        {
          displayName: '期數',
          key: 'issue_number'
        },
        {
          displayName: '',
          buttons: [
            {
              displayName: '顯示號碼',
              show: 'number'
            },
            {
              displayName: '顯示大小',
              show: 'thanSize'
            },
            {
              displayName: '顯示單雙',
              show: 'oddEven'
            }
          ]
        },
        {
          displayName: '總和',
          subHeads: [
            {
              displayName: '號碼',
              key: 'sum_of_ball'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            },
            {
              displayName: '單雙',
              key: 'sum_of_ball_odd_even'
            }
          ]
        },
        {
          displayName: '龍虎',
          key: 'dragon_tiger_1_5'
        },
        {
          displayName: '前三',
          key: 'weird_chinese_dice_rules_1_3'
        },
        {
          displayName: '中三',
          key: 'weird_chinese_dice_rules_2_4'
        },
        {
          displayName: '後三',
          key: 'weird_chinese_dice_rules_3_5'
        }
      ]

    const cqlfTable =
      [
        {
          displayName: '時間',
          key: 'schedule_result'
        },
        {
          displayName: '期數',
          key: 'issue_number'
        },
        {
          displayName: '',
          buttons: [
            {
              displayName: '號碼',
              show: 'number'
            },
            {
              displayName: '大小',
              show: 'thanSize'
            },
            {
              displayName: '單雙',
              show: 'oddEven'
            },
            {
              displayName: '尾大小',
              show: 'tailThanSize'
            },
            {
              displayName: '合單雙',
              show: 'ballOfSumOddEven'
            }
          ]
        },
        {
          displayName: '總和',
          subHeads: [
            {
              displayName: '號碼',
              key: 'sum_of_ball'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            },
            {
              displayName: '單雙',
              key: 'sum_of_ball_odd_even'
            },
            {
              displayName: '尾大小',
              key: 'sum_of_ball_tail_than_size'
            }
          ]
        },
        {
          displayName: '龍虎',
          subHeads: [
            {
              displayName: '',
              key: 'dragon_tiger_1_8'
            },
            {
              displayName: '',
              key: 'dragon_tiger_2_7'
            },
            {
              displayName: '',
              key: 'dragon_tiger_3_6'
            },
            {
              displayName: '',
              key: 'dragon_tiger_4_5'
            }
          ]
        }
      ]

    const pcddTable =
      [
        {
          displayName: '時間',
          key: 'schedule_result'
        },
        {
          displayName: '期數',
          key: 'issue_number'
        },
        {
          displayName: '開獎號碼',
          key: 'result_str'},
        {
          displayName: '總和',
          subHeads: [
            {
              displayName: '號碼',
              key: 'sum_of_ball'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            },
            {
              displayName: '單雙',
              key: 'sum_of_ball_odd_even'
            },
            {
              displayName: '色波',
              key: 'sum_of_ball_color_wavelength'
            },
            {
              displayName: '極值',
              key: 'sum_of_ball_great_tiny'
            }
          ]
        }
      ]

    const jsk3Table =
      [
        {
          displayName: '時間',
          key: 'schedule_result'
        },
        {
          displayName: '期數',
          key: 'issue_number'
        },
        {
          displayName: '開獎號碼',
          key: 'result_str'},
        {
          displayName: '總和',
          subHeads: [
            {
              displayName: '號碼',
              key: 'sum_of_ball'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            },
            {
              displayName: '單雙',
              key: 'sum_of_ball_odd_even'
            }
          ]
        }
      ]

    const gd11x5Table =
      [
        {
          displayName: '時間',
          key: 'schedule_result'
        },
        {
          displayName: '期數',
          key: 'issue_number'
        },
        {
          displayName: '',
          buttons: [
            {
              displayName: '號碼',
              show: 'number'
            },
            {
              displayName: '大小',
              show: 'thanSize'
            },
            {
              displayName: '單雙',
              show: 'oddEven'
            }
          ]
        },
        {
          displayName: '總和',
          subHeads: [
            {
              displayName: '號碼',
              key: 'sum_of_ball'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            },
            {
              displayName: '單雙',
              key: 'sum_of_ball_odd_even'
            },
            {
              displayName: '尾大小',
              key: 'sum_of_ball_tail_than_size'
            }
          ]
        },
        {
          displayName: '龍虎',
          KEY: 'dragon_tiger_1_5'
        }
      ]

    const bjkl8Table =
      [
        {
          displayName: '時間',
          key: 'schedule_result'
        },
        {
          displayName: '期數',
          key: 'issue_number'
        },
        {
          displayName: '開獎號碼',
          key: 'result_str'},
        {
          displayName: '總和',
          subHeads: [
            {
              displayName: '號碼',
              key: 'sum_of_ball'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            },
            {
              displayName: '單雙',
              key: 'sum_of_ball_odd_even'
            },
            {
              displayName: '五行',
              key: 'sum_of_ball_five_element'
            }
          ]
        },
        {
          displayName: '比數量',
          subHeads: [
            {
              displayName: '單雙比',
              key: 'balls_odd_even_cp'
            },
            {
              displayName: '前後比',
              key: 'balls_front_rear_count_cp'
            }
          ]
        }
      ]

    const hklTable =
      [
        {
          displayName: '時間',
          key: 'schedule_result'
        },
        {
          displayName: '期數',
          key: 'issue_number'
        },
        {
          displayName: '',
          buttons: [
            {
              displayName: '號碼',
              show: 'number'
            },
            {
              displayName: '大小',
              show: 'thanSize'
            },
            {
              displayName: '單雙',
              show: 'oddEven'
            },
            {
              displayName: '合大小',
              show: 'ballOfSumThanSize'
            },
            {
              displayName: '合單雙',
              show: 'ballOfSumOddEven'
            },
            {
              displayName: '尾大小',
              show: 'tailThanSize'
            }
          ]
        },
        {
          displayName: '總和',
          subHeads: [
            {
              displayName: '號碼',
              key: 'sum_of_ball'
            },
            {
              displayName: '單雙',
              key: 'sum_of_ball_odd_even'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            },
            {
              displayName: '七色波',
              key: 'seven_color_wavelength'
            }
          ]
        }
      ]

    const gameTable = [
      {
        code: 'jspk10',
        table: TransformerTable
      },
      {
        code: 'bcr',
        table: TransformerTable
      },
      {
        code: 'mlaft',
        table: TransformerTable
      },
      {
        code: 'cqssc',
        table: sscTable
      },
      {
        code: 'jsssc',
        table: sscTable
      },
      {
        code: 'xjssc',
        table: sscTable
      },
      {
        code: 'tjssc',
        table: sscTable
      },
      {
        code: 'cqlf',
        table: cqlfTable
      },
      {
        code: 'gdklsf',
        table: cqlfTable
      },
      {
        code: 'pcdd',
        table: pcddTable
      },
      {
        code: 'jsk3',
        table: jsk3Table
      },
      {
        code: 'gd11x5',
        table: gd11x5Table
      },
      {
        code: 'bjkl8',
        table: bjkl8Table
      },
      {
        code: 'hkl',
        table: hklTable
      }
    ]
    const nowGameTable = _.find(gameTable, item => {
      return item.code === currentGame
    })

    return {
      games: '',
      currentGame,
      schedules: '',
      nowDate: this.$moment().format('YYYY-MM-DD'),
      loading: false,
      nowDisplay: 'number',
      gameTable,
      nowGameTable,
      inputPeriod: '',
      selectedDate: this.$moment().format('YYYY-MM-DD'),
      currentPage: 1,
      pageSize: 30
    }
  },
  filters: {
    resultFilter: function (val) {
      switch (val) {
        case 'dragon':
          return '龍'
        case 'tiger':
          return '虎'
        case 'bigger':
          return '大'
        case 'smaller':
          return '小'
        case 'great':
          return '極大'
        case 'tiny':
          return '極小'
        case 'outOfDefinition':
          return '無極值'
        case 'odd':
          return '單'
        case 'even':
          return '雙'
        case 'straight':
          return '順子'
        case 'half_straight':
          return '半順'
        case 'misc_six':
          return '雜六'
        case 'pair':
          return '對子'
        case 'leopard':
          return '豹子'
        case 'blue':
          return '藍波'
        case 'red':
          return '紅波'
        case 'green':
          return '綠波'
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
          return '後多'
        case 'odd_more':
          return '單多'
        case 'even_more':
          return '雙多'
        default:
          return val
      }
    }
  },
  methods: {
    classifiyResults (schedule) {
      let classfied = _.map(schedule.result_str.split(','), (num, i) => ({
        oddEven: schedule.result_category[`ball_odd_even_${i + 1}`],
        thanSize: schedule.result_category[`ball_than_size_${i + 1}`],
        tailThanSize: schedule.result_category[`ball_tail_than_size_${i + 1}`],
        ballOfSumOddEven: schedule.result_category[`ball_of_sum_number_odd_even_${i + 1}`],
        ballOfSumThanSize: schedule.result_category[`ball_of_sum_number_than_size_${i + 1}`],
        zodiac: schedule.result_category[`ball_chinese_zodiac_${i + 1}`],
        num
      }))
      return classfied
    },
    getHistory (game, date) {
      date = this.$moment(date).format('YYYY-MM-DD')
      fetchHistory(game, date).then((result) => {
        this.selectedDate = date
        if (result) {
          if (game === 'bjkl8') {
            _.each(result, (schedule) => {
              let resultArr = schedule.result_str.split(',')
              resultArr.pop() // for bjkl8 useless 21th num
              schedule.result_str = resultArr.join()
            })
          }
          _.each(result, (schedule) => {
            schedule.schedule_result = this.$moment(schedule.schedule_result).format('YYYY-MM-DD hh:mm:ss')
          })
          this.schedules = result
        }
        this.loading = false
      })
    }
  },
  computed: {
    filteredSchedules () {
      return this.schedules.filter(schedule => {
        return schedule['issue_number'].indexOf(this.inputPeriod) !== -1
      })
    },
    showSchedules () {
      let groupIdx = (this.currentPage - 1) * this.pageSize
      return this.filteredSchedules.slice(groupIdx, groupIdx + this.pageSize)
    }
  },
  components: {
    ResultNums
  },
  created () {
    this.loading = true
    fetchGames().then(
      games => {
        if (!games) {
          return
        }
        this.games = games
        return games
      }
    ).then(games => {
      if (this.currentGame) {
        this.getHistory(this.currentGame, this.nowDate)
        this.interval = setInterval(() => {
          this.getHistory(this.currentGame, this.selectedDate)
        }, (1 * 60 * 1000))
      }
    })
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  watch: {
    'currentGame': function () {
      this.loading = true
      this.nowGameTable = _.find(this.gameTable, item => {
        return item.code === this.currentGame
      })
      clearInterval(this.interval)
      this.schedules = ''
      this.nowDisplay = 'number'
      this.getHistory(this.currentGame, this.nowDate)
      this.interval = setInterval(() => {
        this.getHistory(this.currentGame, this.selectedDate)
      }, (5 * 60 * 1000))
    }
  }
}
</script>
