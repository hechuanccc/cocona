<template>
  <div>
    <el-table
      stripe
      :data="announcements"
      style="width: 100%"
      class="announcement">
      <el-table-column
        type="index"
        label="#"
        >
      </el-table-column>
      <el-table-column
        :label= "$t('announcement.content')"
        prop="announcement"
        >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAnnouncements } from '../../api'
export default{
  data () {
    return {
      announcements: []
    }
  },
  name: 'Announcements',
  created () {
    getAnnouncements().then(result => {
      result.forEach((item) => {
        if (item.platform !== 0) {
          this.announcements.push(item)
        }
      })
      this.announcements.sort((a, b) => {
        return a.rank - b.rank
      })
    })
  }
}
</script>
