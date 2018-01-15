<template>
  <el-row class="row-bg">
    <div class="container">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('navMenu.draw_history')}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="history-container" v-loading="childLoading">
        <div class="aside">
          <AsideMenu @clicked="onClickChild" :items="games ? games : []" :defaultActive="active"/>
        </div>
        <router-view @load="load"></router-view>
      </div>
    </div>
  </el-row>
</template>


<script>
import { fetchGames } from '../../api'
import AsideMenu from '../../components/AsideMenu.vue'

export default {
  data () {
    return {
      games: '',
      childLoading: false
    }
  },
  methods: {
    onClickChild (e) {
      this.$router.push({name: 'Schedules', params: {gameCode: e}})
    },
    load (e) {
      this.childLoading = e
    }
  },
  components: {
    AsideMenu
  },
  computed: {
    active () {
      return this.$route.params.gameCode ? this.$route.path : '/gamehistory/' + this.$store.getters.allGames[0].code
    }
  },
  created () {
    fetchGames().then(
      games => {
        if (!games) {
          return
        }
        games.forEach((game) => {
          game.route = '/gamehistory/' + game.code
        })
        this.games = games
        if (!this.$route.params.gameCode) {
          this.$router.push('/gamehistory/' + games[0].code)
        }
      }
    )
  },
  watch: {
    '$route.params.gameCode': function (to, from) {
      if (!to) {
        this.$router.push('/gamehistory/' + this.games[0].code)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../style/vars.scss";

.history-container {
  height: 100%;
  min-height: 100vh;
  .aside, .main {
    display: inline-block;
  }
  .aside {
    vertical-align: top;
  }
  .main {
    width: $main_width;
  }
}
.game-nav {
  text-decoration: none;
}
</style>
