<template>
  <div class="promo">
    <div class="page-title">
        <h1 class="title">{{$t('navMenu.promotion')}}</h1>
        <span>PREFERENTIAL</span>
      </div>
      <promoBanner v-for="promo in promotions"
      :key="promo.id"
      :promo="promo"
      />
  </div>
</template>
<script>
import PromoBanner from './PromoBanner.vue'
import { getPromotions } from '../../api'

export default {
  name: 'Promotions',
  data () {
    return {
      activeIndex: '1',
      promo_labels: [this.$t('promotions.campaign'), this.$t('promotions.deposit_withdraw'), this.$t('promotions.lottery'), this.$t('promotions.others')],
      promotions: ''
    }
  },
  components: {
    PromoBanner
  },
  created () {
    getPromotions().then(result => {
      this.promotions = result
    })
  }
}
</script>


