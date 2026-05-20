const { ok, page } = require('./utils')
const translation = require('./data/carbon/translation')
const ledger = require('./data/carbon/ledger')
const gis = require('./data/carbon/gis')
const analysis = require('./data/carbon/analysis')
const assets = require('./data/carbon/assets')
const reports = require('./data/carbon/reports')
const system = require('./data/carbon/system')

module.exports = [
  { url: '/carbon/ledger/overview', type: 'get', response: () => ok({ data: ledger.overview }) },
  { url: '/carbon/ledger/translationOptions', type: 'get', response: () => ok({ data: ledger.translationOptions }) },
  { url: '/carbon/ledger/excel', type: 'get', response: () => ok({ data: ledger.excel }) },
  { url: '/carbon/ledger/raster', type: 'get', response: () => ok({ data: ledger.raster }) },
  { url: '/carbon/ledger/vector', type: 'get', response: () => ok({ data: ledger.vector }) },
  { url: '/carbon/translation/stats', type: 'get', response: () => ok({ data: translation.stats }) },
  { url: '/carbon/translation/list', type: 'get', response: req => {
    const status = req.query.status
    let rows = translation.list
    if (status === '1') rows = rows.filter(r => r.status === '1')
    if (status === '0') rows = rows.filter(r => r.status === '0')
    return page(rows, rows.length)
  }},
  { url: '/carbon/gis/layers', type: 'get', response: () => ok({ data: gis.layers }) },
  { url: '/carbon/gis/regions', type: 'get', response: () => ok({ data: gis.regions }) },
  { url: '/carbon/analysis/summary', type: 'get', response: () => ok({ data: analysis.summary }) },
  { url: '/carbon/analysis/datasets', type: 'get', response: () => ok({ data: analysis.datasets }) },
  { url: '/carbon/analysis/result', type: 'get', response: () => ok({
    data: { forestStructure: analysis.forestStructure, regionCompare: analysis.regionCompare }
  })},
  { url: '/carbon/assets/list', type: 'get', response: () => page(assets.list, assets.list.length) },
  { url: '/carbon/assets/recommend', type: 'get', response: () => ok({ data: assets.recommend }) },
  { url: '/carbon/reports/datasets', type: 'get', response: () => ok({ data: reports.datasets }) },
  { url: '/carbon/reports/list', type: 'get', response: () => ok({ data: reports.list }) },
  { url: '/carbon/reports/types', type: 'get', response: () => ok({ data: reports.reportTypes }) },
  { url: '/carbon/system/users', type: 'get', response: () => page(system.users, system.users.length) }
]
