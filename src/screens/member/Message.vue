<template>
<div>
  <ul class="text-center">
    <li class="header">
      <el-row>
        <el-col :span="5">{{$t('user.sender')}}</el-col>
        <el-col :span="16">{{$t('user.title')}}</el-col>
        <el-col :span="3">{{$t('user.send_date')}}</el-col>
      </el-row>
    </li>
    <li class="msg" v-for="(msg,index) in displayMsg" :key="index" :title="msg.title" :name="index" @click="readMsg(index)">
      <el-row :class="['title',msg.status?'read':'unread']">
        <el-col :span="5">{{msg.sender_displayname}}</el-col>
        <el-col :span="16">{{msg.title}}</el-col>
        <el-col :span="3">{{msg.sent_at | moment("YYYY-MM-DD HH:mm")}}</el-col>
      </el-row>
      <el-collapse-transition>
        <div v-show="msg.active">
          <el-row>
            <el-col :offset="5" :span="16" class="content">
              {{msg.content}}
            </el-col>
          </el-row>
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
  background-color: #f1f1f1;
}
.unread {
  background-color: #fff;
}
.sender {
  padding-left: 10px;
}
.header {
  height: 35px;
  line-height: 35px;
  margin-bottom: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.msg {
  margin-bottom: 12px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  cursor: pointer;
  .title {
    height: 35px;
    line-height: 35px;
    border-top: 1px solid #e6ebf5;
  }
  .content {
    padding: 20px 50px;
  }
}
</style>


