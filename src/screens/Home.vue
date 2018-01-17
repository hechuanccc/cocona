<template>
  <div id="app">
      <el-main v-if="isHome">
        <el-carousel indicator-position="inside" height="500px">
          <el-carousel-item v-for="banner in banners" :key="banner.id">
            <div class="banner-img" :style="{backgroundImage: `url(${banner.image})`}"></div>
          </el-carousel-item>
        </el-carousel>
        <el-row class="announcement-wp">
          <div class="announcement container" @click="announcementDialogVisible = true">
            <div class="title">
              <icon class="speaker" color="#666" scale="1" name="bullhorn"></icon>
              <span class="text">{{$t('announcement.speaker')}}</span>
            </div>
            <div class="content">
              <span class="text"
                :style="{
                  'opacity': announcementStyle.opacity,
                  'transform': `translateY(${announcementStyle.translateY}px)`
                }">
                {{currentAnnouncement}}
              </span>
            </div>
          </div>
        </el-row>
        <el-row class="game-area container">
          <h2>热门游戏</h2>
          <ul class="clearfix">
            <li v-for="(game, index) in games" :key="game.id" v-if="game.icon && index < 8" @click="navigate(game)" class="game-bg" :style="
                {
                  backgroundImage: game.bg_icon ? `url('${game.bg_icon}')` :''
                }
              ">
              <div class="game-icon">
                <img :src="game.icon" :alt="game.id">
              </div>
            </li>
          </ul>
          <div class="action">
            <el-button round type="primary" size="large" @click.native="$router.push('/game/')">更多游戏 &raquo;</el-button>
          </div>
        </el-row>
       <el-row class="ads container">
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
              <img :src="item.main_image" v-if="item.main_image" />
              <p class="content-text" v-if="item.main_description" v-html="formattedText(item.main_description)"></p>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-main v-else>
        <router-view/>
      </el-main>
    <el-dialog
      :title="$t('announcement.speaker')"
      :visible.sync="announcementDialogVisible"
      :width="'600px'"
      @close="showCurrentAnnouncementInPopup = true"
      center>
      <el-carousel :height="'200px'"
        @change="showCurrentAnnouncementInPopup = false"
        class="announcement-popup"
        :initial-index="currentAnnouncementIndex">
        <el-carousel-item v-for="item in announcements"
          :key="item.rank">
          <p v-if="showCurrentAnnouncementInPopup && announcements[currentAnnouncementIndex]" class="text-center" key="announcement">
            {{announcements[currentAnnouncementIndex].announcement || ''}}
          </p>
          <p class="text-center" key="announcement" v-else>
            {{ item.announcement }}
          </p>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
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
      announcementStyle: {
        opacity: 1,
        translateY: 0
      },
      currentAnnouncementIndex: 0,
      announcementDialogVisible: false,
      showCurrentAnnouncementInPopup: true
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
    },
    currentAnnouncement () {
      if (this.announcements[this.currentAnnouncementIndex]) {
        return this.announcements[this.currentAnnouncementIndex].announcement
      } else {
        return ''
      }
    }
  },
  methods: {
    animate () {
      setTimeout(() => {
        if (this.announcementStyle.opacity <= 0) {
          this.currentAnnouncementIndex = (this.currentAnnouncementIndex + 1) % this.announcements.length
          this.announcementStyle.opacity = 1
          this.announcementStyle.translateY = 0
          setTimeout(() => {
            this.animate()
          }, 5000)
        } else {
          this.announcementStyle.opacity -= 0.05
          this.announcementStyle.translateY -= 1
          this.animate()
        }
      }, 100)
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

        if (this.announcements.length > 0) {
          this.announcements.sort((a, b) => {
            return a.rank - b.rank
          })
          setTimeout(() => {
            this.animate()
          }, 5000)
        }
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
.el-carousel__item .banner-img {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
}

.announcement-wp {
  background: #fff;
}
.announcement {
  margin: auto;
  overflow: hidden;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  color: #4a4a4a;
  cursor: pointer;
  .title {
    display: inline-block;
    float: left;
    .text {
      color: #666;
      display: inline-block;
      margin-left: 5px;
      font-size: 13px;
    }
  }
  .content {
    display: inline-block;
    .text {
      padding-left: 20px;
      width: 100%;
      overflow: hidden;
    }
  }
  .speaker {
    vertical-align: text-bottom;
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

.game-area {
  margin: 0 auto;
  h2 {
    text-align: center;
    font-size: 16px;
    color: #333;
    padding: 20px 0;
  }
  li {
    cursor: pointer;
    float: left;
    overflow: hidden;
    width: 25%;
    height: 320px;
    line-height: 320px;
    position: relative;
    text-align: center;
  }
  .action {
    text-align: center;
    padding: 20px 0 0;
  }
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

.ads {
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

.content-text {
  font-size: 12px;
  font-weight: 500;
  line-height: 2;
  text-align: left;
  color: #878787;
  height: 100%;
  overflow: hidden;
}

.el-main {
  padding: 0;
}

.el-carousel.announcement-popup /deep/ .el-carousel__button {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: black;
}

</style>
