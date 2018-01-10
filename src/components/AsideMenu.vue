<template>
  <el-aside class="m-l m-r" width="240px">
    <el-menu :default-active="active"
      text-color="#4a4a4a"
      active-text-color="#fff"
      :background-color="'#fff'">
      <el-menu-item v-for="(item,index) in items"
        :index="item.route ? item.route : ''+index"
        :key="index"
        class="aside-item"
        @click="onClick(item)"
        :router="true">
        <icon v-if="item.leftIcon" :name="item.leftIcon" :class="['aside-icon' ,item.leftIcon]"></icon>
        <!-- for making a distinction with api 'icon' filed -->
        <span slot="title" class="menu-text p-l">{{item.display_name}}</span>
      </el-menu-item>
    </el-menu>
  </el-aside>
</template>
<script>

export default {
  props: {
    items: {
      type: Array
    },
    defaultactive: {
      type: String,
      default: '0'
    }
  },
  computed: {
    active: function () {
      return this.defaultactive.indexOf('online_payment_success') !== -1 ? '/account/online_payment' : this.defaultactive
    }
  },
  methods: {
    onClick (e) {
      let data = e.code ? e.code : e
      this.$emit('clicked', data)
    }
  }
}
</script>

<style lang="scss" scopex>
@import '../style/vars';
.aside-item {
  width: 240px;
  height: 40px;
  line-height: 40px;
  margin-right: 0;
  font-size: 14px;
  border-bottom: 1px solid #F9F9F9;
}
.el-menu .el-menu-item {
  &.is-active {
    background: url("../assets/active_menu_bg_right.png") no-repeat -10px center;
    background-size: 256px 44px;
    border-bottom-width: 0;
  }
}
</style>
