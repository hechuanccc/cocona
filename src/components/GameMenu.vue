<template>
  <div class="game-menu">
    <el-menu
      v-if="this.allGames.length"
      mode="horizontal"
      :default-active="activeIndex"
      @select="handleSelect"
      :background-color="style.primaryColor"
      text-color="#fff"
      active-text-color="#fff">
      <el-menu-item v-for="(game, index) in allGames" :key="index" :index="index + ''" v-if="index < 10">{{game.display_name}}</el-menu-item>
      <li class="more-menu" @mouseover="dropdownActive = true" @mouseleave="dropdownActive = false" :index="'-1'">
        更多
        <i class="el-icon-arrow-up icon" v-if="dropdownActive"/>
        <i class="el-icon-arrow-down icon" v-else/>
        <div v-show="dropdownActive" class="dropdown">
          <el-menu 
            class="dropdown-menu"
            text-color="#fff"
            active-text-color="#fff"
            :default-active="activeIndex"
            @select="handleSelect"
            :background-color="style.primaryColor">
             <el-menu-item v-for="(game, index) in allGames" :key="index" :index="index + ''" v-if="index >= 10">{{game.display_name}}</el-menu-item>
          </el-menu>
        </div>
      </li>
    </el-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import style from '../style'

export default {
  props: {
    path: {
      type: String,
      default: 'game'
    }
  },
  data () {
    return {
      style,
      dropdownActive: false
    }
  },
  computed: {
    activeIndex () {
      let index = this.allGames.findIndex(item => {
        return item.id === parseInt(this.$route.params.gameId)
      })
      return (index === -1 ? 0 : index) + ''
    },
    ...mapGetters([
      'allGames'
    ]),
    user () {
      return this.$store.state.user
    }
  },
  watch: {
    'allGames': function () {
      if (!this.$route.params.gameId) {
        this.$router.push('/' + this.path + '/' + this.allGames[0].id)
      }
    }
  },
  name: 'gamemenu',
  methods: {
    handleSelect (key, keyPath) {
      if (key === '-1') {
        return false
      }
      this.$router.push('/' + this.path + '/' + this.allGames[key].id)
    }
  }
}
</script>

<style scoped lang='scss'>
.more-menu {
  float: right;
  color: #fff;
  font-size: 14px;
  line-height: 40px;
  padding: 0 20px;
  &:hover {
    background-color: rgba(20, 94, 168, 1);
  }
}
.el-menu--horizontal .el-menu-item, .el-menu--vertical .el-menu-item {
  height: 40px;
  line-height: 40px;
}
.dropdown {
  position: absolute;
  z-index: 10;
  right: 0;
  width: 150px;
}
.dropdown-menu {
  position: relative;
  width: 150px;
}
.dropdown-menu .el-menu-item {
  float: none;
}
</style>
