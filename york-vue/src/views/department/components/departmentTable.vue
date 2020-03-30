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
      <el-table-column label="部门管理人" prop="userInfo.username" width="150"/>
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
            @click="departmentUserEdit(scope.row)">部门员工编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            @click="deleteDepartment(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" v-on:close="resetData">
      <el-form ref="dataForm" :model="temp" label-position="left" label-width="100px" style="width: 600px; margin-left:50px;">
        <el-form-item label="部门名称" >
        <el-input v-model="temp.departmentName"/>
        </el-form-item>
        <el-form-item label="部门描述" >
          <el-input v-model="temp.departmentDesc"/>
        </el-form-item>
        <el-form-item label="部门管理人" v-if="this.showFlag == 'true'">
          <el-select v-model="temp.managerUserSerial" class="filter-item" placeholder="请选择" >
            <el-option v-for="item in userOptions" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门级别">
          <el-select v-model="temp.departmentLevel" class="filter-item" placeholder="请选择" v-on:change="queryDepartmentByParentLevel" >
            <el-option v-for="item in levelOptions" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="上级部门" v-if="this.parentDepartmentShowFlag == 'true'">
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

    <el-dialog title="部门员工编辑" :visible.sync="userEditDialogVisible" v-on:close="cancelEditDepartmentUser">
      <el-form ref="departmentUserForm" :model="transferData" label-position="left" label-width="100px" style="width: 500px; margin-left:100px;">
        <el-transfer
          v-model="transferData.departmentUserList"
          :data="transferData.allUser"
          :titles="['用户', '部门']">
        </el-transfer>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelEditDepartmentUser">{{ '取消编辑' }}</el-button>
        <el-button type="primary" @click="editDepartmentUser()">{{ '确认编辑' }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import ElDragSelect from '@/components/DragSelect'
  import { queryDepartmentListByPage,queryDepartmentLevel,queryDepartmentByParentLevel,createDepartment,updateDepartment,editDepartmentUser } from '@/api/department'
  import { queryAllUserList,queryUserByDepartmentSerial,queryUserArrayByDepartmentSerial } from '@/api/user'
  export default {
    name: 'DepartmentTable',
    components: { Pagination, ElDragSelect },
    data() {
      const queryAllUser = _ => {
        const allUser = [];
        queryAllUserList().then(response=> {
          response.list.forEach(item => {
            allUser.push({
              key: item.userSerial,
              label: item.username,
            });
          })
        })
        return allUser
      };
      return {
        listLoading: true,
        total: 0,
        list: null,
        userEditDialogVisible: false,
        dialogFormVisible: false,
        dialogStatus: '',
        parentDepartmentShowFlag: 'false',
        showFlag: 'true',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        levelOptions: [],
        parentOptions: [],
        userOptions: [],
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
        transferData: {
          allUser: queryAllUser(),
          departmentUserList: [],
          departmentSerial: ''

        },
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
      handleUpdate(row) {
        this.showFlag = 'true'
        this.queryDepartmentLevel()
        this.temp.departmentSerial = row.departmentSerial
        this.temp.departmentName = row.departmentName
        this.temp.departmentDesc = row.departmentDesc
        this.temp.departmentLevel = row.departmentLevel
        if(row.userInfo!==null) {
          this.temp.managerUserSerial = row.userInfo.userSerial
        }
        this.parentDepartmentShowFlag = 'true'
        queryDepartmentByParentLevel(this.temp.departmentLevel).then(response=> {
          response.list.forEach(item => {
            this.parentOptions.push({
              value: item.departmentSerial,
              label: item.departmentName,
            })
          })
        })
        queryUserByDepartmentSerial(this.temp.departmentSerial).then(response=> {
          response.list.forEach(item => {
            this.userOptions.push({
              value: item.userSerial,
              label: item.username,
            })
          })
        })
        this.temp.parentDepartmentSerial = row.parentDepartmentSerial
        this.temp.departmentCreateUser = row.departmentCreateUser
        this.temp.departmentCreateTime = row.departmentCreateTime
        this.temp.departmentUpdateTime = row.departmentUpdateTime
        this.temp.departmentUpdateUser = row.departmentUpdateUser
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
      },
      handleCreate() {
        this.queryDepartmentLevel()
        this.showFlag = 'false'
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
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
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
      departmentUserEdit(row) {
        this.transferData.departmentSerial = row.departmentSerial
        queryUserArrayByDepartmentSerial(row.departmentSerial).then(response=> {
          if(response.array!==null){
            this.transferData.departmentUserList = response.array;
          }
        })
        this.userEditDialogVisible = true
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
      cancelEditDepartmentUser() {
        this.userEditDialogVisible = false
        this.transferData.departmentSerial = ''
        this.transferData.departmentUserList = []
      },
      editDepartmentUser() {
        this.$refs['departmentUserForm'].validate((valid) => {
          if (valid) {
            editDepartmentUser(this.transferData).then(() => {
              this.userEditDialogVisible = false
              this.handleFilter()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }).catch(() => {
              this.cancelEditDepartmentUser()
            });
          }
        })

      },
      deleteDepartment() {
      }
    }
  }
</script>

<style scoped>

</style>
