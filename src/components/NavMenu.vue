<template>
  <ul class="main-navs">
    <router-link
      v-if="menu.path"
      tag="li"
      :to="menu.path"
      :class="getMenuClass(menu)"
      v-for="menu in menus"
      :key="menu.icon">
      <span :class="menu.eng ? 'big' : ''">{{menu.name}}</span>
      <span v-if="menu.eng" class="eng">{{menu.eng}}</span>
    </router-link>
    <li class="nav-link">
      <a v-if="$store.state.systemConfig.customerServiceUrl"
        class="online-service m-r"
        target="_blank"
        :href="$store.state.systemConfig.customerServiceUrl ? $store.state.systemConfig.customerServiceUrl : '#'">
        <span :class="menus[0].eng ? 'big' : ''">{{$t('navMenu.online_service')}}</span>
        <span v-if="menus[0].eng" class="eng">SERVICES</span>
      </a>
    </li>
  </ul>
</template>

<script>
import style from '../style'
export default {
  props: {
    menus: {
      type: Array
    }
  },
  data () {
    return {
      style
    }
  },
  methods: {
    getMenuClass (menu) {
      return {
        'active': this.$route.path.split('/')[1] === menu.path.slice(1),
        [menu.class]: menu.class,
        'nav-link': true
      }
    }
  }
}
</script>


<style lang="scss" scoped>
@import "../style/vars.scss";
.main-navs {
  float: right;
  height: 100%;
  display: flex;
  align-items: center;
}
.nav-link {
  display: inline-block;
  padding: 10px 15px;
  border-right: 1px solid #efefef;
  cursor: pointer;
  text-align: center;
  color: #666;
  font-size: 16px;
  &:active, &:hover {
    color: $primary;
    .eng {
      color: $primary;
    }
  }
  &:last-child {
    border: none;
  }
}
.big {
  font-size: 16px;
}
.eng {
  display: block;
  font-size: 14px;
  line-height: 1.5;
  color: #999;
}
.online-service {
  display: block;
  &:visited {
    color: #666;
  }
  &:active, &:hover {
    color: $primary;
  }
}
</style>
