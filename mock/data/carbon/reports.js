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
    // 说明：pdfUrl 使用公开的示例 PDF；对接后端后替换为实际文件地址即可
    { id: 1, title: '江口县2024年Q1碳汇监测报告', date: '2024-04-01', type: '碳汇监测报告', status: 'done', dataCount: 4, pdfUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf' },
    { id: 2, title: '江口县全域遥感分析报告', date: '2024-03-20', type: '遥感分析报告', status: 'done', dataCount: 2, pdfUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf' },
    { id: 3, title: '太平镇碳汇综合分析报告', date: '2024-03-15', type: '综合分析报告', status: 'done', dataCount: 3, pdfUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf' },
    { id: 4, title: '江口县林地矢量数据报告', date: '2024-03-10', type: '矢量数据报告', status: 'done', dataCount: 4, pdfUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf' },
    { id: 5, title: '江口县2023年度碳汇综合报告', date: '2024-01-15', type: '综合分析报告', status: 'done', dataCount: 8, pdfUrl: 'https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf' }
  ],
  reportTypes: ['碳汇监测报告', '遥感分析报告', '综合分析报告', '矢量数据报告']
}
