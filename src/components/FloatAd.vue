<template>
  <div class="float-ad" :style="{
     position: 'fixed',
     right: offsetX + scrollWidth + 'px',
     top: '50%',
     marginTop: `-150px`,
     width: width,
     height: '315px',
     'z-index': 2
    }">
    <transition name="slide-fade">
      <a v-show="floatAdVisible" target="_blank" :href="systemConfig.customerServiceUrl ? systemConfig.customerServiceUrl : 'javascript:;' ">
        <img class="ad-img" :src="content" alt="float-ad"/>
      </a>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    floatAdVisible: {
      type: Boolean,
      default: false
    },
    offsetX: {
      type: String,
      default: '0'
    },
    width: {
      type: String,
      default: '150px'
    },
    content: {
      type: String,
      require: true
    }
  },
  methods: {
    switchFloatAd () {
      this.$emit('switchFloatAd', !this.isVisible)
    }
  },
  computed: {
    scrollWidth () {
      return window.innerWidth - document.body.clientWidth
    },
    ...mapState([
      'systemConfig'
    ])
  }
}
</script>

<style lang="scss" scoped>
.ad-trigger {
  display: block;
  color: #000;
}

.ad-img {
  width: 100%;
  height: 100%;
}

.slide-fade-enter-active, .slide-fade-leave-active {
  transition: all .7s ease;
}

.slide-fade-enter, .slide-fade-leave-to{
  transform: translateX(10px);
  opacity: 0;
}
</style>
