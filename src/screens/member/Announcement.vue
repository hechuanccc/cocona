<template>
  <div>
    <el-table
      :data="announcements"
      style="width: 100%"
      class="announcement">
      <el-table-column
        prop="name"
        :label= "$t('announcement.title')"
        width="180">
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
      this.announcements = result
    })
  }
}
</script>
