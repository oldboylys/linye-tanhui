import request from '@/utils/request'

export function getTranslationStats() {
  return request({ url: '/carbon/translation/stats', method: 'get' })
}

export function getTranslationList(params) {
  return request({ url: '/carbon/translation/list', method: 'get', params })
}

export function saveTranslation(data) {
  return request({ url: '/carbon/translation/save', method: 'post', data })
}

export function removeTranslation(id) {
  return request({ url: '/carbon/translation/remove', method: 'post', data: { id } })
}
