<template>
<div>
  <el-row class="m-b">
    <el-form :inline="true" :model="conditions">
      <el-form-item :label="$t('user.send_date')" prop="startDate" :error="startDateValidate">
        <el-date-picker
          v-model="startDate"
          type="date"
          :placeholder="$t('user.choose_date')"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item>~</el-form-item>
      <el-form-item prop="endDate" :error="endDateValidate">
        <el-date-picker
          v-model="endDate"
          type="date"
          :placeholder="$t('user.choose_date')"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-checkbox v-model="unReadOnly">{{$t('user.unread_email')}}</el-checkbox>
      </el-form-item>
    </el-form>
  </el-row>
  <el-table v-loading="loading" :data="messages" stripe :row-class-name="rowClassName" @row-click="readMsg">
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
  <el-pagination v-if="totalCount>pageSize"
    :current-page.sync="currentPage"
    :page-size="pageSize"
    layout="total, prev, pager, next"
    :total="totalCount"
    @current-change="handlePageChange">
  </el-pagination>
</div>
</template>
<script>
import { fetchMessages, readMessage, fetchMessageCount } from '../../api'
export default {
  name: 'Message',
  data () {
    return {
      activeIndex: '',
      messages: [],
      currentPage: 1,
      pageSize: 10,
      totalCount: 0,
      loading: false,
      startDate: '',
      endDate: '',
      unReadOnly: false,
      startDateValidate: '',
      endDateValidate: ''

    }
  },
  created () {
    this.initFetchMessage()
    fetchMessageCount().then(res => {
      this.$store.dispatch('setMessageCount', res.message_count)
    })
  },
  computed: {
    conditions () {
      return {
        status: this.unReadOnly ? 0 : '',
        sent_at_0: this.startDate,
        sent_at_1: this.endDate
      }
    }
  },
  watch: {
    'conditions': function (conditions) {
      let startDate = this.$moment(conditions.sent_at_0)
      let endDate = this.$moment(conditions.sent_at_1)
      if (startDate && endDate && startDate.diff(endDate) > 0) {
        this.startDateValidate = this.$t('validate.date_range_validate')
        this.endDateValidate = ' '
      } else {
        this.startDateValidate = ''
        this.endDateValidate = ''
        this.initFetchMessage(conditions)
      }
    }
  },
  beforeRouteEnter: (to, from, next) => {
    next((vm) => {
      vm.$store.dispatch('fetchUser')
    })
  },
  methods: {
    readMsg (row) {
      if (!row.status) {
        readMessage([row.id])
        this.messages[row.index].status = 1
        this.$store.dispatch('setMessageCount', this.$store.state.messageCount - 1)
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
    },
    initFetchMessage (option) {
      fetchMessages({ ...option, offset: 0 }).then(data => {
        this.messages = data.results
        this.totalCount = data.count
      })
    },
    handlePageChange (currentPage) {
      this.loading = true
      fetchMessages({ ...this.conditions, offset: (currentPage - 1) * this.pageSize }).then(data => {
        this.messages = data.results
        this.loading = false
      }, () => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.read {
  color: #999;
}
.unread {
  color: #666;
}
</style>



