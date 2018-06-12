<template>
  <div id="home">
    <el-main v-if="isHome">
      <el-carousel indicator-position="inside" height="400px">
        <el-carousel-item v-for="banner in banners" :key="banner.id">
          <div class="banner-img" :style="{backgroundImage: `url(${banner.image})`}"></div>
        </el-carousel-item>
      </el-carousel>
      <el-row class="announcement-wrapper">
        <div class="announcement container" @click="announcementDialogVisible = true">
          <span class="text" :style="{ position:'relative', left: `-${leftOffset}px`}" ref="announcement">{{announcements[currentAnnouncementIndex]}}</span>
        </div>
      </el-row>
      <section v-if="allGames && allGames.length">
        <div class="gamearea-title container">
          <img class="fire-image" src="../assets/popular.png"/>
          <p class="text">热门游戏</p>
        </div>
        <el-row class="gamearea container">
          <div>
            <ul class="clearfix">
              <router-link :to="'/game/'" tag="li" class="list-item game-ad">
                <img class="icon" src="../assets/game-ad.png" alt="More Games"/>
                <p class="text">20 多款游戏，数百种创新玩法</p>
              </router-link>
              <li class="list-item game" v-for="(game, index) in allGames" :key="game.id" v-if="game.icon && index < 9" @click="navigate(game)">
                <div class="game-icon">
                  <img class="img" :src="game.icon" :alt="game.id"/>
                  <p class="name">{{game.display_name}}</p>
                </div>
              </li>
              <router-link class="list-item" :to="'/game/'" tag="li">
                <div class="game-icon more">
                  <img class="img more-game" src="../assets/moregame.png" alt="More Games"/>
                  <p class="name">更多游戏 &raquo;</p>
                </div>
              </router-link>
            </ul>
          </div>
        </el-row>
      </section>
      <el-row class="payments">
        <img class="img" src="../assets/payment.png"/>
      </el-row>
      <el-row v-if="descriptions.length" class="ads container">
        <el-col
          v-for="(item, index) in descriptions"
          :key="index"
          class="ad"
          :offset="descriptions.length === 1? 6 : 0"
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
import { mapGetters } from 'vuex'
import { getBanner, getAnnouncements, getDescription } from '../api'
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
    ...mapGetters([
      'allGames'
    ]),
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
#home {
  background: white;
}

.el-carousel__item .banner-img {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
}
/*announcement*/
.announcement {
  height: 40px;
  margin: auto;
  background-color: #fafafa;
  line-height: 40px;
  overflow: hidden;
  font-size: 14px;
  color: #9b9b9b;
  text-align: left;
  cursor: pointer;
  &-wrapper {
    background: #fafafa;
  }

  .text {
    white-space: nowrap;
  }

  .speaker {
    vertical-align: text-bottom;
  }
}

/*game area*/
.gamearea {
  margin: 40px auto;
  width: 1190px;
  &-title {
    position: relative;
    width: 120px;
    height: 50px;
    margin: 40px auto;
    .text {
      position: absolute;
      left: 0;
      bottom: 0;
      font-size: 20px;
      color: #4a4a4a;
      z-index: 1;
    }
    .fire-image {
      position: absolute;
      top: 0;
      right: 0;
      height: 50px;
      z-index: 2;
    }
  }

  .list-item {
    cursor: pointer;
    float: left;
    position: relative;
    width: 169px;
    height: 169px;
    margin-right: -1px;
    margin-bottom: -1px;
    border: solid 1px #dedede;
    overflow: hidden;
    text-align: center;
  }

  .game-ad {
    height: 339px;
    width: 339px;
    .icon {
      height: 260px;
      width: 100%;
    }
    .text {
      font-size: 18px;
      line-height: 55px;
      text-align: center;
      color: #4a4a4a;
    }
  }
}

.game-icon {
  height: 100%;
  transition: all .3s ease;
  &:hover {
    background-color: #f8fbff;
    .name {
      color: #156fd8;
    }
    .img {
      box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.5);
      &.more-game {
        box-shadow: none;
      }
    }
  }

  .img {
    top: 22px;
    transform: translateY(20%);
    transition: all .3s ease;
    line-height: 100px;
    width: 100px;
    height: 100px;
    border-radius: 100%;
  }

  .name {
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

  &.more {
    .img {
      border-radius: 0%;
    }
    .name {
      color: #4a90e2;
    }
  }
}

.payments {
  text-align: center;
  margin: 0 auto;
  background-color: #f6f6f6;
  .img {
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
