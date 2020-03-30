<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder= "操作用户搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ '搜索' }}</el-button>
      <el-button class="filter-item" type="danger" icon="el-icon-delete" @click="deleteSelectedOperateLog">{{ '删除' }}</el-button>
      <el-button class="filter-item" type="warning" icon="el-icon-delete" @click="deleteAllOperateLog">{{ '清空' }}</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      @selection-change="handleSelectionChange"
      ref="multipleTable"
      element-loading-text="拼命加载中"
      v-loading="listLoading">
      <el-table-column type="selection" align="center"/>
      <el-table-column label="操作用户" prop="username" width="200"/>
      <el-table-column label="操作Ip" prop="ip" width="200"/>
      <el-table-column label="操作时间" prop="visitTime" width="200"/>
      <el-table-column label="操作方法" prop="method" width="200"/>
      <el-table-column label="耗时" prop="executionTime" width="200"/>
      <el-table-column
        align="center">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="danger"
            @click="deleteOperateLog(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import ElDragSelect from '@/components/DragSelect'
import { queryOperateLogByPage,deleteSelectedOperateLog,deleteOperateLog,deleteAllOperateLog } from '@/api/log'
export default {
  name: 'OperateIndex',
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
        search: '',
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      queryOperateLogByPage(this.listQuery).then(response => {
        this.list = response.pageInfo.rows
        this.total = response.pageInfo.total
        this.listLoading = false
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    deleteSelectedOperateLog() {
      if(this.multipleSelection.length>0) {
        let selectedIds = this.getSelectedIds(this.multipleSelection)
        this.$confirm('确定删除已选择的记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteSelectedOperateLog(selectedIds).then(() => {
            this.handleFilter()
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
    deleteAllOperateLog() {
      this.$confirm('确定删除所有操作记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAllOperateLog().then(() => {
          this.handleFilter()
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
    },
    deleteOperateLog(val) {
      this.$confirm('确定删除该条记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteAllOperateLog(val.id).then(() => {
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
    },
    getSelectedIds(val) {
      if(val){
        let ids = []
        val.forEach(item => {
          ids.push(item.id)
        })
        return ids
      }
    }
  }
}
</script>

<style scoped>

</style>
