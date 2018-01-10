<template>
  <div class="tabs m-b-sm">
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
.tab {
  display: inline-block;
  height: 32px;
  line-height: 32px;
  background-color: #fff;
  border: solid 1px #cbcbcb;
  margin-right: -1px;
  padding: 0 15px;
  cursor: pointer;
  &.active {
    border: solid 1px $primary;
    background: $primary;
  }
}
.tab-text {
  color: #9b9b9b;
  &.active {
    color: #fff;
  }
}
</style>


