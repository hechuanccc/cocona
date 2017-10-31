<template>
  <el-main>
    <el-tabs v-model="activeName" @tab-click="switchTab" v-if="categories.length > 0">
      <el-tab-pane v-for="(category, index) in categories" :key="'category' + index" :name="''+category.id" :label="category.display_name" ></el-tab-pane>
    </el-tabs>
    <router-view :key="$route.name + ($route.params.categoryId || '')" />
  </el-main>
</template>

<script>
import { fetchSchedule } from '../../api'

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
    const categoryId = this.$route.params.categoryId
    this.categories = this.$store.getters.categoriesByGameId(this.$route.params.gameId)
    if (!this.categories[this.gameId]) {
      this.$store.dispatch('fetchCategories', this.gameId)
        .then(() => {
          this.categories = this.$store.getters.categoriesByGameId(this.$route.params.gameId)
          if (!categoryId) {
            this.forward(this.categories[0])
          }
        })
    } else if (!categoryId) {
      this.forward(this.categories[0])
    }
    fetchSchedule(this.gameId)
      .then(res => {
      })
  },
  methods: {
    forward (category) {
      if (!category) {
        return
      }
      this.activeName = category.id + ''
      this.$router.push({
        path: `/game/${this.gameId}/${category.id}`,
        params: { formatting: category.formatting }
      })
    },
    switchTab (tab, event) {
      const targetCategory = this.categories[parseInt(tab.index)]
      this.forward(targetCategory)
    }
  }
}
</script>

<style scoped>
</style>
