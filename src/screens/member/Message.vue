<template>
<div>
  <el-table v-loading="loading" :data="displayMsg" stripe :row-class-name="rowClassName" @row-click="readMsg">
    <el-table-column
      :label="$t('user.sender')"
      prop="sender_displayname">
    </el-table-column>
    <el-table-column
      :label="$t('user.title')"
      prop="title">
    </el-table-column>
    <el-table-column :label="$t('user.send_date')">
      <template slot-scope="scope">
        <span>{{scope.row.sent_at | moment("YYYY-MM-DD HH:mm:ss")}}</span>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination v-if="messages.length>pageSize"
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
    readMsg (row) {
      if (!row.status) {
        readMessage([row.id])
        this.messages[row.index].status = 1
      }
      this.$alert(row.content, row.title, {
        showConfirmButton: false,
        showCancelButton: true,
        closeOnClickModal: true
      }).catch(() => { })
    },
    rowClassName (row) {
      row.row.index = row.rowIndex
      return row.row.status ? 'read' : 'unread'
    }
  }
}
</script>
<style lang="scss" scoped>
.read {
  color: #999
}
.unread {
  color: #666
}
</style>



