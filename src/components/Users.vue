<template>
  <div class="users">
  <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
  <!-- 搜索框 -->
   <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
    <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
  </el-input>
    <el-button plain type="success" class="addBtn" @click="add">添加用户</el-button>
  <!-- 表格 -->
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="username" label="姓名" width></el-table-column>
      <!-- el-table-column不设置宽度 是自适应 -->
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop label="用户状态">
        <!-- 使用作用域插槽 -->
        <template v-slot:default="obj">
          <!-- 注册切换状态事件 点击时弹出消息框-->
          <el-switch
            v-model="obj.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changState(obj.row) "
          ></el-switch>
          <!-- 需要传入用户id和状态两个参数，直接把整个数据对象传进去 -->
        </template>
      </el-table-column>
      <el-table-column prop label="操作">
        <!-- 是三个不同type的button  需要绑定id进行后续操作 使用作用域插槽-->
        <template v-slot:default="obj">
          <el-button icon="el-icon-edit" size="small" type="primary" plain></el-button>
          <el-button @click="deleteUsers(obj.row.id)" icon="el-icon-delete" size="small" type="danger" plain></el-button>
          <el-button icon="el-icon-check" type="success" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
  <!-- 分页 -->
  <!-- page-sizes 每页显示几条
   current-page 当前显示页
   total 一共多少条 res.data返回的total -->
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total= "total">
    </el-pagination>
    <!-- 添加功能弹出的Dialog对话框放在最上面或者最下面 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="40%">
      <!-- 表单 -->
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
         <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" placeholder="请输入密码"></el-input>
        </el-form-item>
         <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
         <el-form-item label="手机" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 4,
      total: 0,
      tableData: [],
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      dialogVisible: false,
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12个字符', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 12, message: '长度在 3 到 12个字符', trigger: ['blur', 'change'] }
        ],
        email: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的手机号', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      // 注意axios.get 的书写格式 不带token返回的是null，无效的token
      this.$axios
        .get('users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          }
        })
        .then(res => {
          this.tableData = res.data.data.users
          this.total = res.data.data.total
          console.log(res.data)
        })
    },
    changState (row) {
      // 发送axios请求
      this.$axios
        .put(
          `users/${row.id}/state/${row.mg_state}`
        )
        .then(res => {
          console.log(res.data)
        })
    },
    // 分页功能
    handleSizeChange (val) {
      // 把val 值赋值给 pagesize
      this.pagesize = val
      // 重新渲染
      this.getData()
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      // 把当前页码pagenum重新赋值
      this.pagenum = val
      // 重新渲染
      this.getData()
      // console.log(`当前页: ${val}`)
    },
    // 搜索功能
    search () {
      // 因为绑定了query关键字 v-model="query" 直接渲染即可
      this.getData()
    },
    // 根据id进行删除
    deleteUsers (id) {
      this.$confirm('确定要删除此用户信息吗？', '温馨提示', {
        type: 'warning'
      }).then(() => {
        // 发送axios请求
        this.$axios.delete(`users/${id}`).then(res => {
          console.log('成功')
          const { meta } = res.data // 对象解构赋值
          if (meta.status === 200) {
            this.$message.success('删除成功')
            // 如果当前页只有一条数据了，还进行删除操作，应当当前页pagenum-1
            if (this.tableData.length === 1 && this.pagenum > 1) {
              this.pagenum--
            }
            // tableData的长度就是当前页的条数 this.tableData = res.data.data.users
            // 重新渲染 渲染之前做判断
            this.getData()
          }
        })
      })
    },
    // 添加功能 点击添加按通过 dialogVisible属性控制是否显示对话框
    add () {
      this.dialogVisible = true
    },
    addUsers () {
      // 发送axios请求
      //
      // 表单验证通过事件
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 发送axios
          this.$axios.post('users', this.form
          // {
          //   username: this.form.username,
          //   password: this.form.password,
          //   email: this.form.email,
          //   mobile: this.form.monile
          // }
          ).then(res => {
            // console.log(res.data)
            // 提示添加成功 关闭对话框 重新渲染
            this.$message.success('添加成功')
            this.dialogVisible = false
            this.getData()
          })
        } else {
          // console.log(2)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.users .breadcrumb {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
.users .input-with-select {
  width: 320px;
  margin-bottom: 10px;
}
.users .addBtn {
  margin-left: 20px;
}
.users .el-table {
  margin-bottom: 10px;
}
</style>
