exports.up = function (knex) {
  return knex.schema.withSchema('public')
    .createTable('gift_cards', function (table) {
      table.increments('id').primary()

      table.integer('initial_balance').notNullable().comment('The initial balance, in UK pence, on the gift card')
      table.integer('redeemed_balance').notNullable().default(0).comment('The redeemed balance, in UK pence, on the gift card')

      table.string('code').notNullable().unique().comment('The unique code for the gift card')

      table.string('email').comment('The users email address')

      table.datetime('valid_from', {
        precision: 6
      }).defaultTo(knex.fn.now(6)).comment('Valid (date and time) from this date')

      table.datetime('valid_to', {
        precision: 6
      }).defaultTo(knex.fn.now(6)).comment('Validity expired (date and time) from this date')

      table.timestamps(true, true)
    })
    .raw(`
      ALTER TABLE gift_cards
      ADD COLUMN available_balance integer GENERATED ALWAYS AS (
        initial_balance - redeemed_balance
      ) STORED;
    `)
}

exports.down = function (knex) {
  return knex.schema.withSchema('public')
    .dropTableIfExists('gift_cards')
}
