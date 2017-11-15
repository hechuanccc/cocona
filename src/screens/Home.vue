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
          <ul>
            <li v-for="game in games" :key="game.id" v-if="game.icon" @click="navigate(game)">
              <span class="icon-wp">
                <img class="icon" :src="game.icon" :alt="game.id" width="100" height="100">
                <el-button type="primary">进入投注</el-button>
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
        // show popup here
      }
    }
  },
  created () {
    getBanner().then(
      response => {
        this.banners = response.data
      }
    )
    getAnnouncements().then(
      response => {
        this.announcements = response.data
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
/* footer */
  .home-footer {
    background-color: #433e81;
    padding-top: 20px;
  }
  .home-footer ul{
    display: inline-block;
    width: 20%;
    color: #ffffff;
    font-size: 16px
  }
  .home-footer i{
    font-size: 28px;
    padding-right: 7px;
    color: #ffffff;
    vertical-align: middle
  }
/* marquee */
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


/* game-area */
  .game-area ul{
    position: relative;
    overflow: hidden;
    margin-top: 19px;
    background: #fff;
    border-right: 1px solid #e6e6e6;
  }

  .game-area li {
    cursor: pointer;
    float: left;
    width: 16.66%;
    position: relative;
    text-align: center;
    overflow: hidden;
  }
  .icon {
    display: block;
    margin: 0 auto 10px;
  }
  .icon-wp {
    text-align: center;
    padding: 10px;
    margin-right: -1px;
    display: block;
    border-style: bold;
    border: 1px solid #e6e6e6;
  }
/* lay over the default padding */
  .el-main {
    padding: 0
  }

</style>
