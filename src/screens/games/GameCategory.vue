
<template>
  <div>
    <el-row class="bet-area m-b-lg">
      <el-row type="flex" class="actions m-b" justify="center">
        <el-col :span="1" class="amount text-bold">金额</el-col>
        <el-col :span="3">
          <el-input v-model.number="amount" :min="1" type="number" @keypress.native="filtAmount" />
        </el-col>
        <el-col class="m-l-lg" :span="4">
          <el-button class="place-order-btn" type="primary" size="small" @click="handleBetClick" :disabled="gameClosed">下单</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </el-col>
      </el-row>
      <section class="cardresults-wrapper m-b"
        v-loading="!currentGameResult.issue_number"
        element-loading-text="等待开奖中"
        v-if="currentGameResult && (game.code === 'msnn' || game.code === 'pk10nn')">
        <CardResult :currentGameResult="currentGameResult"/>
      </section>
      <div v-for="(playSection, index) in playSections"
        class="clearfix"
        :key="playSection.id + 'playSection' + index"
        v-if="playSections.length">
        <ul v-if="getAliases(playSection).length" class="m-b-sm">
          <li
            :class="[{
              'active': playSection.playgroups[tabIndex].active
            }, 'alias-tabitem', 'clickable']"
            v-for="(alias, tabIndex) in getAliases(playSection)"
            :key="tabIndex"
            @click="selectAlias(playSection, tabIndex)">
            {{alias}}
          </li>
        </ul>
        <div
          :style="{ width: getWidthForGroup(playSection) }"
          v-for="(playgroup, playgroupIndex) in playSection.playgroups"
          :class="['group-table', {'last': (playgroupIndex + 1) % playSection.groupCol === 0}]"
          :key="'playgroup' + playgroup.id"
          v-if="playgroup.alias ? playgroup.active : true">
          <table class="play-table"
            align="center"
            key="playgroup.code + index + '' + playgroupIndex"
            v-if="!getCustomFormatting(playgroup.code)">
            <tr v-if="!playgroup.alias">
              <th class="group-name" :colspan="playSection.playCol">
                {{playgroup.length}}{{playgroup.display_name}}
                <span class="odd-tip" v-if="(game.code === 'msnn' || game.code === 'pk10nn')"
                  @mouseover="oddInstructionsBox.visible = true"
                  @mouseout="oddInstructionsBox.visible = false">
                  【赔率说明】
                  <div class="odd-instruction" v-show="oddInstructionsBox.visible">
                    <p>赔率说明</p>
                ①、下注会暂时冻结下注金额的5倍，例：下注1元，冻结4元，总金额5元。开奖后连本带利一并返还。<br>
                ②、赔率：无牛（1:2）、牛一至牛六（1:2）、牛七牛八（1:3）、牛九（1:4）、牛牛（1:6）以上赔率包含本金。<br>
                注：当庄与闲点数相等时，牛六以上的点数第一个球比大小，例：（庄：15462牛八，闲：46297牛八，4比1大，闲赢）。牛六以下（含牛六）庄赢。<br>
                ③、闲赢右上角会有个赢标志，输不会显示。<br>
                  </div>
                </span>
              </th>
            </tr>
            <tr
              v-for="(playChunk, playChunkIndex) in playgroup.plays"
              :key="playgroup.name + 'playChunk' + playChunkIndex">
              <td
                v-for="play in playChunk"
                :key="play.id + 'play'"
                align="center"
                :class="['clickable',
                  {
                    hover: plays[play.id] ? plays[play.id].hover : false,
                    active: plays[play.id] ? plays[play.id].active && !gameClosed : false
                  }]"
                @mouseover="toggleHover(play, true)"
                @mouseleave="toggleHover(play, false)"
                @click="toggleActive(plays[play.id], $event)"
                v-if="play.code">
                <el-col :span="play.value||needZodiac ? 2 : 6" class="name">
                  <span>
                    <span :class="play.value||needZodiac?'':[playgroup.code, play.code.replace(',', '')]">{{play.display_name}}</span>
                  </span>
                </el-col>
                <el-col v-if="play.value||needZodiac" :span="16" class="number">
                  <span :class="[playgroup.code, `${playgroup.code}_${num}`,'m-l-sm']" v-for="(num,index) in play.value||zodiacMap&&zodiacMap[play.display_name]" :key="index">{{num}}</span>
                </el-col>
                <el-col v-if="(game.code !== 'msnn' && game.code !== 'pk10nn')" :span="play.value||needZodiac ? 2 : 6" class="odds">
                  <span>{{ !gameClosed ? play.odds : '-'}}</span>
                </el-col>
                <el-col :span="play.value||needZodiac ? 4 : (game.code !== 'msnn' && game.code !== 'pk10nn') ? 12 : 18" class="input">
                  <el-input v-if="!gameClosed" size="mini" class="extramini" v-model="plays[play.id].amount" @keypress.native="filtAmount" type="number" min="1" step="10"
                  />
                  <el-input v-else size="mini" class="extramini" placeholder="封盘" disabled />
                </el-col>
              </td>
              <td :colspan="playSection.playCol - playChunk.length" v-if="playChunk.length < playSection.playCol"></td>
            </tr>
          </table>
          <component
            :is="$store.getters.customPlayGroupsById(playgroup.code)"
            :playReset="playReset"
            @updatePlayForSubmit="updateCustomPlays"
            @updateMultiPlayForSubmit="updateMultiCustomPlays"
            :formatting="getCustomFormatting(playgroup.code)"
            :playgroup="playgroup"
            :plays="plays"
            :gameClosed="gameClosed"
            :zodiacMap="zodiacMap"
            :gameCode="game.code"
            v-else />
        </div>
      </div>
       <el-row type="flex" class="actions" justify="center" v-if="!loading">
        <el-col :span="1" class="amount text-bold">金额</el-col>
        <el-col :span="3">
          <el-input v-model.number="amount" :min="1" type="number" @keypress.native="filtAmount"/>
        </el-col>
        <el-col class="m-l" :span="4">
          <el-button type="primary"
            class="place-order-btn"
            size="small"
            @click="handleBetClick"
            :disabled="gameClosed">下单</el-button>
          <el-button size="small" @click="reset">重置</el-button>
        </el-col>
      </el-row>
    </el-row>
    <el-dialog title="确认注单"
      width="45%"
      @close="beforeClose"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false">
      <el-table :data="activePlays" stripe max-height="350">
        <el-table-column property="display_name" label="内容" >
          <template slot-scope="scope">
            <span class="p-l">{{scope.row.display_name}}</span>
            <span v-if="scope.row.isCustom" class="combinations-count">共 {{scope.row.combinations.length}} 组</span>
            <div v-if="scope.row.optionDisplayNames" class="text-bold p-l"> 已选号码：{{scope.row.optionDisplayNames}} </div>
            <div v-if="scope.row.isCustom && showCombinationDetails">
              <el-popover
                ref="popover4"
                placement="bottom"
                title="已选組合"
                trigger="hover">
                <div :style="{
                      'width': scope.row.combinations.length * 100 + '%',
                      'max-width' : '480px'
                      }">
                    <span v-for="(detail, serial) in formattedCombinations" class="text-bold">
                      <el-tag type="info">{{Number(serial)+1}}: {{detail}}</el-tag>
                    </span>
                  </div>
              </el-popover>
              <el-button v-if="formattedCombinations && Object.keys(formattedCombinations).length" type="text" class="text-bold" v-popover:popover4>[查看明細]</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column property="odds" label="赔率" width="100">
          <template slot-scope="scope">
            <span class="red bet-amount text-bold">{{scope.row.odds}}</span>
          </template>
        </el-table-column>
        <el-table-column property="bet_amount" label="金额" width="150">
          <template slot-scope="scope">
            <el-input size="mini" v-model.number="scope.row.bet_amount" type="number" @keypress.native="filtAmount"></el-input>
          </template>
        </el-table-column>
        <el-table-column property="active" label="确认" width="100">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.active">确认</el-checkbox>
          </template>
        </el-table-column>
      </el-table>
      <div v-if="activePlays.length && activePlays[0].isCustom" class="summary text-center p-t p-b">
        共 {{ activePlays[0].combinations.length}} 组 总金额:
        <span class="red bet-amount text-bold">{{activePlays[0].bet_amount * activePlays[0].combinations.length}}</span>
      </div>
      <div class="summary m-b text-center p-t p-b" v-else>
        共 {{ playsForSubmit.bets.length }} 组 总金额:
        <span class="red bet-amount text-bold">{{totalAmount}}</span>
      </div>
      <el-alert v-if="errors" :title="errors" type="error" center :closable="false" show-icon>
      </el-alert>
      <div class="text-center" v-if="followBetCheckboxVisible">
        <el-checkbox v-model="followBetAllowed">将此笔注单分享至聊天室开放跟单</el-checkbox>
      </div>
      <div class="text-center m-t-lg" v-if="!submitted">
        <el-button size="medium" :loading="submitting" type="primary" :disabled="submitBtnDisabled" @click="placeOrder">确认</el-button>
        <el-button size="medium" @click="dialogVisible = false" :disabled="submitting">取消</el-button>
      </div>
      <el-alert v-else title="成功下单" type="success" center :closable="false" show-icon>
      </el-alert>
    </el-dialog>
  </div>
</template>


<script>
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import _ from 'lodash'
import '../../style/playicon.scss'
import { fetchPlaygroup, placeBet } from '../../api'
import { msgFormatter, formatPlayGroup, filtAmount } from '../../utils'
import { colorWave, tailMap } from '../../utils/hk6'
const common = (resolve) => require(['../../components/playGroup/common'], resolve)
const gd11x5Seq = (resolve) => require(['../../components/playGroup/gd11x5_pg_seq_seq'], resolve)
const hklPgShxiaoSpczdc = (resolve) => require(['../../components/playGroup/hkl_pg_shxiao_spczdc'], resolve)
const hklPgExl = (resolve) => require(['../../components/playGroup/hkl_pg_exl'], resolve)
const hklPgNtinfvrNum = (resolve) => require(['../../components/playGroup/hkl_pg_ntinfvr_num'], resolve)
const fc3dPg2df = (resolve) => require(['../../components/playGroup/fc3d_pg_2df'], resolve)
const fc3dPgIc = (resolve) => require(['../../components/playGroup/fc3d_pg_ic'], resolve)
const CardResult = (resolve) => require(['../../components/CardResult'], resolve)

const setActive = (play, amount) => {
  Vue.set(play, 'active', true)
  play.amount = amount
}
const reverseActive = (play, amount) => {
  if (play.active) {
    cancelActive(play)
  } else {
    setActive(play, amount)
  }
}
const cancelActive = (play) => {
  Vue.set(play, 'amount', '')
  Vue.set(play, 'active', false)
}

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
    },
    zodiacMap: {
      type: Object
    }
  },
  name: 'gameplay',
  components: {
    common,
    hklPgShxiaoSpczdc,
    gd11x5Seq,
    hklPgExl,
    hklPgNtinfvrNum,
    fc3dPg2df,
    fc3dPgIc,
    CardResult
  },
  data () {
    return {
      playSections: [],
      loading: true,
      plays: {},
      amount: localStorage.getItem('amount') || '10',
      // raw data in play group from API for generating playSections
      raw: [],
      dialogVisible: false,
      activePlays: [],
      totalAmount: 0,
      submitted: false,
      submitting: false,
      errors: '',
      playReset: false,
      showCombinationDetails: false,
      showCombinationsTips: false,
      followBetAllowed: true,
      followingBets: [],
      oddInstructionsBox: {
        visible: false
      },
      isCustomPlayGroup: false
    }
  },
  computed: {
    ...mapGetters([
      'planMakerMap'
    ]),
    ...mapState([
      'systemConfig',
      'chatRoom',
      'currentGameResult'
    ]),
    submitBtnDisabled () {
      let bettingArr = this.playsForSubmit.bets || this.playsForSubmit
      return !bettingArr.length
    },
    followBetCheckboxVisible () {
      if (this.game) {
        return this.planMakerMap[this.game.id] &&
        this.planMakerMap[this.game.id].isPlanMaker &&
        this.systemConfig.chatroomEnabled
      }
    },
    playsForSubmit () {
      let bettingArr = _.filter(this.activePlays, play => play.active && parseFloat(play.bet_amount) > 0).map(play => {
        return {
          game_schedule: this.scheduleId,
          bet_amount: parseFloat(play.bet_amount),
          play: play.id,
          bet_options: play.bet_options
        }
      })

      let isPlanMaker = this.game && this.planMakerMap[this.game.id] && this.planMakerMap[this.game.id].isPlanMaker
      if (this.followBetAllowed && isPlanMaker) {
        return {
          bets: bettingArr,
          send_bet_info: true
        }
      } else {
        return {
          bets: bettingArr,
          send_bet_info: false
        }
      }
    },
    formatting () {
      let category = this.$store.getters.categoriesById(this.$route.params.categoryId)
      return category ? category.formatting : []
    },
    // just to trigger watcher below
    rawAndFormatting () {
      return this.raw && this.formatting && (this.raw.length + this.formatting.length)
    },
    formattedCombinations () {
      let formattedDetails = {}
      _.each(this.activePlays, (activePlay) => {
        _.each(Object.keys(this.plays[activePlay.id].combinations), (key) => {
          formattedDetails[key] = this.plays[activePlay.id].combinations[key]
        })
      })
      return formattedDetails
    },
    currentAlias () {
      for (const section of this.playSections) {
        for (const group of section.playgroups) {
          if (group.active) {
            return group.alias
          }
        }
      }
      return ''
    },
    currentCategory () {
      return this.$store.getters.categoriesById(this.$route.params.categoryId)
    },
    needZodiac () {
      const code = this.currentCategory.code
      // 正肖 合肖 特肖 连肖连尾
      return code.endsWith('txiao') || code.endsWith('shxia') || code.endsWith('ishaw') || code.endsWith('exl') || code.endsWith('pxxm')
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
    'playsForSubmit': {
      handler: function () {
        let plays = this.playsForSubmit.bets || this.playsForSubmit
        this.totalAmount = _.reduce(plays, (sum, play) => {
          return sum + parseFloat(play.bet_amount)
        }, 0)
      },
      deep: true
    },
    'rawAndFormatting': function () {
      if (this.raw.length && this.formatting.length) {
        this.playSections = formatPlayGroup(this.raw, this.formatting)
      }
    },
    'activePlays': {
      handler: function () {
        _.each(this.activePlays, (play) => {
          if (!parseFloat(play.bet_amount)) {
            play.active = false
          }
        })
      },
      deep: true
    }
  },
  created () {
    this.initPlaygroups()
    this.$root.bus.$on('openBetDialog', (gameData) => {
      this.openDialog()
    })

    this.$root.bus.$on('followBet', (bets) => {
      this.followingBets = bets
      this.$nextTick(() => {
        this.activePlays = this.followingBets.map((bet) => {
          let isCustom = this.isCustomPlayGroup
          let combos = bet.bet_options.opts_combos_count || 0
          isCustom = combos > 1
          return {
            game_schedule: 10,
            display_name: `${bet.play.display_name ? bet.play.display_name + '-' : ''}${bet.play.playgroup}`,
            odds: bet.play.odds,
            bet_amount: isCustom ? (bet.bet_amount / combos) : bet.bet_amount,
            id: bet.play.id,
            bet_options: bet.bet_options,
            active: true,
            isCustom,
            combinations: new Array(combos),
            optionDisplayNames: bet.bet_options.options ? bet.bet_options.options.join(',') : ''
          }
        })
      })
      if (this.followBetCheckboxVisible) {
        this.followBetAllowed = false
      }

      this.openDialog()
    })
  },
  methods: {
    filtAmount,
    selectAlias (playSection, tabIndex) {
      let activePlaygroup = _.find(playSection.playgroups, playgroup => playgroup.active)
      // reset 'active' for plays in inactive playgroups
      _.each(_.filter(this.plays, play => play.active && play.alias === activePlaygroup.alias), play => {
        this.$set(play, 'active', false)
        this.$set(play, 'amount', '')
      })
      // switch 'active' between play groups
      _.map(playSection.playgroups, (playgroup, index) => {
        this.$set(playgroup, 'active', index === tabIndex)
      })
      this.$emit('clearShortCut')
    },
    getAliases (section) {
      let aliases = _.map(section.playgroups, playgroup => playgroup.alias)
      return aliases[0] ? aliases : []
    },
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
          this.$set(this, 'showCombinationDetails', playOptions.showCombinationsPopover)
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
    updateMultiCustomPlays (playOptions) {
      _.each(this.plays, play => {
        // if all of the options are valid, change the target play's status
        if (playOptions.activePlayIds.includes('' + play.id) && playOptions.valid) {
          this.$set(play, 'active', true)
          this.$set(play, 'amount', this.amount)
          this.$set(play, 'isCustom', true)
          this.$set(play, 'options', playOptions.options)
          this.$set(play, 'combinations', playOptions.combinations['' + play.id])
          this.$set(play, 'selectedOptions', playOptions.selectedOptions)
          this.$set(play, 'hideName', true)
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
      let getCustom = _.find(this.$store.state.customPlayGroups, item => {
        return item.code === groupCode
      })
      this.isCustomPlayGroup = !!getCustom
      return getCustom
    },
    updateBetrecords () {
      this.$root.bus.$emit('new-betrecords', {
        gameId: this.game.id,
        scheduleId: this.scheduleId
      })
    },
    beforeClose () {
      if (this.submitting) {
        return
      }
      this.errors = ''
      this.submitted = false
      this.followingBets = []
    },
    placeOrder () {
      if (this.submitting) {
        return
      }
      this.submitting = true
      this.errors = ''
      placeBet(this.playsForSubmit)
        .then(res => {
          window.gtag('event', '投注', {'event_category': '遊戲投注', 'event_label': this.game.display_name})
          this.submitting = false
          // TODO: update conditions
          this.$store.dispatch('fetchUser')
          if (res && res[0].member) {
            this.submitted = true
            setTimeout(() => {
              this.submitted = false
              this.dialogVisible = false
              this.updateBetrecords()
              if (!this.followingBets.length) {
                this.reset()
              }
            }, 1000)
          } else {
            let messages = []
            res.msg.forEach(error => {
              messages.push(error)
            })
            this.errors = messages.join(', ')
          }
        },
        errRes => {
          this.submitting = false
          this.errors = msgFormatter(errRes)
          setTimeout(() => {
            this.dialogVisible = false
          }, this.errors && this.errors.length > 20 ? 5000 : 3000)
        })
    },
    initPlaygroups () {
      const categoryId = this.$route.params.categoryId
      fetchPlaygroup(categoryId).then(res => {
        let plays = {}
        if (res.length === 0) {
          let gameId = this.$route.params.gameId
          const categories = this.$store.getters.categoriesByGameId(gameId)
          if (!categories.length) {
            this.$store.dispatch('fetchCategories', gameId).then((res) => {
              this.$router.replace(`/game/${gameId}/${res[0].id}`)
            })
          } else {
            this.$router.replace(`/game/${gameId}/${categories[0].id}`)
          }
          return
        }
        res.forEach(item => {
          item.plays.forEach(play => {
            plays[play.id] = play
            plays[play.id]['group'] = item['display_name']
            if (item.code === 'hkl_pg_clrwvs_color' || item.code === 'luckl_pg_clrwvs_color') {
              plays[play.id]['value'] = colorWave[play.code]
            } else if (item.code === 'hkl_pg_pxxmtail' || item.code === 'luckl_pg_pxxmtail') {
              plays[play.id]['value'] = tailMap[play.display_name]
            }
          })
        })
        this.raw = res
        this.plays = plays
        this.loading = false
      })
    },
    handleBetClick () {
      if (this.followBetCheckboxVisible) {
        this.followBetAllowed = true
      }
      this.openDialog()
    },
    openDialog () {
      const validedPlays = _.flatMap(
        _.filter(this.plays, play => play.active && parseFloat(play.amount) > 0),
        play => {
          if (play.combinations && !play.selectedOptions) {
            return _.map(play.combinations, combination => {
              return {
                ...play,
                combinations: combination
              }
            })
          } else {
            return [play]
          }
        }
      )

      this.activePlays = _.values(validedPlays.map(play => {
        let betOptions
        let isCustom = play.isCustom
        let optionDisplayNames = []
        if (play.selectedOptions) {
          let options = []
          _.each(play.selectedOptions, option => {
            options.push(option.num)
            optionDisplayNames.push(option.displayName || option.num)
          })
          betOptions = { options: options }
        } else if (play.combinations) {
          isCustom = false
          betOptions = { options: play.combinations }
          optionDisplayNames = [...play.combinations]
        } else {
          betOptions = {}
        }
        if (optionDisplayNames.length > 0) {
          optionDisplayNames = optionDisplayNames.join(',')
        } else {
          optionDisplayNames = ''
        }

        let forShow = ''

        if (play.hideName) {
          forShow = play.group
        } else {
          if (play.alias) {
            if (play.alias === play.display_name) {
              forShow = `${play.group} - ${play.alias}`
            } else {
              forShow = `${play.alias} - ${play.display_name}`
            }
          } else {
            forShow = `${play.group} - ${play.display_name}`
          }
        }

        return {
          game_schedule: 10,
          display_name: forShow,
          odds: play.odds,
          bet_amount: play.amount,
          id: play.id,
          bet_options: betOptions,
          active: true,
          isCustom,
          combinations: play.combinations,
          optionDisplayNames: optionDisplayNames
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
      this.$emit('clearShortCut')
    },
    triggerShortcut (option) {
      const command = option.command
      const amount = parseFloat(this.amount)
      let handleplay
      switch (command) {
        case 'all':
          handleplay = setActive
          break
        case 'reverse':
          handleplay = reverseActive
          break
        case 'cancel':
          handleplay = cancelActive
          this.$emit('clearShortCut')
          break
        default:
          handleplay = (play) => {
            if (option.num.includes(play.display_name)) {
              Vue.set(play, 'active', true)
              play.amount = amount
            } else {
              Vue.set(play, 'amount', '')
              Vue.set(play, 'active', false)
            }
          }
      }
      _.each(this.plays, play => {
        if ((!this.currentAlias && play.group === '号码') || play.alias === this.currentAlias) {
          handleplay(play, amount)
        }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
@import "../../style/vars.scss";
@import "../../style/gameplay.scss";

.alias-tabitem {
  margin-right: -1px;
  display: inline-block;
  padding: 5px 15px;
  background: #fff;
  color: #666;
  border: 1px solid #dedede;
  &.active {
    border: 1px solid $primary;
    background: $primary;
    color: #fff;
  }
}

.amount {
  line-height: $cell-height;
}

.bet-amount {
  font-size: 14px;
}

.bet-area {
  background: #fff;
  padding: 10px;
}

.summary {
  font-size: 12px;
  padding: 5px;
  background: #f3f4f5;
}

.el-input /deep/ .el-input__inner{
  height: 30px;
  border: solid 1px #c8c8c8;
}

.extramini  /deep/ .el-input__inner {
  width: 90%;
  height: 26px;
}

.cardresults-wrapper {
  width: 100%;
  height: 145px;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ddd;
  background-color: #ecf5ff;
  z-index: 2;

}

.odd-tip {
  position: relative;
}

.odd-instruction {
  position: absolute;
  left: 0;
  width: 600px;
  padding: 5px;
  border: 1px solid #ddd;
  background: azure;
  text-align: left;
  z-index: 2;
  line-height: 20px;
}
</style>

