<template>
  <div class="box-card">
    <p v-if="article" v-html="article"></p>
  </div>
</template>

<script>
import {fetchArticle} from '../../api'
export default {
  name: 'AgentPlan',
  data () {
    return {
      article: ''
    }
  },
  created () {
    fetchArticle().then(data => {
      this.article = data.description.replace(/(\r\n|\r|\n)/g, '<br/>')
    })
  }
}
</script>

