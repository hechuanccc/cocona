<template>
  <div class="chat-container">
    <el-container
      class="chat-box"
      v-loading="loading"
      id="chatBox"
      element-loading-text="正在登录"
      v-if="isLogin && showChatRoom && RECEIVER">
      <el-header class="chat-header clearfix" height="56px">
        <div class="left fl clearfix">
          <span class="title">{{roomTitle}}</span>
        </div>
        <div class="right fr clearfix">
          <img :src="require('../assets/icon_setting.png')"
            v-if="isManager"
            alt="setting"
            class="clickable icon"
            @click="handleBlockPopupShow"/>
          <img :src="require('../assets/icon_profile.png')"
            alt="profile"
            class="clickable icon"
            @click="isBlocked || !user.account_type ? '' : showEditProfile = true"/>
          <img :src="require('../assets/icon_close.png')"
            alt="profile"
            class="clickable icon"
            @click="showChatRoom = false"/>
        </div>

        <transition
          enter-class="profileFadeInEnter"
          leave-active-class="animated fadeOutUp"
          enter-active-class="animated fadeInDown">
          <div class="edit-profile" v-if="showEditProfile">
            <div @mouseover="swichAvatar = true" @mouseout="swichAvatar = false">
              <el-upload
                class="avatar clickable"
                style="overflow-y: hidden;"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img class="img" v-if="user.avatar && !swichAvatar" :src="user.avatar">
                <img class="img" v-else-if="!swichAvatar" :src="defaultAvatar">
                <label for="avatarUploadInput" class="upload-avatar clickable" v-if="swichAvatar">
                  <span class="el-icon-upload"></span>
                </label>
              </el-upload>
            </div>
            <p class="avatar-upload-tip">{{user.avatar ? '(如需更换头像请点击上方头像上传)' : '(您还未设置头像, 请点击头像上传)'}}</p>
            <p class="clickable" @click="showNickNameBox = true">
              <span class="display-name">{{user.account_type === 0 ? '试玩会员' : (user.nickname || user.username)}}</span>
              <a href="javascript:void(0)" class="icon-edit">
                <span class="el-icon-edit-outline"></span>
              </a>
            </p>
            <el-button type="primary" @click.native="showEditProfile = false">关闭</el-button>
          </div>
        </transition>

        <transition enter-class="profileFadeInEnter"
          leave-active-class="animated fadeOutUp"
          enter-active-class="animated fadeInDown">
          <div class="edit-profile" v-if="showCheckUser">
            <div class="avatar" style="overflow-y: hidden;">
              <img :src="checkUser.avatar_url || defaultAvatar" class="avatar">
            </div>
            <p class="avatar-upload-tip">{{checkUser.nickname || checkUser.username}}({{checkUser.level_name}})</p>
            <div class="restraint-actions">
              <el-button type="danger" size="mini" @click.native="ban(15)">禁言15分钟</el-button>
              <el-button type="danger" size="mini" @click.native="ban(30)">禁言30分钟</el-button>
              <el-button type="danger" size="mini" @click.native="block()">加入黑名单</el-button>
            </div>
            <el-button type="primary" @click.native="showCheckUser = false">关闭</el-button>
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
            <MarqueeTips :content="announcement" :speed="20"></MarqueeTips>
          </div>
        </div>

        <ChatMessages :messages="messages"
          ref="chatmessages"
          @checkUser="handleCheckUser"
          :defaultAvatar="defaultAvatar"
          :user="user"
          :envelope="envelope"
          :isBanned="isBanned"
          :isBlocked="isBlocked"
          :isManager="isManager"
          :personalSetting="personal_setting"/>

      </el-main>

      <el-footer class="footer" height="120">
        <div class="control-bar">
          <el-popover :popper-class="'emoji-popover'"
            :disabled="!user.account_type || isBlocked || isBanned || !personal_setting.chat.status"
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

          <a v-popover:sticker-popover
            href="javascript:void(0)"
            title="发送表情" class="btn-control btn-smile clickable"
            @mouseenter="controlBar.sticker = true"
            @mouseleave="controlBar.sticker = false">
            <img :src="controlBar.sticker ? require('../assets/icon_sticker_hover.png') : require('../assets/icon_sticker_normal.png')"
              alt="sticker"/>
          </a>

          <a href="javascript:void(0)" class="btn-control btn-smile clickable">
            <label for="imgUploadInput" @click="handleImgIconClick($event)" class="clickable" @mouseenter="controlBar.image = true" @mouseleave="controlBar.image = false">
              <span title="上传图片">
                <img :src="controlBar.image ? require('../assets/icon_picture_hover.png') : require('../assets/icon_picture_normal.png')"
                  alt="sticker"/>
                <input :disabled="!personal_setting.chat.status"
                  @change="sendMsgImg"
                  type="file"
                  ref="fileImgSend"
                  class="img-upload-input"
                  id="imgUploadInput"
                  accept=".jpg, .png, .gif, .jpeg, image/jpeg, image/png, image/gif">
              </span>
            </label>
          </a>

          <div v-if="systemConfig.envelopeSettings && systemConfig.envelopeSettings.enabled === '1'"
            :class="['btn-control',
              'btn-smile',
              'envelope-icon',
              'clickable',
              {'not-allowed': isBanned || isBlocked}]"
            @mouseenter="controlBar.redEnvelope = true" @mouseleave="controlBar.redEnvelope = false"
            @click="handleEnvelopeIconClick">
            <img class="img" :src="controlBar.redEnvelope ? require('../assets/icon_red pocket_hover.png') : require('../assets/icon_red pocket.png')" alt="envelope-icon">
          </div>

        </div>

        <div class="typing">

          <div :class="['txtinput', 'el-textarea', !personal_setting.chat.status ? 'is-disabled' : '']">
            <textarea  @keyup.enter="sendMsg"
              @focus="$store.dispatch('updateIsChatting', true)"
              @blur="$store.dispatch('updateIsChatting', false)"
              :placeholder="personal_setting.chat.status ? (isBanned || isBlocked) ? '你现在没有发言权限' : '' : chatConditionMessage"
              type="textarea" rows="2"
              ref="textarea"
              autocomplete="off"
              validateevent="true"
              class="el-textarea-inner"
              v-model="msgCnt"
              :disabled="!personal_setting.chat.status">
            </textarea>
          </div>

          <div class="p-r text-right sendbtn">
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
      v-if="isLogin && roomTitle && RECEIVER"
      class="chat-guide text-center"
      @click="handleEntryClick()">
      <icon class="font-wechat" name="wechat" scale="1.7"></icon>
      <div class="words vertical-writing" v-html="verticalTranform(roomTitle)">
      </div>
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
import { updateUser,
  fetchChatEmoji,
  sendImgToChat,
  banChatUser,
  blockChatUser,
  unblockChatUser,
  unbanChatUser,
  getRoomUserInfo,
  fetchStickers} from '../api'
import config from '../../config'
import Stickers from './Stickers'
import Envelope from './Envelope'
import Emojis from './Emojis'
import ChatMessages from './ChatMessages'
import _ from 'lodash'

const WSHOST = config.chatHost
const removeItem = (arr, item) => {
  let index = arr.indexOf(item)
  if (index !== -1) {
    arr.splice(index, 1)
  }
}
export default {
  data () {
    let RECEIVER = this.$store.state.chatRoom.defaultRoom

    return {
      RECEIVER,
      ws: null,
      defaultAvatar: require('../assets/avatar.png'),
      defaultRoom: this.$store.state.chatRoom.defaultRoom,
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
      managerLoading: false,
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
      roomTitle: '',
      controlBar: {
        sticker: false,
        image: false,
        redEnvelope: false
      }
    }
  },
  components: {
    MarqueeTips, Stickers, Emojis, Envelope, ChatMessages
  },
  watch: {
    'stickerPopoverVisible': function (visible) {
      if (visible) {
        this.getStickers()
      }
    },
    '$route.params.gameId': function (val, oldVal) {
      if (val) {
        let oldRoom = this.RECEIVER
        this.initRECEIVER()

        if (!this.ws) {
          this.joinChatRoom()
        } else {
          let roomChanged = (oldRoom !== this.RECEIVER)
          if (roomChanged) {
            this.ws.send(JSON.stringify({
              'command': 'leave',
              'receivers': [oldRoom]
            }))

            this.ws.send(JSON.stringify({
              'command': 'join',
              'receivers': [this.RECEIVER]
            }))
          }
        }

        this.getUser()
      }
    },
    'RECEIVER': function () {
      this.messages = []
      this.scrollToEnd()
    },
    'isLogin': function (val) {
      if (!val) {
        this.closeEnvelope()
        this.showChatRoom = false
        this.messages = []
        this.showEditProfile = false

        if (this.ws) {
          this.ws.close()
          this.ws = null
          this.RECEIVER = null
          this.$store.dispatch('updateCurrentChatRoom', null)
        }
      }
    },
    'ws': function () {
      if (!this.ws) {
        this.showChatRoom = false
      }
    }
  },
  mounted () {
    this.initRECEIVER()
  },
  computed: {
    ...mapState([
      'user',
      'envelopes',
      'systemConfig',
      'chatRoom'
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
    isLogin () {
      return this.user.logined
    },
    chatConditionMessage () {
      return this.systemConfig.global_preferences.chat_condition_message
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
    verticalTranform (str) {
      return str.replace(/(\d+\w+|\d+|\w+.*?)/g, '<span style="text-orientation: upright; writing-mode: horizontal-tb; line-height: 1.5">$1</span>')
    },
    handleEntryClick () {
      this.showChatRoom = true
      this.joinChatRoom()
    },
    handleImgIconClick (e) {
      if (this.isBlocked || this.isBanned || !this.user.account_type) {
        e.preventDefault()
      }
    },
    initRECEIVER () {
      let gameId = this.$route.params.gameId
      let roomsStatus = this.chatRoom.roomsStatus
      let current = roomsStatus[gameId] && roomsStatus[gameId].status ? roomsStatus[gameId] : !roomsStatus[this.defaultRoom].status ? {id: undefined, title: ''} : roomsStatus[this.defaultRoom]
      this.RECEIVER = current.id
      this.roomTitle = current.title
      this.$store.dispatch('updateCurrentChatRoom', this.RECEIVER)
    },
    scrollToEnd () {
      if (this.$refs['chatmessages']) {
        this.$refs['chatmessages'].scrollToEnd()
      }
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
      if (this.isBlocked || this.isBanned || !this.personal_setting.chat.status) {
        return
      }
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
      if (this.ws) {
        this.ws.send(JSON.stringify({
          'command': 'join',
          'receivers': [this.RECEIVER]
        }))
        return
      }

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
    },
    handleMsg () {
      this.loading = false
      if (!this.ws) { return false }

      this.ws.onmessage = (resData) => {
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

                    if (data.command === 'banned') {
                      this.errMsg = true
                      this.errMsgCnt = data.content
                    } else if (data.command === 'unblock') {
                      this.personal_setting.chat.status = 1
                      removeItem(this.personal_setting.blocked, this.RECEIVER)
                      this.joinChatRoom()
                    } else if (data.command === 'unbanned') {
                      this.personal_setting.chat.status = 1
                      this.personal_setting.banned[this.RECEIVER] = ''
                    } else if (data.command === 'join') {
                      this.RECEIVER = data.receivers
                      this.$store.dispatch('updateCurrentChatRoom', data.receivers)
                    } else if (data.command === 'chat_condition_passed') {
                      this.personal_setting.chat.status = 1
                      this.personal_setting.chat.reasons = []
                    }

                    if (this.showChatRoom) {
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
                    this.personal_setting.banned[data.room_id] = data.msg
                    break
                  case 5:
                    this.errMsg = true
                    this.messages = []
                    this.personal_setting.blocked.push(data.room_id)
                    this.errMsgCnt = data.msg
                    break
                  case 6:
                    this.$store.dispatch('updateRoomStatus', this.RECEIVER, 0)
                    this.joinChatRoom(this.defaultRoom)
                    this.RECEIVER = this.defaultRoom

                    this.$store.dispatch('updateCurrentChatRoom', this.defaultRoom)
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
      this.closeEnvelope()

      this.ws && this.ws.send(JSON.stringify({
        'command': 'leave',
        'receivers': [this.RECEIVER]
      }))

      if (this.ws) {
        this.ws.close()
        this.ws = null
        this.RECEIVER = null
        this.$store.dispatch('updateCurrentChatRoom', null)
      }
    },
    handleCheckUser (sender) {
      this.checkUser = sender
      this.showCheckUser = true
    },
    ban (mins) {
      banChatUser(this.RECEIVER, {
        user: this.checkUser.username,
        banned_time: mins
      }).then((response) => {
        let data = response.data.data
        this.showCheckUser = false
        this.$message({
          showClose: true,
          message: data.status,
          type: 'success'
        })
      }, errorMsg => {
        this.$message({
          showClose: true,
          message: msgFormatter(errorMsg),
          type: 'error'
        })
      })
    },
    unban (user) {
      unbanChatUser(this.RECEIVER, {
        user: user
      }).then((response) => {
        let data = response.data.data
        this.getUser()
        this.$message({
          showClose: true,
          message: data.status,
          type: 'success'
        })
      }, errorMsg => {
        this.$message({
          showClose: true,
          message: msgFormatter(errorMsg),
          type: 'error'
        })
      })
    },
    block () {
      blockChatUser(this.RECEIVER, {
        user: this.checkUser.username
      }).then((response) => {
        let data = response.data.data
        this.showCheckUser = false
        this.$message({
          showClose: true,
          message: data.status,
          type: 'success'
        })
      }, errorMsg => {
        this.showCheckUser = false
        this.$message({
          showClose: true,
          message: msgFormatter(errorMsg),
          type: 'error'
        })
      })
    },
    unblock (user) {
      unblockChatUser(this.RECEIVER, {
        user: user
      }).then((response) => {
        let data = response.data.data
        this.getUser()
        this.$message({
          showClose: true,
          message: data.status,
          type: 'success'
        })
      }, errorMsg => {
        this.$message({
          showClose: true,
          message: msgFormatter(errorMsg),
          type: 'error'
        })
      })
    },
    getUser () {
      if (!this.isManager || this.managerLoading) {
        return
      }
      this.managerLoading = true
      getRoomUserInfo(this.RECEIVER).then(response => {
        let data = response.data.data
        this.roomManagers = data.managers
        this.bannedUsers = data.banned_users
        this.blockedUsers = data.block_users
        this.managerLoading = false
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
    width: 420px;
    z-index: 2;
  }

  &-box {
    position: fixed;
    right: 0;
    top: 0;
    width: 420px;
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
    left: 0px;
    right: 0px;
    background: #fff;
    height: 32px;
    line-height: 32px;
    overflow: hidden;
    z-index: 3;

    .bulletin {
      background-image: #fff;
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
  height: 120px;
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
  }
  .typing {
    position: relative;
    display: inline-flex;
    box-sizing: border-box;
    width: 100%;
    height: calc(100% - 32px);
    padding: 0 0 0px 5px;
    .txtinput {
      display: block;
      width: auto;
      flex-grow: 1;
      align-self: center;
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
      width: 100%;
      height: 72px;
      resize: none;
      background-color: #fcfcfc;
      border: none;
      border-radius: 5px;
      line-height: 1.5;
      font-size: 16px;
      color: #333333;
      outline: none;
      background-image: none;
    }

    .sendbtn {
      display: flex;
      align-items: center;
      padding-right: 5px;
    }
  }

  .btn-control {
    float: left;
    padding: 4px 10px;
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
    width: auto;
  }
}

.edit-profile {
  position: relative;
  max-width: 310px;
  border-radius: 5px;
  background: rgba(255,255,255,.93);
  margin: 50px auto 0;
  min-height: 200px;
  border: 1px solid #c8d4e4;
  text-align: center;
  padding: 10px 0;
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
    .img {
      display: block;
      width: 100%;
    }
    .upload-avatar {
      display: block;
      position: absolute;
      top: 38px;
      left: 0;
      width: 100%;
      text-align: center;
      color: #fff;
      font-size: 50px;
      color: #909090;
    }
  }

  .display-name {
    font-size: 20px;
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
  margin-left: 5px;
  width: 72px;
  height: 72px;
  line-height: 72px;
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
  height: auto;
  margin-top: -76px;
  background-size: 100%;
  cursor: pointer;
  z-index: 0;
  background: #1e72df;
  border-radius: 8px 0 0 8px;
  padding-top: 15px;
  padding-bottom: 15px;
  .font-wechat,
  .words {
    color: #fff;
    font-size: 18px;
    line-height: 40px;
  }

  .vertical-writing {
    writing-mode: vertical-rl;

    .number {
      text-orientation: upright;
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
