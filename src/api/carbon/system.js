import request from '@/utils/request'

export function getCarbonSystemUsers(params) {
  return request({ url: '/carbon/system/users', method: 'get', params })
}

export function saveCarbonSystemUser(data) {
  return request({
    url: '/carbon/system/users/save',
    method: 'post',
    data
  })
}

export function removeCarbonSystemUser(id) {
  return request({
    url: '/carbon/system/users/remove',
    method: 'post',
    data: { id }
  })
}

export function getCarbonSystemRoles() {
  return request({ url: '/carbon/system/roles', method: 'get' })
}

export function getCarbonSystemRoleOptions() {
  return request({ url: '/carbon/system/role/options', method: 'get' })
}

export function getCarbonSystemRolePermissions(params) {
  return request({ url: '/carbon/system/rolePermissions', method: 'get', params })
}

export function saveCarbonSystemRolePermissions(data) {
  return request({
    url: '/carbon/system/rolePermissions/save',
    method: 'post',
    data
  })
}

export function getCarbonSystemLogs(params) {
  return request({ url: '/carbon/system/logs', method: 'get', params })
}
