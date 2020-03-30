<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder= "用户名搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ '搜索' }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ '新增' }}</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      element-loading-text="拼命加载中"
      v-loading="listLoading">
      <el-table-column label="用户名" prop="username" fixed width="150"/>
      <el-table-column label="Id" prop="userSerial" width="200"/>
      <el-table-column label="邮箱地址" prop="email" width="200"/>
      <el-table-column label="手机号码" prop="mobile" width="200"/>
      <el-table-column label="出生日期" prop="born" width="200"/>
      <el-table-column label="性别" class-name="status-col" width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex=='0'" :type="scope.row.sex | sexFilter" >男</el-tag>
          <el-tag v-if="scope.row.sex=='1'" :type="scope.row.sex| sexFilter" >女</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col"width="150">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status=='0'" :type="scope.row.status | statusFilter" >启用</el-tag>
          <el-tag v-if="scope.row.status=='1'" :type="scope.row.status| statusFilter" >停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="userCreateTime" width="200"/>
      <el-table-column label="创建用户" prop="userCreateUser" width="150"/>
      <el-table-column label="更新时间" prop="userUpdateTime" width="200"/>
      <el-table-column label="更新用户" prop="userUpdateUser" width="150"/>
      <el-table-column label="部门" prop="department.departmentName" width="200"/>
      <el-table-column
        align="right" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">详情编辑</el-button>
          <el-button
            v-if="scope.row.status=='0'"
            size="mini"
            type="danger"
            @click="stopOrUseUser(scope.row)">停用</el-button>
          <el-button
            v-if="scope.row.status=='1'"
            size="mini"
            type="success"
            @click="stopOrUseUser(scope.row)">启用</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="deleteUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-on:close="cancel">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 600px; margin-left:50px;" >
        <el-form-item :label="'用户名'" prop="username" >
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item :label="'邮箱'" prop="email">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <el-form-item :label="'手机'" prop="mobile" >
          <el-input v-model="temp.mobile"/>
        </el-form-item>
        <el-form-item :label="'角色'">
          <el-drag-select v-model="temp.roles" style="width:500px;" multiple placeholder="请选择">
            <el-option v-for="item in roleList" :label="item.label" :value="item.value" />
          </el-drag-select>
        </el-form-item>
        <el-form-item :label="'部门'">
          <el-select v-model="temp.departmentSerial" placeholder="请选择">
            <el-option
              v-for="item in departmentList"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="'出生日期'">
          <el-date-picker v-model="temp.born" type="date" placeholder="Please pick a date" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item :label="'性别'">
          <el-radio-group v-model="temp.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <div>
              <el-form-item :label="'创建日期'" prop="userCreateTime" v-if="this.showFlag == 'true'" label-width="80px">
                <el-input v-model="temp.userCreateTime" :disabled="true"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item :label="'创建用户'" prop="userCreateUser" v-if="this.showFlag == 'true'" label-width="80px">
                <el-input v-model="temp.userCreateUser" :disabled="true"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div>
              <el-form-item :label="'更新日期'" prop="userUpdateTime" v-if="this.showFlag == 'true'" label-width="80px">
                <el-input v-model="temp.userUpdateTime" :disabled="true"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item :label="'更新用户'" prop="userUpdateUser" v-if="this.showFlag == 'true'" label-width="80px">
                <el-input v-model="temp.userUpdateUser" :disabled="true"/>
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
        <el-button type="primary" @click="dialogStatus==='create'?createUser():updateUser()">{{ '确定' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>

import { queryUserListByPage,stopOrUseUser,deleteUserByUserSerial,updateUser,createUser } from '@/api/user'
import Pagination from '@/components/Pagination'
import ElDragSelect from '@/components/DragSelect'
import { queryRoleList } from '@/api/role'
import { queryDepartmentList } from '@/api/department'

export default {
  name: 'UserTable',
  components: { Pagination,ElDragSelect },
  data() {
    return {
      listLoading: true,
      list: null,
      showFlag: 'true',
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        search: ''
      },
      rules: {
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新增'
      },
      roleList: [],
      departmentList: [],
      temp: {
        userSerial: '',
        username: '',
        email: '',
        mobile: '',
        born: '',
        status: '1',
        sex: 0,
        roles: [],
        userCreateTime: '',
        userCreateUser: '',
        userUpdateTime: '',
        userUpdateUser: '',
        departmentSerial: ''
      }
    }
  },
  filters: {
    sexFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger',
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        0: 'success',
        1: 'danger'
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
      queryUserListByPage(this.listQuery).then(response => {
        this.list = response.pageInfo.rows
        this.total = response.pageInfo.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      this.showFlag = 'true'
      this.getRoles()
      this.getDepartments()
      this.temp.roles = []
      this.temp.userSerial = row.userSerial
      this.temp.username = row.username
      this.temp.email = row.email
      this.temp.mobile = row.mobile
      this.temp.born = row.born
      this.temp.sex = row.sex
      this.temp.userCreateTime = row.userCreateTime
      this.temp.userCreateUser = row.userCreateUser
      this.temp.userUpdateUser = row.userUpdateUser
      this.temp.userUpdateTime = row.userUpdateTime
      if(row.department!==null){
        this.temp.departmentSerial = row.department.departmentSerial
      }
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      for (const item of row.roleList) {
        this.temp.roles.push(item.roleSerial)
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate() {
      this.showFlag = 'false'
      this.getRoles()
      this.getDepartments()
      this.temp = {
        userSerial: '',
        username: '',
        email: '',
        mobile: '',
        born: '',
        sex: 0,
        status: '1',
        roles: [],
        userCreateTime: '',
        userCreateUser: '',
        userUpdateTime: '',
        userUpdateUser: '',
        departmentSerial: ''
      }
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getRoles() {
      queryRoleList().then(response => {
        response.list.forEach(item => {
          this.roleList.push({
            value: item.roleSerial,
            label: item.roleName
          })
        })
      })
    },
    getDepartments() {
      queryDepartmentList().then(response => {
        response.list.forEach(item => {
          this.departmentList.push({
            value: item.departmentSerial,
            label: item.departmentName
          })
        })
      })
    },
    cancel() {
      this.dialogFormVisible = false
      this.roleList = []
      this.departmentList = []
    },
    deleteUser(val){
      this.$confirm('确定删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUserByUserSerial(val.userSerial).then(() => {
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
    stopOrUseUser(val) {
      this.$confirm('确定要停用/启用该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stopOrUseUser(val.userSerial,val.status).then(() => {
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
    createUser() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createUser(this.temp).then(() => {
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
    updateUser() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then(() => {
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
    }
  }
}
</script>

<style scoped>
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
</style>
