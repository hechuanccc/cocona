<template>
  <div class="container">
    <div class="page-title">
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
@import "../../style/vars.scss";

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
      color: $primary
      border-bottom: 1.5px solid $primary
      &:after
        content: ' '
        position: absolute
        opacity: 1
        margin: 0 auto
        bottom: 0
        border: 10px solid transparent
        border-bottom-color: $primary
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

