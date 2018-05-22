<template>
  <div class="chat-container">
    <el-container
      class="chat-box"
      v-loading="loading"
      id="chatBox"
      element-loading-text="正在登录"
      v-if="isLogin && showChatRoom">
      <el-header class="chat-header clearfix" height="40px">
        <div class="left fl clearfix">
          <icon class="icon home-icon" name="home" scale="1.5"></icon>
          <span class="title">聊天室</span>
        </div>
        <div class="right fr clearfix">
          <icon v-if="personal_setting.manager"
            class="icon clickable"
            name="cog"
            scale="1.5"
            @click.native="handleBlockPopupShow">
          </icon>
          <icon v-if="user.account_type !== 0" class="icon m-l clickable"
            title="修改昵称"
            name="user"
            scale="1.5"
            @click.native="personal_setting.blocked ? '' : showEditProfile = true">
          </icon>
          <icon class="icon m-l clickable"
            name="times"
            scale="1.5"
            @click="leaveRoom">
          </icon>
        </div>

        <transition
          enter-class="profileFadeInEnter"
          leave-active-class="animated fadeOutUp"
          enter-active-class="animated fadeInDown">
          <div class="edit-profile" v-if="showEditProfile">
            <div @mouseover="swichAvatar = true"
              @mouseout="swichAvatar = false">
              <el-upload
                class="avatar"
                style="overflow-y: hidden;"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">

                <img v-if="user.avatar && !swichAvatar" :src="user.avatar" class="avatar">
                <img v-else-if="!swichAvatar" :src="require('../assets/avatar.png')">
                <label for="avatarUploadInput" class="upload-avatar" v-if="swichAvatar">
                  <span class="el-icon-upload"></span>
                </label>
              </el-upload>
            </div>

            <p class="avatar-upload-tip">{{user.avatar ? '(如需更换头像请点击上方头像上传)' : '(您还未设置头像, 请点击头像上传)'}}</p>
            <p>
              <span class="txt-nick">{{user.account_type === 0 ? '试玩会员' : (user.nickname || user.username)}}</span>
              <a href="javascript:void(0)" class="icon-edit" @click="showNickNameBox = true">
                <span class="el-icon-edit-outline"></span>
              </a>
            </p>
            <div>
              <p>
                <a href="javascript:void(0)" class="u-btn" @click="showEditProfile = false">关闭</a>
              </p>
            </div>
          </div>
        </transition>

        <transition
          enter-class="profileFadeInEnter"
          leave-active-class="animated fadeOutUp"
          enter-active-class="animated fadeInDown">
          <div class="edit-profile" v-if="showCheckUser">
            <div
              class="avatar"
              style="overflow-y: hidden;">
              <img :src="checkUser.avatar_url || require('../assets/avatar.png')" class="avatar">
              <label for="avatarUploadInput" class="upload-avatar" v-if="swichAvatar">
                <span class="el-icon-upload"></span>
              </label>
            </div>
            <p class="avatar-upload-tip">{{checkUser.nickname || checkUser.username}}({{checkUser.level_name}})</p>
            <div class="restraint-actions">
              <el-button type="danger" size="mini" @click.native="ban(15)">禁言15分钟</el-button>
              <el-button type="danger" size="mini" @click.native="ban(30)">禁言30分钟</el-button>
              <el-button type="danger" size="mini" @click.native="block()">加入黑名单</el-button>
            </div>
            <div>
              <p>
                <a href="javascript:void(0)" class="u-btn" @click="showCheckUser = false">关闭</a>
              </p>
            </div>
          </div>
        </transition>

      </el-header>


      <el-main class="chat-body" id="chatBox">

        <div class="announcements p-r">
          <div class="bulletin fl clearfix">
            <icon class="volume-icon m-r-sm" name="volume-up"></icon>
            <span class="text">公告:</span>
          </div>
          <div class="marquee">
            <MarqueeTips :content="announcement" :speed="10"></MarqueeTips>
          </div>
        </div>

        <div class="msg-controler">
          <a class="btn" href="javascript:void(0)">
            <icon class="icon" name="unsorted"></icon>
            <span class="text" @click="$refs.msgEnd.scrollIntoView()">滚屏</span>
          </a>
          <a class="btn" href="javascript:void(0)">
            <icon class="icon" name="trash"></icon>
            <span class="text" @click="messages = []">清屏</span>
          </a>
        </div>

        <ChatMessages :messages="messages" :roomManagers="roomManagers" :user="user" :personalSetting="personal_setting"/>
        <!-- <ul class="chatmsgs-list">


          <li v-for="(item, index) in messages"
            :key="index"
            :class="
              ['clearfix',
                'item',
                item.sender && (user.username === item.sender.username) ? 'item-right' : 'item-left',
                item.type < 0 ? 'sys-msg' : ''
              ]">
            <div class="lay-block clearfix" v-if="item.type >= 0">
              <div class="avatar">
                <icon name="cog" class="font-cog" v-if="item.type === 4" scale="3"></icon>
                <img @click="handleCheckUser(item)"
                :src="item.sender && item.sender.avatar_url ? item.sender.avatar_url : require('../assets/avatar.png')"
                v-else>
              </div>
              <div class="lay-content">
                <div class="msg-header">
                  <h4 v-html="item.type === 4 ? '计划消息' : item.sender && item.sender.username === user.username && user.nickname ? user.nickname : item.sender && (item.sender.nickname || item.sender.username)"></h4>
                  <span class="common-member" v-if="item.type !== 4">
                    {{roomManagers.indexOf(item.sender.id) !== -1 ? '管理员' : '普通会员'}}
                  </span>
                  <span class="msg-time">{{item.created_at | moment('HH:mm:ss')}}</span>
                </div>

                <div v-if="item.type === 5">

                  <div v-if="!user.account_type" class="envelope-message expired">
                    <img class="img m-r" src="../assets/envelope_message.png" alt="envelope"/>
                    <div class="send-texts">
                      <p class="slogan">{{item.content || '恭喜发财 大吉大利'}}</p>
                      <p class="action">会员才可以抢红包！</p>
                    </div>
                  </div>

                  <div :class="['envelope-message','clickable',
                    {'null': (item.envelope_status.total === item.envelope_status.users.length) && !item.envelope_status.users.map(item => item.receiver_id).includes(user.id)}]"
                    v-else-if="item.envelope_status && isAlive(item.envelope_status.expired_time)"
                    @click="takeEnvelope(item)">
                    <img class="img m-r" src="../assets/envelope_message.png" alt="envelope"/>
                    <div class="send-texts">
                      <p class="slogan">{{item.content || '恭喜发财 大吉大利'}}</p>
                      <p class="action">
                        {{
                          item.envelope_status.users.map(item => item.username).includes(user.username) ?
                          '已领取' : (item.envelope_status.total === item.envelope_status.users.length)  ?
                          '已领完' : '待领取'
                        }}
                      </p>
                    </div>
                  </div>

                  <div class="envelope-message expired"
                    v-else-if="!isAlive(item.envelope_status.expired_time)">
                    <img class="img m-r"
                      src="../assets/envelope_message.png"
                      alt="envelope"/>
                    <div class="send-texts">
                      <p class="slogan">{{item.content || '恭喜发财 大吉大利'}}</p>
                      <p>已过期</p>
                    </div>
                  </div>

                </div>

                <div v-else :class="['bubble', 'bubble' + item.type]">
                  <p>
                    <span v-if="item.type === 0 || item.type === 4" v-html="item.content"></span>
                    <img @click="showImageMsg = true; showImageMsgUrl = item.content"
                      v-else-if="item.type === 1"
                      :src="item.content">
                    <img class="sticker-message"
                      v-else-if="item.type === 7"
                      :src="item.content"
                      alt="sticker"/>
                  </p>
                </div>
              </div>
            </div>
            <div class="inner" v-else-if="item.type === -1">
              <p>以上是历史消息</p>
            </div>
            <div v-else-if="user.account_type && (item.type === -2 || item.type === -3 || (item.type === 6 && item.sender.username === user.username))" class="inner type-warning">
              <div class="text-center">
                <p class="get-envelope">{{`${item.get_envelope_user === user.username ? '你' : item.get_envelope_user.get_envelope_user}抢到了你的红包`}}</p>
              </div>
              <p>
                <span v-if="item.type === -2">您可以设置昵称啦, 点击 <a href="javascript:void(0)" class="btn-here" @click="item.type === -3 ? showEditProfile = true : showNickNameBox = true">这里</a>设置昵称</span>
                <span v-else>您可以上传自己的头像啦, 点击 <a href="javascript:void(0)" class="btn-here" @click="item.type === -3 ? showEditProfile = true : showNickNameBox = true">这里</a>设置</span>
              </p>
            </div>
          </li>



          <li v-if="personal_setting.block" class="block-info text-center">您已被管理员拉黑，请联系客服。<li>



          <li ref="msgEnd" id="msgEnd" class="msgEnd"></li>

        </ul> -->
      </el-main>

      <el-footer class="footer" height="100">
        <div class="control-bar">
          <el-popover :popper-class="'emoji-popover'"
            ref="sticker-popover"
            v-model="stickerPopoverVisible"
            placement="top-start"
            :width="stickerTab === 'stickers' ? 350 : 300"
            :offset="50"
            trigger="click">
            <el-tabs type="border-card" class="stickers-tab" v-model="stickerTab">
              <el-tab-pane label="表情符号" name="emojis">
                <div class="emoji-container">
                  <Emojis :emojis="emojis.people.slice(0, 42)" @emojiClick="handleEmojiClick"/>
                </div>
              </el-tab-pane>
              <el-tab-pane label="表情包" name="stickers" v-if="stickerGroups.length">
                <div class="stickers-container">
                  <Stickers :stickerGroups="stickerGroups"
                    :stickers="stickers"
                    :ws="ws"
                    @closeStickerPopover="closeStickerPopover"
                    v-if="stickerTab === 'stickers'"/>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-popover>

          <a v-popover:sticker-popover href="javascript:void(0)" title="发送表情" class="btn-control btn-smile">
            <icon scale="1.3" name="smile-o"></icon>
          </a>

          <a href="javascript:void(0)" class="btn-control btn-smile">
            <label for="imgUploadInput">
              <span title="上传图片">
                <i class="el-icon-picture"></i>
                <input :disabled="!personal_setting.chat.status" @change="sendMsgImg" type="file" ref="fileImgSend" class="img-upload-input" id="imgUploadInput" accept=".jpg, .png, .gif, .jpeg, image/jpeg, image/png, image/gif">
              </span>
            </label>
          </a>
          <div v-if="systemConfig.envelopeSettings && systemConfig.envelopeSettings.enabled === '1'"
            class="btn-control btn-smile envelope-icon clickable"
            @click="handleEnvelopeIconClick">
            <img class="img" src="../assets/envelope_icon.png" alt="envelope-icon">
          </div>

        </div>

        <div class="typing">

          <div :class="['txtinput', 'el-textarea', !personal_setting.chat.status ? 'is-disabled' : '']">
            <textarea  @keyup.enter="sendMsg"
              @focus="$store.dispatch('updateIsChatting', true)"
              @blur="$store.dispatch('updateIsChatting', false)"
              :placeholder="personal_setting.chat.status ? '' : chatConditionMessage"
              type="textarea" rows="2"
              autocomplete="off"
              validateevent="true"
              class="el-textarea-inner"
              v-model="msgCnt"
              :disabled="personal_setting.chat.status ? false : true">
            </textarea>
          </div>

          <div class="sendbtn fr">
            <a href="javascript:void(0)" class="u-btn" @click="sendMsg">发送</a>
          </div>
        </div>

      </el-footer>
    </el-container>

    <el-dialog title="修改昵称"
      :visible.sync="showNickNameBox"
      width="400px"
      custom-class="changeNickNameBox"
      append-to-body>
      <el-form>
        <el-form-item label="请输入昵称">
          <el-input auto-complete="off" v-model="nickname"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showNickNameBox = false">取 消</el-button>
        <el-button type="primary" @click="submitNickName">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showImageMsg"
      width="640px"
      custom-class="show-image-msg text-center"
      append-to-body>
      <img :src="showImageMsgUrl">
    </el-dialog>

    <div
      v-if="isLogin && showEntry"
      class="chat-guide text-center"
      @click="joinChatRoom">
      <icon class="font-wechat" name="wechat" scale="1.7"></icon>
      <ul class="text-center">
        <li>聊</li>
        <li>天</li>
        <li>室</li>
      </ul>
    </div>

    <el-dialog :visible.sync="errMsg"
      width="400px"
      custom-class="showImageMsg"
      append-to-body>
      <p>{{errMsgCnt}}</p>
    </el-dialog>

    <el-dialog
      :visible.sync="showBlockPopup"
      width="700px"
      :modal-append-to-body="true"
      :append-to-body="true"
      center>
      <el-menu :default-active="'0'" class="m-b-xlg" mode="horizontal">
        <el-menu-item v-for="(tab, index) in restraintTabs"
          :key="index"
          :index="index + ''"
          @click.native="switchBlockTab(index)">{{tab.display}}</el-menu-item>
      </el-menu>
      <el-table
        :data="nowRestraintTab === '1' ? formattedBannedUsers : blockedUsers"
        style="width: 100%">
        <el-table-column
          prop="username"
          label="帐号"
          :width="nowRestraintTab === '0' ? 322 : 215">
        </el-table-column>
        <el-table-column
          v-if="nowRestraintTab === '1'"
          prop="banned_time"
          label="时间(min)"
          width="215">
        </el-table-column>
        <el-table-column
          label="操作"
          :width="nowRestraintTab === '0' ? 322 : 215">
          <template slot-scope="scope">
            <el-button v-if="nowRestraintTab === '1'" size="mini" type="danger" @click.native="unban(scope.row.username)">解除</el-button>
            <el-button v-else size="mini" type="danger" @click.native="unblock(scope.row.username)">解除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- red envelope dialog -->
     <el-dialog
       class="red-envelope-dialog init-dialog"
       :visible.sync="envelope.visible"
       :width="'400px'"
       top="10vh"
       :append-to-body="true"
       center>
      <Envelope :status="envelope.status"
        v-if="envelope.visible"
        :content="envelope.content"
        :envelope="envelope.envelope"
        :joinChatRoom="joinChatRoom"
        :roomId="RECEIVER"
        @closeDialog="closeEnvelope"
        @handleSend="handleEnvelopeSend"/>
    </el-dialog>
  </div>

</template>

<script>
import MarqueeTips from 'vue-marquee-tips'
import urls from '../api/urls'
import { mapState } from 'vuex'
import { msgFormatter, getCookie } from '../utils'
import { updateUser, fetchChatEmoji, sendImgToChat, banChatUser, blockChatUser, unblockChatUser, unbanChatUser, getChatUser, fetchStickers, takeEnvelope } from '../api'
import config from '../../config'
import Stickers from './Stickers'
import Envelope from './Envelope'
import Emojis from './Emojis'
import ChatMessages from './ChatMessages'

const WSHOST = config.chatHost
const RECEIVER = 100000

export default {
  props: {
    showEntry: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      ws: null,
      RECEIVER,
      showChatRoom: false,
      messages: [],
      showEditProfile: false,
      swichAvatar: false,
      msgCnt: '',
      showNickNameBox: false,
      errMsg: false,
      roomManagers: [],
      errMsgCnt: '',
      uploadUrl: urls.user,
      nickname: this.$store.state.user.nickname,
      showImageMsg: false,
      showImageMsgUrl: '',
      loading: false,
      emojis: {
        people: []
      },
      announcement: '',
      personal_setting: {
        chat: {
          reasons: []
        }
      },
      showCheckUser: false,
      checkUser: {},
      welcome: '',
      chatLoading: true,
      showBlockPopup: false,
      nowRestraintTab: '0',
      bannedUsers: [],
      blockedUsers: [],
      restraintTabs: [
        {
          display: '黑名单'
        },
        {
          display: '禁言'
        }
      ],
      stickerPopoverVisible: false,
      stickerTab: 'emojis',
      stickerGroups: [],
      stickers: {},
      envelope: {
        content: '',
        status: '',
        visible: false,
        envelope: {}
      }
    }
  },
  components: {
    MarqueeTips, Stickers, Emojis, Envelope, ChatMessages
  },
  watch: {
    'showEntry': function (val, oldVal) {
      if (!val && this.showChatRoom && this.isLogin) {
        this.leaveRoom()
      }
    },
    'user.showChatRoom' (val, oldVal) {
      this.leaveRoom()
    },
    'stickerPopoverVisible': function (visible) {
      if (visible) {
        this.getStickers()
      }
    }
  },
  computed: {
    ...mapState([
      'user',
      'envelopes',
      'systemConfig'
    ]),
    isLogin () {
      return this.$store.state.user.logined && this.$route.name !== 'Home'
    },
    chatConditionMessage () {
      return this.$store.state.systemConfig.global_preferences.chat_condition_message
    },
    formattedBannedUsers () {
      let result = []
      if (this.bannedUsers.length) {
        this.bannedUsers.forEach((item) => {
          result.push({
            username: item.username,
            banned_time: this.$moment(item.banned_time).fromNow(true)
          })
        })

        return result
      }
    }
  },
  methods: {
    meSpeaking (msg) {
      if (msg) {
        return msg.sender.username === this.user.username
      }
    },
    isAlive (time) {
      return this.$moment().isBefore(this.$moment(time))
    },
    closeEnvelope () {
      this.envelope.visible = false
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
    handleEnvelopeSend (envelope) {
      this.envelope.visible = false
      this.envelope.status = ''
      this.$store.dispatch('fetchUser')

      this.$nextTick(() => {
        this.$refs.msgEnd && this.$refs.msgEnd.scrollIntoView()
      })
    },
    handleEnvelopeIconClick () {
      // if (this.personalSetting.blocked || this.personalSetting.banned) {
        // return
      // }
      if (!this.user.account_type) {
        this.$store.commit('OPEN_LOGINDIALOG')
      } else {
        this.envelope.status = 'sending'
        this.envelope.visible = true
        this.envelope.envelope = {}
      }
    },
    closeStickerPopover () {
      this.stickerPopoverVisible = false
    },
    getStickers () {
      if (!this.stickerGroups.length) {
        fetchStickers().then((res) => {
          if (!res) {
            return
          }
          this.stickerGroups = res.map(sticker => {
            this.stickers[sticker.display_name] = sticker.stickers
            return {
              display_name: sticker.display_name,
              logo: sticker.logo,
              name: sticker.display_name // maybe the name field is required
            }
          })
        }).catch(() => {})
      }
    },
    handleEmojiClick (emoji) {
      this.msgCnt = this.msgCnt + emoji.emoji + ' '
    },
    joinChatRoom () {
      this.showChatRoom = true
      let token = getCookie('access_token')
      this.loading = true
      this.ws = new WebSocket(`${WSHOST}/chat/stream?username=${this.$store.state.user.username}&token=${token}`)
      this.ws.onopen = () => {
        this.handleMsg()
      }
      this.ws.onclose = () => {
        this.ws = null
      }
      setTimeout(() => {
        if ((!this.ws || (this.ws && this.ws.readyState !== 1)) && this.showChatRoom) {
          this.joinChatRoom()
        } else {
          if (!this.emojis.people.length) {
            fetchChatEmoji().then((resData) => {
              this.emojis = resData.data
            }).catch(err => console.log(err))
          }
        }
      }, 2000)
    },
    handleMsg () {
      this.loading = false
      if (!this.ws) { return false }
      this.ws.send(JSON.stringify({
        'command': 'join',
        'receivers': [RECEIVER]
      }))
      this.ws.onmessage = (resData) => {
        if (!this.showChatRoom || !this.showEntry) { return }
        let data
        if (typeof resData.data === 'string') {
          try {
            data = JSON.parse(resData.data)

            if (!data.error_type) {
              if (data.latest_message) {
                this.announcement = ['ffasfaf', 'asfsafasfqef'].join('  ')
                if (data.bulletin.length) {
                  this.announcement = data.bulletin.join(' ')
                }

                this.messages = this.messages.concat(data.latest_message.reverse())
                let oSupplyData = [{
                  type: -1
                }]
                if (this.personal_setting.user) {
                  !this.personal_setting.user.avatar_url && oSupplyData.push({type: -2})
                  !this.personal_setting.user.nickname && oSupplyData.push({type: -3})
                  this.messages = this.messages.concat(oSupplyData)
                }

                let envelopes = data.latest_message.filter((msg) => msg.type === 5 && this.isAlive(msg.envelope_status.expired_time))
                envelopes.forEach((envelope) => {
                  this.$store.dispatch('collectEnvelope', envelope)
                })

                this.$nextTick(() => {
                  this.$refs.msgEnd && this.$refs.msgEnd.scrollIntoView()
                })
                return
              } else if (data.personal_setting) {
                this.personal_setting = data.personal_setting
              } else {
                switch (data.type) {
                  case 2:
                    if (this.showChatRoom && this.isLogin) {
                      if (data.command === 'banned') {
                        this.errMsg = true
                        this.errMsgCnt = data.content
                      } else if (data.command === 'unblock') {
                        this.personal_setting.blocked = false
                        this.joinChatRoom()
                      } else if (data.command === 'unbanned') {
                        this.personal_setting.chat.status = 1
                      }
                      this.$notify({
                        message: data.content,
                        offset: 100,
                        type: 'success',
                        duration: 2200,
                        customClass: 'top-right-msg',
                        showClose: false
                      })
                    }
                    return
                  case 3:
                    this.announcement = data.content
                    return

                  case 5:
                    this.messages.push(data)
                    this.$store.dispatch('collectEnvelope', data)
                    this.$nextTick(() => {
                      this.$refs.msgEnd && this.$refs.msgEnd.scrollIntoView()
                    })
                    return
                  case 6:
                    this.messages.push(data)
                    this.$store.dispatch('collectEnvelope', data)
                    let currentEnvelopeIndex = this.messages.findIndex((msg) => msg.envelope_status && msg.envelope_status.id === data.envelope_status.id)

                    this.messages[currentEnvelopeIndex].envelope_status = data.envelope_status

                    if (data.sender.id === this.user.id) {
                      this.$nextTick(() => {
                        this.$refs.msgEnd && this.$refs.msgEnd.scrollIntoView()
                      })
                    }
                    return

                  default:
                    this.messages.push(data)
                }

                let chatBox = document.getElementById('chatBox')
                if (chatBox) {
                  let h = chatBox.clientHeight
                  let sh = chatBox.scrollHeight || chatBox.offsetHeigth
                  let st = chatBox.scrollTop || document.documentElement.scrollTop || document.body.scrollTop
                  if (h + st + 100 >= sh || (data.sender && data.sender.username === this.user.username)) {
                    this.$nextTick(() => {
                      this.$refs.msgEnd && this.$refs.msgEnd.scrollIntoView()
                    })
                  }
                }
              }
            } else {
              if (data.error_type !== 2 && data.error_type !== 3) {
                this.errMsg = true
                switch (data.error_type) {
                  case 4:
                    this.errMsgCnt = '您已被聊天室管理员禁言，在' + this.$moment(data.msg).format('YYYY-MM-DD HH:mm:ss') + '后才可以发言。'
                    this.personal_setting.banned = true
                    this.personal_setting.chat.status = 0
                    break
                  case 5:
                    this.messages = []
                    this.personal_setting.block = true
                    this.personal_setting.chat.status = 0
                    this.errMsgCnt = data.msg
                    break
                  default:
                    this.errMsgCnt = data.msg
                }
              }
            }
          } catch (e) {
            console.log(e)
          }
        }
      }
      setTimeout(() => {
        this.$refs.msgEnd && this.$refs.msgEnd.scrollIntoView()
      }, 1000)
    },
    handleAvatarSuccess (res, file) {
      this.$store.commit('SET_USER', {
        user: {
          avatar: URL.createObjectURL(file.raw)
        }
      })
    },
    beforeAvatarUpload (file) {
      let formData = new FormData()
      formData.append('avatar', file)
      updateUser(formData, this.user.id).then((data) => {
        this.$store.commit('SET_USER', {
          user: data
        })
        this.messages = this.messages.filter((item) => item.type !== -3)
      }, errorMsg => {
        this.$message({
          showClose: true,
          message: msgFormatter(errorMsg),
          type: 'error'
        })
      })
    },
    sendMsgImg (e) {
      let fileInp = this.$refs.fileImgSend
      let file = fileInp.files[0]
      if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileInp.value) || !this.personal_setting.chat.status) {
        this.errMsgCnt = '文件格式不正确或您目前尚不符合发言条件'
        this.errMsg = true
        return false
      }
      if (file.size > 1024 * 1024) {
        this.errMsg = true
        this.errMsgCnt = '图片尺寸太大，请选择较小尺寸的图片。'
        return
      }
      let formData = new FormData()
      formData.append('receivers', RECEIVER)
      formData.append('image', file)
      sendImgToChat(formData).then((data) => {
        fileInp.value = ''
      })
    },
    sendMsg () {
      if (!this.msgCnt.trim()) { return false }
      this.ws.send(JSON.stringify({
        'command': 'send',
        'receivers': [RECEIVER],
        'type': 0,
        'content': this.msgCnt
      }))
      this.msgCnt = ''
    },
    submitNickName () {
      updateUser({nickname: this.nickname, id: this.user.id}).then((data) => {
        this.$store.commit('SET_USER', {
          user: data
        })
        this.showNickNameBox = false
        this.messages = this.messages.filter((item) => item.type !== -2)
      }, errorMsg => {
        this.$message({
          showClose: true,
          message: msgFormatter(errorMsg),
          type: 'error'
        })
      })
    },
    leaveRoom (n) {
      this.showChatRoom = false
      this.messages = []
      this.showEditProfile = false
      this.ws && this.ws.send(JSON.stringify({
        'command': 'leave',
        'receivers': [RECEIVER]
      }))
      if (this.ws) {
        this.ws.close()
      }
    },
    handleCheckUser (data) {
      if (!this.personal_setting.manager || data.sender.level_name.indexOf('管理员') !== -1) {
        return false
      }
      this.checkUser = data.sender
      this.showCheckUser = true
    },
    ban (mins) {
      banChatUser(RECEIVER, {
        user: this.checkUser.username,
        banned_time: mins
      }).then((data) => {
        this.showCheckUser = false
      }, errorMsg => {
        this.$message({
          showClose: true,
          message: errorMsg,
          type: 'error'
        })
      })
    },
    unban (user) {
      unbanChatUser(RECEIVER, {
        user: user
      }).then((data) => {
        this.getUser()
        this.$message({
          showClose: true,
          message: data.data.status,
          type: 'success'
        })
      }, errorMsg => {
        this.$message({
          showClose: true,
          message: errorMsg,
          type: 'error'
        })
      })
    },
    block () {
      blockChatUser(RECEIVER, {
        user: this.checkUser.username
      }).then((data) => {
        this.showCheckUser = false
      }, errorMsg => {
        this.showCheckUser = false
        this.$message({
          showClose: true,
          message: errorMsg.response.data.error,
          type: 'error'
        })
      })
    },
    unblock (user) {
      unblockChatUser(RECEIVER, {
        user: user
      }).then((data) => {
        this.getUser()
        this.$message({
          showClose: true,
          message: data.data.status,
          type: 'success'
        })
      }, errorMsg => {
        this.$message({
          showClose: true,
          message: errorMsg,
          type: 'error'
        })
      })
    },
    getUser () {
      this.loading = true
      getChatUser(1).then(response => {
        let data = response.data
        this.roomManagers = response.data.managers
        this.bannedUsers = data.banned_users
        this.blockedUsers = data.block_users
        this.loading = false
      })
    },
    switchBlockTab (index) {
      this.nowRestraintTab = index + ''
    },
    handleBlockPopupShow () {
      this.showBlockPopup = true
      this.getUser()
    }
  },
  created () {
    this.getUser()
  }
}
</script>

<style lang="scss" scoped>
@import '../style/vars.scss';

$primary-blue: #006bb3;

.chat {
  &-container {
    position: fixed;
    right: 0;
    top: 0;
    width: 380px;
    z-index: 2;
  }

  &-box {
    position: fixed;
    right: 0;
    top: 0;
    width: 340px;
    height: 100%;
    overflow-x: hidden;
    border-left: 3px solid $primary-blue;
    border-bottom: 1px solid $primary-blue;
    z-index: 1;
  }

  &-header {
    position: relative;
    line-height: 40px;
    background-color: $primary-blue;
    color: #fff;
    padding: 0 10px;
  }

  &-body {
    background: url('../assets/chatbg.jpg') no-repeat right bottom;
    background-attachment: fixed;
    background-size: cover;
  }

  &msgs-list {
    padding-top: 35px;
  }
}


.chat-header {
  line-height: 40px;
  color: #fff;
  .home-icon {
    margin-top: -5px;
  }
  .icon {
    vertical-align: middle;
    &.clickable:hover {
      color: #ddd;
    }
  }

  .title {
    font-size: 16px;
  }
}

.chat-body {
  padding: 5px 0;
  .announcements {
    position: absolute;
    top: 43px;
    left: 5px;
    right: 5px;
    background: rgba(237,244,254,.91);
    border: 1px solid #c2cfe2;
    border-radius: 5px;
    height: 30px;
    line-height: 30px;
    overflow: hidden;
    z-index: 3;

    .bulletin {
      background: #e1edfd;
      color: red;
      padding: 0px 5px;
    }

    .volume-icon, .text {
      vertical-align: middle;
    }

    .marquee {
      margin-left: 75px;
    }
  }

  .msg-controler {
    position: absolute;
    width: 100%;
    top: 80px;
    left: 0;
    text-align: center;
    z-index: 3;

    .btn {
      display: inline-block;
      height: 15px;
      line-height: 15px;
      padding: 5px 10px;
      border: 1px solid #e2e2e2;
      border-radius: 15px;
      margin: 0 5px;
      background: #fff;
      color: #a5a5a5;
      .icon, .text {
        vertical-align: bottom;
      }
    }
  }
}

// .chatmsgs-list {
//   .block-info {
//     padding-top: 100px;
//     font-size: 16px;
//     color: red;
//   }
// }

// .item {
//   margin-top: 10px;
//   padding: 5px;
//   &.sys-msg {
//     text-align: center;
//     margin-top: 0px;
//     .inner {
//       color: #999;
//       display: inline-block;
//       background: #efefef;
//       border-radius: 8px;
//       border: 1px solid #dddddc;
//       padding: 5px 10px;
//     }
//     .type-warning {
//       color: #f60;
//       .btn-here {
//         color: rgb(25, 158, 216);
//       }
//     }
//   }
//   &.item-left {
//     .lay-block {
//       .lay-content {
//         .bubble:after {
//           left: 0;
//           border-left: 0;
//           margin-left: -9px;
//           border-right-color: inherit;
//         }
//       }
//     }
//   }
//   &.item-right {
//     .lay-block {
//       .avatar {
//         float: right;
//       }
//       .lay-content {
//         float: right;
//         margin-right: 15px;
//         .msg-header {
//           h4 {
//             text-align: right;
//             float: right;
//             padding-top: 2px;
//           }

//           span {
//             float: right;
//           }
//         }
//         .bubble {
//           float: right;
//         }
//         .bubble:after {
//           right: 0;
//           border-right: 0;
//           margin-right: -9px;
//           border-left-color: inherit;
//         }
//       }
//     }
//   }
// }
// .lay-block {
//   .avatar {
//     width: 42px;
//     height: 42px;
//     cursor: pointer;
//     float: left;
//     .font-cog {
//       color: #7285d6;
//     }
//     img {
//       display: block;
//       width: 100%;
//       height: 100%;
//       border-radius: 7px;
//     }
//   }
// }

// .common-member {
//   display: inline-block;
//   margin: 0 2px;
//   background: #cb9b64;
//   color: #fff;
//   padding: 0 6px;
//   border-radius: 10px;
//   font-weight: 400;
//   font-size: 10px;
// }


// .lay-content {
//   margin-left: 18px;
//   float: left;
//   max-width: 75%;
// }
// .msg-header {
//   overflow: hidden;
//   h4 {
//     display: inline-block;
//     font-size: 12px;
//     color: #4f77ab;
//     display: inline-block;
//     font-weight: 400;
//     cursor: pointer;
//     max-width: 73px;
//     overflow:hidden;
//     text-overflow:ellipsis;
//     line-height: 12px;
//   }

//   .msg-time {
//     display: inline-block;
//     color: #666;
//     margin: 0 2px;
//   }
// }
// .bubble {
//   background: linear-gradient(to right, $primary, rgb(25, 158, 216));
//   border-left-color: rgb(25, 158, 216);
//   border-right-color: $primary;
//   color: rgb(255, 255, 255);
//   margin-top: 3px;
//   position: relative;
//   border-radius: 5px;
//   padding: 5px 8px;
//   font-size: 13px;
//   display: inline-block;
//   p {
//     width: 100%;
//   }
//   &.bubble1 {
//     width: 55%;
//   }
//   &.bubble4 {
//     background: #ab47bc;
//     background: linear-gradient(to right,#ab47bc,#5169DE);
//     border-left-color: #5169de;
//     border-right-color: #ab47bc;
//   }
//   &.bubble7 {
//     background: transparent;
//     border: none;
//     padding: 0;
//     .sticker-message {
//       width: 100px;
//       height: 100px;
//     }
//     &:after {
//       content: none;
//     }
//   }

//   p {
//     display: inline-block;
//     span {
//       white-space: pre-wrap;
//       word-break: break-all;
//     }
//     img {
//       width: 100%;
//       min-height: 50px;
//       cursor: pointer;
//     }
//   }
// }
// .bubble:after {
//   content: '';
//   position: absolute;
//   top: 14px;
//   width: 0;
//   height: 0;
//   border: 9px solid transparent;
//   border-top: 0;
//   margin-top: -7px;
// }

.footer {
  background: #f5f5f5;
  padding: 0;
  width: 100%;
  .control-bar {
    height: 32px;
    background: #f5f5f5;
    border: 1px solid #ccc;
    border-left: 0;
    border-right: 0;
    position: relative;
    overflow: hidden;
    .btn-smile {
      .img-upload-input {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        position: absolute;
        top: -20px;
      }
    }
    .btn-smile:hover {
      background: #ffd4c0;
    }
  }
  .typing {
    position: relative;
    padding: 5px;
    .txtinput {
      display: block;
      width: auto;
      margin-right: 58px;
    }
    .el-textarea {
      vertical-align: bottom;
    }
    .is-disabled {
      .el-textarea-inner {
        background-color: #eef1f6;
        border-color: #d1dbe5;
        color: #bbb;
        cursor: not-allowed;
        height: 54px;
        resize: none;
      }
    }
    .el-textarea-inner {
      display: block;
      resize: vertical;
      padding: 5px 7px;
      line-height: 1.5;
      width: 100%;
      font-size: 14px;
      color: #1f2d3d;
      background-color: #fff;
      border: 1px solid #bfcbd9;
      border-radius: 4px;
      transition: border-color .2s cubic-bezier(.645,.045,.355,1);
      box-sizing: border-box;
      background-image: none;
    }
  }

  .btn-control {
    float: left;
    padding: 4px 12px;
    line-height: 32px;
    margin-right: 1px;
    background: #e5e5e5;
    color: #666;
    cursor: pointer;
    .el-icon-picture {
      cursor: pointer;
      font-size: 20px;
    }
  }
  .envelope-icon .img{
    width: 20px;
  }
  .sendbtn {
    position: absolute;
    right: 5px;
    bottom: 5px;
  }
}
.edit-profile {
  max-width: 310px;
  border-radius: 5px;
  background: rgba(255,255,255,.93);
  margin: 50px auto 0;
  position: relative;
  min-height: 200px;
  border: 1px solid #c8d4e4;
  text-align: center;
  padding: 20px 0;
  width: 90%;
  z-index: 9999;
  color: #4f77ab;
  .avatar-upload-tip {
    font-size: 12px;
    color: rgb(255, 127, 77);
  }
  .icon-edit {
    font-size: 20px;
  }
  .avatar {
    display: inline-block;
    border-radius: 50%;
    width: 90px;
    height: 90px;
    border: 1px solid #c8d4e4;
    overflow: hidden;
    cursor: pointer;
    img {
      display: block;
      width: 100%;
    }
    label {
      display: block;
      position: absolute;
      top: 38px;
      left: 0;
      width: 100%;
      text-align: center;
      color: #fff;
      font-size: 50px;
      color: #909090;
      cursor: pointer;
    }
  }
  .txt-nick {
    font-size: 20px;
  }
  p {
    margin-top: 5px;
    cursor: pointer;
  }
  .u-btn {
    width: 56px;
    height: 20px;
    font-size: 12px;
    line-height: 20px;
  }
  .el-icon-edit-outline {
    color: $primary;
    font-size: 20px;
  }
}

.u-btn {
  display: inline-block;
  text-align: center;
  border-radius: 3px;
  margin-left: 3px;
  width: 52px;
  height: 52px;
  font-size: 14px;
  line-height: 52px;
  background: $primary;
  color: #fff;
  cursor: pointer;
}

.chat-guide {
  position: fixed;
  right: 0;
  top: 50%;
  width: 40px;
  height: 122px;
  margin-top: -76px;
  background-size: 100%;
  cursor: pointer;
  z-index: 0;
  background: #1e72df;
  border-radius: 8px 0 0 8px;
  padding-top: 14px;
  .font-wechat {
    color: #d1e6fe;
  }
  ul {
    font-size: 18px;
    color: #fff;
    li {
      text-align: center;
      padding: 4px 0;
    }
  }
}

// .envelope-message {
//   display: flex;
//   width: 190px;
//   padding: 10px;
//   border-radius: 5px;
//   justify-content: stretch;
//   background-color: #fa9d3b;
//   position: relative;
//   &.expired {
//     background: #f5c38e;
//   }
//   &.null {
//     background: #f5c38e;
//   }
//   .img {
//     width: 30px;
//     height: 35px;
//   }
//   .send-texts {
//     color: #fff;
//     .slogan {
//       font-size: 14px;
//       width: 150px;
//       white-space: nowrap;
//       overflow: hidden;
//       text-overflow: ellipsis;
//     }
//   }
//   &:after {
//     content: '';
//     position: absolute;
//     top: 14px;
//     width: 0;
//     height: 0;
//     border: 9px solid transparent;
//     border-top: 0;
//     margin-top: -7px;
//     border-right-color: #fa9d3b;
//   }
// }
// .item-left .envelope-message{
//   &:after {
//     left: 0;
//     border-left: 0;
//     margin-left: -8px;
//   }
//   &.null:after, &.expired:after {
//     border-right-color: #f5c38e;
//   }
// }
// .item-right .envelope-message{
//   float: right;
//   &:after {
//     right: 0;
//     border-right: 0;
//     margin-right: -9px;
//     border-left-color: #fa9d3b;
//   }
//   &.null:after, &.expired:after {
//     border-left-color: #f5c38e;
//   }
// }

// .get-envelope {
//   display: inline-block;
//   color: #dedede;
//   background: rgba(255, 255, 255, 0.1);
//   padding: 5px 20px;
//   border-radius: 4px;
// }


</style>

<style lang="scss">
.emoji-popover {
  &.el-popover {
    padding: 0;
  }
  .el-tabs--border-card {
    padding: 0;
    border: 0;
  }
  .el-tabs__nav-scroll {
    padding-left: 0;
  }
}

.stickers-tab .el-tabs__content {
  padding: 0;
}
</style>
