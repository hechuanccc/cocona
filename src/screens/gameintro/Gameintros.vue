<template>
  <el-row class="row-bg">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('navMenu.game_intro')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row class="rules-container">
        <div class="aside">
          <AsideMenu @clicked="onClickChild" :items="games ? games : []" />
        </div>
        <div class="main rules-content m-b-xlg">
          <h1 class="rules-main-title m-b-lg">{{currentGame.display_name}}</h1>
          <h2 class="rules-sub-title">{{$t('gameIntro.gameinfo')}}</h2>
          <el-table class="m-b-lg" v-loading="loading" :data="currentPlaySettings" stripe>
            <el-table-column :label="''" prop="display_name">
            </el-table-column>
            <el-table-column :label="$t('gameIntro.odds')" prop="odds">
            </el-table-column>
            <el-table-column :label="$t('gameIntro.return_rate')" prop="return_rate">
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
          <h2 class="rules-sub-title">{{$t('gameIntro.rule')}}</h2>
          <component :is="currentGame.code"></component>
        </div>
      </el-row>
    </div>
  </el-row>
</template>

<script>
  import {
    fetchGames,
    fetchPlaySetting
  } from '../../api'
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
  import AsideMenu from '../../components/AsideMenu'
  import _ from 'lodash'

  export default {
    name: 'gameIntros',
    components: {
      AsideMenu,
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
          _.each(playSettings, (item) => {
            item.return_rate = item.return_rate + '%'
          })
          this.currentPlaySettings = playSettings
          this.loading = false
        }, () => {
          this.loading = false
        })
      },
      onClickChild (e) {
        this.currentGame = _.find(this.games, item => {
          return item.code === e
        })
      }
    }
  }
</script>

<style lang="scss">
@import "../../style/vars.scss";
@import "../../style/base.scss";
$common-pixel: 10px !default;
$title-size: 18px !default;
$title-color: black !default;

.aside {
  display: inline-block;
  vertical-align: top;
}
.main.rules-content {
  display: inline-block;
  box-sizing: border-box;
  width: 1095px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  padding: 40px;
  @extend %text;
}
.rules-main-title {
  font-size: $title-size;
  color: $title-color;
}
.rules-sub-title {
  margin-bottom: $common-pixel;
  color: $title-color;
}
.rules-container {
  height: 100%;
  min-height: 100vh;
}
.rule-details {
  $lg: $common-pixel * 2 !default;
  $sm: $common-pixel * 1/2 !default;
  .warn {
    color: $watermelon;
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
