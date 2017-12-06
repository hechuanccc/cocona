<template>
  <el-row class="row-bg">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('navMenu.game_intro')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <el-row class="rules-container">
        <el-col :span="3">
          <el-menu default-active="1" class="el-menu-vertical-demo">
            <el-menu-item v-for="(game, index) in games"
              :key="game.id"
              :index="index + 1 + ''"
              @click="currentGame = game.code">
              <span slot="title">{{game.display_name}}</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="21" class="p-l-lg p-t">
          <component :is="currentGame"></component>
        </el-col>
      </el-row>
    </div>
  </el-row>
</template>

<style lang="scss">
@import "../../style/vars.scss";

.rules-container {
  background-color: white;
  height: 100%;
  min-height: 100vh;
}

.rule-details {
$common-pixel: 10px !default;
$lg: $common-pixel * 2 !default;
$sm: $common-pixel * 1/2 !default;
$title-size: 18px !default;
$text-size: 13px !default;
$text-color: #666 !default;
$title-color: black !default;

  font-size: $text-size;
  color: $text-color;
  h1 {
    font-size: $title-size;
    margin-bottom: $common-pixel;
    color: $title-color
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
import { fetchGames } from '../../api'
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

export default {
  data () {
    return {
      games: '',
      currentGame: 'bcr'
    }
  },
  created () {
    fetchGames().then(
      games => {
        this.games = games
      }
    )
  },
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
    bjkl8
  }
}
</script>
