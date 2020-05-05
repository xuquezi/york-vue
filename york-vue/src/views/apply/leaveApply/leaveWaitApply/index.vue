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
        align="center" fixed="right" width="300">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="handleApply(scope.row)">申请</el-button>
          <el-button
            size="mini"
            type="default"
            @click="queryProcess(scope.row)">流程查看</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="cancelProcess(scope.row)">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;" :rules="rules">
        <el-form-item :label="'申请用户Id'" prop="leaveApplyUserId" >
          <el-input v-model="userId" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="'申请用户名称'" prop="leaveApplyUsername" >
          <el-input v-model="name" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="'申请用户部门'" prop="leaveApplyDepartmentName" >
          <el-input v-model="departmentName" :disabled="true"/>
        </el-form-item>
        <el-form-item :label="'申请描述'" prop="leaveApplyRemark" >
          <el-input v-model="temp.leaveApplyRemark" type="textarea"/>
        </el-form-item>
        <el-form-item :label="'申请天数'" prop="leaveApplyDays" >
          <el-input v-model="temp.leaveApplyDays" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ '取消' }}</el-button>
        <el-button type="primary" @click="applyLeaveProcess()">{{ '确定' }}</el-button>
      </div>
    </el-dialog>

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
  import { mapGetters } from 'vuex'
  import ElDragSelect from '@/components/DragSelect'
  import { getLeaveWaitApplyList,applyLeaveProcess,cancelProcess,queryProcess } from '@/api/apply'
  export default {
    name: 'WaitApplyIndex',
    components: { Pagination, ElDragSelect },
    computed: {
      ...mapGetters([
        'name',
        'departmentName',
        'departmentSerial',
        'userId'
      ])
    },
    data() {
      return {
        taskList: [],
        flowDetailVisible: false,
        listLoading: true,
        total: 0,
        list: null,
        textMap: {
          apply: '申请'
        },
        rules: {
          leaveApplyRemark: [
            { required: true,message: '请输入申请描述！', trigger: 'blur' }
          ],
          leaveApplyDays: [
            { required: true,message: '请输入申请天数！', trigger: 'blur' }
          ]
        },
        temp: {
          leaveApplyUsername: '',
          leaveApplyDepartmentName: '',
          leaveApplyDepartmentId: '',
          leaveApplyRemark: '',
          leaveApplyDays: '',
          taskInstanceId: '',
          taskId: '',
          taskDefinitionId: ''

        },
        dialogFormVisible: false,
        dialogStatus: '',
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
      closeDialog() {
        this.taskList = []
        this.flowDetailVisible = false

      },
      queryProcess(row) {
        queryProcess(row.taskDefinitionId,row.taskInstanceId).then(response=> {
          this.taskList = response.list
          this.flowDetailVisible = true
        })
      },
      getList() {
        this.listLoading = true
        getLeaveWaitApplyList(this.listQuery).then(response => {
          this.list = response.pageInfo.rows
          this.total = response.pageInfo.total
          this.listLoading = false
        })
      },
      resetTemp() {
        this.temp = {
          leaveApplyUsername: '',
          leaveApplyDepartmentName: '',
          leaveApplyDepartmentId: '',
          leaveApplyRemark: '',
          leaveApplyDays: '',
          taskInstanceId: '',
          taskId: '',
          taskDefinitionId: ''
        }
      },
      applyLeaveProcess() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            applyLeaveProcess(this.temp).then(() => {
              this.dialogFormVisible = false
              this.handleFilter()
              this.$notify({
                title: '成功',
                message: '申请成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      cancelProcess(val){
        this.$confirm('确定取消申请该流程吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cancelProcess(val.taskId).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '取消成功',
              type: 'success',
              duration: 2000
            })
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },
      handleApply(row) {
        // 每次编辑前清空temp
        this.resetTemp()
        this.dialogStatus = 'apply'
        this.dialogFormVisible = true
        this.temp.leaveApplyUsername = this.name // mapGetters里面的值
        this.temp.leaveApplyDepartmentName = this.departmentName // mapGetters里面的值
        this.temp.leaveApplyDepartmentId = this.departmentSerial // mapGetters里面的值
        this.temp.leaveApplyUserId = this.userId // mapGetters里面的值
        this.temp.taskId = row.taskId
        this.temp.taskInstanceId = row.taskInstanceId
        this.temp.taskDefinitionId = row.taskDefinitionId
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
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
