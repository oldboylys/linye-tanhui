/**
 * 江口县碳汇平台 — 侧边栏一级菜单（扁平，对齐参考站）
 */
const menus = [
  { name: 'CarbonLedger', path: '/carbon/ledger', component: 'carbon/ledger/index', meta: { title: '碳汇数据台账', icon: 'excel' } },
  { name: 'TranslationTable', path: '/carbon/translation-table', component: 'carbon/translation-table/index', meta: { title: '翻译表配置', icon: 'dict' } },
  { name: 'GisMap', path: '/carbon/gis-map', component: 'carbon/gis-map/index', meta: { title: 'GIS地图', icon: 'international' } },
  { name: 'CarbonAnalysis', path: '/carbon/analysis', component: 'carbon/analysis/index', meta: { title: '碳汇分析', icon: 'chart' } },
  { name: 'CarbonAssets', path: '/carbon/assets', component: 'carbon/assets/index', meta: { title: '碳资产管理', icon: 'money' } },
  { name: 'CarbonReports', path: '/carbon/reports', component: 'carbon/reports/index', meta: { title: '报告中心', icon: 'documentation' } },
  { name: 'CarbonSystem', path: '/carbon/system', component: 'carbon/system/index', meta: { title: '系统管理', icon: 'system' } }
]

module.exports = menus.map(item => ({
  name: item.name,
  path: item.path,
  hidden: false,
  component: 'Layout',
  redirect: 'noRedirect',
  children: [
    {
      path: '',
      name: item.name + 'Page',
      component: item.component,
      meta: { ...item.meta, noCache: false, link: null }
    }
  ]
}))
