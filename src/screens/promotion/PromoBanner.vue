<template>
  <div class="promo-banners">
    <img class="banner-img clickable m-t-lg" :src="promo.image" :alt="promo.id" @click="showContent = true">
    <el-dialog :title="promo.name"
      :visible.sync="showContent"
      :width="'700px'">
      <div v-html="promo.description"></div>
    </el-dialog>
  </div>
</template>

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

<style lang="scss" scoped>
.promo-banners {
  width: 1000px;
  margin: 0 auto;
  .banner-img {
    width: 100%;
    height: 144px
  }
}
</style>

