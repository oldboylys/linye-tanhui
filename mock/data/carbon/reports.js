module.exports = {
  datasets: {
    excel: [
      { id: 1, name: '双江街道林地资源数据表', size: '3,865.2', selected: false },
      { id: 2, name: '太平镇林地资源属性表', size: '8,421.6', selected: false }
    ],
    raster: [
      { id: 1, name: '江口县全域遥感碳汇分析影像', size: '18,950.3', selected: false }
    ],
    vector: [
      { id: 1, name: '双江街道林地分布矢量', size: '3,865.2', selected: false }
    ]
  },
  list: [
    { id: 1, title: '江口县2024年Q1碳汇监测报告', date: '2024-04-01', type: '碳汇监测报告', status: 'done', dataCount: 4 },
    { id: 2, title: '江口县全域遥感分析报告', date: '2024-03-20', type: '遥感分析报告', status: 'done', dataCount: 2 },
    { id: 3, title: '太平镇碳汇综合分析报告', date: '2024-03-15', type: '综合分析报告', status: 'done', dataCount: 3 },
    { id: 4, title: '江口县林地矢量数据报告', date: '2024-03-10', type: '矢量数据报告', status: 'done', dataCount: 4 },
    { id: 5, title: '江口县2023年度碳汇综合报告', date: '2024-01-15', type: '综合分析报告', status: 'done', dataCount: 8 }
  ],
  reportTypes: ['碳汇监测报告', '遥感分析报告', '综合分析报告', '矢量数据报告']
}
