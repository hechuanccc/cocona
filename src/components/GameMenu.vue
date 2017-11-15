<template>
  <div class="game-menu">
    <div class="container">
      <el-menu
        v-if="this.allGames.length"
        mode="horizontal"
        :default-active="activeIndex"
        @select="handleSelect"
        :background-color="style.primaryColor"
        text-color="#fff"
        active-text-color="#fff">
        <el-menu-item v-for="(game, index) in allGames" :key="game.id" :index="game.id + ''" v-if="index < 10">{{game.display_name}}</el-menu-item>
        <li class="more-menu" @mouseover="dropdownActive = true" @mouseleave="dropdownActive = false" :index="'-1'" v-if="allGames.length > 10">
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
               <el-menu-item v-for="(game, index) in allGames" :key="game.id" :index="index + ''" v-if="index >= 10">{{game.display_name}}</el-menu-item>
            </el-menu>
          </div>
        </li>
      </el-menu>
    </div>
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
      return this.$route.params.gameId
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
        const defaultGameId = localStorage.getItem('lastGame') || this.allGames[0].id
        this.$router.push(`/${this.path}/${defaultGameId}`)
      }
    }
  },
  name: 'gamemenu',
  methods: {
    handleSelect (key, keyPath) {
      if (key === '-1') {
        return false
      }
      localStorage.setItem('lastGame', key)
      this.$router.push(`/${this.path}/${key}`)
    }
  }
}
</script>

<style scoped lang='scss'>
@import '../style/vars.scss';
.game-menu {
  background: $primary;
}
.more-menu {
  float: right;
  color: #fff;
  font-size: 14px;
  line-height: 44px;
  padding: 0 20px;
  &:hover {
    background-color: rgba(20, 94, 168, 1);
  }
}
.el-menu--horizontal .el-menu-item, .el-menu--vertical .el-menu-item {
  height: 44px;
  line-height: 44px;
  &.is-active {
    background: url('../assets/active_menu_bg.png') no-repeat center 0;
    background-size: 200px 44px;
    border-bottom-width: 0;
  }
}
.dropdown {
  position: absolute;
  z-index: 10;
  right: 0;
  width: 150px;
}
.dropdown-menu {
  position: relative;

}
.dropdown-menu .el-menu-item {
  float: none;
  text-align: center;
}
</style>
