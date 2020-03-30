<template>
  <div class="app-container">
    <el-table
      :data="list"
      style="width: 100%"
      element-loading-text="拼命加载中"
      v-loading="listLoading">
      <el-table-column label="Id" prop="processTaskId"/>
      <el-table-column label="Name" prop="processTaskName"/>
      <el-table-column label="CreateTime" prop="processTaskCreateTime"/>
      <el-table-column label="InstanceId" prop="processTaskInstanceId"/>
      <el-table-column label="Assignee" prop="processTaskAssignee"/>
      <el-table-column label="AssigneeName" prop="processTaskAssigneeName"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import ElDragSelect from '@/components/DragSelect'
  import { fetchApplyingList } from '@/api/apply'
  export default {
    name: 'ApplyingIndex',
    components: { Pagination, ElDragSelect },
    data() {
      return {
        listLoading: true,
        total: 0,
        list: null,
        listQuery: {
          page: 1,
          limit: 10
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchApplyingList(this.listQuery).then(response => {
          this.list = response.pageInfo.rows
          this.total = response.pageInfo.total
          this.listLoading = false
        })
      }
    }
  }
</script>

<style scoped>

</style>
