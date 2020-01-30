exports.up = function (knex) {
  // 1. Claim with enough available_balance => ok
  // 2. Claim without enough available_balance => no-op / throw

  return knex.raw('')
};

exports.down = function (knex) {
  return knex.raw('')
};
