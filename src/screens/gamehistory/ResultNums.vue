<template>
  <div :class="['result-num', game]">
    <span :class="getResultClass"
      v-text="result.num +' '">
    </span>
    <b v-if="displayType === 'number' && result.zodiac" class="zodiac">{{result.zodiac}}</b>
  </div>
</template>

<script>
export default {
  props: {
    displayType: {
      type: String,
      default: 'number'
    },
    result: {
      type: Object
    },
    game: {
      type: String
    }
  },
  computed: {
    getResultClass () {
      switch (this.displayType) {
        case 'number':
          return [`${this.game}-${this.result.num}`]
        case 'oddEven':
          return this.result.oddEven
        case 'thanSize':
          return this.result.thanSize
        case 'tailThanSize':
          return this.result.tailThanSize
        case 'ballOfSumOddEven':
          return this.result.ballOfSumOddEven
        case 'ballOfSumThanSize':
          return this.result.ballOfSumThanSize
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@mixin number($w: 37px,$h: 37px) {
  background: url('../../assets/bjpknum2.png') no-repeat;
  display: inline-block;
  width: $w;
  height: $h;
  text-indent: -9999px;
  margin: 2px 5px;
}
.result-num {
  display: inline-block;
  margin-left: 5px;
}
.zodiac {
  display: block;
}
.odd {
  @include number;
  background-position: -150px -5px;
}
.even {
  @include number;
  background-position: -102px -5px;
}
.equal {
  @include number;
  background-position: -198px -5px;
}
.bigger {
  @include number;
  background-position: -12px -5px;
}
.smaller {
  @include number;
  background-position: -58px -5px;
}

%hklball{
  background: url("../../assets/ball_hk6.png") no-repeat;
  display: inline-block;
  text-indent: -9999px;
  width: 26px;
  line-height: 26px;
}

@mixin hkl-num{
  .hkl {
    &:last-child {
      &:before {
        content: '＋';
        color: black;
        position: relative;
      }
    }
  }
  @for $i from 1 through 49 {
    @if $i < 10 {
      .hkl-0#{$i}{
        @extend %hklball;
        background-position: 0 (-27px * ($i - 1));
      }
    }
    .hkl-#{$i}{
      @extend %hklball;
      background-position: 0 (-27px * ($i - 1));
    }
}
}
@include hkl-num;

$sscgames: tjssc, xjssc, cqssc, jsssc, pcdd, jnd28, fc3d;

%sscball{
  background: url("../../assets/ball_2.png") no-repeat;
  display: inline-block;
  text-indent: -9999px;
  width: 26px;
  line-height: 26px;
  margin-left: 5px;
}

@mixin ssc-num{
  @each $game in $sscgames{
    @for $i from 0 through 9 {
      .#{$game}-#{$i} {
        @extend %sscball;
        background-position: 0 (-27px * $i);
      }
      @if $game = jsssc {
        .#{$game}-0#{$i} {
          @extend %sscball;
          background-position: 0 (-27px * $i);
        }
      }
    }
  }
}
@include ssc-num;

$transformergames: mlaft, bcr, jspk10, er75ft;

%transformerball{
  display: inline-block;
  background: url("../../assets/ball-pk.png") no-repeat;
  text-indent: -9999px;
  width: 26px;
  height: 21px;
  line-height: 21px;
  margin-left: 5px;
}

@mixin transformer-num{
  @each $game in $transformergames{
    @for $i from 1 through 10 {
      @if $i < 10 {
        .#{$game}-0#{$i} {
          @extend %transformerball;
          background-position: 0 (-21px * ($i - 1));
        }
      }
        .#{$game}-#{$i} {
          @extend %transformerball;
          background-position: 0 (-21px * ($i - 1));
        }
    }
  }
}
@include transformer-num;

%bjkl8ball {
  display: inline-block;
  background: url(../../assets/ball_5_small.png) repeat-x;
  width: 21px;
  text-indent: -9999px;
  height: 23px;
  line-height: 23px;
  margin-left: 5px;
}
@mixin bjkl8-num {
  @for $i from 1 through 80 {
    @if $i < 10 {
      .bjkl8-0#{$i} {
        @extend %bjkl8ball;
        background-position: 0 (-23px * ($i - 1));
    }
    }
    .bjkl8-#{$i} {
      @extend %bjkl8ball;
      background-position: 0 (-23px * ($i - 1));
    }
  }
}

@include bjkl8-num;

@mixin auluck8-num {
  @for $i from 1 through 80 {
    @if $i < 10 {
      .auluck8-0#{$i} {
        @extend %bjkl8ball;
        background-position: 0 (-23px * ($i - 1));
    }
    }
    .auluck8-#{$i} {
      @extend %bjkl8ball;
      background-position: 0 (-23px * ($i - 1));
    }
  }
}

@include auluck8-num;

%cqlfball{
  display: inline-block;
  background: url(../../assets/ball_nc_top.png) repeat-x;
  width: 32px;
  text-indent: -9999px;
  height: 33px;
  line-height: 33px;
  margin-left: 5px;
}
@mixin cqlf-num {
  @for $j from 1 through 20 {
    .cqlf-#{$j} {
      @extend %cqlfball;
      background-position: 0 (-33px * ($j - 1));
    }
    @if $j < 10 {
      .cqlf-0#{$j} {
        @extend %cqlfball;
        background-position: 0 (-33px * ($j - 1));
      }
    }
  }
}
@include cqlf-num;

%jsk3ball{
  display: inline-block;
  background: url(../../assets/ball_4.png) repeat-x;
  width: 27px;
  text-indent: -9999px;
  height: 27px;
  line-height: 27px;
  margin-left: 15px;
}
@mixin jsk3-num {
  @for $j from 1 through 20 {
    .jsk3-#{$j} {
      @extend %jsk3ball;
      background-position: 0 (-27px * ($j - 1));
    }
  }
}
@include jsk3-num;

%gdklsfball{
  display: inline-block;
  background: url(../../assets/ball_1.png) repeat-x;
  width: 27px;
  text-indent: -9999px;
  height: 27px;
  line-height: 27px;
}
@mixin gdklsf-num {
  @for $j from 1 through 20 {
    .gdklsf-#{$j} {
      background-position: 0 (-27px * ($j - 1));
      @extend %gdklsfball;
    }
    @if $j < 10 {
      .gdklsf-0#{$j} {
        background-position: 0 (-27px * ($j - 1));
        @extend %gdklsfball;
    }
    }
  }
}
@include gdklsf-num;

%gd11x5ball{
  display: inline-block;
  background: url(../../assets/ball_1.png) repeat-x;
  width: 27px;
  text-indent: -9999px;
  height: 27px;
  line-height: 27px;
}
@mixin gd11x5-num {
  @for $j from 1 through 20 {
    .gd11x5-#{$j} {
      background-position: 0 (-27px * ($j - 1));
      @extend %gd11x5ball;
    }
    @if $j < 10 {
      .gd11x5-0#{$j} {
        background-position: 0 (-27px * ($j - 1));
        @extend %gd11x5ball;
    }
    }
  }
}
@include gd11x5-num;

</style>
