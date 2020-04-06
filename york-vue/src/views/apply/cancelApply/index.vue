<template>
  <div class="app-container">
    <el-table
      :data="list"
      style="width: 100%"
      element-loading-text="拼命加载中"
      v-loading="listLoading">
      <el-table-column label="流程定义Id" prop="processDefinitionId" fixed width="200"/>
      <el-table-column label="流程实例Id" prop="processInstanceId" width="200"/>
      <el-table-column label="上阶段流程节点" prop="flowLastPhase" width="200"/>
      <el-table-column label="当前流程节点" prop="flowPhase" width="200"/>
      <el-table-column label="申请用户" prop="flowApplyUsername" width="200"/>
      <el-table-column label="上阶段处理用户" prop="flowUserName" width="200"/>
      <el-table-column label="正在处理用户" prop="nextUsername" width="200"/>
      <el-table-column label="备注" prop="flowRemark" width="200"/>
      <el-table-column label="流程类型" prop="flowType" width="200"/>
      <el-table-column label="流程执行时间" prop="flowExecuteTime" fixed="right" width="200"/>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import ElDragSelect from '@/components/DragSelect'
  import { queryCancelApplyListByPage } from '@/api/apply'
  export default {
    name: 'CancelApplyIndex',
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
        queryCancelApplyListByPage(this.listQuery).then(response => {
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
