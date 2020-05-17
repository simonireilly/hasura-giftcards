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
  test: config,
  development: config,
  staging: config,
  production: config
}
