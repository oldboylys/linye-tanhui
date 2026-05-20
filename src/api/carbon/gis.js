import request from '@/utils/request'

export function getGisLayers() {
  return request({ url: '/carbon/gis/layers', method: 'get' })
}

export function getGisRegions() {
  return request({ url: '/carbon/gis/regions', method: 'get' })
}
