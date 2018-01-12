<template>
  <div class="promo-banners">
    <img class="banner-img m-t-lg" :src="promo.image" :alt="promo.id" @click="showContent = true">
    <el-dialog :title="promo.name"
      :visible.sync="showContent"
      :width="'700px'">
      <div v-html="promo.description"></div>
    </el-dialog>
  </div>
</template>
<style lang="sass" scoped>
.promo-banners
  width: 1000px
  margin: 0 auto
  .banner-img
    cursor: pointer
    width: 100%
    height: 144px
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
