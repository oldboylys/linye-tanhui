<template>
  <div class="app-container carbon-page">
    <div class="page-header">
      <h2>系统管理</h2>
    </div>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="用户管理" name="users">
        <el-button type="primary" size="mini" icon="el-icon-plus" class="mb16">新增用户</el-button>
        <el-table v-loading="loading" :data="users">
          <el-table-column prop="userName" label="用户名" />
          <el-table-column prop="org" label="机构" />
          <el-table-column prop="role" label="角色" />
          <el-table-column prop="status" label="状态" width="80">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '1' ? 'success' : 'info'" size="mini">
                {{ scope.row.status === '1' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100"><template><el-button type="text" size="mini">编辑</el-button></template></el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="角色权限" name="roles">
        <el-empty description="角色权限模块（待对接）" />
      </el-tab-pane>
      <el-tab-pane label="日志管理" name="logs">
        <el-empty description="日志管理模块（待对接）" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getCarbonSystemUsers } from '@/api/carbon/system'

export default {
  name: 'CarbonSystem',
  data() {
    return {
      activeTab: 'users',
      loading: false,
      users: []
    }
  },
  created() {
    this.loadUsers()
  },
  methods: {
    loadUsers() {
      this.loading = true
      getCarbonSystemUsers().then(res => {
        this.users = res.rows
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/carbon.scss';
.mb16 { margin-bottom: 16px; }
</style>

