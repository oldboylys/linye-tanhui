function escapeCsv(s) {
  if (s == null || s === '') return ''
  const str = String(s)
  if (/[",\r\n]/.test(str)) return '"' + str.replace(/"/g, '""') + '"'
  return str
}

const STATUS_TEXT = {
  done: '核算完成',
  pending: '待核算',
  running: '核算中',
  failed: '核算失败'
}

const ACTION_TEXT = {
  stored: '已入库',
  start: '开始核算',
  wait: '请稍候...',
  error: '数据异常'
}

export function downloadLedgerRowCsv(blockLabel, row) {
  const statusText = STATUS_TEXT[row.status] || row.status
  const actionText = ACTION_TEXT[row.action] || row.action
  const headers = ['模块', '上传记录', '核算碳汇值(tCO2)', '核算状态', '操作状态']
  const line = [
    blockLabel,
    row.fileName,
    row.carbonValue != null ? row.carbonValue : '',
    statusText,
    actionText
  ]
  const csv = '\uFEFF' + headers.map(escapeCsv).join(',') + '\n' + line.map(escapeCsv).join(',')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  const base = (row.fileName && row.fileName.replace(/\.[^.]+$/, '')) || '台账记录'
  a.download = `${base}_导出.csv`
  a.click()
  URL.revokeObjectURL(a.href)
}
