<template>
  <div class="app-container carbon-page carbon-system-page">
    <div class="page-header">
      <h2>系统管理</h2>
    </div>

    <el-tabs v-model="activeTab" class="system-tabs" @tab-click="onTabChange">
      <!-- 用户管理 -->
      <el-tab-pane label="用户管理" name="users">
        <div class="pane-toolbar">
          <span />
          <el-button type="success" icon="el-icon-plus" size="small" @click="openUserDialog(null)">新增用户</el-button>
        </div>
        <el-table v-loading="userLoading" :data="users" stripe class="system-table">
          <el-table-column prop="userName" label="用户名" min-width="110" />
          <el-table-column prop="org" label="机构" min-width="140" show-overflow-tooltip />
          <el-table-column prop="role" label="角色" min-width="110" />
          <el-table-column prop="status" label="状态" width="88" align="center">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status === '1' ? 'success' : 'info'" effect="plain" size="small">
                {{ scope.row.status === '1' ? '启用' : '禁用' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" size="small" icon="el-icon-edit" @click="openUserDialog(scope.row)" />
              <el-button
                type="text"
                size="small"
                class="btn-del"
                icon="el-icon-delete"
                :disabled="scope.row.userName === 'admin'"
                @click="onDeleteUser(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table>

        <el-dialog :title="userForm.id ? '编辑用户' : '新增用户'" :visible.sync="userDialogVisible" width="480px" append-to-body custom-class="carbon-dialog">
          <el-form ref="userFormRef" :model="userForm" :rules="userRules" label-width="72px" size="small">
            <el-form-item label="用户名" prop="userName">
              <el-input v-model="userForm.userName" placeholder="请输入用户名" :disabled="!!userForm.id" maxlength="32" />
            </el-form-item>
            <el-form-item label="机构" prop="org">
              <el-input v-model="userForm.org" placeholder="请输入机构名称" maxlength="64" />
            </el-form-item>
            <el-form-item label="角色" prop="roleKey">
              <el-select v-model="userForm.roleKey" placeholder="选择角色" style="width:100%" @change="onRoleKeyChange">
                <el-option v-for="opt in roleSelectOptions" :key="opt.value" :label="opt.label" :value="opt.value" />
              </el-select>
            </el-form-item>
            <el-form-item v-if="userForm.id" label="状态" prop="status">
              <el-switch v-model="userForm.status" active-value="1" inactive-value="0" active-text="启用" inactive-text="禁用" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button size="small" @click="userDialogVisible = false">取 消</el-button>
            <el-button type="success" size="small" @click="submitUser">确 认</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>

      <!-- 角色权限 -->
      <el-tab-pane label="角色权限" name="roles">
        <el-row :gutter="16" class="role-layout">
          <el-col :xs="24" :sm="10" :md="8">
            <el-card shadow="never" class="role-list-card">
              <div slot="header" class="card-title">角色列表</div>
              <div
                v-for="r in roles"
                :key="r.roleKey"
                class="role-item"
                :class="{ active: selectedRoleKey === r.roleKey }"
                @click="selectRole(r)"
              >
                <i class="el-icon-s-custom role-icon" />
                <span class="role-name">{{ r.name }}</span>
                <el-tag size="mini" type="info" effect="plain">{{ r.permissionCount }} 项权限</el-tag>
              </div>
            </el-card>
          </el-col>
          <el-col :xs="24" :sm="14" :md="16">
            <el-card shadow="never" class="perm-card">
              <div slot="header" class="card-title">权限配置 - {{ currentRoleName }}</div>
              <div v-if="permLoading" class="perm-loading"><i class="el-icon-loading" /> 加载中...</div>
              <div v-else class="perm-list">
                <div v-for="p in permissions" :key="p.key" class="perm-row">
                  <el-checkbox v-model="p.checked" @change="markPermDirty">{{ p.label }}</el-checkbox>
                  <el-tag size="mini" type="info" effect="plain" class="perm-key">{{ p.key }}</el-tag>
                </div>
              </div>
              <div class="perm-actions">
                <el-button type="success" size="small" :loading="permSaveLoading" :disabled="!permDirty" @click="savePermissions">保存权限</el-button>
                <el-button size="small" :disabled="!permDirty" @click="resetPermissions">重置</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>

      <!-- 日志管理 -->
      <el-tab-pane label="日志管理" name="logs">
        <el-card shadow="never" class="log-card">
          <div slot="header" class="log-header">
            <span class="card-title">操作日志</span>
            <el-select v-model="logOperator" placeholder="全部操作人" clearable size="small" style="width: 160px" @change="loadLogs">
              <el-option label="全部操作人" value="" />
              <el-option v-for="op in logOperatorOptions" :key="op" :label="op" :value="op" />
            </el-select>
          </div>
          <el-table v-loading="logLoading" :data="logs" stripe class="system-table">
            <el-table-column prop="operator" label="操作人" width="100" />
            <el-table-column prop="time" label="时间" width="170" />
            <el-table-column prop="content" label="操作内容" min-width="220" show-overflow-tooltip />
            <el-table-column prop="ip" label="IP地址" width="130" />
          </el-table>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {
  getCarbonSystemUsers,
  saveCarbonSystemUser,
  removeCarbonSystemUser,
  getCarbonSystemRoles,
  getCarbonSystemRoleOptions,
  getCarbonSystemRolePermissions,
  saveCarbonSystemRolePermissions,
  getCarbonSystemLogs
} from '@/api/carbon/system'

export default {
  name: 'CarbonSystem',
  data() {
    return {
      activeTab: 'users',
      userLoading: false,
      users: [],
      userDialogVisible: false,
      userForm: {
        id: null,
        userName: '',
        org: '',
        roleKey: '',
        role: '',
        status: '1'
      },
      userRules: {
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        org: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        roleKey: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      roleSelectOptions: [],
      roles: [],
      selectedRoleKey: 'admin',
      currentRoleName: '超级管理员',
      permissions: [],
      permLoading: false,
      permDirty: false,
      permSaveLoading: false,
      logs: [],
      logLoading: false,
      logOperator: '',
      logOperatorOptions: []
    }
  },
  created() {
    this.loadUsers()
    this.loadRoleOptions()
  },
  methods: {
    onTabChange(tab) {
      if (tab.name === 'roles' && !this.roles.length) this.loadRolesAndPerms()
      if (tab.name === 'logs') this.loadLogs()
    },
    loadUsers() {
      this.userLoading = true
      getCarbonSystemUsers().then(res => {
        this.users = res.rows
        this.userLoading = false
      })
    },
    loadRoleOptions() {
      getCarbonSystemRoleOptions().then(res => {
        this.roleSelectOptions = res.data
      })
    },
    openUserDialog(row) {
      if (row) {
        this.userForm = {
          id: row.id,
          userName: row.userName,
          org: row.org,
          roleKey: row.roleKey,
          role: row.role,
          status: row.status
        }
      } else {
        this.userForm = {
          id: null,
          userName: '',
          org: '',
          roleKey: '',
          role: '',
          status: '1'
        }
      }
      this.userDialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.userFormRef) this.$refs.userFormRef.clearValidate()
      })
    },
    onRoleKeyChange(key) {
      const opt = this.roleSelectOptions.find(o => o.value === key)
      this.userForm.role = opt ? opt.roleName : ''
    },
    submitUser() {
      this.$refs.userFormRef.validate(valid => {
        if (!valid) return
        saveCarbonSystemUser(this.userForm).then(() => {
          this.$message.success('保存成功')
          this.userDialogVisible = false
          this.loadUsers()
        })
      })
    },
    onDeleteUser(row) {
      this.$confirm(`确定删除用户「${row.userName}」吗？删除后不可恢复。`, '删除确认', {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => removeCarbonSystemUser(row.id))
        .then(() => {
          this.$message.success('已删除')
          this.loadUsers()
        })
        .catch(() => {})
    },
    loadRolesAndPerms() {
      getCarbonSystemRoles().then(res => {
        this.roles = res.data
        const first = this.roles.find(r => r.roleKey === this.selectedRoleKey) || this.roles[0]
        if (first) {
          this.selectedRoleKey = first.roleKey
          this.currentRoleName = first.name
          this.fetchPermissions()
        }
      })
    },
    selectRole(r) {
      if (this.permDirty) {
        this.$confirm('当前权限有未保存的修改，是否放弃？', '提示', {
          type: 'warning'
        })
          .then(() => {
            this.permDirty = false
            this.applyRoleSelect(r)
          })
          .catch(() => {})
        return
      }
      this.applyRoleSelect(r)
    },
    applyRoleSelect(r) {
      this.selectedRoleKey = r.roleKey
      this.currentRoleName = r.name
      this.fetchPermissions()
    },
    fetchPermissions() {
      this.permLoading = true
      this.permDirty = false
      getCarbonSystemRolePermissions({ roleKey: this.selectedRoleKey }).then(res => {
        this.permissions = res.data.map(p => ({ ...p }))
        this.permLoading = false
      })
    },
    markPermDirty() {
      this.permDirty = true
    },
    resetPermissions() {
      this.fetchPermissions()
    },
    savePermissions() {
      const keys = this.permissions.filter(p => p.checked).map(p => p.key)
      this.permSaveLoading = true
      saveCarbonSystemRolePermissions({ roleKey: this.selectedRoleKey, keys })
        .then(() => {
          this.$message.success('权限已保存')
          this.permDirty = false
          this.loadRolesAndPerms()
        })
        .finally(() => {
          this.permSaveLoading = false
        })
    },
    loadLogs() {
      this.logLoading = true
      getCarbonSystemLogs().then(res => {
        const all = res.data
        if (!this.logOperatorOptions.length) {
          this.logOperatorOptions = [...new Set(all.map(l => l.operator))].sort()
        }
        this.logs = this.logOperator ? all.filter(l => l.operator === this.logOperator) : all
        this.logLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/carbon.scss';

.carbon-system-page {
  .system-tabs ::v-deep .el-tabs__item.is-active {
    color: #1a7f4b;
  }
  .system-tabs ::v-deep .el-tabs__active-bar {
    background-color: #1a7f4b;
  }
}

.pane-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.system-table {
  border-radius: 8px;
  overflow: hidden;
}

.btn-del {
  color: #f56c6c;
  &:hover {
    color: #f78989;
  }
}

.role-layout {
  min-height: 420px;
}

.role-list-card,
.perm-card,
.log-card {
  border-radius: 10px;
  border: 1px solid #e8f0eb;
}

.card-title {
  font-weight: 600;
  color: #1a2e24;
}

.role-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  margin-bottom: 8px;
  border-radius: 8px;
  border: 1px solid #e8f0eb;
  cursor: pointer;
  transition: all 0.2s;
  .role-icon {
    color: #1a7f4b;
    font-size: 18px;
  }
  .role-name {
    flex: 1;
    font-size: 14px;
  }
  &:hover {
    border-color: #b8dcc8;
  }
  &.active {
    background: #e8f5ee;
    border-color: #1a7f4b;
  }
}

.perm-list {
  max-height: 480px;
  overflow-y: auto;
}

.perm-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  margin-bottom: 8px;
  border: 1px solid #edf2ef;
  border-radius: 8px;
  background: #fafcfb;
}

.perm-key {
  font-family: monospace;
}

.perm-actions {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
}

.perm-loading {
  padding: 40px;
  text-align: center;
  color: #909399;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dialog-footer .el-button--success {
  background: #1a7f4b;
  border-color: #1a7f4b;
}
</style>

<style lang="scss">
.carbon-dialog .el-dialog__header {
  border-bottom: 1px solid #f0f0f0;
}
.carbon-dialog .el-button--success {
  background: #1a7f4b;
  border-color: #1a7f4b;
}
</style>
