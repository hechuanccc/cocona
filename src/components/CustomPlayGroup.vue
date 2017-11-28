<template>
  <div>
    <table class="play-table" align="center" v-for="(playChunk, playChunkIndex) in playgroup.plays" >
      <tr>
        <td v-for="play in playChunk"  class="group-name" @click="activePlayId = play.id">
          <el-radio 
            name="radio"
            v-model="activePlayId"
            :label="play.id"
            key="'radio' + index">{{play.display_name}}</el-radio>
        </td>
      </tr>
      <tbody class="tbody">
        <tr>
          <td v-for="play in playChunk" @click="activePlayId = play.id">
            <span v-if="!gameClosed" class="odds">{{ play.odds }}</span>
            <span v-else class="disabled">封盘</span>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="play-table">
      <tr>
        <td :colspan="customPlayGroup.cols" align="center">
          <div v-if="combinations.length === 0">请选择</div>
          <div v-else >
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
      <tr v-for="row in optionGroup">
        <td 
          @click="selectOption(option, $event)"
          @mouseover="option.hover = true"
          @mouseleave="option.hover = false"
          v-for="option in row" 
          :width="(1 / customPlayGroup.cols) * 100 + '%'" align="center" :class="['option-td',
            {
              hover: option.hover,
              active: option.selected && !gameClosed
            }
          ]">
          <el-col :span="12" class="name">
            <span :class="playgroup.code + '_' + option.num">{{option.num}}</span>
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
    const optionGroup = _.flatMap(options.slice(0, rows), n => {
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
    }
  },
  methods: {
    calculateCombinations () {
      let numbers = this.selectedOptions.map(option => option.num)
      if (numbers.length > 1) {
        this.combinations = Combinatorics.combination(numbers, this.plays[this.activePlayId].options_count || 2).toArray()
        this.valid = true
      } else {
        this.valid = false
      }
      this.$emit('updatePlayForSubmit', {
        activePlayId: this.activePlayId,
        options: this.selectedOptions.join(','),
        combinations: this.combinations,
        selectedOptions: this.selectedOptions,
        valid: this.valid
      })
    },
    selectOption (option, event) {
      if (this.gameClosed) {
        return false
      }
      event.preventDefault()
      if (!option.selected) {
        // 7 is hard coded, will update it when API is done
        if (this.selectedOptions.length < 7) {
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
@import "../style/vars.scss";
@import "../style/gameplay.scss";

.group-name {
  cursor: pointer;
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
  width: 25%;
  display: inline-block;
  color: $red;
}
</style>
