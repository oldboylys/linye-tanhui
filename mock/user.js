const auth = require('./handlers/auth')

module.exports = [
  { url: '/captchaImage', type: 'get', response: () => auth.captchaImage() },
  { url: '/login', type: 'post', response: req => auth.login(req) },
  { url: '/getInfo', type: 'get', response: req => auth.getInfo(req) },
  { url: '/logout', type: 'post', response: () => auth.logout() },
  { url: '/getRouters', type: 'get', response: () => auth.getRouters() },
  { url: '/register', type: 'post', response: () => ({ code: 200, msg: '注册成功' }) },
  { url: '/unlockscreen', type: 'post', response: () => ({ code: 200, msg: '操作成功' }) }
]
