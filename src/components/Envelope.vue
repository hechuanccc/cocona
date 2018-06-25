<template>
  <div class="red-envelope">
    <div>
      <div class="flick text-center">
        <div class="icon">
          <img v-if="(success || repeat || fail) && currentEnvelope.sender.avatar" class="img" :src="currentEnvelope.sender.avatar" alt="avatar">
        </div>
        <span class="close" @click="$emit('closeDialog')">&times;</span>
      </div>
      <div class="header text-center">
        <div class="title" v-if="(taking || success || repeat || fail || expired) && currentEnvelope">
          {{ showingName }} 的红包
        </div>
        <div class="postscript" v-if="success || repeat || fail || expired">
          {{content ? `"${content}"` : '"恭喜发财，大吉大利"'}}
        </div>
        <div class="slogan " v-if="sending">拼手气红包</div>
        <div class="balance" v-if="sending">
          我的余额 <span>¥{{user.balance}}</span>
        </div>
        <div class="loading" v-if="taking">
          <div class="money-circle loader text-center">
          </div>
          <img class="money" src="../assets/money.png" alt="">
        </div>
        <div class="result lose" v-if="fail">手慢了...红包派完了...</div>
        <div class="result lose" v-if="expired">红包已过期</div>
        <div class="result win" v-if="success || repeat">
          <img class="money" src="../assets/money.png" alt="money">
          <span class="text" v-if="currentEnvelope">￥{{showingAmount}}</span>
        </div>
        <div class="congra" v-if="success || repeat">恭喜你抢到红包啦!</div>
      </div>
    </div>

    <div class="form" v-if="sending">
      <el-form :model="send" label-width="70px">
        <el-form-item label="金额" prop="amount">
          <el-input type="number"
            @blur.native="validate($event, 'pack_amount')"
            @input="validate($event, 'pack_amount')"
            @keypress.native="filtAmount"
            v-model.number="send.pack_amount"></el-input>
          <span class="hint">最高金额 ￥{{systemConfig.envelopeSettings.max_amount}},</span>
          <span class="hint">最低金额 ￥{{systemConfig.envelopeSettings.min_amount}}</span>
        </el-form-item>
        <el-form-item label="个数" prop="count">
          <el-input type="number"
            @blur.native="validate($event, 'pack_nums')"
            @input="validate($event, 'pack_nums')"
            @keypress.native="filtAmount"
            v-model.number="send.pack_nums"></el-input>
          <span class="hint">最多个数 {{systemConfig.envelopeSettings.per_max_count}} 个</span>
        </el-form-item>
        <el-form-item label="附言">
          <el-input type="textarea" :maxlength="20" placeholder="恭喜发财，大吉大利" v-model="send.content"></el-input>
        </el-form-item>
        <el-form-item>
          <div v-if="error" class="error">{{error}}</div>
          <el-button class="submit"
            native-type="button"
            type="warning"
            @click.native="sendEnvelope"
            :disabled="loading">
            <div v-if="loading" class="loader small"></div>
            <span v-else>确认发出</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="data-container p-b full-height" v-if="(success || repeat || fail)">
      <div class="data">
        <p class="title text-center" v-if="currentEnvelope.envelope_status.users.length !== currentEnvelope.envelope_status.total">
          {{currentEnvelope.envelope_status.users.length}}/{{currentEnvelope.envelope_status.total}} 人已領取
        </p>
        <p class="title text-center" v-else>
          {{currentEnvelope.envelope_status.users.length}}/{{currentEnvelope.envelope_status.total}} 已領完
        </p>
        <table class="table">
          <tr :class="['tr', {self: member.receiver_id === user.id}]" v-for="(member, index) in showingList" :key="index">
            <td class="td">{{member.nickname || member.username}}</td>
            <td class="td profit">¥ {{member.amount}}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { sendEnvelope } from '../api'
import { mapState } from 'vuex'
import { filtAmount, msgFormatter } from '../utils'
const validateItems = ['pack_amount', 'pack_nums']

export default {
  props: {
    status: {
      type: String
    },
    envelope: {
      type: Object
    },
    joinChatRoom: {
      type: Function
    },
    content: {
      type: String
    },
    roomId: {
      type: Number
    }
  },
  data () {
    return {
      send: {
        sender_id: '',
        pack_amount: '',
        pack_nums: '',
        content: ''
      },
      loading: false,
      error: '',
      validators: {
        'pack_amount': {
          error: '',
          validate: (value) => {
            let number = parseInt(value)
            if (!number) {
              return '请输入金额'
            } else if (number < this.systemConfig.envelopeSettings.min_amount) {
              return '须高于最低金额限制'
            } else if (number > this.systemConfig.envelopeSettings.max_amount) {
              return '不能超过最高金额限制'
            } else {
              return ''
            }
          }
        },
        'pack_nums': {
          error: '',
          validate: (value) => {
            let number = parseInt(value)
            if (!number) {
              return '请输入个数'
            } else if (number > this.systemConfig.envelopeSettings.per_max_count) {
              return '红包数量超出限制'
            } else {
              return ''
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapState([
      'user',
      'systemConfig',
      'envelopes'
    ]),
    success () {
      return this.status === 'success'
    },
    fail () {
      return this.status === 'fail'
    },
    repeat () {
      return this.status === 'repeat'
    },
    taking () {
      return this.status === 'taking'
    },
    sending () {
      return this.status === 'sending'
    },
    expired () {
      return this.status === 'expired'
    },
    currentEnvelope () {
      return this.envelopes[this.envelope.envelope_id]
    },
    showingList () {
      return this.fail ? Object.values(this.envelope.receive_users) : this.currentEnvelope.envelope_status.users
    },
    showingName () {
      return this.currentEnvelope.sender && this.currentEnvelope.sender.nickname ? this.currentEnvelope.sender.nickname : this.currentEnvelope.sender.username
    },
    showingAmount () {
      let mine = this.currentEnvelope.envelope_status.users.find((user) => user.username === this.user.username)
      return this.envelope.amount || mine.amount
    }
  },
  methods: {
    filtAmount,
    sendEnvelope () {
      const errors = this.validateAll()
      if (errors.length === 0) {
        this.send = {
          pack_amount: parseInt(this.send.pack_amount),
          pack_nums: parseInt(this.send.pack_nums),
          content: this.send.content ? this.send.content : '恭喜发财，大吉大利',
          room: this.roomId
        }
        this.loading = true
        sendEnvelope(this.send).then(res => {
          this.initEnvelope()

          this.loading = false
          this.error = ''
          this.$emit('handleSend', res)
        }, errMsg => {
          this.loading = false
          this.$message({
            message: msgFormatter(errMsg),
            type: 'warning'
          })
        })
      } else {
        this.error = errors[0]
      }
    },
    initEnvelope () {
      this.loading = false
      this.error = ''
      this.send = {
        sender_id: '',
        pack_amount: '',
        pack_nums: '',
        content: ''
      }
    },
    validate (value, input) {
      this.error = this.validators[input].validate(value)
    },
    validateAll () {
      return validateItems
        .map(item => this.validators[item].validate(this.send[item]))
        .filter(msg => msg)
    }
  },
  beforeDestroy () {
    this.initEnvelope()
  },
  created () {
    this.$store.dispatch('fetchUser')
  }
}
</script>

<style lang="scss" scoped>
$header_red: #c0493c;
$main_red: #de5547;
$gold-text: #debd85;

.red-envelope {
  position: relative;
  background-color: $main_red;
  min-height: 300px;
}

.flick {
  height: 55px;
  border-radius: 0px 0px 50% 50%;
  background-color: $header_red;
  box-shadow: 0 1px 4px 0 rgba(68, 2, 2, 0.5);
  .icon {
    position: absolute;
    width: 60px;
    height: 60px;
    top: 25px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    background-image: url('../assets/image_money.png');
    background-size: contain;
    .img {
      width: 95%;
      height: 95%;
      border-radius: 50%;
    }
  }
  .close {
    cursor: pointer;
    color: #dedede;
    position: absolute;
    font-weight: 200;
    right: 10px;
    top: 5px;
    font-size: 30px;
  }
}

.header {
  font-size: 14px;
  margin-top: 35px;
  .title {
    font-weight: 600;
    color: $gold-text;
  }

  .slogan, .postscript {
    color: #fff;
    margin-top: 5px;
    word-break: break-all;
  }

  .slogan {
    font-size: 16px;
  }

  .balance {
    color: #fff;
    margin-bottom: 30px;
  }

  .loading {
    position: relative;
    display: inline-block;
    padding-top: 30px;
    padding-bottom: 25px;

    .money-circle {
      display: inline-block;
      box-sizing: border-box;
      width: 95px;
      height: 95px;
    }

    .money {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translateX(-50%) translateY(-50%);
      padding: 10px;
      width: 36px;
      height: 36px;
    }
  }
  .result {
    padding-top: 15px;
    padding-bottom: 10px;
    font-weight: 600;
    color: #fff;
    &.lose {
      font-size: 20px;
    }
    &.win {
      font-size: 36px;
      .money, .text {
        vertical-align: middle;
      }
      .money {
        width: 36px;
        height: 36px;
      }
    }
  }
}

.data-container{
  background-color: #fff;
  overflow-y: auto;
  .data {
  width: 260px;
  max-height: 260px;
  min-height: 150px;
  margin: 0 auto;
    .title {
      font-size: 12px;
      margin-top: 5px;
      color: $main_red;
    }
    .table {
      width: 100%;
      .tr.self {
        color: #de5547;
      }
      .profit {
        text-align: right;
      }
    }
  }
}

.form {
  width: 305px;
  margin: 0 auto;
  margin-right: 70px;
  .submit {
    width: 100%;
    margin-bottom: 20px;
  }
  .hint {
    color: #fff;
  }
  /deep/ .el-form-item__label {
    color: #fff;
  }
  /deep/ .el-input__inner, /deep/ .el-textarea__inner {
    background: transparent;
    color: #fff;
    &:focus {
      border-color: #fff;
    }
  }
}

.error{
  color: #ddd;
}

.loader {
  font-size: 10px;
  margin: 50px auto;
  text-indent: -9999em;
  width: 11em;
  height: 11em;
  border-radius: 50%;
  background: #f8e71c;
  background: linear-gradient(to right, #f8e71c 10%, rgba(255, 255, 255, 0) 42%);
  position: relative;
  animation: load3 1.4s infinite linear;
  transform: translateZ(0);
  &.small {
    width: 12px;
    height: 12px;
    margin: 0 auto;
    background: #fff;
    background: linear-gradient(to right, #fff 10%, rgba(255, 255, 255, 0) 42%);
    &:after {
      width: 50%;
      height: 50%;
      background: #e6a23c;
    }
    &:before {
      background: #fff;
    }
  }
}

.loader:before {
  width: 50%;
  height: 50%;
  background: #f8e71c;
  border-radius: 100% 0 0 0;
  position: absolute;
  top: 0;
  left: 0;
  content: '';
}

.loader:after {
  content: '';
  background: $main_red;
  width: 90%;
  height: 90%;
  border-radius: 50%;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

@keyframes load3 {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.congra {
  color: #fff;
  padding-bottom: 10px;
  font-size: 14px;
}

</style>
