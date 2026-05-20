const initialUsers = [
  { id: 1, userName: 'admin', org: '江口县林业局', role: '超级管理员', roleKey: 'admin', status: '1' },
  { id: 2, userName: 'zhangsan', org: '碳汇监测中心', role: '数据管理员', roleKey: 'data_admin', status: '1' },
  { id: 3, userName: 'lisi', org: '碳汇分析中心', role: '分析师', roleKey: 'analyst', status: '1' },
  { id: 4, userName: 'wangwu', org: '资源管理科', role: '操作员', roleKey: 'operator', status: '0' },
  { id: 5, userName: 'zhaoliu', org: '碳汇监测中心', role: '数据管理员', roleKey: 'data_admin', status: '1' }
]

let nextUserId = 6
let users = initialUsers.map(u => ({ ...u }))

const roleDefinitions = [
  { id: 1, name: '超级管理员', roleKey: 'admin', permissionCount: 7 },
  { id: 2, name: '数据管理员', roleKey: 'data_admin', permissionCount: 4 },
  { id: 3, name: '分析师', roleKey: 'analyst', permissionCount: 4 },
  { id: 4, name: '操作员', roleKey: 'operator', permissionCount: 2 }
]

const permissionCatalog = [
  { key: 'data-access', label: '数据接入' },
  { key: 'data-query', label: '数据查询' },
  { key: 'gis-map', label: 'GIS地图' },
  { key: 'analysis', label: '碳汇分析' },
  { key: 'carbon-assets', label: '碳资产管理' },
  { key: 'reports', label: '报告中心' },
  { key: 'system', label: '系统管理' }
]

const rolePermissionKeys = {
  admin: ['data-access', 'data-query', 'gis-map', 'analysis', 'carbon-assets', 'reports', 'system'],
  data_admin: ['data-access', 'data-query', 'gis-map', 'reports'],
  analyst: ['data-query', 'gis-map', 'analysis', 'reports'],
  operator: ['data-query', 'gis-map']
}

let rolePermissions = {}
Object.keys(rolePermissionKeys).forEach(k => {
  rolePermissions[k] = [...rolePermissionKeys[k]]
})

const initialLogs = [
  { id: 1, operator: 'admin', time: '2024-03-15 14:30:22', content: '导入栅格数据文件', ip: '192.168.1.100' },
  { id: 2, operator: 'zhangsan', time: '2024-03-15 15:10:08', content: '查询碳汇台账数据', ip: '192.168.1.101' },
  { id: 3, operator: 'lisi', time: '2024-03-15 16:22:33', content: '生成碳汇监测报告', ip: '192.168.1.102' },
  { id: 4, operator: 'admin', time: '2024-03-16 09:15:00', content: '修改用户 wangwu 状态为禁用', ip: '192.168.1.100' },
  { id: 5, operator: 'zhangsan', time: '2024-03-16 11:05:44', content: '导出查询结果', ip: '192.168.1.101' },
  { id: 6, operator: 'lisi', time: '2024-03-16 13:40:12', content: '查看GIS地图详情', ip: '192.168.1.102' },
  { id: 7, operator: 'admin', time: '2024-03-17 10:08:56', content: '新增用户 zhaoliu', ip: '192.168.1.100' },
  { id: 8, operator: 'wangwu', time: '2024-03-17 14:22:01', content: '校验数据文件', ip: '192.168.1.105' }
]

let logs = initialLogs.map(l => ({ ...l }))
let nextLogId = 9

function getUsers() {
  return users
}

function saveUser(payload) {
  let { id, userName, org, role, roleKey, status } = payload
  const def = roleDefinitions.find(r => r.roleKey === roleKey)
  if ((!role || role === '') && def) role = def.name
  if (id) {
    const idx = users.findIndex(u => u.id === id)
    if (idx === -1) return { ok: false, msg: '用户不存在' }
    users[idx] = { ...users[idx], userName, org, role, roleKey, status }
    pushLog('admin', `编辑用户 ${userName}`)
    return { ok: true }
  }
  if (users.some(u => u.userName === userName)) {
    return { ok: false, msg: '用户名已存在' }
  }
  users.push({
    id: nextUserId++,
    userName,
    org,
    role,
    roleKey,
    status: status || '1'
  })
  pushLog('admin', `新增用户 ${userName}`)
  return { ok: true }
}

function deleteUser(id) {
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return { ok: false, msg: '用户不存在' }
  const name = users[idx].userName
  if (name === 'admin') return { ok: false, msg: '不能删除超级管理员' }
  users.splice(idx, 1)
  pushLog('admin', `删除用户 ${name}`)
  return { ok: true }
}

function getRoles() {
  return roleDefinitions.map(r => ({
    ...r,
    permissionCount: rolePermissions[r.roleKey] ? rolePermissions[r.roleKey].length : 0
  }))
}

function getPermissionsForRole(roleKey) {
  const keys = rolePermissions[roleKey] || []
  return permissionCatalog.map(p => ({
    ...p,
    checked: keys.includes(p.key)
  }))
}

function saveRolePermissions(roleKey, keys) {
  if (!rolePermissionKeys.hasOwnProperty(roleKey)) return { ok: false }
  rolePermissions[roleKey] = [...keys]
  pushLog('admin', `更新角色 ${roleKey} 权限`)
  return { ok: true }
}

function pushLog(operator, content) {
  const now = new Date()
  const pad = n => (n < 10 ? '0' + n : '' + n)
  const time = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
  logs.unshift({
    id: nextLogId++,
    operator,
    time,
    content,
    ip: '127.0.0.1'
  })
}

function getLogs(operator) {
  if (!operator) return [...logs]
  return logs.filter(l => l.operator === operator)
}

function roleOptionsForSelect() {
  return roleDefinitions.map(r => ({
    label: r.name,
    value: r.roleKey,
    roleName: r.name
  }))
}

module.exports = {
  getUsers,
  saveUser,
  deleteUser,
  getRoles,
  getPermissionsForRole,
  saveRolePermissions,
  getLogs,
  roleOptionsForSelect,
  permissionCatalog
}
