import request from '@/utils/request'

export function getReportsDatasets() {
  return request({ url: '/carbon/reports/datasets', method: 'get' })
}

export function getReportsList() {
  return request({ url: '/carbon/reports/list', method: 'get' })
}

export function getReportTypes() {
  return request({ url: '/carbon/reports/types', method: 'get' })
}
