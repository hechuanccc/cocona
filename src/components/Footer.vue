<template>
  <div class="footer text-center">
    <div class="quick-info">
      <div :class="['sub-menu', 'm-b-xlg', {'container': notHomePage}]">
        <router-link class="link"
          v-for="(item, index) in showSubMenu"
          :key="index"
          :to="item.route">{{item.option}}</router-link>
          <a href="#" class="link" @click="navigateToMobile()">手机版</a>
      </div>
      <div :class="{'container': notHomePage}">
        <div class="advice block-center">
          <div class="footer-icon">
            <img src="../assets/footer.png">
          </div>
          <div class="footer-text">
            <p>理性购彩，未满 18 周岁未成年人禁止购彩及兑奖</p>
            <p>健康游戏忠告：抵制黑平台不良游戏，拒绝盗版小平台游戏。注意自我保护，谨防受骗上当。</p>
            <p>温馨提示您适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。</p>
          </div>
        </div>
      </div>
    </div>
    <div class="copyright">
      <div :class="['text',{'container': notHomePage}]">Copyright © Reserved</div>
    </div>
  </div>
</template>

<script>
const subMenu = [
  {
    option: '存款取款',
    route: '/account/online_payment'
  },
  {
    option: '常见问题',
    route: '/faq/faqs'
  },
  {
    option: '规则说明',
    route: '/gameintro'
  },
  {
    option: '加盟合作',
    route: '/agent/agent_register'
  },
  {
    option: '关于我们',
    route: '/faq/about'
  },
  {
    option: '最新优惠',
    route: '/promotions'
  }
]
export default {
  name: 'bottom',
  methods: {
    navigateToMobile () {
      this.$cookie.set('desktop', 0)
      window.location.reload()
    }
  },
  computed: {
    notHomePage () {
      return this.$route.name !== 'Home'
    },
    showSubMenu () {
      const onlinePaymentTypes = this.$store.state.user.onlinePaymentTypes
      if (onlinePaymentTypes && onlinePaymentTypes.length) {
        subMenu[0].route = '/account/online_payment'
      } else {
        subMenu[0].route = '/account/remit'
      }
      return subMenu
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/vars.scss';
@mixin text ($line-height, $color, $sz) {
  font-size:  $sz;
  line-height: $line-height;
  color: $color;
}
@mixin block($height, $bgc) {
  height: $height;
  background: $bgc;
}

.quick-info {
  @include block(200px, #f1f1f1);
}

.sub-menu {
  padding-top: 35px;
  .link {
    padding: 0 20px;
    border-right: 1px solid #ccc;
    @include text(1, #666, 14px);
    &:last-child {
      border: none
    }
    &:hover {
      color: $primary
    }
  }
}

.advice {
  @include text(1.8, #999, 12px);
  height: 60px;
  width: 580px;
  text-align: center;
  .footer-icon {
    float: left;
    margin-right: 20px;
    height: 60px;
    img {
      height: 100%;
    }
  }
  .footer-text {
    float: left;
    text-align: left;
  }
}

.copyright {
  @include block(34px, #2f2f2f);
  .text {
    @include text(34px, #ccc, 12px);
  }
}
</style>
