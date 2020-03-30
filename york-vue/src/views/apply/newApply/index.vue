<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder= "流程名搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ '搜索' }}</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      element-loading-text="拼命加载中"
      v-loading="listLoading">
      <el-table-column label="流程定义Id" prop="processDefId" fixed width="200"/>
      <el-table-column label="流程定义名称" prop="processDefName" width="200"/>
      <el-table-column label="流程定义描述" prop="processDefDescription" width="200"/>
      <el-table-column label="流程定义Key" prop="processDefKey" width="200"/>
      <el-table-column label="流程定义版本" prop="processDefVersion" width="200"/>
      <el-table-column
        align="center">
        <template slot-scope="scope" fixed="right" width="200">
          <el-button
            size="mini"
            type="danger"
            @click="startApply(scope.row)">开启</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import ElDragSelect from '@/components/DragSelect'
  import { getLastProcessDefList,startApply } from '@/api/apply'
  export default {
    name: 'NewApplyIndex',
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
        getLastProcessDefList(this.listQuery).then(response => {
          this.list = response.pageInfo.rows
          this.total = response.pageInfo.total
          this.listLoading = false
        })
      },
      startApply(val) {
        this.$confirm('确定发起流程吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          startApply(val.processDefKey).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '发起成功',
              type: 'success',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消发起流程'
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
