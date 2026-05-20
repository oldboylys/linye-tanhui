const { ok, page } = require('./utils')
const translation = require('./data/carbon/translation')
const ledger = require('./data/carbon/ledger')
const gis = require('./data/carbon/gis')
const analysis = require('./data/carbon/analysis')
const assets = require('./data/carbon/assets')
const reports = require('./data/carbon/reports')
const carbonSystemState = require('./state/carbon-system')

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
  { url: '/carbon/system/users', type: 'get', response: () => {
    const rows = carbonSystemState.getUsers()
    return page(rows, rows.length)
  }},
  { url: '/carbon/system/users/save', type: 'post', response: req => {
    const r = carbonSystemState.saveUser(req.body || {})
    if (!r.ok) return { code: 500, msg: r.msg || '保存失败' }
    return ok()
  }},
  { url: '/carbon/system/users/remove', type: 'post', response: req => {
    const r = carbonSystemState.deleteUser((req.body || {}).id)
    if (!r.ok) return { code: 500, msg: r.msg || '删除失败' }
    return ok()
  }},
  { url: '/carbon/system/roles', type: 'get', response: () => ok({ data: carbonSystemState.getRoles() })},
  { url: '/carbon/system/role/options', type: 'get', response: () => ok({ data: carbonSystemState.roleOptionsForSelect() })},
  { url: '/carbon/system/rolePermissions', type: 'get', response: req => {
    const roleKey = req.query.roleKey
    return ok({ data: carbonSystemState.getPermissionsForRole(roleKey) })
  }},
  { url: '/carbon/system/rolePermissions/save', type: 'post', response: req => {
    const { roleKey, keys } = req.body || {}
    const r = carbonSystemState.saveRolePermissions(roleKey, keys || [])
    if (!r.ok) return { code: 500, msg: '保存失败' }
    return ok()
  }},
  { url: '/carbon/system/logs', type: 'get', response: req => ok({
    data: carbonSystemState.getLogs(req.query.operator)
  })}
]
