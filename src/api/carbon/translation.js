import request from '@/utils/request'

export function getTranslationStats() {
  return request({ url: '/carbon/translation/stats', method: 'get' })
}

export function getTranslationList(params) {
  return request({ url: '/carbon/translation/list', method: 'get', params })
}
