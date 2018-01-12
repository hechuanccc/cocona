<template>
  <div>
    <table class="play-table" align="center" v-if="hasDifferentOddsInOnePlay">
      <tr>
        <td  v-for="play in formattedPlays"
          :key="play.code + '-play-' + play.id"
          class="group-name"
          @click="activePlayId = play.id">
          <el-radio
            name="radio"
            v-model="activePlayId"
            :label="play.id"
            key="'radio' + index"
            :disabled="gameClosed">
            {{play.display_name}}
          </el-radio>
        </td>
      </tr>
      <tbody class="tbody">
        <tr>
          <td v-for="plays in playGroupPlays"
            :key = "plays[0].id"
            v-if="!gameClosed">
            <span v-for="sameIdPlay in plays"
              :key= "sameIdPlay.code+'-pl-'+sameIdPlay.id"
              class="odds"
              @click="activePlayId = sameIdPlay.id"
              :disabled="gameClosed"
              :style="{
                'width':1 / plays.length * 99+'%',
                'display':'inline-block'
              }">
                {{ sameIdPlay.odds }}
            </span>
          </td>
          <td v-else><span class="disabled">封盘</span></td>
        </tr>
      </tbody>
    </table>
    <table class="play-table"
      align="center"
      v-for="(playChunk, playChunkIndex) in playgroup.plays"
      :key="playChunk.code + '-playChunk-' + playChunkIndex"
       v-else>
      <tr>
        <td v-for="play in playChunk"
          :key="play.code + '-play-' + play.id"
          :class="['group-name', {'gd11x5-groupname': play.code.indexOf('gd11x5_pl_wc_wc')!== -1}]"
          @click="activePlayId = play.id">
          <el-radio
            name="radio"
            v-model="activePlayId"
            :label="play.id"
            style="font-size: 12px"
            key="'radio' + index">{{play.display_name}}</el-radio>
        </td>
      </tr>
      <tbody class="tbody">
        <tr>
          <td v-for="play in playChunk"
            @click="activePlayId = play.id"
            :key="play.code+'-pl-'+play.id">
            <span v-if="!gameClosed" class="odds">{{ play.odds }}</span>
            <span v-else class="disabled">封盘</span>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="play-table">
      <tr>
        <td :colspan="customPlayGroup.cols" align="center">
          <div v-if="combinations.length === 0">
            <span v-if="!gameClosed">请选择</span>
            <span v-else>封盘</span>
          </div>
          <div v-else>
            已选择
            <el-popover
              ref="popover"
              placement="bottom"
              :title="'已选择 ' + combinations.length + ' 组'"
              width="300"
              trigger="hover">
              <ul class="combinations">
                <li v-for="combination in combinations">[{{combination.join(', ')}}]</li>
              </ul>
            </el-popover>
            <el-button v-popover:popover size="mini" round type="info">
              {{combinations.length}} 组
            </el-button>
          </div>
        </td>
      </tr>
      <tr
        v-for="(row,index) in optionGroup"
        :key="'row'+index">
        <td
          @click="selectOption(option, $event)"
          @mouseover="option.hover = true"
          @mouseleave="option.hover = false"
          v-for="option in row"
          :key="option.num + 'option'"
          :width="(1 / customPlayGroup.cols) * 100 + '%'" align="center" :class="['option-td',
            {
              hover: option.hover,
              active: option.selected && !gameClosed
            }
          ]">
          <el-col :span="12" class="name">
            <span>
              <span :class="[playgroup.code, playgroup.code + '_' + option.num]">{{option.num}}</span>
            </span>
          </el-col>
          <el-col :span="12" class="checkbox input">
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
import Combinatorics from 'js-combinatorics'
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
    }
  },
  name: 'customPlaygroup',
  data () {
    const customPlayGroup = _.find(this.$store.state.customPlayGroups, item => {
      return item.code === this.playgroup.code
    })
    if (!customPlayGroup) {
      return []
    }
    const options = customPlayGroup.options
    const rows = Math.ceil(options.length / customPlayGroup.cols)

    let optionGroup
    if (customPlayGroup.transpose) {
      const cols = customPlayGroup.cols
      optionGroup = _.flatMap(options.slice(0, rows), n => {
        let index = 0
        let result = []
        while (index < cols) {
          let num = n * cols + index + 1
          if (num > options.length) {
            break
          }
          result.push({
            num: num,
            selected: false,
            hover: false
          })
          index++
        }
        return [result]
      })
    } else {
      optionGroup = _.flatMap(options.slice(0, rows), n => {
        let index = 0
        let result = []
        while (index < customPlayGroup.cols) {
          result.push({
            num: n + (rows) * index,
            selected: false,
            hover: false
          })
          index++
        }
        return [result]
      })
    }

    let activePlayId = ''
    let plays = this.playgroup.plays
    if (plays[0] && plays[0].length) {
      activePlayId = plays[0][0].id
    }
    return {
      activePlayId,
      optionGroup,
      customPlayGroup,
      combinations: [],
      valid: false
    }
  },
  computed: {
    selectedOptions () {
      return _.filter(_.flatten(this.optionGroup), option => {
        return option.selected
      })
    },
    formattedPlays () {
      let formatted = []
      _.forEach(Object.keys(this.plays), (play) => {
        formatted.push(this.plays[play])
      })
      return formatted
    },
    hasDifferentOddsInOnePlay () {
      let playsArray = []
      _.each(this.plays, (value, key) => {
        playsArray.push(value)
      })

      return _.flatten(this.playgroup.plays).length > playsArray.length
    },

    playGroupPlays () {
      let formatted = _.flatten(this.playgroup.plays).reduce((origin, next) => {
        let index = _.findIndex(origin, item => item.some(element => element.id === next.id))
        index >= 0 ? origin[index].push(next) : origin.push([next])
        return origin
      }, [])
      formatted.sort((a, b) => {
        return a[0].id - b[0].id
      })
      return formatted
    }
  },
  watch: {
    'selectedOptions': function () {
      this.calculateCombinations()
    },
    'activePlayId': function () {
      _.map(_.flatten(this.optionGroup), option => {
        this.$set(option, 'selected', false)
      })
      this.combinations = []
      this.calculateCombinations()
    },
    'playReset': function () {
      _.flatten(this.optionGroup).forEach(option => {
        option.selected = false
      })
      this.combinations.length = 0
    }
  },
  methods: {
    calculateCombinations () {
      let numbers = this.selectedOptions.map(option => option.num)
      let rules = this.plays[this.activePlayId].rules
      if (rules && numbers.length >= rules.min_opts) {
        this.combinations = Combinatorics.combination(numbers, rules.min_opts).toArray()
        this.valid = true
      } else {
        this.combinations.length = 0
        this.valid = false
      }
      this.$emit('updatePlayForSubmit', {
        activePlayId: this.activePlayId,
        options: this.selectedOptions.join(','),
        combinations: this.combinations,
        selectedOptions: this.selectedOptions,
        valid: this.valid,
        showCombinationsPopover: this.hasDifferentOddsInOnePlay
      })
    },
    selectOption (option, event) {
      if (this.gameClosed) {
        return false
      }
      event.preventDefault()
      let rules = this.plays[this.activePlayId].rules
      if (!option.selected && rules) {
        // 7 is hard coded, will update it when API is done
        if (this.selectedOptions.length < rules.max_opts) {
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
.odds {
  line-height: $cell-height;
  color: $red;
  text-align: center;
  display: block;
  font-weight: 700;
  height: auto;
  border: none;
}
.disabled {
  color: #ccc;
  text-align: center;
  display: block;
}
.tbody {
  background: #fff;
  cursor: pointer;
}
.option-td {
  cursor: pointer;
}
.checkbox {
  border-left: $cell-border;
}
.combinations li {
  max-width: 300px;
  display: inline-block;
  margin: 5px;
  color: $red;
}
.odds {
  &:nth-child(2) {
    border-left: 1px solid #ddd
  }
}
.group-name.gd11x5-groupname /deep/ .el-radio__label {
  font-size: 12px;
}
</style>
