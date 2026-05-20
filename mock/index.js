const user = require('./user')
const system = require('./system')
const monitor = require('./monitor')
const carbon = require('./carbon')

const mocks = [
  ...user,
  ...carbon,
  ...system,
  ...monitor
]

module.exports = {
  mocks
}
