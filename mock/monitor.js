const { page, ok } = require('./utils')

module.exports = [
  { url: '/monitor/online/list', type: 'get', response: () => page([], 0) },
  { url: '/monitor/job/list', type: 'get', response: () => page([], 0) },
  { url: '/monitor/jobLog/list', type: 'get', response: () => page([], 0) },
  { url: '/monitor/operlog/list', type: 'get', response: () => page([], 0) },
  { url: '/monitor/logininfor/list', type: 'get', response: () => page([], 0) },
  { url: '/monitor/server', type: 'get', response: () => ok({ data: {} }) },
  { url: '/monitor/cache', type: 'get', response: () => ok({ data: {} }) }
]
