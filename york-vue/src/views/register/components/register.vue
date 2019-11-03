<template>
  <div class="register-container">
    <el-form ref="registerForm" :model="registerForm" label-width="80px" :rules="registerRules">
      <div class="title-container">
        <h3 class="title">Register</h3>
      </div>
      <el-form-item label="头像" prop="avatar">
        <pan-thumb width="60px" height="60px" image="http://192.168.25.133/group1/M00/00/00/wKgZhV21X-2AHkV6AAC8e333r1k80.jpeg" v-model="registerForm.avatar">
          york
        </pan-thumb>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="registerForm.email" placeholder="请输入邮箱！"></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="registerForm.username" placeholder="请输入用户名！"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="registerForm.password" type="password" placeholder="请输入密码！"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPass">
        <el-input v-model="registerForm.confirmPass" type="password" placeholder="请确认密码！"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="tel">
        <el-input v-model="registerForm.tel" placeholder="请输入手机！"></el-input>
      </el-form-item>
      <el-form-item label="" prop="code" class="pr">
        <el-input prop="code" v-model="registerForm.code" placeholder="验证码"></el-input>
        <button @click="getCode(registerForm.tel)" class="code-btn" :disabled="!show">
          <span v-show="show">发送验证码</span>
          <span v-show="!show" class="count">{{count}} s</span>
        </button>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="registerForm.sex">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Born" prop="born">
        <el-date-picker v-model="registerForm.born" type="date" placeholder="不输入，默认为今天！" value-format="yyyy-MM-dd"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="register">注册</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>


<script>
  import { validUsername,validEmail } from '@/utils/validate'
  import { registerUser,sendCode } from '@/api/register'
  import PanThumb from '@/components/PanThumb'
  const TIME_COUNT = 60
  export default {
    name: 'register',
    components: {
      PanThumb,
    },
    data() {
      const validateEmail = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请正确填写邮箱！'));
        }
        if (value !== '') {
          var reg=/^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
          if(!reg.test(value)){
            callback(new Error('请输入有效的邮箱！'));
          }
        }
        validEmail(value).then(data => {
          if(!data){
            callback(new Error('该邮箱已经被注册！'))
          }else{
            callback()
          }
        })

      }
      const validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        }
        validUsername(value).then(data => {
          const flag = data
          // console.log(flag)
          if(!flag){
            callback(new Error('已有重复的有户名！'))
          }else{
            callback()
          }
        })
      }
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

      const validateTel = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('手机号不可为空!'));
        } else {
          if (value !== '') {
            var reg=/^1[3456789]\d{9}$/;
            if(!reg.test(value)){
              callback(new Error('请输入有效的手机号码!'));
            }
          }
          callback();
        }
      }
      return {
        registerForm: {
          username: '',
          password: '',
          confirmPass: '',
          email: '',
          tel: '',
          sex: 0,//默认男
          born: '',
          code: '',
          avatar: 'group1/M00/00/00/wKgZhV21XoGAcRFYAAEbzRWdZT061.jpeg'//默认头像
        },
        show: true,
        count: '',
        timer: null,
        registerRules: {
          email: [{ required: true, trigger: 'blur', validator: validateEmail }],
          username: [{ required: true, trigger: 'blur', validator: validateUsername }],
          password: [{ required: true, trigger: 'blur', validator: validatePassword }],
          confirmPass: [{ required: true, trigger: 'blur', validator: validateConfirmPassword }],
          tel: [{ required: true, trigger: 'blur', validator: validateTel }]
        }
      }
    },
    methods: {
      register() {
        this.$refs.registerForm.validate(valid => {
          if (valid) {
            registerUser(this.registerForm).then({

            })
          }
        })
      },
      getCode (tel) {
        // 验证码倒计时
        sendCode(tel).then(()=>{
          if (!this.timer) {
            this.count = TIME_COUNT
            this.show = false
            this.timer = setInterval(() => {
              if (this.count > 0 && this.count <= TIME_COUNT) {
                this.count--
              } else {
                this.show = true
                clearInterval(this.timer)
                this.timer = null
              }
            }, 1000)
          }
          this.$message({
            message: '发送成功，验证码将在5分钟后失效！',
            type: 'success'
          });
        });
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

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: black;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  //验证码样式输入框start
  .pr {
    position: relative;
  }
  .code-btn {
    width: 100px;
    height: 24px;
    position: absolute;
    top: 10px;
    right: 5px;
    z-index: 222;
    color: #F5A623;
    font-size: 14px;
    border: none;
    border-left: 1px solid #bababa;
    padding-left: 10px;
    background-color: #fff;
  }
  //验证码样式输入框end

</style>
