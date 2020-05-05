<template>
  <el-form>
    <el-form-item label="用户名">
      <el-input v-model.trim="user.name" />
    </el-form-item>
    <el-form-item label="邮箱地址">
      <el-input v-model.trim="user.email" />
    </el-form-item>
    <el-form-item label="角色">
      <el-input v-model.trim="user.role" :disabled="true" />
    </el-form-item>
    <el-form-item label="部门">
      <el-input v-model.trim="user.departmentName" :disabled="true" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">更新</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: '',
          email: '',
          role: ''
        }
      }
    }
  },
  methods: {
    submit() {
      this.$message({
        message: 'User information has been updated successfully',
        type: 'success',
        duration: 5 * 1000
      })
    }
  }
}
</script>
