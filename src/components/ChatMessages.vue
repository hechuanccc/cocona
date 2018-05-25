<template>
  <ul>
    <li v-for="(msg, index) in messages"
      :key="index"
      class="msg">
      <div :class="['msg-wrapper', msg.isSaidByMe ? 'item-right' : 'item-left']"
        v-if="msg.type >= 0 && msg.type !== 6 && msg.sender">


        <div class="avatar m-l-sm m-r-sm">
          <icon name="cog"
            class="font-cog"
            v-if="msg.type === 4"
            scale="3"></icon>
          <img class="img"
            @click="handleCheckUser(msg)"
            :src="msg.sender.avatar_url || defaultAvatar"
            v-else>
        </div>

        <div class="msg-content">
          <div class="msg-header m-b">
            <span class="sender">{{msg.sender.nickname || msg.sender.username}}</span>
            <span :class="[
                'character-badge',
                { 'manager': msg.sender.level_name === '管理员'},
                { 'planmaker': msg.sender.level_name === '(计划员)一般会员'}
              ]"
              v-if="msg.sender.level_name === '管理员' || msg.sender.level_name === '(计划员)一般会员' && !msg.isSaidByMe">
              {{ msg.sender.level_name }}
            </span>
          </div>

          <div v-if="msg.type === 5">
            <div v-if="!user.account_type" class="envelope-message expired">
              <img class="img m-r" src="../assets/envelope_message.png" alt="envelope" />
              <div class="send-texts">
                <p class="slogan">{{msg.content || '恭喜发财 大吉大利'}}</p>
                <p class="action">会员才可以抢红包！</p>
              </div>
            </div>
            <div :class="['envelope-message','clickable',
              {'null': (msg.envelope_status.total === msg.envelope_status.users.length) &&
                !msg.envelope_status.users.map(item => item.receiver_id).includes(user.id)}]"
              v-else-if="msg.envelope_status && isAlive(msg.envelope_status.expired_time)"
              @click="takeEnvelope(msg)">
              <img class="img m-r" src="../assets/envelope_message.png" alt="envelope" />
              <div class="send-texts">
                <p class="slogan">{{msg.content || '恭喜发财 大吉大利'}}</p>
                <p class="action">
                  {{ msg.envelope_status.users.map(item => item.username).includes(user.username) ?
                  '已领取' : (msg.envelope_status.total === msg.envelope_status.users.length) ? '已领完' : '待领取' }}
                </p>
              </div>
            </div>
            <div class="envelope-message expired" v-else-if="!isAlive(msg.envelope_status.expired_time)">
              <img class="img m-r" src="../assets/envelope_message.png" alt="envelope" />
              <div class="send-texts">
                <p class="slogan">{{msg.content || '恭喜发财 大吉大利'}}</p>
                <p>已过期</p>
              </div>
            </div>
          </div>

          <div v-else-if="msg.type === 7">
            <img class="sticker-message" :src="msg.content" alt="sticker" />
          </div>

          <div class="followingbet-message" v-else-if="msg.type === 8">
            <div class="game-info m-b">
              <div class="name">
                <p class="display-name">{{msg.bet_info.display_name}}</p>
                <p class="issue-number">第{{msg.bet_info.issue_number}}期</p>
              </div>

              <div class="drawed" v-if="drawed(msg)">已開獎</div>
              <div v-else>
                <div class="countdown" v-if="closed">已封盤</div>
                <div class="countdown" v-else>
                  <span v-if="countdown.resultCountDown.days > 0">{{countdown.resultCountDown.days}}天 </span>
                  <span v-if="countdown.resultCountDown.hours > 0">{{countdown.resultCountDown.hours | complete}}:</span>
                  {{countdown.resultCountDown.minutes | complete}}:{{countdown.resultCountDown.seconds | complete}}
                </div>
              </div>
            </div>
            <div class="bet-info">
              <table class="play-table">
                <tr class="thead">
                  <td class="title">玩法</td>
                  <td class="title">赔率</td>
                  <td class="title">金额</td>
                </tr>
                <tr class="trow" v-for="(bet, index) in msg.bet_info.bets" :key="index">
                  <td class="td">{{bet.play.display_name}}-{{bet.play.playgroup}}</td>
                  <td class="td">{{bet.play.odds}}</td>
                  <td class="td">{{bet.bet_amount}}</td>
                </tr>
              </table>
            </div>
            <div class="action" @click="followBet(msg)">
              <el-button :disabled="closed || drawed(msg)" type="primary" class="followbet-btn">跟單</el-button>
            </div>
          </div>

          <div v-else :class="['bubble', `bubble${msg.type}`]">
            <span class="text" v-if="msg.type === 0"> {{msg.content}} </span>
            <img class="img" @click="handleImgMsgClick(msg)" v-else-if="msg.type === 1" :src="msg.content"/>
          </div>
        </div>

        <span class="msg-time" v-if="msg.type !== 8">{{msg.created_at | moment('HH:mm:ss')}}</span>
      </div>

      <div class="tips" v-else>
        <p class="envelope-tip" v-if="msg.type === 6 && msg.isSaidByMe">
          {{`${msg.get_envelope_user.username === user.username ? '你' : msg.get_envelope_user.nickname}抢到了你的红包`}}
        </p>
        <p class="lastmsg-tip" v-if="msg.type === -1">以上是历史消息</p>
      </div>

    </li>

    <li v-if="isBlocked" class="block-info text-center">您已被管理员拉黑，请联系客服。</li>
    <li ref="msgEnd" id="msgEnd" class="msgEnd"></li>

    <el-dialog :visible.sync="imgLightBox.visible"
      width="640px"
      custom-class="init-dialog img-dialog text-center"
      append-to-body>
      <img class="img" :src="imgLightBox.contentUrl">
    </el-dialog>

  </ul>
</template>


<script>
import { takeEnvelope } from '../api'
import { mapState } from 'vuex'

export default {
  props: {
    messages: {
      type: Array,
      required: true
    },
    envelope: {
      type: Object
    },
    defaultAvatar: {
      type: String
    },
    isBlocked: {
      type: Boolean
    },
    isManager: {
      type: Boolean
    },
    isBanned: {
      type: Boolean
    }
  },
  filters: {
    complete (value) {
      value = parseInt(value)
      return value < 10 ? ('0' + value) : value
    }
  },
  data () {
    return {
      imgLightBox: {
        visible: false,
        contentUrl: ''
      },
      countdown: {
        resultCountDown: 0,
        closeCountDown: 0,
        schedule: 0
      }
    }
  },
  methods: {
    followBet (msg) {
      this.$root.bus.$emit('followBet', msg.bet_info.bets)
    },
    scrollToEnd () {
      this.$nextTick(() => {
        this.$refs.msgEnd && this.$refs.msgEnd.scrollIntoView()
      })
    },
    isAlive (time) {
      return this.$moment().isBefore(this.$moment(time))
    },
    handleImgMsgClick (msg) {
      this.imgLightBox.visible = true
      this.imgLightBox.contentUrl = msg.content
    },
    takeEnvelope (envelope) {
      if (!this.user.account_type) {
        return
      }

      this.envelope.content = envelope.content
      this.envelope.status = 'taking'

      let payload = {
        envelope_id: envelope.envelope_status.id,
        receiver_id: this.user.id
      }

      this.envelope.visible = true

      takeEnvelope(payload).then(res => {
        res.envelope_id = payload.envelope_id
        this.envelope.envelope = res

        if (res.amount) {
          this.$store.dispatch('fetchUser').then(() => { this.envelope.status = 'success' })
        } else {
          switch (res.status) {
            case 'expired' :
              this.envelope.status = 'expired'

              let index = this.messages.findIndex((msg) => msg.type === 5 && msg.envelope_status && msg.envelope_status.id === payload.envelope_id)
              this.messages[index].envelope_status.expired = true
              return
            case 'repeat' :
              this.envelope.status = 'repeat'
              return
            case 'fail' :
              this.envelope.status = 'fail'
          }
        }
      })
    },
    handleCheckUser (msg) {
      if (!this.isManager || msg.sender.level_name.indexOf('管理员') !== -1) {
        return false
      }
      this.$emit('checkUser', msg.sender)
    },
    drawed (msg) {
      return this.countdown.resultCountDown.schedule !== msg.bet_info.issue_number
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    closed () {
      const r = this.countdown.resultCountDown
      return r.hours + r.hours + r.seconds + r.minutes === 0
    }
  },
  created () {
    this.$root.bus.$on('countdown', (timing) => {
      this.countdown = timing
    })
  },
  beforeDestroy () {
    this.$root.bus.$off('countdown')
  }
}
</script>

<style lang="scss" scoped>
@import '../style/vars.scss';

.block-info {
  padding-top: 100px;
  font-size: 16px;
  color: red;
}

.msg {
  margin-top: 10px;
  padding: 5px;
  &-wrapper {
    display: flex;

    &.item-right {
      justify-content: flex-end;
      .msg-header {
        text-align: right;
      }

      .bubble, .followingbet-message {
        border-radius: 10px 0 10px 10px;
        align-self: flex-end;
      }

      .bubble {
        background: #0269b1;
        color: #ffffff;
      }

      .msg-time {
        order: 0
      }
      .msg-content {
        order: 1
      }
      .avatar {
        order: 2
      }

    }
    &.item-left {
      justify-content: flex-start;

      .bubble, .followingbet-message {
        border-radius: 0 10px 10px 10px;
      }

      .bubble {
        background: #e5e5e5;
        color: #333333;
      }

    }

  }
  .tips {
    text-align: center;
    margin-top: 0px;
    .lastmsg-tip {
      color: #999;
      display: inline-block;
      background: #efefef;
      border-radius: 8px;
      border: 1px solid #dddddc;
      padding: 5px 10px;
    }

    .envelope-tip {
      display: inline-block;
      padding: 5px 10px;
      border-radius: 8px;
      color: #999;
    }

  }

  .avatar {
    width: 42px;
    height: 42px;
    .img {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 7px;
    }
  }

  .msg-content {
    display: flex;
    flex-direction: column;
    max-width: 70%;
  }

  .msg-time {
    display: flex;
    align-items: flex-end;
    color: #666;
    color: #bfbfbf;
    font-size: 10px;
    margin: 0 5px;
  }
}

.msg-header {
  overflow: hidden;

  .sender {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.1px;
    color: #0269b1;
  }

  .character-badge {
    display: inline-block;
    margin: 0 2px;
    color: #fff;
    padding: 2px 10px;
    border-radius: 10px;
    font-weight: 400;
    font-size: 10px;
    &.planmaker {
      background: #e58364;
    }

    &.manager {
      background-color: #62adcd;
    }
  }

}

// msg details
.bubble {
  max-width: 90%;
  padding: 10px;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: 1px;
  max-height: 200px;
  overflow-y: auto;
  .text {
    word-wrap: break-word;
  }

  &.bubble1 {
    width: auto;
    max-width: 150px;
    height: auto;
    max-height: 200px;
    .img {
      width: 100%;
      height: 100%;
    }
  }

  &.bubble7 {
    background: transparent;
    border: none;
    padding: 0;
  }
}

.envelope-message {
  display: flex;
  width: 190px;
  padding: 10px;
  border-radius: 5px;
  justify-content: stretch;
  background-color: #eea549;
  position: relative;

  &.expired {
    opacity: .6;
    background: #999999;
  }

  &.null {
    opacity: .6;
    background: #D69F14;
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
}

.sticker-message {
  width: 120px;
  height: 120px;
}

.followingbet-message {
  width: 265px;
  max-height: 300px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 16px 14px -10px rgba(37, 140, 211, 0.25), 0 4px 10px 0 rgba(62, 174, 252, 0.1);
  padding: 10px;
  .game-info {
    display: flex;
    justify-content: space-between;

    .name {
      .display-name {
        color: #333333;
        font-weight: 500;
        font-size: 16px;
      }
      .issue-number {
        color: #999999;
        font-weight: 300;
      }
    }

    .countdown {
      font-size: 20px;
      line-height: 1.5;
      font-weight: 500;
      color: #b32020;
    }
    .drawed {
      font-size: 20px;
      font-weight: 500;
      line-height: 1.5;
      color: #229e50;
    }
  }

  .bet-info {
    width: 100%;
    .play-table {
      width: 100%;
    }
    .thead {
      color: #999999;
      font-weight: 300;
      font-size: 12px;
      border-bottom: 2px solid #e5e5e5;
    }
    .trow {
      font-size: 14px;
      color: #333333;
      line-height: 2;
    }
  }

  .action {
    padding: 5px 0 0 0;
    .followbet-btn {
      width: 100%;
      font-weight: 500;
      font-size: 14px;
      color: #fff;
    }
  }
}


.img-dialog .img {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
