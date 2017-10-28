<template>
  <el-main>
    <el-tabs v-model="activeName" @tab-click="switchTab" v-if="categories.length > 0">
      <el-tab-pane v-for="(category, index) in categories" :key="'category' + index" :name="''+category.id" :label="category.display_name" ></el-tab-pane>
    </el-tabs>
    <router-view :key="$route.name + ($route.params.categoryId || '')" keep-alive/>
  </el-main>
</template>

<script>
import { fetchCategories, fetchSchedule } from '../../api'

export default {
  name: 'game',
  data () {
    return {
      activeName: this.$route.params.categoryId,
      categories: [],
      gameId: this.$route.params.gameId
    }
  },
  components: {
  },
  created () {
    fetchCategories(this.gameId)
      .then(res => {
        this.categories = res
        if (!this.activeName) {
          this.activeName = this.activeName || res[0].id
          this.$router.push(`/game/${this.gameId}/${this.activeName}`)
        }
      })

    fetchSchedule(this.gameId)
      .then(res => {
        console.log(res)
      })
  },
  methods: {
    switchTab (tab, event) {
      const targetCategory = this.categories[parseInt(tab.index)]
      this.$router.push(`/game/${this.gameId}/${targetCategory.id}`)
    }
  }
}
</script>

<style scoped>
</style>
