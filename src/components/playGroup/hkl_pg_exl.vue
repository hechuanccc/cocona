<template>
  <table class="play-table" align="center">
    <tr v-if="!playgroup.alias">
      <th class="group-name" :colspan="formatting.cols">
        {{playgroup.length}}{{playgroup.display_name}}
      </th>
    </tr>
    <tr
      v-for="(optionChunk, optionChunkIndex) in optionGroupsView"
      :key="playgroup.name + 'optionChunk' + optionChunkIndex">
      <td
        v-for="option in optionChunk"
        :key="option.id"
        align="center"
        :class="['option-td',
              {
                hover: option.hover,
                active: option.selected && !gameClosed
              }
            ]"
        @mouseover="option.hover = true"
        @mouseleave="option.hover = false"
        @click="selectOption(option, $event)">
        <el-col :span="2" class="name">
          <span>{{option.display_name}}</span>
        </el-col>
        <el-col :span="15" class="number p-l">
          <span :class="['hkl_pg_exl', `hkl_pg_exl_${num}`]" v-for="(num,index) in option.value" :key="index">{{num}}</span>
        </el-col>
        <el-col :span="4" class="odds">
          {{ !gameClosed ? option.odds : '-'}}
        </el-col>
        <el-col :span="3" class="input">
          <el-checkbox v-model="option.selected" v-if="!gameClosed"></el-checkbox>
          <el-checkbox disabled v-else></el-checkbox>
        </el-col>
      </td>
      <td :colspan="formatting.cols - optionChunk.length" v-if="optionChunk.length < formatting.cols && optionChunkIndex === playgroup.plays.length - 1"></td>
    </tr>
  </table>
</template>
<script>
import _ from 'lodash'
import Combinatorics from 'js-combinatorics'
import { zodiacMap, tailMap } from '../../utils/hk6'
export default {
  name: 'hklPgExl',
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
  data () {
    return {
      optionGroups: [],
      optionGroupsView: [],
      specialOption: '',
      combinedOptions: [],
      valid: false
    }
  },
  created () {
    this.initOptionGroups()
  },
  computed: {
    selectedOptions () {
      return _.filter(this.optionGroups, option => option.selected)
    }
  },
  watch: {
    'selectedOptions': function (currentSelectedOptions) {
      this.calculateCombinations()
    },
    'playReset': function () {
      this.resetOption()
    },
    'playgroup': function (playgroup) {
      this.initOptionGroups()
    }
  },
  methods: {
    calculateCombinations () {
      let rules = this.playgroup.plays[0][0].rules
      if (rules && this.selectedOptions.length >= rules.min_opts) {
        this.combinedOptions = Combinatorics.combination(this.selectedOptions, rules.min_opts).toArray()
        this.valid = true
      } else {
        this.valid = false
      }

      let minName = this.specialOption.display_name
      let combinationGroups = {}
      _.each(this.combinedOptions, options => {
        let minOption = _.find(options, option => option.display_name === minName)
        if (!minOption) {
          minOption = options[0]
        }
        let minOptionId = minOption.id
        let combinations
        if (combinationGroups[minOptionId]) {
          combinations = combinationGroups[minOptionId]
        } else {
          combinations = []
          combinationGroups[minOptionId] = combinations
        }
        combinations.push(_.map(options, option => option.display_name))
      })
      this.$emit('updateMultiPlayForSubmit', {
        activePlayIds: Object.keys(combinationGroups),
        options: '',
        combinations: combinationGroups,
        selectedOptions: '',
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
      _.each(this.optionGroups, option => {
        this.$set(option, 'selected', false)
      })
    },
    initOptionGroups () {
      this.specialOption = this.playgroup.plays[0][0]
      let optionGroups = []
      let optionGroupsView = []
      let count = 0
      let diffOption
      _.each(this.playgroup.plays, plays => {
        const options = []
        optionGroupsView.push(options)
        _.each(plays, play => {
          if (count >= 0 && this.specialOption.odds !== play.odds) {
            count++
            if (count > 1) {
              diffOption = this.specialOption
            } else {
              diffOption = play
            }
          }
          let option = {
            id: play.id,
            odds: play.odds,
            display_name: play.display_name,
            value: zodiacMap[play.display_name] || tailMap[play.display_name],
            selected: false,
            hover: false
          }
          optionGroups.push(option)
          options.push(option)
        })
      })
      if (diffOption) {
        this.specialOption = diffOption
      }
      this.optionGroups = _.orderBy(optionGroups, ['id'])
      this.optionGroupsView = optionGroupsView
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
  max-width: 300px;
  display: inline-block;
  margin: 5px;
  color: $red;
}
.odds {
  &:nth-child(2) {
    border-left: 1px solid #ddd;
  }
}
</style>
