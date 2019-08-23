<template>
  <div class="roles">
    <!-- 面包屑 用公共样式-->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮 -->
    <el-button type="success" plain class="btn" @click="showAddRoles">添加角色</el-button>
    <!-- 表单 -->
    <el-table :data="tableData">
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
          <!-- row就是tableData中的每一项 row就是角色 -->
          <!-- 没有权限的时候应该显示 暂无权限 不应该什么都不显示-->
        <p v-if="row.children.length === 0">暂无权限</p>
        <el-row v-for="l1 in row.children" :key="l1.id" class="l1">
          <el-col :span="4">
            <el-tag closable @close="deleteRoleRight(row,l1.id)">{{l1.authName}}</el-tag>
            <span class="el-icon-arrow-right"></span>
          </el-col>
          <el-col :span="20">
            <el-row v-for="l2 in l1.children" :key="l2.id" class="l2">
              <el-col :span="4">
                <el-tag closable type="success" @close="deleteRoleRight(row,l2.id)">{{l2.authName}}</el-tag>
                <span class="el-icon-arrow-right"></span>
              </el-col>
              <el-col :span="20">
                <!-- 直接遍历一行中展示多少个el-tag -->
                <el-tag v-for="l3 in l2.children" :key="l3.id" class="l3" closable type="warning" @close="deleteRoleRight(row,l3.id)">{{l3.authName}}</el-tag>
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
        <template v-slot:default="scope">
          <el-button type="primary" plain class="el-icon-edit" size="small" @click="showEditDialog(scope.row)"></el-button>
          <el-button type="danger" plain class="el-icon-delete" size="small" @click="deleteRole(scope.row)"></el-button>
          <el-button type="success" plain class="el-icon-check" size="small" @click="assignDialog(scope.row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加角色的Dialog对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="dialogVisible"
      width="40%"
      @close = "clearContents">
      <el-form ref="form" :model="form" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="form.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编修修改角色的Dialog对话框 -->
     <el-dialog
      title="修改角色"
      :visible.sync="editVisible"
      width="40%"
      >
      <el-form ref="ruleForm" :model="ruleForm" label-width="80px" :rules="rules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="ruleForm.roleName" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="ruleForm.roleDesc" placeholder="请输入角色描述"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的Dialog对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignVisible"
      width="40%"
      >
      <!-- 树形结构 -->
      <el-tree
      default-expand-all
      :data="data"
      :props="defaultProps"
      show-checkbox
      node-key="id"
      ref="tree">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="assignRoles">分 配</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      dialogVisible: false,
      form: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }
        ]
      },
      editVisible: false,
      ruleForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      assignVisible: false,
      data: [],
      defaultProps: {
        // children是下一级的数据
        children: 'children',
        // label 配置的是authName
        label: 'authName'
      },
      id: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const res = await this.$axios.get('roles')
      const { meta, data } = res.data
      console.log(res)
      if (meta.status === 200) {
        this.tableData = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async deleteRole (row) {
      try {
        await this.$confirm('确定要删除此用户信息吗？', '温馨提示', { type: 'warning' })
        // 发送ajax请求
        const { data } = await this.$axios.delete(`roles/${row.id}`)
        // console.log(data)
        if (data.meta.status === 200) {
          // 提示删除成功
          this.$message.success('删除成功')
          // 重新渲染
          this.getRolesList()
        }
      } catch (e) {
        // console.log(e)
        this.$message('取消成功')
      }
    },
    showAddRoles () {
      this.dialogVisible = true
    },
    async addRoles () {
      try {
        await this.$refs.form.validate()
        // 校验通过ajax请求'
        const { data } = await this.$axios.post('roles', this.form)
        console.log(data)
        if (data.meta.status === 201) {
          // 提示成功
          this.$message.success(data.meta.msg)
          // 关闭dialog对话框
          this.dialogVisible = false
          // 重新渲染
          this.getRolesList()
        }
      } catch (e) {
        console.log(e)
      }
    },
    clearContents (form) {
      this.$refs.form.resetFields()
    },
    showEditDialog (row) {
      this.editVisible = true
      // 保存角色id
      this.ruleForm.id = row.id
      // console.log(row.id)
      // 数据回显
      this.ruleForm.roleName = row.roleName
      this.ruleForm.roleDesc = row.roleDesc
    },
    async editRoles () {
      try {
        await this.$refs.ruleForm.validate()
        // 校验成功发送ajax
        const { data } = await this.$axios.put(`roles/${this.ruleForm.id}`, this.ruleForm)
        // console.log(data)
        if (data.meta.status === 200) {
          this.$message.success('修改成功')
          // 关闭dialog
          this.editVisible = false
          // 重新渲染
          this.getRolesList()
        } else {
          this.$message.error(data.meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    async assignDialog (row) {
      // 弹出dialog对话框 发送ajax
      this.assignVisible = true
      // 保存角色id
      this.id = row.id
      const { data } = await this.$axios.get('rights/tree')
      console.log(data)
      // 展示全部的数据
      this.data = data.data
      const ids = []
      // row是角色本身携带的数据 回显的就是row.children
      row.children.forEach(l1 => {
        // 遍历的是一级
        l1.children.forEach(l2 => {
          // 遍历的是二级
          l2.children.forEach(l3 => {
            // 遍历的是三级 把三级id存到ids数组中
            ids.push(l3.id)
          })
        })
      })
      // 通过三级id设置回显
      this.$refs.tree.setCheckedKeys(ids)
    },
    // 点击分配的时候，获取新选中选项的rid this.$refs.tree.getCheckedKeys()，并且一二级的halfid也要拿到this.$refs.tree.getHalfCheckedKeys() 即半选状态下选项的id
    async assignRoles () {
      // rids权限列表id 即新选中选项的rid和一二级的halfid的组合
      const rid = this.$refs.tree.getCheckedKeys() // 获取的是数组
      const halfid = this.$refs.tree.getHalfCheckedKeys() // 获取的是数组
      const rids = [...rid, ...halfid].join() // 参数要求是逗号分割的字符串形式
      const { data } = await this.$axios.post(`roles/${this.id}/rights`, { rids })
      console.log(data)
      if (data.meta.status === 200) {
        this.$message.success('分配成功')
        // 关闭dialog对话框
        this.assignVisible = false
        // 重新渲染
        this.getRolesList()
      } else {
        this.$message.error(data.meta.msg)
      }
    },
    async deleteRoleRight (row, rightsId) {
      const { data } = await this.$axios.delete(`roles/${row.id}/rights/${rightsId}`)
      console.log(data)
      if (data.meta.status === 200) {
        this.$message.success(data.meta.msg)
        // 这里不能重新渲染，只能局部渲染，即把row.children数据重新赋值即可
        row.children = data.data
      } else {
        this.$message.error(data.meta.msg)
      }
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
