<template>
  <div class="footer text-center">

    <div class="quick-info">
      <div class="sub-menu">
        <router-link class="link"
          v-for="(item, index) in subMenu"
          :key="index"
          :to="item.route">
          {{item.option}}
        </router-link>
      </div>
      <div class="advice">
        <p>理性购彩，未满 18 周岁未成年人禁止购彩及兑奖</p>
        <p>健康游戏忠告：抵制黑平台不良游戏，拒绝盗版小平台游戏。注意自我保护，谨防受骗上当。</p>
        <p>温馨提示您适度游戏益脑，沉迷游戏伤身。合理安排时间，享受健康生活。</p>
      </div>
    </div>

    <div class="copyright">Copyright © Reserved</div>

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
@mixin text ($line-height, $color) {
  letter-spacing: 1.3px;
  font-size: 12px;
  font-weight: 500;
  line-height: $line-height;
  color: $color;
}
@mixin block($height, $bgc) {
  height: $height;
  background: $bgc;
}

.quick-info {
  @include block(200px, $dark-slate-blue);
}

.sub-menu {
  padding-top: 36px;
  padding-bottom: 40px;
  height: 22px;
  .link {
    color:  #ffffff;
    text-decoration: none;
    font-size: 14px;
    letter-spacing: 1.6px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    &:nth-child(n + 2):before {
      content: '|';
    }
  }
}

.advice {
  margin: 0 auto;
  width: 638px;
  height: 66px;
  @include text(1.83, $pinkish-grey);
}

.copyright {
  @include block(34px, #2f2f2f);
  @include text(34px, #ffffff);
}
</style>
