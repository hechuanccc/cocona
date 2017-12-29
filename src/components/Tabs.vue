<template>
  <div class="tabs m-b-lg">
    <div :class="[
      'tab',
      'text-center',
      {
        'active': item.key === activeTab
      }
      ]"
      v-for="(item, index) in items"
      :key="index"
      @click="switchTab(item)"
      >
      <span :class="[
      'tab-text',
      {
        'active': item.key === activeTab
      }
      ]">
        {{item.label}}
      </span>
    </div>
  </div>
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
      activeTab: this.items[0].routename ? this.$route.name : this.items[0].key
    }
  },
  watch: { // for tabs that control router
    '$route.name': function () {
      if (this.items[0].routename) {
        this.activeTab = this.$route.name
      }
    }
  },
  methods: {
    switchTab (e) {
      this.activeTab = e.key
      this.$emit('clicked', e)
    },
    setActiveTab (val) {
      this.activeTab = val
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../style/vars.scss";
.tabs{
  font-size: 14px;
}
.tab {
  box-sizing: border-box;
  display: inline-block;
  height: 35px;
  line-height: 1;
  background-color: #ffffff;
  border: solid 0.5px #cbcbcb;
  padding: 10px 15px;
  cursor: pointer;
  &.active {
    border: solid 1.5px $azul;
  }
}
.tab-text {
  color: #9b9b9b;
  letter-spacing: 1px;
  &.active {
    color: $azul;
  }
}
</style>


