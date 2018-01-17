<template>
  <div class="countdown-panel">
    <p class="issue">{{schedule.issue_number}}{{$t('navMenu.result_period')}}</p>
    
    <div class="schedule" v-if="schedule && schedule.issue_number">
      <div class="title">开奖</div>
      <span v-if="!ended" class="green countdown">
        <span v-if="resultCountDown.days > 0">{{resultCountDown.days}}天 </span>
        <span v-if="resultCountDown.hours > 0">{{resultCountDown.hours | complete}}:</span>{{resultCountDown.minutes | complete}}:{{resultCountDown.seconds | complete}}
      </span>
      <span v-else class="green countdown">已结束</span>
    </div>
    <div class="schedule" v-if="schedule && schedule.issue_number">
      <div class="title">封盘</div>
      <span v-if="!gameClosed" class="red countdown">
        <span v-if="closeCountDown.days > 0">{{closeCountDown.days}}天 </span>
        <span v-if="closeCountDown.hours > 0">{{closeCountDown.hours | complete}}:</span>{{closeCountDown.minutes | complete}}:{{closeCountDown.seconds | complete}}
      </span>
      <span v-else class="red countdown">已封盘</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    schedule: {
      type: Object
    },
    currentGame: {
      type: Object
    },
    gameClosed: {
      type: Boolean
    },
    closeCountDown: {
      type: Object
    },
    resultCountDown: {
      type: Object
    }
  },
  computed: {
    ended () {
      const r = this.resultCountDown
      return r.hours + r.hours + r.seconds + r.minutes === 0
    }
  },
  filters: {
    complete (value) {
      value = parseInt(value)
      return value < 10 ? ('0' + value) : value
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/vars.scss";
.countdown-panel {
  position: absolute;
  right: 0;
  top: 0;
  float: right;
  background: #fff;
}
.issue {
  font-size: 13px;
  color: #666;
  float: left;
  text-align: center;
  line-height: 50px;
}
.countdown {
  font-size: 16px;
}
.schedule {
  text-align: center;
  padding: 0 10px;
  float: right;
  padding-top: 5px;
  .title {
    height: 20px;
    line-height: 20px;
  }
}
</style>