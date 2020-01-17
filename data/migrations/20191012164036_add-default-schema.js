exports.up = function (knex) {
  return knex.schema
    .raw('CREATE SCHEMA IF NOT EXISTS public')
}

exports.down = function (knex) {
  return knex.schema
    .raw('DROP SCHEMA IF EXISTS public')
}
