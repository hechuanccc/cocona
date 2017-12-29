<template>
  <div>
    <div>
      <div class="game-menu-container">
      <ul class="game-menu p-l-xlg container">
        <li
          :class="['game-menu-item',activeGame===game.id?'active':'']"
          v-for="(game, index) in allGames"
          :key="game.id" v-if="index < 10"
          @click="switchGame(game.id+'')">{{game.display_name}}</li>
        <li
          class="game-menu-item more-menu m-r-lg text-center"
          @mouseover="dropdownActive = true"
          @mouseleave="dropdownActive = false"
          v-if="allGames.length > 10">
          更多
          <i class="el-icon-arrow-up icon" v-if="dropdownActive"/>
          <i class="el-icon-arrow-down icon" v-else/>
          <div v-show="dropdownActive" class="dropdown">
            <ul class="dropdown-menu">
               <li
               :class="['dropdown-menu-item',activeGame===game.id?'active':'']"
                v-for="(game, index) in allGames" :key="game.id"
                :index="game.id + ''"
                v-if="index >= 10"
                @click="switchGame(game.id+'')">{{game.display_name}}</li>
            </ul>
          </div>
        </li>
      </ul>
      </div>
      <ul class="category-menu">
        <li
          :class="['category-menu-item',activeCategory===category.id?'active':'']"
          v-for="(category, index) in categories"
          :key="'category' + category.id"
          @click="switchCategory(category)">{{category.display_name}}</li>
      </ul>
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
      dropdownActive: false,
      categories: []
    }
  },
  computed: {
    activeGame () {
      return parseInt(this.$route.params.gameId)
    },
    activeCategory () {
      return parseInt(this.$route.params.categoryId)
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
      let currentGameId = this.$route.params.gameId
      if (!currentGameId) {
        currentGameId = localStorage.getItem('lastGame') || this.allGames[0].id
      }
      this.categories = this.$store.getters.categoriesByGameId(currentGameId)
      if (!this.categories.length) {
        this.$store.dispatch('fetchCategories', currentGameId)
          .then((res) => {
            if (res) {
              this.categories = res
              this.$router.push(`/${this.path}/${currentGameId}/${this.categories[0].id}`)
            } else {
              this.performLogin()
            }
          })
      } else {
        this.$router.push(`/${this.path}/${currentGameId}/${this.categories[0].id}`)
      }
    }
  },
  name: 'gamemenu',
  methods: {
    switchGame (key) {
      if (key === '-1') {
        return false
      }
      localStorage.setItem('lastGame', key)
      this.categories = this.$store.getters.categoriesByGameId(key)
      if (!this.categories.length) {
        this.$store.dispatch('fetchCategories', key)
          .then((res) => {
            if (res) {
              this.categories = res
              this.$router.push(`/${this.path}/${key}/${this.categories[0].id}`)
            } else {
              this.performLogin()
            }
          })
      } else {
        this.$router.push(`/${this.path}/${key}/${this.categories[0].id}`)
      }
    },
    switchCategory (category) {
      if (!category) {
        return
      }
      this.$router.push({
        path: `/game/${this.$route.params.gameId}/${category.id}`,
        params: { formatting: category.formatting }
      })
    }
  }
}
</script>

<style scoped lang='scss'>
@import "../style/vars.scss";
.game-menu {
  // background: linear-gradient(to bottom, #006bb3, #00397c);
  text-transform: uppercase;
  height: 55px;
}
.game-menu-container {
  background: linear-gradient(to bottom, #006bb3, #00397c);
}
.game-menu-item {
  height: 55px;
  line-height: 55px;
  padding: 0 20px;
  display: inline-block;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  &.active {
    background: rgba(0, 0, 0, 0.29);
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
  font-size: 14px;
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
  right: 40px;
  &:hover {
    background-color: rgba(20, 94, 168, 1);
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
  height: 30px;
  line-height: 30px;
}
</style>
