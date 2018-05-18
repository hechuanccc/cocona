<template>
  <li :class="[
    'chat-message',
    meSpeaking ? 'text-right' : 'text-left'
  ]">
    <div class="msg">
      <div :class="[
        'msg-avatar',
        meSpeaking ? 'self': 'other'
      ]">
        <img class="img"
          :src="msg.sender.avatar_url || defaultAvatar"
          :alt="msg.sender.nickname || 'avatar'"/>
      </div>
      <div :class="[
        'msg-information', 'm-l-sm', 'm-r-sm',
        meSpeaking ? 'self': 'other'
      ]">
        <p class="sender">
          <span class="name">{{msg.sender.nickname || msg.sender.username}}</span>
          <span class="badge">{{msg.sender.level_name}}</span>
          <span class="time">{{msg.created_at | moment('HH:mm:ss')}}</span>
        </p>

        <div class="msg-content">
          <p>{{msg.content}}</p>
        </div>

      </div>
    </div>
  </li>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    msg: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      defaultAvatar: require('../assets/avatar.png')
    }
  },
  methods: {

  },
  computed: {
    ...mapState([
      'user'
    ]),
    meSpeaking () {
      return this.msg.sender && (this.msg.sender.username === this.user.username)
    },
    isSystemMsg () {
      return this.msg.type < 0
    },
    isEnvelope () {
      return this.msg.type === 5
    }
  }
}
</script>

<style lang="scss" scoped>
.chat-message {
  display: block;
  box-sizing: border-box;
  padding: 10px;
}

.msg {
  display: inline-flex;
  max-width: 75%;
  &-avatar {
    width: 40px;
    height: 40px;
    .img {
      width: 100%;
      height: 100%;
    }
    &.self {
      order: 2
    }
    &.other {
      order: 1
    }
  }

  &-information {
    overflow: hidden;
    &.self {
      order: 1
    }
    &.other {
      order: 2
    }
  }

  &-content {

  }
}

.sender {
  .name {
    display: inline-block;
    max-width: 75px;
    font-size: 12px;
    color: #4f77ab;
  }

  .badge {
    display: inline-block;
    font-size: 10px;
    border-radius: 10px;
    padding: 0 5px;
    margin: 0 3px;
    background: #cb9b64;
    color: #fff;
  }

  .time {
    color: #666;
  }

  .name, .badge, .time {
    vertical-align: middle;
  }

  .content {

  }
}
</style>
