const config = require('../knexfile').test
const knex = require('knex')(config)

module.exports = {
  truncate: async () => (
    knex.raw('truncate table gift_cards cascade;')
  ),
  migrate: async () => knex.migrate.latest(),
  close: async () => knex.destroy()
}
