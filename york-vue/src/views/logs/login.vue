<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder= "登录名搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ 'search' }}</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteSelected">{{ 'delete' }}</el-button>
    </div>
    <el-table
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      :data="list"
      style="width: 100%"
      element-loading-text="拼命加载中"
      v-loading="listLoading">
      <el-table-column type="selection" align="center"/>
      <el-table-column label="Name" prop="loginUsername"/>
      <el-table-column label="Ip" prop="loginIp"/>
      <el-table-column label="LoginTime" prop="loginTime"/>
      <el-table-column
        align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="deleteLoginLog(scope.row)">Del</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ElDragSelect from '@/components/DragSelect'
import { fetchLoginLogList,deleteLoginLog,deleteSelectedLoginLog } from '@/api/log'
export default {
  name: 'LoginIndex',
  components: { Pagination, ElDragSelect },
  data() {
    return {
      listLoading: true,
      total: 0,
      list: null,
      multipleSelection: [],
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
      fetchLoginLogList(this.listQuery).then(response => {
        this.list = response.pageInfo.rows
        this.total = response.pageInfo.total
        this.listLoading = false
        // console.log(this.list)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    deleteLoginLog(val) {
      this.$confirm('确定删除该条记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log(val.userId)
        deleteLoginLog(val.loginId).then(() => {
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
    deleteSelected() {
      // console.log(this.multipleSelection.length>0)
      if(this.multipleSelection.length>0) {
        let selectedIds = this.getSelectedIds(this.multipleSelection)
        // console.log(selectedIds)
        this.$confirm('确定删除已选择的记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSelectedLoginLog(selectedIds).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }else {
        this.$message({
          type: 'error',
          message: '请选择至少一条数据'
        })
      }
    },
    getSelectedIds(val) {
      if(val){
        let ids = []
        val.forEach(item => {
          ids.push(item.loginId)
        })
        return ids
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>

<style scoped>

</style>
