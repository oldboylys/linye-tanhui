import request from '@/utils/request'

export function getAnalysisDatasets() {
  return request({ url: '/carbon/analysis/datasets', method: 'get' })
}

export function getAnalysisFilters() {
  return request({ url: '/carbon/analysis/filters', method: 'get' })
}

export function postAnalysisCharts(data) {
  return request({ url: '/carbon/analysis/charts', method: 'post', data })
}

/** @deprecated 新页面请使用 postAnalysisCharts */
export function getAnalysisResult() {
  return request({ url: '/carbon/analysis/result', method: 'get' })
}

/** @deprecated */
export function getAnalysisSummary() {
  return request({ url: '/carbon/analysis/summary', method: 'get' })
}
