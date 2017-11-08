<template>
  <div class="promo">
    <div v-for="(promo, index) in promotions" :key="promo.id" class="promo-banners">
      <img :src="promo.image" alt="promo.id" @click="showContent(index)">
      <el-collapse-transition>
        <div class="activity-content" v-show="now_index === index" >
            <h1>{{promo.description}}</h1>
            <h1>{{promo.name}}</h1>
            <h1>{{promo.start_date}}</h1>
            <h1>{{promo.end_date}}</h1>
        </div>
      </el-collapse-transition>
    </div>

  </div>
</template>

<style lang="sass" scoped>
$banner_width: 800px

.promo
  width: 1000px
  background: #fff
  border: 2px solid #bfbfbf
  position: relative
  left: 50%
  margin-left: -500px
  .promo-banners
    text-align: center
    margin-top: 10px
    img
      width: $banner_width
      height: 200px
.activity-content
  width: $banner_width - 100px
  padding: 20px
  line-height: 1.2
  background: rgba(229, 231, 244, .3)
  margin: 0 auto
</style>
<script>
import { getPromotions } from '../api'

export default {
  name: 'Promotions',
  data () {
    return {
      promotions: '',
      activeIndex: '1',
      now_index: ''
    }
  },
  created () {
    getPromotions().then(result => {
      this.promotions = result
    })
  },
  methods: {
    showContent (index) {
      this.now_index = index
    }
  }
}
</script>


