<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder= "流程定义名搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ 'search' }}</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      element-loading-text="拼命加载中"
      v-loading="listLoading">
      <el-table-column label="Name" prop="processDefName"/>
      <el-table-column label="Key" prop="processDefKey" width="100"/>
      <el-table-column label="Version" prop="processDefVersion" width="100"/>
      <el-table-column label="DeploymentId" prop="processDefDeploymentId" width="100"/>
      <el-table-column label="ResourceName" prop="processDefResourceName"/>
      <el-table-column label="DeploymentTime" prop="processDeployment.processDeploymentTime"/>
      <el-table-column label="DeploymentName" prop="processDeployment.processDeploymentName" width="100"/>
      <el-table-column
        align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="deleteProcessDef(scope.row)">Del</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="cascadeDeleteProcessDef(scope.row)">Cas</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="deploy(scope.row)">Dep</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import ElDragSelect from '@/components/DragSelect'
  import { getProcessDefList,deleteProcessDef,deploy,cascadeDeleteProcessDef } from '@/api/activity'
  export default {
    name: 'ProcessDefIndex',
    components: { Pagination, ElDragSelect },
    data() {
      return {
        listLoading: true,
        total: 0,
        list: null,
        listQuery: {
          page: 1,
          limit: 10,
          search: ''
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        getProcessDefList(this.listQuery).then(response => {
          this.list = response.pageInfo.rows
          this.total = response.pageInfo.total
          this.listLoading = false
          // console.log(this.list)
        })
      },
      deleteProcessDef(val) {
        this.$confirm('确定删除该流程定义吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(val.processDefDeploymentId)
          deleteProcessDef(val.processDefDeploymentId).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      cascadeDeleteProcessDef(val) {
        this.$confirm('确定删除该流程定义和该流程定义下已经启动的流程吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(val.processDefDeploymentId)
          cascadeDeleteProcessDef(val.processDefDeploymentId).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      deploy(val) {
        this.$confirm('确定重新部署该流程定义吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(val.processDefResourceName)
          deploy(val.processDefResourceName,val.processDeployment.processDeploymentName).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '部署成功',
              type: 'success',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消部署'
          });
        });
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
