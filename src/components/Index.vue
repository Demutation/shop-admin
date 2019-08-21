<template>
  <el-container class="index">
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout">
        欢迎光临~
        <a href="javascript:;" @click="quit">退出</a>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px">
        <!-- el-menu整个大盒子 -->
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <!--el-submenu 每个菜单 el-menu-item每个子菜单-->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="users">用户列表</el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>
            <el-menu-item index="roles">角色列表</el-menu-item>
            <el-menu-item index="rights">权限列表</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    quit () {
      // 清除token
      // localStorage.removeItem('token')
      // this.$router.push('login')
      this.$confirm('请确认要退出吗？', '温馨提示', {
        confirmButtonText: '确定',
        concelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功！'
        })
        localStorage.removeItem('token')
        this.$router.push('login')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/* scoped让样式只在当前组件中器作用 */
.el-header {
  background-color: #d8d8d8;
  display: flex;
  .logo {
    width: 180px;
    img {
      height: 40px;
      margin-top: 10px;
    }
  }
  .logout {
    width: 180px;
    font-weight: 700;
    height: 60px;
    line-height: 60px;
    text-align: right;
    a {
      color: orange;
    }
  }
  .title {
    flex: 1;
    text-align: center;
    height: 60px;
    line-height: 60px;
    color: #545c64;
  }
}
.el-container {
  height: 100%;
}
.el-aside {
  background-color: #545c64;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #ecf0f1;
}
</style>
