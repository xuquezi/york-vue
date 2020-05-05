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
      <el-table-column label="流程执行时间" prop="flowExecuteTime" width="200"/>
      <el-table-column
        align="center" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="queryProcess(scope.row)">流程查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="流程步骤详情" :visible.sync="flowDetailVisible" v-on:close="closeDialog">
      <el-timeline>
        <el-timeline-item :timestamp="processFlowDetail.timestamp" placement="top" v-for="(processFlowDetail, index) in taskList">
          <el-card>
            <h4>{{processFlowDetail.title}}</h4>
            <p>{{processFlowDetail.content}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>

      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog()">{{ '关闭' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import ElDragSelect from '@/components/DragSelect'
  import { queryCancelApplyListByPage,queryProcess } from '@/api/apply'
  export default {
    name: 'FinishApplyIndex',
    components: { Pagination, ElDragSelect },
    data() {
      return {
        taskList: [],
        flowDetailVisible: false,
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
      closeDialog() {
        this.taskList = []
        this.flowDetailVisible = false
      },
      queryProcess(row) {
        queryProcess(row.processDefinitionId,row.processInstanceId).then(response=> {
          this.taskList = response.list
          this.flowDetailVisible = true
        })
      },
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
