// Update with your config settings.

const config = {
  client: 'postgresql',
  connection: process.env.DATABASE_URL,
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    tableName: 'knex_migrations',
    directory: './data/migrations'
  }
}

module.exports = {
  test: {
    ...config,
    connection: 'postgres://postgres:admin@postgres:5432/gift_cards_test'
  },
  development: config,
  staging: config,
  production: config
}
