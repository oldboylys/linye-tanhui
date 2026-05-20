module.exports = {
  list: [
    { id: 'CA-001', region: '太平镇', area: 3200.5, carbon: 42500, devType: 'CCER', status: 'certified' },
    { id: 'CA-002', region: '德旺乡', area: 2100.9, carbon: 28300, devType: 'VCS', status: 'developing' },
    { id: 'CA-003', region: '双江街道', area: 1850.3, carbon: 24600, devType: '碳票', status: 'traded' },
    { id: 'CA-004', region: '闵孝镇', area: 1560.8, carbon: 19800, devType: 'CCER', status: 'developing' },
    { id: 'CA-005', region: '坝盘镇', area: 1230.6, carbon: 16800, devType: 'VCS', status: 'pending' }
  ],
  recommend: [
    { region: '太平镇', score: 95, level: 'strong' },
    { region: '德旺乡', score: 90, level: 'strong' },
    { region: '双江街道', score: 82, level: 'recommend' },
    { region: '闵孝镇', score: 76, level: 'recommend' },
    { region: '坝盘镇', score: 62, level: 'normal' }
  ]
}
