<template>
  <div class="promo">
    <div class="promo-title">
        <h1 class="title">{{$t('navMenu.promotion')}}</h1>
        <span>PREFERENTIAL</span>
      </div>
  <el-tabs tab-position="left">
    <el-tab-pane v-for="(label,index) in promo_labels"
    :key="index"
    :label="label">
      <promoBanner v-for="promo in promotions"
      :key="promo.id"
      :promo="promo"
      />
    </el-tab-pane>
  </el-tabs>
  </div>
</template>

<style lang="sass" scoped>
$banner_width: 1000px
$primary-color: #409EFF


.promo
  width: $banner_width
  height: auto
  background: #fff
  margin: 0 auto

.promo-title
  margin-bottom: 20px
  span
    color: #DDD
    font-size: 28px
    font-style: italic
    letter-spacing: 1px
  .title
    display: inline-block
    font-size: 32px
    line-height: 40px
    background: $primary-color
    color: #FFF
    margin: 10px 0 0 -20px
    padding: 10px 30px
    position: relative
    font-weight: 500
  .title:before
    bottom: -20px
    left: 0
    content: " "
    width: 0
    height: 0
    border-style: solid
    border-width: 0 20px 20px 0
    border-color: rgba(0, 0, 0, 0) darken($primary-color, 20%) rgba(0, 0, 0, 0) rgba(0, 0, 0, 0)
    position: absolute
    z-index: 0

</style>
<script>
import promoBanner from './promoBanner.vue'
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
    promoBanner
  },
  created () {
    getPromotions().then(result => {
      this.promotions = result
    })
  }
}
</script>


