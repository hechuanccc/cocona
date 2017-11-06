<template>
  <div id="app">
    <el-container>
      <el-header height="20px">
        <TopBar />
      </el-header>

      <el-main v-if="isHome">
        <el-row class="home-title" :gutter="10">
          <el-col :span="6">
            <div class="title__logo">
              <img :src="title.icon">
              <!-- <span><h1>{{title.name}}</h1> <h2>{{title.second_name}}</h2><h3>{{title.description}}</h3> </span> -->
            </div>
          </el-col>
          <el-col :span="18">
            <NavMenu />
          </el-col>
        </el-row>

        <el-row class="home-banner">
          <el-carousel indicator-position="inside" height="300px">
            <el-carousel-item v-for="banner in banners" :key="banner.id">
              <img :src="banner.image" :alt="banner.image">
            </el-carousel-item>
          </el-carousel>
        </el-row>
        <el-row class="home-marquee">
          <marquee direction=”right”>
            <span v-for="announcement in announcements" :key="announcement.id">{{ announcement.announcement }}</span>
          </marquee>
        </el-row>
        <el-row class="home-something1">
          <el-col :span="6">
            <el-aside class="sth1-aside" width="250px">
              <!-- sssffd -->
            </el-aside>
          </el-col>
          <el-col :span="17" class="sth1-content" :offset="1">
            <!-- sss -->
          </el-col>
        </el-row>
        <el-footer class="home-footer">
          <!-- fff -->
        </el-footer>

      </el-main>
      <el-main v-else>
        <router-view/>
      </el-main>
    </el-container>
  </div>
</template>





<script>
  import TopBar from '../components/TopBar'
  import NavMenu from '../components/NavMenu'

  import {
    getBanner,
    getAnnouncements,
    gethomePage
  } from '../api'

  export default {
    name: 'home',
    data () {
      return {
        banners: '',
        announcements: '',
        title: ''
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
          console.log(response)
          this.banners = response.data
        },
        response => {
          console.log(response)
        }
      )
      getAnnouncements().then(
        response => {
          console.log(response.data)
          this.announcements = response.data
        },
        response => {}
      )
      gethomePage().then(
        response => {
          console.log(response.data)
          this.title = response.data
        },
        response => {

        }
      )
    },
    components: {
      TopBar,
      NavMenu
    }
  }
</script>

<style scoped>
  #app {
    width: 1000px;
    margin: 0 auto;
  }

  .el-carousel__item img {
    width: 100%;
    height: 300px;
  }
  .title__logo img {
    height: 60px;
    width: 100%;
  }
  .el-row {
    margin-bottom: 5px
  }
  .home-marquee{
    color: white;
    background-color: #409EFF;
    letter-spacing: 3px;
  }
  .sth1-aside {
    height: 300px;
    background-color: #409EFF;
  }
  .sth1-content {
    height: 300px;
    background-color: #409EFF;
  }
  .home-footer {
    background-color: #409EFF;
  }
</style>