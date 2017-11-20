<template>
<div>
  <ul>
    <li class="msg" v-for="(msg,index) in displayMsg" :key="index" :title="msg.title" :name="index" @click="readMsg(index)">
      <div class="title">
        <el-row :class="msg.status?'read':'unread'">
          <el-col class="name" :span="5">{{msg.sender_displayname}}</el-col>
          <el-col :span="16">{{msg.title}}</el-col>
          <el-col :span="3">{{msg.sent_at | moment("YYYY-MM-DD HH:mm")}}</el-col>
        </el-row>
      </div>
        <el-collapse-transition>
          <div v-show="msg.active">
            <div class="content">{{msg.content}}</div>
          </div>
        </el-collapse-transition>
    </li>
  </ul>
  <el-pagination
    :current-page.sync="currentPage"
    :page-size="pageSize"
    layout="total, prev, pager, next"
    :total="messages.length">
  </el-pagination>
</div>
</template>
<script>
import { fetchMessages, readMessage } from '../../api'
export default {
  name: 'Message',
  data () {
    return {
      activeIndex: '',
      messages: [],
      currentPage: 1,
      pageSize: 10,
      loading: false
    }
  },
  computed: {
    displayMsg () {
      let groupIdx = (this.currentPage - 1) * this.pageSize
      return this.messages.slice(groupIdx, groupIdx + this.pageSize)
    }
  },
  created () {
    fetchMessages().then(messages => {
      this.messages = messages
    })
  },
  methods: {
    readMsg (activeIndex) {
      let msg = this.messages[activeIndex]
      this.$set(msg, 'active', !msg.active)
      if (!msg.status) {
        readMessage([msg.id])
        msg.status = 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.read {
  background-color: #acd6ff;
}
.unread {
  background-color: #ecf5ff;
}
.msg {
  border-bottom: 1px #e5e5e5 solid;
  cursor: pointer;
  .title {
    height: 35px;
    line-height: 35px;
    font-size: 16px;
    .name {
      padding-left: 10px;
    }
  }
  .content {
    padding: 20px 50px;
    font-size: 12px;
    line-height: 25px;
  }
}
</style>


