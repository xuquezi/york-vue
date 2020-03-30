<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder= "角色名搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ '搜索' }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ '新增' }}</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      element-loading-text="拼命加载中"
      v-loading="listLoading">
      <el-table-column label="Id" prop="roleSerial" width="200" fixed/>
      <el-table-column label="角色名" prop="roleName" width="150"/>
      <el-table-column label="角色描述" prop="roleDesc" width="200"/>
      <el-table-column label="角色状态" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status=='0'" :type="scope.row.status | statusFilter" >use</el-tag>
          <el-tag v-if="scope.row.status=='1'" :type="scope.row.status | statusFilter" >stop</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="roleCreateTime" width="200"/>
      <el-table-column label="创建用户" prop="roleCreateUser" width="150"/>
      <el-table-column label="更新时间" prop="roleUpdateTime" width="200"/>
      <el-table-column label="更新用户" prop="roleUpdateUser" width="150"/>
      <el-table-column
        align="right" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">详情编辑</el-button>
          <el-button
            v-if="scope.row.status=='0'"
            size="mini"
            type="danger"
            @click="stopOrUseRole(scope.row)">停用</el-button>
          <el-button
            v-if="scope.row.status=='1'"
            size="mini"
            type="success"
            @click="stopOrUseRole(scope.row)">启用</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="deleteRole(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-on:close="cancel">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 600px; margin-left:50px;" >
        <el-form-item :label="'角色名称'" prop="roleName" >
          <el-input v-model="temp.roleName"/>
        </el-form-item>
        <el-form-item :label="'角色描述'" prop="roleDesc">
          <el-input v-model="temp.roleDesc"/>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <div>
              <el-form-item :label="'创建日期'" prop="roleCreateTime" v-if="this.showFlag == 'true'" label-width="80px">
                <el-input v-model="temp.roleCreateTime" :disabled="true"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item :label="'创建用户'" prop="roleCreateUser" v-if="this.showFlag == 'true'" label-width="80px">
                <el-input v-model="temp.roleCreateUser" :disabled="true"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div>
              <el-form-item :label="'更新日期'" prop="roleUpdateTime" v-if="this.showFlag == 'true'" label-width="80px">
                <el-input v-model="temp.roleUpdateTime" :disabled="true"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item :label="'更新用户'" prop="roleUpdateUser" v-if="this.showFlag == 'true'" label-width="80px">
                <el-input v-model="temp.roleUpdateUser" :disabled="true"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-form-item :label="'是否启用'" prop="status" v-if="this.showFlag == 'false'">
          <el-switch
            v-model="temp.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="0"
            inactive-value="1">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">{{ '取消' }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createRole():updateRole()">{{ '确定' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
  import ElDragSelect from '@/components/DragSelect'
  import { queryRoleListByPage,stopOrUseRole,deleteRoleByRoleSerial,updateRole,createRole } from '@/api/role'
  export default {
    name: 'RoleTable',
    components: { Pagination, ElDragSelect },
    data() {
      return {
        temp: {
          roleSerial: '',
          roleName: '',
          roleDesc: '',
          roleCreateTime: '',
          roleCreateUser: '',
          roleUpdateTime: '',
          roleUpdateUser: '',
          status: '1'
        },
        showFlag: 'true',
        rules: {
        },
        textMap: {
          update: '编辑',
          create: '新增'
        },
        listLoading: true,
        total: 0,
        list: null,
        dialogFormVisible: false,
        dialogStatus: '',
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
        queryRoleListByPage(this.listQuery).then(response => {
          this.list = response.pageInfo.rows
          this.total = response.pageInfo.total
          this.listLoading = false
        })
      },
      cancel() {
        this.dialogFormVisible = false
      },
      createRole() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createRole(this.temp).then(() => {
              this.dialogFormVisible = false
              this.handleFilter()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      updateRole() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            updateRole(tempData).then(() => {
              this.handleFilter()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }else {
            return false
          }
        })
      },
      handleCreate() {
        this.showFlag = 'false'
        this.temp = {
          roleSerial: '',
          roleName: '',
          roleDesc: '',
          status: '1',
          roleCreateTime: '',
          roleCreateUser: '',
          roleUpdateTime: '',
          roleUpdateUser: ''
        }
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.showFlag = 'true'
        this.temp.roleSerial = row.roleSerial
        this.temp.roleName = row.roleName
        this.temp.roleDesc = row.roleDesc
        this.temp.roleCreateTime = row.roleCreateTime
        this.temp.roleCreateUser = row.roleCreateUser
        this.temp.roleUpdateTime = row.roleUpdateTime
        this.temp.roleUpdateUser = row.roleUpdateUser
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      deleteRole(row) {
        this.$confirm('确定删除该角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRoleByRoleSerial(row.roleSerial).then(() => {
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
      stopOrUseRole(val) {
        this.$confirm('确定要停用/启用该角色吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          stopOrUseRole(val.roleSerial,val.status).then(() => {
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
