import request from '@/utils/request'

export function getLedgerOverview() {
  return request({ url: '/carbon/ledger/overview', method: 'get' })
}

export function getLedgerTranslationOptions() {
  return request({ url: '/carbon/ledger/translationOptions', method: 'get' })
}

export function getLedgerExcel() {
  return request({ url: '/carbon/ledger/excel', method: 'get' })
}

export function getLedgerRaster() {
  return request({ url: '/carbon/ledger/raster', method: 'get' })
}

export function getLedgerVector() {
  return request({ url: '/carbon/ledger/vector', method: 'get' })
}
