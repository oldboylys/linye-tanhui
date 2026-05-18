const { ok } = require('./utils')
const menus = require('./data/menu')

const tokens = {
  admin: 'mock-admin-token'
}

const users = {
  'mock-admin-token': {
    userId: 1,
    userName: 'admin',
    nickName: '管理员',
    avatar: '',
    dept: { deptId: 100, deptName: '若依科技' }
  }
}

module.exports = [
  {
    url: '/captchaImage',
    type: 'get',
    response: () => ok({
      captchaEnabled: false,
      img: '',
      uuid: 'mock-uuid'
    })
  },
  {
    url: '/login',
    type: 'post',
    response: req => {
      const { username } = req.body
      const token = tokens[username]
      if (!token) {
        return { code: 500, msg: '用户不存在/密码错误' }
      }
      return ok({ token })
    }
  },
  {
    url: '/getInfo',
    type: 'get',
    response: req => {
      const token = (req.headers.authorization || '').replace('Bearer ', '')
      const user = users[token]
      if (!user) {
        return { code: 401, msg: '无效的会话，或者会话已过期，请重新登录。' }
      }
      return ok({
        user,
        roles: ['admin'],
        permissions: ['*:*:*'],
        isDefaultModifyPwd: false,
        isPasswordExpired: false,
        pwdChrtype: 0
      })
    }
  },
  {
    url: '/logout',
    type: 'post',
    response: () => ok()
  },
  {
    url: '/getRouters',
    type: 'get',
    response: () => ok({ data: menus })
  },
  {
    url: '/register',
    type: 'post',
    response: () => ok({ msg: '注册成功' })
  },
  {
    url: '/unlockscreen',
    type: 'post',
    response: () => ok()
  }
]
