<template>
  <div>
    <div>
      <div class="game-menu-container">
        <ul class="game-menu p-l container">
          <li
            :class="['game-menu-item', activeGame === game.id ? 'active' : '']"
            v-for="(game, index) in allGames"
            :key="game.id" v-if="index < exposedCount"
            @click="switchGame(game)">{{game.display_name}}</li>
          <li
            :class="[
              'game-menu-item',
              'more-menu',
              'm-r-lg',
              'text-center',
              {
                'active': currentGame.index > exposedCount
              }
            ]"
            @mouseover="dropdownActive = true"
            @mouseleave="dropdownActive = false"
            v-if="allGames.length > exposedCount">
            <span v-if="currentGame.index > exposedCount">{{currentGame.display_name}}</span>
            <span v-else>更多</span>
            <i class="el-icon-arrow-up icon" v-if="dropdownActive"/>
            <i class="el-icon-arrow-down icon" v-else/>
            <div v-show="dropdownActive" class="dropdown">
              <ul class="dropdown-menu">
                 <li
                 :class="['dropdown-menu-item',activeGame===game.id?'active':'']"
                  v-for="(game, index) in allGames" :key="game.id"
                  :index="game.id + ''"
                  v-if="index >= exposedCount"
                  @click="switchGame(game)">{{game.display_name}}</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div class="category-menu">
        <div class="container">
          <ul>
            <li
              :class="['category-menu-item',activeCategory===category.id+''?'active':'']"
              v-for="(category, index) in categories"
              :key="'category' + category.id"
              @click="switchCategory(category)">{{category.display_name}}</li>
          </ul>
        </div>
      </div>
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
      exposedCount: 11,
      dropdownActive: false,
      isBusy: false
    }
  },
  computed: {
    activeGame () {
      return parseInt(this.$route.params.gameId)
    },
    activeCategory () {
      return this.$route.params.categoryId
    },
    currentGame () {
      return this.$store.getters.gameById(this.$route.params.gameId) || {index: 0}
    },
    categories () {
      const currentGameId = this.$route.params.gameId
      if (!currentGameId) {
        return []
      }
      return this.$store.getters.categoriesByGameId(currentGameId)
    },
    ...mapGetters([
      'allGames'
    ])
  },
  name: 'gamemenu',
  methods: {
    switchGame (game) {
      if (this.activeGame === game.id) {
        return
      }

      const key = game.id
      if (key === '-1') {
        return false
      }
      if (this.isBusy) {
        return false
      }
      // this.isBusy = true
      localStorage.setItem('lastGame', key)
      localStorage.setItem('lastGameCode', game.code)
      this.$router.push(`/${this.path}/${key}`)
    },
    switchCategory (category) {
      if (!category) {
        return
      }
      const gameId = this.$route.params.gameId
      if (this.currentGame.game_type !== 1) {
        localStorage.setItem(gameId + '-lastCategory', category.id)
      }
      this.$router.push({
        path: `/game/${gameId}/${category.id}`
      })
    }
  }
}
</script>

<style scoped lang='scss'>
@import "../style/vars.scss";
.game-menu {
  text-transform: uppercase;
}
.game-menu-container {
  background: linear-gradient(to bottom, #006bb3, #00397c);
}
.game-menu-item {
  height: 48px;
  line-height: 48px;
  padding: 0 16px;
  display: inline-block;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  &.active {
    background: rgba(0, 0, 0, 0.3);
    &:hover {
      background: rgba(0, 0, 0, 0.3);
      cursor: default;
    }
  }
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
}
.category-menu {
  text-align: center;
  height: 35px;
  background-color: $marine-blue;
}
.category-menu-item {
  height: 35px;
  line-height: 35px;
  padding: 0 10px;
  display: inline-block;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  &.active {
    color: $yellow;
  }
}
.more-menu {
  position: relative;
  float: right;
  color: #fff;
  font-size: 14px;
  padding: 0 20px;
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
}
.el-menu--horizontal {
  border: none;
}
.el-menu--horizontal .el-menu-item,
.el-menu--vertical .el-menu-item {
  height: 55px;
  line-height: 55px;
  &.is-active {
    background: rgba(0, 0, 0, 0.29);
    background-size: 200px 44px;
    border-bottom-width: 0;
  }
}
.dropdown {
  position: absolute;
  z-index: 10;
  right: 0;
  width: 150px;
  background: $darkish-blue;
}

.dropdown-menu {
  position: relative;
}

.dropdown-menu-item {
  height: 44px;
  line-height: 44px;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
}
</style>
