<template>
  <el-row class="row-bg">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('navMenu.game_intro')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row class="rules-container">
        <el-col :span="3">
          <el-menu default-active="0" class="el-menu-vertical-demo">
            <el-menu-item v-for="(game, index) in games"
              :key="game.id"
              :index="index+''"
              @click="currentGame = game">
              <span slot="title">{{game.display_name}}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="21" class="p-l-lg p-t">
          <h1 class="main-title m-b-lg">{{currentGame.display_name}}</h1>
          <h2 class="sub-title">{{$t('gameIntro.gameinfo')}}</h2>
          <el-table class="m-b-lg" v-loading="loading" :data="currentPlaySettings" stripe>
            <el-table-column :label="''"
              prop="display_name">
            </el-table-column>
            <el-table-column :label="$t('gameIntro.odds')"
              prop="odds">
            </el-table-column>
            <el-table-column :label="$t('gameIntro.return_rate')"
              prop="return_rate">
            </el-table-column>
            <el-table-column :label="$t('gameIntro.min_per_bet')">
              <template slot-scope="scope">
                <span>{{ scope.row.min_per_bet | currency('￥')}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('gameIntro.max_per_bet')">
              <template slot-scope="scope">
                <span>{{ scope.row.max_per_bet | currency('￥')}}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('gameIntro.max_per_draw')">
              <template slot-scope="scope">
                <span>{{ scope.row.max_per_draw | currency('￥')}}</span>
              </template>
            </el-table-column>
          </el-table>
          <h2 class="sub-title">{{$t('gameIntro.rule')}}</h2>
          <component :is="currentGame.code"></component>
        </el-col>
      </el-row>
    </div>
  </el-row>
</template>

<style lang="scss">
@import "../../style/vars.scss";
$common-pixel: 10px !default;
$title-size: 18px !default;
$title-color: black !default;
.main-title {
  font-size: $title-size;
  color: $title-color;
}
.sub-title {
  font-size: 14px;
  margin-bottom: $common-pixel;
  color: $title-color;
}
.rules-container {
  background-color: white;
  height: 100%;
  min-height: 100vh;
}

.rule-details {
  $lg: $common-pixel * 2 !default;
  $sm: $common-pixel * 1/2 !default;
  $text-size: 13px !default;
  $text-color: #666 !default;
  font-size: $text-size;
  color: $text-color;
  h1 {
    font-size: $title-size;
    margin-bottom: $common-pixel;
    color: $title-color;
  }
  h2 {
    margin-bottom: $common-pixel;
  }
  h3 {
    margin-bottom: $sm;
  }
  .warn {
    color: $red;
  }
  ul {
    margin: $sm auto;
  }
  li {
    margin: $sm 0;
    list-style: initial;
    margin-left: $lg;
  }
}
</style>

<script>
import { fetchGames, fetchPlaySetting } from '../../api'
import cqlf from './rules/cqlf'
import gd11x5 from './rules/gd11x5'
import jsk3 from './rules/jsk3'
import mlaft from './rules/mlaft'
import gdklsf from './rules/gdklsf'
import bcr from './rules/bcr'
import jsssc from './rules/jsssc'
import jspk10 from './rules/jspk10'
import cqssc from './rules/cqssc'
import pcdd from './rules/pcdd'
import hkl from './rules/hkl'
import xjssc from './rules/xjssc'
import tjssc from './rules/tjssc'
import bjkl8 from './rules/bjkl8'
import er75ft from './rules/er75ft'

export default {
  name: 'gameIntros',
  components: {
    cqlf,
    gd11x5,
    jsk3,
    mlaft,
    gdklsf,
    bcr,
    jsssc,
    jspk10,
    cqssc,
    pcdd,
    hkl,
    xjssc,
    tjssc,
    bjkl8,
    er75ft
  },
  data () {
    return {
      games: '',
      currentGame: {},
      currentPlaySettings: [],
      loading: false
    }
  },
  created () {
    fetchGames().then(
      games => {
        this.games = games
        this.currentGame = games[0]
      }
    )
  },
  watch: {
    'currentGame': function () {
      this.fetchPlaySetting()
    }
  },
  methods: {
    fetchPlaySetting () {
      this.loading = true
      fetchPlaySetting(this.currentGame.id).then(playSettings => {
        this.currentPlaySettings = playSettings
        this.loading = false
      }, () => {
        this.loading = false
      })
    }
  }
}
</script>
