/**
 * 解析 query 参数
 */
function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1] || '').replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

function ok(data = {}) {
  return Object.assign({ code: 200, msg: '操作成功' }, data)
}

function page(rows = [], total) {
  return {
    code: 200,
    msg: '查询成功',
    rows,
    total: total === undefined ? rows.length : total
  }
}

module.exports = {
  param2Obj,
  ok,
  page
}
