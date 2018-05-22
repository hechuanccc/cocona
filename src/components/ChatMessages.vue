<template>
  <ul class="chatmsgs-list">
    <li v-for="(item, index) in messages" :key="index" :class="
      ['clearfix',
        'item',
        item.sender && (user.username === item.sender.username) ? 'item-right' : 'item-left',
        item.type < 0 ? 'sys-msg' : ''
      ]">
      <div class="lay-block clearfix" v-if="item.type >= 0">
        <div class="avatar">
          <icon name="cog" class="font-cog" v-if="item.type === 4" scale="3"></icon>
          <img @click="handleCheckUser(item)" :src="item.sender && item.sender.avatar_url ? item.sender.avatar_url : require('../assets/avatar.png')"
            v-else>
        </div>
        <div class="lay-content">
          <div class="msg-header">
            <h4 v-html="item.type === 4 ? '计划消息' : item.sender && item.sender.username === user.username && user.nickname ? user.nickname : item.sender && (item.sender.nickname || item.sender.username)"></h4>
            <span class="common-member" v-if="item.type !== 4">
              {{roomManagers && roomManagers.indexOf(item.sender.id) !== -1 ? '管理员' : '普通会员'}}
            </span>
            <span class="msg-time">{{item.created_at | moment('HH:mm:ss')}}</span>
          </div>

          <div v-if="item.type === 5">

            <div v-if="!user.account_type" class="envelope-message expired">
              <img class="img m-r" src="../assets/envelope_message.png" alt="envelope" />
              <div class="send-texts">
                <p class="slogan">{{item.content || '恭喜发财 大吉大利'}}</p>
                <p class="action">会员才可以抢红包！</p>
              </div>
            </div>

            <div :class="['envelope-message','clickable',
                    {'null': (item.envelope_status.total === item.envelope_status.users.length) && !item.envelope_status.users.map(item => item.receiver_id).includes(user.id)}]"
              v-else-if="item.envelope_status && isAlive(item.envelope_status.expired_time)" @click="takeEnvelope(item)">
              <img class="img m-r" src="../assets/envelope_message.png" alt="envelope" />
              <div class="send-texts">
                <p class="slogan">{{item.content || '恭喜发财 大吉大利'}}</p>
                <p class="action">
                  {{ item.envelope_status.users.map(item => item.username).includes(user.username) ? '已领取' : (item.envelope_status.total ===
                  item.envelope_status.users.length) ? '已领完' : '待领取' }}
                </p>
              </div>
            </div>

            <div class="envelope-message expired" v-else-if="!isAlive(item.envelope_status.expired_time)">
              <img class="img m-r" src="../assets/envelope_message.png" alt="envelope" />
              <div class="send-texts">
                <p class="slogan">{{item.content || '恭喜发财 大吉大利'}}</p>
                <p>已过期</p>
              </div>
            </div>

          </div>

          <div v-else :class="['bubble', 'bubble' + item.type]">
            <p>
              <span v-if="item.type === 0 || item.type === 4" v-html="item.content"></span>
              <img @click="showImageMsg = true; showImageMsgUrl = item.content" v-else-if="item.type === 1" :src="item.content">
              <img class="sticker-message" v-else-if="item.type === 7" :src="item.content" alt="sticker" />
            </p>
          </div>
        </div>
      </div>
      <div class="inner" v-else-if="item.type === -1">
        <p>以上是历史消息</p>
      </div>
    </li>
    <li v-if="personalSetting.block" class="block-info text-center">您已被管理员拉黑，请联系客服。</li>
    <li ref="msgEnd" id="msgEnd" class="msgEnd"></li>
  </ul>
</template>


<script>
export default {
  props: {
    messages: {
      type: Array,
      required: true
    },
    personalSetting: {
      type: Object,
      required: true
    },
    user: {
      type: Object,
      required: true
    },
    roomManagers: {
      type: Array
    }
  },
  methods: {
    isAlive (time) {
      return this.$moment().isBefore(this.$moment(time))
    }
  },
  computed: {

  }
}
</script>

<style lang="scss" scoped>
@import '../style/vars.scss';

.chatmsgs-list {
  .block-info {
    padding-top: 100px;
    font-size: 16px;
    color: red;
  }
}

.item {
  margin-top: 10px;
  padding: 5px;
  &.sys-msg {
    text-align: center;
    margin-top: 0px;
    .inner {
      color: #999;
      display: inline-block;
      background: #efefef;
      border-radius: 8px;
      border: 1px solid #dddddc;
      padding: 5px 10px;
    }
    .type-warning {
      color: #f60;
      .btn-here {
        color: rgb(25, 158, 216);
      }
    }
  }
  &.item-left {
    .lay-block {
      .lay-content {
        .bubble:after {
          left: 0;
          border-left: 0;
          margin-left: -9px;
          border-right-color: inherit;
        }
      }
    }
  }
  &.item-right {
    .lay-block {
      .avatar {
        float: right;
      }
      .lay-content {
        float: right;
        margin-right: 15px;
        .msg-header {
          h4 {
            text-align: right;
            float: right;
            padding-top: 2px;
          }

          span {
            float: right;
          }
        }
        .bubble {
          float: right;
        }
        .bubble:after {
          right: 0;
          border-right: 0;
          margin-right: -9px;
          border-left-color: inherit;
        }
      }
    }
  }
}
.lay-block {
  .avatar {
    width: 42px;
    height: 42px;
    cursor: pointer;
    float: left;
    .font-cog {
      color: #7285d6;
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 7px;
    }
  }
}

.common-member {
  display: inline-block;
  margin: 0 2px;
  background: #cb9b64;
  color: #fff;
  padding: 0 6px;
  border-radius: 10px;
  font-weight: 400;
  font-size: 10px;
}


.lay-content {
  margin-left: 18px;
  float: left;
  max-width: 75%;
}
.msg-header {
  overflow: hidden;
  h4 {
    display: inline-block;
    font-size: 12px;
    color: #4f77ab;
    display: inline-block;
    font-weight: 400;
    cursor: pointer;
    max-width: 73px;
    overflow:hidden;
    text-overflow:ellipsis;
    line-height: 12px;
  }

  .msg-time {
    display: inline-block;
    color: #666;
    margin: 0 2px;
  }
}
.bubble {
  background: linear-gradient(to right, $primary, rgb(25, 158, 216));
  border-left-color: rgb(25, 158, 216);
  border-right-color: $primary;
  color: rgb(255, 255, 255);
  margin-top: 3px;
  position: relative;
  border-radius: 5px;
  padding: 5px 8px;
  font-size: 13px;
  display: inline-block;
  p {
    width: 100%;
  }
  &.bubble1 {
    width: 55%;
  }
  &.bubble4 {
    background: #ab47bc;
    background: linear-gradient(to right,#ab47bc,#5169DE);
    border-left-color: #5169de;
    border-right-color: #ab47bc;
  }
  &.bubble7 {
    background: transparent;
    border: none;
    padding: 0;
    .sticker-message {
      width: 100px;
      height: 100px;
    }
    &:after {
      content: none;
    }
  }

  p {
    display: inline-block;
    span {
      white-space: pre-wrap;
      word-break: break-all;
    }
    img {
      width: 100%;
      min-height: 50px;
      cursor: pointer;
    }
  }
}
.bubble:after {
  content: '';
  position: absolute;
  top: 14px;
  width: 0;
  height: 0;
  border: 9px solid transparent;
  border-top: 0;
  margin-top: -7px;
}

.envelope-message {
  display: flex;
  width: 190px;
  padding: 10px;
  border-radius: 5px;
  justify-content: stretch;
  background-color: #fa9d3b;
  position: relative;
  &.expired {
    background: #f5c38e;
  }
  &.null {
    background: #f5c38e;
  }
  .img {
    width: 30px;
    height: 35px;
  }
  .send-texts {
    color: #fff;
    .slogan {
      font-size: 14px;
      width: 150px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &:after {
    content: '';
    position: absolute;
    top: 14px;
    width: 0;
    height: 0;
    border: 9px solid transparent;
    border-top: 0;
    margin-top: -7px;
    border-right-color: #fa9d3b;
  }
}
.item-left .envelope-message{
  &:after {
    left: 0;
    border-left: 0;
    margin-left: -8px;
  }
  &.null:after, &.expired:after {
    border-right-color: #f5c38e;
  }
}
.item-right .envelope-message{
  float: right;
  &:after {
    right: 0;
    border-right: 0;
    margin-right: -9px;
    border-left-color: #fa9d3b;
  }
  &.null:after, &.expired:after {
    border-left-color: #f5c38e;
  }
}

.get-envelope {
  display: inline-block;
  color: #dedede;
  background: rgba(255, 255, 255, 0.1);
  padding: 5px 20px;
  border-radius: 4px;
}
</style>
