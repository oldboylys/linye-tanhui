/**
 * 碳汇分析 — Mock 数据与图表生成（仅 Mock 层做简单聚合演示）
 */
const excelNames = [
  '太平镇林地资源数据表_202401.xlsx', '双江街道林地资源属性表_202402.xlsx', '德旺乡林地资源数据表_202403.xlsx',
  '闵孝镇林地资源属性表_202401.xlsx', '民和镇林地资源数据表_202402.xlsx', '桃映镇林地资源属性表_202403.xlsx',
  '江口县全域林地资源汇总表_202404.xlsx', '坝盘镇林地资源数据表_202405.xlsx', '怒溪镇林地资源属性表_202406.xlsx',
  '凯德街道林地资源数据表_202407.xlsx', '梵净山保护区林地资源表_202408.xlsx', '官和乡林地资源属性表_202409.xlsx',
  '双江街道碳计量台账_202410.xlsx', '德旺乡碳汇核算汇总表_202411.xlsx', '太平镇样地调查数据_202412.xlsx', '闵孝镇月度数据_202413.xlsx'
]
const excelCarbons = [15230.5, 11250.3, 14320.9, 9876.4, 12870.1, 6210.7, 45680.2, 8650.3, 7430.6, 5680.4, 28450.6, 3890.2, 9210.8, 13440.1, 7650.0, 8120.5]

const rasterNames = [
  '江口县全域遥感影像_202401.tif', '太平镇碳汇遥感反演_202402.img', '德旺乡植被指数影像_202403.tif', '江口县NDVI分析影像_202404.img'
]
const rasterCarbons = [23450.8, 6820.3, 2297.7, 11200.5]

const vectorNames = [
  '双江街道林地分布_202403.shp', '桃映镇林种分布_202404.geojson', '坝盘镇行政区划矢量_202405.shp', '德旺乡林地边界_202406.geojson'
]
const vectorCarbons = [9876.5, 4567.8, 2890.3, 14320.9]

function makeItems(names, carbons) {
  return names.map((name, i) => ({ id: i + 1, name, carbon: carbons[i], selected: false }))
}

const datasets = {
  excel: {
    label: 'Excel（林地资源数据）',
    items: makeItems(excelNames, excelCarbons)
  },
  raster: {
    label: '栅格影像',
    items: makeItems(rasterNames, rasterCarbons)
  },
  vector: {
    label: '矢量图层',
    items: makeItems(vectorNames, vectorCarbons)
  }
}

const filterOptions = {
  regions: [
    { label: '全部区域', value: '' },
    { label: '太平镇', value: '太平镇' },
    { label: '德旺乡', value: '德旺乡' },
    { label: '双江街道', value: '双江街道' },
    { label: '闵孝镇', value: '闵孝镇' },
    { label: '坝盘镇', value: '坝盘镇' },
    { label: '桃映镇', value: '桃映镇' },
    { label: '江口县全域', value: '江口县全域' }
  ],
  forestTypes: [
    { label: '全部林种', value: '' },
    { label: '常绿阔叶林', value: '常绿阔叶林' },
    { label: '针叶林', value: '针叶林' },
    { label: '混交林', value: '混交林' },
    { label: '竹林', value: '竹林' },
    { label: '灌木林', value: '灌木林' }
  ],
  forestAges: [
    { label: '全部林龄', value: '' },
    { label: '幼龄林', value: '幼龄林' },
    { label: '中龄林', value: '中龄林' },
    { label: '近熟林', value: '近熟林' },
    { label: '成熟林', value: '成熟林' },
    { label: '过熟林', value: '过熟林' }
  ]
}

function scaleFactor(body) {
  let f = 1
  if (body.region && body.region !== '') f *= 0.92
  if (body.forestType && body.forestType !== '') f *= 0.88
  if (body.forestAge && body.forestAge !== '') f *= 0.85
  return Math.max(0.55, f)
}

function buildCharts(body) {
  const k = scaleFactor(body || {})
  return {
    forestStructure: [
      { name: '常绿阔叶林', value: Math.round(45230 * k), unit: 'hm²' },
      { name: '针叶林', value: Math.round(28560 * k), unit: 'hm²' },
      { name: '混交林', value: Math.round(18340 * k), unit: 'hm²' },
      { name: '竹林', value: Math.round(8760 * k), unit: 'hm²' },
      { name: '灌木林', value: Math.round(5210 * k), unit: 'hm²' }
    ],
    treeAge: {
      categories: ['幼龄林', '中龄林', '近熟林', '成熟林', '过熟林'],
      area: [12000, 18500, 22000, 16000, 9800].map(v => Math.round(v * k)),
      carbon: [8200, 15200, 19800, 14100, 7600].map(v => Math.round(v * k))
    },
    species: {
      categories: ['杉木', '马尾松', '桉树', '樟树', '毛竹', '柏木', '其他'],
      area: [18200, 15600, 12400, 9800, 8600, 7200, 5600].map(v => Math.round(v * k)),
      carbon: [12500, 11000, 9200, 7100, 5900, 4800, 3500].map(v => Math.round(v * k))
    },
    regionCompare: [
      { region: '太平镇', carbon: Math.round(15200 * k) },
      { region: '德旺乡', carbon: Math.round(14100 * k) },
      { region: '潘庄乡', carbon: Math.round(12800 * k) },
      { region: '双江街道', carbon: Math.round(11900 * k) },
      { region: '闵孝镇', carbon: Math.round(10500 * k) },
      { region: '桃映镇', carbon: Math.round(9800 * k) },
      { region: '坝盘镇', carbon: Math.round(8700 * k) },
      { region: '怒溪镇', carbon: Math.round(7600 * k) },
      { region: '凯德街道', carbon: Math.round(6900 * k) },
      { region: '官和乡', carbon: Math.round(5200 * k) }
    ].sort((a, b) => b.carbon - a.carbon)
  }
}

module.exports = {
  datasets,
  filterOptions,
  buildCharts,
  // 兼容旧接口
  summary: { selectedCount: 0, totalCarbon: 0 },
  forestStructure: [],
  regionCompare: []
}
