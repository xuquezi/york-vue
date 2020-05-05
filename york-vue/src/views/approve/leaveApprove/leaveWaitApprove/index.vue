<template>
  <div class="app-container">
    <el-table
      :data="list"
      style="width: 100%"
      element-loading-text="拼命加载中"
      v-loading="listLoading">
      <el-table-column label="任务Id" prop="taskId" width="150" fixed/>
      <el-table-column label="任务名称" prop="taskName" width="200"/>
      <el-table-column label="任务创建时间" prop="taskCreateTime" width="200"/>
      <el-table-column label="流程定义Id" prop="taskDefinitionId" width="200"/>
      <el-table-column label="流程实例Id" prop="taskInstanceId" width="200"/>
      <el-table-column label="当前处理人id" prop="taskAssignee" width="200"/>
      <el-table-column label="当前处理人名称" prop="taskAssigneeName" width="200"/>
      <el-table-column
        align="center" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleApprove(scope.row)">审批</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-on:close="cancelApprove">
      <el-form ref="dataForm" :model="applyData" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'申请用户Id'" prop="leaveApplyUserId" >
          <el-input v-model="applyData.leaveApplyUserId" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="'申请用户'" prop="leaveApplyUsername" >
          <el-input v-model="applyData.leaveApplyUsername" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="'申请时间'" prop="leaveApplyTime" >
          <el-input v-model="applyData.leaveApplyTime" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="'申请描述'" prop="leaveApplyRemark" >
          <el-input v-model="applyData.leaveApplyRemark" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="'请假天数'" prop="leaveApplyDays" >
          <el-input v-model="applyData.leaveApplyDays" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="'用户部门'" prop="leaveApplyDepartmentName" >
          <el-input v-model="applyData.leaveApplyDepartmentName" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="'审批意见'" prop="approveOpinion" >
          <el-input v-model="approveData.approveRemark" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelApprove()">{{ '取消' }}</el-button>
        <el-button type="primary" @click="agreeLeaveApply()">{{ '同意' }}</el-button>
        <el-button type="warning" @click="backLeaveApply()">{{ '退回' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import ElDragSelect from '@/components/DragSelect'
  import { getLeaveApplyData } from '@/api/apply'
  import { queryLeaveWaitApproveListByPage,agreeLeaveApply,backLeaveApply } from '@/api/approve'
  export default {
    name: 'WaitApproveIndex',
    components: { Pagination, ElDragSelect },
    data() {
      return {
        listLoading: true,
        total: 0,
        list: null,
        dialogFormVisible: false,
        dialogStatus: '',
        approveData: {
          approveOpinion: '',
          approveRemark: '',
          processTaskId: '',
          applyUserId: '',
          applyUsername: ''
        },
        applyData: {
          leaveApplyUserId: '',
          leaveApplyUsername: '',
          leaveApplyTime: '',
          leaveApplyRemark: '',
          leaveApplyDays: '',
          leaveApplyId: '',
          leaveApplyDepartmentName: '',
          processTaskId: ''
        },
        textMap: {
          update: 'Edit',
          create: 'Create',
          approve: 'Approve'
        },
        listQuery: {
          page: 1,
          limit: 10,
          // 这个是固定值，根据流程定义写死
          processType: 'LeaveProcess'
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        queryLeaveWaitApproveListByPage(this.listQuery).then(response => {
          this.list = response.pageInfo.rows
          this.total = response.pageInfo.total
          this.listLoading = false
        })
      },
      cancelApprove(){
        this.approveData.approveOpinion = ''
        this.approveData.processTaskId = ''
        this.approveData.applyUserId = ''
        this.approveData.applyUsername = ''
        this.dialogFormVisible = false
      },
      agreeLeaveApply() {
        this.approveData.approveOpinion = 'Yes'
        this.approveData.applyUserId = this.applyData.leaveApplyUserId
        this.approveData.applyUsername = this.applyData.leaveApplyUsername
        agreeLeaveApply(this.approveData).then(() => {
          this.dialogFormVisible = false
          this.handleFilter()
          this.$notify({
            title: '成功',
            message: '审批完成',
            type: 'success',
            duration: 2000
          })
        })
      },
      backLeaveApply(approveOpinion) {
        this.approveData.approveOpinion = 'No'
        this.approveData.applyUserId = this.applyData.leaveApplyUserId
        this.approveData.applyUsername = this.applyData.leaveApplyUsername
        backLeaveApply(this.approveData).then(() => {
          this.dialogFormVisible = false
          this.handleFilter()
          this.$notify({
            title: '成功',
            message: '退回成功',
            type: 'success',
            duration: 2000
          })
        })

      },
      handleApprove(row) {
        this.dialogStatus = 'approve'
        this.dialogFormVisible = true
        getLeaveApplyData(row.taskInstanceId,row.taskDefinitionId).then(response => {
          this.applyData.leaveApplyUserId = response.leaveApply.leaveApplyUserId
          this.applyData.leaveApplyUsername = response.leaveApply.leaveApplyUsername
          this.applyData.leaveApplyTime = response.leaveApply.leaveApplyTime
          this.applyData.leaveApplyRemark = response.leaveApply.leaveApplyRemark
          this.applyData.leaveApplyDays = response.leaveApply.leaveApplyDays
          this.applyData.leaveApplyId = response.leaveApply.leaveApplyId
          this.applyData.leaveApplyDepartmentName = response.leaveApply.leaveApplyDepartmentName
          this.applyData.processTaskId = response.leaveApply.taskId
          // leaveApply里面存的processTaskId是申请时候的，审批时候的已经更新了
          this.approveData.processTaskId = row.taskId
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      }
    }
  }
</script>

<style scoped>

</style>
