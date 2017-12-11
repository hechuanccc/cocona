<template>
  <div id="app">
    <el-container>
      <el-main v-if="isHome">
        <el-carousel indicator-position="inside" height="370px">
          <el-carousel-item v-for="banner in banners" :key="banner.id">
            <img :src="banner.image" :alt="banner.image" />
          </el-carousel-item>
        </el-carousel>
        <div class="home-speaker">
          <div class="container">
            <div class="wrap">
              <marquee behavior="" direction="">
                <span v-for="announcement in announcements" :key="announcement.id">
                  {{announcement.announcement}}
                </span>
              </marquee>
            </div>
          </div>
        </div>
        <el-row class="game-area container">
          <h3 class="section-title">热门彩票</h3>
          <ul>
            <li v-for="(game, index) in games" :key="game.id" v-if="game.icon && index < 13" @click="navigate(game)" >
              <span class="icon-wp">
                <img class="icon" :src="game.icon" :alt="game.id" width="100" height="100">
                <el-button type="primary" plain>进入投注</el-button>
              </span>
            </li>
          </ul>
        </el-row>
      </el-main>
      <el-main v-else>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getBanner, getAnnouncements, fetchGames } from '../api'

export default {
  name: 'home',
  data () {
    return {
      banners: '',
      announcements: '',
      games: ''
    }
  },
  computed: {
    isHome () {
      return this.$store.state.route.path === '/'
    }
  },
  methods: {
    navigate (game) {
      if (this.$store.state.user.logined) {
        this.$router.push(`/game/${game.id}/`)
      } else {
        this.$store.commit('SHOW_LOGIN_DIALOG')
      }
    }
  },
  created () {
    if (this.$route.query.login) {
      this.$store.commit('SHOW_LOGIN_DIALOG')
    }
    getBanner().then(
      response => {
        this.banners = response
      }
    )
    getAnnouncements().then(
      response => {
        this.announcements = response
      }
    )
    fetchGames().then(
      games => {
        this.games = games
      }
    )
  }
}
</script>

<style scoped>
/* banner */
.el-carousel__item img {
  width: 100%;
  height: 370px;
}

.home-speaker {
  height: 36px;
  width: 100%;
  background: #433e81;
}
.home-speaker .wrap {
  padding-left: 105px;
  height: 36px;
  color: #ddd;
  background: url(../assets/account.png) no-repeat left center;
}
.wrap marquee{
  line-height: 36px;
  font-size: 14px;
  width: 1195px;
}

.game-area {
  margin-top: 20px;
}

.section-title {
  font-size: 16px;
  margin: 0 0 10px 5px;
  color: #666;
}

.game-area li {
  cursor: pointer;
  float: left;
  width: 16.66%;
  position: relative;
  text-align: center;
}
.icon {
  display: block;
  margin: 0 auto 20px;
}
.icon-wp {
  background: #fff;
  text-align: center;
  margin: 5px;
  padding: 20px 10px 10px;
  display: block;
}
/* lay over the default padding */
.el-main {
  padding: 0
}

</style>
