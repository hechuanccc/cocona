<template>
  <ul class="emojis">
    <li class="emoji clickable"
      @click="handleEmojiClick(emoji)"
      v-for="(emoji, index) in emojis"
      :key="index">
      <span>{{emoji.emoji}}</span>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    emojis: {
      type: Array
    }
  },
  methods: {
    handleEmojiClick (emoji) {
      this.$emit('emojiClick', emoji)
    }
  }
}
</script>

<style lang="scss" scoped>
.emojis {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}

.emoji {
  font-size: 24px;
  padding: 3px 3px 0 3px;
  border: 2px solid transparent;
  margin: 0 7px;

  &:hover {
    border-color: #ff5a00;
  }
}
</style>
