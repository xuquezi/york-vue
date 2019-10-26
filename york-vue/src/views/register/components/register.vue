<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" label-width="80px" :rules="registerRules">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="registerForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPass">
        <el-input v-model="registerForm.confirmPass" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="register">注册</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
  export default {
    name: 'register',
    data() {
      const validatePassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        }
        else if (value.length < 6) {
          callback(new Error('密码不能小于6位数！'))
        }
        else {
          callback()
        }
      }
      const validateConfirmPassword = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入确认密码'));
        }
        else if (value.length < 6) {
          callback(new Error('密码不能小于6位数'))
        }
        else if(value !==this.registerForm.password) {
          callback(new Error('两次输入的密码不一致！'))
        }
        else {
          callback()
        }
      }
      return {
        registerForm: {
          username: '',
          password: '',
          confirmPass: ''
        },
        registerRules: {
          password: [{ required: true, trigger: 'blur', validator: validatePassword }],
          confirmPass: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }]
        }
      }
    },
    methods: {
      register() {
        this.$refs.registerForm.validate(valid => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .register-container {
    border: 1px solid #DCDFE6;
    width: 650px;
    margin: 180px auto;
    padding: 35px 35px 15px 35px;
    border-radius: 5px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    box-shadow: 0 0 25px #909399;
  }
</style>
