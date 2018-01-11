<template>
  <el-row class="row-bg">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('navMenu.qa')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="aside">
        <AsideMenu @clicked="onClickChild" :items="faqs"/>
      </div>
      <div class="main m-b-xlg">
        <component :is="nowfaq"></component>
      </div>
    </div>
  </el-row>
</template>


<style lang="sass" scoped>
@import "../../style/vars.scss";
@import "../../style/base.scss";

.aside
  display: inline-block
  vertical-align: top
.main
  box-sizing: border-box
  display: inline-block
  width: $main_width;
  height: auto
  padding: 40px
  background-color: #ffffff
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.1)
  .box-card
    min-height: 300px
    @extend %text;

</style>
<script>
import FaqDeposit from './FaqDeposit'
import FaqWithdraw from './FaqWithdraw'
import FaqFaqs from './FaqFaqs'
import FaqAbout from './FaqAbout'
import FaqContact from './FaqContact'
import AsideMenu from '../../components/AsideMenu'
export default {
  data () {
    return {
      nowfaq: 'FaqDeposit',
      faqs: [
        { display_name: '如何存款', code: 'FaqDeposit' },
        { display_name: '如何提款', code: 'FaqWithdraw' },
        { display_name: '常見問題', code: 'FaqFaqs' },
        { display_name: '關於我們', code: 'FaqAbout' },
        { display_name: '聯繫我們', code: 'FaqContact' }
      ]
    }
  },
  methods: {
    onClickChild (e) {
      this.nowfaq = e
    }
  },
  components: {
    FaqDeposit,
    FaqWithdraw,
    FaqFaqs,
    FaqAbout,
    FaqContact,
    AsideMenu
  }
}
</script>

