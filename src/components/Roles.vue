<template>
  <div class="roles">
    <!-- 面包屑 用公共样式-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain class="btn">添加角色</el-button>
    <!-- 表单 -->
    <el-table :data="tableData">
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
          <!-- row就是tableData中的每一项 row就是角色 -->
        <el-row v-for="l1 in row.children" :key="l1.id" class="l1">
          <el-col :span="4">
            <el-tag closable>{{l1.authName}}</el-tag>
            <span class="el-icon-arrow-right"></span>
          </el-col>
          <el-col :span="20">
            <el-row v-for="l2 in l1.children" :key="l2.id" class="l2">
              <el-col :span="4">
                <el-tag closable type="success">{{l2.authName}}</el-tag>
                <span class="el-icon-arrow-right"></span>
              </el-col>
              <el-col :span="20">
                <!-- 直接遍历一行中展示多少个el-tag -->
                <el-tag v-for="l3 in l2.children" :key="l3.id" class="l3" closable type="warning">{{l3.authName}}</el-tag>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template>
          <el-button type="primary" plain class="el-icon-edit" size="small"></el-button>
          <el-button type="danger" plain class="el-icon-delete" size="small"></el-button>
          <el-button type="success" plain class="el-icon-check" size="small">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: []
    }
  },
  async created () {
    const res = await this.$axios.get('roles')
    const { meta, data } = res.data
    console.log(res)
    if (meta.status === 200) {
      this.tableData = data
    } else {
      this.$message.error(meta.msg)
    }
  }
}
</script>

<style lang="scss">
.roles {
  .btn {
    margin-bottom: 10px;
  }
  .l1 {
    margin-bottom: 5px;
    padding: 5px 0;
  }
  .l2 {
    margin-bottom: 10px;
  }
  .l3 {
    margin-bottom: 5px;
    margin-right: 10px;
  }
}
</style>
