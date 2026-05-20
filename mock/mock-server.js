const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const path = require('path')
const auth = require('./handlers/auth')

const mockDir = path.join(process.cwd(), 'mock')
const baseApi = (process.env.VUE_APP_BASE_API || '/dev-api').trim()

/** 认证相关接口（避免被 fallback 误拦截） */
const AUTH_PATHS = {
  'GET:/getInfo': req => auth.getInfo(req),
  'GET:/getRouters': () => auth.getRouters(),
  'GET:/captchaImage': () => auth.captchaImage(),
  'POST:/login': req => auth.login(req),
  'POST:/logout': () => auth.logout()
}

function unregisterRoutes() {
  Object.keys(require.cache).forEach(key => {
    if (key.includes(mockDir)) {
      delete require.cache[require.resolve(key)]
    }
  })
}

function responseFake(url, type, respond) {
  return {
    url: baseApi + url,
    type: type || 'get',
    response(req, res) {
      const result = typeof respond === 'function' ? respond(req, res) : respond
      res.json(result)
    }
  }
}

function registerRoutes(app) {
  const { mocks } = require('./index.js')
  const mocksForServer = mocks.map(route => responseFake(route.url, route.type, route.response))
  let mockLastIndex
  mocksForServer.forEach(mock => {
    app[mock.type](mock.url, mock.response)
    mockLastIndex = app._router.stack.length
  })
  const mockRoutesLength = mocksForServer.length
  const mockRoutesStartIndex = mockLastIndex - mockRoutesLength
  return { mockRoutesStartIndex, mockRoutesLength }
}

function normalizePath(req) {
  let p = req.path || req.url || req.originalUrl || ''
  p = p.split('?')[0]
  if (p.startsWith(baseApi)) {
    p = p.slice(baseApi.length)
  }
  if (!p.startsWith('/')) {
    p = '/' + p
  }
  return p.replace(/\/$/, '') || '/'
}

function registerFallback(app) {
  app.use(baseApi, (req, res) => {
    const p = normalizePath(req)
    const authKey = `${req.method}:${p}`
    if (AUTH_PATHS[authKey]) {
      return res.json(AUTH_PATHS[authKey](req))
    }
    if (req.method === 'GET' && (p.endsWith('/list') || p.includes('/list?'))) {
      return res.json({ code: 200, msg: '查询成功', rows: [], total: 0 })
    }
    if (req.method === 'GET' && (p.includes('/treeselect') || p.includes('/deptTree') || p.includes('Tree'))) {
      return res.json({ code: 200, msg: '操作成功', data: [] })
    }
    if (req.method === 'GET') {
      return res.json({ code: 200, msg: '操作成功', data: null })
    }
    return res.json({ code: 200, msg: '操作成功' })
  })
}

function registerAuthRoutes(app) {
  const routes = [
    ['get', '/captchaImage', () => auth.captchaImage()],
    ['get', '/getInfo', req => auth.getInfo(req)],
    ['get', '/getRouters', () => auth.getRouters()],
    ['post', '/login', req => auth.login(req)],
    ['post', '/logout', () => auth.logout()]
  ]
  routes.forEach(([method, path, handler]) => {
    app[method](baseApi + path, (req, res) => res.json(handler(req)))
  })
}

module.exports = app => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

  registerAuthRoutes(app)
  let mockRoutes = registerRoutes(app)
  registerFallback(app)

  chokidar.watch(mockDir, {
    ignored: /mock-server/,
    ignoreInitial: true
  }).on('all', (event, filePath) => {
    if (event === 'change' || event === 'add') {
      try {
        app._router.stack.splice(mockRoutes.mockRoutesStartIndex, mockRoutes.mockRoutesLength)
        unregisterRoutes()
        mockRoutes = registerRoutes(app)
        console.log(chalk.magentaBright(`\n > Mock Server hot reload: ${filePath}`))
      } catch (error) {
        console.log(chalk.redBright(error))
      }
    }
  })

  console.log(chalk.cyanBright(`\n > Mock Server running at ${baseApi}\n`))
}
