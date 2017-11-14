<template>
  <div class="container">
    <div class="promo-title">
      <h1 class="title">常見問題</h1>
      <span>COMMON PROBLEM</span>
    </div>
    <ul class="faq-titles">
      <li :class="{active: nowfaq === faq.source }" v-for="faq in faqs" :key="faq.source" :title="faq.source" @click="switchFaq($event)">{{faq.title}}</li>
    </ul>
    <div class="faq-content">
      <el-collapse-transition>
        <component :is="nowfaq"></component>
      </el-collapse-transition>
    </div>
  </div>
</template>



<style lang="sass" scoped>
$primary-color: #409EFF

.faq-titles
  position: relative
  text-align: center
  margin-top: 15px
  li
    color: rgba(50, 50, 50, 0.8)
    cursor: pointer
    display: inline-block
    width: 10%
    border-bottom: 1px solid #ddd
    padding: 15px
    font-size: 24px
    margin-right: 10px
    margin-left: 10px
    &.active
      color: $primary-color
      border-bottom: 1.5px solid $primary-color
      &:after
        content: ' '
        position: absolute
        opacity: 1
        margin: 0 auto
        bottom: 0
        border: 10px solid transparent
        border-bottom-color: $primary-color
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
import FaqDeposit from './FaqDeposit'
import FaqWithdraw from './FaqWithdraw'
import FaqFaqs from './FaqFaqs'
import FaqAbout from './FaqAbout'
import FaqContact from './FaqContact'
export default {
  data () {
    return {
      nowfaq: 'FaqDeposit',
      faqs: [
        { title: '如何存款', source: 'FaqDeposit' },
        { title: '如何提款', source: 'FaqWithdraw' },
        { title: '常見問題', source: 'FaqFaqs' },
        { title: '關於我們', source: 'FaqAbout' },
        { title: '聯繫我們', source: 'FaqContact' }
      ]
    }
  },
  methods: {
    switchFaq (el) {
      this.nowfaq = el.srcElement.title
    }
  },
  components: {
    FaqDeposit,
    FaqWithdraw,
    FaqFaqs,
    FaqAbout,
    FaqContact
  }
}
</script>

