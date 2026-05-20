const seed = require('../data/carbon/translation')

let list = seed.list.map(r => ({ ...r }))
let nextId = Math.max(...list.map(r => r.id), 0) + 1

function nowStr() {
  const d = new Date()
  const p = n => (n < 10 ? '0' + n : '' + n)
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

function stats() {
  const total = list.length
  let enabled = 0
  let disabled = 0
  let mappingTotal = 0
  list.forEach(r => {
    if (r.status === '1') enabled++
    else disabled++
    mappingTotal += Number(r.mappingCount) || 0
  })
  return { total, enabled, disabled, mappingTotal }
}

function query({ status = '', keyword = '' }) {
  let rows = list.slice()
  if (status === '1' || status === '0') {
    rows = rows.filter(r => r.status === status)
  }
  const k = String(keyword || '').trim().toLowerCase()
  if (k) {
    rows = rows.filter(
      r =>
        String(r.name).toLowerCase().includes(k) ||
        String(r.code).toLowerCase().includes(k)
    )
  }
  return rows
}

function save(payload) {
  const { id, name, code, description, status } = payload
  if (!name || !code) return { ok: false, msg: '名称与编码必填' }
  if (list.some(r => r.code === code && r.id !== id)) {
    return { ok: false, msg: '编码已存在' }
  }
  if (id) {
    const idx = list.findIndex(r => r.id === id)
    if (idx === -1) return { ok: false, msg: '记录不存在' }
    list[idx] = {
      ...list[idx],
      name,
      code: String(code).toUpperCase(),
      description: description || '',
      status: status === '0' ? '0' : '1',
      updateTime: nowStr()
    }
    return { ok: true }
  }
  list.unshift({
    id: nextId++,
    name,
    code: String(code).toUpperCase(),
    description: description || '',
    mappingCount: 0,
    status: status === '0' ? '0' : '1',
    updateTime: nowStr()
  })
  return { ok: true }
}

function remove(id) {
  const idx = list.findIndex(r => r.id === id)
  if (idx === -1) return { ok: false, msg: '记录不存在' }
  list.splice(idx, 1)
  return { ok: true }
}

module.exports = {
  stats,
  query,
  save,
  remove
}
