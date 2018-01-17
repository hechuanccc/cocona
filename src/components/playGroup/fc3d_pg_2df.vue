<template>
  <div>
    <table class="play-table"
      align="center">
      <tr>
        <td class="group-name">种类</td>
        <td class="group-name">
          {{nowPlay.display_name}}
        </td>
      </tr>
      <tbody class="tbody">
        <tr>
          <td class="group-name">赔率</td>
          <td>
            <span v-if="!gameClosed" class="odds">{{ nowPlay.odds }}</span>
            <span v-else class="disabled">封盘</span>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="play-table"
      v-for="(optionGroup, index) in optionGroup"
      :key="index">
      <tr>
        <td :colspan="customPlayGroup.cols" align="center">
          <div>
            <span v-if="!gameClosed && nowPlay.rules.min_opts === 2">{{nowPlay.display_name[index]}}位</span>
            <span v-else-if="!gameClosed && nowPlay.rules.min_opts === 3">{{optionsTitle[index]}}位</span>
            <span v-else>封盘</span>
          </div>
        </td>
      </tr>
      <tr v-for="(row,index) in optionGroup"
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
    let optionGroup = []

    let n = customPlayGroup.code === 'fc3d_pg_2df' ? 2 : 3
    for (let i = 0; i <= n - 1; i++) {
      let raw = _.flatMap(options.slice(0, rows), n => {
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

      optionGroup.push(raw)
    }

    return {
      optionGroup,
      customPlayGroup,
      combinations: [],
      valid: false,
      optionsTitle: ['个', '拾', '佰']
    }
  },
  computed: {
    nowPlay () {
      return this.playgroup.plays[0][0]
    },
    selectedOptions () {
      let chosen = []

      _.each(this.optionGroup, (item) => {
        chosen.push(_.filter(_.flatten(item), option => { return option.selected }))
      })

      return chosen
    }
  },
  watch: {
    'selectedOptions': function () {
      this.calculateCombinations()
    },
    'nowPlay.id': function () {
      this.calculateCombinations()
    },
    'playReset': function () {
      _.each(this.optionGroup, (item) => {
        _.flatten(item).forEach(option => {
          option.selected = false
        })
      })

      this.combinations.length = 0
    }
  },
  methods: {
    calculateCombinations () {
      let positionNums = []
      _.each(this.selectedOptions, (item) => {
        positionNums.push(item.map(option => option.num))
      })

      let filtered = _.filter(this.selectedOptions, (i) => i.length === 0)
      if (filtered.length === 0) {
        this.combinations = Combinatorics.cartesianProduct(...positionNums).toArray()
        this.valid = true
      } else {
        this.combinations.length = 0
        this.valid = false
      }

      this.$emit('updatePlayForSubmit', {
        activePlayId: this.nowPlay.id,
        options: null,
        combinations: this.combinations,
        selectedOptions: null,
        valid: this.valid,
        showCombinationsPopover: false
      })
    },
    selectOption (option, event) {
      if (this.gameClosed) {
        return false
      }
      event.preventDefault()

      if (!option.selected) {
        option.selected = true
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
}
.option-td {
  cursor: pointer;
}
.checkbox {
  border-left: $cell-border;
}
.group-name.gd11x5-groupname /deep/ .el-radio__label {
  font-size: 12px;
}
</style>
