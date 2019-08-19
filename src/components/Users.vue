<template>
  <div class="users">
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="username" label="姓名" width></el-table-column>
      <!-- el-table-column不设置宽度 是自适应 -->
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop label="用户状态">
        <!-- 使用作用域插槽 -->
        <template v-slot:default="obj">
          <el-switch v-model="obj.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop label="操作">
        <!-- 是三个不同type的button  需要绑定id进行后续操作 使用作用域插槽-->
        <template v-slot:default="obj">
          <el-button icon="el-icon-edit" size="small" type="primary" plain></el-button>
          <el-button icon="el-icon-delete" size="small" type="danger" plain></el-button>
          <el-button icon="el-icon-check" type="success" plain>分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      query: '',
      pagenum: 1,
      pagesize: 4,
      tableData: []
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      // 注意axios.get 的书写格式 不带token返回的是null，无效的token
      axios
        .get('http://localhost:8888/api/private/v1/users', {
          params: {
            query: this.query,
            pagenum: this.pagenum,
            pagesize: this.pagesize
          },
          headers: { Authorization: localStorage.getItem('token') }
        })
        .then(res => {
          this.tableData = res.data.data.users
          // console.log(this.tableData)
        })
    }
  }
}
</script>

<style>
</style>
