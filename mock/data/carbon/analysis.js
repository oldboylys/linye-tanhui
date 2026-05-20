module.exports = {
  summary: { selectedCount: 17, totalCarbon: 226307.4 },
  datasets: {
    excel: { label: 'Excel（林地资源数据）', selected: 12, total: 16, carbon: 169541.2, items: [
      { id: 1, name: '太平镇林地资源数据表_202401.xlsx', carbon: 15230.5, selected: true },
      { id: 2, name: '双江街道林地资源属性表_202402.xlsx', carbon: 11250.3, selected: true },
      { id: 3, name: '德旺乡林地资源数据表_202403.xlsx', carbon: 14320.9, selected: true }
    ]},
    raster: { label: '栅格影像', selected: 3, total: 4, carbon: 32568.8, items: [
      { id: 1, name: '江口县全域遥感影像_202401.tif', carbon: 23450.8, selected: true },
      { id: 2, name: '太平镇碳汇遥感反演_202402.img', carbon: 6820.3, selected: true }
    ]},
    vector: { label: '矢量图层', selected: 2, total: 4, carbon: 24197.4, items: [
      { id: 1, name: '双江街道林地分布_202403.shp', carbon: 9876.5, selected: true },
      { id: 2, name: '德旺乡林地边界_202406.geojson', carbon: 14320.9, selected: true }
    ]}
  },
  forestStructure: [
    { name: '常绿阔叶林', value: 45230, unit: 'hm²' },
    { name: '针叶林', value: 28560, unit: 'hm²' },
    { name: '混交林', value: 18340, unit: 'hm²' },
    { name: '竹林', value: 8760, unit: 'hm²' },
    { name: '灌木林', value: 5210, unit: 'hm²' }
  ],
  regionCompare: [
    { region: '太平镇', carbon: 45230 },
    { region: '德旺乡', carbon: 28300 },
    { region: '双江街道', carbon: 24600 },
    { region: '闵孝镇', carbon: 19800 }
  ]
}
