<template>
  <div>
    <el-carousel ref="stickerCarousel"
      indicator-position="none"
      arrow="never"
      height="230px"
      :autoplay="false"
      class="stickers-packs">
      <el-carousel-item v-for="(sticker, index) in stickerGroups"
        :name="sticker.name"
        :key="index">
        <ul class="sticker-container">
          <li class="sticker-pack m-l m-r m-t"
            v-for="(item, index) in stickers[sticker.name]"
            :key="index">
            <img class="sticker-img clickable"
              @click="sendSticker(item, roomId)"
              :src="item.url"
              :alt="index"/>
          </li>
        </ul>
      </el-carousel-item>
     </el-carousel>
     <div class="indicators">
        <div :class="['indicator','clickable', {active: nowSticker === sticker.name}]"
          @click="switchStickers(sticker.name)"
          v-for="(sticker, index) in stickerGroups"
          :key="index">
          <img class="img" v-if="sticker.logo" :src="sticker.logo" alt="sticker.logo"/>
          <span class="text" v-else>{{sticker.display_name | truncate(3)}}</span>
        </div>
     </div>
  </div>
</template>

<script>
import Vue from 'vue'

Vue.filter('truncate', function (text, stop) {
  return text.slice(0, stop) + (stop < text.length ? '...' : '')
})

const roomId = 1

export default {
  props: {
    stickerGroups: {
      type: Array
    },
    stickers: {
      type: Object
    },
    ws: {
      type: WebSocket
    }
  },
  data () {
    return {
      nowSticker: '',
      roomId
    }
  },
  methods: {
    switchStickers (name) {
      this.$refs.stickerCarousel.setActiveItem(name)
      this.nowSticker = name
    },
    sendSticker (sticker, receiver) {
      this.ws.send(JSON.stringify({
        command: 'send',
        receivers: [receiver],
        type: 7,
        content: sticker.url,
        sticker: sticker.id
      }))

      this.$emit('closeStickerPopover')
    }
  },
  mounted () {
    this.nowSticker = this.stickerGroups[0].name
  }
}
</script>

<style lang="scss" scoped>
.indicators {
  height: 50px;
  background: #ddd;

  .indicator {
    box-sizing: border-box;
    display: inline-block;
    width: 50px;
    height: 50px;
    line-height: 50px;
    text-align: center;

    &.active {
      background: white;
    }

    &:hover {
      background: rgba(0, 0, 0, .1);
    }

    .text {
      font-size: 12px;
    }
  }

  .img {
    width: 35px;
    height: 35px;
    padding-top: 10px;
  }
}

.sticker-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  height: 230px;
  overflow: auto;
}

.sticker-pack {
  width: 60px;
  height: 60px;
  .sticker-img {
    width: 100%;
    height: 100%;
  }
}
</style>
