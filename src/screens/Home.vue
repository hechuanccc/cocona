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
          <div class="inner">
            <div class="wrap">
              <marquee behavior="" direction="">
                <span v-for="announcement in announcements" :key="announcement.id">
                  {{announcement.announcement}}
                </span>
              </marquee>
            </div>
          </div>
        </div>
        <el-row class="game-area">
          <ul>
            <li v-for="game in games" :key="game.id">
              <img :src="game.icon" :alt="game.id">
            </li>
          </ul>
        </el-row>
        <div class="game-feature" :gutter="20">
          <!--static data-->
          <div class="feat-service">
            <h1>為理基花背</h1> 內時聞海提出主面必調的為化。育麼活研件怎斷和熱到大好。相的長管從子！處取金公。 發公得輕成以深名是陸道南條微賣快家麼評真特小世？以有看安。文石遊展布站情口減且禮費手同不公，羅習著下筆會！本生價表消收展入高人，日該多公！法影去非生十。創正道雜倒福中小經開不如體確連議館得標會願護長很原和，去書地才經心功聞心了？公況候小運備說風算那張，正本謝小學戲能難解開得晚情官什士所會。論臺留曾，地康的，知朋然異主展表出現走差不死是百到且奇另：資的運找業我本選言急度安子我：公指細可引地受一是生定求常百樣球不招兒事意多有畫真出心？天巴一現一去開客中是國的立數一力多答導希？
            心兩少我……資分最中。各陸難廠可差都張書外本嗎不員？要也小證投業該後很此歌青目的，且出事看國起朋大放我養結唱配在目。治認積保的目，長臺明顧：在的多學主設只中觀手愛相包場數！縣如分格中覺父力間期到回不不見友象說會。望時簡不當，在山養。委下可國。於樹容利人過天問死魚不不眼視園禮。
          </div>
          <div class="feat-product">
            <h1>花問道感造紀看</h1> 內時聞海提出主面必調的為化。育麼活研件怎斷和熱到大好。相的長管從子！處取金公。 發公得輕成以深名是陸道南條微賣快家麼評真特小世？以有看安。文石遊展布站情口減且禮費手同不公，羅習著下筆會！本生價表消收展入高人，日該多公！法影去非生十。創正道雜倒福中小經開不如體確連議館得標會願護長很原和，去書地才經心功聞心了？公況候小運備說風算那張，正本謝小學戲能難解開得晚情官什士所會。論臺留曾，地康的，知朋然異主展表出現走差不死是百到且奇另：資的運找業我本選言急度安子我：公指細可引地受一是生定求常百樣球不招兒事意多有畫真出心？天巴一現一去開客中是國的立數一力多答導希？
            心兩少我……資分最中。各陸難廠可差都張書外本嗎不員？要也小證投業該後很此歌青目的，且出事看國起朋大放我養結唱配在目。治認積保的目，長臺明顧：在的多學主設只中觀手愛相包場數！縣如分格中覺父力間期到回不不見友象說會。望時簡不當，在山養。委下可國。於樹容利人過天問死魚不不眼視園禮。
          </div>
          <div class="feat-local">
            <h1>第一新近我趣苦等有開司們</h1> 內時聞海提出主面必調的為化。育麼活研件怎斷和熱到大好。相的長管從子！處取金公。 發公得輕成以深名是陸道南條微賣快家麼評真特小世？以有看安。文石遊展布站情口減且禮費手同不公，羅習著下筆會！本生價表消收展入高人，日該多公！法影去非生十。創正道雜倒福中小經開不如體確連議館得標會願護長很原和，去書地才經心功聞心了？公況候小運備說風算那張，正本謝小學戲能難解開得晚情官什士所會。論臺留曾，地康的，知朋然異主展表出現走差不死是百到且奇另：資的運找業我本選言急度安子我：公指細可引地受一是生定求常百樣球不招兒事意多有畫真出心？天巴一現一去開客中是國的立數一力多答導希？
            心兩少我……資分最中。各陸難廠可差都張書外本嗎不員？要也小證投業該後很此歌青目的，且出事看國起朋大放我養結唱配在目。治認積保的目，長臺明顧：在的多學主設只中觀手愛相包場數！縣如分格中覺父力間期到回不不見友象說會。望時簡不當，在山養。委下可國。於樹容利人過天問死魚不不眼視園禮。
          </div>
        </div>
        <el-footer class="home-footer" height="70px">
          <!--static data-->
          <div class="inner">
            <ul>
              <li>
                <i class="el-icon-info"></i>INFORMATION</li>
            </ul>
            <ul>
              <li>
                <i class="el-icon-question"></i>QUESTION</li>
            </ul>
            <ul>
              <li>
                <i class="el-icon-phone"></i>CONTACT US</li>
            </ul>
            <ul>
              <li>
                <i class="el-icon-setting"></i>SETTING</li>
            </ul>
          </div>
          <br/>
        </el-footer>
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
  .inner {
    width: 1000px;
    margin: 0 auto;
    text-align: center
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
    width: 895px;
  }
/* game-area */
  .game-area ul{
    position: relative;
    left: 50%;
    overflow: hidden;
    width: 780px;
    float: left;
    margin-top: 19px;
    margin-left: -390px;
    background: #fff;
    border-left: 1px solid #e6e6e6;
  }

  .game-area ul li {
    float: left;
    width: 194px;
    height: 125px;
    padding-top: 18px;
    position: relative;
    text-align: center;
    border-top: 1px solid #e6e6e6;
    border-right: 1px solid #e6e6e6;
    border-bottom: 1px solid #e6e6e6;
  }
  .game-feature {
    width: 1000px;
    margin: 0 auto;
    text-align: center;
  }
  .game-feature > div{
    display: inline-block;
    width: 300px;
    margin-bottom: 20px;
  }

  .feat-product {
    margin: 0 10px
  }
  .game-feature h1{
    font-weight: bold;
    font-size: 18px;
    margin-bottom: 10px
  }

/* lay over the default padding */
  .el-main {
    padding: 0
  }

</style>
