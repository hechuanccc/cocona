<template>
  <div>
    <el-row type="flex" class="actions" justify="center" :gutter="10">
      <el-col :span="1" class="amount">金额</el-col>
      <el-col :span="3">
        <el-input v-model="amount" />
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small" @click="openDialog" :disabled="gameClosed">下单</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </el-col>
     <el-col :span="9" class="result-balls">
        <el-button type="text">
          最新开奖奖号
          <span v-for="result in resultBall"
          :key="result"
          :class="getResultClass(result)">
            <b> {{result}} </b>
          </span>
          <div class="result-sum" v-if="gameLatestResult.game_code === 'pcdd'">
            總和:
            <span>
              <b>{{resultsSum}}</b>
            </span>
          </div>
        </el-button>
      </el-col>
    </el-row>
    <div v-for="(playSection, index) in playSections"
    class="clearfix"
    v-if="playSections.length">
      <div :style="{width: getWidthForGroup(playSection)}"
      v-for="(playgroup, playgroupIndex) in playSection.playgroups"
      :class="['group-table', playgroupIndex === playSection.playgroups.length - 1 ? 'last' : '']">
        <table class="play-table" align="center" key="playgroup.code + index + '' + playgroupIndex">
          <tr>
            <th class="group-name" :colspan="playSection.playCol">
              {{playgroup.length}}{{playgroup.display_name}}
            </th>
          </tr>
          <tr v-for="(playChunk, playChunkIndex) in playgroup.plays">
            <td v-for="play in playChunk" align="center" :class="['clickable',
                {
                  hover: plays[play.id].hover,
                  active: plays[play.id].active && !gameClosed
                }]"
                @mouseover="toggleHover(play, true)"
                @mouseleave="toggleHover(play, false)"
                @click="toggleActive(plays[play.id], $event)">
              <el-col :span="7" class="name">
                <span :class="[playgroup.code, play.code.replace(',', '')]">{{play.display_name}}</span>
              </el-col>
              <el-col :span="7" class="odds">
                {{ !gameClosed ? play.odds : '-'}}
              </el-col>
              <el-col :span="10" class="input">
                <el-input v-if="!gameClosed" size="mini" class="extramini" v-model="plays[play.id].amount" type="number" min="1" step="10"
                />
                <el-input v-else size="mini" class="extramini" placeholder="封盘" disabled />
              </el-col>
            </td>
            <td :colspan="playSection.playCol - playChunk.length" v-if="playChunk.length < playSection.playCol && playChunkIndex === playgroup.plays.length - 1"></td>
          </tr>
        </table>
      </div>
    </div>
    <el-row type="flex" class="actions" justify="center" :gutter="10" v-if="!loading">
      <el-col :span="1" class="amount">金额</el-col>
      <el-col :span="3">
        <el-input v-model="amount" />
      </el-col>
      <el-col :span="4">
        <el-button type="primary"
          size="small"
          @click="openDialog"
          :disabled="gameClosed">下单</el-button>
        <el-button size="small" @click="reset">重置</el-button>
      </el-col>
    </el-row>
    <el-dialog title="确认注单"
      width="40%"
      :before-close="beforeClose"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-table :data="activePlays" stripe max-height="350">
        <el-table-column property="display_name" label="号码" width="150">
          <template slot-scope="scope">
            <span class="play-name">{{scope.row.display_name}}</span>
          </template>
        </el-table-column>
        <el-table-column property="odds" label="赔率" width="100">
          <template slot-scope="scope">
            <span class="red bet-amount">{{scope.row.odds}}</span>
          </template>
        </el-table-column>
        <el-table-column property="bet_amount" label="金额">
          <template slot-scope="scope">
            <el-input size="mini" v-model="scope.row.bet_amount"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="active" label="确认">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.active">确认</el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <div class="summary">
        共 {{playsForSubmit.length}} 组 总金额:
        <span class="red bet-amount">{{totalAmount}}</span>
      </div>
      <el-alert v-if="errors" :title="errors" type="error" center :closable="false" show-icon>
      </el-alert>
      <div class="popup-actions" v-if="!submitted">
        <el-button size="medium" :loading="submitting" type="primary" :disabled="!playsForSubmit.length" @click="placeOrder">确认</el-button>
        <el-button size="medium" @click="dialogVisible = false" :disabled="submitting">取消</el-button>
      </div>
      <el-alert v-else title="成功下单" type="success" center :closable="false" show-icon>
      </el-alert>
    </el-dialog>
  </div>
</template>


<script>
import Vue from 'vue'
import _ from 'lodash'
import '../../style/theme.scss'
import { fetchPlaygroup, placeBet, fetchGameResult } from '../../api'
import { formatPlayGroup } from '../../utils'

export default {
  props: {
    gameClosed: {
      type: Boolean,
      default: false
    },
    scheduleId: {
      type: Number
    },
    game: {
      type: Object
    }
  },
  name: 'gameplay',
  data () {
    return {
      playSections: [],
      loading: true,
      plays: {},
      amount: localStorage.getItem('amount') || '',
      // raw data in play group from API, used to generate playSections
      raw: [],
      dialogVisible: false,
      activePlays: [],
      totalAmount: 0,
      submitted: false,
      submitting: false,
      errors: '',
      gameLatestResult: ''
    }
  },
  computed: {
    playsForSubmit () {
      return _.filter(this.activePlays, play => play.active).map(play => {
        return {
          game_schedule: this.scheduleId,
          bet_amount: play.bet_amount,
          play: play.id
        }
      })
    },
    formatting () {
      let category = this.$store.getters.categoriesById(this.$route.params.categoryId)
      return category ? category.formatting : null
    },
    // just to trigger watcher below
    rawAndFormatting () {
      return this.raw && this.formatting && (this.raw.length + this.formatting.length)
    },
    resultBall () {
      if (!this.gameLatestResult.result_str) {
        return '尚无开奖结果'
      }
      return this.gameLatestResult.result_str.split(',')
    },
    resultsSum () {
      let sum = 0
      for (let i = 0; i < this.resultBall.length; i++) {
        sum = sum + Number(this.resultBall[i])
      }
      return sum
    }
  },
  watch: {
    // update amount of active plays
    'amount': function (amount) {
      _.each(this.plays, play => {
        if (play.active) {
          play.amount = amount
        }
      })
      // save it into localStorage
      localStorage.setItem('amount', amount)
    },
    // play object array for submit to API to place the order
    'playsForSubmit': function (plays) {
      this.totalAmount = _.reduce(plays, (sum, play) => {
        return sum + parseFloat(play.bet_amount)
      }, 0)
    },
    'rawAndFormatting': function () {
      if (this.raw.length && this.formatting.length) {
        this.playSections = formatPlayGroup(this.raw, this.formatting)
      }
    },
    'game': function (game) {
      this.updateBetrecords()
    }
  },
  created () {
    this.initPlaygroups()
    if (this.game) {
      this.updateBetrecords()
    }
    fetchGameResult(this.$route.params.gameId).then(
      result => {
        this.gameLatestResult = result[0]
      }
    )
  },
  methods: {
    getResultClass (resultNum) {
      let gameClass = `result-${this.gameLatestResult.game_code}`
      let resultClass = `resultnum-${resultNum}`
      return [gameClass, resultClass]
    },
    updateBetrecords () {
      this.$root.bus.$emit('new-betrecords', this.game.id)
    },
    beforeClose (done) {
      if (this.submitting) {
        return
      }
      this.errors = ''
      this.submitted = false
      return done()
    },
    placeOrder () {
      this.submitting = true
      this.errors = ''
      placeBet(this.playsForSubmit)
        .then(res => {
          this.submitting = false
          // TODO: update conditions
          if (res.data && res.data[0].member) {
            this.submitted = true
            setTimeout(() => {
              this.submitted = false
              this.dialogVisible = false
              this.updateBetrecords()
            }, 1000)
          } else {
            let messages = []
            res.msg.forEach(error => {
              messages.push(error)
            })
            this.errors = messages.join(', ')
          }
        })
    },
    initPlaygroups () {
      const categoryId = this.$route.params.categoryId
      fetchPlaygroup(categoryId).then(res => {
        let plays = {}
        res.forEach(item => {
          item.plays.forEach(play => {
            plays[play.id] = play
            plays[play.id]['group'] = item['display_name']
          })
        })
        this.raw = res
        this.plays = plays
        this.loading = false
      })
    },
    openDialog () {
      const validedPlays = _.filter(this.plays, play => play.active && parseFloat(play.amount) > 0)
      this.activePlays = _.values(validedPlays.map(play => {
        return {
          game_schedule: 10,
          display_name: `${play.group} - ${play.display_name}`,
          odds: play.odds,
          bet_amount: play.amount,
          id: play.id,
          bet_options: [],
          active: true
        }
      }))
      this.dialogVisible = true
    },
    getWidthForGroup (playSection) {
      // 0.01 is margin-right for each group
      return ((1 - (playSection.groupCol - 1) * 0.01) / playSection.groupCol) * 100 + '%'
    },
    updateAmount (amount) {
      this.amount = amount
    },
    toggleHover (play, value) {
      Vue.set(play, 'hover', value)
    },
    toggleActive (play, event) {
      if ((play.active && event.target.tagName === 'INPUT') || this.gameClosed) {
        return
      }
      Vue.set(play, 'active', !play.active)
      if (play.active) {
        play.amount = parseFloat(this.amount)
      } else {
        play.amount = ''
      }
    },
    reset () {
      _.each(this.plays, play => {
        if (play.active) {
          Vue.set(play, 'amount', '')
          Vue.set(play, 'active', false)
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
@import "../../style/vars.scss";
@import "../../style/resultsball.sass";

.name {
  font-weight: bold;
  line-height: $cell-height;
  border-right: $cell-border;
}
.odds {
  background-color: #fff;
  line-height: $cell-height;
  border-right: $cell-border;
  color: $red;
  font-weight: 700;
}
.input {
  background: #fff;
}
.el-input {
  width: 94%;
  padding: 0 3%;
}
.group-table {
  float: left;
  margin-right: 1%;
  &.last {
    margin-right: 0;
  }
}
.play-table {
  width: 100%;
  background: #ecf5ff;
  margin-bottom: 10px;
  border: $cell-border;
  td,
  th {
    border: $cell-border;
    height: $cell-height;
  }
  .group-name {
    line-height: $cell-height;
    text-align: center;
    font-weight: bold;
  }
  .hover {
    .name,
    .odds,
    .input {
      background: #dce5ef;
    }
  }
  .active {
    .name,
    .odds,
    .input {
      background: #f3dab2;
    }
  }
}
.clickable {
  cursor: pointer;
}
.amount {
  line-height: $cell-height;
  font-weight: 700;
}
.bet-amount {
  font-size: 14px;
  font-weight: 700;
}
.play-name {
  padding-left: 10px;
  font-weight: 700;
}
.actions {
  margin-bottom: 10px;
}
.summary {
  font-size: 12px;
  padding: 5px;
  margin: 10px 0;
  background: #f3f4f5;
  text-align: center;
}
.popup-actions {
  margin-top: 20px;
  text-align: center;
}

.result-balls {
  position: absolute;
  right: 0;
  button {
    float: right;
    position: relative;
    bottom: 5px;
    font-size: 12px;
  }
  span {
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
  }
}
</style>
