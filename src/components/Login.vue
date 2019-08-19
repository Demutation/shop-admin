<template>
  <div class="login">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" status-icon>
      <img class="logo" src="../assets/avatar.jpg" alt />
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密  码" prop="password" >
        <!-- 隐藏密码 type="password" -->
        <el-input v-model="form.password" type="password" placeholder="请输入密码" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">登录</el-button>
        <el-button class="resetBtn" @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
// axios 在哪使用就在哪引入
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        // 表单校验，只需要通过rules 属性传入约定的验证规则，并将Form-item的prop 属性设置为需要校验的字段名即可
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 12,
            message: '长度在 3 到 12 个字符',
            trigger: ['blur', 'change']
          }
        ]
        // 是否在输入框中显示校验结果图标 布尔值 status-icon 直接写在el-form标签内即可
      }
    }
  },

  methods: {
    // 重置功能
    resetForm () {
      // console.log(this.$refs);
      // 在元素或组件上设置ref=“名字”、属性，通过this.$refs.名字可以获取到元素或组件上的全部属性和方法 用来获取DOM的
      this.$refs.form.resetFields()
    },
    // 登录功能
    submitForm () {
      this.$refs.form.validate(valid => {
        // if(valid) {
        //   alert("submit")
        // }else{
        //   console.log("err");
        // }
        // 简写
        if (!valid) {
          return
        } // 错误直接return
        axios({
          method: 'post',
          url: 'http://localhost:8888/api/private/v1/login',
          data: {
            username: this.form.username,
            password: this.form.password
          }
        }).then(res => {
          if (res.data.meta.status === 200) {
            // 存储 token 到本地 用作守卫拦截
            localStorage.setItem('token', res.data.data.token)
            console.log(res.data)
            // 登录成功要跳转到首页
            this.$router.push('/index')
            // 消息提示
            this.$message({
              message: '登录成功',
              type: 'success',
              duration: 1000
            })
          } else {
            this.$message.error(res.data.meta.msg)
          }
          // console.log(res.data);
        })
      })
    }
  }
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form {
    width: 400px;
    background-color: #fff;
    padding: 20px;
    padding-top: 80px;
    margin: 0 auto;
    margin-top: 200px;
    border-radius: 20px;
    position: relative;
    .resetBtn {
      margin-left: 80px;
    }
    .logo {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -60px;
      border-radius: 50%;
      border: 5px solid #fff;
    }
  }
}
</style>
