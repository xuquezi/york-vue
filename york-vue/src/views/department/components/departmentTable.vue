<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.search" placeholder= "部门名搜索" style="width: 200px;" class="filter-item"/>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ '搜索' }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ '新增' }}</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      element-loading-text="拼命加载中"
      v-loading="listLoading">
      <el-table-column label="Id" prop="departmentSerial" width="200" fixed/>
      <el-table-column label="部门名称" prop="departmentName" width="200"/>
      <el-table-column label="部门描述" prop="departmentDesc" width="250"/>
      <el-table-column label="部门级别" prop="departmentLevel" width="150"/>
      <el-table-column label="部门管理人" prop="managerUsername" width="150"/>
      <el-table-column label="创建时间" prop="departmentCreateTime" width="200"/>
      <el-table-column label="创建用户" prop="departmentCreateUser" width="150"/>
      <el-table-column label="更新时间" prop="departmentUpdateTime" width="200"/>
      <el-table-column label="更新用户" prop="departmentUpdateUser" width="150"/>
      <el-table-column
        align="right" width="300" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleUpdate(scope.row)">详情编辑</el-button>
          <el-button
            size="mini"
            type="warning"
            @click="departmentUserQuery(scope.row)">部门员工查看</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="deleteDepartment(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-on:close="resetData">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;" :rules="rules">
        <el-form-item label="部门名称" prop="departmentName">
        <el-input v-model="temp.departmentName"/>
        </el-form-item>
        <el-form-item label="部门描述" prop="departmentDesc">
          <el-input v-model="temp.departmentDesc"/>
        </el-form-item>
        <el-form-item label="部门管理人" v-if="this.showFlag == 'true'">
          <el-select v-model="temp.managerUserSerial" class="filter-item" placeholder="请选择" >
            <el-option v-for="item in userOptions" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门级别" prop="departmentLevel">
          <el-select v-model="temp.departmentLevel" class="filter-item" placeholder="请选择" v-on:change="queryDepartmentByParentLevel" >
            <el-option v-for="item in levelOptions" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="上级部门" v-if="this.parentDepartmentShowFlag == 'true'" prop="parentDepartment">
          <el-select v-model="temp.parentDepartmentSerial" class="filter-item" placeholder="请选择" >
            <el-option v-for="item in parentOptions" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <div>
              <el-form-item :label="'创建日期'" prop="departmentCreateTime" v-if="this.showFlag == 'true'" label-width="80px">
                <el-input v-model="temp.departmentCreateTime" :disabled="true"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item :label="'创建用户'" prop="departmentCreateUser" v-if="this.showFlag == 'true'" label-width="80px">
                <el-input v-model="temp.departmentCreateUser" :disabled="true"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <div>
              <el-form-item :label="'更新日期'" prop="departmentUpdateTime" v-if="this.showFlag == 'true'" label-width="80px">
                <el-input v-model="temp.departmentUpdateTime" :disabled="true"/>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-form-item :label="'更新用户'" prop="departmentUpdateUser" v-if="this.showFlag == 'true'" label-width="80px">
                <el-input v-model="temp.departmentUpdateUser" :disabled="true"/>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetData">{{ '取消' }}</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ '确认' }}</el-button>
      </div>
    </el-dialog>

    <el-dialog title="部门员工列表" :visible.sync="userDepartmentDialogVisible" v-on:close="cancelDepartmentUser">
      <el-table :data="departmentUserList" align="center">
        <el-table-column property="username" label="用户名" width="200" />
        <el-table-column label="状态" class-name="status-col" width="200" >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status=='0'" :type="scope.row.status | statusFilter" >启用</el-tag>
            <el-tag v-if="scope.row.status=='1'" :type="scope.row.status| statusFilter" >停用</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="department.departmentName" label="用户部门" width="200" />
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import ElDragSelect from '@/components/DragSelect'
  import { queryDepartmentListByPage,queryDepartmentLevel,queryDepartmentByParentLevel,createDepartment,updateDepartment,deleteDepartmentByDepartmentSerial,departmentUserQuery } from '@/api/department'
  import { queryUserByDepartmentSerial } from '@/api/user'
  import { validDepartmentName } from '@/api/validate'

  export default {
    name: 'DepartmentTable',
    components: { Pagination, ElDragSelect },
    data() {
      const validateDepartmentName = (rule, value, callback) => {
        if(!value) {
          callback(new Error('部门名称不能为空！'))
        }
        else if (value.length < 2 || value.length > 15){
          callback(new Error('部门名称长度需要控制在在3到15之间！'))
        }
        else if (!this.validateFlag) {
          callback()
        }
        else{
          validDepartmentName(value).then(response => {
            let flag = response.flag
            if(!flag){
              callback(new Error('部门名称已存在！'))
            }
            callback()
          })
        }
      }
      const validateParentDepartment = (rule, value, callback) => {
        if (!this.temp.parentDepartmentSerial) {
          callback(new Error('请选择上级部门！'))
        }
        else {
          callback()
        }
      }
      return {
        // 校验标志
        validateFlag: true,
        // 加载
        listLoading: true,
        // 查询数据总数
        total: 0,
        // 页面展示list集合
        list: null,
        // 部门用户dialog是否显示
        userDepartmentDialogVisible: false,
        // 编辑新增页面是否显示
        dialogFormVisible: false,
        // dialog create or update
        dialogStatus: '',
        // 是否展示上级部门选择框
        parentDepartmentShowFlag: 'false',
        // 是否在编辑新增页面显示新增日期，创建日期等输入框（新增不显示，编辑的时候显示）
        showFlag: 'true',
        // 编辑 or 新增
        textMap: {
          update: '编辑',
          create: '新增'
        },
        departmentUserList: null,
        // 部门级别数组
        levelOptions: [],
        // 上级部门的数组
        parentOptions: [],
        // 部门员工数组
        userOptions: [],
        // 用于编辑的临时数据
        temp: {
          departmentSerial: '',
          departmentName: '',
          departmentDesc: '',
          departmentLevel: '',
          parentDepartmentSerial: '',
          departmentCreateTime: '',
          departmentCreateUser: '',
          departmentUpdateTime: '',
          departmentUpdateUser: '',
          managerUserSerial: ''
        },
        // 校验规则
        rules: {
          departmentName: [
            { required: true,validator: validateDepartmentName, trigger: 'blur' }
          ],
          departmentLevel: [
            { required: true,message: '请选择部门级别！', trigger: 'change' }
          ],
          departmentDesc: [
            { required: true,message: '请输入部门描述！', trigger: 'blur' }
          ],
          parentDepartment: [
            { required: true,validator: validateParentDepartment, trigger: 'change' }
          ]
        },
        // 查询条件封装
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
        queryDepartmentListByPage(this.listQuery).then(response => {
          this.list = response.pageInfo.rows
          this.total = response.pageInfo.total
          this.listLoading = false
        })
      },
      queryDepartmentByParentLevel() {
        this.parentOptions= []
        this.temp.parentDepartmentSerial = ''
        this.parentDepartmentShowFlag = 'true'
        queryDepartmentByParentLevel(this.temp.departmentLevel).then(response=> {
          response.list.forEach(item => {
            this.parentOptions.push({
              value: item.departmentSerial,
              label: item.departmentName,
            })
          })
        })
      },
      resetData() {
        this.dialogFormVisible= false
        this.parentDepartmentShowFlag = 'false'
        this.levelOptions = []
        this.parentOptions = []
        this.userOptions = []
      },
      queryParentDepartment(row) {
        this.temp.departmentLevel = row.departmentLevel
        queryDepartmentByParentLevel(this.temp.departmentLevel).then(response=> {
          response.list.forEach(item => {
            this.parentOptions.push({
              value: item.departmentSerial,
              label: item.departmentName,
            })
          })
        })
      },
      queryUserOptionsByDepartmentSerial(row){
        this.temp.departmentSerial = row.departmentSerial
        queryUserByDepartmentSerial(this.temp.departmentSerial).then(response=> {
          response.list.forEach(item => {
            this.userOptions.push({
              value: item.userSerial,
              label: item.username,
            })
          })
        })
      },
      handleUpdate(row) {
        this.queryDepartmentLevel()
        this.handleUpdateData(row)
        this.queryParentDepartment(row)
        this.queryUserOptionsByDepartmentSerial(row)
      },
      handleUpdateData(row) {
        this.temp.departmentName = row.departmentName
        this.temp.departmentDesc = row.departmentDesc
        this.temp.parentDepartmentSerial = row.parentDepartmentSerial
        this.temp.departmentCreateUser = row.departmentCreateUser
        this.temp.departmentCreateTime = row.departmentCreateTime
        this.temp.departmentUpdateTime = row.departmentUpdateTime
        this.temp.departmentUpdateUser = row.departmentUpdateUser
        if(row.managerUserSerial!==null) {
          this.temp.managerUserSerial = row.managerUserSerial
        }
        this.validateFlag = false
        this.showFlag = 'true'
        this.parentDepartmentShowFlag = 'true'
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      handleCreate() {
        this.queryDepartmentLevel()
        this.handleCreateData()
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleCreateData() {
        this.temp = {
          departmentSerial: '',
          departmentName: '',
          departmentDesc: '',
          departmentLevel: '',
          managerUserSerial: '',
          parentDepartmentSerial: '',
          departmentCreateTime: '',
          departmentCreateUser: '',
          departmentUpdateTime: '',
          departmentUpdateUser: ''
        }
        this.validateFlag = true
        this.showFlag = 'false'
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
      },
      queryDepartmentLevel() {
        queryDepartmentLevel().then(response => {
          response.list.forEach(item => {
            this.levelOptions.push({
              value: item.codeNo,
              label: item.codeName
            })
          })
        })
      },
      handleFilter() {
        this.listQuery.page = 1
        this.getList()
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            updateDepartment(tempData).then(() => {
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
      departmentUserQuery(row) {
        this.userDepartmentDialogVisible = true
        departmentUserQuery(row.departmentSerial).then(response => {
          this.departmentUserList = response.list
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            createDepartment(this.temp).then(() => {
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
      cancelDepartmentUser() {
        this.departmentUserList = null
        this.userDepartmentDialogVisible = false
      },
      deleteDepartment(row) {
        this.$confirm('确定删除该部门吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteDepartmentByDepartmentSerial(row.departmentSerial).then(() => {
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
      }
    }
  }
</script>

<style scoped>

</style>
