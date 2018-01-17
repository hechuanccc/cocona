<template>
  <div class="container">
    <el-container 
      class="chat-box" 
      v-loading="loading"
      id="chatBox"
      element-loading-text="正在登陆"
      v-if="isLogin && showChatRoom">
      <el-header class="title clearfix" height="40px">
        <div class="left fl clearfix">
          <icon class="font-home fl" name="home" scale="1.4"></icon>
          <h3 class="fl m-l">聊天室</h3>
        </div>
        <div class="right fr clearfix">
          <icon class="icon-user fl" title="修改昵称" name="user" scale="1.4" @click.native="showEditProfile = true"></icon>
          <i class="el-icon-close close fl" title="关闭聊天室" @click="showChatRoom = false"></i>
        </div>
        <transition
          enter-class="profileFadeInEnter"
          leave-active-class="animated fadeOutUp"
          enter-active-class="animated fadeInDown">
          <div class="edit-profile" v-if="showEditProfile">
            <div
              v-on:mouseover="swichAvatar = true" 
              v-on:mouseout="swichAvatar = false">
              <el-upload
                class="avatar"
                style="overflow-y: hidden;"
                :action="uploadUrl"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">

                <img v-if="user.avatar && !swichAvatar" :src="user.avatar" class="avatar">
                <img v-else-if="!swichAvatar" src="../assets/avatar.png">
                <label for="avatarUploadInput" class="upload-avatar" v-if="swichAvatar">
                  <span class="el-icon-upload"></span>
                </label>
              </el-upload>
            </div>
           
            <p class="avatar-upload-tip">(您还未设置头像, 请点击头像上传)</p>
            <p>
              <span class="txt-nick">{{user.nickname || user.username}}</span>
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
      </el-header>
      <el-main class="content">
        <div class="chat-announce" v-if="announcement">
          <div class="ttl clearfix">
            <icon class="fl volume-up" name="volume-up"></icon>
            <span class="fl">公告:</span>
          </div>
          <div class="scroll">
            <MarqueeTips :content="announcement" :speed="10"></MarqueeTips>
          </div>
        </div>
        <div class="controls">
          <a class="list-ctrl clearfix" href="javascript:void(0)">
            <icon class="fl"  name="unsorted"></icon>
            <span class="fl" @click="$refs.msgEnd.scrollIntoView()">&nbsp;滚屏</span>
          </a>
          <a class="list-ctrl clearfix" href="javascript:void(0)">
            <icon class="fl"  name="trash"></icon>
            <span class="fl" @click="messages = []">&nbsp;清屏</span>
          </a>
        </div>
        <ul class="lay-scroll">
          <li v-for="(item, index) in messages" :class="['clearfix', 'item', item.sender && ((item.sender.nickname && item.sender.nickname === user.nickname) || user.username === item.sender.username) ? 'item-right' : 'item-left', item.type < 0 ? 'sys-msg' : '']">
            <div class="lay-block clearfix" v-if="item.type >= 0">
              <div class="avatar">
                <icon name="cog" class="font-cog" v-if="item.type == 4" scale="3"></icon>
                <img :src="computeAvatar(item)" v-else>
              </div>
              <div class="lay-content">
                <div class="msg-header">
                  <h4 v-html="item.type === 4 ? '计划消息' : item.sender && item.sender.username === user.username && user.nickname ? user.nickname : item.sender && (item.sender.nickname || item.sender.username)"></h4>
                  <span class="common-member" v-if="item.type !== 4">
                    <!-- <img src="../assets/icon_member01.gif" alt="普通会员"> -->
                    普通会员
                  </span>
                  <span class="msg-time">{{item.created_at | moment('HH:mm:ss')}}</span>
                </div>
                <div :class="['bubble', 'bubble' + item.type]">
                  <p>
                    <span v-if="item.type === 0 || item.type === 4" v-html="item.content"></span>
                    <img @click="showImageMsg = true; showImageMsgUrl = item.content" v-else-if="item.type === 1" :src="item.content">
                  </p>
                </div>
              </div>
            </div>
            <div class="inner" v-else-if="item.type === -1">
              <p>以上是历史消息</p>
            </div>
            <div v-else-if="item.type === -2 || item.type === -3" class="inner type-warning">
              <p>
                <span></span>
                <span v-if="item.type === -2">您尚未设置昵称, 点击</span>
                <span v-else>您可以上传自己的头像啦, 点击</span>
                <a href="javascript:void(0)" class="btn-here" @click="item.type === -3 ? showEditProfile = true : showNickNameBox = true">这里</a>
                设置
              </p>
              <p v-if="item.type === -2">昵称设置过后将无法再次更改哦</p>
            </div>
          </li>
          <li ref="msgEnd" id="msgEnd" class="msgEnd"></li>
        </ul>
      </el-main>
      <el-footer class="footer" height="100">
        <div class="control-bar">
          <el-popover
            ref="popover4"
            placement="top-start"
            width="260"
            trigger="click">
            <div class="emoji-container">
              <a href="javascript:void(0)" v-for="(item, index) in emojis.people" class="emoji" @click="msgCnt = msgCnt + item.emoji">
                {{item.emoji}}
              </a>
            </div>
            
          </el-popover>
          <a v-popover:popover4 href="javascript:void(0)" title="发送表情" class="btn-control btn-smile">
            <icon scale="1.3" name="smile-o"></icon>
          </a>
          <a href="javascript:void(0)" class="btn-control btn-smile">
            <label for="imgUploadInput">
              <span title="上传图片">
                <i class="el-icon-picture"></i>
                <input @change="sendMsgImg" type="file" ref="fileImgSend" class="img-upload-input" id="imgUploadInput" accept=".jpg, .png, .gif, .jpeg, image/jpeg, image/png, image/gif">
              </span>
            </label>
          </a>
        </div>
        <div class="typing">
          <div class="txtinput el-textarea">
            <textarea :placeholder="sendMsgCondition"  type="textarea" rows="2" autocomplete="off" validateevent="true" class="el-textarea-inner" v-model="msgCnt"></textarea>
          </div>
          <div class="sendbtn fr">
            <a href="javascript:void(0)" class="u-btn" @click="sendMsg">发送</a>
          </div>
        </div>
      </el-footer>
    </el-container>
    <el-dialog title="修改昵称" :visible.sync="showNickNameBox" width="400px" custom-class="changeNickNameBox">
      <el-form>
        <el-form-item label="请输入昵称, 昵称设置后将无法更改">
          <el-input auto-complete="off" v-model="nickname"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showNickNameBox = false">取 消</el-button>
        <el-button type="primary" @click="submitNickName">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="showImageMsg" width="640px" custom-class="show-image-msg text-center">
      <img :src="showImageMsgUrl">
    </el-dialog>
    <el-dialog :visible.sync="errMsg" width="400px" custom-class="showImageMsg">
      <p>{{errMsgCnt}}</p>
    </el-dialog>
    <div v-if="isLogin" class="chat-guide text-center" @click="joinChatRoom">
      <icon class="font-wechat" name="wechat" scale="1.7"></icon>
      <p class="text-center">
        <span>聊</span>
        <span>天</span>
        <span>室</span>
      </p>
    </div>
  </div>
 
</template>

<script>
import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'
import MarqueeTips from 'vue-marquee-tips'
import urls from '../api/urls'
import { msgFormatter } from '../utils'
import { updateUser, fetchChatEmoji, sendImgToChat } from '../api'
import config from '../../config'
const WSHOST = 'ws://' + config.chatHost + ''
const RECEIVER = 1

export default {
  data () {
    return {
      showChatRoom: false,
      messages: [],
      showEditProfile: false,
      swichAvatar: false,
      msgCnt: '',
      showNickNameBox: false,
      errMsg: false,
      errMsgCnt: '',
      uploadUrl: urls.user,
      nickname: this.$store.state.user.nickname,
      showImageMsg: false,
      showImageMsgUrl: '',
      loading: false,
      emojis: {
        people: []
      },
      announcement: ''
    }
  },
  components: {
    MarqueeTips
  },
  computed: {
    isLogin () {
      return this.$store.state.user.logined && this.$route.name !== 'Home'
    },
    user () {
      return this.$store.state.user
    },
    sendMsgCondition () {
      let condition = JSON.parse(this.$store.state.systemConfig.global_preferences.send_chat_conditions)
      if (Object.keys(condition).length) {
        return `发言条件：前${condition['days']}天充值不少于${condition['deposit_threshold']}元；投注打码量不少于${condition['bet_threshold']}元`
      }
      return ''
    }
  },
  methods: {
    joinChatRoom () {
      this.showChatRoom = true
      let token = Vue.cookie.get('access_token')
      if (this.$socket && this.$socket.readyState === 1) {
        this.handleMsg()
      } else {
        this.loading = true
        Vue.use(VueNativeSock, `${WSHOST}/chat/stream?username=${this.$store.state.user.username}&token=${token}`, {
          format: 'json',
          reconnection: true,
          reconnectionDelay: 3000
        })
        setTimeout(() => {
          if (!this.$socket) {
            this.joinChatRoom()
            return
          }
          if (this.$socket && this.$socket.readyState !== 1) {
            this.joinChatRoom()
            return
          } else {
            this.handleMsg()
          }
          if (!this.emojis.people.length) {
            fetchChatEmoji().then((resData) => {
              this.emojis = resData.data
            }).catch(err => console.log(err))
          }
        }, 2000)
      }
    },
    handleMsg () {
      this.loading = false
      this.$socket.sendObj({
        'command': 'join',
        'receivers': [RECEIVER]
      })
      this.$socket.onmessage = (resData) => {
        let data
        if (typeof resData.data === 'string') {
          try {
            data = JSON.parse(resData.data)
            if (!data.error) {
              if (data.latest_message) {
                if (data.latest_message[data.latest_message.length - 1].type === 3) {
                  let annouce = data.latest_message.pop()
                  this.announcement = annouce.content
                }
                this.messages = this.messages.concat(data.latest_message.reverse())
                this.messages = this.messages.concat([{
                  type: -1
                }, {
                  type: -2
                }, {
                  type: -3
                }])
                this.$nextTick(() => {
                  this.$refs.msgEnd && this.$refs.msgEnd.scrollIntoView()
                })
                return
              } else {
                switch (data.type) {
                  case 2:
                    if (data.command === 'banned') {
                      this.errMsg = true
                      this.errMsgCnt = data.content
                    } else {
                      this.$notify({
                        message: data.content,
                        offset: 100,
                        type: 'success',
                        duration: 1200,
                        customClass: 'top-right-msg',
                        showClose: false
                      })
                    }
                    return
                  case 3:
                    this.announcement = data.content
                    return
                  default:
                    this.messages.push(data)
                }

                let chatBox = document.getElementById('chatBox')
                let h = chatBox.clientHeight
                let sh = chatBox.scrollHeight
                let st = chatBox.scrollTop
                if (h + st >= sh) {
                  this.$nextTick(() => {
                    this.$refs.msgEnd && this.$refs.msgEnd.scrollIntoView()
                  })
                }
              }
            } else {
              if (data.error.indexOf('存款') !== -1) {
                this.errMsg = true
                this.errMsgCnt = data.error
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
      }, errorMsg => {
        this.$message({
          showClose: true,
          message: msgFormatter(errorMsg),
          type: 'error'
        })
      })
    },
    sendMsgImg (e) {
      let file = this.$refs.fileImgSend.files[0]
      if (file.size > 1024 * 1024) {
        this.errMsg = true
        this.errMsgCnt = '图片尺寸太大，请选择较小尺寸的图片。'
        return
      }
      let formData = new FormData()
      formData.append('receivers', RECEIVER)
      formData.append('image', file)
      sendImgToChat(formData).then((data) => {
      })
    },
    sendMsg () {
      if (!this.msgCnt) { return false }
      this.$socket.sendObj({
        'command': 'send',
        'receivers': [RECEIVER],
        'type': 0,
        'content': this.msgCnt
      })
      this.msgCnt = ''
    },
    submitNickName () {
      updateUser({nickname: this.nickname, id: this.user.id}).then((data) => {
        this.$store.commit('SET_USER', {
          user: data
        })
        this.showNickNameBox = false
      }, errorMsg => {
        this.$message({
          showClose: true,
          message: msgFormatter(errorMsg),
          type: 'error'
        })
      })
    },
    computeAvatar (item) {
      if (item.sender && ((item.sender.nickname && item.sender.nickname === this.user.nickname) || this.user.username === item.sender.username)) {
        return this.user.avatar
      } else if (item.sender && item.sender.avatar_url) {
        return item.sender.avatar_url
      } else {
        return require('../assets/avatar.png')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../style/vars.scss';
.chat-box {
  position: fixed;
  right: 0;
  top: 0;
  width: 380px;
  overflow-x: hidden;
  height: 100%;
  background-attachment: fixed;
  border-left: 3px solid #006bb3;
  border-bottom: 1px solid #006bb3;
  z-index: 1;
}
.title {
  line-height: 40px;
  position: relative;
  background-color: #006bb3;
  color: #fff;
  padding: 0 10px;
  .font-home {
    margin-top: 8px;
  }
  h3 {
    font-size: 16px;
    color: #fff;
  }
  .close {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 8px 10px 0 0;
  }
  .right {
    font-size: 14px;
    .icon-user {
      margin: 8px 10px;
    }
  }
}
.content {
  background: url('../assets/chatbg.jpg') no-repeat right bottom;
  padding: 4px;
}
.chat-announce {
  position: absolute;
  top: 43px;
  left: 5px;
  right: 5px;
  background: rgba(237,244,254,.91);
  border: 1px solid #c2cfe2;
  border-radius: 5px;
  padding-right: 10px;
  height: 29px;
  overflow: hidden;
  z-index: 999;
  .ttl {
    display: block;
    float: left;
    background: #e1edfd;
    color: red;
    padding: 6px 8px;
    padding-top: 0;
    padding-bottom: 0;
    line-height: 29px;
    .volume-up {
      padding-top: 5px;
      margin-right: 4px;
    }
  }
  .scroll {
    display: block;
    margin-left: 72px;
    padding-top: 5px;
  }
}
.controls {
  position: absolute;
  top: 78px;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 999;
  .list-ctrl {
    margin: 0 5px;
    display: inline-block;
    background: #fff;
    border: 1px solid #e2e2e2;
    padding: 1px 9px;
    padding-left: 7px;
    border-radius: 15px;
    color: #a5a5a5;
    height: 17px;
  }
}
.lay-scroll {
  padding-top: 36px;
}
.item {
  margin-top: 15px;
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
  &.bubble1 {
    width: 55%;
  }
  &.bubble4 {
    background: #ab47bc;
    background: linear-gradient(to right,#ab47bc,#5169DE);
    border-left-color: #5169de;
    border-right-color: #ab47bc;
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
.footer {
  background: #f5f5f5;
  padding: 0;
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
    display: inline-block;
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
    p {
      font-size: 18px;
      color: #fff;
      span {
        display: inline-block;
        padding: 4px 0;
      }
    }
  }

  .emoji-container {
    height: 400px;
    overflow-y: scroll;
    .emoji {
      padding: 2px 6px 0 4px; 
      display: inline-block;
      cursor: pointer;
      position: relative;
      font-size: 18px;
      text-align: center;
      border: 2px solid transparent;
    }
    .emoji:hover {
      border-color: #ff5a00;
    }
  }

</style>
