import request from '@/utils/request'

export function getCarbonSystemUsers(params) {
  return request({ url: '/carbon/system/users', method: 'get', params })
}
