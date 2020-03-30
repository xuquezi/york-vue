<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder= "流程名搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ 'search' }}</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      element-loading-text="拼命加载中"
      v-loading="listLoading">
      <el-table-column label="Id" prop="processTaskId"/>
      <el-table-column label="Name" prop="processTaskName"/>
      <el-table-column label="CreateTime" prop="processTaskCreateTime"/>
      <el-table-column label="DefinitionId" prop="processTaskDefinitionId"/>
      <el-table-column label="InstanceId" prop="processTaskInstanceId"/>
      <el-table-column label="Assignee" prop="processTaskAssignee"/>
      <el-table-column label="AssigneeName" prop="processTaskAssigneeName"/>
      <el-table-column
        align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleApprove(scope.row)">Approve</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-on:close="cancelApprove">
      <el-form ref="dataForm" :model="applyData" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'ApplyUser'" prop="leaveApplyUserId" >
          <el-input v-model="applyData.leaveApplyUserId" :disabled="true"/><!--绑定的是用户的name来自getter-->
        </el-form-item>
        <el-form-item :label="'ApplyName'" prop="leaveApplyUsername" >
          <el-input v-model="applyData.leaveApplyUsername" :disabled="true"/><!--绑定的是用户的name来自getter-->
        </el-form-item>
        <el-form-item :label="'ApplyTime'" prop="leaveApplyTime" >
          <el-input v-model="applyData.leaveApplyTime" :disabled="true"/><!--绑定的是用户的name来自getter-->
        </el-form-item>
        <el-form-item :label="'ApplyRemark'" prop="leaveApplyRemark" >
          <el-input v-model="applyData.leaveApplyRemark" :disabled="true"/><!--绑定的是用户的name来自getter-->
        </el-form-item>
        <el-form-item :label="'ApplyDays'" prop="leaveApplyDays" >
          <el-input v-model="applyData.leaveApplyDays" :disabled="true"/><!--绑定的是用户的name来自getter-->
        </el-form-item>
        <el-form-item :label="'ApplyDepart'" prop="leaveApplyDepartmentName" >
          <el-input v-model="applyData.leaveApplyDepartmentName" :disabled="true"/><!--绑定的是用户的name来自getter-->
        </el-form-item>
        <el-form-item :label="'Opinion'" prop="approveOpinion" >
          <el-input v-model="approveData.approveRemark" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelApprove()">{{ 'cancel' }}</el-button>
        <el-button type="primary" @click="agreeLeaveApply()">{{ 'agree' }}</el-button>
        <el-button type="warning" @click="backLeaveApply()">{{ 'back' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import ElDragSelect from '@/components/DragSelect'
  import { getLeaveWaitApproveList,getLeaveApplyData,agreeLeaveApply,backLeaveApply } from '@/api/apply'
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
          search: '',
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
        getLeaveWaitApproveList(this.listQuery).then(response => {
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
        getLeaveApplyData(row.processTaskInstanceId,row.processTaskDefinitionId).then(response => {
          this.applyData.leaveApplyUserId = response.leaveApply.leaveApplyUserId
          this.applyData.leaveApplyUsername = response.leaveApply.leaveApplyUsername
          this.applyData.leaveApplyTime = response.leaveApply.leaveApplyTime
          this.applyData.leaveApplyRemark = response.leaveApply.leaveApplyRemark
          this.applyData.leaveApplyDays = response.leaveApply.leaveApplyDays
          this.applyData.leaveApplyId = response.leaveApply.leaveApplyId
          this.applyData.leaveApplyDepartmentName = response.leaveApply.leaveApplyDepartmentName
          this.applyData.processTaskId = response.leaveApply.processTaskId
          // leaveApply里面存的processTaskId是申请时候的，审批时候的已经更新了
          this.approveData.processTaskId = row.processTaskId
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
