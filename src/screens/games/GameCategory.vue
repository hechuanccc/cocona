<template>
  <div>
    <el-row type="flex" class="actions" justify="center" :gutter="10">
      <el-col :span="1" class="amount">金额</el-col>
      <el-col :span="3">
        <el-input v-model="amount"/>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small">下单</el-button>
        <el-button type="info" size="small" @click="reset">重置</el-button>
      </el-col>
    </el-row>

    <div v-for="(playSection, index) in playSections" class="clearfix" v-if="playSections.length" >
      <div :style="{width: getWidthForGroup(playSection)}" v-for="(playgroup, playgroupIndex) in playSection.playgroups" :class="['group-table', playgroupIndex === playSection.playgroups.length - 1 ? 'last' : '']">
        <table class="play-table" align="center"  key="playgroup.code + index + '' + playgroupIndex">
          <tr>
            <th class="group-name" :colspan="playSection.playCol">{{playgroup.length}}{{playgroup.display_name}}</th>
          </tr>
          <tr v-for="(playChunk, playChunkIndex) in playgroup.plays">
            <td v-for="play in playChunk" align="center" :class="['clickable', 
              {
                hover: play.hover,
                active: play.active
              }]" @mouseover="toggleHover(play, true)" @mouseleave="toggleHover(play, false)" @click="toggleActive(play, $event)">
              <el-col :span="7" class="name">{{play.display_name}}</el-col>
              <el-col :span="7" class="odds">
                {{play.odds}}
              </el-col>
              <el-col :span="10" class="input" >
                <el-input size="mini" class="extramini" v-model="plays[play.id].amount" type="number" min="1" step="10"/>
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
        <el-input v-model="amount"/>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" size="small">下单</el-button>
        <el-button type="info" size="small" @click="reset">重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import '../../style/theme.scss'
import { fetchPlaygroup } from '../../api'
import { formatPlayGroup } from '../../utils'

export default {
  name: 'gameplay',
  data () {
    return {
      playSections: [],
      loading: true,
      plays: {},
      amount: '',
      raw: []
    }
  },
  computed: {
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
    'amount': function (amount) {
      _.each(this.plays, play => {
        if (play.active) {
          play.amount = amount
        }
      })
    },
    'rawAndFormatting': function () {
      if (this.raw.length && this.formatting.length) {
        this.playSections = formatPlayGroup(this.raw, this.formatting)
      }
    }
  },
  components: {
  },
  created () {
    const categoryId = this.$route.params.categoryId
    fetchPlaygroup(categoryId).then(res => {
      let plays = {}
      res.forEach(item => {
        item.plays.forEach(play => {
          plays[play.id] = play
        })
      })
      this.raw = res
      this.plays = plays
      this.loading = false
    })
  },
  methods: {
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
      if (play.active && event.target.tagName === 'INPUT') {
        return
      }
      let playForSubmit = this.plays[play.id]
      Vue.set(play, 'active', !play.active)
      Vue.set(playForSubmit, 'active', play.active)

      if (playForSubmit.active) {
        playForSubmit.amount = this.amount
      } else {
        playForSubmit.amount = ''
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
@import '../../style/vars.scss';

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
  td, th {
    border: $cell-border;
    height: $cell-height;
  }
  .group-name {
    line-height: $cell-height;
    text-align: center;
    font-weight: bold;
  }
  .hover {
    .name, .odds, .input {
      background: #DCE5EF;
    }
  }
  .active {
    .name, .odds, .input {
      background: #F3DAB2;
    }
  }
}
.clickable {
  cursor: pointer;
}
.amount {
  line-height: $cell-height;
  font-weight: 700
}
.actions {
  margin-bottom: 10px;
}
</style>
