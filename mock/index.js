const user = require('./user')
const system = require('./system')
const monitor = require('./monitor')

const mocks = [
  ...user,
  ...system,
  ...monitor
]

module.exports = {
  mocks
}
