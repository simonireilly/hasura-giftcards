exports.up = function (knex) {
  return knex.schema.withSchema('public')
    .createTable('claims', function (table) {
      table.increments('id').primary()

      table.string('gift_card_code')
        .notNullable()
        .index()
        .references('code').inTable('public.gift_cards')

      table.integer('amount').notNullable().comment('The amount attempting to ring fence for the claim')
      table.uuid('authorisation_code').notNullable().comment('The one time authorisation code for validating and settling the claim')

      table.enu('state', ['allocated', 'validated', 'settled', 'rejected'], {
          useNative: true,
          enumName: 'claim_state'
        })
        .defaultTo('allocated')
        .comment('States in which the claim can be for the gift card')

      table.timestamps(true, true)
    })
}

exports.down = function (knex) {
  return knex.schema.withSchema('public')
    .dropTableIfExists('claims')
    .raw('DROP TYPE claim_state;')
}
