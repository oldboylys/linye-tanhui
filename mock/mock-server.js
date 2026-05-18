const chokidar = require('chokidar')
const bodyParser = require('body-parser')
const chalk = require('chalk')
const path = require('path')

const mockDir = path.join(process.cwd(), 'mock')
const baseApi = process.env.VUE_APP_BASE_API || '/dev-api'

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

/** 未单独 mock 的接口：列表返回空表，其余返回成功 */
function registerFallback(app) {
  app.use(baseApi, (req, res, next) => {
    if (res.headersSent) {
      return next()
    }
    const p = req.path || ''
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

module.exports = app => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))

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
