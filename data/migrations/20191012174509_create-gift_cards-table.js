exports.up = function (knex) {
  return knex.schema.withSchema('public')
    .createTable('gift_cards', function (table) {
      table.increments('id').primary()
      table.string('account_reference').notNullable().comment('The account reference that owns the gift card')

      // Money fields
      // We will not be storing the initial balance any longer, we will have a create card function that
      // the organisation can call
      table.integer('initial_balance').notNullable().comment('The initial balance, in UK pence, on the gift card')
      // The redeemed balance is just the sum of settled claims, we will move this off the card and on to a view
      table.integer('redeemed_balance').notNullable().default(0).comment('The redeemed balance, in UK pence, on the gift card')

      // Gift card codes
      // One code is for using to purchase
      // The second is a verification code that is also required
      table.string('code').notNullable().unique().comment('The unique code for the gift card')
      table.string('verification_code').defaultTo(knex.raw('generate_verification_code(100, 999)')).notNullable().comment('The unique code for the gift card')

      // User fields
      // We just need an email in the event of contact, it won't be used by the stores
      table.string('email').comment('The users email address')

      // Validity fields
      // We need to trigger a validity check on the gift card before we insert a claim
      table.datetime('valid_from', {
        precision: 6
      }).defaultTo(knex.fn.now(6)).comment('Valid (date and time) from this date')
      table.datetime('valid_to', {
        precision: 6
      }).defaultTo(knex.fn.now(6)).comment('Validity expired (date and time) from this date')

      table.timestamps(true, true)
    })
}

exports.down = function (knex) {
  return knex.schema.withSchema('public')
    .dropTableIfExists('gift_cards')
}
