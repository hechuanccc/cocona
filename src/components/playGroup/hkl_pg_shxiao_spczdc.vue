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
            <span v-if="!gameClosed" class="odds">{{currentPlayOdds}}</span>
            <span v-else class="disabled">封盘</span>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="play-table">
      <tr>
        <td :colspan="customPlayGroup.cols" align="center">
          <div v-if="!gameClosed">请勾选</div>
          <div v-else>封盘</div>
        </td>
      </tr>
      <tr v-for="row in optionGroup" :key="row+'optionGroup'">
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
            <span :class="playgroup.code + '_' + option.num">{{zodiacs[option.num - 1].xiao}}</span>
          </el-col>
          <el-col :span="17" class="number" align="left">
            <span v-for="(zodiacNum, index) in formattedZodiacNum[option.num - 1]"
              :class="playgroup.code + '-zodiac-' + zodiacNum"
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
    formatting: {
      type: Object
    },
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
        result.push({
          num: n + (rows) * index,
          selected: false,
          hover: false,
          xiao: this.zodiacs[n + (rows) * index - 1].xiao
        })
        index++
      }
      return [result]
    })
    let activePlayId
    let plays = this.playgroup.plays
    if (plays[0] && plays[0].length) {
      activePlayId = plays[0][0].id
    }
    return {
      activePlayId,
      optionGroup,
      customPlayGroup,
      combinations: [],
      valid: false,
      currentPlay: {
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
    currentPlayOdds () {
      if (this.selectedOptions.length < 2) {
        return '--'
      }
      return this.currentPlay.odds
    },
    formattedZodiacNum () {
      return _.map(this.zodiacs, zodiac => zodiac.nums.split(','))
    }
  },
  watch: {
    'selectedOptions': function () {
      if (this.selectedOptions.length < 2) {
        this.updateForSubmit()
      }
      _.forEach(this.plays, (play) => {
        if (play.display_name.slice(-3, -1) === '' + (this.selectedOptions.length)) {
          this.currentPlay.odds = play.odds
          this.currentPlay.id = play.id
          this.currentPlay.display_name = play.display_name

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
      let numbers = this.selectedOptions.map(option => option.num)
      if (numbers.length > 1) {
        this.valid = true
      } else {
        this.valid = false
      }
      this.$emit('updatePlayForSubmit', {
        activePlayId: this.currentPlay.id,
        options: this.selectedOptions.join(','),
        selectedOptions: this.selectedOptions.map(option => this.zodiacs[option.num - 1].englishName),
        combinations: [''],
        valid: this.valid
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

.group-name {
  cursor: pointer;
}

.warn {
  color: $red
}
.odds {
  line-height: $cell-height;
  color: $red;
  text-align: center;
  display: block;
  font-weight: 700;
}
.disabled {
  color: #ccc;
  text-align: center;
  display: block;
}
.tbody {
  .odds{
    width: 100%;
  }
  td {
    width: 50%;
    text-align: center;
    font-weight: bold
  }
  background: #fff;
  cursor: pointer;
}
.option-td {
  cursor: pointer;
}
.checkbox {
  border-left: $cell-border;
}

</style>
