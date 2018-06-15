<template>
  <ul class="pokers">
    <li v-if="!currentGameResult.issue_number" class="waitopen text-center">
      <img class="img" src="../assets/niu/waitopen.png" alt="">
    </li>
    <li v-else class="poker"
      v-for="(value, key, index) in currentGameResult.extra_info"
      :key="index">
      <span class="win-badge" v-if="value.status === 'win'"></span>
      <div class="pokers-wrap">
        <span :class="['card', 'card-animation', `card-${displayCardNumber(card.number)}`, `card-type${card.cardType}`]"
          v-for="(card, index) in value.numbers"
          :key="index">
        </span>
      </div>
      <div class="pokers-info">
        <div :class="['pokers-name', key === 'n0' ? 'banker' : `player-${key}`]" ></div>
        <div :class="['pokers-rank', `rank-${value.niu_number}`]"></div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    currentGameResult: {
      type: Object
    }
  },
  methods: {
    displayCardNumber (number) {
      let card
      if (number >= 10) {
        card = parseInt(4 * Math.random()) + 10
      } else {
        card = number
      }
      return card
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../style/card.scss";
</style>
