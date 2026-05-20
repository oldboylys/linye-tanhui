import request from '@/utils/request'

export function getAnalysisSummary() {
  return request({ url: '/carbon/analysis/summary', method: 'get' })
}

export function getAnalysisDatasets() {
  return request({ url: '/carbon/analysis/datasets', method: 'get' })
}

export function getAnalysisResult() {
  return request({ url: '/carbon/analysis/result', method: 'get' })
}
