<template>
  <el-aside class="m-l-xlg m-r-sm" width="256px">
    <el-menu :default-active="defaultactive"
      text-color="#4a4a4a"
      active-text-color="#fff"
      :background-color="'#fff'">
      <el-menu-item v-for="(item,index) in items"
        :index="item.route ? item.route : ''+index"
        :key="index"
        class="aside-item"
        @click="onClick(item)"
        :router="true">
        <span slot="title" class="menu-text">{{item.display_name}}</span>
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
  width: 256px;
  height: 40px;
  line-height: 40px;
  margin-right: 0;
  font-size: 14px;
  letter-spacing: 2px;
  border-bottom: 1px solid #F0F0F0;
}

.el-menu .el-menu-item {
  &.is-active {
    background: url("../assets/active_menu_bg_right.png") no-repeat center right;
    background-size: 256px 44px;
    border-bottom-width: 0;
  }
}
</style>
