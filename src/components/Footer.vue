<template>
  <div class="footer text-center">
    <div class="quick-info">
      <div class="sub-menu m-b-xlg container">
        <router-link class="link"
          v-for="(item, index) in subMenu"
          :key="index"
          :to="item.route">
          {{item.option}}
        </router-link>
      </div>
      <div class="advice block-center">
        <div class="container">
          <p>理性购彩，未满 18 周岁未成年人禁止购彩及兑奖</p>
          <p>健康游戏忠告：抵制黑平台不良游戏，拒绝盗版小平台游戏。注意自我保护，谨防受骗上当。</p>
          <p>温馨提示您适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。</p>
        </div>
      </div>
    </div>
    <div class="copyright">
      <div class="text container">Copyright © Reserved</div>
    </div>
  </div>
</template>


<script>
export default {
  name: 'bottom',
  data () {
    return {
      subMenu: [
        {
          option: '存款取款',
          route: '/account/online_payment'
        },
        {
          option: '常见问题',
          route: '/faq'
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
          route: '/'
        },
        {
          option: '最新优惠',
          route: '/promotions'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../style/vars.scss';
@mixin text ($line-height, $color, $sz) {
  letter-spacing: 1.3px;
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
    @include text(1, #4a4a4a, 14px);
    &:nth-child(n + 2):before {
      content: '|';
    }
  }
}

.advice {
  @include text(1.8, #4a4a4a, 12px);
}

.copyright {
  @include block(34px, #2f2f2f);
  .text {
    @include text(34px, #ffffff, 12px);
  }
}
</style>
