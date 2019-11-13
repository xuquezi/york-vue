<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder= "用户名搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ 'search' }}</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="Name:">
              <span>{{ props.row.username }}</span>
            </el-form-item>
            <el-form-item label="Sex:">
              <span>
                <el-tag v-if="props.row.sex=='0'" :type="props.row.sex | sexFilter" size="small">Male</el-tag>
                <el-tag v-if="props.row.sex=='1'" :type="props.row.sex| sexFilter" size="small">FeMale</el-tag>
              </span>
            </el-form-item>
            <el-form-item label="Email:">
              <span>{{ props.row.email }}</span>
            </el-form-item>
            <el-form-item label="avatar:">
              <span>
                 <img :src="props.row.avatar" width="40px" height="40px">
              </span>
            </el-form-item>
            <el-form-item label="Tel:">
              <span>{{ props.row.tel }}</span>
            </el-form-item>
            <el-form-item label="Status:">
              <span>
                <el-tag v-if="props.row.status=='0'" :type="props.row.status | statusFilter" size="small">Use</el-tag>
                <el-tag v-if="props.row.status=='1'" :type="props.row.status| statusFilter" size="small">Stop</el-tag>
                <el-tag v-if="props.row.status=='2'" :type="props.row.status| statusFilter" size="small">Wait</el-tag>
              </span>
            </el-form-item>
            <el-form-item label="BornTime:">
              <span>{{ props.row.born }}</span>
            </el-form-item>
            <el-form-item label="CreateTime:">
              <span>{{ props.row.createTime }}</span>
            </el-form-item>
            <el-form-item label="CreateUser:">
              <span>{{ props.row.createUser }}</span>
            </el-form-item>
            <el-form-item label="UpdateTime:">
              <span>{{ props.row.updateTime }}</span>
            </el-form-item>
            <el-form-item label="UpdateUser:">
              <span>{{ props.row.updateUser }}</span>
            </el-form-item>
            <el-form-item label="Roles:">
              <el-tag
                v-for="item in props.row.roles"
                :key="item.roleId"
                effect="dark" size="mini">
                {{ item.roleName }}
              </el-tag>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="Name" prop="username" />
      <el-table-column label="Email" prop="email" />
      <el-table-column label="Tel" prop="tel" />
      <el-table-column label="Born" prop="born" />
      <el-table-column label="Sex" class-name="status-col" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.sex=='0'" :type="scope.row.sex | sexFilter" >男</el-tag>
          <el-tag v-if="scope.row.sex=='1'" :type="scope.row.sex| sexFilter" >女</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        align="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">Edit</el-button>
          <el-button
            v-if="scope.row.status=='0'"
            size="mini"
            type="danger"
            @click="stopAndUse(scope.row)">Stop</el-button>
          <el-button
            v-if="scope.row.status=='1'"
            size="mini"
            type="success"
            @click="stopAndUse(scope.row)">Use</el-button>
          <el-button
            v-if="scope.row.status=='2'"
            size="mini"
            type="warning"
            @click="activate(scope.row)">Act</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="deleteUser(scope.row)">Del</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 400px; margin-left:50px;">
        <el-form-item :label="'username'" prop="username" >
          <el-input v-model="temp.username"/>
        </el-form-item>
        <el-form-item :label="'Email'" prop="userEmail">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <el-form-item :label="'Mobile'" prop="userMobile" >
          <el-input v-model="temp.tel"/>
        </el-form-item>
        <el-form-item :label="'roles'">
          <el-drag-select v-model="temp.roleArray" style="width:500px;" multiple placeholder="请选择">
            <el-option v-for="item in roleList" :label="item.label" :value="item.value" :key="item.value" />
          </el-drag-select>
        </el-form-item>
        <el-form-item label="Born">
          <el-date-picker v-model="temp.born" type="date" placeholder="Please pick a date" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item label="Sex">
          <el-radio-group v-model="temp.sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ 'cancel' }}</el-button>
        <el-button type="primary" @click="updateData()">{{ 'confirm' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>// Secondary package based on el-pagination

import { fetchList,updateUser,stopAndUse,deleteUser,activate } from '@/api/user'
import Pagination from '@/components/Pagination'
import ElDragSelect from '@/components/DragSelect' // base on element-ui
import { getRoles } from '@/api/role'
export default {
  name: 'UserTable',
  components: { Pagination,ElDragSelect },
  data() {
    return {
      list: null, // 获取列表展示集合
      total: 0, // 获取列表展示记录数
      listQuery: {
        page: 1,
        limit: 10, // 默认每页显示10条
        search: ''
      },
      // 输入规则限制
      rules: {
        username: [{ required: true, message: 'username is required', trigger: 'change' }]
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      roleList: [],
      // 拷贝到编辑页面的临时数据
      temp: {
        userId: '',
        username: '',
        email: '',
        tel: '',
        born: '',
        sex: 0,
        roleArray: []
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
        1: 'danger',
        2: 'warning'
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
    this.getRoles()
  },
  methods: {
    getList() {
      fetchList(this.listQuery).then(response => {
        this.list = response.pageInfo.rows
        this.total = response.pageInfo.total
        // console.logs(this.list)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleUpdate(row) {
      // 每次编辑前清空temp.roles
      // console.logs(row)
      this.temp.roleArray = []
      this.temp.userId = row.userId
      this.temp.username = row.username
      this.temp.email = row.email
      this.temp.tel = row.tel
      this.temp.born = row.born
      this.temp.sex = row.sex
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      for (const item of row.roles) {
        // 用item操作每一条数据。
        this.temp.roleArray.push(item.roleId)
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    getRoles() {
      getRoles().then(response => {
        response.list.forEach(item => {
          this.roleList.push({
            value: item.roleId,
            label: item.roleName
          })
        })
      })
    },
    deleteUser(val){
      this.$confirm('确定删除该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(val.userId).then(() => {
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
    stopAndUse(val) {
      this.$confirm('确定要停用/启用该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stopAndUse(val.userId,val.status).then(() => {
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
    activate(val) {
      this.$confirm('确定要激活该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        activate(val.userId).then(() => {
          this.getList()
          this.$notify({
            title: '成功',
            message: '激活成功',
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          updateUser(tempData).then(() => {
            this.getList()
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
  .demo-table-expand {
    font-size: 0;
  }
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
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
