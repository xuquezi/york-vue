<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder= "角色名搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ 'search' }}</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      element-loading-text="拼命加载中"
      v-loading="listLoading">
      <el-table-column label="RoleName" prop="roleName"/>
      <el-table-column label="Desc" prop="desc"/>
      <el-table-column label="CreateTime" prop="createTime" />
      <el-table-column label="CreateUser" prop="createUser" />
      <el-table-column label="Status" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status=='0'" :type="scope.row.status | statusFilter" >use</el-tag>
          <el-tag v-if="scope.row.status=='1'" :type="scope.row.status | statusFilter" >stop</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status=='0'"
            size="mini"
            type="danger"
            @click="stopAndUseRole(scope.row)">Stop</el-button>
          <el-button
            v-if="scope.row.status=='1'"
            size="mini"
            type="success"
            @click="stopAndUseRole(scope.row)">Use</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import ElDragSelect from '@/components/DragSelect'
  import { fetchRoleList,stopAndUseRole } from '@/api/role'
  export default {
    name: 'TaskIndex',
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
    filters: {
      statusFilter(status) {
        const statusMap = {
          0: 'success',
          1: 'danger',
        }
        return statusMap[status]
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchRoleList(this.listQuery).then(response => {
          this.list = response.pageInfo.rows
          this.total = response.pageInfo.total
          this.listLoading = false
        })
      },
      stopAndUseRole(val) {
        this.$confirm('确定要停用/启用该角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          stopAndUseRole(val.roleId,val.status).then(() => {
            this.getList()
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
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
