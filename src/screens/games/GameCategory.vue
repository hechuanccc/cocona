<template>
  <div>
    <el-row type="flex" class="actions" justify="center" :gutter="10">
      <el-col :span="1" class="amount">金额</el-col>
      <el-col :span="3">
        <el-input v-model="amount"/>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" size="small">下单</el-button>
        <el-button type="info" size="small">重置</el-button>
      </el-col>
    </el-row>
    
    <div v-for="playgroup in playgroups" class="clearfix" v-if="playgroups.length">
      <table class="play-table" align="center">
        <tr>
          <th class="group-name" colspan="4">{{playgroup.display_name}}</th>
        </tr>
        <tr v-for="(playChunk, index) in playgroup.plays" key="playgroup.code + index">
          <td v-for="play in playChunk" width="25%" align="center" :class="['clickable', 
            {
              hover: play.hover,
              active: play.active
            }]" @mouseover="toggleHover(play, true)" @mouseleave="toggleHover(play, false)" @click="toggleActive(play)">
            <el-col :span="7" class="name">{{play.display_name}}</el-col>
            <el-col :span="7" class="odds">
              {{play.odds}}
            </el-col>
            <el-col :span="10" class="input" >
              <el-input size="mini" class="extramini" v-model="plays[play.id].amount" type="number" min="1" step="10"/>
            </el-col>
          </td>
          <td colspan="4 - playChunk.length" v-if="index === playgroup.plays.length - 1"></td>
        </tr>
      </table>
    </div>

    <el-row type="flex" class="actions" justify="center" :gutter="10" v-if="!this.loading">
      <el-col :span="1" class="amount">金额</el-col>
      <el-col :span="3">
        <el-input v-model="amount"/>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" size="small">下单</el-button>
        <el-button type="info" size="small">重置</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import '../../style/theme.scss'
import { fetchPlaygroup } from '../../api'
import { unionChunked } from '../../utils'

export default {
  name: 'gameplay',
  data () {
    return {
      playgroups: [],
      loading: true,
      plays: {},
      amount: ''
    }
  },
  watch: {
    'amount': function (amount) {
      _.each(this.plays, play => {
        if (play.active) {
          play.amount = amount
        }
      })
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
      this.plays = plays
      this.playgroups = unionChunked(res, 'display_name', 'plays', 4)
      this.loading = false
    })
  },
  methods: {
    toggleHover (play, value) {
      Vue.set(play, 'hover', value)
    },
    toggleActive (play) {
      Vue.set(play, 'active', !play.active)
      let playForSubmit = this.plays[play.id]
      Vue.set(playForSubmit, 'active', play.active)
      if (playForSubmit.active) {
        playForSubmit.amount = this.amount
      } else {
        playForSubmit.amount = ''
      }
    }
  }
}
</script>

<style scoped lang='scss'>
$cell-height: 34px;
$cell-border: 1px solid #cdcdcd;
$red: #FA5555;

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
.play-table {
  background: #ecf5ff;
  width: 100%;
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
