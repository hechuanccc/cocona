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
    </el-row>
    <div v-for="(playSection, index) in playSections"
    class="clearfix"
    v-if="playSections.length">
      <div
        :style="{width: getWidthForGroup(playSection)}"
        v-for="(playgroup, playgroupIndex) in playSection.playgroups"
        :class="['group-table', playgroupIndex === playSection.playgroups.length - 1 ? 'last' : '']"
        >
        <table class="play-table" align="center" key="playgroup.code + index + '' + playgroupIndex"
          v-if="!getCustomFormatting(playgroup.code)">
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
        <component
          :is="chooseComponentByCode(playgroup.code)"
          :playReset="playReset"
          @updatePlayForSubmit="updateCustomPlays"
          :formatting="getCustomFormatting(playgroup.code)"
          :playgroup="playgroup"
          :plays="plays"
          :gameClosed="gameClosed"
          v-else />
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
            <span v-if="scope.row.isCustom" class="combinations-count">共 {{scope.row.combinations.length}} 组</span>
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
      <div v-if="activePlays.length && activePlays[0].isCustom" class="summary">
        共 {{ activePlays[0].combinations.length}} 组 总金额:
        <span class="red bet-amount">{{activePlays[0].bet_amount * activePlays[0].combinations.length}}</span>
      </div>
      <div class="summary" v-else>
        共 {{ playsForSubmit.length}} 组 总金额:
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
import '../../style/playicon.scss'
import { fetchPlaygroup, placeBet } from '../../api'
import { formatPlayGroup } from '../../utils'
import common from '../../components/playGroup/common'
import gd11x5Seq from '../../components/playGroup/gd11x5_pg_seq_seq'

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
  components: {
    common,
    gd11x5Seq
  },
  data () {
    return {
      playSections: [],
      loading: true,
      plays: {},
      amount: localStorage.getItem('amount') || '',
      // raw data in play group from API for generating playSections
      raw: [],
      dialogVisible: false,
      activePlays: [],
      totalAmount: 0,
      submitted: false,
      submitting: false,
      errors: '',
      playReset: false
    }
  },
  computed: {
    playsForSubmit () {
      return _.filter(this.activePlays, play => play.active).map(play => {
        return {
          game_schedule: this.scheduleId,
          bet_amount: parseFloat(play.bet_amount),
          play: play.id,
          bet_options: play.selectedOptions ? play.selectedOptions : []
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
  },
  methods: {
    // will be triggered by custom play components to recevie plays for submitting
    updateCustomPlays (playOptions) {
      _.each(this.plays, play => {
        // if all of the options are valid, change the target play's status
        if (play.id === playOptions.activePlayId && playOptions.valid) {
          this.$set(play, 'active', true)
          this.$set(play, 'amount', this.amount)
          this.$set(play, 'isCustom', true)
          this.$set(play, 'options', playOptions.options)
          this.$set(play, 'combinations', playOptions.combinations)
          this.$set(play, 'selectedOptions', playOptions.selectedOptions)
        } else {
          // if not, reset other plays
          this.$set(play, 'active', false)
          this.$set(play, 'isCustom', false)
          this.$set(play, 'options', '')
          this.$set(play, 'combinations', [])
          this.$set(play, 'selectedOptions', [])
        }
      })
    },
    getCustomFormatting (groupCode) {
      return _.find(this.$store.state.customPlayGroups, item => {
        return item.code === groupCode
      })
    },
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
              this.reset()
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
          active: true,
          isCustom: play.isCustom,
          combinations: play.combinations,
          selectedOptions: play.selectedOptions.map(option => option.num)
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

      Vue.set(this, 'playReset', !this.playReset)
    },
    chooseComponentByCode (code) {
      switch (code) {
        case 'gd11x5_pg_seq_seq':
          return 'gd11x5Seq'
        default:
          return 'common'
      }
    }
  }
}
</script>

<style scoped lang='scss'>
@import "../../style/vars.scss";
@import "../../style/gameplay.scss";

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
</style>
