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
      <tr v-if="combinations.length !== 0">
        <td :colspan="customPlayGroup.cols" align="center">
          <div>
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
      <template v-for="(views,index) in showOptionGroupViews">
        <tr>
          <td :colspan="customPlayGroup.cols" align="center">
            <div>{{`第${index+1}球`}}</div>
          </td>
        </tr>
        <tr v-for="row in views">
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
              <span>
                <span :class="playgroup.code + '_' + option.num">{{option.num}}</span>
              </span>
            </el-col>
            <el-col :span="12" class="checkbox input">
              <el-checkbox v-model="option.selected" v-if="!gameClosed&&!option.disabled"></el-checkbox>
              <el-checkbox disabled v-else></el-checkbox>
            </el-col>
          </td>
        </tr>
      </template>
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
  name: 'gd11x5Seq',
  data () {
    const customPlayGroup = _.find(this.$store.state.customPlayGroups, item => {
      return item.code === this.playgroup.code
    })
    if (!customPlayGroup) {
      return []
    }

    const optionGroups = [[], [], []]
    const optionGroupViews = [[], [], []]

    const options = customPlayGroup.options
    const rows = Math.ceil(options.length / customPlayGroup.cols)
    optionGroups.forEach((optionGroup, index) => {
      optionGroupViews[index] = _.flatMap(options.slice(0, rows), n => {
        let index = 0
        let result = []
        while (index < customPlayGroup.cols) {
          let num = customPlayGroup.cols * n + index + 1
          if (num > 11) {
            break
          }

          let option = {
            num: num,
            selected: false,
            hover: false,
            disabled: false
          }
          result.push(option)
          optionGroup.push(option)
          index++
        }
        return [result]
      })
    })

    let activePlayId = ''
    let plays = this.playgroup.plays
    if (plays[0] && plays[0].length) {
      activePlayId = plays[0][0].id
    }
    return {
      activePlayId,
      optionGroups,
      optionGroupViews,
      customPlayGroup,
      combinations: [],
      valid: false
    }
  },
  computed: {
    showOptionGroupViews () {
      return this.optionGroupViews.slice(0, this.plays[this.activePlayId].rules.min_opts)
    },
    selectedOptions () {
      return _.map(this.optionGroups, group => {
        return _.filter(group, option => {
          return option.selected
        })
      }).filter(group => group.length > 0)
    },
    selectedNums () {
      return _.map(_.flatten(this.selectedOptions), option => option.num)
    }
  },
  watch: {
    'selectedOptions': function () {
      this.calculateCombinations()
    },
    'activePlayId': function () {
      this.resetOption()
      this.combinations = []
      this.calculateCombinations()
    },
    'selectedNums': function (currentSelectedOptions) {
      _.each(this.optionGroups, group => {
        _.each(group, option => {
          if (currentSelectedOptions.includes(option.num)) {
            if (!option.selected) {
              this.$set(option, 'disabled', true)
            }
          } else {
            this.$set(option, 'disabled', false)
          }
        })
      })
    },
    'playReset': function () {
      this.resetOption()
    }
  },
  methods: {
    calculateCombinations () {
      let selectedOptionNumbers = _.map(this.selectedOptions, options => {
        return _.map(options, option => option.num)
      })

      if (selectedOptionNumbers.length === this.showOptionGroupViews.length) {
        this.combinations = Combinatorics.cartesianProduct.apply(Combinatorics, selectedOptionNumbers).toArray()
        this.valid = true
      } else {
        this.combinations = []
        this.valid = false
      }
      this.$emit('updatePlayForSubmit', {
        activePlayId: this.activePlayId,
        options: null,
        combinations: this.combinations,
        selectedOptions: null,
        valid: this.valid
      })
    },
    selectOption (option, event) {
      if (this.gameClosed || option.disabled) {
        return false
      }
      event.preventDefault()
      if (!option.selected) {
        option.selected = true
      } else {
        option.selected = false
      }
    },
    resetOption () {
      _.each(this.optionGroups, options => {
        _.each(options, option => {
          this.$set(option, 'selected', false)
          this.$set(option, 'disabled', false)
        })
      })
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
