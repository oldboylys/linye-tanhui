module.exports = {
  overview: {
    totalCount: 24,
    accountedCount: 15,
    accountingCount: 3,
    failedCount: 3,
    totalCarbon: 232138.5
  },
  translationOptions: [
    { label: '林地类型编码表', value: 'FOREST_TYPE' },
    { label: '林种分类编码表', value: 'FOREST_SPECIES' },
    { label: '土地利用类型编码表', value: 'LAND_USE' }
  ],
  excel: {
    label: 'Excel（林地资源数据）',
    count: 16,
    totalCarbon: 178672.9,
    completed: 10,
    rows: [
      { id: 1, fileName: '双江街道林地资源数据表_202401.xlsx', carbonValue: 18562.3, status: 'done', action: 'stored' },
      { id: 2, fileName: '太平镇林地资源属性表_202401.xlsx', carbonValue: 12430.8, status: 'done', action: 'stored' },
      { id: 3, fileName: '闵孝镇林地资源数据表_202402.xlsx', carbonValue: 9876.5, status: 'done', action: 'stored' },
      { id: 4, fileName: '民和镇林地资源属性表_202402.xlsx', carbonValue: 15208.7, status: 'done', action: 'stored' },
      { id: 5, fileName: '桃映镇林地资源数据表_202403.xlsx', carbonValue: null, status: 'pending', action: 'start' },
      { id: 6, fileName: '坝盘镇林地资源属性表_202403.xlsx', carbonValue: null, status: 'running', action: 'wait' },
      { id: 7, fileName: '怒溪镇林地资源数据表_202404.xlsx', carbonValue: 11245.6, status: 'done', action: 'stored' },
      { id: 8, fileName: '德旺乡林地资源属性表_202404.xlsx', carbonValue: 14320.9, status: 'done', action: 'stored' },
      { id: 9, fileName: '官和乡林地资源数据表_202405.xlsx', carbonValue: null, status: 'failed', action: 'error' },
      { id: 10, fileName: '凯德街道林地资源属性表_202405.xlsx', carbonValue: 10986.4, status: 'done', action: 'stored' }
    ]
  },
  raster: {
    label: '栅格影像',
    count: 4,
    totalCarbon: 26713.9,
    completed: 3,
    rows: [
      { id: 1, fileName: '江口县太平镇林地遥感影像_202403.tif', carbonValue: 7823.1, status: 'done', action: 'stored' },
      { id: 2, fileName: '闵孝镇碳汇监测影像_202404.tif', carbonValue: 11245.6, status: 'done', action: 'stored' },
      { id: 3, fileName: '民和镇林地覆盖栅格_202405.tif', carbonValue: null, status: 'failed', action: 'error' },
      { id: 4, fileName: '官和乡碳储量栅格_202406.tif', carbonValue: 7645.2, status: 'done', action: 'stored' }
    ]
  },
  vector: {
    label: '矢量图层',
    count: 4,
    totalCarbon: 26751.7,
    completed: 2,
    rows: [
      { id: 1, fileName: '双江街道林地分布矢量_202403.shp', carbonValue: 12430.8, status: 'done', action: 'stored' },
      { id: 2, fileName: '桃映镇林种分布_202404.geojson', carbonValue: null, status: 'running', action: 'wait' },
      { id: 3, fileName: '坝盘镇行政区划矢量_202405.shp', carbonValue: null, status: 'pending', action: 'start' },
      { id: 4, fileName: '德旺乡林地边界_202406.geojson', carbonValue: 14320.9, status: 'done', action: 'stored' }
    ]
  }
}
