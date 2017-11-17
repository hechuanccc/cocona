<template>
<div class="promo-banners">
      <img :src="promo.image" :alt="promo.id" @click="showContent = !showContent">
      <el-collapse-transition>
        <div class="banner-content" v-show="showContent">
            <h1>{{promo.description}}</h1>
            <h1>{{promo.name}}</h1>
            <h1>{{promo.start_date}}</h1>
            <h1>{{promo.end_date}}</h1>
        </div>
      </el-collapse-transition>
    </div>
</template>
<style lang="sass" scoped>
.promo-banners
  width: 1000px
  margin: 0 auto
  img
    width: 100%
    height: 144px

.banner-content
  width: 1000px
  margin-bottom: 10px
  background: #DDD

</style>
<script>
export default {
  props: {
    promo: {
      type: Object
    }
  },
  data () {
    return {
      showContent: false
    }
  }
}
</script>
