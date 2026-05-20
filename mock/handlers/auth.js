const { ok } = require('../utils')
const menus = require('../data/menu')
const { userProfiles } = require('../data/user')

const tokens = {
  admin: 'mock-admin-token'
}

function getToken(req) {
  return (req.headers.authorization || '').replace(/^Bearer\s+/i, '').trim()
}

function captchaImage() {
  return ok({
    captchaEnabled: false,
    img: '',
    uuid: 'mock-uuid'
  })
}

function login(req) {
  const { username } = req.body || {}
  const token = tokens[username]
  if (!token) {
    return { code: 500, msg: '用户不存在/密码错误' }
  }
  return ok({ token })
}

function getInfo(req) {
  const token = getToken(req)
  const profile = userProfiles[token]
  if (!profile) {
    return { code: 401, msg: '无效的会话，或者会话已过期，请重新登录。' }
  }
  return ok(profile)
}

function getRouters() {
  return ok({ data: menus })
}

function logout() {
  return ok()
}

module.exports = {
  tokens,
  captchaImage,
  login,
  getInfo,
  getRouters,
  logout
}
