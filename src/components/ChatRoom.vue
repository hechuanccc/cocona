<template>
  <div class="chat-container">
    <el-container
      class="chat-box"
      v-loading="loading"
      id="chatBox"
      element-loading-text="正在登录"
      v-if="isLogin && showChatRoom">
      <el-header class="chat-header clearfix" height="56px">
        <div class="left fl clearfix">
          <span class="title">{{roomTitle}}</span>
        </div>
        <div class="right fr clearfix">
          <img :src="require('../assets/icon_setting.png')"
            v-if="personal_setting.manager"
            alt="setting"
            class="clickable icon"
            @click="handleBlockPopupShow"/>

          <img :src="require('../assets/icon_profile.png')"
            alt="profile"
            class="clickable icon"
            @click="personal_setting.blocked ? '' : showEditProfile = true"/>

          <img :src="require('../assets/icon_close.png')"
            alt="profile"
            class="clickable icon"
            @click="leaveRoom"/>

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
                <img v-else-if="!swichAvatar" :src="defaultAvatar">
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
              <img :src="checkUser.avatar_url || defaultAvatar" class="avatar">
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

        <ChatMessages :messages="messages"
          ref="chatmessages"
          :defaultAvatar="defaultAvatar"
          :user="user"
          :envelope="envelope"
          :isBanned="isBanned"
          :isBlocked="isBlocked"
          :isManager="isManager"
          :personalSetting="personal_setting"/>
      </el-main>

      <el-footer class="footer" height="130">
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
                    :roomId="RECEIVER"
                    :ws="ws"
                    @closeStickerPopover="closeStickerPopover"
                    v-if="stickerTab === 'stickers'"/>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-popover>

          <a v-popover:sticker-popover href="javascript:void(0)" title="发送表情" class="btn-control btn-smile">
            <img :src="require('../assets/icon_sticker_normal.png')"
              alt="sticker"/>
          </a>

          <a href="javascript:void(0)" class="btn-control btn-smile">
            <label for="imgUploadInput">
              <span title="上传图片">
                <img :src="require('../assets/icon_picture_normal.png')"
                  alt="sticker"/>
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
              ref="textarea"
              autocomplete="off"
              validateevent="true"
              class="el-textarea-inner"
              v-model="msgCnt"
              :disabled="personal_setting.chat.status ? false : true">
            </textarea>
          </div>

          <div class="p-r text-right" @click="$refs.textarea.focus()">
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
import { mapState, mapGetters } from 'vuex'
import { msgFormatter, getCookie } from '../utils'
import { updateUser, fetchChatEmoji, sendImgToChat, banChatUser, blockChatUser, unblockChatUser, unbanChatUser, getChatUser, fetchStickers } from '../api'
import config from '../../config'
import Stickers from './Stickers'
import Envelope from './Envelope'
import Emojis from './Emojis'
import ChatMessages from './ChatMessages'
import _ from 'lodash'

const WSHOST = config.chatHost
let RECEIVER = 100000

export default {
  props: {
    showEntry: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      RECEIVER,
      ws: null,
      defaultAvatar: require('../assets/avatar.png'),
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
        banned: {},
        blocked: [],
        plan_maker: [],
        manager: [],
        chat: {
          status: '',
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
      },
      backTodefaultRoom: false
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
    },
    'currentGame': function (val, oldVal) {
      if (oldVal) {
        this.leaveRoom()
        this.RECEIVER = val.id
        this.$store.dispatch('updateCurrentChatRoom', val.id)
        this.joinChatRoom()
      }
      this.getUser()
    }
  },
  computed: {
    ...mapState([
      'user',
      'envelopes',
      'systemConfig',
      'chatRoom'
    ]),
    ...mapGetters([
      'currentGame'
    ]),
    isManager () {
      return this.personal_setting.manager.includes(this.RECEIVER)
    },
    isBlocked () {
      return this.personal_setting.blocked.includes(this.RECEIVER)
    },
    isBanned () {
      return !!this.personal_setting.banned[this.RECEIVER]
    },
    roomTitle () {
      if (this.currentGame) {
        if (this.chatRoom.currentRoom !== this.chatRoom.defaultRoom) {
          return this.currentGame.display_name + '聊天室'
        } else {
          return '聊天室'
        }
      } else {
        return ''
      }
    },
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
    scrollToEnd () {
      console.log(this.$refs)
      this.$refs['chatmessages'].scrollToEnd()
    },
    isAlive (time) {
      return this.$moment().isBefore(this.$moment(time))
    },
    closeEnvelope () {
      this.envelope.visible = false
    },
    handleEnvelopeSend (envelope) {
      this.envelope.visible = false
      this.envelope.status = ''
      this.$store.dispatch('fetchUser')

      this.scrollToEnd()
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
          this.stickerGroups = res.data.map(sticker => {
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
    joinChatRoom (room) {
      this.showChatRoom = true
      let token = getCookie('access_token')
      this.loading = true
      this.ws = new WebSocket(`${WSHOST}/chat/stream?username=${this.$store.state.user.username}&token=${token}`)
      this.ws.onopen = () => {
        this.ws.send(JSON.stringify({
          'command': 'join',
          'receivers': [room || this.RECEIVER]
        }))

        this.handleMsg()
      }
      this.ws.onclose = () => {
        this.ws = null
      }
    },
    handleMsg () {
      this.loading = false
      if (!this.ws) { return false }

      this.ws.onmessage = (resData) => {
        if (!this.showChatRoom || !this.showEntry) { return }
        let data
        if (typeof resData.data === 'string') {
          try {
            data = JSON.parse(resData.data)

            if (!data.error_type) {
              if (data.latest_message) {
                if (!this.emojis.people.length) {
                  fetchChatEmoji().then((resData) => {
                    this.emojis = resData.data.data
                  }).catch(err => console.log(err))
                }
                if (data.bulletin.length) {
                  this.announcement = data.bulletin.join(' ')
                }

                _.each(data.latest_message, (msg) => {
                  msg.isSaidByMe = msg.sender && (msg.sender.username === this.user.username)
                }
                )

                this.messages = this.messages.concat(data.latest_message.reverse())

                let envelopes = data.latest_message.filter((msg) => msg.type === 5 && this.isAlive(msg.envelope_status.expired_time))
                envelopes.forEach((envelope) => {
                  this.$store.dispatch('collectEnvelope', envelope)
                })

                this.$nextTick(() => {
                  this.scrollToEnd()
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
                        this.personal_setting.chat.status = 1
                        this.personal_setting.blocked.remove(this.RECEIVER)
                        this.joinChatRoom()
                      } else if (data.command === 'unbanned') {
                        this.personal_setting.chat.status = 1
                        this.personal_setting.banned[this.RECEIVER] = ''
                      } else if (data.command === 'join') {
                        this.RECEIVER = data.receivers
                        this.$store.dispatch('updateCurrentChatRoom', data.receivers)
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
                    data.isSaidByMe = data.sender && (data.sender.username === this.user.username)
                    this.messages.push(data)
                    this.$store.dispatch('collectEnvelope', data)
                    this.$nextTick(() => {
                      this.scrollToEnd()
                    })
                    return
                  case 6:
                    data.isSaidByMe = data.sender && (data.sender.username === this.user.username)
                    this.messages.push(data)
                    this.$store.dispatch('collectEnvelope', data)
                    let currentEnvelopeIndex = this.messages.findIndex((msg) => msg.envelope_status && msg.envelope_status.id === data.envelope_status.id)

                    this.messages[currentEnvelopeIndex].envelope_status = data.envelope_status

                    if (data.sender.id === this.user.id) {
                      this.$nextTick(() => {
                        this.scrollToEnd()
                      })
                    }
                    return

                  default:
                    data.isSaidByMe = data.sender && (data.sender.username === this.user.username)
                    this.messages.push(data)
                }

                let chatBox = document.getElementById('chatBox')
                if (chatBox) {
                  let h = chatBox.clientHeight
                  let sh = chatBox.scrollHeight || chatBox.offsetHeigth
                  let st = chatBox.scrollTop || document.documentElement.scrollTop || document.body.scrollTop
                  if (h + st + 100 >= sh || (data.sender && data.sender.username === this.user.username)) {
                    this.scrollToEnd()
                  }
                }
              }
            } else {
              if (data.error_type !== 2 && data.error_type !== 3) {
                switch (data.error_type) {
                  case 4:
                    this.errMsg = true
                    this.errMsgCnt = '您已被聊天室管理员禁言，在' + this.$moment(data.msg).format('YYYY-MM-DD HH:mm:ss') + '后才可以发言。'
                    this.personal_setting.banned[data.roomId] = data.msg
                    this.personal_setting.chat.status = 0
                    break
                  case 5:
                    this.errMsg = true
                    this.messages = []
                    this.personal_setting.blocked.push(data.roomId)
                    this.personal_setting.chat.status = 0
                    this.errMsgCnt = data.msg
                    break
                  case 6:
                    this.leaveRoom()
                    this.joinChatRoom(this.chatRoom.defaultRoom)
                    this.RECEIVER = this.chatRoom.defaultRoom
                    this.$store.dispatch('updateCurrentChatRoom', this.chatRoom.defaultRoom)
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
        this.scrollToEnd()
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
      formData.append('receivers', this.RECEIVER)
      formData.append('image', file)
      sendImgToChat(formData).then((data) => {
        fileInp.value = ''
      })
    },
    sendMsg () {
      if (!this.msgCnt.trim()) { return false }
      this.ws.send(JSON.stringify({
        'command': 'send',
        'receivers': [this.RECEIVER],
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
        'receivers': [this.RECEIVER]
      }))

      this.RECEIVER = null
      this.$store.dispatch('updateCurrentChatRoom', null)

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
      banChatUser(this.RECEIVER, {
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
      unbanChatUser(this.RECEIVER, {
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
      blockChatUser(this.RECEIVER, {
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
      unblockChatUser(this.RECEIVER, {
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
      getChatUser(this.RECEIVER).then(response => {
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
    width: 380px;
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
    background-color: #f2f2f2;
  }

}


.chat-header {
  height: 56px;
  line-height: 56px;
  color: #fff;

  .icon {
    margin-left: 10px;
    vertical-align: middle;
  }

  .title {
    font-size: 20px;
  }
}

.chat-body {
  padding: 5px 0;
  .announcements {
    position: absolute;
    top: 56px;
    left: 5px;
    right: 5px;
    background-image: linear-gradient(to bottom, #f2f2f2 39%, rgba(242, 242, 242, 0.9) 97%);
    height: 32px;
    line-height: 32px;
    overflow: hidden;
    z-index: 3;

    .bulletin {
      background-image: linear-gradient(to bottom, #f2f2f2 39%, rgba(242, 242, 242, 0.9) 97%);
      color: #b32020;
      padding: 0px 5px;
    }

    .volume-icon, .text {
      vertical-align: middle;
    }

    .marquee {
      margin-left: 75px;
      color: #999999;
    }
  }

}

.footer {
  height: 130px;
  width: 100%;
  background: #f5f5f5;
  border-top: 2px solid #e5e5e5;
  padding: 0;

  .control-bar {
    height: 32px;
    background: #f5f5f5;
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
    padding: 0px 5px;
    .txtinput {
      display: block;
      width: auto;
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
      }
    }
    .el-textarea-inner {
      display: block;
      box-sizing: border-box;
      resize: none;
      background-color: #f5f5f5;
      padding: 0px 5px;
      line-height: 1.5;
      width: 100%;
      font-size: 16px;
      color: #333333;
      border: none;
      outline: none;
      background-image: none;
    }
  }

  .btn-control {
    float: left;
    padding: 4px 12px;
    line-height: 32px;
    margin-right: 1px;
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
  width: 72px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
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
