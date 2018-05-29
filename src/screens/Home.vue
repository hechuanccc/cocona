<template>
  <div id="home">
      <el-main v-if="isHome">
        <el-carousel indicator-position="inside" height="400px">
          <el-carousel-item v-for="banner in banners" :key="banner.id">
            <div class="banner-img" :style="{backgroundImage: `url(${banner.image})`}"></div>
          </el-carousel-item>
        </el-carousel>
        <el-row class="announcement-wp">
          <div class="announcement container" @click="announcementDialogVisible = true">
            <span class="text" :style="{ position:'relative', left: `-${leftOffset}px`}" ref="announcement">{{announcements[currentAnnouncementIndex]}}</span>
          </div>
        </el-row>
        <div class="popular-game container">
          <img src="../assets/popular.png"/>
          <p>热门游戏</p>
        </div>
        <el-row class="game-area container">
          <div class="games">
            <ul class="clearfix">
              <router-link :to="'/game/'" tag="li" class="game-ad">
                <img src="../assets/game-ad.png" alt="More Games"/>
                <p>20 多款游戏，数百种创新玩法</p>
              </router-link>
              <li v-for="(game, index) in games" :key="game.id" v-if="game.icon && index < 9" @click="navigate(game)">
                <div class="game-icon">
                  <img :src="game.icon" :alt="game.id"/>
                  <p>{{game.display_name}}</p>
                </div>
              </li>
              <router-link :to="'/game/'" tag="li" class="action">
                <div class="game-icon">
                  <img src="../assets/moregame.png" id="more-game" alt="More Games"/>
                  <p>更多游戏 &raquo;</p>
                </div>
              </router-link>
            </ul>
          </div>
        </el-row>
        <el-row class="payments">
          <img src="../assets/payment.png"/>
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
      <FloatAd v-if="$store.state.systemConfig.floatAd" :content="$store.state.systemConfig.floatAd" :floatAdVisible="floatAdVisible" @switchFloatAd="switchFloatAd"/>
    <el-dialog
      :title="$t('announcement.speaker')"
      :visible.sync="announcementDialogVisible"
      :width="'600px'"
      center>
      <el-carousel :height="'200px'"
        v-if="announcementDialogVisible"
        class="announcement-popup"
        :initial-index="currentAnnouncementIndex">
        <el-carousel-item v-for="(announcement, index) in announcements"
          :key="index">
          <p class="text-center" key="announcement">
            {{ announcement }}
          </p>
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>

<script>
import { getBanner, getAnnouncements, fetchGames, getDescription } from '../api'
import 'vue-awesome/icons/bullhorn'
import FloatAd from '../components/FloatAd'

export default {
  components: {
    FloatAd
  },
  name: 'home',
  data () {
    return {
      banners: [],
      announcements: [],
      games: '',
      descriptions: '',
      announcementWidth: 0,
      leftOffset: 0,
      announcementTimer: null,
      currentAnnouncementIndex: 0,
      announcementDialogVisible: false,
      floatAdVisible: false
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
    switchFloatAd () {
      this.floatAdVisible = !this.floatAdVisible
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
    },
    setAnnouncement () {
      this.$nextTick(() => {
        this.announcementWidth = this.$refs.announcement.offsetWidth
        this.announcementTimer = setTimeout(() => {
          this.scrollAnnouncement()
        }, 1000)
      })
    },
    scrollAnnouncement () {
      this.announcementTimer = setTimeout(() => {
        this.leftOffset += 1
        if (this.leftOffset > this.announcementWidth) {
          let idx = this.currentAnnouncementIndex + 1
          if (idx >= this.announcements.length) {
            idx = idx % this.announcements.length
          }
          this.announcementTimer = setTimeout(() => {
            this.currentAnnouncementIndex = idx
            this.leftOffset = 0
            this.setAnnouncement()
          }, 1000)
        } else {
          this.scrollAnnouncement()
        }
      }, 17)
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
        const datas = []
        result.forEach((item) => {
          if (item.platform !== 0) {
            datas.push(item)
          }
        })

        if (datas.length > 0) {
          datas.sort((a, b) => {
            return a.rank - b.rank
          })
        }
        this.announcements = datas.map(data => data.announcement)
        this.setAnnouncement()
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
    clearTimeout(this.announcementTimer)
    clearInterval(this.interval)
  },
  mounted () {
    this.floatAdVisible = true
  }
}
</script>

<style lang="scss" scoped>
/* banner */
#home {
  background: white;
}
.el-carousel__item .banner-img {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
}

.announcement-wp {
  background: #fafafa;
}
.announcement {
  margin: auto;
  overflow: hidden;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  background-color: #fafafa;
  color: #9b9b9b;
  cursor: pointer;
  text-align: left;
  .text {
    white-space: nowrap;
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
.popular-game {
  width: 120px;
  height: 50px;
  margin: 40px auto;
  position: relative;
  p {
    left: 0;
    bottom: 0;
    font-size: 20px;
    color: #4a4a4a;
    z-index: 1;
    position: absolute;
  }
  img {
    top: 0;
    right: 0;
    height: 50px;
    z-index: 2;
    position: absolute;
  }
}

.game-area {
  margin: 40px auto;
  width: 1190px;

  li.game-ad {
    height: 339px;
    width: 339px;
    img {
      height: 260px;
      width: 100%;
    }
    p {
      font-size: 18px;
      line-height: 55px;
      text-align: center;
      color: #4a4a4a;
    }
  }

  li {
    cursor: pointer;
    float: left;
    overflow: hidden;
    width: 169px;
    height: 169px;
    margin-right: -1px;
    margin-bottom: -1px;
    border: solid 1px #dedede;
    position: relative;
    text-align: center;
  }

  li.action {
    p {
      color: #4a90e2;
    }
    img#more-game {
      border-radius: 0%;
    }
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

.game-icon {
  height: 100%;
  transition: all .3s ease;
  &:hover {
    background-color: #f8fbff;
    p {
      color: #156fd8;
    }
    img {
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.5);
    }
    img#more-game {
      box-shadow: none;
    }
  }
}

.game-icon img {
  top: 22px;
  transform: translateY(20%);
  transition: all .3s ease;
  line-height: 100px;
  width: 100px;
  height: 100px;
  border-radius: 100%;
}

.game-icon p {
  position: absolute;
  margin: 0 auto;
  bottom: 11px;
  font-size: 14px;
  font-weight: 400;
  text-transform: uppercase;
  width: 100%;
  height: 28px;
  line-height: 28px;
  color: #4a4a4a;
  transition: all .3s ease;
}

.payments {
  text-align: center;
  margin: 0 auto;
  background-color: #f6f6f6;
  img {
    margin: 30px auto;
    width: 469px * 0.8;
    height: 60px * 0.8;
  }
}

.ads {
  text-align: center;
  margin: 0 auto;
  margin-bottom: 50px;
  padding: 0 24px;
}
.ad {
  margin-top: 57px;
  padding-top: 5px auto;
}
.ad-title {
  width: 250px;
  height: 50px;
  margin: 0 auto;
  margin-bottom: 20px;
  text-align: center;
}

.content-text {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.71;
  text-align: left;
  color: #9b9b9b;
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
