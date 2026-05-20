import request from '@/utils/request'

export function getAssetsList(params) {
  return request({ url: '/carbon/assets/list', method: 'get', params })
}

export function getAssetsRecommend() {
  return request({ url: '/carbon/assets/recommend', method: 'get' })
}
