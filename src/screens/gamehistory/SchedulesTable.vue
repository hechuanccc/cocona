<template>
  <div class="main schedule-container">
    <div class="user-actions">
      <div class="filters">
        <div class="input">
          <el-date-picker
            v-if="currentGame === 'hkl' || currentGame === 'luckl'"
            id="date"
            type="daterange"
            v-model="selectedDate"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="~"
            unlink-panels
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
          <el-date-picker
            v-else
            id="date"
            type="date"
            v-model="selectedDate"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd">
          </el-date-picker>
        </div>
        <div class="input">
          <el-input type="number"
            :value="inputPeriod"
            @input="changeIssueNumber"
            placeholder="输入期数">
          </el-input>
        </div>
      </div>
      <div class="refresh">
        <el-button type="primary" @click="getLatest()">刷新数据</el-button>
      </div>
    </div>
    <div class="historydata m-b-xlg">
      <div v-if="!schedules.length">暂无资料</div>
      <table v-else class="history-table">
        <tr>
          <th v-for="(fieldsObject, fieldsIndex) in nowGameTable.table"
            :key="'fields-' + nowGameTable.code + fieldsIndex">
            {{fieldsObject.displayName}}
            <el-button v-if="fieldsObject.buttons"
              type="info"
              size="mini"
              v-for="(button, index) in fieldsObject.buttons"
              :key="fieldsIndex + nowGameTable.code + index"
              @click="nowDisplay = button.show">
              {{button.displayName}}
            </el-button>
            <div>
              <div v-if="fieldsObject.subHeads && subHead.displayName"
                v-for="subHead in fieldsObject.subHeads"
                :key="'field-' + currentGame + '-subHead-' + subHead.key"
                :style="{'display': 'inline-block',
                        'width': 1/fieldsObject.subHeads.length * 100 + '%'}">
                <span>{{subHead.displayName}}</span>
              </div>
            </div>
          </th>
        </tr>
        <tr v-for="(schedule, scheduleIndex) in schedules"
          :key="scheduleIndex + 'issue-' + schedule.issue_number">
          <td v-for="(fieldsObject, fieldsIndex) in nowGameTable.table"
            :key="nowGameTable.code + 'field-content-'+ fieldsIndex"
            v-if="!fieldsObject.buttons && fieldsObject.key !== 'result_str'">
            <span v-if="schedule[fieldsObject.key]">
              {{schedule[fieldsObject.key]}}
            </span>
            <span v-else-if="schedule.result_category"
              :class="schedule.result_category[fieldsObject.key]">
                {{schedule.result_category[fieldsObject.key] |resultFilter}}
            </span>
            <div>
              <span v-if="fieldsObject.subHeads && schedule.result_category"
                :class="{
                  win : schedule.result_category[subHead.key + '_result'] === 'win',
                  seperate: currentGame === 'msnn' || currentGame === 'pk10nn'
                }"
                v-for="subHead in fieldsObject.subHeads"
                :key="'centent-'+currentGame+'-subHead-'+subHead.key"
                :style="{'display': 'inline-block',
                        'width': 1/fieldsObject.subHeads.length * 100 + '%'}">
                <b v-if="currentGame === 'msnn'|| currentGame === 'pk10nn'">
                  <p>{{schedule.result_category[subHead.key].slice(0, 2)}}</p>
                  <p>{{schedule.result_category[subHead.key].slice(3)}}</p>
                </b>
                <b v-else :class="schedule.result_category[subHead.key]">
                  {{schedule.result_category[subHead.key] |resultFilter}}
                </b>

              </span>
              <span v-else>-</span>
            </div>
          </td>
          <td v-else>
            <div v-if="schedule.result_status === 'valid'"
              :style="{
                'width': currentGame === 'bjkl8' || currentGame === 'auluck8' ? '340px' : 'auto',
                'margin': '0 auto'
              }">
              <ResultNums v-for="(result, index) in classifiyResults (schedule)"
                :key="index"
                :result="result"
                :displayType="nowDisplay"
                :game="currentGame">
              </ResultNums>
            </div>
            <div v-else>官方开奖无效</div>
          </td>
        </tr>
      </table>
      <el-pagination v-if="totalCount > pageSize"
        :current-page.sync="currentPage"
        @current-change="handlePageChange"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { fetchHistory } from '../../api'
import ResultNums from './ResultNums'
import { msgFormatter } from '../../utils'
import _ from 'lodash'

export default {
  data () {
    const TransformerTable =
      [
        {
          displayName: '时间',
          key: 'schedule_result'
        },
        {
          displayName: '期数',
          key: 'issue_number'
        },
        {
          displayName: '',
          buttons: [
            { displayName: '显示号码', show: 'number' },
            { displayName: '显示大小', show: 'thanSize' },
            { displayName: '显示单双', show: 'oddEven' }
          ]
        },
        {
          displayName: '冠亚和',
          subHeads: [
            {
              displayName: '号码',
              key: 'sum_of_1st_2st'
            },
            {
              displayName: '大小',
              key: 'sum_of_1st_2st_than_size'
            },
            {
              displayName: '单双',
              key: 'sum_of_1st_2st_odd_even'
            }
          ]
        },
        {
          displayName: ' 1 - 5 龙 虎 ',
          subHeads: [
            {
              displayName: '',
              key: 'dragon_tiger_1_10'
            },
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
          displayName: '时间',
          key: 'schedule_result'
        },
        {
          displayName: '期数',
          key: 'issue_number'
        },
        {
          displayName: '',
          buttons: [
            {
              displayName: '显示号码',
              show: 'number'
            },
            {
              displayName: '显示大小',
              show: 'thanSize'
            },
            {
              displayName: '显示单双',
              show: 'oddEven'
            }
          ]
        },
        {
          displayName: '总和',
          subHeads: [
            {
              displayName: '号码',
              key: 'sum_of_ball'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            },
            {
              displayName: '单双',
              key: 'sum_of_ball_odd_even'
            }
          ]
        },
        {
          displayName: '龙虎',
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
          displayName: '后三',
          key: 'weird_chinese_dice_rules_3_5'
        }
      ]

    const cqlfTable =
      [
        {
          displayName: '时间',
          key: 'schedule_result'
        },
        {
          displayName: '期数',
          key: 'issue_number'
        },
        {
          displayName: '',
          buttons: [
            {
              displayName: '号码',
              show: 'number'
            },
            {
              displayName: '大小',
              show: 'thanSize'
            },
            {
              displayName: '单双',
              show: 'oddEven'
            },
            {
              displayName: '尾大小',
              show: 'tailThanSize'
            },
            {
              displayName: '合单双',
              show: 'ballOfSumOddEven'
            }
          ]
        },
        {
          displayName: '总和',
          subHeads: [
            {
              displayName: '号码',
              key: 'sum_of_ball'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            },
            {
              displayName: '单双',
              key: 'sum_of_ball_odd_even'
            },
            {
              displayName: '尾大小',
              key: 'sum_of_ball_tail_than_size'
            }
          ]
        },
        {
          displayName: '龙虎',
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
          displayName: '时间',
          key: 'schedule_result'
        },
        {
          displayName: '期数',
          key: 'issue_number'
        },
        {
          displayName: '开奖号码',
          key: 'result_str'
        },
        {
          displayName: '总和',
          subHeads: [
            {
              displayName: '号码',
              key: 'sum_of_ball'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            },
            {
              displayName: '单双',
              key: 'sum_of_ball_odd_even'
            },
            {
              displayName: '色波',
              key: 'sum_of_ball_color_wavelength'
            },
            {
              displayName: '极值',
              key: 'sum_of_ball_great_tiny'
            }
          ]
        }
      ]

    const jsk3Table =
      [
        {
          displayName: '时间',
          key: 'schedule_result'
        },
        {
          displayName: '期数',
          key: 'issue_number'
        },
        {
          displayName: '开奖号码',
          key: 'result_str'
        },
        {
          displayName: '总和',
          subHeads: [
            {
              displayName: '号码',
              key: 'sum_of_ball'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            }
          ]
        }
      ]

    const gd11x5Table =
      [
        {
          displayName: '时间',
          key: 'schedule_result'
        },
        {
          displayName: '期数',
          key: 'issue_number'
        },
        {
          displayName: '',
          buttons: [
            {
              displayName: '号码',
              show: 'number'
            },
            {
              displayName: '大小',
              show: 'thanSize'
            },
            {
              displayName: '单双',
              show: 'oddEven'
            }
          ]
        },
        {
          displayName: '总和',
          subHeads: [
            {
              displayName: '号码',
              key: 'sum_of_ball'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            },
            {
              displayName: '单双',
              key: 'sum_of_ball_odd_even'
            },
            {
              displayName: '尾大小',
              key: 'sum_of_ball_tail_than_size'
            }
          ]
        },
        {
          displayName: '龙虎',
          key: 'dragon_tiger_1_5'
        }
      ]

    const bjkl8Table =
      [
        {
          displayName: '时间',
          key: 'schedule_result'
        },
        {
          displayName: '期数',
          key: 'issue_number'
        },
        {
          displayName: '开奖号码',
          key: 'result_str'
        },
        {
          displayName: '开奖',
          subHeads: [
            {
              displayName: '号码',
              key: 'sum_of_ball'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            },
            {
              displayName: '单双',
              key: 'sum_of_ball_odd_even'
            },
            {
              displayName: '五行',
              key: 'sum_of_ball_five_element'
            }
          ]
        },
        {
          displayName: '比数量',
          subHeads: [
            {
              displayName: '单双比',
              key: 'balls_odd_even_cp'
            },
            {
              displayName: '前后比',
              key: 'balls_front_rear_count_cp'
            }
          ]
        }
      ]

    const hklTable =
      [
        {
          displayName: '时间',
          key: 'schedule_result'
        },
        {
          displayName: '期数',
          key: 'issue_number'
        },
        {
          displayName: '',
          buttons: [
            {
              displayName: '号码',
              show: 'number'
            },
            {
              displayName: '大小',
              show: 'thanSize'
            },
            {
              displayName: '单双',
              show: 'oddEven'
            },
            {
              displayName: '合大小',
              show: 'ballOfSumThanSize'
            },
            {
              displayName: '合单双',
              show: 'ballOfSumOddEven'
            },
            {
              displayName: '尾大小',
              show: 'tailThanSize'
            }
          ]
        },
        {
          displayName: '总和',
          subHeads: [
            {
              displayName: '号码',
              key: 'sum_of_ball'
            },
            {
              displayName: '单双',
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

    const auluck8Table =
      [
        {
          displayName: '时间',
          key: 'schedule_result'
        },
        {
          displayName: '期数',
          key: 'issue_number'
        },
        {
          displayName: '开奖号码',
          key: 'result_str'
        },
        {
          displayName: '开奖',
          subHeads: [
            {
              displayName: '号码',
              key: 'sum_of_ball'
            },
            {
              displayName: '大小',
              key: 'sum_of_ball_than_size'
            },
            {
              displayName: '单双',
              key: 'sum_of_ball_odd_even'
            },
            {
              displayName: '五行',
              key: 'sum_of_ball_five_element'
            }
          ]
        }
      ]
    const fc3dTable = [
      {
        displayName: '时间',
        key: 'schedule_result'
      },
      {
        displayName: '期数',
        key: 'issue_number'
      },
      {
        displayName: '开奖号码',
        key: 'result_str'
      },
      {
        displayName: '佰拾个和數',
        key: 'three_balls_sum'
      },
      {
        displayName: '跨度',
        key: 'ball_max_min_diff'
      },
      {
        displayName: '佰大小',
        key: 'ball_than_size_1'
      },
      {
        displayName: '佰单双',
        key: 'ball_odd_even_1'
      },
      {
        displayName: '佰质合',
        key: 'ball_prime_composite_1'
      },
      {
        displayName: '拾大小',
        key: 'ball_than_size_2'
      },
      {
        displayName: '拾单双',
        key: 'ball_odd_even_2'
      },
      {
        displayName: '拾质合',
        key: 'ball_prime_composite_2'
      },
      {
        displayName: '个大小',
        key: 'ball_than_size_3'
      },
      {
        displayName: '个单双',
        key: 'ball_odd_even_3'
      },
      {
        displayName: '个质合',
        key: 'ball_prime_composite_3'
      }
    ]
    const msnnTable =
      [
        {
          displayName: '时间',
          key: 'schedule_result'
        },
        {
          displayName: '期数',
          key: 'issue_number'
        },
        {
          displayName: '开奖号码',
          key: 'result_str'
        },
        {
          displayName: '庄闲 (背景有颜色代表闲家赢)',
          subHeads: [
            {
              displayName: '庄',
              key: 'banker'
            },
            {
              displayName: '闲一',
              key: 'player_1'
            },
            {
              displayName: '闲二',
              key: 'player_2'
            },
            {
              displayName: '闲三',
              key: 'player_3'
            },
            {
              displayName: '闲四',
              key: 'player_4'
            },
            {
              displayName: '闲五',
              key: 'player_5'
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
        code: 'er75ft',
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
        code: 'csffc',
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
      },
      {
        code: 'luckl',
        table: hklTable
      },
      {
        code: 'jnd28',
        table: pcddTable
      },
      {
        code: 'luckdd',
        table: pcddTable
      },
      {
        code: 'auluck8',
        table: auluck8Table
      },
      {
        code: 'fc3d',
        table: fc3dTable
      },
      {
        code: 'msnn',
        table: msnnTable
      },
      {
        code: 'pk10nn',
        table: msnnTable
      }
    ]

    const today = this.$moment().format('YYYY-MM-DD')
    let selectedDate
    let gameCode = this.$route.params.gameCode
    if (gameCode === 'hkl' || gameCode === 'luckl') {
      selectedDate = [this.$moment().startOf('month').format('YYYY-MM-DD'), today]
    } else {
      selectedDate = today
    }
    return {
      schedules: '',
      nowDate: this.$moment().format('YYYY-MM-DD'),
      loading: false,
      nowDisplay: 'number',
      gameTable,
      nowGameTable: '',
      inputPeriod: '',
      selectedDate: selectedDate,
      currentPage: 1,
      pageSize: 30,
      totalCount: 0
    }
  },
  filters: {
    resultFilter: function (val) {
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
        case 'prime':
          return '质'
        case 'composite':
          return '合'
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
    initFetchHistory () {
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.fetchData((this.currentPage - 1) * this.pageSize)
      }, (1 * 60 * 1000))
      this.schedules = ''
      this.fetchData(0)
      this.nowDisplay = 'number'
      this.currentPage = 1
    },
    handlePageChange (currentPage) {
      clearInterval(this.interval)
      this.interval = setInterval(() => {
        this.fetchData((this.currentPage - 1) * this.pageSize)
      }, (1 * 60 * 1000))
      this.fetchData((currentPage - 1) * this.pageSize)
    },
    fetchData (offset) {
      this.loading = true
      this.$emit('load', this.loading)
      fetchHistory({ ...this.conditions, game_code: this.currentGame ? this.currentGame : this.$route.params.gameCode, offset: offset }).then((result) => {
        if (result.results) {
          if (this.currentGame === 'bjkl8') {
            _.each(result.results, (schedule) => {
              let resultArr = schedule.result_str.split(',')
              resultArr.pop() // for bjkl8 useless 21th num
              schedule.result_str = resultArr.join()
            })
          }
          _.each(result.results, (schedule) => {
            schedule.schedule_result = this.$moment(schedule.schedule_result).format('YYYY-MM-DD HH:mm:ss')
          })
          this.totalCount = result.count
          this.schedules = result.results
        }
        this.loading = false
        this.$emit('load', this.loading)
      }, errorMsg => {
        this.$message({
          showClose: true,
          message: msgFormatter(errorMsg),
          type: 'error'
        })
        this.loading = false
        this.$emit('load', this.loading)
      }).catch(() => {
        this.loading = false
        this.$emit('load', this.loading)
      })
    },
    getLatest () {
      let currentDate = this.$moment().format('YYYY-MM-DD')
      if (!Array.isArray(this.selectedDate)) {
        if (this.selectedDate === currentDate) {
          this.initFetchHistory()
        } else {
          this.selectedDate = this.$moment().format('YYYY-MM-DD')
        }
      } else {
        const startOfMonth = this.$moment().startOf('month').format('YYYY-MM-DD')
        if (this.selectedDate[0] === startOfMonth && this.selectedDate[1] === currentDate) {
          this.initFetchHistory()
        } else {
          this.$set(this.selectedDate, 0, startOfMonth)
          this.$set(this.selectedDate, 1, currentDate)
        }
      }
    },
    changeIssueNumber: _.debounce(function (value) {
      this.inputPeriod = value
    }, 1000)
  },
  computed: {
    conditions () {
      if (!Array.isArray(this.selectedDate)) {
        return {
          created_at_0: this.selectedDate,
          created_at_1: this.selectedDate,
          issue_number_q: this.inputPeriod
        }
      }
      return {
        created_at_0: this.selectedDate[0],
        created_at_1: this.selectedDate[1],
        issue_number_q: this.inputPeriod
      }
    },
    currentGame () {
      return this.$route.params.gameCode
    }
  },
  components: {
    ResultNums
  },
  created () {
    this.nowGameTable = _.find(this.gameTable, item => {
      return item.code === this.$route.params.gameCode
    })
    this.initFetchHistory()
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  watch: {
    'currentGame': function (currentGame, oldGame) {
      this.nowGameTable = _.find(this.gameTable, item => {
        return item.code === this.$route.params.gameCode
      })
      this.initFetchHistory()
    },
    'conditions': function () {
      this.initFetchHistory()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/vars.scss";

.bigger,
.even,
.dragon,
.composite {
  color: $red;
  padding: 0 5px;
}

.schedule-container {
  text-align: center;
}
.historydata {
  padding: 10px;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
}
.history-table {
  width: 100%;
  background: white;
  margin-bottom: 10px;
  th {
    font-weight: bold;
  }
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

.user-actions {
  height: 70px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  text-align: justify;
  margin-bottom: 10px;
  .filters,
  .refresh {
    margin-left: 10px;
    padding-top: 20px;
    display: inline-block;
    .input {
      display: inline-block;
    }
  }
  .refresh {
    margin-right: 28px;
  }
  &:after {
    content: "";
    display: inline-block;
    width: 100%;
  }
}

.win {
  box-sizing: border-box;
  background-color: lighten(#409EFF, 30%);
}

.seperate {
  border-right: 1px solid #ddd;
  box-sizing: border-box;
  &:last-child {
    border: none;
  }
}
</style>

