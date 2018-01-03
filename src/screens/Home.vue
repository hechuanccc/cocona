<template>
  <div id="app">
    <el-container>
      <el-main class="container" v-if="isHome">
        <el-carousel indicator-position="inside" height="500px">
          <el-carousel-item v-for="banner in banners" :key="banner.id">
            <img :src="banner.image" :alt="banner.image" />
          </el-carousel-item>
        </el-carousel>
        <el-row class="container">
          <div class="announcement">
            <div class="left">
              <icon class="speaker m-l-xlg" scale="1.25" name="bullhorn"></icon>
              <span class="text m-l">{{$t('announcement.speaker')}}</span>
            </div>
            <div class="right text-center">
              <span class="content text-center"
                v-if="announcements.length"
                :style="{
                  'opacity': nowAnnouncement.transition.opacity,
                  'transform': `translateY(${nowAnnouncement.transition.translateY}px)`
                }">
                {{announcements[nowAnnouncement.index].announcement}}
              </span>
            </div>
          </div>
        </el-row>
        <el-row class="game-area">
          <ul>
            <li v-for="(game, index) in games" :key="game.id" v-if="game.icon && index < 9" @click="navigate(game)" class="game-bg" :style="
                {
                  backgroundImage: game.bg_icon ? `url('${game.bg_icon}')` :''
                }
              ">
              <div class="game-icon">
                <img :src="game.icon" :alt="game.id">
              </div>
            </li>
          </ul>
        </el-row>
        <el-row class="ads">
          <el-col
            v-for="(item, index) in descriptions"
            class="ad"
            :key="item.id"
            :offset="descriptions.length===1?6:0"
            :span="dynamicAdWidth"
            >
            <div class="ad-title">
              <img :src="item.header_image" :alt="item.id" />
            </div>
            <div :class="[`ad-content${descriptions.length}`]">
              <img class="content-img" :src="item.main_image" v-if="item.main_image" />
              <p class="content-text" v-if="item.main_description" v-html="formattedText(item.main_description)"></p>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-main v-else>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>


<script>
import { getBanner, getAnnouncements, fetchGames, getDescription } from '../api'
import 'vue-awesome/icons/bullhorn'

export default {
  name: 'home',
  data () {
    return {
      banners: [],
      announcements: [],
      games: '',
      descriptions: '',
      nowAnnouncement: {
        index: 0,
        transition: {
          opacity: 1,
          translateY: 0
        }
      }
    }
  },
  computed: {
    isHome () {
      return this.$store.state.route.path === '/'
    },
    dynamicAdWidth () {
      let length = this.descriptions.length
      if (length === 1) {
        return 12
      } else {
        return 24 / length
      }
    }
  },
  methods: {
    announcementTransition () {
      if (this.announcements) {
        this.interval = setInterval(() => {
          if (this.nowAnnouncement.index >= this.announcements.length) this.nowAnnouncement.index = 0

          this.nowAnnouncement.transition.opacity = 1
          this.nowAnnouncement.transition.translateY = 0

          setTimeout(() => {
            this.transitionInterval = setInterval(() => {
              this.nowAnnouncement.transition.opacity -= 0.1
              this.nowAnnouncement.transition.translateY -= 1
              if (this.nowAnnouncement.transition.opacity < 0) {
                this.nowAnnouncement.index++
                clearInterval(this.transitionInterval)
              }
            }, 100)
          }, 3000)
        }, 5000)
      }
    },
    navigate (game) {
      if (this.$store.state.user.logined) {
        this.$router.push(`/game/${game.id}/`)
      } else {
        this.$store.commit('SHOW_LOGIN_DIALOG')
      }
    },
    formattedText (texts) {
      return texts.split('\r\n\r\n').join('<br/>')
    }
  },
  created () {
    if (this.$route.query.login) {
      this.$store.commit('SHOW_LOGIN_DIALOG')
    }
    getBanner().then(
      result => {
        result.forEach((item) => {
          if (item.platform !== 0) {
            this.banners.push(item)
          }
        })
        this.banners.sort((a, b) => {
          return a.rank - b.rank
        })
      }
    )
    getAnnouncements().then(
      result => {
        result.forEach((item) => {
          if (item.platform !== 0) {
            this.announcements.push(item)
          }
        })

        this.announcements.sort((a, b) => {
          return a.rank - b.rank
        })

        this.announcementTransition()
      }
    )
    fetchGames().then(
      games => {
        this.games = games
      }
    )
    getDescription().then(response => {
      this.descriptions = response
    })
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style lang="scss" scoped>
/* banner */
.el-carousel__item img {
  width: 100%;
  height: 100%;
}

/* announcement */
.announcement {
  display: inline-block;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  letter-spacing: 1.6px;
  color: #4a4a4a;
  background-color: #f9f9f9;
  .left {
    display: inline;
  }
  .right {
    display: inline;
    .content {
      position: absolute;
      top: 0;
      display: inline-block;
      box-sizing: border-box;
      padding-left: 140px;
      width: 100%;
      overflow: hidden;
    }
  }
  .speaker {
    vertical-align: text-bottom;
  }
  .text {
    display: inline-block;
  }
}

/*game area*/
.flag {
  position: absolute;
  display: inline-block;
  width: 133px;
  height: 67px;
  background: url("../assets/icon-hot@.png") no-repeat;
  background-size: contain;
  background-position: center center;
  left: 50%;
  top: -2px;
  transform: translateX(-50%);
  z-index: 1;
  text-align: center;
}

.flag .flag-text {
  display: inline-block;
  margin-top: 16px;
  font-size: 24px;
  font-weight: 500;
  color: #ffffff;
}

.game-area li {
  cursor: pointer;
  float: left;
  width: 25%;
  height: 360px;
  line-height: 360px;
  position: relative;
  text-align: center;
}

.game-bg {
  background-size: cover;
  background-position: center center;
}

.game-bg:before {
  content: "";
  display: inline-block;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(39, 40, 34, 0.5);
}

.game-icon img {
  top: 50%;
  transform: translateY(50%);
  line-height: 150px;
  width: 150px;
  height: 150px;
}

/*advertisement*/
.ads {
  width: 1060px;
  text-align: center;
  margin: 80px auto;
}
.ad {
  padding: 0 10px;
}
.ad-title {
  width: 250px;
  height: 50px;
  margin: 0 auto;
  margin-bottom: 20px;
  text-align: center;
}

.ad-title img {
  width: 100%;
  height: 100%;
}

.ad-content4 {
  height: 300px;
}

.ad-content3 {
  height: 300px;
}

.ad-content2 {
  height: 400px;
}

.content-text {
  font-size: 12px;
  font-weight: 500;
  line-height: 2;
  letter-spacing: 0.5px;
  text-align: left;
  color: #878787;
  height: 100%;
  overflow: hidden;
}

.content-img {
  width: 100%;
}

/* lay over the default padding */
.el-main {
  padding: 0;
}
</style>
