<template>
  <el-aside class="m-l-xlg m-r-sm" width="256px">
    <el-menu :default-active="0"
      text-color="#4a4a4a"
      active-text-color="#fff"
      :background-color="'#fff'">
      <el-menu-item v-for="(item,index) in items"
        :index="index"
        :key="item.code + index"
        class="aside-item"
        @click="onClick(item.code)"
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
    }
  },
  data () {
    return {
      current: ''
    }
  },
  methods: {
    onClick (e) {
      this.current = e
      this.$emit('clicked', e)
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
