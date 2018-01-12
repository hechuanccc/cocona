<template>
  <div>
    <table class="play-table" align="center" >
      <tr class="group-name">
        <td>种类</td>
        <td>合肖</td>
      </tr>
      <tbody class="tbody">
        <tr>
          <td align="center">赔率</td>
          <td>
            <span v-if="!gameClosed" class="odds">{{activePlayOdds}}</span>
            <span v-else class="disabled">封盘</span>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="play-table">
      <tr class="group-name">
        <td :colspan="customPlayGroup.cols" align="center">
          <div v-if="!gameClosed">请勾选</div>
          <div v-else>封盘</div>
        </td>
      </tr>
      <tr v-for="row in optionGroup" :key="row+'optionGroup'" align="center">
        <td
          @click="selectOption(option, $event)"
          @mouseover="option.hover = true"
          @mouseleave="option.hover = false"
          v-for="option in row"
          :key="option+'in_row'"
          :width="(1 / customPlayGroup.cols) * 100 + '%'" align="center" :class="['option-td',
            {
              hover: option.hover,
              active: option.selected && !gameClosed
            }
          ]">
          <el-col :span="3" class="name">
            <span>
              <span :class="[playgroup.code + '-xiao-' + option.num]">{{zodiacs[option.num - 1].xiao}}</span>
            </span>
          </el-col>
          <el-col :span="17" class="number" align="center">
            <span v-for="(zodiacNum, index) in formattedZodiacNums[option.num - 1]"
              :class="['m-r-sm',playgroup.code , playgroup.code + '-zodiacnums-' + zodiacNum]"
              :key="index">
                {{zodiacNum}}
            </span>
          </el-col>
          <el-col :span="4" class="checkbox input">
            <el-checkbox v-model="option.selected" v-if="!gameClosed"></el-checkbox>
            <el-checkbox disabled v-else></el-checkbox>
          </el-col>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    playgroup: {
      type: Object
    },
    plays: {
      type: Object
    },
    gameClosed: {
      type: Boolean
    },
    playReset: {
      type: Boolean
    },
    zodiacs: {
      typr: Array
    }
  },
  name: 'hklPgShxiaoSpczdc',
  data () {
    const customPlayGroup = _.find(this.$store.state.customPlayGroups, item => {
      return item.code === this.playgroup.code
    })
    if (!customPlayGroup) {
      return []
    }
    const options = customPlayGroup.options
    const rows = Math.ceil(options.length / customPlayGroup.cols)
    const optionGroup = _.flatMap(options.slice(0, rows), n => {
      let index = 0
      let result = []
      while (index < customPlayGroup.cols) {
        let num = n + (rows) * index
        result.push({
          num: num,
          selected: false,
          hover: false,
          xiao: this.zodiacs[num - 1].xiao,
          englishName: this.zodiacs[num - 1].englishName
        })
        index++
      }
      return [result]
    })

    return {
      optionGroup,
      customPlayGroup,
      combinations: [],
      valid: false,
      activePlay: {
        id: '',
        display_name: '',
        odds: ''
      }
    }
  },
  computed: {
    selectedOptions () {
      return _.filter(_.flatten(this.optionGroup), option => {
        return option.selected
      })
    },
    activePlayOdds () {
      if (this.selectedOptions.length < 2) {
        return '--'
      }
      return this.activePlay.odds
    },
    formattedZodiacNums () {
      return _.map(this.zodiacs, zodiac => zodiac.nums.split(','))
    }
  },
  watch: {
    'selectedOptions': function () {
      if (this.selectedOptions.length < 2) {
        this.updateForSubmit()
        return
      }
      this.selectedOptions.sort((a, b) => { return a.num - b.num })
      _.forEach(this.plays, (play) => {
        if (play.display_name.slice(-3, -1) === '' + (this.selectedOptions.length)) {
          this.activePlay.odds = play.odds
          this.activePlay.id = play.id
          this.activePlay.display_name = play.display_name

          this.updateForSubmit()
        }
      })
    },
    'playReset': function () {
      _.flatten(this.optionGroup).forEach(option => {
        option.selected = false
      })
    }
  },
  methods: {
    updateForSubmit () {
      this.valid = this.selectedOptions.length > 1
      this.$emit('updatePlayForSubmit', {
        activePlayId: this.activePlay.id,
        selectedOptions: this.selectedOptions.map(option => {
          return {
            num: option.xiao
          }
        }),
        combinations: ['1'], // rules for ho_xiao is always 1 combination
        valid: this.valid,
        hasZodiacs: true
      })
    },
    selectOption (option, event) {
      if (this.gameClosed) {
        return false
      }
      event.preventDefault()
      if (!option.selected) {
        if (this.selectedOptions.length < 11) {
          option.selected = true
        }
      } else {
        option.selected = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/vars.scss";
@import "../../style/gameplay.scss";

.odds {
  line-height: $cell-height;
  color: $red;
  text-align: center;
  display: block;
  font-weight: 700;
  border: none;
}
.disabled {
  color: #ccc;
  text-align: center;
  display: block;
}
.tbody {
  .odds {
    width: 100%;
  }
  td {
    width: 50%;
    font-weight: bold;
  }
  background: #fff;
}
.option-td {
  cursor: pointer;
}
.checkbox {
  border-left: $cell-border;
}
</style>
